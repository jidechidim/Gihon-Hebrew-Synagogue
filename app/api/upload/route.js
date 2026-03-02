import path from "node:path";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { supabaseTimeoutFetch } from "@lib/supabase/timeout-fetch";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "uploads";

// Keep your sanitizers (they are good)
const SAFE_SEGMENT_REGEX = /[^a-z0-9-_]/gi;
const SAFE_BASENAME_REGEX = /[^a-z0-9-_]/gi;
const SAFE_EXTENSION_REGEX = /[^a-z0-9]/gi;

function sanitizeSegment(value, fallback = "general") {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(SAFE_SEGMENT_REGEX, "");
  return cleaned || fallback;
}

function sanitizeBaseName(value, fallback = "image") {
  const cleaned = String(value || "")
    .trim()
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(SAFE_BASENAME_REGEX, "");
  return cleaned || fallback;
}

function sanitizeExtension(value, fallback = ".jpg") {
  const ext = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "")
    .replace(SAFE_EXTENSION_REGEX, "");
  if (!ext) return fallback;
  return `.${ext}`;
}

function fileNameFromPathLike(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed = trimmed.startsWith("http")
      ? new URL(trimmed)
      : new URL(trimmed, "http://localhost");
    const fileName = path.posix.basename(parsed.pathname || "");
    return fileName || null;
  } catch {
    return null;
  }
}

function buildTargetFileName({ file, currentUrl, fileName }) {
  const uploadedExt = sanitizeExtension(path.extname(file?.name || ""), ".jpg");

  const explicitFileName = fileNameFromPathLike(fileName);
  if (explicitFileName) {
    const parsed = path.parse(explicitFileName);
    return `${sanitizeBaseName(parsed.name)}${uploadedExt}`;
  }

  const existingFileName = fileNameFromPathLike(currentUrl);
  if (existingFileName) {
    const parsed = path.parse(existingFileName);
    return `${sanitizeBaseName(parsed.name)}${uploadedExt}`;
  }

  const original = path.parse(file?.name || "");
  const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${sanitizeBaseName(original.name)}-${uniquePart}${uploadedExt}`;
}

function getObjectPathFromPublicUrl(url) {
  // Works for: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  if (!url || typeof url !== "string") return null;

  try {
    const u = new URL(url, "http://localhost");
    const parts = u.pathname.split("/").filter(Boolean);

    // pathname: storage/v1/object/public/<bucket>/<...path>
    const publicIndex = parts.indexOf("public");
    if (publicIndex === -1) return null;

    const bucket = parts[publicIndex + 1];
    if (bucket !== BUCKET) return null;

    const objectParts = parts.slice(publicIndex + 2);
    const objectPath = objectParts.join("/");
    return objectPath || null;
  } catch {
    return null;
  }
}

async function requireSession() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  // Safe verification: log JWT role without exposing the key
  try {
    const part = key.split(".")[1];
    const payload = JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
    console.log("[upload] jwt role:", payload?.role);
    console.log("[upload] jwt issuer:", payload?.iss);
  } catch {
    console.log("[upload] jwt role: (unable to decode)");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: supabaseTimeoutFetch },
  });
}

export async function POST(request) {
  try {
    const session = await requireSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = sanitizeSegment(formData.get("folder"), "general");
    const currentUrl = formData.get("currentUrl");
    const fileName = formData.get("fileName");

    if (!file || typeof file.arrayBuffer !== "function") {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const MAX_MB = 10;
    const bytes = await file.arrayBuffer();

    if (bytes.byteLength > MAX_MB * 1024 * 1024) {
      return new Response(JSON.stringify({ error: `File too large (max ${MAX_MB}MB)` }), {
        status: 413,
      });
    }

    const contentType = file.type || "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "Only image uploads are allowed" }), {
        status: 415,
      });
    }

    const nextFileName = buildTargetFileName({ file, currentUrl, fileName });
    const objectPath = `${folder}/${nextFileName}`;

    console.log("[upload] user:", session.user.id);
    console.log("[upload] bucket:", BUCKET);
    console.log("[upload] objectPath:", objectPath);
    console.log("[upload] contentType:", contentType);
    console.log("[upload] bytes:", bytes.byteLength);

    const admin = supabaseAdmin();

    // Uncomment if you want to verify bucket existence:
    // const { data: buckets, error: bucketsErr } = await admin.storage.listBuckets();
    // console.log("[upload] buckets:", buckets?.map((b) => b.name));
    // console.log("[upload] bucketsErr:", bucketsErr);

    // Optional: remove old file if currentUrl points to this bucket
    const oldObjectPath = getObjectPathFromPublicUrl(currentUrl);
    if (oldObjectPath && oldObjectPath !== objectPath) {
      const { error: removeErr } = await admin.storage.from(BUCKET).remove([oldObjectPath]);
      if (removeErr) console.warn("[upload] remove warning:", removeErr);
    }

    const { data: uploaded, error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(objectPath, Buffer.from(bytes), {
        upsert: true,
        contentType,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[upload] uploadError FULL:", uploadError);
      return new Response(
        JSON.stringify({
          error: uploadError.message,
          details: uploadError,
          bucket: BUCKET,
          path: objectPath,
        }),
        { status: 500 }
      );
    }

    console.log("[upload] uploaded:", uploaded);

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(objectPath);

    return new Response(JSON.stringify({ url: pub.publicUrl, path: objectPath }), {
      status: 200,
    });
  } catch (error) {
    console.error("[upload] route crash:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}