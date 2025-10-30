"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("auth", "true");
      router.push("/admin/home");
    } else {
      alert("Incorrect password");
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400 }}>
      <h3>Admin Login</h3>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />
      <button type="submit">Login</button>
    </form>
  );
}
