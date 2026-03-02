"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CTAButton from "../../components/CTAButton";
import AdminContainer from "../components/AdminContainer";
import ContentPreviewModal from "../components/ContentPreviewModal";

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

function defaultImpactItem() {
  return {
    title: "",
    description: "",
  };
}

function normalizeDonateData(rawData = {}) {
  const heroSource = rawData.hero || {};
  const impactSource = rawData.impact || {};
  const trustSource = rawData.trust || {};

  const impactItems = Array.from({ length: 3 }, (_, index) => ({
    ...defaultImpactItem(),
    ...(Array.isArray(impactSource.items) ? impactSource.items[index] : null),
  }));

  return {
    hero: {
      title: "",
      subtitle: "",
      primary_cta_text: "",
      primary_cta_link: "",
      secondary_cta_text: "",
      secondary_cta_link: "",
      ...heroSource,
    },
    impact: {
      title: "",
      items: impactItems,
      ...impactSource,
      items: impactItems,
    },
    trust: {
      title: "",
      description: "",
      cta_text: "",
      cta_link: "",
      ...trustSource,
    },
  };
}

export default function DonateAdminPage() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [donateRowId, setDonateRowId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        window.location.href = "/admin/login";
        return;
      }

      setSession(sessionData.session);

      const { data: row, error: rowError } = await supabase
        .from("pages_content")
        .select("id, data")
        .eq("slug", "donate")
        .limit(1)
        .maybeSingle();

      if (rowError) {
        console.error(rowError);
        setLoading(false);
        return;
      }

      const loadedData = normalizeDonateData(row?.data || {});
      setDonateRowId(row?.id || null);
      setData(loadedData);
      setInitialData(loadedData);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p>Checking access...</p>;
  if (!session) return null;
  if (!data) return <p>Loading content...</p>;

  const saveData = async () => {
    if (!donateRowId) {
      alert("Donate row not found in pages_content. Save cancelled to avoid creating a new row.");
      return false;
    }

    setSaving(true);
    const { error } = await supabase
      .from("pages_content")
      .update({ data })
      .eq("id", donateRowId);
    setSaving(false);

    if (error) {
      console.error(error);
      return false;
    }

    setInitialData(data);
    alert("Changes saved.");
    return true;
  };

  const updateHero = (field, value) =>
    setData({ ...data, hero: { ...data.hero, [field]: value } });

  const updateImpact = (field, value) =>
    setData({ ...data, impact: { ...data.impact, [field]: value } });

  const updateImpactItem = (index, field, value) => {
    const items = [...data.impact.items];
    items[index] = {
      ...defaultImpactItem(),
      ...items[index],
      [field]: value,
    };

    setData({
      ...data,
      impact: {
        ...data.impact,
        items,
      },
    });
  };

  const updateTrust = (field, value) =>
    setData({ ...data, trust: { ...data.trust, [field]: value } });

  return (
    <AdminContainer title="Donate Page Editor">
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>Public Page</h3>
        <p style={noteStyle}>
          Update content here, then open the public donate page to confirm layout and copy.
        </p>
        <div style={fullWidthStyle}>
          <CTAButton href="/donate" variant="secondary" className="btn-sm">
            View Public Donate Page
          </CTAButton>
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>1. Hero</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input
            style={{ width: "100%" }}
            value={data.hero.title}
            onChange={(e) => updateHero("title", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Subtitle</label>
          <textarea
            style={{ width: "100%" }}
            value={data.hero.subtitle}
            rows={4}
            onChange={(e) => updateHero("subtitle", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Primary CTA Text</label>
          <input
            style={{ width: "100%" }}
            value={data.hero.primary_cta_text}
            onChange={(e) => updateHero("primary_cta_text", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Primary CTA Link</label>
          <input
            style={{ width: "100%" }}
            value={data.hero.primary_cta_link}
            onChange={(e) => updateHero("primary_cta_link", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Secondary CTA Text</label>
          <input
            style={{ width: "100%" }}
            value={data.hero.secondary_cta_text}
            onChange={(e) => updateHero("secondary_cta_text", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Secondary CTA Link</label>
          <input
            style={{ width: "100%" }}
            value={data.hero.secondary_cta_link}
            onChange={(e) => updateHero("secondary_cta_link", e.target.value)}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>2. Impact Section</h3>

        <div style={fieldStyle}>
          <label>Section Title</label>
          <input
            style={{ width: "100%" }}
            value={data.impact.title}
            onChange={(e) => updateImpact("title", e.target.value)}
          />
        </div>

        {data.impact.items.map((item, index) => (
          <section
            key={`impact-item-${index}`}
            style={{
              ...fullWidthStyle,
              border: "1px solid #ddd",
              padding: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h4 style={fullWidthStyle}>Impact Card {index + 1}</h4>

            <div style={fieldStyle}>
              <label>Title</label>
              <input
                style={{ width: "100%" }}
                value={item.title || ""}
                onChange={(e) => updateImpactItem(index, "title", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>Description</label>
              <textarea
                style={{ width: "100%" }}
                value={item.description || ""}
                rows={3}
                onChange={(e) => updateImpactItem(index, "description", e.target.value)}
              />
            </div>
          </section>
        ))}
      </section>

      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>3. Trust Section</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input
            style={{ width: "100%" }}
            value={data.trust.title}
            onChange={(e) => updateTrust("title", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            style={{ width: "100%" }}
            value={data.trust.description}
            rows={4}
            onChange={(e) => updateTrust("description", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>CTA Text</label>
          <input
            style={{ width: "100%" }}
            value={data.trust.cta_text}
            onChange={(e) => updateTrust("cta_text", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>CTA Link</label>
          <input
            style={{ width: "100%" }}
            value={data.trust.cta_link}
            onChange={(e) => updateTrust("cta_link", e.target.value)}
          />
        </div>
      </section>

      <ContentPreviewModal
        data={data}
        originalData={initialData}
        onConfirmSave={saveData}
        saving={saving}
        websitePreviewPath="/donate"
        websitePreviewData={data}
        style={{ marginTop: 10 }}
      />
    </AdminContainer>
  );
}
