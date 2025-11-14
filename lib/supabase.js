import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function loadContent(pageId) {
  const { data, error } = await supabase
    .from("cms_content")
    .select("data")
    .eq("id", pageId)
    .single();

  if (error) throw error;
  return data?.data || {};
}

export async function saveContent(pageId, updatedData) {
  const { error } = await supabase
    .from("cms_content")
    .upsert({ id: pageId, data: updatedData });

  if (error) throw error;
  return true;
}
