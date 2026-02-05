"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";
import AdminContainer from "../components/AdminContainer";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function HomeAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        window.location.href = "/admin/login";
        return;
      }

      setSession(sessionData.session);

      const { data: row } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "home")
        .single();

      setData(
        row?.data || {
          hero: { title: "", subtitle: "", cta_text: "", cta_link: "", image: "" },
          welcome: { title: "", paragraphs: ["", ""], cta_text: "", cta_link: "", image: "" },
          newsletter: { title: "", description: "", placeholder_email: "", submit_text: "" },
        }
      );

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Checking access…</p>;
  if (!session) return null;
  if (!data) return <p>Loading content…</p>;

  const saveData = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("cms_content")
      .upsert({ id: "home", data });

    setSaving(false);

    if (error) console.error(error);
    else alert("✅ Changes saved!");
  };

  const updateHero = (field, value) =>
    setData({ ...data, hero: { ...data.hero, [field]: value } });

  const updateWelcome = (field, value, index = null) => {
    if (field === "paragraphs" && index !== null) {
      const paragraphs = [...data.welcome.paragraphs];
      paragraphs[index] = value;
      setData({ ...data, welcome: { ...data.welcome, paragraphs } });
    } else {
      setData({ ...data, welcome: { ...data.welcome, [field]: value } });
    }
  };

  const updateNewsletter = (field, value) =>
    setData({ ...data, newsletter: { ...data.newsletter, [field]: value } });

  return (
    <AdminContainer>
      <h2>Home Page Editor</h2>

      {/* Hero */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h3 style={{ width: "100%" }}>Hero Section</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Subtitle</label>
          <input style={{ width: "100%" }} value={data.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.hero.cta_text} onChange={(e) => updateHero("cta_text", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.hero.cta_link} onChange={(e) => updateHero("cta_link", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload
            label="Hero Image"
            value={data.hero.image}
            onChange={(url) => updateHero("image", url)}
            bucket="content"
          />
        </div>
      </section>

      {/* Welcome */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h3 style={{ width: "100%" }}>Welcome Section</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.welcome.title} onChange={(e) => updateWelcome("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Paragraph 1</label>
          <input style={{ width: "100%" }}
            value={data.welcome.paragraphs[0]}
            onChange={(e) => updateWelcome("paragraphs", e.target.value, 0)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Paragraph 2</label>
          <input style={{ width: "100%" }}
            value={data.welcome.paragraphs[1]}
            onChange={(e) => updateWelcome("paragraphs", e.target.value, 1)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.welcome.cta_text} onChange={(e) => updateWelcome("cta_text", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.welcome.cta_link} onChange={(e) => updateWelcome("cta_link", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload
            label="Welcome Image"
            value={data.welcome.image}
            onChange={(url) => updateWelcome("image", url)}
            bucket="content"
          />
        </div>
      </section>

      {/* Newsletter */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h3 style={{ width: "100%" }}>Newsletter Section</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.newsletter.title} onChange={(e) => updateNewsletter("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Description</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.description}
            onChange={(e) => updateNewsletter("description", e.target.value)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Placeholder Email</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.placeholder_email}
            onChange={(e) => updateNewsletter("placeholder_email", e.target.value)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Submit Text</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.submit_text}
            onChange={(e) => updateNewsletter("submit_text", e.target.value)}
          />
        </div>
      </section>

      <button
        onClick={saveData}
        disabled={saving}
        className="btn btn-outline"
        style={{ marginTop: 10 }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </AdminContainer>
  );
}
