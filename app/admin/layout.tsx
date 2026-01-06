"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export const SessionContext = createContext(null);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      setSession(data.session);
      setLoading(false);

      if (!data.session && pathname !== "/admin/login") router.replace("/admin/login");
      if (data.session && pathname === "/admin/login") router.replace("/admin/home");
    }

    checkSession();
    return () => { active = false };
  }, [pathname, router, supabase]);

  if (loading) return <p style={{ padding: 40 }}>Checking access…</p>;

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const showNav = session && pathname !== "/admin/login";

  return (
    <SessionContext.Provider value={session}>
      {showNav && (
        <nav style={{ background: "#111", color: "#fff", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/admin/home">Home</Link>
            <Link href="/admin/about">About</Link>
            <Link href="/admin/events">Events</Link>
            <Link href="/admin/news">News</Link>
            <Link href="/admin/leadership">Leadership</Link>
            <Link href="/admin/contact">Contact</Link>
          </div>
          <button onClick={logout} style={{ background: "#e33", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
            Logout
          </button>
        </nav>
      )}
      <main>{children}</main>
    </SessionContext.Provider>
  );
}
