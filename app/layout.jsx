// /app/layout.jsx

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://gihonhebrewsynagogue.org"),

  title: {
    default: "Gihon Hebrew Synagogue",
    template: "%s | Gihon Hebrew Synagogue",
  },

  description: "Promoting Judaic life in Nigeria",

  applicationName: "Gihon Hebrew Synagogue",

  keywords: [
    "Hebrew Synagogue",
    "Judaism",
    "Hebrew",
    "Jewish Community",
    "Torah",
    "Shabbat",
    "Abuja",
    "Nigeria",
    "Hebrew Community Nigeria",
  ],

  authors: [
    {
      name: "Gihon Hebrew Synagogue",
    },
  ],

  creator: "Gihon Hebrew Synagogue",

  publisher: "Gihon Hebrew Synagogue",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ReligiousOrganization",

  "@id": "https://gihonhebrewsynagogue.org/#organization",

  name: "Gihon Hebrew Synagogue",

  url: "https://gihonhebrewsynagogue.org",

  logo: "https://gihonhebrewsynagogue.org/icon.png",

  image: "https://gihonhebrewsynagogue.org/opengraph-image.png",

  description: "Promoting Judaic life in Nigeria",

  address: {
    "@type": "PostalAddress",
    addressLocality: "Abuja",
    addressCountry: "NG",
  },

  sameAs: [
    // Replace these with your real social media links
    "https://www.facebook.com/gihonsynagogue/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  "@id": "https://gihonhebrewsynagogue.org/#website",

  url: "https://gihonhebrewsynagogue.org",

  name: "Gihon Hebrew Synagogue",

  description: "Promoting Judaic life in Nigeria",

  publisher: {
    "@id": "https://gihonhebrewsynagogue.org/#organization",
  },

  inLanguage: "en",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
