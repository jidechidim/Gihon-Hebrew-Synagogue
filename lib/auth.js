import { createClient } from "@supabase/supabase-js";

export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

export async function requireAdmin(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  const supabase = supabaseServer();

  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) return null;

  // check admin role stored in user metadata
  if (user.user_metadata?.role !== "admin") return null;

  return user;
}
