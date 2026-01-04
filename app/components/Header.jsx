"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close the menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const isHome = pathname === "/";
  const solidHeader = !isHome || scrolled;

  return (
    <header
      id="siteHeader"
      className={`site-header ${solidHeader ? "scrolled" : ""}`}
      data-solid={solidHeader ? "true" : "false"}
    >
      <div className="container nav-wrap">
        {/* Hamburger */}
        <button
          ref={buttonRef}
          id="hamburger"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobileNav"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          {menuOpen ? (
            // Close Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger Icon
            <>
              <span></span>
              <span></span>
              <span></span>
            </>
          )}
        </button>

        {/* Brand */}
        <Link href="/" className="brand" aria-label="Gihon Hebrew Synagogue Home">
          <Image
            src="/assets/logo.png"
            alt="Gihon Hebrew Synagogue logo"
            width={50}
            height={50}
          />
          <span className="brand-text">Gihon Hebrew Synagogue</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/getinvolved">Get Involved</Link></li>
            <li><Link href="/parshiyot">Parshiyot</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/news">News & Media</Link></li>
          </ul>
        </nav>

        {/* Donate */}
        <a
          href="https://flutterwave.com/pay/YOUR-UNIQUE-ID"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-donate"
        >
          Donate
        </a>
      </div>

      {/* Mobile Drawer */}
      <nav
        ref={menuRef}
        id="mobileNav"
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-label="Mobile"
      >
        <Link
          href="/"
          className="brand"
          aria-label="Gihon Hebrew Synagogue Home"
          onClick={closeMenu}
        >
          <Image
            src="/assets/logo.png"
            alt="Gihon Hebrew Synagogue logo"
            width={50}
            height={50}
          />
          <span className="brand-text">Gihon Hebrew Synagogue</span>
        </Link>

        <ul>
          <li><Link href="/" onClick={closeMenu}>Home</Link></li>
          <li><Link href="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link href="/getinvolved" onClick={closeMenu}>Get Involved</Link></li>
          <li><Link href="/parshiyot" onClick={closeMenu}>Parshiyot</Link></li>
          <li><Link href="/events" onClick={closeMenu}>Events</Link></li>
          <li><Link href="/news" onClick={closeMenu}>News & Media</Link></li>
          <li className="drawer-cta">
            <a
              href="https://flutterwave.com/pay/YOUR-UNIQUE-ID"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-donate"
              onClick={closeMenu}
            >
              Donate
            </a>
          </li>
        </ul>
      </nav>

      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${menuOpen ? "visible" : ""}`}
        id="drawerBackdrop"
        aria-hidden={!menuOpen}
      ></div>
    </header>
  );
}
