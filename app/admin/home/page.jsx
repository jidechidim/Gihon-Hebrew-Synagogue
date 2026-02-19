"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";
import CTAButton from "../../components/CTAButton";
import AdminContainer from "../components/AdminContainer";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

const sectionStyle = {
  border: "1px solid #ccc",
  padding: 16,
  marginBottom: 20,
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
};

const fieldStyle = {
  flex: "1 1 45%",
  minWidth: 220,
  display: "flex",
  flexDirection: "column",
};

const fullWidthStyle = { width: "100%" };

const noteStyle = {
  margin: 0,
  color: "#4b5563",
};

function defaultCommunityItem() {
  return {
    title: "",
    description: "",
    image: "",
    image_alt: "",
    cta_text: "",
    cta_link: "",
  };
}

function normalizeParagraphs(value, minimum = 2) {
  const paragraphs = Array.isArray(value)
    ? value.filter((entry) => typeof entry === "string")
    : [];

  while (paragraphs.length < minimum) {
    paragraphs.push("");
  }

  return paragraphs;
}

function normalizeHomeData(rawData = {}) {
  const aboutSource = rawData.about || {};
  const communitySource = rawData.community || {};
  const donateSource = rawData.donate || {};

  const aboutParagraphs = Array.isArray(aboutSource.paragraphs)
    ? normalizeParagraphs(aboutSource.paragraphs, 3)
    : aboutSource.description
      ? normalizeParagraphs([aboutSource.description], 3)
      : normalizeParagraphs([], 3);

  const welcomeParagraphs = normalizeParagraphs(rawData.welcome?.paragraphs, 2);

  const communityItems = Array.from({ length: 3 }, (_, index) => ({
    ...defaultCommunityItem(),
    ...(Array.isArray(communitySource.items) ? communitySource.items[index] : null),
  }));

  return {
    ...rawData,
    hero: {
      title: "",
      subtitle: "",
      cta_text: "",
      cta_link: "",
      image: "",
      ...(rawData.hero || {}),
    },
    about: {
      title: "",
      subtitle: "",
      paragraphs: aboutParagraphs,
      cta_text: "",
      cta_link: "",
      image_top: "",
      image_top_alt: "",
      image_bottom: "",
      image_bottom_alt: "",
      ...(aboutSource || {}),
      paragraphs: aboutParagraphs,
    },
    welcome: {
      title: "",
      paragraphs: welcomeParagraphs,
      cta_text: "",
      cta_link: "",
      image: "",
      ...(rawData.welcome || {}),
      paragraphs: welcomeParagraphs,
    },
    community: {
      title: "",
      description: "",
      items: communityItems,
      ...(communitySource || {}),
      items: communityItems,
    },
    donate: {
      title: "",
      description: "",
      cta_text: "",
      cta_link: "",
      ...(donateSource || {}),
    },
    newsletter: {
      title: "",
      description: "",
      placeholder_email: "",
      submit_text: "",
      ...(rawData.newsletter || {}),
    },
  };
}

export default function HomeAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [homeRowId, setHomeRowId] = useState(null);
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

      const { data: row, error: rowError } = await supabase
        .from("pages_content")
        .select("id, data")
        .eq("slug", "home")
        .limit(1)
        .maybeSingle();

      if (rowError) {
        console.error(rowError);
        setLoading(false);
        return;
      }

      setHomeRowId(row?.id || null);
      setData(normalizeHomeData(row?.data || {}));

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Checking access...</p>;
  if (!session) return null;
  if (!data) return <p>Loading content...</p>;

  const saveData = async () => {
    if (!homeRowId) {
      alert("Home row not found in pages_content. Save cancelled to avoid creating a new row.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("pages_content")
      .update({ data })
      .eq("id", homeRowId);

    setSaving(false);

    if (error) console.error(error);
    else alert("Changes saved.");
  };

  const updateHero = (field, value) =>
    setData({ ...data, hero: { ...data.hero, [field]: value } });

  const updateAbout = (field, value, index = null) => {
    if (field === "paragraphs" && index !== null) {
      const paragraphs = [...data.about.paragraphs];
      paragraphs[index] = value;
      setData({ ...data, about: { ...data.about, paragraphs } });
      return;
    }

    setData({ ...data, about: { ...data.about, [field]: value } });
  };

  const updateWelcome = (field, value, index = null) => {
    if (field === "paragraphs" && index !== null) {
      const paragraphs = [...data.welcome.paragraphs];
      paragraphs[index] = value;
      setData({ ...data, welcome: { ...data.welcome, paragraphs } });
    } else {
      setData({ ...data, welcome: { ...data.welcome, [field]: value } });
    }
  };

  const updateCommunity = (field, value) =>
    setData({ ...data, community: { ...data.community, [field]: value } });

  const updateCommunityItem = (index, field, value) => {
    const items = [...data.community.items];
    items[index] = {
      ...defaultCommunityItem(),
      ...items[index],
      [field]: value,
    };

    setData({
      ...data,
      community: {
        ...data.community,
        items,
      },
    });
  };

  const updateDonate = (field, value) =>
    setData({ ...data, donate: { ...data.donate, [field]: value } });

  const updateNewsletter = (field, value) =>
    setData({ ...data, newsletter: { ...data.newsletter, [field]: value } });

  return (
    <AdminContainer>
      <h2>Home Page Editor</h2>

      {/* 1. Hero */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>1. Hero</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Subtitle</label>
          <input style={{ width: "100%" }} value={data.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.hero.cta_text} onChange={(e) => updateHero("cta_text", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.hero.cta_link} onChange={(e) => updateHero("cta_link", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <ImageUpload
            label="Hero Image"
            value={data.hero.image}
            onChange={(url) => updateHero("image", url)}
            folder="home"
          />
        </div>
      </section>

      {/* 2. Weekly Parshiyot */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>2. Weekly Parshiyot</h3>
        <p style={noteStyle}>
          This section is populated from <code>public/data/parsha.json</code> and appears automatically on the homepage.
        </p>
        <div style={fullWidthStyle}>
          <CTAButton href="/parshiyot" variant="secondary" className="btn-sm">
            View Public Parshiyot Page
          </CTAButton>
        </div>
      </section>

      {/* 3. About */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>3. About</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.about.title} onChange={(e) => updateAbout("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Subtitle</label>
          <input style={{ width: "100%" }} value={data.about.subtitle} onChange={(e) => updateAbout("subtitle", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Paragraph 1</label>
          <textarea
            style={{ width: "100%" }}
            value={data.about.paragraphs[0]}
            rows={4}
            onChange={(e) => updateAbout("paragraphs", e.target.value, 0)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Paragraph 2</label>
          <textarea
            style={{ width: "100%" }}
            value={data.about.paragraphs[1]}
            rows={4}
            onChange={(e) => updateAbout("paragraphs", e.target.value, 1)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Paragraph 3</label>
          <textarea
            style={{ width: "100%" }}
            value={data.about.paragraphs[2]}
            rows={4}
            onChange={(e) => updateAbout("paragraphs", e.target.value, 2)}
          />
        </div>

        <div style={fieldStyle}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.about.cta_text} onChange={(e) => updateAbout("cta_text", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.about.cta_link} onChange={(e) => updateAbout("cta_link", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Top Image Alt Text</label>
          <input style={{ width: "100%" }} value={data.about.image_top_alt || ""} onChange={(e) => updateAbout("image_top_alt", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Bottom Image Alt Text</label>
          <input style={{ width: "100%" }} value={data.about.image_bottom_alt || ""} onChange={(e) => updateAbout("image_bottom_alt", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <ImageUpload
            label="Top Image"
            value={data.about.image_top}
            onChange={(url) => updateAbout("image_top", url)}
            folder="home"
          />
        </div>

        <div style={fieldStyle}>
          <ImageUpload
            label="Bottom Image"
            value={data.about.image_bottom}
            onChange={(url) => updateAbout("image_bottom", url)}
            folder="home"
          />
        </div>
      </section>

      {/* 4. Upcoming Events */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>4. Upcoming Events</h3>
        <p style={noteStyle}>
          Upcoming Events on the homepage uses the latest records from the Events CMS.
        </p>
        <div style={fullWidthStyle}>
          <CTAButton href="/admin/events" variant="secondary" className="btn-sm">
            Manage Events
          </CTAButton>
        </div>
      </section>

      {/* 5. Welcome */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>5. Welcome</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.welcome.title} onChange={(e) => updateWelcome("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Paragraph 1</label>
          <input style={{ width: "100%" }}
            value={data.welcome.paragraphs[0]}
            onChange={(e) => updateWelcome("paragraphs", e.target.value, 0)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Paragraph 2</label>
          <input style={{ width: "100%" }}
            value={data.welcome.paragraphs[1]}
            onChange={(e) => updateWelcome("paragraphs", e.target.value, 1)}
          />
        </div>

        <div style={fieldStyle}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.welcome.cta_text} onChange={(e) => updateWelcome("cta_text", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.welcome.cta_link} onChange={(e) => updateWelcome("cta_link", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <ImageUpload
            label="Welcome Image"
            value={data.welcome.image}
            onChange={(url) => updateWelcome("image", url)}
            folder="home"
          />
        </div>
      </section>

      {/* 6. Our Community */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>6. Our Community</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.community.title} onChange={(e) => updateCommunity("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            style={{ width: "100%" }}
            value={data.community.description}
            rows={4}
            onChange={(e) => updateCommunity("description", e.target.value)}
          />
        </div>

        {data.community.items.map((item, index) => (
          <section
            key={`community-item-${index}`}
            style={{
              ...fullWidthStyle,
              border: "1px solid #ddd",
              padding: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h4 style={fullWidthStyle}>Community Card {index + 1}</h4>

            <div style={fieldStyle}>
              <label>Title</label>
              <input
                style={{ width: "100%" }}
                value={item.title || ""}
                onChange={(e) => updateCommunityItem(index, "title", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>Description</label>
              <textarea
                style={{ width: "100%" }}
                value={item.description || ""}
                rows={3}
                onChange={(e) => updateCommunityItem(index, "description", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>CTA Text</label>
              <input
                style={{ width: "100%" }}
                value={item.cta_text || ""}
                onChange={(e) => updateCommunityItem(index, "cta_text", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>CTA Link</label>
              <input
                style={{ width: "100%" }}
                value={item.cta_link || ""}
                onChange={(e) => updateCommunityItem(index, "cta_link", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>Image Alt Text</label>
              <input
                style={{ width: "100%" }}
                value={item.image_alt || ""}
                onChange={(e) => updateCommunityItem(index, "image_alt", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <ImageUpload
                label="Image"
                value={item.image || ""}
                onChange={(url) => updateCommunityItem(index, "image", url)}
                folder="home"
              />
            </div>
          </section>
        ))}
      </section>

      {/* 7. Latest from Gihon */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>7. Latest from Gihon</h3>
        <p style={noteStyle}>
          Latest from Gihon is driven by the latest News entries and updates automatically on the homepage.
        </p>
        <div style={fullWidthStyle}>
          <CTAButton href="/admin/news" variant="secondary" className="btn-sm">
            Manage News
          </CTAButton>
        </div>
      </section>

      {/* 8. Donate */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>8. Donate</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.donate.title} onChange={(e) => updateDonate("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            style={{ width: "100%" }}
            value={data.donate.description}
            rows={4}
            onChange={(e) => updateDonate("description", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.donate.cta_text} onChange={(e) => updateDonate("cta_text", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.donate.cta_link} onChange={(e) => updateDonate("cta_link", e.target.value)} />
        </div>
      </section>

      {/* 9. Newsletter */}
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>9. Newsletter</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.newsletter.title} onChange={(e) => updateNewsletter("title", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.description}
            onChange={(e) => updateNewsletter("description", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Placeholder Email</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.placeholder_email}
            onChange={(e) => updateNewsletter("placeholder_email", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Submit Text</label>
          <input style={{ width: "100%" }}
            value={data.newsletter.submit_text}
            onChange={(e) => updateNewsletter("submit_text", e.target.value)}
          />
        </div>
      </section>

      <CTAButton
        onClick={saveData}
        disabled={saving}
        type="button"
        variant="secondary"
        style={{ marginTop: 10 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </CTAButton>
    </AdminContainer>
  );
}
