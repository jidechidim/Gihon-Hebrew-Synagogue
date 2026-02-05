"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import ImageUpload from "../../../components/ImageUpload";
import AdminContainer from "../../components/AdminContainer";

const supabase = createClientComponentClient();

const EMPTY_NEWS = { title: "", date: "", summary: "", content: "", image: "" };

export default function NewNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_NEWS);

  if (!session) return <p>Checking access…</p>;

  const createNews = async () => {
    setLoading(true);
    const payload = { ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("news").insert([payload]);
    setLoading(false);
    if (error) { alert(error.message); return; }
    router.push("/admin/news");
  };

  const updateField = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  return (
    <AdminContainer>
      <h2>New News</h2>

      <section
        style={{
          border: "1px solid #ccc",
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h3 style={{ width: "100%" }}>News Item</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Date</label>
          <input type="date" style={{ width: "100%" }} value={form.date} onChange={(e) => updateField("date", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input type="text" style={{ width: "100%" }} value={form.title} onChange={(e) => updateField("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Summary</label>
          <textarea style={{ width: "100%" }} value={form.summary} onChange={(e) => updateField("summary", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Content</label>
          <textarea style={{ width: "100%", minHeight: 160 }} value={form.content} onChange={(e) => updateField("content", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload label="Image" value={form.image} onChange={(url) => updateField("image", url)} folder="news" />
        </div>
      </section>

      <button onClick={createNews} disabled={loading} className="btn btn-outline" style={{ marginTop: 10 }}>
        {loading ? "Creating…" : "Create News"}
      </button>
    </AdminContainer>
  );
}
