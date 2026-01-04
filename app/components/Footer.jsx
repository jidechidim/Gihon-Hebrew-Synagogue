"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="donate">
      <div className="container footer-grid">
        <div className="foot-brand">
          <div className="logo-badge">
            <Image
              src="/assets/logo.png"
              alt="Gihon logo"
              width={64}
              height={64}
            />
          </div>
          <p>Promoting Judaic life in Nigeria.</p>
        </div>

        <div className="foot-col">
          <h4>About Us</h4>
          <ul>
            <li><Link href="/about#mission">Mission and Vision</Link></li>
            <li><Link href="/leadership">Leadership Team</Link></li>
            <li><Link href="/news">News</Link></li>
          </ul>
        </div>

        <div className="foot-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/parshiyot">Weekly Parshiyot</Link></li>
            <li><a href="https://flutterwave.com/pay/YOUR-UNIQUE-ID">Donate</a></li>
            <li><Link href="/calendar">Calendar</Link></li>
          </ul>
        </div>

        <div className="foot-col">
          <h4>Contact</h4>
          <ul>
            <li>17 Grace Pavilon Street, Prayer Road, Jikwoyi Phase II, Jikwoyi, FCT-Abuja</li>
            <li><a href="mailto:gihonhebrewsynagogue25@gmail.com">gihonhebrewsynagogue25@gmail.com</a></li>
            <li><a href="tel:+2348033238539">+234 803 323 8539</a></li>
            <li><a href="tel:+2348060831801">+234 806 083 1801</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <small>© {year} Gihon Hebrew Synagogue. All rights reserved.</small>
      </div>
    </footer>
  );
}
