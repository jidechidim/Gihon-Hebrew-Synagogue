// /app/(site)/layout.jsx
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Gihon Hebrew Synagogue",
  description: "Promoting Judaic Life in Nigeria",
};

export default function FrontendLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}
