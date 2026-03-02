// /lib/storage.js
import { supabase } from "./supabase/client";

/**
 * Upload a file to Supabase Storage
 * @param {File} file
 * @param {string} folder
 * @param {string} bucket
 * @returns {Promise<string>} public URL
 */
export async function uploadFile(file, bucket = "uploads", folder = "uploads") {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket
 * @param {string} publicUrl
 */
export async function deleteFile(bucket = "uploads", publicUrl) {
  if (!publicUrl) return;
  if (typeof publicUrl !== "string") return;
  if (publicUrl.startsWith("/assets/")) return;
  if (!publicUrl.includes("/storage/v1/object/public/")) return;

  const marker = "/storage/v1/object/public/";
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const objectRef = publicUrl.slice(markerIndex + marker.length);
  const [detectedBucket, ...pathParts] = objectRef.split("/").filter(Boolean);
  const objectPath = pathParts.join("/");

  if (!detectedBucket || !objectPath) return;

  const targetBucket = detectedBucket || bucket;

  const { error } = await supabase.storage.from(targetBucket).remove([objectPath]);
  if (error) console.error("Failed to delete file:", error);
}
