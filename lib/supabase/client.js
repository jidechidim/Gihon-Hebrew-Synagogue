// /app/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Manually paste your public Supabase credentials
const SUPABASE_URL = "https://opekmaxzucoswrbntpli.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZWttYXh6dWNvc3dyYm50cGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTc0NzIsImV4cCI6MjA3NzM5MzQ3Mn0.MwdWLv1mWUEhhYVxdHfTvkopZ3GSFO9c7BSRot5C7cM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
