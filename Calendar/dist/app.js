"use strict";

// Calendar/app.js
(function () {
  // ============ DOM REFS ============
  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var titleDate = document.querySelector('.c-title--date');
  var taskList = document.getElementById('taskList'); // <ul>
  var completedList = document.getElementById('completedList'); // <ul>
  var completedToggle = document.getElementById('completedToggle'); // "בוצע" button
  var completedSection = document.getElementById('completedSection');
  var addEventBtn = document.getElementById('addEventBtn');
  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');
  var peopleBtn = document.getElementById('addPeopleBtn');
  var peopleHint = document.getElementById('peopleHint');

  // ============ SMALL STATE ============
  var peopleCount = 0;

  // ============ HELPERS ============
  function show(el) {
    if (el) el.classList.remove('u-hidden');
  }
  function hide(el) {
    if (el) el.classList.add('u-hidden');
  }
  function openSheet() {
    if (!sheet) return;
    show(sheet);
    sheet.setAttribute('aria-hidden', 'false');
    var panel = sheet.querySelector('.c-sheet__panel');
    if (panel) {
      panel.animate([{
        transform: 'translateY(20px)',
        opacity: 0
      }, {
        transform: 'translateY(0)',
        opacity: 1
      }], {
        duration: 220,
        easing: 'cubic-bezier(.16,1,.3,1)'
      });
    }
    var bd = sheet.querySelector('.c-sheet__backdrop');
    if (bd) {
      bd.animate([{
        opacity: 0
      }, {
        opacity: 1
      }], {
        duration: 220,
        easing: 'linear'
      });
    }
    if (titleInput) titleInput.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.setAttribute('aria-hidden', 'true');
    var panel = sheet.querySelector('.c-sheet__panel');
    var bd = sheet.querySelector('.c-sheet__backdrop');
    var done = 0;
    var maybeHide = function maybeHide() {
      done += 1;
      if (done >= 2) hide(sheet);
    };
    if (panel) {
      panel.animate([{
        transform: 'translateY(0)',
        opacity: 1
      }, {
        transform: 'translateY(20px)',
        opacity: 0
      }], {
        duration: 180,
        easing: 'cubic-bezier(.2,.7,.2,1)'
      }).finished.then(maybeHide);
    } else {
      maybeHide();
    }
    if (bd) {
      bd.animate([{
        opacity: 1
      }, {
        opacity: 0
      }], {
        duration: 180,
        easing: 'linear'
      }).finished.then(maybeHide);
    } else {
      maybeHide();
    }
  }

  // Big, visible confetti burst from an element
  function confettiAtEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var originX = r.left + r.width / 2 + window.scrollX;
    var originY = r.top + r.height / 2 + window.scrollY;
    var colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B8C0FF', '#F896D8'];
    var COUNT = 48;
    var MIN = 80,
      MAX = 200,
      DURATION = 1200;
    var _loop = function _loop() {
      var s = document.createElement('span');
      s.className = 'c-confetti';
      s.style.left = originX + 'px';
      s.style.top = originY + 'px';
      s.style.width = s.style.height = 6 + Math.random() * 6 + 'px';
      s.style.background = colors[i % colors.length];
      document.body.appendChild(s);
      var angle = Math.random() * Math.PI * 2;
      var dist = MIN + Math.random() * (MAX - MIN);
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist;
      s.animate([{
        transform: 'translate(0,0) scale(1)',
        opacity: 1
      }, {
        transform: 'translate(' + tx + 'px,' + ty + 'px) scale(0.6)',
        opacity: 0
      }], {
        duration: DURATION,
        easing: 'cubic-bezier(.2,.7,.2,1)'
      }).finished.then(function () {
        return s.remove();
      });
    };
    for (var i = 0; i < COUNT; i++) {
      _loop();
    }
  }

  // Build an ACTIVE row (minus → text → checkbox)
  function makeActiveItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = ['<button class="c-item__remove" type="button" aria-label="הסר">−</button>', '<label class="c-item__label">', '  <span class="c-item__text"></span>', '  <input class="c-item__check" type="checkbox" />', '</label>'].join('');
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text;
    return li;
  }

  // Build a COMPLETED row (minus → text → phantom)
  function makeCompletedItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML = ['<button class="c-item__remove" type="button" aria-label="הסר">−</button>', '<span class="c-item__text"></span>', '<span class="c-item__phantom" aria-hidden="true"></span>'].join('');
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text;
    return li;
  }
  function ensureCompletedVisible() {
    if (!completedSection) return;
    completedSection.classList.remove('u-hidden');
  }

  // ============ NAV (LEMON) ============

  function toggleNav() {
    if (!appNav) return;
    var collapsed = appNav.classList.contains('u-is-collapsed');
    appNav.classList.toggle('u-is-collapsed');

    // gently shift the date up/down to make room
    if (titleDate) {
      var moveDown = collapsed; // we are opening → move down
      titleDate.animate(moveDown ? [{
        transform: 'translateY(0)'
      }, {
        transform: 'translateY(10px)'
      }] : [{
        transform: 'translateY(10px)'
      }, {
        transform: 'translateY(0)'
      }], {
        duration: 220,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards'
      });
    }
  }
  if (lemonToggle) {
    lemonToggle.addEventListener('click', toggleNav);
  }

  // ============ COMPLETED toggle ============
  if (completedToggle && completedList) {
    completedToggle.addEventListener('click', function () {
      var isHidden = completedList.classList.contains('u-hidden');
      completedList.classList.toggle('u-hidden');

      // Elegant little expand/collapse animation
      completedList.animate(isHidden ? [{
        opacity: 0,
        transform: 'translateY(-6px)'
      }, {
        opacity: 1,
        transform: 'translateY(0)'
      }] : [{
        opacity: 1,
        transform: 'translateY(0)'
      }, {
        opacity: 0,
        transform: 'translateY(-6px)'
      }], {
        duration: 200,
        easing: 'cubic-bezier(.2,.7,.2,1)'
      });
      completedToggle.setAttribute('aria-expanded', String(isHidden));
    });
  }

  // ============ TASKS: remove / complete ============
  if (taskList) {
    // remove (minus)
    taskList.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.classList.contains('c-item__remove')) return;
      var li = t.closest('.c-item');
      if (li) li.remove();
    });

    // complete (checkbox)
    taskList.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.classList.contains('c-item__check')) return;
      var li = t.closest('.c-item');
      if (!li) return;
      var span = li.querySelector('.c-item__text');
      var text = span ? (span.textContent || '').trim() : '';

      // strike + fade + confetti
      li.classList.add('is-completing');
      confettiAtEl(t);
      li.addEventListener('animationend', function onEnd() {
        li.removeEventListener('animationend', onEnd);
        // remove from tasks
        li.remove();
        // add to completed
        ensureCompletedVisible();
        if (completedList) completedList.appendChild(makeCompletedItem(text));
      }, {
        once: true
      });
    });
  }

  // Completed list: allow removing too
  if (completedList) {
    completedList.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.classList.contains('c-item__remove')) return;
      var li = t.closest('.c-item');
      if (li) li.remove();
    });
  }

  // ============ BOTTOM SHEET ============

  if (addEventBtn) {
    addEventBtn.addEventListener('click', openSheet);
  }
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', closeSheet);
  }
  if (sheetCloseBtn) {
    sheetCloseBtn.addEventListener('click', closeSheet);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  // Add participants (tiny demo counter)
  if (peopleBtn && peopleHint) {
    peopleBtn.addEventListener('click', function () {
      peopleCount += 1;
      peopleHint.textContent = peopleCount + ' משתתפים';
    });
  }

  // Submit new event
  if (sheetForm && taskList) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = (titleInput && titleInput.value || '').trim();
      var date = (dateInput && dateInput.value || '').trim();
      var time = (timeInput && timeInput.value || '').trim();
      if (!title || !date || !time) return;
      var dt = new Date(date);
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = String(dt.getFullYear()).slice(-2);
      var label = title + ' ' + time + ' (' + dd + '/' + mm + '/' + yy + ')';
      taskList.appendChild(makeActiveItem(label));
      sheetForm.reset();
      peopleCount = 0;
      if (peopleHint) peopleHint.textContent = '—';
      closeSheet();
    });
  }
})();
