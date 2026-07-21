"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SITE_NAME = "Gihon Hebrew Synagogue";

function getPageTitle(pathname: string, searchParams: URLSearchParams) {
  const cleanPath = pathname || "/";

  if (cleanPath === "/") return "Home";

  const routeLabels: Record<string, string> = {
    about: "About Us",
    calendar: "Calendar",
    donate: "Donate",
    events: "Events",
    gallery: "Gallery",
    getinvolved: "Get Involved",
    leadership: "Leadership",
    news: "News",
    newsarticle: "News Article",
    parshiyot: "Parshiyot",
    register: "Register",
  };

  const firstSegment = cleanPath.split("/").filter(Boolean)[0];
  if (!firstSegment) return "Home";

  if (firstSegment === "newsarticle") {
    const slug = searchParams.get("slug");
    return slug ? "News Article" : "News Article";
  }

  return routeLabels[firstSegment] || firstSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const title = getPageTitle(pathname || "/", searchParams || new URLSearchParams());
    document.title = `${SITE_NAME} | ${title}`;
  }, [pathname, searchParams]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
