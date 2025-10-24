<!-- scripts/parsha.js -->
<script>
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("q");
  const refsElement = document.getElementById("parshaRefs");
  const nameElement = document.getElementById("parshaName");
  const hebrewElement = document.getElementById("parshaHebrew");
  const fullElement = document.getElementById("parshaFull");

  try {
    const response = await fetch("data/parsha.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Failed to load parsha.json");
    const data = await response.json();
    const today = new Date();

    // Find current week's Parsha
    const currentParsha =
      data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .find(p => new Date(p.date) <= today) || data[0];

    // Display current Parsha (Weekly)
    if (nameElement) nameElement.textContent = currentParsha.englishName || "Unknown Parsha";
    if (hebrewElement) hebrewElement.textContent = currentParsha.hebrewName || "";
    if (fullElement) fullElement.textContent = currentParsha.summary || "Summary not available.";

    if (Array.isArray(currentParsha.refs)) {
      refsElement.innerHTML = currentParsha.refs
        .map(ref => `<a href="#" class="ref">${ref}</a>`)
        .join(", ");
    } else if (currentParsha.refs) {
      refsElement.innerHTML = `<a href="#" class="ref">${currentParsha.refs}</a>`;
    } else {
      refsElement.textContent = "No references available.";
    }

    // =============================
    // INTERACTIVE SEARCH FEATURE
    // =============================
    if (searchInput) {
      const resultsContainer = document.createElement("section");
      resultsContainer.id = "searchResults";
      resultsContainer.classList.add("parsha-results");
      refsElement.insertAdjacentElement("afterend", resultsContainer);

      // Highlight match helper
      function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      }

      // Render parsha cards
      function renderParshiot(parshiot, query = "") {
        resultsContainer.innerHTML = "";

        if (!parshiot.length) {
          resultsContainer.innerHTML = `<p class="no-results">No matching parsha found.</p>`;
          return;
        }

        parshiot.forEach(p => {
          const card = document.createElement("article");
          card.classList.add("parsha-card");

          const name = highlightMatch(p.englishName, query);
          const hebrew = highlightMatch(p.hebrewName, query);
          const book = highlightMatch(p.book, query);
          const refs = Array.isArray(p.refs)
            ? p.refs.map(r => `<a href="#" class="ref">${r}</a>`).join(", ")
            : `<a href="#" class="ref">${p.refs}</a>`;
          const summary = highlightMatch(p.summary, query);

          card.innerHTML = `
            <h2>${name} <span class="hebrew">${hebrew}</span></h2>
            <p><strong>Book:</strong> ${book}</p>
            <p><strong>Refs:</strong> ${refs}</p>
            <p class="summary">${summary}</p>
          `;

          resultsContainer.appendChild(card);
        });
      }

      // Listen for search input
      searchInput.addEventListener("input", e => {
        const q = e.target.value.trim().toLowerCase();

        // If search is empty, clear explore mode
        if (!q) {
          resultsContainer.innerHTML = "";
          return;
        }

        const filtered = data.filter(p =>
          p.englishName.toLowerCase().includes(q) ||
          p.hebrewName.toLowerCase().includes(q) ||
          p.book.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
        );

        renderParshiot(filtered, q);
      });
    }

  } catch (error) {
    console.error("Error loading Parsha data:", error);
    if (fullElement)
      fullElement.textContent =
        "Sorry, we couldn’t load the Parsha information right now.";
  }
});
</script>
