"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";
import ContentPreviewModal from "../components/ContentPreviewModal";
import {
  createEmptyGalleryPhoto,
  normalizeGallerySection,
  pickNonEmptyString,
} from "@lib/gallery-content";

const supabase = createClientComponentClient();
const ABOUT_GALLERY_MAX_PHOTOS = 4;
const ABOUT_GALLERY_DEFAULT_CTA_TEXT = "View Full Gallery";
const ABOUT_GALLERY_DEFAULT_CTA_LINK = "/gallery";

function resolveAboutGallerySource(rawData = {}) {
  const gallerySource = rawData.gallery;
  const legacyPhotos = Array.isArray(rawData.gallery_photos) ? rawData.gallery_photos : [];

  if (Array.isArray(gallerySource)) {
    return gallerySource;
  }

  if (gallerySource && typeof gallerySource === "object") {
    if (Array.isArray(gallerySource.photos) && gallerySource.photos.length > 0) {
      return gallerySource;
    }

    if (legacyPhotos.length > 0) {
      return {
        ...gallerySource,
        photos: legacyPhotos,
      };
    }

    return gallerySource;
  }

  if (legacyPhotos.length > 0) {
    return { photos: legacyPhotos };
  }

  return {};
}

function normalizeAboutData(rawData = {}) {
  const introSource = rawData.intro || {};
  const missionVisionSource = rawData.mission_vision || {};
  const boardSource = rawData.board || {};

  const gallery = normalizeGallerySection(resolveAboutGallerySource(rawData), {
    defaultTitle: "",
    defaultSubtitle: "",
    defaultCtaText: ABOUT_GALLERY_DEFAULT_CTA_TEXT,
    defaultCtaLink: ABOUT_GALLERY_DEFAULT_CTA_LINK,
    maxPhotos: ABOUT_GALLERY_MAX_PHOTOS,
  });

  return {
    intro: {
      title: "",
      lede: "",
      image: "",
      image_alt: "",
      ...introSource,
    },
    mission_vision: {
      mission: {
        title: "",
        text: "",
        ...(missionVisionSource.mission || {}),
      },
      vision: {
        title: "",
        text: "",
        ...(missionVisionSource.vision || {}),
      },
    },
    values: Array.isArray(rawData.values) ? rawData.values : [],
    gallery,
    board: {
      image: "",
      image_alt: "",
      caption: "",
      cta_text: "",
      cta_link: "",
      ...boardSource,
    },
  };
}

function buildAboutSavePayload(data) {
  const galleryPhotos = Array.isArray(data?.gallery?.photos)
    ? data.gallery.photos
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
        .slice(0, ABOUT_GALLERY_MAX_PHOTOS)
    : [];

  return {
    ...data,
    gallery: {
      ...data.gallery,
      title: pickNonEmptyString(data?.gallery?.title, ""),
      subtitle: pickNonEmptyString(data?.gallery?.subtitle, ""),
      cta_text: pickNonEmptyString(
        data?.gallery?.cta_text,
        ABOUT_GALLERY_DEFAULT_CTA_TEXT
      ),
      cta_link: pickNonEmptyString(
        data?.gallery?.cta_link,
        ABOUT_GALLERY_DEFAULT_CTA_LINK
      ),
      photos: galleryPhotos,
    },
  };
}

export default function AboutAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [aboutRowId, setAboutRowId] = useState(null);
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
        .eq("slug", "about")
        .limit(1)
        .maybeSingle();

      if (rowError) {
        console.error(rowError);
        setLoading(false);
        return;
      }

      setAboutRowId(row?.id || null);

      const loadedData = normalizeAboutData(row?.data || {});

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
    if (!aboutRowId) {
      alert(
        "About row not found in pages_content. Save cancelled to avoid creating a new row."
      );
      return false;
    }

    const payload = buildAboutSavePayload(data);

    setSaving(true);
    const { error } = await supabase
      .from("pages_content")
      .update({ data: payload })
      .eq("id", aboutRowId);
    setSaving(false);

    if (error) {
      console.error(error);
      return false;
    }

    setData(payload);
    setInitialData(payload);
    alert("Changes saved.");
    return true;
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

  const updateGallery = (field, value) =>
    setData({ ...data, gallery: { ...data.gallery, [field]: value } });

  const updateGalleryPhoto = (index, field, value) => {
    const photos = [...data.gallery.photos];
    photos[index] = {
      ...createEmptyGalleryPhoto(),
      ...photos[index],
      [field]: value,
    };

    setData({
      ...data,
      gallery: {
        ...data.gallery,
        photos,
      },
    });
  };

  const addGalleryPhoto = () => {
    if (data.gallery.photos.length >= ABOUT_GALLERY_MAX_PHOTOS) return;

    setData({
      ...data,
      gallery: {
        ...data.gallery,
        photos: [...data.gallery.photos, createEmptyGalleryPhoto()],
      },
    });
  };

  const removeGalleryPhoto = (index) =>
    setData({
      ...data,
      gallery: {
        ...data.gallery,
        photos: data.gallery.photos.filter((_, i) => i !== index),
      },
    });

  const updateValue = (index, value) => {
    const newValues = [...data.values];
    newValues[index] = value;
    setData({ ...data, values: newValues });
  };

  const addValue = () => setData({ ...data, values: [...data.values, ""] });
  const removeValue = (index) =>
    setData({ ...data, values: data.values.filter((_, i) => i !== index) });

  const canAddGalleryPhoto = data.gallery.photos.length < ABOUT_GALLERY_MAX_PHOTOS;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>About Page Editor</h2>

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
        <h3 style={{ width: "100%" }}>Intro Section</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Title</label>
          <input style={{ width: "100%" }} value={data.intro.title} onChange={(e) => updateIntro("title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Lede</label>
          <textarea style={{ width: "100%" }} value={data.intro.lede} onChange={(e) => updateIntro("lede", e.target.value)} rows={4} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Image Alt Text</label>
          <input style={{ width: "100%" }} value={data.intro.image_alt} onChange={(e) => updateIntro("image_alt", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload
            label="Intro Image"
            value={data.intro.image}
            onChange={(url) => updateIntro("image", url)}
            folder="about"
            fileName="aboutpageintroimage"
          />
        </div>
      </section>

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
        <h3 style={{ width: "100%" }}>Mission & Vision</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Mission Title</label>
          <input style={{ width: "100%" }} value={data.mission_vision.mission.title} onChange={(e) => updateMissionVision("mission", "title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 320, display: "flex", flexDirection: "column" }}>
          <label>Mission Text</label>
          <textarea style={{ width: "100%" }} value={data.mission_vision.mission.text} onChange={(e) => updateMissionVision("mission", "text", e.target.value)} rows={4} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Vision Title</label>
          <input style={{ width: "100%" }} value={data.mission_vision.vision.title} onChange={(e) => updateMissionVision("vision", "title", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 320, display: "flex", flexDirection: "column" }}>
          <label>Vision Text</label>
          <textarea style={{ width: "100%" }} value={data.mission_vision.vision.text} onChange={(e) => updateMissionVision("vision", "text", e.target.value)} rows={4} />
        </div>
      </section>

      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Values</h3>
        {data.values.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input style={{ flex: "1 1 auto" }} value={v} onChange={(e) => updateValue(i, e.target.value)} />
            <button type="button" onClick={() => removeValue(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addValue}>Add Value</button>
      </section>

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
        <h3 style={{ width: "100%" }}>Gallery</h3>
        <p style={{ width: "100%", margin: 0, color: "#4b5563" }}>
          About page shows up to 4 images. Upload order controls display order.
        </p>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Section Title</label>
          <input
            style={{ width: "100%" }}
            value={data.gallery.title || ""}
            onChange={(e) => updateGallery("title", e.target.value)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Section Subtitle</label>
          <input
            style={{ width: "100%" }}
            value={data.gallery.subtitle || ""}
            onChange={(e) => updateGallery("subtitle", e.target.value)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Text</label>
          <input
            style={{ width: "100%" }}
            value={data.gallery.cta_text || ""}
            onChange={(e) => updateGallery("cta_text", e.target.value)}
          />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Link</label>
          <input
            style={{ width: "100%" }}
            value={data.gallery.cta_link || ""}
            onChange={(e) => updateGallery("cta_link", e.target.value)}
          />
        </div>

        {data.gallery.photos.map((photo, index) => (
          <section
            key={`gallery-photo-${index}`}
            style={{
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h4 style={{ width: "100%", margin: 0 }}>Photo {index + 1}</h4>

            <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
              <label>Alt Text</label>
              <input
                style={{ width: "100%" }}
                value={photo.image_alt || ""}
                onChange={(e) => updateGalleryPhoto(index, "image_alt", e.target.value)}
              />
            </div>

            <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
              <label>Caption</label>
              <input
                style={{ width: "100%" }}
                value={photo.caption || ""}
                onChange={(e) => updateGalleryPhoto(index, "caption", e.target.value)}
              />
            </div>

            <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
              <ImageUpload
                label="Photo"
                value={photo.image || ""}
                onChange={(url) => updateGalleryPhoto(index, "image", url)}
                folder="about"
                fileName={`aboutpagegalleryimage${index + 1}`}
              />
            </div>

            <div style={{ width: "100%" }}>
              <button
                type="button"
                onClick={() => removeGalleryPhoto(index)}
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

        <div style={{ width: "100%" }}>
          <button
            type="button"
            onClick={addGalleryPhoto}
            disabled={!canAddGalleryPhoto}
            style={{ padding: "6px 12px", opacity: canAddGalleryPhoto ? 1 : 0.6 }}
          >
            {canAddGalleryPhoto ? "Add Photo" : "Max 4 Photos Reached"}
          </button>
        </div>
      </section>

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
        <h3 style={{ width: "100%" }}>Board</h3>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Caption</label>
          <input style={{ width: "100%" }} value={data.board.caption} onChange={(e) => updateBoard("caption", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Text</label>
          <input style={{ width: "100%" }} value={data.board.cta_text} onChange={(e) => updateBoard("cta_text", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>CTA Link</label>
          <input style={{ width: "100%" }} value={data.board.cta_link} onChange={(e) => updateBoard("cta_link", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <label>Image Alt Text</label>
          <input style={{ width: "100%" }} value={data.board.image_alt} onChange={(e) => updateBoard("image_alt", e.target.value)} />
        </div>

        <div style={{ flex: "1 1 45%", minWidth: 220, display: "flex", flexDirection: "column" }}>
          <ImageUpload
            label="Board Image"
            value={data.board.image}
            onChange={(url) => updateBoard("image", url)}
            folder="about"
            fileName="aboutpageboardimage"
          />
        </div>
      </section>

      <ContentPreviewModal
        data={data}
        originalData={initialData}
        onConfirmSave={saveData}
        saving={saving}
        websitePreviewPath="/about"
        websitePreviewData={data}
        style={{ marginTop: 10 }}
      />
    </div>
  );
}
