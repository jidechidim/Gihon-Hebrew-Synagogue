"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";

const supabase = createClientComponentClient();

export default function AboutAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch session and data
  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/admin/login";
        return;
      }
      setSession(sessionData.session);

      const { data: row } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "about")
        .single();

      setData(
        row?.data || {
          intro: { title: "", lede: "", image: "", image_alt: "" },
          mission_vision: {
            mission: { title: "", text: "" },
            vision: { title: "", text: "" },
          },
          values: [],
          board: { image: "", image_alt: "", caption: "", cta_text: "", cta_link: "" },
        }
      );

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p>Checking access…</p>;
  if (!session) return null;
  if (!data) return <p>Loading content…</p>;

  const saveData = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("cms_content")
      .upsert({ id: "about", data });
    setSaving(false);

    if (error) console.error(error);
    else alert("✅ Changes saved!");
  };

  const updateIntro = (field, value) =>
    setData({ ...data, intro: { ...data.intro, [field]: value } });

  const updateMissionVision = (section, field, value) =>
    setData({
      ...data,
      mission_vision: {
        ...data.mission_vision,
        [section]: { ...data.mission_vision[section], [field]: value },
      },
    });

  const updateBoard = (field, value) =>
    setData({ ...data, board: { ...data.board, [field]: value } });

  const updateValue = (index, value) => {
    const newValues = [...data.values];
    newValues[index] = value;
    setData({ ...data, values: newValues });
  };

  const addValue = () => setData({ ...data, values: [...data.values, ""] });
  const removeValue = (index) =>
    setData({ ...data, values: data.values.filter((_, i) => i !== index) });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>About Page Editor</h2>

      {/* Intro Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Intro Section</h3>
        <label>Title</label>
        <input value={data.intro.title} onChange={(e) => updateIntro("title", e.target.value)} />
        <label>Lede</label>
        <textarea value={data.intro.lede} onChange={(e) => updateIntro("lede", e.target.value)} rows={4} />
        <label>Image Alt Text</label>
        <input value={data.intro.image_alt} onChange={(e) => updateIntro("image_alt", e.target.value)} />
        <ImageUpload
          label="Intro Image"
          value={data.intro.image}
          onChange={(url) => updateIntro("image", url)}
          bucket="content"
        />
      </section>

      {/* Mission & Vision */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Mission & Vision</h3>
        <label>Mission Title</label>
        <input value={data.mission_vision.mission.title} onChange={(e) => updateMissionVision("mission", "title", e.target.value)} />
        <label>Mission Text</label>
        <textarea value={data.mission_vision.mission.text} onChange={(e) => updateMissionVision("mission", "text", e.target.value)} rows={4} />
        <label>Vision Title</label>
        <input value={data.mission_vision.vision.title} onChange={(e) => updateMissionVision("vision", "title", e.target.value)} />
        <label>Vision Text</label>
        <textarea value={data.mission_vision.vision.text} onChange={(e) => updateMissionVision("vision", "text", e.target.value)} rows={4} />
      </section>

      {/* Values */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Values</h3>
        {data.values.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input value={v} onChange={(e) => updateValue(i, e.target.value)} />
            <button type="button" onClick={() => removeValue(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addValue}>Add Value</button>
      </section>

      {/* Board */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Board</h3>
        <label>Caption</label>
        <input value={data.board.caption} onChange={(e) => updateBoard("caption", e.target.value)} />
        <label>CTA Text</label>
        <input value={data.board.cta_text} onChange={(e) => updateBoard("cta_text", e.target.value)} />
        <label>CTA Link</label>
        <input value={data.board.cta_link} onChange={(e) => updateBoard("cta_link", e.target.value)} />
        <label>Image Alt Text</label>
        <input value={data.board.image_alt} onChange={(e) => updateBoard("image_alt", e.target.value)} />
        <ImageUpload
          label="Board Image"
          value={data.board.image}
          onChange={(url) => updateBoard("image", url)}
          bucket="content"
        />
      </section>

      <button onClick={saveData} disabled={saving} style={{ marginTop: 10, padding: "8px 16px", fontSize: 16 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
