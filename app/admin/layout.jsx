"use client";

import { createContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";

export const SessionContext = createContext(null);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const adminLinks = [
    { href: "/admin/home", label: "Home" },
    { href: "/admin/about", label: "About" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/news", label: "News" },
    { href: "/admin/leadership", label: "Leadership" },
    { href: "/admin/contact", label: "Contact" },
  ];

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
    return () => {
      active = false;
    };
  }, [pathname, router, supabase]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const showNav = Boolean(session) && pathname !== "/admin/login";
  const solidHeader = true;

  return (
    <SessionContext.Provider value={session}>
      <div className="admin-shell">
        {showNav && (
          <header
            className={`site-header admin-header ${solidHeader ? "scrolled" : ""} relative z-50 bg-white border-b border-gray-200`}
          >
            <div className="container mx-auto flex justify-between items-center px-4 py-3 nav-wrap">
              <Link
                href="/admin/home"
                className="flex items-center gap-2 font-semibold text-lg brand"
                aria-label="Admin Home"
              >
                <Image src="/assets/logo.png" alt="Logo" width={50} height={50} />
                <span className="brand-text" style={{ fontWeight: 700 }}>Admin Panel</span>
              </Link>

              <nav className="hidden md:block desktop-nav" aria-label="Admin">
                <ul>
                  {adminLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <button
                onClick={logout}
                className="hidden md:inline-flex logout-desktop btn btn-primary--red"
              >
                Logout
              </button>

              <button
                ref={buttonRef}
                className="md:hidden text-gray-700 focus:outline-none hamburger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobileNav"
              >
                {menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <>
                    <span className="block w-6 h-[2px] bg-gray-700 my-[3px]"></span>
                    <span className="block w-6 h-[2px] bg-gray-700 my-[3px]"></span>
                    <span className="block w-6 h-[2px] bg-gray-700 my-[3px]"></span>
                  </>
                )}
              </button>
            </div>

            <nav
              ref={menuRef}
              id="mobileNav"
              className={`mobile-drawer ${menuOpen ? "open" : ""} fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 md:hidden`}
            >
              <div className="mt-8 px-4">
                <ul>
                  {adminLinks.map((link) => (
                    <li key={link.href} className="mb-2">
                      <Link href={link.href} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="drawer-cta mt-4">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="btn btn-primary--red w-full text-center"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>

            <div
              className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity md:hidden z-30 drawer-backdrop ${
                menuOpen ? "show" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            ></div>
          </header>
        )}

        {loading && <p className="p-10">Checking access...</p>}

        <main className={`admin-page ${showNav ? "admin-page-with-nav" : ""}`.trim()}>
          {children}
        </main>

        <footer className="site-footer" id="donate">
          <div className="container footer-grid">
            <div className="foot-brand">
              <div className="logo-badge">
                <Image src="/assets/logo.png" alt="Gihon logo" width={64} height={64} />
              </div>
              <p>Promoting Judaic life in Nigeria</p>
            </div>
          </div>

          <div className="container footer-bottom">
            <small>&copy; {new Date().getFullYear()} Gihon Hebrew Synagogue. All rights reserved.</small>
          </div>
        </footer>
      </div>
    </SessionContext.Provider>
  );
}
