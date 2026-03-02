import { createSupabaseServerClient } from "@lib/supabase/server-client";
import { decodeCmsPreviewData } from "@lib/cmsPreview";
import "./gallery.css";

export const revalidate = 300;

const FALLBACK_ASSET_BASE = "/assets/fallback/gallery";
const FALLBACK_GALLERY_PHOTOS = [
  { image: `${FALLBACK_ASSET_BASE}/gallerypageimage1.jpeg`, image_alt: "Community gallery photo 1", caption: "" },
  { image: `${FALLBACK_ASSET_BASE}/gallerypageimage2.jpeg`, image_alt: "Community gallery photo 2", caption: "" },
  { image: `${FALLBACK_ASSET_BASE}/gallerypageimage3.jpeg`, image_alt: "Community gallery photo 3", caption: "" },
  { image: `${FALLBACK_ASSET_BASE}/gallerypageimage4.jpeg`, image_alt: "Community gallery photo 4", caption: "" },
];

const DEFAULT_GALLERY = {
  title: "Gallery",
  subtitle: "Moments from our community life.",
  photos: FALLBACK_GALLERY_PHOTOS,
};

function pickNonEmptyString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function getErrorMessage(err) {
  if (err && typeof err === "object" && "message" in err) {
    return String(err.message);
  }

  return String(err);
}

function isTransientNetworkError(message) {
  if (!message) return false;

  return [
    "fetch failed",
    "UND_ERR_CONNECT_TIMEOUT",
    "Connect Timeout",
    "EAI_AGAIN",
    "ENOTFOUND",
    "ECONNREFUSED",
    "ETIMEDOUT",
  ].some((token) => message.includes(token));
}

function pickPhotoImage(photo) {
  if (typeof photo === "string") return photo.trim();

  const value =
    photo?.image ||
    photo?.url ||
    photo?.src ||
    photo?.path ||
    photo?.publicUrl ||
    "";

  return typeof value === "string" ? value.trim() : "";
}

function normalizeGalleryData(rawGallery = {}) {
  const sourcePhotos = Array.isArray(rawGallery?.photos)
    ? rawGallery.photos
    : Array.isArray(rawGallery?.images)
      ? rawGallery.images
      : Array.isArray(rawGallery)
        ? rawGallery
        : [];

  const photos = sourcePhotos
    .map((photo) => {
      const image = pickPhotoImage(photo);
      if (!image) return null;

      if (typeof photo === "string") {
        return {
          image,
          image_alt: "",
          caption: "",
        };
      }

      return {
        image,
        image_alt: pickNonEmptyString(photo?.image_alt || photo?.alt, ""),
        caption: pickNonEmptyString(photo?.caption || photo?.description, ""),
      };
    })
    .filter(Boolean);

  return {
    title: pickNonEmptyString(rawGallery.title, DEFAULT_GALLERY.title),
    subtitle: pickNonEmptyString(rawGallery.subtitle, DEFAULT_GALLERY.subtitle),
    photos: photos.length > 0 ? photos : DEFAULT_GALLERY.photos,
  };
}

async function getGalleryData() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: galleryRow, error: galleryError } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "gallery")
      .limit(1)
      .maybeSingle();

    if (galleryError) throw galleryError;

    if (galleryRow?.data) return normalizeGalleryData(galleryRow.data);

    // Fallback to about.gallery for backward compatibility.
    const { data: aboutRow, error: aboutError } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "about")
      .limit(1)
      .maybeSingle();

    if (aboutError) throw aboutError;

    return normalizeGalleryData(aboutRow?.data?.gallery || {});
  } catch (err) {
    const message = getErrorMessage(err);

    if (isTransientNetworkError(message)) {
      if (process.env.NODE_ENV === "development") {
        console.info("Gallery page: Supabase unreachable, using fallback content.");
      }
      return DEFAULT_GALLERY;
    }

    console.error("Error loading gallery data:", message);
    return DEFAULT_GALLERY;
  }
}

function readPreviewData(searchParams) {
  if (!searchParams || searchParams.cmsPreview !== "1") return null;

  const encodedPayload = Array.isArray(searchParams.previewData)
    ? searchParams.previewData[0]
    : searchParams.previewData;

  const decoded = decodeCmsPreviewData(encodedPayload);
  return decoded && typeof decoded === "object" ? decoded : null;
}

export default async function GalleryPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const previewData = readPreviewData(resolvedSearchParams);
  const gallery = previewData ? normalizeGalleryData(previewData) : await getGalleryData();

  return (
    <main className="page gallery-page" id="main">
      <section className="gallery-hero">
        <div className="container narrow center">
          <h1 className="page-title">{gallery.title}</h1>
          <p className="page-subtitle">{gallery.subtitle}</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          {gallery.photos.length > 0 ? (
            <div className="gallery-grid">
              {gallery.photos.map((photo, index) => (
                <figure className="gallery-card" key={`gallery-page-photo-${index}`}>
                  <img
                    src={photo.image}
                    alt={photo.image_alt || `Gallery photo ${index + 1}`}
                    loading="lazy"
                  />
                  {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : (
            <p className="gallery-empty center">No gallery photos added yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}