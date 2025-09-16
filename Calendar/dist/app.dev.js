"use strict";

// Calendar/app.js
(function () {
  'use strict';
  /* ========= DOM refs ========= */

  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var taskList = document.getElementById('taskList');
  var completedWrap = document.getElementById('completedSection') || null;
  var completedList = document.getElementById('completedList');
  var completedToggle = document.getElementById('completedToggle');
  var addEventBtn = document.getElementById('addEventBtn'); // Bottom sheet (new event)

  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime'); // Logout

  var logoutBtn = document.getElementById('btnLogout');
  /* ========= helpers ========= */

  function hasClass(el, c) {
    return el && el.classList && el.classList.contains(c);
  }

  function addClass(el, c) {
    if (el && el.classList) el.classList.add(c);
  }

  function remClass(el, c) {
    if (el && el.classList) el.classList.remove(c);
  } // Build ACTIVE task row: [checkbox | text | minus]


  function buildTaskItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = '<label class="c-item__label">' + '<input class="c-item__check" type="checkbox" />' + '<span class="c-item__text"></span>' + '</label>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text || '';
    return li;
  } // Build COMPLETED row (keeps same width using phantom in col 1)


  function buildCompletedItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML = '<span class="c-item__phantom" aria-hidden="true"></span>' + '<span class="c-item__text"></span>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    var span = li.querySelector('.c-item__text');
    if (span) span.textContent = text || '';
    return li;
  }
  /* ========= Confetti (bigger & mythic) ========= */


  function confettiAtEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var originX = r.left + r.width / 2 + window.scrollX;
    var originY = r.top + r.height / 2 + window.scrollY;
    var colors = ['#3B82F6', '#60A5FA', '#A78BFA', '#F59E0B', '#F472B6', '#34D399', '#F87171'];
    var COUNT = 52;
    var MIN_DIST = 60;
    var MAX_DIST = 160;
    var DURATION = 1200;

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'c-confetti';
      p.style.position = 'absolute';
      p.style.left = originX + 'px';
      p.style.top = originY + 'px';
      var s = 6 + Math.random() * 10; // bigger

      p.style.width = s + 'px';
      p.style.height = s + 'px';
      p.style.borderRadius = '2px';
      p.style.background = colors[i % colors.length];
      p.style.pointerEvents = 'none';
      p.style.zIndex = 10000;
      p.style.opacity = '1';
      document.body.appendChild(p);

      (function (node) {
        var angle = Math.random() * Math.PI * 2;
        var dist = MIN_DIST + Math.random() * (MAX_DIST - MIN_DIST);
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist * (0.75 + Math.random() * 0.5); // gentle fall

        var rot = Math.random() * 720 - 360; // mythic spin

        var start = null;

        function step(ts) {
          if (!start) start = ts;
          var t = Math.min(1, (ts - start) / DURATION);
          var ease = t * (2 - t); // ease-out

          node.style.transform = 'translate(' + tx * ease + 'px,' + ty * ease + 'px) rotate(' + rot * ease + 'deg) scale(' + (1 - 0.2 * ease) + ')';
          node.style.opacity = String(1 - ease);
          if (t < 1) requestAnimationFrame(step);else if (node.parentNode) node.parentNode.removeChild(node);
        }

        requestAnimationFrame(step);
      })(p);
    }
  }
  /* ========= NAV: collapse/expand ========= */


  if (appNav && !hasClass(appNav, 'u-is-collapsed')) addClass(appNav, 'u-is-collapsed');

  if (lemonToggle && appNav) {
    lemonToggle.addEventListener('click', function () {
      if (hasClass(appNav, 'u-is-collapsed')) remClass(appNav, 'u-is-collapsed');else addClass(appNav, 'u-is-collapsed');
    });
  }
  /* ========= Completed chip toggle ========= */


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
  /* ========= Bottom sheet open/close ========= */


  function openSheet() {
    if (!sheet) return;
    remClass(sheet, 'u-hidden');
    addClass(sheet, 'is-open');

    try {
      titleInput && titleInput.focus();
    } catch (e) {}
  }

  function closeSheet() {
    if (!sheet) return;
    remClass(sheet, 'is-open');
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
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  /* ========= Submit new event -> add task ========= */

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
  /* ========= Task list interactions ========= */


  if (taskList) {
    // remove with minus
    taskList.addEventListener('click', function (e) {
      var target = e.target || e.srcElement;

      if (target && target.classList && target.classList.contains('c-item__remove')) {
        var row = target.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    }); // complete with checkbox (move to Completed)

    taskList.addEventListener('change', function (e) {
      var chk = e.target || e.srcElement;
      if (!chk || !chk.classList || !chk.classList.contains('c-item__check')) return;
      confettiAtEl(chk);
      var li = chk.closest('.c-item');
      if (!li) return;
      var txtEl = li.querySelector('.c-item__text');
      var text = (txtEl && txtEl.textContent ? txtEl.textContent : '').trim(); // Fade out text first (CSS hook), then move

      li.classList.add('is-completing');

      function onAnimEnd() {
        li.removeEventListener('animationend', onAnimEnd);
        if (completedWrap) remClass(completedWrap, 'u-hidden');

        if (completedList) {
          var doneRow = buildCompletedItem(text); // greenish row

          completedList.appendChild(doneRow);
        }

        if (li.parentNode) li.parentNode.removeChild(li);
      }

      li.addEventListener('animationend', onAnimEnd, {
        once: true
      });
    });
  }
  /* ========= Completed list: minus removes ========= */


  if (completedList) {
    completedList.addEventListener('click', function (e) {
      var btn = e.target || e.srcElement;

      if (btn && btn.classList && btn.classList.contains('c-item__remove')) {
        var row = btn.closest('.c-item');
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    });
  }
  /* ========= Logout ========= */


  function logout() {
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
      sessionStorage.clear();
    } catch (e) {} // Redirect to login


    var dest = '/Calendar/auth.html';

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      dest = '/Calendar/auth.html';
    }

    window.location.replace(dest);
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout); // optional: support inline onclick="logout()"

  window.logout = logout;
})();

(function () {
  var btn = document.getElementById('lemonToggle');
  var nav = document.getElementById('appNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    nav.classList.toggle('u-is-collapsed'); // closed <-> open
  });
})();
/* ========= NAV: collapse/expand (robust) ========= */


(function initNav() {
  var btn = document.getElementById('lemonToggle');
  var nav = document.getElementById('appNav');
  var panel = nav ? nav.querySelector('.c-nav__panel') : null;
  if (!btn || !nav || !panel) return; // Start collapsed

  nav.classList.add('u-is-collapsed');
  nav.style.maxHeight = '0';

  function openNav() {
    // set maxHeight to the content height so it can animate open
    nav.classList.remove('u-is-collapsed');
    nav.style.visibility = 'visible';
    nav.style.opacity = '1';
    nav.style.maxHeight = panel.scrollHeight + 'px'; // after transition, remove max-height so content can grow/shrink naturally

    nav.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName === 'max-height') {
        nav.style.maxHeight = 'none';
        nav.removeEventListener('transitionend', onEnd);
      }
    });
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    // lock current height, then animate to 0
    var current = nav.scrollHeight;
    nav.style.maxHeight = current + 'px'; // lock
    // force reflow so the browser recognizes the locked height
    // eslint-disable-next-line no-unused-expressions

    nav.offsetHeight;
    nav.style.maxHeight = '0';
    btn.setAttribute('aria-expanded', 'false');
    nav.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName === 'max-height') {
        nav.classList.add('u-is-collapsed');
        nav.removeEventListener('transitionend', onEnd);
      }
    });
  }

  function isOpen() {
    return !nav.classList.contains('u-is-collapsed');
  }

  btn.addEventListener('click', function () {
    if (isOpen()) closeNav();else openNav();
  });
})();