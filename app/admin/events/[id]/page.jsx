"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function EventPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const session = useContext(SessionContext);

  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchEvent = async () => {
      try {
        const { data: event, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (event) {
          setData({
            title: event.title || "",
            description: event.description || "",
            date: event.date || "",
            image: event.image || "",
          });
        }
      } catch (err) {
        console.error(err);
        alert("Error loading event: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, session]);

  if (!session) return <p>Checking access…</p>;
  if (loading) return <p>Loading event…</p>;

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    try {
      const { error } = await supabase.storage
        .from("events-images")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("events-images")
        .getPublicUrl(fileName);

      setData({ ...data, image: urlData.publicUrl });
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("events")
        .update(data)
        .eq("id", id);

      if (error) throw error;

      alert("Event updated!");
      router.push("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Error saving event: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={saveEvent} className="flex flex-col gap-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          />
          {uploading && <p>Uploading image…</p>}
          {data.image && (
            <img
              src={data.image}
              alt="Event image"
              className="w-48 mt-2 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Event
        </button>
      </form>
    </div>
  );
}
