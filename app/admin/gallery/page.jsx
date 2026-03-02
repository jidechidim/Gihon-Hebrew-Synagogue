"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";
import CTAButton from "../../components/CTAButton";
import AdminContainer from "../components/AdminContainer";
import ContentPreviewModal from "../components/ContentPreviewModal";
import {
  createEmptyGalleryPhoto,
  normalizeGallerySection,
} from "@lib/gallery-content";

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

function normalizeGalleryData(rawData = {}) {
  return normalizeGallerySection(rawData, {
    defaultTitle: "",
    defaultSubtitle: "",
    defaultCtaText: "View Full Gallery",
    defaultCtaLink: "/gallery",
  });
}

function buildGallerySavePayload(data) {
  const photos = Array.isArray(data.photos)
    ? data.photos
        .map((photo) => ({
          ...createEmptyGalleryPhoto(),
          ...(photo || {}),
          image: typeof photo?.image === "string" ? photo.image.trim() : "",
          image_alt:
            typeof photo?.image_alt === "string"
              ? photo.image_alt.trim()
              : "",
          caption:
            typeof photo?.caption === "string"
              ? photo.caption.trim()
              : "",
        }))
        .filter((photo) => photo.image)
    : [];

  return {
    title: typeof data.title === "string" ? data.title.trim() : "",
    subtitle: typeof data.subtitle === "string" ? data.subtitle.trim() : "",
    cta_text:
      typeof data.cta_text === "string" ? data.cta_text.trim() : "View Full Gallery",
    cta_link:
      typeof data.cta_link === "string" ? data.cta_link.trim() : "/gallery",
    photos,
  };
}

export default function GalleryAdminPage() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [galleryRowId, setGalleryRowId] = useState(null);
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
        .eq("slug", "gallery")
        .limit(1)
        .maybeSingle();

      if (rowError) {
        console.error(rowError);
        setLoading(false);
        return;
      }

      const loadedData = normalizeGalleryData(row?.data || {});
      setGalleryRowId(row?.id || null);
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
    setSaving(true);

    const payload = buildGallerySavePayload(data);

    if (galleryRowId) {
      const { error } = await supabase
        .from("pages_content")
        .update({ data: payload })
        .eq("id", galleryRowId);

      setSaving(false);

      if (error) {
        console.error(error);
        return false;
      }
    } else {
      const { data: insertedRow, error } = await supabase
        .from("pages_content")
        .insert({ slug: "gallery", data: payload })
        .select("id")
        .single();

      setSaving(false);

      if (error) {
        console.error(error);
        return false;
      }

      setGalleryRowId(insertedRow?.id || null);
    }

    setData(payload);
    setInitialData(payload);
    alert("Changes saved.");
    return true;
  };

  const updateField = (field, value) => setData({ ...data, [field]: value });

  const updatePhoto = (index, field, value) => {
    const photos = [...data.photos];
    photos[index] = {
      ...createEmptyGalleryPhoto(),
      ...photos[index],
      [field]: value,
    };

    setData({
      ...data,
      photos,
    });
  };

  const addPhoto = () =>
    setData({
      ...data,
      photos: [...data.photos, createEmptyGalleryPhoto()],
    });

  const removePhoto = (index) =>
    setData({
      ...data,
      photos: data.photos.filter((_, i) => i !== index),
    });

  return (
    <AdminContainer title="Gallery Page Editor">
      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>Public Page</h3>
        <p style={noteStyle}>
          Update gallery content here, then preview the public gallery page before saving.
        </p>
        <div style={fullWidthStyle}>
          <CTAButton href="/gallery" variant="secondary" className="btn-sm">
            View Public Gallery Page
          </CTAButton>
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>1. Header</h3>

        <div style={fieldStyle}>
          <label>Title</label>
          <input
            style={{ width: "100%" }}
            value={data.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Subtitle</label>
          <textarea
            style={{ width: "100%" }}
            rows={4}
            value={data.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={fullWidthStyle}>2. Photos</h3>

        {data.photos.map((photo, index) => (
          <section
            key={`gallery-photo-${index}`}
            style={{
              ...fullWidthStyle,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h4 style={fullWidthStyle}>Photo {index + 1}</h4>

            <div style={fieldStyle}>
              <label>Alt Text</label>
              <input
                style={{ width: "100%" }}
                value={photo.image_alt || ""}
                onChange={(e) => updatePhoto(index, "image_alt", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <label>Caption</label>
              <input
                style={{ width: "100%" }}
                value={photo.caption || ""}
                onChange={(e) => updatePhoto(index, "caption", e.target.value)}
              />
            </div>

            <div style={fieldStyle}>
              <ImageUpload
                label="Photo"
                value={photo.image || ""}
                onChange={(url) => updatePhoto(index, "image", url)}
                folder="gallery"
                fileName={`gallerypageimage${index + 1}`}
                previewHeight={220}
              />
            </div>

            <div style={fullWidthStyle}>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                style={{
                  marginTop: 4,
                  background: "#e33",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 8px",
                }}
              >
                Remove Photo
              </button>
            </div>
          </section>
        ))}

        <div style={fullWidthStyle}>
          <button type="button" onClick={addPhoto} style={{ padding: "6px 12px" }}>
            Add Photo
          </button>
        </div>
      </section>

      <ContentPreviewModal
        data={data}
        originalData={initialData}
        onConfirmSave={saveData}
        saving={saving}
        websitePreviewPath="/gallery"
        websitePreviewData={data}
        style={{ marginTop: 10 }}
      />
    </AdminContainer>
  );
}
