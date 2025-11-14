// /app/layout.jsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Gihon Hebrew Synagogue</title>
        <link rel="icon" type="image/png" href="/assets/logo.png" />
      </head>
      <body>
        <div className="page-wrapper">
          <Header />
          <main className="page-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
