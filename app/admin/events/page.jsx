"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "@/app/layout";

export const runtime = "nodejs";
const supabase = createClientComponentClient();

export default function AdminEventsList() {
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
      let query = supabase.from("events").select("*").order("date", { ascending: true });

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
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2>Events Admin</h2>
        <Link href="/admin/events/new">
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Add Event
          </button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 my-4">
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
        <button onClick={() => { setSearch(""); setFilterDate(""); }} className="bg-gray-400 text-white px-2 py-1 rounded">
          Clear
        </button>
      </div>

      {loading && <p>Loading events…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* DESKTOP TABLE */}
      {!loading && !error && (
        <div className="desktop-only">
          <table className="w-full border-collapse mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td>
                    <Link href={`/admin/events/${item.id}`} className="text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.location}</td>
                  <td>{item.image && <img src={item.image} className="w-16 h-12 object-cover rounded" alt="" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!loading && !error && (
        <div className="mobile-only mt-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded p-4 mb-4">
              {item.image && <img src={item.image} className="w-full h-40 object-cover rounded mb-2" alt="" />}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm my-1">📅 {new Date(item.date).toLocaleDateString()}</p>
              <p className="text-sm">📍 {item.location}</p>
              <Link href={`/admin/events/${item.id}`}>
                <button className="w-full mt-2 bg-green-600 text-white py-1 rounded hover:bg-green-700">
                  Edit Event
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .desktop-only { display: none; }
        .mobile-only { display: block; }
        @media (min-width: 768px) {
          .desktop-only { display: block; }
          .mobile-only { display: none; }
        }
      `}</style>
    </div>
  );
}
