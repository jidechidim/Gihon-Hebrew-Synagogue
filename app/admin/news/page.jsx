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

  const loadData = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error loading news:", err.message);
      alert("Failed to load news: " + err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [session]);

  if (!session) return <p>Checking access…</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>News</h2>
      <Link href="/admin/news/new">
        <button>Add News Article</button>
      </Link>

      <ul style={{ marginTop: "1rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <Link href={`/admin/news/${item.id}`}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
