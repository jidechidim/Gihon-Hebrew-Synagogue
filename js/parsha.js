document.addEventListener("DOMContentLoaded", async () => {
  const isParshaPage = window.location.pathname.includes("parsha.html");

  try {
    const res = await fetch("./data/parsha.json");
    if (!res.ok) throw new Error("Failed to load parsha.json");
    const parshas = await res.json();

    // Calculate current week (starting from Bereishit 2025)
    const startDate = new Date("2025-10-18T00:00:00Z"); // Bereishit 5786
    const now = new Date();
    let diffWeeks = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
    if (diffWeeks < 0) diffWeeks = 0;
    if (diffWeeks >= parshas.length) diffWeeks = diffWeeks % parshas.length;

    const current = parshas[diffWeeks];

    if (isParshaPage) {
      // === Full Parsha page ===
      const parshaNameEl = document.getElementById("parshaName");
      const parshaHebrewEl = document.getElementById("parshaHebrew");
      const parshaFullEl = document.getElementById("parshaFull");
      const parshaRefsEl = document.getElementById("parshaRefs");

      parshaNameEl.textContent = current.englishName;
      parshaHebrewEl.textContent = current.hebrewName;
      parshaFullEl.textContent = current.summary || current.summary || "No summary available.";

      if (current.refs?.length) {
        parshaRefsEl.innerHTML = current.refs.map(ref => `<a href="#" class="ref">${ref}</a>`).join(", ");
      } else {
        parshaRefsEl.textContent = "No references available.";
      }

    } else {
      // === Homepage logic ===
      const titleEl = document.getElementById("parshaName") || document.getElementById("parshaTitle");
      const summaryEl = document.getElementById("parshaSummary");
      const refEl = document.getElementById("parshaRefs");

      if (titleEl) titleEl.textContent = current.englishName;
      if (summaryEl) summaryEl.textContent = current.shortSummary || current.summary || "No summary available.";
      if (refEl) {
        if (current.refs?.length) {
          refEl.innerHTML = current.refs.map(ref => `<a href="#" class="ref">${ref}</a>`).join(", ");
        } else {
          refEl.textContent = "No references available.";
        }
        refEl.style.cursor = "pointer";
        refEl.addEventListener("click", () => (window.location.href = "./parsha.html"));
      }
    }

  } catch (err) {
    console.error("❌ Error loading Parsha:", err);
    if (isParshaPage) {
      document.getElementById("parshaName").textContent = "Unable to load Parsha";
      document.getElementById("parshaFull").textContent = "Please try again later.";
      document.getElementById("parshaRefs").textContent = "";
    } else {
      const titleEl = document.getElementById("parshaName") || document.getElementById("parshaTitle");
      if (titleEl) titleEl.textContent = "Unable to load Parsha";
      const summaryEl = document.getElementById("parshaSummary");
      if (summaryEl) summaryEl.textContent = "";
      const refEl = document.getElementById("parshaRefs");
      if (refEl) refEl.textContent = "";
    }
  }
});
