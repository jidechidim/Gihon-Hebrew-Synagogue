"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("news")
      .insert([{ title, content }]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/news");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 600 }}>
      <h2>Add News</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Headline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="News content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Publishing..." : "Publish News"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
