"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../layout";

const supabase = createClientComponentClient();

export default function NewEventPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    date: "",
    image: "",
    summary: "",
    location: "",
    register_url: "",
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
      const { data, error } = await supabase.from("events").insert([
        {
          ...form,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      router.push("/admin/events");
    } catch (err) {
      console.error("Failed to create event:", err.message);
      alert("Error creating event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: 500 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="register_url" placeholder="Register URL" value={form.register_url} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create Event"}</button>
      </form>
    </div>
  );
}
