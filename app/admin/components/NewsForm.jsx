"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/storage";

export default function NewsForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState(initialData);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadFile(file, "news", "images");
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="grid gap-4 max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="border rounded px-2 py-1"
      />
      <textarea
        name="summary"
        placeholder="Summary"
        value={form.summary}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />
      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />
      <label className="flex flex-col">
        Image Upload
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 w-full h-40 object-cover rounded"
          />
        )}
      </label>
      <button
        type="submit"
        disabled={loading || uploading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
