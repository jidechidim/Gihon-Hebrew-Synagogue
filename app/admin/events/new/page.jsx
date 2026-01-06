"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("events")
      .insert([{ title, date }]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/events");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 500 }}>
      <h2>Add New Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Saving..." : "Create Event"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
