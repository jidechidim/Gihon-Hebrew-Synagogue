"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase/client";
import { decodeCmsPreviewData } from "@lib/cmsPreview";
import "./leadership.css";

const LEADERSHIP_MEMBER_FALLBACK_IMAGES = [
  "/assets/fallback/leadership/leadershipmembers1.jpg",
  "/assets/fallback/leadership/leadershipmembers2.jpg",
  "/assets/fallback/leadership/leadershipmembers3.jpg",
  "/assets/fallback/leadership/leadershipmembers4.jpg",
  "/assets/fallback/leadership/leadershipmembers5.jpg",
  "/assets/fallback/leadership/leadershipmembers6.jpg",
  "/assets/fallback/leadership/leadershipmembers7.jpg",
  "/assets/fallback/leadership/leadershipmembers8.jpg",
  "/assets/fallback/leadership/leadershipmembers9.jpg",
  "/assets/fallback/leadership/leadershipmembers10.jpg",
];

const LEADERSHIP_FALLBACK_DATA = {
  hero: {
    image: "/assets/fallback/leadership/leadershipimage.jpg",
    alt: "Leadership image",
    figcaption: "",
  },
  members: LEADERSHIP_MEMBER_FALLBACK_IMAGES.map((image, index) => ({
    id: index + 1,
    name: `Member ${index + 1}`,
    role: "Leadership Team",
    image,
    alt: `Leadership member ${index + 1}`,
    solo: false,
  })),
};

function pickNonEmptyString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeHero(rawHero) {
  const source = rawHero && typeof rawHero === "object" ? rawHero : {};

  return {
    image: pickNonEmptyString(source.image, LEADERSHIP_FALLBACK_DATA.hero.image),
    alt: pickNonEmptyString(source.alt, LEADERSHIP_FALLBACK_DATA.hero.alt),
    figcaption: pickNonEmptyString(source.figcaption, ""),
  };
}

function normalizeMembers(rawMembers) {
  const source = Array.isArray(rawMembers) ? rawMembers : [];

  if (source.length === 0) {
    return LEADERSHIP_FALLBACK_DATA.members;
  }

  return source.map((member, index) => {
    const fallbackImage =
      LEADERSHIP_MEMBER_FALLBACK_IMAGES[index % LEADERSHIP_MEMBER_FALLBACK_IMAGES.length];
    const name = pickNonEmptyString(member?.name, `Member ${index + 1}`);

    return {
      id: member?.id ?? index + 1,
      name,
      role: pickNonEmptyString(member?.role, "Leadership Team"),
      image: pickNonEmptyString(member?.image, fallbackImage),
      alt: pickNonEmptyString(member?.alt, name),
      solo: Boolean(member?.solo),
    };
  });
}

function normalizeLeadershipData(rawData = {}) {
  return {
    hero: normalizeHero(rawData.hero),
    members: normalizeMembers(rawData.members),
  };
}

export default function LeadershipPage() {
  const initialFallback = normalizeLeadershipData();
  const [hero, setHero] = useState(initialFallback.hero);
  const [members, setMembers] = useState(initialFallback.members);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get("cmsPreview") === "1";
    const previewPayload = params.get("previewData");

    if (isPreview && previewPayload) {
      const previewData = decodeCmsPreviewData(previewPayload);

      if (previewData && typeof previewData === "object") {
        const normalized = normalizeLeadershipData(previewData);
        setHero(normalized.hero);
        setMembers(normalized.members);
        return;
      }
    }

    async function loadLeadership() {
      try {
        const { data, error } = await supabase
          .from("pages_content")
          .select("data")
          .eq("slug", "leadership")
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        const normalized = normalizeLeadershipData(data?.data || {});
        setHero(normalized.hero);
        setMembers(normalized.members);
      } catch (err) {
        console.info("Leadership fallback in use:", err);
      }
    }

    loadLeadership();
  }, []);

  return (
    <main className="page">
      <section className="council-hero py-12">
        <div className="container narrow center">
          <div className="text-center">
            <h1 className="page-title text-3xl font-bold mb-6">
              Our Board and Executive Council
            </h1>
            <figure className="hero-figure">
              <img src={hero.image} alt={hero.alt || "Leadership image"} />
              {hero.figcaption ? <figcaption>{hero.figcaption}</figcaption> : null}
            </figure>
          </div>
        </div>
      </section>

      <section className="members py-12">
        <div className="container narrow center">
          <div className="text-center mb-8">
            <h2 className="page-title text-2xl font-semibold" id="membersTitle">
              Our Members
            </h2>
          </div>

          <ul className="members-grid">
            {members.map((member, index) => (
              <li
                key={member.id || index}
                className={`member text-center ${member.solo ? "member--solo" : ""}`}
              >
                <figure className="flex flex-col items-center">
                  <img
                    className="avatar w-40 h-40 object-cover rounded-full shadow"
                    src={member.image}
                    alt={member.alt || member.name}
                  />
                  <figcaption className="mt-3 text-center">
                    <strong className="block text-lg">{member.name}</strong>
                    <span className="text-gray-600">{member.role}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
