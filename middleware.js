import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = req.nextUrl.pathname.startsWith("/admin/login");

  if (!user && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (user && isLogin) return NextResponse.redirect(new URL("/home", req.url));

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
