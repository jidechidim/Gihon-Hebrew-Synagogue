export default function NotFound() {
  return (
    <html>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--paper)",
          padding: "40px",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          color: "var(--ink)",
        }}
      >
        <h1 style={{ fontSize: "2.4rem", marginBottom: "1rem", color: "var(--brand-900)" }}>
          Page Not Found
        </h1>

        <p style={{ maxWidth: "460px", marginBottom: "2rem", color: "var(--muted)" }}>
          The page you're looking for doesn't exist — or maybe it ascended.  
          Let’s bring you back to safer ground.
        </p>

        <a
          href="/"
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            background: "var(--brand)",
            color: "white",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          Go Home
        </a>
      </body>
    </html>
  );
}
