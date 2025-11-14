import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.session) {
      return NextResponse.json({ authenticated: false, session: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      session: data.session,
      user: data.session.user,
    });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
