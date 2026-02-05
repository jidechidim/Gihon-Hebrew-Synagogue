"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase/client";
import "./events.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Unable to load events at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="page">
      {/* ===== PAGE HEADER ===== */}
      <section className="events-head" aria-labelledby="eventsTitle">
        <div className="container narrow center">
          <h1 id="eventsTitle">Upcoming Events</h1>
        </div>
      </section>

      {/* ===== EVENTS LIST ===== */}
      <section className="events-list" aria-label="Event listings">
        <div className="container" id="eventsContainer">
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p>{error}</p>
          ) : events.length === 0 ? (
            <p>No upcoming events at the moment.</p>
          ) : (
            events.map((ev) => (
              <article key={ev.id} className="event">
                <div className="event-media">
                  {ev.image && <img src={ev.image} alt={ev.title} />}
                </div>
                <div className="event-body">
                  <h3 className="event-title">{ev.title}</h3>
                  {ev.summary && <p className="event-desc">{ev.summary}</p>}
                  <ul className="event-meta">
                    <li>
                      <span className="dot" aria-hidden="true"></span>{" "}
                      {new Date(ev.date).toLocaleString()}
                    </li>
                    {ev.location && (
                      <li>
                        <span className="dot" aria-hidden="true"></span>{" "}
                        {ev.location}
                      </li>
                    )}
                  </ul>

                  {/* REGISTER BUTTON — ALWAYS PRESENT */}
                  <a
                    className="btn btn-sm btn-outline"
                    href={`/register?eventId=${ev.id}`}
                  >
                    Register
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
