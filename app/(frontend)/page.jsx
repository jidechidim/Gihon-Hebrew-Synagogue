import Link from "next/link";
import path from "node:path";
import { readFile } from "node:fs/promises";
import CTAButton from "../components/CTAButton";
import NewsletterForm from "../components/NewsletterForm";
import { createSupabaseServerClient } from "@lib/supabase/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HOME_DATA = {
  hero: {
    title: "Gihon Hebrew Synagogue",
    subtitle: "Promoting Judaic life in Nigeria.",
    image: "/assets/welcomeimage.png",
    cta_text: "Get Involved",
    cta_link: "/getinvolved",
  },
  welcome: {
    title: "Welcome to Gihon Hebrew Synagogue",
    paragraphs: [
      "We are a growing Jewish community dedicated to prayer, learning, and service.",
    ],
    image: "/assets/welcomeimage.png",
    cta_text: "Learn More",
    cta_link: "/about",
  },
  newsletter: {
    title: "Stay Connected",
    description: "Get updates on events, teachings, and community life.",
    placeholder_email: "Enter your email address",
    submit_text: "Subscribe",
  },
};

function mergeHomeData(payload) {
  return {
    ...DEFAULT_HOME_DATA,
    ...(payload || {}),
    hero: { ...DEFAULT_HOME_DATA.hero, ...(payload?.hero || {}) },
    welcome: { ...DEFAULT_HOME_DATA.welcome, ...(payload?.welcome || {}) },
    newsletter: { ...DEFAULT_HOME_DATA.newsletter, ...(payload?.newsletter || {}) },
  };
}

async function getCurrentParsha() {
  try {
    const parshaPath = path.join(process.cwd(), "public", "data", "parsha.json");
    const raw = await readFile(parshaPath, "utf8");
    const items = JSON.parse(raw);

    if (!Array.isArray(items) || items.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentParsha = items.find((item) => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return today >= start && today <= end;
    });

    if (!currentParsha) {
      currentParsha = items.find((item) => {
        const start = new Date(item.startDate);
        start.setHours(0, 0, 0, 0);
        return today < start;
      });
    }

    return currentParsha || items[items.length - 1];
  } catch (err) {
    console.error("Error loading parsha data:", err);
    return null;
  }
}

async function getHomePageData() {
  const supabase = createSupabaseServerClient();
  let homeData = DEFAULT_HOME_DATA;
  let events = [];
  let news = [];

  try {
    const { data, error } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "home")
      .single();

    if (error) throw error;
    homeData = mergeHomeData(data?.data);
  } catch (err) {
    console.error("Error loading homepage content:", err);
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .limit(3);

    if (error) throw error;
    events = data || [];
  } catch (err) {
    console.error("Error loading homepage events:", err);
  }

  try {
    const { data, error } = await supabase
      .from("news")
      .select("id, title, image, summary, date, content")
      .order("date", { ascending: false })
      .limit(5);

    if (error) throw error;
    news = data || [];
  } catch (err) {
    console.error("Error loading homepage news:", err);
  }

  const parsha = await getCurrentParsha();
  return { homeData, events, news, parsha };
}

export default async function HomePage() {
  const { homeData, events, news, parsha } = await getHomePageData();

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
  const welcomeParagraphs = Array.isArray(homeData.welcome?.paragraphs)
    ? homeData.welcome.paragraphs
    : [];

  return (
    <main className="home-page">
      <section className="hero" id="home" aria-label="Hero">
        <picture>
          <img src={homeData.hero.image} alt={homeData.hero.title} className="hero-img" />
        </picture>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>{homeData.hero.title}</h1>
          <p>{homeData.hero.subtitle}</p>
          <div className="hero-ctas">
            <CTAButton href={homeData.hero.cta_link} variant="primary">
              {homeData.hero.cta_text}
            </CTAButton>
            <CTAButton href="/about" variant="secondary">Learn More</CTAButton>
          </div>
        </div>
      </section>

      <section id="parsha" className="section parsha">
        <div className="container narrow">
          <h1 className="section-title">Weekly Parshiyot</h1>

          {parsha ? (
            <blockquote className="parsha-quote">
              <h3 className="parsha-title">{parsha.englishName}</h3>
              <p className="parsha-content">{parsha.shortSummary}</p>
              <div className="parsha-ref">
                <p className="ref">{Array.isArray(parsha.refs) ? parsha.refs.join(", ") : ""}</p>
              </div>
            </blockquote>
          ) : (
            <blockquote className="parsha-quote">
              <h3 className="parsha-title">Weekly Parsha</h3>
              <p className="parsha-content">Parsha summary is not available right now.</p>
            </blockquote>
          )}

          <div className="center">
            <CTAButton href="/parshiyot" variant="secondary">Go to Parshiyot</CTAButton>
          </div>
        </div>
      </section>

      <section id="about-home" className="section about-home">
        <div className="container about-home-content">
          <div className="about-home-text">
            <h2 className="section-title">{aboutTitle}</h2>
            {aboutData.subtitle ? <p className="section-subtitle">{aboutData.subtitle}</p> : null}
            {aboutSummary.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <CTAButton href={aboutCtaLink} variant="secondary">
              {aboutCtaText}
            </CTAButton>
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

      <section id="events" className="section events">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="events-wrapper">
              <div className="cards-3">
                {events.map((ev) => (
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
                        <CTAButton href={`/register?eventId=${ev.id}`} variant="secondary" className="btn-sm">
                          Register
                        </CTAButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="see-more-wrapper">
                <Link href="/events" className="see-more">See More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="welcome" className="welcome section bg-light">
        <div className="container split">
          <div className="split-media">
            <img src={homeData.welcome.image} alt={homeData.welcome.title} />
          </div>
          <div className="split-copy">
            <h2 className="section-title">{homeData.welcome.title}</h2>
            {welcomeParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <CTAButton href={homeData.welcome.cta_link} variant="secondary">
              {homeData.welcome.cta_text}
            </CTAButton>
          </div>
        </div>
      </section>

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
                        isExternal ? (
                          <a href={item.cta_link} className="community-link" target="_blank" rel="noopener noreferrer">
                            {item.cta_text}
                          </a>
                        ) : (
                          <Link href={item.cta_link} className="community-link">
                            {item.cta_text}
                          </Link>
                        )
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="news" className="section latest">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Latest from Gihon</h2>
            <div className="latest-wrapper">
              <div className="latest-grid">
                {news.length > 0 && (
                  <>
                    <article className="feature">
                      <Link href={`/newsarticle?slug=${encodeURIComponent(news[0].id)}`}>
                        <img src={news[0].image} alt={news[0].title} />
                        <div className="feature-meta">
                          <h3>{news[0].title}</h3>
                          <span className="read-more">Read more</span>
                        </div>
                      </Link>
                    </article>
                    <aside className="thumbs">
                      {news.slice(1, 5).map((item) => (
                        <Link
                          key={item.id}
                          className="thumb"
                          href={`/newsarticle?slug=${encodeURIComponent(item.id)}`}
                        >
                          <img src={item.image} alt={item.title} />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </aside>
                  </>
                )}
              </div>
              <div className="see-more-wrapper">
                <Link href="/news" className="see-more">See More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="donate" className="section donate">
        <div className="container narrow center">
          <div className="donate-panel">
            <h2 className="section-title">{donateTitle}</h2>
            <p className="section-subtitle">{donateDescription}</p>
            <div className="hero-ctas donate-ctas">
              <CTAButton href={donatePrimaryLink} variant="secondary" {...donatePrimaryLinkProps}>
                {donatePrimaryText}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter section">
        <div className="container narrow center">
          <h2 className="section-title">
            {homeData.newsletter?.title || "Stay Connected"}
          </h2>
          <p className="section-subtitle">{homeData.newsletter?.description}</p>
          <NewsletterForm
            placeholder={homeData.newsletter?.placeholder_email || "Enter your email address"}
            submitText={homeData.newsletter?.submit_text || "Subscribe"}
          />
        </div>
      </section>
    </main>
  );
}
