// assumes EVENTS_DATA is available globally from events-data.js

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.querySelector("#eventsTable tbody");

function updateCount(count) {
  const countEl = document.getElementById("eventsCount");
  countEl.textContent = `Showing ${count} event${count !== 1 ? "s" : ""}`;
}

// 1) Populate category dropdown (unique categories)
function initCategories() {
  const categories = Array.from(
    new Set(EVENTS_DATA.map(e => e.category).filter(Boolean))
  ).sort();

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// 2) Render table rows based on a list of events
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(event => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = event.eventName;

    const categoryTd = document.createElement("td");
    categoryTd.textContent = event.category;

    const descTd = document.createElement("td");
    descTd.textContent = event.description;

    const tagsTd = document.createElement("td");
    tagsTd.textContent = event.supportedTags;

    const refTd = document.createElement("td");
    const link = document.createElement("a");
    link.href = event.reference;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View →";
    refTd.appendChild(link);

    tr.appendChild(nameTd);
    tr.appendChild(categoryTd);
    tr.appendChild(descTd);
    tr.appendChild(tagsTd);
    tr.appendChild(refTd);

    tableBody.appendChild(tr);
  });
}

// 3) Apply search + category filtering
function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;

  const filtered = EVENTS_DATA.filter(e => {
    const matchesCategory = !cat || e.category === cat;

    const haystack = [
      e.eventName,
      e.description,
      e.supportedTags,
      e.category
    ].join(" ").toLowerCase();

    const matchesSearch = !search || haystack.includes(search);

    return matchesCategory && matchesSearch;
  });

  renderTable(filtered);
  updateCount(filtered.length);
}

// 4) Wire up events
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

// 5) Initial load
initCategories();
renderTable(EVENTS_DATA);
updateCount(EVENTS_DATA.length);
