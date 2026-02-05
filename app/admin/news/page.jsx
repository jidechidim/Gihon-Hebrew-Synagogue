"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../layout";
import AdminContainer from "../components/AdminContainer";

export const runtime = "nodejs";
const supabase = createClientComponentClient();

const boxStyle = {
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: 16,
  marginBottom: 24,
};

export default function AdminNewsList() {
  const session = useContext(SessionContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!session) return;

    const load = async () => {
      setLoading(true);
      let query = supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (search) query = query.ilike("title", `%${search}%`);
      if (filterDate) query = query.eq("date", filterDate);

      const { data, error } = await query;
      if (error) setError(error.message);
      else setItems(data || []);
      setLoading(false);
    };

    load();
  }, [session, search, filterDate]);

  if (!session) return <p>Checking access…</p>;

  return (
    <AdminContainer title="News Page Editor">
      {/* HEADER + FILTERS */}
      <section style={boxStyle}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h3>News</h3>
          <Link href="/admin/news/new">
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Add News
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={() => {
              setSearch("");
              setFilterDate("");
            }}
            className="bg-gray-400 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
      </section>

      {/* NEWS LIST */}
      <section style={boxStyle}>
        {loading && <p>Loading news…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>

            {/* Mobile */}
            <div className="md:hidden mt-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded p-4 mb-4">
                  {item.image && (
                    <img
                      src={item.image}
                      className="admin-event-image mb-2"
                      alt={item.title}
                    />
                  )}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm my-1">
                    🗓 {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{item.summary}</p>
                  <Link href={`/admin/news/${item.id}`}>
                    <button style={{ marginBottom: "50px" }} className="w-full mt-2 bg-green-600 text-white py-1 rounded">
                      Edit News
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </AdminContainer>
  );
}
