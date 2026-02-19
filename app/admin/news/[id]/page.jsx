"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import { deleteFile } from "@/lib/storage";
import AdminContainer from "../../components/AdminContainer";
import ImageUpload from "../../../components/ImageUpload";
import CTAButton from "../../../components/CTAButton";

const supabase = createClientComponentClient();

export default function EditNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).single();
      if (error) return alert(error.message);
      setNews(data);
    };
    load();
  }, [session, id]);

  // sync fetched news into local form state
  useEffect(() => {
    if (news) setForm(news);
  }, [news]);

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const saveChanges = async () => {
    setLoading(true);
    try {
      await supabase.from("news").update({ ...form, updated_at: new Date().toISOString() }).eq("id", id);
      router.push("/admin/news");
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this news?")) return;
    if (form?.image) await deleteFile("news", form.image);
    await supabase.from("news").delete().eq("id", id);
    router.push("/admin/news");
  };

  const togglePublished = async () => {
    await supabase.from("news").update({ published: !form.published }).eq("id", id);
    setForm((f) => ({ ...f, published: !f.published }));
    setNews((n) => ({ ...n, published: !n.published }));
  };

  if (!session || !news || !form) return <p>Loading…</p>;

  return (
    <AdminContainer>
      <h2>Edit News</h2>

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
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={togglePublished}
              className={`px-2 py-1 rounded ${form.published ? "bg-green-500" : "bg-gray-400"} text-white`}
            >
              {form.published ? "Published" : "Draft"}
            </button>
            <button onClick={handleDelete} className="px-2 py-1 rounded bg-red-600 text-white">
              Delete
            </button>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Date</div>
              <input type="date" value={form.date || ""} onChange={(e) => updateField("date", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Title</div>
              <input type="text" value={form.title || ""} onChange={(e) => updateField("title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Summary</div>
              <textarea value={form.summary || ""} onChange={(e) => updateField("summary", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Content</div>
              <textarea value={form.content || ""} onChange={(e) => updateField("content", e.target.value)} style={{ width: "100%", minHeight: 160, padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Image</div>
              <ImageUpload label="News Image" value={form.image} onChange={(url) => updateField("image", url)} folder="news" previewHeight={300} />
            </label>
          </div>
        </div>
      </section>

      <CTAButton
        onClick={saveChanges}
        disabled={loading}
        type="button"
        variant="secondary"
        style={{ marginTop: 10 }}
      >
        {loading ? "Saving…" : "Save Changes"}
      </CTAButton>
    </AdminContainer>
  );
}
