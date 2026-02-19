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

export default function EditEventPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const load = async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
      if (error) return alert(error.message);
      setEvent(data);
    };

    load();
  }, [session, id]);

  const updateEvent = async (form) => {
    setLoading(true);
    await supabase.from("events").update({ ...form, updated_at: new Date().toISOString() }).eq("id", id);
    setLoading(false);
    router.push("/admin/events");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;
    if (event.image) await deleteFile("events", event.image);
    await supabase.from("events").delete().eq("id", id);
    router.push("/admin/events");
  };

  const togglePublished = async () => {
    await supabase.from("events").update({ published: !event.published }).eq("id", id);
    setEvent({ ...event, published: !event.published });
    setForm((f) => ({ ...f, published: !f.published }));
  };

  const [form, setForm] = useState(null);

  // keep local form state in sync with loaded event
  useEffect(() => {
    if (event) setForm(event);
  }, [event]);

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  if (!session || !event || !form) return <p>Loading…</p>;

  return (
    <AdminContainer>
      <h2>Edit Event</h2>

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
              className={`px-2 py-1 rounded text-white ${form.published ? "bg-green-600" : "bg-gray-400"}`}
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
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Title</div>
              <input type="text" value={form.title || ""} onChange={(e) => updateField("title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Date</div>
              <input type="date" value={form.date || ""} onChange={(e) => updateField("date", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Summary</div>
              <textarea value={form.summary || ""} onChange={(e) => updateField("summary", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Location</div>
              <input type="text" value={form.location || ""} onChange={(e) => updateField("location", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Register URL</div>
              <input type="text" value={form.register_url || ""} onChange={(e) => updateField("register_url", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Image</div>
              <ImageUpload label="Event Image" value={form.image} onChange={(url) => updateField("image", url)} folder="events" previewHeight={300} />
            </label>
          </div>
        </div>
      </section>

      <CTAButton
        onClick={() => updateEvent(form)}
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
