// /lib/storage.js
import { supabase } from "./supabaseClient";

/**
 * Upload a file to Supabase Storage
 * @param {File} file
 * @param {string} folder
 * @param {string} bucket
 * @returns {Promise<string>} public URL
 */
export async function uploadFile(file, bucket = "cms", folder = "uploads") {
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
export async function deleteFile(bucket = "cms", publicUrl) {
  if (!publicUrl) return;
  const path = publicUrl.split(`/${bucket}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error("Failed to delete file:", error);
}
