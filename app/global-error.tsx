"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <html>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          background: "var(--paper)",
          color: "var(--ink)",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2.4rem", marginBottom: "1rem", color: "var(--brand-900)" }}>
          Something Went Wrong
        </h1>

        <p style={{ maxWidth: "480px", marginBottom: "2rem", color: "var(--muted)", lineHeight: 1.6 }}>
          An unexpected error occurred. It’s not your fault — let’s try that again and keep things running smoothly.
        </p>

        <button
          onClick={() => reset()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "var(--brand)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
