"use client";

import { useEffect, useRef, useState } from "react";

const LOCATIONS = {
  Abuja: "2352778",
  Lagos: "2332459",
  Jerusalem: "281184",
  "New York": "5128581",
  London: "2643743",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarClient({ initialItems = [], defaultLocation = LOCATIONS.Abuja }) {
  const [items, setItems] = useState(initialItems);
  const [location, setLocation] = useState(defaultLocation);
  const [month, setMonth] = useState("");
  const [parshaOnly, setParshaOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const didMountRef = useRef(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city === "Lagos") setLocation(LOCATIONS.Lagos);
        if (data.city === "Abuja") setLocation(LOCATIONS.Abuja);
      })
      .catch(() => {});
  }, []);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        geonameid: location,
        ...(month && { month }),
        ...(parshaOnly && { parsha: "true" }),
      });

      const res = await fetch(`/api/calendar?${params}`);
      if (!res.ok) return;

      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Calendar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    fetchCalendar();
  }, [location, month, parshaOnly]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="synagogue-calendar">
      <header className="calendar-hero">
        <h1>Community Jewish Calendar</h1>
        <p>Stay connected with sacred times and community observances.</p>
      </header>

      <div className="calendar-controls">
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          {Object.entries(LOCATIONS).map(([city, id]) => (
            <option key={id} value={id}>{city}</option>
          ))}
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All Months</option>
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={parshaOnly}
            onChange={() => setParshaOnly(!parshaOnly)}
          />
          Parsha Only
        </label>

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={`calendar-grid${loading ? " is-loading" : ""}`}>
        {filteredItems.map((item) => (
          <div key={item.id} className="calendar-card">
            <div className="calendar-date">
              {new Date(item.date).toLocaleDateString()}
            </div>
            {item.hebrewDate && (
              <div className="hebrew-date">
                {item.hebrewDate}
              </div>
            )}
            <div className="calendar-title">{item.title}</div>
            {item.category && (
              <span className="calendar-badge">{item.category}</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
