"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminNewsList() {
  const [items, setItems] = useState([]);

  async function loadData() {
    const { data } = await supabase.from("news").select("*").order("id", { ascending: false });
    setItems(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

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
