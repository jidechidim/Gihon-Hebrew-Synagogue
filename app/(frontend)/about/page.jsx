"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import "./about.css";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from("pages_content")
          .select("data")
          .eq("slug", "about")
          .single();

        if (error) throw error;
        setAboutData(data?.data);
      } catch (err) {
        console.error("Error loading About page data:", err);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData)
    return (
      <main className="container">
        <p>Loading About page...</p>
      </main>
    );

  return (
    <main className="page" id="main">
      {/* ===== INTRO SECTION ===== */}
      <section className="intro" aria-labelledby="aboutTitle">
        <div className="container narrow center" id="intro-section">
          <h1 id="aboutTitle">{aboutData.intro.title}</h1>
          <p className="lede">{aboutData.intro.lede}</p>
          <figure className="hero-figure">
            <img
              src={aboutData.intro.image}
              alt={aboutData.intro.image_alt || "About Image"}
            />
          </figure>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="mv" aria-labelledby="mvTitle">
        <div className="container narrow center" id="mv-section">
          <h2 id="mvTitle">Our Mission and Vision</h2>
          <div className="mv-grid">
            <article className="mv-card">
              <h3>{aboutData.mission_vision.mission.title}</h3>
              <p>{aboutData.mission_vision.mission.text}</p>
            </article>
            <article className="mv-card">
              <h3>{aboutData.mission_vision.vision.title}</h3>
              <p>{aboutData.mission_vision.vision.text}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="values" aria-labelledby="valuesTitle">
        <div className="container narrow center" id="values-section">
          <h2 id="valuesTitle">Our Values</h2>
          <p className="values-kicker">
            At Gihon Hebrew Synagogue, we are guided by a set of core values:
          </p>
          <div className="values-grid">
            {aboutData.values.map((val, i) => (
              <blockquote key={i} className="value">
                <span className="quo open">“</span>
                <p>{val}</p>
                <span className="quo close">”</span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOARD ===== */}
      <section className="board" aria-labelledby="boardTitle">
        <div className="container narrow center" id="board-section">
          <h2 id="boardTitle">Our Board and Executive Council</h2>
          <figure className="board-figure">
            <img
              src={aboutData.board.image}
              alt={aboutData.board.image_alt || "Board Photo"}
            />
            <figcaption>{aboutData.board.caption}</figcaption>
          </figure>
          <a href={aboutData.board.cta_link} className="btn btn-outline btn-sm">
            {aboutData.board.cta_text}
          </a>
        </div>
      </section>
    </main>
  );
}
