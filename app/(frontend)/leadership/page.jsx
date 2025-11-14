"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "/public/css/leadership.css";

const supabase = createClientComponentClient();

export default function LeadershipPage() {
  const [hero, setHero] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLeadership() {
      try {
        const { data, error } = await supabase
          .from("pages_content")
          .select("data")
          .eq("slug", "leadership")
          .single();

        if (error) throw error;

        const { hero, members } = data?.data || {};
        setHero(hero || null);
        setMembers(members || []);
      } catch (err) {
        console.error("❌ Failed to load leadership data:", err);
        setError("Unable to load leadership data at the moment.");
      }
    }

    loadLeadership();
  }, []);

  if (error)
    return (
      <main className="page container py-12 text-center text-red-600">
        {error}
      </main>
    );

  if (!hero || members.length === 0)
    return (
      <main className="page container py-12 text-center text-gray-500">
        Loading leadership data...
      </main>
    );

  return (
    <main className="page">
      {/* Hero Section */}
      <section className="council-hero py-12">
        <div className="container narrow center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">
              Our Board and Executive Council
            </h1>
            <figure className="hero-figure">
              <img
                src={hero.image}
                alt={hero.alt || "Leadership image"}
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="members py-12">
        <div className="container narrow center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold" id="membersTitle">
              Our Members
            </h2>
          </div>

          <ul className="members-grid">
            {members.map((m, index) => (
              <li
                key={m.id || index}
                className={`member text-center ${
                  m.solo ? "member--solo" : ""
                }`}
              >
                <figure className="flex flex-col items-center">
                  <img
                    className="avatar w-40 h-40 object-cover rounded-full shadow"
                    src={m.image}
                    alt={m.alt || m.name}
                  />
                  <figcaption className="mt-3 text-center">
                    <strong className="block text-lg">{m.name}</strong>
                    <span className="text-gray-600">{m.role}</span>
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
