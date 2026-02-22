import { createClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";

function getSupabaseClient(client) {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, anonKey);
}

export async function uploadImage(file, folder = "uploads", options = {}) {
  if (!file) return null;

  const bucket = options.bucket || DEFAULT_BUCKET;
  const supabase = getSupabaseClient(options.supabase);

  const fileExt = file.name?.split(".").pop() || "bin";
  const safeFolder = folder || "uploads";
  const fileName = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    upsert: true,
  });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(error.message || "Upload failed");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data?.publicUrl || null;
}
