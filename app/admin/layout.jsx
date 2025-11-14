// /app/(admin)/layout.jsx
"use client";

import "../globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, createContext } from "react";

export const SessionContext = createContext(null);

function AdminLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;

        setSession(data.session);
        setLoading(false);

        if (!data.session && pathname.startsWith("/admin") && pathname !== "/admin/login") {
          router.replace("/admin/login");
          return;
        }

        if (data.session && pathname === "/admin/login") {
          router.replace("/admin/home");
          return;
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setLoading(false);
      }
    }

    checkSession();
    return () => { active = false };
  }, [pathname, router, supabase]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, fontFamily: "sans-serif" }}>
        <p>Checking access…</p>
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const showNav = session && pathname !== "/admin/login";

  return (
    <SessionContext.Provider value={session}>
      {showNav && (
        <nav style={{ background: "#111", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/admin/home" style={{ color: "#fff" }}>Home</Link>
            <Link href="/admin/about" style={{ color: "#fff" }}>About</Link>
            <Link href="/admin/leadership" style={{ color: "#fff" }}>Leadership</Link>
            <Link href="/admin/contact" style={{ color: "#fff" }}>Contact</Link>
          </div>

          <button
            onClick={handleLogout}
            style={{ background: "#e33", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Logout
          </button>
        </nav>
      )}

      <main style={{ padding: "0px" }}>{children}</main>
    </SessionContext.Provider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Gihon Hebrew Synagogue Admin</title>
        <link rel="icon" type="image/png" href="/assets/logo.png" />
      </head>
      <body>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </body>
    </html>
  );
}
