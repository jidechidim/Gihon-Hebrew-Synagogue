"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function HomeAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch session and page data
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
      const newParagraphs = [...data.welcome.paragraphs];
      newParagraphs[index] = value;
      setData({ ...data, welcome: { ...data.welcome, paragraphs: newParagraphs } });
    } else {
      setData({ ...data, welcome: { ...data.welcome, [field]: value } });
    }
  };

  const updateNewsletter = (field, value) =>
    setData({ ...data, newsletter: { ...data.newsletter, [field]: value } });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h2>Home Page Editor</h2>

      {/* Hero Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Hero Section</h3>
        <label>Title</label>
        <input value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
        <label>Subtitle</label>
        <input value={data.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
        <label>CTA Text</label>
        <input value={data.hero.cta_text} onChange={(e) => updateHero("cta_text", e.target.value)} />
        <label>CTA Link</label>
        <input value={data.hero.cta_link} onChange={(e) => updateHero("cta_link", e.target.value)} />
        <ImageUpload
          label="Hero Image"
          value={data.hero.image}
          onChange={(url) => updateHero("image", url)}
          bucket="content"
        />
      </section>

      {/* Welcome Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Welcome Section</h3>
        <label>Title</label>
        <input value={data.welcome.title} onChange={(e) => updateWelcome("title", e.target.value)} />
        <label>Paragraph 1</label>
        <input
          value={data.welcome.paragraphs[0]}
          onChange={(e) => updateWelcome("paragraphs", e.target.value, 0)}
        />
        <label>Paragraph 2</label>
        <input
          value={data.welcome.paragraphs[1]}
          onChange={(e) => updateWelcome("paragraphs", e.target.value, 1)}
        />
        <label>CTA Text</label>
        <input value={data.welcome.cta_text} onChange={(e) => updateWelcome("cta_text", e.target.value)} />
        <label>CTA Link</label>
        <input value={data.welcome.cta_link} onChange={(e) => updateWelcome("cta_link", e.target.value)} />
        <ImageUpload
          label="Welcome Image"
          value={data.welcome.image}
          onChange={(url) => updateWelcome("image", url)}
          bucket="content"
        />
      </section>

      {/* Newsletter Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Newsletter Section</h3>
        <label>Title</label>
        <input value={data.newsletter.title} onChange={(e) => updateNewsletter("title", e.target.value)} />
        <label>Description</label>
        <input value={data.newsletter.description} onChange={(e) => updateNewsletter("description", e.target.value)} />
        <label>Placeholder Email</label>
        <input value={data.newsletter.placeholder_email} onChange={(e) => updateNewsletter("placeholder_email", e.target.value)} />
        <label>Submit Text</label>
        <input value={data.newsletter.submit_text} onChange={(e) => updateNewsletter("submit_text", e.target.value)} />
      </section>

      {/* Save Button */}
      <button onClick={saveData} disabled={saving} style={{ marginTop: 10, padding: "8px 16px", fontSize: 16 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
