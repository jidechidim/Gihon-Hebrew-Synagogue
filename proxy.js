import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export default async function proxy(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl;
  const isLogin = url.pathname.startsWith("/admin/login");

  // Not logged in → kick to login
  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Logged in but on login page → send home
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
