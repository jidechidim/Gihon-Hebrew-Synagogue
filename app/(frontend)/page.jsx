"use client";

import { useEffect, useState } from "react";
import { supabase } from "/lib/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [parsha, setParsha] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // ===== Fetch homepage content =====
        const { data: homeRes, error: homeError } = await supabase
          .from("pages_content")
          .select("data")
          .eq("slug", "home")
          .single();
        if (homeError) throw homeError;
        setHomeData(homeRes?.data);

        // ===== Fetch next 3 upcoming events =====
        const { data: eventsRes, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true })
          .limit(3);
        if (eventsError) throw eventsError;
        setEvents(eventsRes || []);

        // ===== Fetch 5 latest news =====
        const { data: newsRes, error: newsError } = await supabase
          .from("news")
          .select("id, title, image, summary, date, content")
          .order("date", { ascending: false })
          .limit(5);
        if (newsError) throw newsError;
        setNews(newsRes || []);

        // ===== Fetch current week's parsha =====
        const parshaRes = await fetch("/data/parsha.json");
        if (!parshaRes.ok) throw new Error("Failed to load Parsha data");

        const data = await parshaRes.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1) find parsha where today is between start & end
        let currentParsha = data.find(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return today >= start && today <= end;
        });

        // 2) if none matches, find the next upcoming parsha
        if (!currentParsha) {
          currentParsha = data.find(item => {
            const start = new Date(item.startDate);
            start.setHours(0, 0, 0, 0);
            return today < start;
          });
        }

        // 3) final fallback
        if (!currentParsha) currentParsha = data[data.length - 1];

        setParsha(currentParsha);

      } catch (err) {
        console.error("Error loading homepage data:", err);
      }
    };

    fetchContent();
  }, []);

  if (!homeData)
    return (
      <main className="container">
        <p>Loading homepage...</p>
      </main>
    );

  const currentParsha = parsha;

  return (
    <main>

      {/* ===== HERO ===== */}
      <section className="hero" id="home" aria-label="Hero">
        <picture>
          <img src={homeData.hero.image} alt={homeData.hero.title} className="hero-img" />
        </picture>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>{homeData.hero.title}</h1>
          <p>{homeData.hero.subtitle}</p>
          <a href={homeData.hero.cta_link} className="btn btn-primary">
            {homeData.hero.cta_text}
          </a>
        </div>
      </section>

      {/* ===== WEEKLY PARSHA ===== */}
      <section id="parsha" className="section parsha">
        <div className="container narrow">
          <h1 className="section-title">Weekly Parsha</h1>

          {currentParsha ? (
            <blockquote className="parsha-quote">
              <h3 className="parsha-title">{currentParsha.englishName}</h3>
              <p className="parsha-content">{currentParsha.shortSummary}</p>
              <div className="parsha-ref">
                <p className="ref">{currentParsha.refs.join(", ")}</p>
              </div>
            </blockquote>
          ) : (
            <blockquote className="parsha-quote">
              <h3 className="parsha-title">Loading...</h3>
              <p className="parsha-content">Fetching Parsha summary...</p>
              <div className="parsha-ref">
                <p className="ref">Fetching references...</p>
              </div>
            </blockquote>
          )}

          <div className="center">
            <a href="/parsha" className="btn btn-outline">Go to Parsha</a>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING EVENTS ===== */}
      <section id="events" className="section events">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="events-wrapper">
              <div className="cards-3">
                {events.map(ev => (
                  <article key={ev.id} className="card">
                    <img src={ev.image} alt={ev.title} />
                    <div className="card-body">
                      <h3>{ev.title}</h3>
                      <p>{ev.summary}</p>
                      <ul className="meta">
                        <li><span className="dot"></span> {new Date(ev.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</li>
                        <li><span className="dot"></span> {new Date(ev.date).toLocaleDateString()}</li>
                        <li><span className="dot"></span> {ev.location}</li>
                      </ul>
                      <div className="card-actions">
                        <a className="btn btn-sm btn-outline" href="/register">Register</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="see-more-wrapper">
                <a href="/events" className="see-more">See More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WELCOME SECTION ===== */}
      <section id="welcome" className="welcome section bg-light">
        <div className="container split">
          <div className="split-media">
            <img src={homeData.welcome.image} alt={homeData.welcome.title} />
          </div>
          <div className="split-copy">
            <h2>{homeData.welcome.title}</h2>
            {homeData.welcome.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <a href={homeData.welcome.cta_link} className="btn btn-outline">
              {homeData.welcome.cta_text}
            </a>
          </div>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section id="news" className="section latest">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Latest from Gihon</h2>
            <div className="latest-wrapper">
              <div className="latest-grid">
                {news.length > 0 && (
                  <>
                    <article className="feature">
                      <a href="/news">
                        <img src={news[0].image} alt={news[0].title} />
                        <div className="feature-meta">
                          <h3>{news[0].title}</h3>
                          <span className="read-more">Read more</span>
                        </div>
                      </a>
                    </article>
                    <aside className="thumbs">
                      {news.slice(1, 5).map(item => (
                        <a key={item.id} className="thumb" href="/news">
                          <img src={item.image} alt={item.title} />
                          <span>{item.title}</span>
                        </a>
                      ))}
                    </aside>
                  </>
                )}
              </div>
              <div className="see-more-wrapper">
                <a href="/news" className="see-more">See More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="newsletter section">
        <div className="container narrow center">
          <h2 className="section-title">
            {homeData.newsletter?.title || "Stay Connected"}
          </h2>
          <p>{homeData.newsletter?.description}</p>
          <form className="newsletter-form">
            <input
              type="email"
              name="email"
              placeholder={homeData.newsletter?.placeholder_email || "Enter your email address"}
              required
            />
            <button type="submit" className="btn btn-primary">
              {homeData.newsletter?.submit_text || "Subscribe"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
