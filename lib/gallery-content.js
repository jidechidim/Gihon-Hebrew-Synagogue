export const DEFAULT_GALLERY_CTA_TEXT = "View Full Gallery";
export const DEFAULT_GALLERY_CTA_LINK = "/gallery";

export function pickNonEmptyString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function createEmptyGalleryPhoto() {
  return {
    image: "",
    image_alt: "",
    caption: "",
  };
}

function getPhotoSourceArray(rawSource) {
  if (Array.isArray(rawSource)) return rawSource;

  if (rawSource && typeof rawSource === "object") {
    if (Array.isArray(rawSource.photos)) return rawSource.photos;
    if (Array.isArray(rawSource.images)) return rawSource.images;
  }

  return [];
}

function normalizePhotoImage(photo) {
  if (typeof photo === "string") return photo.trim();
  if (!photo || typeof photo !== "object") return "";

  const image =
    photo.image ||
    photo.url ||
    photo.src ||
    photo.path ||
    photo.publicUrl ||
    photo.public_url ||
    "";

  return typeof image === "string" ? image.trim() : "";
}

export function normalizeGalleryPhotos(rawSource, maxPhotos) {
  const normalized = getPhotoSourceArray(rawSource).map((photo) => {
    const image = normalizePhotoImage(photo);

    if (typeof photo === "string") {
      return {
        ...createEmptyGalleryPhoto(),
        image,
      };
    }

    return {
      ...createEmptyGalleryPhoto(),
      ...(photo && typeof photo === "object" ? photo : {}),
      image,
      image_alt: pickNonEmptyString(photo?.image_alt || photo?.alt, ""),
      caption: pickNonEmptyString(photo?.caption || photo?.description, ""),
    };
  });

  if (Number.isInteger(maxPhotos) && maxPhotos > 0) {
    return normalized.slice(0, maxPhotos);
  }

  return normalized;
}

export function normalizeGallerySection(rawSource = {}, options = {}) {
  const {
    defaultTitle = "",
    defaultSubtitle = "",
    defaultCtaText = DEFAULT_GALLERY_CTA_TEXT,
    defaultCtaLink = DEFAULT_GALLERY_CTA_LINK,
    maxPhotos,
  } = options;

  const section =
    rawSource && typeof rawSource === "object" && !Array.isArray(rawSource)
      ? rawSource
      : {};

  return {
    title: pickNonEmptyString(section.title, defaultTitle),
    subtitle: pickNonEmptyString(section.subtitle, defaultSubtitle),
    cta_text: pickNonEmptyString(section.cta_text, defaultCtaText),
    cta_link: pickNonEmptyString(section.cta_link, defaultCtaLink),
    photos: normalizeGalleryPhotos(rawSource, maxPhotos),
  };
}
