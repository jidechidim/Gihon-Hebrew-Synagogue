"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../layout";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function AdminNewsList() {
  const session = useContext(SessionContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!session) return;
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load news: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [session]);

  if (!session) return <p>Checking access…</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>News Admin</h2>
      <Link href="/admin/news/new">
        <button style={{ marginBottom: "1rem" }}>Add News Article</button>
      </Link>

      {loading && <p>Loading news…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>ID</th>
              <th>Date</th>
              <th>Title</th>
              <th>Summary</th>
              <th>Content</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #ccc" }}>
                <td>{item.id}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/news/${item.id}`}>{item.title}</Link>
                </td>
                <td>{item.summary}</td>
                <td>{item.content}</td>
                <td>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
