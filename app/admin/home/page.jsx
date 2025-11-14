"use client";

import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import ImageUpload from "../../components/ImageUpload";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function HomeAdmin() {
  const session = useContext(SessionContext);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;

    async function fetchData() {
      const { data: row, error } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "home")
        .single();

      // Initialize data structure if missing
      setData(
        row?.data || {
          hero: { title: "", subtitle: "", cta_text: "", cta_link: "", image: "" },
          welcome: { title: "", paragraphs: ["", ""], cta_text: "", cta_link: "", image: "" },
        }
      );
    }

    fetchData();
  }, [session]);

  if (!session) return <p>Checking access…</p>;
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

  return (
    <div>
      <h2>Home Page Editor</h2>

      {/* Hero Section */}
      <h3>Hero Section</h3>
      <label>Title</label>
      <input
        value={data.hero.title}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
      />
      <label>Subtitle</label>
      <input
        value={data.hero.subtitle}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
      />
      <label>CTA Text</label>
      <input
        value={data.hero.cta_text}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, cta_text: e.target.value } })}
      />
      <label>CTA Link</label>
      <input
        value={data.hero.cta_link}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, cta_link: e.target.value } })}
      />
      <ImageUpload
        label="Hero Image"
        value={data.hero.image}
        onChange={(url) => setData({ ...data, hero: { ...data.hero, image: url } })}
        bucket="content"
      />

      {/* Welcome Section */}
      <h3>Welcome Section</h3>
      <label>Title</label>
      <input
        value={data.welcome.title}
        onChange={(e) => setData({ ...data, welcome: { ...data.welcome, title: e.target.value } })}
      />
      <label>Paragraph 1</label>
      <input
        value={data.welcome.paragraphs[0]}
        onChange={(e) =>
          setData({
            ...data,
            welcome: { ...data.welcome, paragraphs: [e.target.value, data.welcome.paragraphs[1]] },
          })
        }
      />
      <label>Paragraph 2</label>
      <input
        value={data.welcome.paragraphs[1]}
        onChange={(e) =>
          setData({
            ...data,
            welcome: { ...data.welcome, paragraphs: [data.welcome.paragraphs[0], e.target.value] },
          })
        }
      />
      <label>CTA Text</label>
      <input
        value={data.welcome.cta_text}
        onChange={(e) => setData({ ...data, welcome: { ...data.welcome, cta_text: e.target.value } })}
      />
      <label>CTA Link</label>
      <input
        value={data.welcome.cta_link}
        onChange={(e) => setData({ ...data, welcome: { ...data.welcome, cta_link: e.target.value } })}
      />
      <ImageUpload
        label="Welcome Image"
        value={data.welcome.image}
        onChange={(url) => setData({ ...data, welcome: { ...data.welcome, image: url } })}
        bucket="content"
      />

      {/* Save Button */}
      <button onClick={saveData} disabled={saving} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
