export default function AdminContainer({ title, children }) {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "24px 20px 60px",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>{title}</h2>
      {children}
    </div>
  );
}
