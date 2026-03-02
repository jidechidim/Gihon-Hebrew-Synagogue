"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import { deleteFile } from "@/lib/storage";
import AdminContainer from "../../components/AdminContainer";
import ImageUpload from "../../../components/ImageUpload";
import ContentPreviewModal from "../../components/ContentPreviewModal";

const supabase = createClientComponentClient();

export default function EditNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).single();
      if (error) return alert(error.message);
      setNews(data);
      setForm(data);
      setInitialForm(data);
    };
    load();
  }, [session, id]);

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const saveChanges = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("news")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", id);
    setLoading(false);

    if (error) {
      alert("Update failed: " + error.message);
      return false;
    }

    setInitialForm(form);
    router.push("/admin/news");
    return true;
  };

  const handleDelete = async () => {
    if (!confirm("Delete this news?")) return;
    if (form?.image) await deleteFile("uploads", form.image);
    await supabase.from("news").delete().eq("id", id);
    router.push("/admin/news");
  };

  const togglePublished = async () => {
    await supabase.from("news").update({ published: !form.published }).eq("id", id);
    setForm((f) => ({ ...f, published: !f.published }));
    setNews((n) => ({ ...n, published: !n.published }));
  };

  if (!session || !news || !form) return <p>Loading...</p>;

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

      <ContentPreviewModal
        data={form}
        originalData={initialForm}
        onConfirmSave={saveChanges}
        saving={loading}
        previewLabel="Preview News Changes"
        style={{ marginTop: 10 }}
      />
    </AdminContainer>
  );
}
