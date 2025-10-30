"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const authed = localStorage.getItem("auth") === "true";
    if (!authed) router.push("/admin/login");
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Gihon CMS</h2>
      {children}
    </div>
  );
}
