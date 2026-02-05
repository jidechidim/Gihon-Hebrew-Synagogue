// /lib/auth.js
import { supabaseServer } from "./supabase/server";

/**
 * Require an admin user from a request
 * Returns user object if admin, otherwise null
 */
export async function requireAdmin(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const { data: { user }, error } = await supabaseServer.auth.getUser(token);
  if (error || !user) return null;

  if (user.user_metadata?.role !== "admin") return null;
  return user;
}
