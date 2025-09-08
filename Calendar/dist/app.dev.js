"use strict";

/* =========================================================
   app.js – tiny data + rendering + simple interactions
   Audience: beginner-friendly, clean & commented
   ========================================================= */
// Mock “today plan” events (what you showed in the screenshot)
var EVENTS = [{
  time: "16:30",
  title: "אימון",
  checked: true
}, {
  time: "18:00",
  title: "סקייט",
  checked: false
}, {
  time: "קבלת ערב",
  title: "עם בעלולי",
  checked: false
}, // split line feeling
{
  time: "על הראש",
  title: "",
  checked: false
}, {
  time: "22:35",
  title: "מסאג' כפות הרגליים",
  checked: false
}]; // Render a single event item (HTML string)

function eventTemplate(e) {
  // If an event is “checked”, show a tiny red check badge like in your mock
  var checkHTML = e.checked ? "<span class=\"check\">\u2713</span>" : ""; // Some lines in your mock look like “title-only” items.
  // If there’s a time, show “time title”. Otherwise show only title.

  var line = e.time && e.title ? "<span class=\"time\">".concat(e.time, "</span> <span class=\"title\">").concat(e.title, "</span>") : "<span class=\"title\">".concat(e.time || e.title, "</span>");
  return "\n    <li class=\"event\">\n      <span class=\"flag\" aria-hidden=\"true\"></span>\n\n      <div class=\"text\">\n        ".concat(line, "\n        ").concat(checkHTML, "\n      </div>\n\n      <i class=\"avatar\" aria-hidden=\"true\"></i>\n    </li>\n  ");
} // Render the full list into UL#events


function renderEvents(list) {
  var ul = document.getElementById("events");
  if (!ul) return;
  ul.innerHTML = list.map(eventTemplate).join("");
} // Example “new event” action (very simple prompt -> append)


function wireNewEvent() {
  var btn = document.getElementById("newEventBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var time = window.prompt("שעת האירוע? (לדוגמה 19:45)");
    var title = window.prompt("שם האירוע?");
    if (!time && !title) return;
    EVENTS.push({
      time: (time || "").trim(),
      title: (title || "").trim(),
      checked: false
    });
    renderEvents(EVENTS);
  });
} // Toggle “checked” by clicking on the red check (for demo)


function wireToggleChecks() {
  var ul = document.getElementById("events");
  if (!ul) return;
  ul.addEventListener("click", function (e) {
    var li = e.target.closest(".event");
    if (!li) return;
    var idx = Array.from(ul.children).indexOf(li);
    if (idx < 0) return; // If you clicked the text area, flip the checked state.
    // (Keeps it playful—click again to uncheck.)

    EVENTS[idx].checked = !EVENTS[idx].checked;
    renderEvents(EVENTS);
  });
} // Boot


document.addEventListener("DOMContentLoaded", function () {
  renderEvents(EVENTS);
  wireNewEvent();
  wireToggleChecks();
});