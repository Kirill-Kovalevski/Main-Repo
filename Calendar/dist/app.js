"use strict";

// Calendar/app.js
(function () {
  'use strict';

  // ---------- DOM refs ----------
  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var taskList = document.getElementById('taskList');
  var completedWrap = document.getElementById('completedSection');
  var completedList = document.getElementById('completedList');
  var completedToggle = document.getElementById('completedToggle');
  var addEventBtn = document.getElementById('addEventBtn');

  // Bottom sheet (new event)
  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');

  // ---------- helpers ----------
  function hasClass(el, c) {
    return el && el.classList && el.classList.contains(c);
  }
  function addClass(el, c) {
    if (el && el.classList) el.classList.add(c);
  }
  function remClass(el, c) {
    if (el && el.classList) el.classList.remove(c);
  }

  // Build an active task row: [checkbox | text | minus]
  function buildTaskItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = '<label class="c-item__label">' + '<input class="c-item__check" type="checkbox" />' + '<span class="c-item__text"></span>' + '</label>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text || '';
    return li;
  }

  // Build a completed row with a phantom cell to keep width the same
  function buildCompletedItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML = '<span class="c-item__phantom" aria-hidden="true"></span>' + '<span class="c-item__text"></span>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text || '';
    return li;
  }

  // Tiny confetti burst near an element (fun but light)
  function confettiAtEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var originX = r.left + r.width / 2 + window.scrollX;
    var originY = r.top + r.height / 2 + window.scrollY;
    var colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B8C0FF', '#F896D8'];
    var COUNT = 22;
    var MAX_DIST = 110;
    var MIN_DIST = 45;
    var DURATION = 1000;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'c-confetti';
      p.style.position = 'absolute';
      p.style.left = originX + 'px';
      p.style.top = originY + 'px';
      var s = 5 + Math.random() * 5;
      p.style.width = s + 'px';
      p.style.height = s + 'px';
      p.style.borderRadius = '2px';
      p.style.background = colors[i % colors.length];
      p.style.pointerEvents = 'none';
      p.style.zIndex = 9999;
      document.body.appendChild(p);
      (function (node) {
        var angle = Math.random() * Math.PI * 2;
        var dist = MIN_DIST + Math.random() * (MAX_DIST - MIN_DIST);
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var t = Math.min(1, (ts - start) / DURATION);
          var x = tx * t;
          var y = ty * t;
          var op = 1 - t;
          node.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (1 - 0.4 * t) + ')';
          node.style.opacity = op;
          if (t < 1) requestAnimationFrame(step);else node.parentNode && node.parentNode.removeChild(node);
        }
        requestAnimationFrame(step);
      })(p);
    }
  }

  // ---------- NAV: start hidden, toggle on lemon ----------
  // Ensure collapsed on load (also set in HTML class)
  if (appNav && !hasClass(appNav, 'u-is-collapsed')) {
    addClass(appNav, 'u-is-collapsed');
  }
  if (lemonToggle && appNav) {
    lemonToggle.addEventListener('click', function () {
      if (hasClass(appNav, 'u-is-collapsed')) {
        remClass(appNav, 'u-is-collapsed');
      } else {
        addClass(appNav, 'u-is-collapsed');
      }
    });
  }

  // ---------- Completed chip toggle ----------
  if (completedToggle && completedList) {
    completedToggle.addEventListener('click', function () {
      var hidden = hasClass(completedList, 'u-hidden');
      if (hidden) {
        remClass(completedList, 'u-hidden');
        completedToggle.setAttribute('aria-expanded', 'true');
      } else {
        addClass(completedList, 'u-hidden');
        completedToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Bottom sheet: open / close ----------
  function openSheet() {
    if (!sheet) return;
    remClass(sheet, 'u-hidden');
    addClass(sheet, 'is-open');
    if (titleInput) try {
      titleInput.focus();
    } catch (e) {}
  }
  function closeSheet() {
    if (!sheet) return;
    remClass(sheet, 'is-open');
    // allow closing animation (CSS) to finish
    setTimeout(function () {
      addClass(sheet, 'u-hidden');
    }, 220);
  }
  if (addEventBtn) {
    addEventBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openSheet();
    });
  }
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  if (sheetPanel) {
    // prevent backdrop click from closing immediately when clicking inside
    sheetPanel.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // ---------- Submit new event -> add to task list ----------
  if (sheetForm) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = titleInput && titleInput.value ? titleInput.value.trim() : '';
      var d = dateInput && dateInput.value ? dateInput.value.trim() : '';
      var h = timeInput && timeInput.value ? timeInput.value.trim() : '';
      if (!t || !d || !h) return;
      var dt = new Date(d);
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = String(dt.getFullYear()).slice(-2);
      var label = t + ' ' + h + ' (' + dd + '/' + mm + '/' + yy + ')';
      if (taskList) taskList.appendChild(buildTaskItem(label));
      sheetForm.reset();
      closeSheet();
    });
  }

  // ---------- Task list interactions ----------
  if (taskList) {
    // remove with minus
    taskList.addEventListener('click', function (e) {
      var target = e.target || e.srcElement;
      if (!target || !target.classList) return;
      if (target.classList.contains('c-item__remove')) {
        var row = target.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    });

    // complete with checkbox
    taskList.addEventListener('change', function (e) {
      var chk = e.target || e.srcElement;
      if (!chk || !chk.classList || !chk.classList.contains('c-item__check')) return;
      confettiAtEl(chk);
      var li = chk.closest('.c-item');
      var txtEl = li ? li.querySelector('.c-item__text') : null;
      var text = txtEl && txtEl.textContent ? txtEl.textContent.trim() : '';
      if (li) li.classList.add('is-completing');
      function onAnimEnd() {
        if (!li) return;
        li.removeEventListener('animationend', onAnimEnd);
        if (completedWrap) remClass(completedWrap, 'u-hidden');
        if (completedList) {
          var doneRow = buildCompletedItem(text);
          // optional: disabled/checked-looking “checkbox space” already handled by phantom
          completedList.appendChild(doneRow);
        }
        if (li.parentNode) li.parentNode.removeChild(li);
      }
      if (li) li.addEventListener('animationend', onAnimEnd, {
        once: true
      });
    });
  }

  // ---------- Completed list: remove with minus ----------
  if (completedList) {
    completedList.addEventListener('click', function (e) {
      var btn = e.target || e.srcElement;
      if (!btn || !btn.classList) return;
      if (btn.classList.contains('c-item__remove')) {
        var row = btn.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    });
  }
})();
