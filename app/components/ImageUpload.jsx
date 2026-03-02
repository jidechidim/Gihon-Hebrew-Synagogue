"use client";
import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function ImageUpload({
  label,
  value,
  onChange,
  folder = "general",
  fileName,
  previewHeight = 180,
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const publicUrl = await uploadImage(file, folder, {
        currentUrl: value,
        fileName,
      });
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

      {uploading && <p>Uploading...</p>}
    </div>
  );
}
