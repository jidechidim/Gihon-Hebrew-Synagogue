"use client";

import { useEffect, useState } from "react";
import "./parshiyot.css";

export default function ParshaPage() {
  const [parsha, setParsha] = useState({
    englishName: "Loading Parsha...",
    hebrewName: "",
    refs: [],
    summary: "Loading full text...",
  });

  useEffect(() => {
    const fetchParsha = async () => {
      try {
        const res = await fetch("/data/parsha.json");
        if (!res.ok) throw new Error("Failed to load Parsha data");
        const data = await res.json();

        const today = new Date();
        // Normalize today to midnight (local timezone issues cause mismatches)
        today.setHours(0, 0, 0, 0);

        // 1) Try to find parsha where today is between start & end
        let currentParsha = data.find(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return today >= start && today <= end;
        });

        // 2) If no match, find the next upcoming parsha
        if (!currentParsha) {
          currentParsha = data.find(item => {
            const start = new Date(item.startDate);
            start.setHours(0, 0, 0, 0);
            return today < start;
          });
        }

        // 3) Absolute fallback
        if (!currentParsha) currentParsha = data[data.length - 1];

        setParsha({
          englishName: currentParsha.englishName || "No Name",
          hebrewName: currentParsha.hebrewName || "",
          refs: Array.isArray(currentParsha.refs)
            ? currentParsha.refs.map(ref => ({ text: ref, href: "#" }))
            : [],
          summary: currentParsha.summary || "No full text available",
        });
      } catch (error) {
        console.error(error);
        setParsha({
          englishName: "Unable to load Parsha",
          hebrewName: "",
          refs: [{ text: "Error loading references", href: "#" }],
          summary: "Error loading full text...",
        });
      }
    };

    fetchParsha();
  }, []);

  return (
    <div className="page">
      {/* Parsha Header */}
      <section className="parsha-header" aria-labelledby="parshaName">
        <div className="container narrow center">
          <h1 id="parshaName">{parsha.englishName}</h1>
          <h3 id="parshaHebrew">{parsha.hebrewName}</h3>
          <p className="refs" id="parshaRefs">
            {parsha.refs?.map((ref, i) => (
              <a key={i} href={ref.href} className="ref">
                {ref.text}
              </a>
            ))}
          </p>
        </div>
      </section>

      {/* Full Parsha Text */}
      <section className="section parsha">
        <div className="container narrow">
          <blockquote className="parsha-quote" cite="#">
            <p id="parshaFull">{parsha.summary}</p>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
