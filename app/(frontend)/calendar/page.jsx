"use client";

import { useEffect, useState } from "react";
import "./calendar.css";

export default function CalendarPage() {
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const year = new Date().getFullYear(); // current year
        const res = await fetch(
          `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=geoname&geonameid=2332459`
        );
        if (!res.ok) throw new Error("Failed to fetch calendar");
        const data = await res.json();

        if (!data.items || data.items.length === 0)
          throw new Error("No calendar items found");

        setCalendarItems(data.items.slice(0, 10));
      } catch (err) {
        console.error("Calendar load failed", err);
        setError("Unable to load calendar at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  return (
    <main className="page">
      <section className="calendar-head" aria-labelledby="calendarTitle">
        <div className="container narrow center">
          <h1 id="calendarTitle">Jewish Calendar</h1>
          <p className="lede">
            Upcoming holidays, parsha readings, and candle-lighting times.
          </p>
        </div>
      </section>

      <section id="calendar" className="calendar section">
        <div className="container narrow center">
          {loading ? (
            <ul className="calendar-list">
              <li>Loading calendar...</li>
            </ul>
          ) : error ? (
            <ul className="calendar-list">
              <li>{error}</li>
            </ul>
          ) : (
            <ul className="calendar-list">
              {calendarItems.map((item, i) => (
                <li key={i} className="calendar-item">
                  <strong>{item.title}</strong>
                  <span>{new Date(item.date).toDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
