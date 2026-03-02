import CTAButton from "../../components/CTAButton";
import "./about.css";
import { createSupabaseServerClient } from "@lib/supabase/server-client";
import { decodeCmsPreviewData } from "@lib/cmsPreview";

export const revalidate = 300;

const ABOUT_FALLBACK_IMAGES = {
  intro: "/assets/fallback/about/aboutpageintroimage.jpg",
  board: "/assets/fallback/about/aboutpageboardimage.jpg",
};

const LEGACY_IMAGE_PLACEHOLDERS = new Set([
  "/assets/fallback/about/aboutpageintroimage.jpg",
  "/assets/fallback/about/aboutpageboardimage.jpg",
]);

const DEFAULT_GALLERY = {
  title: "Gallery",
  subtitle: "Moments from our community life.",
  cta_text: "View Full Gallery",
  cta_link: "/gallery",
};

const ABOUT_GALLERY_FALLBACK_IMAGES = [
  {
    image: "/assets/fallback/about/aboutpagegalleryimage1.jpeg",
    image_alt: "Gallery fallback image 1",
    caption: "",
  },
  {
    image: "/assets/fallback/about/aboutpagegalleryimage2.jpeg",
    image_alt: "Gallery fallback image 2",
    caption: "",
  },
  {
    image: "/assets/fallback/about/aboutpagegalleryimage3.jpeg",
    image_alt: "Gallery fallback image 3",
    caption: "",
  },
  {
    image: "/assets/fallback/about/aboutpagegalleryimage4.jpeg",
    image_alt: "Gallery fallback image 4",
    caption: "",
  },
];

function withImageFallback(value, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  if (!normalized || LEGACY_IMAGE_PLACEHOLDERS.has(normalized)) return fallback;
  return normalized;
}

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

function resolvePhotoImage(photo) {
  if (typeof photo === "string") {
    return withImageFallback(photo, "");
  }

  if (!photo || typeof photo !== "object") return "";

  const raw =
    photo.image ||
    photo.url ||
    photo.src ||
    photo.path ||
    photo.publicUrl ||
    photo.public_url ||
    "";

  return withImageFallback(raw, "");
}

function normalizeGalleryPhotos(aboutData) {
  const gallery = aboutData?.gallery;

  const sourcePhotos = Array.isArray(gallery?.photos)
    ? gallery.photos
    : Array.isArray(gallery?.images)
      ? gallery.images
      : Array.isArray(gallery)
        ? gallery
        : Array.isArray(aboutData?.gallery_photos)
          ? aboutData.gallery_photos
          : [];

  return sourcePhotos
    .map((photo) => {
      const image = resolvePhotoImage(photo);
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
}

function buildGalleryData(aboutData) {
  const gallery = aboutData?.gallery && typeof aboutData.gallery === "object"
    ? aboutData.gallery
    : {};

  return {
    title: pickNonEmptyString(gallery.title, DEFAULT_GALLERY.title),
    subtitle: pickNonEmptyString(gallery.subtitle, DEFAULT_GALLERY.subtitle),
    cta_text: pickNonEmptyString(gallery.cta_text, DEFAULT_GALLERY.cta_text),
    cta_link: pickNonEmptyString(gallery.cta_link, DEFAULT_GALLERY.cta_link),
    photos: normalizeGalleryPhotos(aboutData),
  };
}

async function getAboutData() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "about")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.data || null;
  } catch (err) {
    const message = getErrorMessage(err);

    if (isTransientNetworkError(message)) {
      if (process.env.NODE_ENV === "development") {
        console.info("About page: Supabase unreachable, using fallback content.");
      }
      return null;
    }

    console.error("Error loading About page data:", message);
    return null;
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

export default async function AboutPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const previewData = readPreviewData(resolvedSearchParams);
  const aboutData = previewData || (await getAboutData());

  const intro = aboutData?.intro || {
    title: "About Gihon Hebrew Synagogue",
    lede: "Learn more about our community, mission, and leadership.",
    image: ABOUT_FALLBACK_IMAGES.intro,
    image_alt: "About image",
  };

  const mission = aboutData?.mission_vision?.mission || {
    title: "Mission",
    text: "To build a vibrant Torah-centered community rooted in worship, learning, and service.",
  };

  const vision = aboutData?.mission_vision?.vision || {
    title: "Vision",
    text: "To strengthen Jewish life in Nigeria through faith, education, and communal care.",
  };

  const values = Array.isArray(aboutData?.values) && aboutData.values.length > 0
    ? aboutData.values
    : ["Faith", "Community", "Learning", "Service"];

  const gallery = buildGalleryData(aboutData);
  const galleryCtaText = pickNonEmptyString(gallery.cta_text, DEFAULT_GALLERY.cta_text);
  const galleryCtaLink = pickNonEmptyString(gallery.cta_link, DEFAULT_GALLERY.cta_link);
  const galleryPhotos = [...gallery.photos, ...ABOUT_GALLERY_FALLBACK_IMAGES].slice(0, 4);

  const board = aboutData?.board || {
    image: ABOUT_FALLBACK_IMAGES.board,
    image_alt: "Board Photo",
    caption: "Our leadership team serving with dedication.",
    cta_link: "/leadership",
    cta_text: "Meet Leadership",
  };

  return (
    <main className="page" id="main">
      <section className="intro" aria-labelledby="aboutTitle">
        <div className="container narrow center" id="intro-section">
          <h1 id="aboutTitle" className="page-title">{intro.title}</h1>
          <p className="lede page-subtitle">{intro.lede}</p>
          <figure className="hero-figure">
            <img
              src={withImageFallback(intro.image, ABOUT_FALLBACK_IMAGES.intro)}
              alt={intro.image_alt || "About Image"}
            />
          </figure>
        </div>
      </section>

      <section className="mv" aria-labelledby="mvTitle">
        <div className="container narrow center" id="mv-section">
          <h2 id="mvTitle" className="page-title">Our Mission and Vision</h2>
          <div className="mv-grid">
            <article className="mv-card">
              <h3>{mission.title}</h3>
              <p>{mission.text}</p>
            </article>
            <article className="mv-card">
              <h3>{vision.title}</h3>
              <p>{vision.text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="values" aria-labelledby="valuesTitle">
        <div className="container narrow center" id="values-section">
          <h2 id="valuesTitle" className="page-title">Our Values</h2>
          <p className="values-kicker page-subtitle">
            At Gihon Hebrew Synagogue, we are guided by a set of core values:
          </p>
          <div className="values-grid">
            {values.map((val, i) => (
              <blockquote key={i} className="value">
                <span className="quo open">&ldquo;</span>
                <p>{val}</p>
                <span className="quo close">&rdquo;</span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="board" aria-labelledby="boardTitle">
        <div className="container narrow center" id="board-section">
          <h2 id="boardTitle" className="page-title">Our Board and Executive Council</h2>
          <figure className="board-figure">
            <img
              src={withImageFallback(board.image, ABOUT_FALLBACK_IMAGES.board)}
              alt={board.image_alt || "Board Photo"}
            />
            <figcaption>{board.caption}</figcaption>
          </figure>
          <CTAButton href={board.cta_link} variant="secondary" className="btn-sm">
            {board.cta_text}
          </CTAButton>
        </div>
      </section>

      <section className="gallery" aria-labelledby="galleryTitle">
        <div className="container narrow center" id="gallery-section">
          <h2 id="galleryTitle" className="page-title">{gallery.title}</h2>
          {gallery.subtitle ? (
            <p className="values-kicker page-subtitle">{gallery.subtitle}</p>
          ) : null}

          {galleryPhotos.length > 0 ? (
            <div className="gallery-grid">
              {galleryPhotos.map((photo, index) => (
                <figure key={`about-gallery-${index}`} className="gallery-item">
                  <img
                    src={photo.image}
                    alt={photo.image_alt || `Gallery photo ${index + 1}`}
                  />
                  {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : (
            <p className="gallery-empty">No gallery photos added yet.</p>
          )}

          <div className="gallery-actions">
            <CTAButton href={galleryCtaLink} variant="secondary" className="btn-sm">
              {galleryCtaText}
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}