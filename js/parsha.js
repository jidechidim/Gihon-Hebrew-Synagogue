// parsha.js
document.addEventListener("DOMContentLoaded", async () => {
  const isParshaPage = window.location.pathname.includes("parsha.html");

  try {
    // Use root-relative path for production
    const res = await fetch("/data/parsha.json");
    if (!res.ok) throw new Error("Failed to load parsha.json");
    const parshas = await res.json();

    // Determine current week
    const startDate = new Date("2025-10-18T00:00:00Z"); // Bereishit 5786
    const now = new Date();
    let diffWeeks = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
    diffWeeks = diffWeeks < 0 ? 0 : diffWeeks % parshas.length;

    const current = parshas[diffWeeks];

    if (isParshaPage) {
      // Full Parsha page
      const parshaNameEl = document.getElementById("parshaName");
      const parshaHebrewEl = document.getElementById("parshaHebrew");
      const parshaFullEl = document.getElementById("parshaFull");
      const parshaRefsEl = document.getElementById("parshaRefs");

      if (parshaNameEl) parshaNameEl.textContent = current.englishName || "Unknown Parsha";
      if (parshaHebrewEl) parshaHebrewEl.textContent = current.hebrewName || "—";
      if (parshaFullEl) parshaFullEl.textContent = current.summary || current.summary || "No summary available.";

      if (parshaRefsEl) {
        parshaRefsEl.innerHTML = current.refs?.length
          ? current.refs.map(ref => `<a href="#" class="ref">${ref}</a>`).join(", ")
          : "No references available.";
      }

    } else {
      // Homepage display
      const titleEl = document.getElementById("parshaName") || document.getElementById("parshaTitle");
      const summaryEl = document.getElementById("parshaSummary");
      const refEl = document.getElementById("parshaRefs");

      if (titleEl) titleEl.textContent = current.englishName || "Unknown Parsha";
      if (summaryEl) summaryEl.textContent = current.shortSummary || current.summary || "No summary available.";
      if (refEl) {
        refEl.innerHTML = current.refs?.length
          ? current.refs.map(ref => `<a href="#" class="ref">${ref}</a>`).join(", ")
          : "No references available.";

        refEl.style.cursor = "pointer";
        refEl.addEventListener("click", () => (window.location.href = "./parsha.html"));
      }
    }

  } catch (err) {
    console.error("❌ Error loading Parsha:", err);

    // Fallback text
    const fallbackText = "Unable to load Parsha. Please try again later.";
    if (isParshaPage) {
      const parshaNameEl = document.getElementById("parshaName");
      const parshaFullEl = document.getElementById("parshaFull");
      const parshaRefsEl = document.getElementById("parshaRefs");
      if (parshaNameEl) parshaNameEl.textContent = fallbackText;
      if (parshaFullEl) parshaFullEl.textContent = "";
      if (parshaRefsEl) parshaRefsEl.textContent = "";
    } else {
      const titleEl = document.getElementById("parshaName") || document.getElementById("parshaTitle");
      const summaryEl = document.getElementById("parshaSummary");
      const refEl = document.getElementById("parshaRefs");
      if (titleEl) titleEl.textContent = fallbackText;
      if (summaryEl) summaryEl.textContent = "";
      if (refEl) refEl.textContent = "";
    }
  }
});
