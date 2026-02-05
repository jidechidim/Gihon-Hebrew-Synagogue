"use client";

import type { ReactNode } from "react";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
