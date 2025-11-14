// /app/layout.jsx
import { Metadata } from 'next'
import "./globals.css";

export const metadata: Metadata = {
  title: "Gihon Hebrew Synagogue",
  description: "Promoting Judaic life in Nigeria",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
