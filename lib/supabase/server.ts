import { createClient } from "@supabase/supabase-js";
import { supabaseTimeoutFetch } from "./timeout-fetch";

export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: supabaseTimeoutFetch,
      },
    }
  );
