"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../layout";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function AdminEventsList() {
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
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events: " + err.message);
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
      <h2>Events Admin</h2>
      <Link href="/admin/events/new">
        <button style={{ marginBottom: "1rem" }}>Add Event</button>
      </Link>

      {loading && <p>Loading events…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Summary</th>
              <th>Register URL</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #ccc" }}>
                <td>{item.id}</td>
                <td>
                  <Link href={`/admin/events/${item.id}`}>{item.title}</Link>
                </td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.location}</td>
                <td>{item.summary}</td>
                <td>
                  {item.register_url && (
                    <a href={item.register_url} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  )}
                </td>
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
