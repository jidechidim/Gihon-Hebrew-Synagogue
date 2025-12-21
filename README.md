🕍 Gihon Hebrew Synagogue Platform
A modern, scalable web platform built to power the online presence of Gihon Hebrew Synagogue, including weekly Parsha content, announcements, and community-facing pages.

Designed with clarity, performance, and long-term maintainability in mind.


📘 Overview
This project is a Next.js App Router application built with TypeScript and Tailwind CSS, using a structured data approach to manage religious and community content.
The platform prioritizes:
* Accurate weekly Parsha presentation
* Clean, accessible UI
* A future-ready architecture that can scale with content and features


🧱 Tech Stack

Frontend Framework
* Next.js (App Router)
* React
* TypeScript

Styling
* Tailwind CSS
* Global styles + utility-first layout system

Data Handling
* Scripted data ingestion (import_data.mjs)
* Structured content models (Parsha, events, etc.)

Tooling
* PostCSS
* ESLint
* Modern build pipeline via Next.js


🧠 Technical Decisions
* Next.js (App Router)
Chosen for server-first rendering, clean routing, and production scalability. Supports SEO and performance without architectural rewrites.

* TypeScript
Ensures correctness and clarity when working with structured, date-sensitive content such as weekly Parsha data.

* Tailwind CSS
Enables rapid UI iteration while maintaining visual consistency and preventing CSS sprawl.

* Structured Parsha Modeling
Designed to support date-aware rendering, combined Parshas, and Jewish calendar edge cases — avoiding fragile week-index logic.

* Scripted Data Ingestion (import_data.mjs)
Separates content processing from UI rendering and keeps the system flexible for future data sources.

* Middleware (Intentional Inclusion)
Reserved for future localization, routing rules, or access control without premature complexity.

* Deployment via Vercel / Node Hosting
Leverages native Next.js optimizations for reliability and simplicity in production.


📖 Parsha Content Strategy
The platform is designed to support weekly Torah portions (Parshas) with accuracy and flexibility.

Current Direction
* Parsha data is ingested via scripted logic
* Designed to support date-aware rendering
* Prepared for future enhancement with Jewish calendar logic

Planned Improvements
* Explicit date-range–based Parsha mapping
* Support for combined Parshas
* Alignment with the Jewish calendar (holiday-aware)

This avoids fragile “week index” logic and ensures long-term correctness.


🎨 Design & UX Principles
* Minimalist, respectful visual language
* Clear typography and hierarchy
* Mobile-first layout
* Tailwind-based design tokens to ensure consistency as the platform scales


▶️ Local Development
Prerequisites
* Node.js (v18+ recommended)
* npm or yarn

Setup
git clone <repository-url>
cd gihon-hebrew-synagogue
npm install
npm run dev

Visit:
http://localhost:3000


🚀 Deployment
This project is deployment-ready for:
* Vercel (recommended for Next.js)
* Any Node-compatible hosting environment

Environment variables should be managed via hosting provider settings.
A .env.example file should be used for reference — never commit secrets.


🛠️ Future Enhancements
* SEO metadata & Open Graph support
* Multilingual content (English / Hebrew)
* Events calendar
* Admin-friendly content editing layer
* Sermon audio/video integration

👤 Author
Jidechi Dimunah
Product Designer & Frontend Architect
User-centered. Minimalist. Built to last.

📄 License
Private project — all rights reserved.
