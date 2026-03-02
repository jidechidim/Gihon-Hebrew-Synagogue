import CTAButton from "../../components/CTAButton";
import { createSupabaseServerClient } from "@lib/supabase/server-client";
import { decodeCmsPreviewData } from "@lib/cmsPreview";
import "./donate.css";

export const revalidate = 300;

const DEFAULT_DONATE_DATA = {
  hero: {
    title: "Support Gihon Hebrew Synagogue",
    subtitle:
      "Your donation helps sustain prayer services, Torah study, youth mentorship, community outreach, and pastoral care across our growing congregation.",
    primary_cta_text: "Give Now",
    primary_cta_link: "https://flutterwave.com/pay/YOUR-UNIQUE-ID",
    secondary_cta_text: "Other Ways to Help",
    secondary_cta_link: "/getinvolved",
  },
  impact: {
    title: "How Your Giving Helps",
    items: [
      {
        title: "Worship and Spiritual Life",
        description: "Supports Shabbat gatherings, prayer resources, and festival observances.",
      },
      {
        title: "Learning and Discipleship",
        description: "Funds Torah classes, study materials, and leadership development for all ages.",
      },
      {
        title: "Community Care",
        description: "Strengthens outreach, family support, and practical assistance to members in need.",
      },
    ],
  },
  trust: {
    title: "Giving with Confidence",
    description:
      "We are committed to stewarding every contribution with integrity and accountability. If you would like to discuss giving in detail, contact our team.",
    cta_text: "Contact Us",
    cta_link: "mailto:gihonhebrewsynagogue25@gmail.com",
  },
};

function defaultImpactItem(index) {
  return DEFAULT_DONATE_DATA.impact.items[index] || { title: "", description: "" };
}

function mergeDonateData(payload) {
  const heroSource = payload?.hero || {};
  const impactSource = payload?.impact || {};
  const trustSource = payload?.trust || {};

  const impactItems = Array.from({ length: 3 }, (_, index) => ({
    ...defaultImpactItem(index),
    ...(Array.isArray(impactSource.items) ? impactSource.items[index] : null),
  }));

  return {
    hero: {
      ...DEFAULT_DONATE_DATA.hero,
      ...heroSource,
    },
    impact: {
      ...DEFAULT_DONATE_DATA.impact,
      ...impactSource,
      items: impactItems,
    },
    trust: {
      ...DEFAULT_DONATE_DATA.trust,
      ...trustSource,
    },
  };
}

function getLinkProps(href) {
  if (typeof href !== "string") return {};
  return /^https?:\/\//i.test(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

async function getDonateData() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "donate")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return mergeDonateData(row?.data || {});
  } catch (err) {
    console.error("Error loading Donate page data:", err);
    return DEFAULT_DONATE_DATA;
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

export default async function DonatePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const previewData = readPreviewData(resolvedSearchParams);
  const donateData = previewData ? mergeDonateData(previewData) : await getDonateData();

  return (
    <main className="page donate-page">
      <section className="donate-hero">
        <div className="container narrow center">
          <h1 className="page-title">{donateData.hero.title}</h1>
          <p className="page-subtitle">{donateData.hero.subtitle}</p>
          <div className="donate-hero-actions">
            {donateData.hero.primary_cta_text && donateData.hero.primary_cta_link ? (
              <CTAButton
                href={donateData.hero.primary_cta_link}
                variant="primary"
                {...getLinkProps(donateData.hero.primary_cta_link)}
              >
                {donateData.hero.primary_cta_text}
              </CTAButton>
            ) : null}

            {donateData.hero.secondary_cta_text && donateData.hero.secondary_cta_link ? (
              <CTAButton
                href={donateData.hero.secondary_cta_link}
                variant="secondary"
                {...getLinkProps(donateData.hero.secondary_cta_link)}
              >
                {donateData.hero.secondary_cta_text}
              </CTAButton>
            ) : null}
          </div>
        </div>
      </section>

      <section className="donate-impact">
        <div className="container">
          <h2 className="section-title center">{donateData.impact.title}</h2>
          <div className="donate-impact-grid">
            {donateData.impact.items.map((item, index) => (
              <article key={`donate-impact-${index}`} className="donate-impact-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="donate-trust">
        <div className="container narrow">
          <h2 className="section-title center">{donateData.trust.title}</h2>
          <p className="page-subtitle center">{donateData.trust.description}</p>
          <div className="center">
            {donateData.trust.cta_text && donateData.trust.cta_link ? (
              <CTAButton
                href={donateData.trust.cta_link}
                variant="secondary"
                {...getLinkProps(donateData.trust.cta_link)}
              >
                {donateData.trust.cta_text}
              </CTAButton>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
