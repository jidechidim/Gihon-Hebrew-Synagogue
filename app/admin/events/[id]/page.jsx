"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "@/app/layout";
import EventForm from "@/components/admin/EventForm";
import { deleteFile } from "@/lib/storage";

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
    try {
      await supabase.from("events").update({ ...form, updated_at: new Date().toISOString() }).eq("id", id);
      router.push("/admin/events");
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
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
  };

  if (!session || !event) return <p>Loading…</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2>Edit Event</h2>
      <button
        onClick={togglePublished}
        className={`px-2 py-1 rounded ${event.published ? "bg-green-500" : "bg-gray-400"} text-white`}
      >
        {event.published ? "Published" : "Draft"}
      </button>
      <button
        onClick={handleDelete}
        className="ml-2 px-2 py-1 rounded bg-red-600 text-white"
      >
        Delete
      </button>

      <EventForm initialData={event} onSubmit={updateEvent} loading={loading} />
    </div>
  );
}
