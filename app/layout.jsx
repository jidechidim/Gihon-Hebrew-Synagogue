// /app/layout.jsx
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
