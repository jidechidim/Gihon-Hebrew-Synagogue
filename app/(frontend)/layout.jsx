// /app/(frontend)/layout.jsx
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FrontendLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
