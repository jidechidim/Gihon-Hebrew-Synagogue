"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";

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
        .order("id", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events.");
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
      <h2>Events</h2>
      <Link href="/admin/events/new">
        <button style={{ marginBottom: "1rem" }}>Add Event</button>
      </Link>

      {loading && <p>Loading events…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: 10 }}>
              <Link href={`/admin/events/${item.id}`}>
                {item.title || "Untitled Event"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
