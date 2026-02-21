import CTAButton from "../../components/CTAButton";
import "./events.css";
import { createSupabaseServerClient } from "@lib/supabase/server-client";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error loading events:", err);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="page">
      <section className="events-head" aria-labelledby="eventsTitle">
        <div className="container narrow center">
          <h1 id="eventsTitle" className="page-title">Upcoming Events</h1>
        </div>
      </section>

      <section className="events-list" aria-label="Event listings">
        <div className="container" id="eventsContainer">
          {events.length === 0 ? (
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
                  <CTAButton
                    href={`/register?eventId=${ev.id}`}
                    variant="secondary"
                    className="btn-sm"
                  >
                    Register
                  </CTAButton>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
