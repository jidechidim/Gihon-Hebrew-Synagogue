"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { uploadImage } from "@/lib/upload";

export default function ImageUpload({ label, value, onChange, folder = "general", previewHeight = 180 }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const publicUrl = await uploadImage(file, folder, { supabase });
      if (publicUrl) onChange(publicUrl);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Upload failed";
      alert(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>

      {value && (
        <img
          src={value}
          alt="Preview"
          style={{
            width: "100%",
            height: previewHeight,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 8,
            border: "1px solid #ddd"
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      <input
        style={{
          width: "100%",
          padding: "6px",
          marginTop: 4,
          border: "1px solid #ccc",
          borderRadius: 6
        }}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or Upload"
      />

      {uploading && <p>Uploading...</p>}
    </div>
  );
}
