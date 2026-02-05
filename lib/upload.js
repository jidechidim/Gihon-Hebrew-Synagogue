import { supabase } from "./supabase/client";

export async function uploadImage(file, folder = "uploads") {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("cms") // bucket name
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("cms")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
