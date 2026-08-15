// Reads structured listings from your Bright Data Scraper Studio collector.
// This version matches the REAL fields your rozee.pk collector returns:
// job_title, company_name, job_description, product_page_url
// (There is no contact_email or company_website in the current data,
// so scam rules below work from description text instead.)

const DATA_URL = "data/listings.json";

const grid = document.getElementById("results-grid");
const lastUpdated = document.getElementById("lastUpdated");
const statusBanner = document.getElementById("status-banner");
const statusText = document.getElementById("statusText");
const refreshBtn = document.getElementById("refreshBtn");
const filterButtons = document.querySelectorAll(".filter");

let allListings = [];
let currentFilter = "all";

// --- SCAM DETECTION RULES ---
// Rewritten to work only from job_title + job_description text,
// since that's what the real collector output contains.
const RULES = [
  {
    id: "pay_to_apply",
    test: (l) => /registration fee|processing fee|deposit required|pay.*(to start|to apply)/i.test(l.job_description || ""),
    weight: 3,
    label: "Mentions a fee to apply/start",
  },
  {
    id: "too_good",
    test: (l) => /guaranteed (high )?(pay|salary|income)|no experience.*high (pay|salary)|easy work.*high (pay|salary)/i.test(l.job_description || ""),
    weight: 3,
    label: "Unrealistic pay promises",
  },
  {
    id: "vague_description",
    test: (l) => (l.job_description || "").split(" ").length < 20,
    weight: 2,
    label: "Very vague description",
  },
  {
    id: "no_qualifications",
    test: (l) => !/qualification|requirement|experience|degree|skill/i.test(l.job_description || ""),
    weight: 1,
    label: "No listed requirements or qualifications",
  },
  {
    id: "urgent_pressure",
    test: (l) => /urgent(ly)? hiring|apply immediately|limited seats|hurry/i.test(l.job_description || ""),
    weight: 1,
    label: "Uses urgency/pressure language",
  },
  {
    id: "symbolic_salary",
    test: (l) => /salary (is|of)?\s*1\s*PKR|stipend (is|of)?\s*1\s*PKR|1 PKR/i.test(l.job_description || ""),
    weight: 3,
    label: "Symbolic or near-zero salary",
  },
  {
    id: "requires_payment_for_program",
    test: (l) => /program fee|one-time (program )?fee|training fee/i.test(l.job_description || ""),
    weight: 3,
    label: "Requires paying a program/training fee",
  },
];

function scoreListing(listing) {
  const triggered = RULES.filter((rule) => rule.test(listing));
  const score = triggered.reduce((sum, r) => sum + r.weight, 0);
  return {
    score,
    flags: triggered.map((r) => r.label),
    verdict: score >= 3 ? "suspicious" : "verified",
  };
}

async function loadData() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const raw = await res.json();

    // Skip entries that are crawl errors (no job_title present) —
    // these are the "self-healing" failed attempts, not real listings.
    const validEntries = raw.filter((entry) => entry.job_title);

    allListings = validEntries.map((l) => ({ ...l, ...scoreListing(l) }));
    renderResults();
    updateSummary();

    const skipped = raw.length - validEntries.length;
    const skippedNote = skipped > 0 ? ` (${skipped} pages failed to load — scraper is self-healing)` : "";
    showStatus(`✅ Scanned ${allListings.length} listings${skippedNote}`, false);
  } catch (err) {
    console.error(err);
    showStatus("⚠️ Could not load listings — scraper may be healing itself. Try again shortly.", true);
  }
  lastUpdated.textContent = `Last scanned: ${new Date().toLocaleTimeString()}`;
}

function renderResults() {
  grid.innerHTML = "";
  const filtered = allListings.filter(
    (l) => currentFilter === "all" || l.verdict === currentFilter
  );
  filtered.forEach((l) => {
    const card = document.createElement("div");
    card.className = `result-card ${l.verdict}`;
    const shortDesc = (l.job_description || "").slice(0, 140) + "...";
    card.innerHTML = `
      <h3>${l.job_title}</h3>
      <p>${l.company_name || "Unknown company"}</p>
      <p>${shortDesc}</p>
      <span class="badge ${l.verdict}">${l.verdict === "suspicious" ? "🚩 Suspicious" : "✅ Verified"}</span>
      ${l.flags.length ? `<div class="flags">${l.flags.map((f) => `<span class="flag-tag">${f}</span>`).join("")}</div>` : ""}
      ${l.product_page_url ? `<p><a href="${l.product_page_url}" target="_blank" style="color:#6ee7b7;">View listing →</a></p>` : ""}
    `;
    grid.appendChild(card);
  });
}

function updateSummary() {
  document.getElementById("totalCount").textContent = allListings.length;
  document.getElementById("verifiedCount").textContent = allListings.filter((l) => l.verdict === "verified").length;
  document.getElementById("suspiciousCount").textContent = allListings.filter((l) => l.verdict === "suspicious").length;
}

function showStatus(message, isError) {
  statusBanner.classList.remove("hidden");
  statusBanner.classList.toggle("error", isError);
  statusText.textContent = message;
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderResults();
  });
});

refreshBtn.addEventListener("click", loadData);
window.addEventListener("DOMContentLoaded", loadData);
