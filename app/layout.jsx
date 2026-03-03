// /app/layout.jsx
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata = {
  title: "Gihon Hebrew Synagogue",
  description: "Promoting Judaic life in Nigeria",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
