"use client";
import { useState, useEffect } from "react";

export default function HomeAdmin() {
  const [data, setData] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    const res = await fetch("/admin/api/home");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveData() {
    await fetch("/admin/api/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("✅ Saved!");
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/admin/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setData({ ...data, hero: { ...data.hero, image: json.url } });
    setUploading(false);
  }

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h3>Home Page Editor</h3>

      <h4>Hero Section</h4>
      <input
        value={data.hero.title}
        onChange={(e) =>
          setData({ ...data, hero: { ...data.hero, title: e.target.value } })
        }
        placeholder="Hero Title"
      />
      <input
        value={data.hero.subtitle}
        onChange={(e) =>
          setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
        }
        placeholder="Hero Subtitle"
      />
      <input
        value={data.hero.cta_text}
        onChange={(e) =>
          setData({ ...data, hero: { ...data.hero, cta_text: e.target.value } })
        }
        placeholder="CTA Text"
      />
      <input
        value={data.hero.cta_link}
        onChange={(e) =>
          setData({ ...data, hero: { ...data.hero, cta_link: e.target.value } })
        }
        placeholder="CTA Link"
      />

      {/* File Upload */}
      <div style={{ marginTop: 10 }}>
        <label>Hero Image: </label>
        <input type="file" onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}
        {data.hero.image && (
          <div style={{ marginTop: 10 }}>
            <img src={data.hero.image} alt="Hero Preview" style={{ maxWidth: 300 }} />
          </div>
        )}
      </div>

      <button onClick={saveData} style={{ marginTop: 20 }}>
        Save Changes
      </button>
    </div>
  );
}
