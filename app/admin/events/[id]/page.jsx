"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EventPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error loading event: " + error.message);
      } else {
        setData({
          title: event.title,
          description: event.description,
          date: event.date,
          image: event.image || "",
        });
      }
      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  // Upload image to Supabase Storage
  async function uploadImage(file) {
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("events-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { publicUrl } = supabase.storage
      .from("events-images")
      .getPublicUrl(filePath)
      .data;

    setData({ ...data, image: publicUrl });
    setUploading(false);
  }

  // Update event in Supabase
  async function saveEvent(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("events")
      .update(data)
      .eq("id", id);

    if (error) {
      alert("Error saving event: " + error.message);
    } else {
      alert("Event updated!");
      router.push("/admin/events");
    }
  }

  if (loading) return <p>Loading event...</p>;

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
          {uploading && <p>Uploading image...</p>}
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
