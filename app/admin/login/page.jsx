"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Skip login if already signed in
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/admin/home");
    }
    checkSession();
  }, [router, supabase]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Redirect immediately after successful login
      router.replace("/admin/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 20 }}>Gihon Hebrew Synagogue Admin Login</h2>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 14, width: "100%", padding: 10, background: "#000", color: "#fff", borderRadius: 6, cursor: loading ? "wait" : "pointer", border: "none" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
