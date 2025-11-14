"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export default function NewsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState({
    title: "",
    content: "",
    date: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch news item
  useEffect(() => {
    async function fetchNews() {
      const { data: newsItem, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error loading news: " + error.message);
      } else {
        setData({
          title: newsItem.title,
          content: newsItem.content,
          date: newsItem.date,
          image: newsItem.image || "",
        });
      }
      setLoading(false);
    }

    fetchNews();
  }, [id]);

  // Upload image to Supabase Storage
  async function uploadImage(file) {
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("news-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { publicUrl } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath)
      .data;

    setData({ ...data, image: publicUrl });
    setUploading(false);
  }

  // Update news in Supabase
  async function saveNews(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("news")
      .update(data)
      .eq("id", id);

    if (error) {
      alert("Error saving news: " + error.message);
    } else {
      alert("News updated!");
      router.push("/admin/news");
    }
  }

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit News</h1>
      <form onSubmit={saveNews} className="flex flex-col gap-4">
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
          <label className="block font-semibold">Content</label>
          <textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
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
              alt="News image"
              className="w-48 mt-2 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Save News
        </button>
      </form>
    </div>
  );
}
