"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import EventForm from "@/app/admin/components/EventForm";
import AdminContainer from "../../components/AdminContainer";
import ImageUpload from "../../../components/ImageUpload";

const supabase = createClientComponentClient();

const EMPTY_EVENT = {
  title: "",
  date: "",
  summary: "",
  location: "",
  register_url: "",
  image: "",
};

export default function NewEventPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_EVENT);

  if (!session) return <p>Checking access…</p>;

  const createEvent = async () => {
    setLoading(true);
    const payload = { ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("events").insert([payload]);
    setLoading(false);
    if (error) return alert(error.message);
    router.push("/admin/events");
  };

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <AdminContainer>
      <h2>Create Event</h2>

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
        <h3 style={{ width: "100%" }}>Event</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input type="text" style={{ width: "100%" }} value={form.title} onChange={(e) => updateField("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Date</label>
          <input type="date" style={{ width: "100%" }} value={form.date} onChange={(e) => updateField("date", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Summary</label>
          <textarea style={{ width: "100%" }} value={form.summary} onChange={(e) => updateField("summary", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Location</label>
          <input type="text" style={{ width: "100%" }} value={form.location} onChange={(e) => updateField("location", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Register URL</label>
          <input type="text" style={{ width: "100%" }} value={form.register_url} onChange={(e) => updateField("register_url", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload label="Image" value={form.image} onChange={(url) => updateField("image", url)} folder="events" />
        </div>
      </section>

      <button onClick={createEvent} disabled={loading} className="btn btn-outline" style={{ marginTop: 10 }}>
        {loading ? "Creating…" : "Create Event"}
      </button>
    </AdminContainer>
  );
}
