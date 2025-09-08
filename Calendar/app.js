/* =========================================================
   app.js – tiny data + rendering + simple interactions
   Audience: beginner-friendly, clean & commented
   ========================================================= */

// Mock “today plan” events (what you showed in the screenshot)
const EVENTS = [
  { time: "16:30", title: "אימון",       checked: true  },
  { time: "18:00", title: "סקייט",       checked: false },
  { time: "קבלת ערב", title: "עם בעלולי", checked: false }, // split line feeling
  { time: "על הראש", title: "",           checked: false },
  { time: "22:35", title: "מסאג' כפות הרגליים", checked: false }
];

// Render a single event item (HTML string)
function eventTemplate(e) {
  // If an event is “checked”, show a tiny red check badge like in your mock
  const checkHTML = e.checked ? `<span class="check">✓</span>` : "";

  // Some lines in your mock look like “title-only” items.
  // If there’s a time, show “time title”. Otherwise show only title.
  const line = e.time && e.title
    ? `<span class="time">${e.time}</span> <span class="title">${e.title}</span>`
    : `<span class="title">${e.time || e.title}</span>`;

  return `
    <li class="event">
      <span class="flag" aria-hidden="true"></span>

      <div class="text">
        ${line}
        ${checkHTML}
      </div>

      <i class="avatar" aria-hidden="true"></i>
    </li>
  `;
}

// Render the full list into UL#events
function renderEvents(list) {
  const ul = document.getElementById("events");
  if (!ul) return;
  ul.innerHTML = list.map(eventTemplate).join("");
}

// Example “new event” action (very simple prompt -> append)
function wireNewEvent() {
  const btn = document.getElementById("newEventBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const time = window.prompt("שעת האירוע? (לדוגמה 19:45)");
    const title = window.prompt("שם האירוע?");
    if (!time && !title) return;

    EVENTS.push({
      time: (time || "").trim(),
      title: (title || "").trim(),
      checked: false
    });

    renderEvents(EVENTS);
  });
}

// Toggle “checked” by clicking on the red check (for demo)
function wireToggleChecks() {
  const ul = document.getElementById("events");
  if (!ul) return;

  ul.addEventListener("click", (e) => {
    const li = e.target.closest(".event");
    if (!li) return;

    const idx = Array.from(ul.children).indexOf(li);
    if (idx < 0) return;

    // If you clicked the text area, flip the checked state.
    // (Keeps it playful—click again to uncheck.)
    EVENTS[idx].checked = !EVENTS[idx].checked;
    renderEvents(EVENTS);
  });
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  renderEvents(EVENTS);
  wireNewEvent();
  wireToggleChecks();
});
