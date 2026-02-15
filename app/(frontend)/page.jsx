"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase/client";

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

        let currentParsha = data.find(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return today >= start && today <= end;
        });

        if (!currentParsha) {
          currentParsha = data.find(item => {
            const start = new Date(item.startDate);
            start.setHours(0, 0, 0, 0);
            return today < start;
          });
        }

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
  const aboutData = homeData.about || {};
  const aboutParagraphs = Array.isArray(aboutData.paragraphs)
    ? aboutData.paragraphs
    : aboutData.description
      ? [aboutData.description]
      : [];
  const filteredAboutParagraphs = aboutParagraphs.filter(Boolean);
  const aboutTitle = aboutData.title || "Who We Are";
  const aboutSummary =
    filteredAboutParagraphs.length > 0
      ? filteredAboutParagraphs
      : [
          "Gihon Hebrew Synagogue is a growing Jewish community in Nigeria dedicated to Torah life, prayer, education, and service to people seeking spiritual roots and belonging.",
        ];
  const aboutCtaText = aboutData.cta_text || "Learn More";
  const aboutCtaLink = aboutData.cta_link || "/about";
  const aboutImageTop =
    aboutData.image_top ||
    aboutData.image_primary ||
    aboutData.image ||
    aboutData.image_secondary ||
    "/assets/welcomeimage.png";
  const aboutImageBottom =
    aboutData.image_bottom ||
    aboutData.image_secondary ||
    aboutData.image_two ||
    aboutData.image ||
    aboutImageTop;
  const communityData = homeData.community || {};
  const communityItems = Array.isArray(communityData.items) ? communityData.items : [];
  const defaultCommunityItems = [
    { title: "Services", image: "/assets/welcomeimage.png" },
    { title: "Learning", image: "/assets/welcomeimage.png" },
    { title: "Holidays", image: "/assets/welcomeimage.png" },
  ];
  const communityCards = (communityItems.length > 0 ? communityItems : defaultCommunityItems).slice(0, 3);
  const communityTitle = communityData.title || "Our Community";
  const communityDescription =
    communityData.description || "A welcoming space of worship, learning, and connection.";
  const donateData = homeData.donate || {};
  const donateTitle = donateData.title || "Support Jewish Life in Nigeria";
  const donateDescription =
    donateData.description ||
    "Your support helps us sustain worship, education, and outreach for Jewish families across Nigeria.";
  const donatePrimaryLink = donateData.cta_link || "/donate";
  const donatePrimaryText = donateData.cta_text || "Donate";
  const donatePrimaryLinkProps = donatePrimaryLink.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <main className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero" id="home" aria-label="Hero">
        <picture>
          <img src={homeData.hero.image} alt={homeData.hero.title} className="hero-img" />
        </picture>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>{homeData.hero.title}</h1>
          <p>{homeData.hero.subtitle}</p>
          <div className="hero-ctas">
            <a href={homeData.hero.cta_link} className="btn btn-primary">
              {homeData.hero.cta_text}
            </a>
            <a href="/about" className="btn btn-outline">Learn More</a>
          </div>
        </div>
      </section>

      {/* ===== WEEKLY PARSHIYOT ===== */}
      <section id="parsha" className="section parsha">
        <div className="container narrow">
          <h1 className="section-title">Weekly Parshiyot</h1>

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
              <p className="parsha-content">Fetching Parshiyot summary...</p>
              <div className="parsha-ref">
                <p className="ref">Fetching references...</p>
              </div>
            </blockquote>
          )}

          <div className="center">
            <a href="/parshiyot" className="btn btn-outline">Go to Parshiyot</a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about-home" className="section about-home">
        <div className="container about-home-grid">
          <div className="about-home-text">
            <h2 className="section-title">{aboutTitle}</h2>
            {aboutData.subtitle ? <p className="section-subtitle">{aboutData.subtitle}</p> : null}
            {aboutSummary.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <a href={aboutCtaLink} className="btn btn-outline">
              {aboutCtaText}
            </a>
          </div>
          <div className="about-home-media">
            <figure className="about-home-image about-home-image-top">
              <img
                src={aboutImageTop}
                alt={aboutData.image_top_alt || aboutData.image_alt || aboutData.title || "About image"}
              />
            </figure>
            {aboutImageBottom ? (
              <figure className="about-home-image about-home-image-bottom">
                <img
                  src={aboutImageBottom}
                  alt={aboutData.image_bottom_alt || aboutData.image_alt || aboutData.title || "About image"}
                />
              </figure>
            ) : null}
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
            <h2 className="section-title">{homeData.welcome.title}</h2>
            {homeData.welcome.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <a href={homeData.welcome.cta_link} className="btn btn-outline">
              {homeData.welcome.cta_text}
            </a>
          </div>
        </div>
      </section>

      {/* ===== OUR COMMUNITY SECTION ===== */}
      <section id="community" className="section community">
        <div className="container">
          <div className="center community-head">
            <h2 className="section-title">{communityTitle}</h2>
            <p className="section-subtitle">{communityDescription}</p>
          </div>
          <div className="community-grid">
            {communityCards.map((item, index) => {
              const image = item.image || item.photo || item.thumbnail || item.image_url || "";
              const title = item.title || "Community";
              const alt = item.image_alt || title || "Community activity";
              const isExternal = item.cta_link?.startsWith("http");
              const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

              return (
                <article key={`${item.title || "community-item"}-${index}`} className="community-card">
                  {image ? (
                    <img src={image} alt={alt} loading="lazy" />
                  ) : (
                    <div className="community-fallback" aria-hidden="true">
                      {item.title ? item.title.charAt(0) : "C"}
                    </div>
                  )}
                  <div className="community-overlay">
                    <div className="community-overlay-content">
                      <h3>{title}</h3>
                      {item.description ? <p>{item.description}</p> : null}
                      {item.cta_link && item.cta_text ? (
                        <a href={item.cta_link} className="community-link" {...linkProps}>
                          {item.cta_text}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
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

      {/* ===== DONATE SECTION ===== */}
      <section id="donate" className="section donate">
        <div className="container narrow center">
          <div className="donate-panel">
            <h2 className="section-title">{donateTitle}</h2>
            <p className="section-subtitle">{donateDescription}</p>
            <div className="hero-ctas donate-ctas">
              <a href={donatePrimaryLink} className="btn btn-primary" {...donatePrimaryLinkProps}>
                {donatePrimaryText}
              </a>
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
          <p className="section-subtitle">{homeData.newsletter?.description}</p>
          <form
            className="newsletter-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value.trim();
              if (!email) {
                alert("Please enter a valid email.");
                return;
              }

              const formData = new FormData();
              formData.append("email", email);

              try {
                const res = await fetch("https://formspree.io/f/xvgbearn", {
                  method: "POST",
                  body: formData,
                  headers: { Accept: "application/json" },
                });

                if (res.ok) {
                  alert("Thank you for subscribing!");
                  e.target.reset();
                } else {
                  alert("Something went wrong. Please try again.");
                }
              } catch (err) {
                console.error(err);
                alert("Error submitting form. Check your connection.");
              }
            }}
          >
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
