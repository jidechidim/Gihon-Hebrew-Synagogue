"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";

const supabase = createClientComponentClient();

export default function NewNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [form, setForm] = useState({
    date: "",
    title: "",
    content: "",
    summary: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  if (!session) return <p>Checking access…</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("news").insert([
        {
          ...form,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      router.push("/admin/news");
    } catch (err) {
      console.error("Failed to create news:", err.message);
      alert("Error creating news: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create News Article</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: 500 }}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create News"}</button>
      </form>
    </div>
  );
}
