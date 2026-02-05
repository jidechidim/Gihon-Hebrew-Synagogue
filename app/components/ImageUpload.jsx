"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ImageUpload({ label, value, onChange, folder = "general", previewHeight = 180 }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("uploads") // ✅ your bucket
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("❌ Upload failed");
      console.error(error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    onChange(data.publicUrl);
    setUploading(false);
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
