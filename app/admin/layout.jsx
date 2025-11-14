// /app/admin/layout.jsx
import Link from "next/link";

export const metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for managing the site",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: "250px",
          backgroundColor: "#255D99",
          color: "#fff",
          padding: "2rem",
        }}
      >
        <h2>Admin Menu</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
        </ul>
      </aside>

      {/* Main content */}
      <main
        className="admin-main"
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {children}
      </main>
    </div>
  );
}
