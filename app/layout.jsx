import "./globals.css";

export const metadata = {
  title: "Gihon Hebrew Synagogue",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
