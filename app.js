/* ══════════════════════════════════════════
   London Live Day App — app.js
   ══════════════════════════════════════════ */

"use strict";

/* ════════════════════════════
   PLAN DATA
════════════════════════════ */
const plan = [
  {
    title:      "Vertrek huis → Purley Oaks",
    time:       "07:55",
    emoji:      "🚶",
    desc:       "6–8 minuten lopen naar het station",
    map:        "https://www.google.com/maps/dir/93+Blenheim+Park+Rd,+South+Croydon/Purley+Oaks+Station,+Brighton+Rd,+South+Croydon",
    streetview: "https://www.google.com/maps/@51.3527,-0.1048,3a,75y/data=!3m1!1e3",
    extra:      null
  },
  {
    title:  "Purley Oaks → King's Cross",
    time:   "08:10",
    emoji:  "🚆",
    desc:   "Trein richting London Bridge, daarna metro naar King's Cross (±45 min totaal)",
    map:    "https://www.google.com/maps/dir/Purley+Oaks+Station,+South+Croydon/King%27s+Cross+St.+Pancras+Station,+London",
    tfl:    "https://tfl.gov.uk/plan-a-journey/results?InputFrom=Purley+Oaks&InputTo=Kings+Cross+St+Pancras",
    extra:  "Neem Southern trein, stap over op metro"
  },
  {
    title:   "Harry Potter Platform 9¾",
    time:    "09:10",
    emoji:   "🧙",
    desc:    "Foto bij de iconische trolley + shop + sfeer opsnuiven",
    map:     "https://www.google.com/maps/search/Platform+9+3%2F4+Kings+Cross+Station+London",
    booking: "https://www.harrypotterplatform934.com/",
    extra:   "Gratis toegang — winkel is betaald"
  },
  {
    title:  "Reis naar South Kensington",
    time:   "10:50",
    emoji:  "🚌",
    desc:   "Bus 73 richting Victoria of metro Piccadilly Line direct naar South Kensington",
    map:    "https://www.google.com/maps/dir/King%27s+Cross+St.+Pancras+Station,+London/South+Kensington+Station,+London",
    tfl:    "https://tfl.gov.uk/plan-a-journey/results?InputFrom=Kings+Cross+St+Pancras&InputTo=South+Kensington",
    extra:  "Piccadilly Line direct, geen overstap"
  },
  {
    title:   "Lunch",
    time:    "11:35",
    emoji:   "🍽",
    desc:    "Brother Marcus Kensington — Mediterranean brunch & lunch",
    map:     "https://www.google.com/maps/search/Brother+Marcus+South+Kensington+London",
    booking: "https://www.opentable.co.uk/r/brother-marcus-south-kensington-london",
    extra:   "Alternatief: Cafe Brera, Cromwell Rd"
  },
  {
    title:   "Natural History Museum",
    time:    "14:00",
    emoji:   "🦖",
    desc:    "Dinosaurussen, Blue Whale Hall, Minerals Gallery",
    map:     "https://www.google.com/maps/place/Natural+History+Museum/@51.4967,-0.1764,17z",
    booking: "https://www.nhm.ac.uk/visit.html",
    extra:   "Gratis entree — geen reservering nodig"
  },
  {
    title:      "St Dunstan in the East",
    time:       "17:15",
    emoji:      "🌿",
    desc:       "Verborgen ruïnetuin midden in de City — een magisch geheim plekje",
    map:        "https://www.google.com/maps/place/St+Dunstan+in+the+East/@51.5098,-0.0834,17z",
    streetview: "https://www.google.com/maps/@51.5098,-0.0834,3a,75y/data=!3m1!1e3",
    extra:      "Gratis, altijd open — perfecte rustpauze"
  },
  {
    title:   "Diner bij Bill's London Bridge",
    time:    "18:30",
    emoji:   "🍽",
    desc:    "Kindvriendelijk diner met gevarieerde kaart",
    map:     "https://www.google.com/maps/search/Bill%27s+Restaurant+London+Bridge",
    booking: "https://www.bills-website.co.uk/restaurants/london-bridge/",
    extra:   "Reserveer vooraf — druk op zaterdag"
  },
  {
    title:  "Terug naar huis",
    time:   "19:50",
    emoji:  "🚆",
    desc:   "London Bridge → Purley Oaks (Southern/Thameslink, ±25 min)",
    map:    "https://www.google.com/maps/dir/London+Bridge+Station,+London/Purley+Oaks+Station,+South+Croydon",
    tfl:    "https://tfl.gov.uk/plan-a-journey/results?InputFrom=London+Bridge&InputTo=Purley+Oaks",
    extra:  "Check live vertrekken via National Rail"
  }
];

/* ════════════════════════════
   DOM REFERENCES
════════════════════════════ */
const appEl      = document.getElementById("app");
const clockEl    = document.getElementById("clock");
const dateEl     = document.getElementById("dateLabel");
const progEl     = document.getElementById("progressFill");
const statDone   = document.getElementById("statDone");
const statActive = document.getElementById("statActive");
const statNext   = document.getElementById("statNext");
const statRemain = document.getElementById("statRemain");

/* ════════════════════════════
   TIME HELPERS
════════════════════════════ */

/**
 * Parse a "HH:MM" string into a Date object for today.
 * @param {string} t - time string e.g. "08:10"
 * @returns {Date}
 */
function parseTime(t) {
  const [h, m] = t.split(":");
  const d = new Date();
  d.setHours(+h, +m, 0, 0);
  return d;
}

/**
 * Difference in whole minutes from → to. Positive = to is in the future.
 * @param {Date} from
 * @param {Date} to
 * @returns {number}
 */
function diffMins(from, to) {
  return Math.floor((to - from) / 60000);
}

/**
 * Format a minute count into a human-readable string.
 * @param {number} mins
 * @returns {string}
 */
function formatDuration(mins) {
  if (mins <= 0) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}u ${m}min` : `${h}u`;
}

/* ════════════════════════════
   RENDER CARDS
════════════════════════════ */
function render() {
  appEl.innerHTML = "";

  plan.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = "card" + i;

    // Build extra link buttons
    let extraBtns = "";

    if (p.tfl) {
      extraBtns += `<a class="btn btn-blue" href="${p.tfl}" target="_blank" rel="noopener noreferrer">🚇 TfL reisplan</a>`;
    }
    if (p.booking) {
      extraBtns += `<a class="btn btn-secondary" href="${p.booking}" target="_blank" rel="noopener noreferrer">🔗 Website</a>`;
    }
    if (p.streetview) {
      extraBtns += `<a class="btn btn-secondary" href="${p.streetview}" target="_blank" rel="noopener noreferrer">📷 Street View</a>`;
    }

    const hintHtml = p.extra
      ? `<div class="card-hint">ℹ ${p.extra}</div>`
      : "";

    card.innerHTML = `
      <div class="step-col">
        <div class="step-num" id="step${i}">${i + 1}</div>
      </div>
      <div class="card-body">
        <div class="now-banner"><span class="now-dot"></span> Nu bezig</div>
        <div class="card-top">
          <div class="card-title">${p.emoji} ${p.title}</div>
          <div class="time-badge">${p.time}</div>
        </div>
        <div class="card-desc">${p.desc}</div>
        ${hintHtml}
        <div class="countdown-chip" id="cd${i}">⏳ berekenen…</div>
        <div class="card-actions">
          <a class="btn btn-primary" href="${p.map}" target="_blank" rel="noopener noreferrer">🗺 Navigeer</a>
          ${extraBtns}
        </div>
      </div>
    `;

    appEl.appendChild(card);
  });
}

/* ════════════════════════════
   LIVE UPDATE (every 10s)
════════════════════════════ */
function update() {
  const now = new Date();
  let doneCount = 0;
  let activeIdx = -1;
  let nextIdx   = -1;

  // First pass: determine active and next indices
  plan.forEach((p, i) => {
    const start = parseTime(p.time);
    const isLast = i === plan.length - 1;
    const end = isLast
      ? new Date(start.getTime() + 60 * 60000)   // last event lasts 1 hour
      : parseTime(plan[i + 1].time);

    if (now >= start && now < end) {
      activeIdx = i;
    } else if (now < start && nextIdx === -1) {
      nextIdx = i;
    }
  });

  // Second pass: update each card's UI
  plan.forEach((p, i) => {
    const start  = parseTime(p.time);
    const diff   = diffMins(now, start);  // positive = starts in the future

    const cdEl   = document.getElementById("cd" + i);
    const card   = document.getElementById("card" + i);
    const stepEl = document.getElementById("step" + i);

    if (!cdEl || !card || !stepEl) return;

    // Reset classes
    card.classList.remove("active", "done");
    cdEl.className = "countdown-chip";

    if (i === activeIdx) {
      // ── CURRENTLY ACTIVE ──
      cdEl.textContent = "🔔 Nu bezig";
      cdEl.classList.add("now");
      card.classList.add("active");
      stepEl.textContent = "▶";

    } else if (diff > 0) {
      // ── UPCOMING ──
      const hrs  = Math.floor(diff / 60);
      const mins = diff % 60;
      cdEl.textContent = hrs > 0
        ? `⏳ over ${hrs}u ${mins}min`
        : `⏳ over ${mins} min`;

    } else {
      // ── DONE ──
      cdEl.textContent = "✔ Afgerond";
      cdEl.classList.add("done-chip");
      card.classList.add("done");
      stepEl.textContent = "✓";
      doneCount++;
    }
  });

  // ── Stats bar ──
  statDone.textContent   = doneCount;
  statActive.textContent = activeIdx >= 0 ? plan[activeIdx].time : "–";

  const refIdx = activeIdx >= 0 && activeIdx < plan.length - 1
    ? activeIdx + 1
    : nextIdx;

  if (refIdx >= 0) {
    const nextP     = plan[refIdx];
    const minsLeft  = diffMins(now, parseTime(nextP.time));
    statNext.textContent   = nextP.time;
    statRemain.textContent = formatDuration(minsLeft);
  } else {
    statNext.textContent   = "–";
    statRemain.textContent = "–";
  }

  // ── Progress bar ──
  const first   = parseTime(plan[0].time);
  const last    = parseTime(plan[plan.length - 1].time);
  const total   = last - first;
  const elapsed = Math.max(0, now - first);
  const pct     = Math.min(100, (elapsed / total) * 100);
  progEl.style.width = pct + "%";
}

/* ════════════════════════════
   CLOCK (every 1s)
════════════════════════════ */
function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("nl-NL");
  dateEl.textContent  = now.toLocaleDateString("nl-NL", {
    weekday: "short",
    day:     "numeric",
    month:   "short"
  });
}

/* ════════════════════════════
   SCROLL TO ACTIVE FAB
════════════════════════════ */
function scrollToActive() {
  const active = document.querySelector(".card.active");
  if (active) {
    active.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  // Fallback: scroll to first non-done card
  const doneCount = document.querySelectorAll(".card.done").length;
  const next = document.getElementById("card" + doneCount);
  if (next) next.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ════════════════════════════
   INITIALISE
════════════════════════════ */
render();
update();
updateClock();

setInterval(update,      10000);  // refresh state every 10 seconds
setInterval(updateClock,  1000);  // tick clock every second
