"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminEventsList() {
  const [items, setItems] = useState([]);

  async function loadData() {
    const { data } = await supabase.from("events").select("*").order("id", { ascending: false });
    setItems(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Events</h2>
      <Link href="/admin/events/new">
        <button>Add Event</button>
      </Link>

      <ul style={{ marginTop: "1rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <Link href={`/admin/events/${item.id}`}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
