// /app/(frontend)/layout.jsx
"use client"; // if you need client features like hooks

import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// REMOVE metadata export here
export default function FrontendLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
