import Link from "next/link";
import "./donate.css";

const DONATE_LINK = "https://flutterwave.com/pay/YOUR-UNIQUE-ID";

export default function DonatePage() {
  return (
    <main className="page donate-page">
      <section className="donate-hero">
        <div className="container narrow center">
          <h1 className="page-title">Support Gihon Hebrew Synagogue</h1>
          <p className="page-subtitle">
            Your donation helps sustain prayer services, Torah study, youth mentorship,
            community outreach, and pastoral care across our growing congregation.
          </p>
          <div className="donate-hero-actions">
            <a
              href={DONATE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Give Now
            </a>
            <Link href="/getinvolved" className="btn btn-outline">
              Other Ways to Help
            </Link>
          </div>
        </div>
      </section>

      <section className="donate-impact">
        <div className="container">
          <h2 className="section-title center">How Your Giving Helps</h2>
          <div className="donate-impact-grid">
            <article className="donate-impact-card">
              <h3>Worship and Spiritual Life</h3>
              <p>Supports Shabbat gatherings, prayer resources, and festival observances.</p>
            </article>
            <article className="donate-impact-card">
              <h3>Learning and Discipleship</h3>
              <p>Funds Torah classes, study materials, and leadership development for all ages.</p>
            </article>
            <article className="donate-impact-card">
              <h3>Community Care</h3>
              <p>Strengthens outreach, family support, and practical assistance to members in need.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="donate-trust">
        <div className="container narrow">
          <h2 className="section-title center">Giving with Confidence</h2>
          <p className="page-subtitle center">
            We are committed to stewarding every contribution with integrity and accountability.
            If you would like to discuss giving in detail, contact our team.
          </p>
          <div className="center">
            <Link href="mailto:gihonhebrewsynagogue25@gmail.com" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
