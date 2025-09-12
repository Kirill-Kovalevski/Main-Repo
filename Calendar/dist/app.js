"use strict";

// Calendar/app.js
(function () {
  'use strict';

  // ---------- DOM ----------
  var header = document.querySelector('.o-header');
  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var navPanel = appNav ? appNav.querySelector('.c-nav__panel') : null;
  var taskList = document.getElementById('taskList');
  var completedList = document.getElementById('completedList');
  var completedToggle = document.getElementById('completedToggle');
  var addEventBtn = document.getElementById('addEventBtn');
  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');

  // ---------- helpers ----------
  function setHeaderShift(px) {
    if (!header) return;
    header.style.setProperty('--nav-shift', (px || 0) + 'px');
  }
  function openSheet() {
    if (!sheet) return;
    sheet.classList.remove('u-hidden');
    sheet.classList.add('is-open');
    if (titleInput) titleInput.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    setTimeout(function () {
      sheet.classList.add('u-hidden');
    }, 220);
  }
  function buildTaskItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = '<label class="c-item__label">' + '<input class="c-item__check" type="checkbox" aria-label="סמן משימה" />' + '<span class="c-item__text"></span>' + '</label>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    li.querySelector('.c-item__text').textContent = text || '';
    return li;
  }
  function buildCompletedItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML =
    // phantom keeps the same 3-column rhythm as tasks
    '<span class="c-item__phantom" aria-hidden="true"></span>' + '<span class="c-item__text"></span>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    li.querySelector('.c-item__text').textContent = text || '';
    return li;
  }

  // normalize any existing rows to [checkbox | text | minus]
  function normalizeRows(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.c-item').forEach(function (li) {
      var label = li.querySelector('.c-item__label') || document.createElement('label');
      label.classList.add('c-item__label');
      var check = li.querySelector('.c-item__check') || document.createElement('input');
      check.type = 'checkbox';
      check.classList.add('c-item__check');
      var text = li.querySelector('.c-item__text') || document.createElement('span');
      text.classList.add('c-item__text');
      if (!text.textContent) text.textContent = 'שם המשימה…';
      label.innerHTML = '';
      label.appendChild(check);
      label.appendChild(text);
      if (label.parentNode !== li) li.insertBefore(label, li.firstChild);
      var minus = li.querySelector('.c-item__remove');
      if (!minus) {
        minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'c-item__remove';
        minus.setAttribute('aria-label', 'הסר');
        minus.textContent = '−';
      }
      if (li.lastElementChild !== minus) li.appendChild(minus);
    });
  }

  // ---------- Lemon toggles NAV (cap the shift so it never hits the chip) ----------
  if (lemonToggle && appNav) {
    lemonToggle.addEventListener('click', function () {
      var willOpen = appNav.classList.contains('u-is-collapsed'); // opening now?
      appNav.classList.toggle('u-is-collapsed');

      // Only add .is-nav-open when opening; remove when closing
      if (header) header.classList.toggle('is-nav-open', willOpen);
      if (willOpen && navPanel) {
        // panel height + tiny breathing; cap so it won’t overlap the chip
        var raw = navPanel.scrollHeight + 8;
        var shift = Math.min(raw, 44); // <= adjust cap if you ever change the panel height
        setHeaderShift(shift);
      } else {
        setHeaderShift(0);
      }
    });
  }

  // ---------- Completed chip toggle ----------
  if (completedToggle && completedList) {
    completedToggle.addEventListener('click', function () {
      var isHidden = completedList.classList.contains('u-hidden');
      completedList.classList.toggle('u-hidden', !isHidden);
      completedToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  }

  // ---------- Bottom sheet ----------
  if (addEventBtn) addEventBtn.addEventListener('click', openSheet);
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  if (sheetForm && taskList) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = (titleInput && titleInput.value || '').trim();
      var d = (dateInput && dateInput.value || '').trim();
      var h = (timeInput && timeInput.value || '').trim();
      if (!t || !d || !h) return;
      var dt = new Date(d);
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = String(dt.getFullYear()).slice(-2);
      var label = t + ' ' + h + ' (' + dd + '/' + mm + '/' + yy + ')';
      taskList.appendChild(buildTaskItem(label));
      sheetForm.reset();
      closeSheet();
    });
  }

  // ---------- Task list interactions ----------
  if (taskList) {
    taskList.addEventListener('click', function (e) {
      var btn = e.target;
      if (btn.classList && btn.classList.contains('c-item__remove')) {
        var row = btn.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    });
    taskList.addEventListener('change', function (e) {
      var chk = e.target;
      if (!chk.classList || !chk.classList.contains('c-item__check')) return;
      var li = chk.closest('.c-item');
      var tEl = li ? li.querySelector('.c-item__text') : null;
      var text = tEl ? (tEl.textContent || '').trim() : '';
      if (li) li.classList.add('is-completing');
      function onEnd() {
        if (!li) return;
        li.removeEventListener('animationend', onEnd);
        if (completedList) completedList.appendChild(buildCompletedItem(text));
        if (li.parentNode) li.parentNode.removeChild(li);
      }
      if (li) li.addEventListener('animationend', onEnd, {
        once: true
      });
    });
  }
  if (completedList) {
    completedList.addEventListener('click', function (e) {
      var btn = e.target;
      if (btn.classList && btn.classList.contains('c-item__remove')) {
        var row = btn.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    });
  }

  // normalize existing HTML rows on load
  normalizeRows(taskList);
})();
