// Reuse the existing client
import { supabase as client } from "./client";

/**
 * Load CMS content by page ID
 * @param {string} pageId
 * @returns {Promise<object>}
 */
export async function loadContent(pageId) {
  const { data, error } = await client
    .from("cms_content")
    .select("data")
    .eq("id", pageId)
    .single();

  if (error) throw error;
  return data?.data || {};
}

/**
 * Save/update CMS content by page ID
 * @param {string} pageId
 * @param {object} updatedData
 * @returns {Promise<boolean>}
 */
export async function saveContent(pageId, updatedData) {
  const { error } = await client
    .from("cms_content")
    .upsert({ id: pageId, data: updatedData });

  if (error) throw error;
  return true;
}
