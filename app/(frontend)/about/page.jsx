import CTAButton from "../../components/CTAButton";
import "./about.css";
import { createSupabaseServerClient } from "@lib/supabase/server-client";

export const revalidate = 300;

async function getAboutData() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages_content")
      .select("data")
      .eq("slug", "about")
      .single();

    if (error) throw error;
    return data?.data || null;
  } catch (err) {
    console.error("Error loading About page data:", err);
    return null;
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutData();

  const intro = aboutData?.intro || {
    title: "About Gihon Hebrew Synagogue",
    lede: "Learn more about our community, mission, and leadership.",
    image: "/assets/welcomeimage.png",
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

  const board = aboutData?.board || {
    image: "/assets/welcomeimage.png",
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
            <img src={intro.image} alt={intro.image_alt || "About Image"} />
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
            <img src={board.image} alt={board.image_alt || "Board Photo"} />
            <figcaption>{board.caption}</figcaption>
          </figure>
          <CTAButton href={board.cta_link} variant="secondary" className="btn-sm">
            {board.cta_text}
          </CTAButton>
        </div>
      </section>
    </main>
  );
}
