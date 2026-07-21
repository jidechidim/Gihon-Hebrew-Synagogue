"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SITE_NAME = "Gihon Hebrew Synagogue";

function getPageTitle(pathname: string) {
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

  return (
    routeLabels[firstSegment] ||
    firstSegment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export default function FrontendLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const title = getPageTitle(pathname || "/");
    document.title = `${SITE_NAME} | ${title}`;
  }, [pathname]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}