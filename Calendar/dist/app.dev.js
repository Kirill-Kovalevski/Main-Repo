"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* LooZ — Planner App (home) */
(function () {
  'use strict';
  /* ===================== NAV across pages ===================== */

  function go(href) {
    window.location.href = href;
  }

  var btnProfile = document.getElementById('btnProfile');
  var btnMenu = document.getElementById('btnMenu'); // 3-dots -> settings

  var btnCategories = document.getElementById('btnCategories'); // in lemon nav

  var btnSocial = document.getElementById('btnSocial'); // in lemon nav

  if (btnProfile) btnProfile.addEventListener('click', function () {
    return go('/Calendar/profile.html');
  });
  if (btnMenu) btnMenu.addEventListener('click', function () {
    return go('/Calendar/settings.html');
  });
  if (btnCategories) btnCategories.addEventListener('click', function () {
    return go('/Calendar/categories.html');
  });
  if (btnSocial) btnSocial.addEventListener('click', function () {
    return go('/Calendar/social.html');
  });
  /* ===================== DOM ===================== */

  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var navPanel = appNav ? appNav.querySelector('.c-nav__panel') : null;
  var titleDay = document.getElementById('titleDay');
  var titleDate = document.getElementById('titleDate');
  var titleBadge = document.getElementById('titleBadge');
  var uiName = document.getElementById('uiName');
  var subtitleEl = document.querySelector('.c-subtitle');
  var plannerRoot = document.getElementById('planner');
  var btnDay = document.getElementById('btnDay');
  var btnWeek = document.getElementById('btnWeek');
  var btnMonth = document.getElementById('btnMonth');
  var sheet = document.getElementById('eventSheet');
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetClose = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');
  /* ===================== Helpers ===================== */

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m];
    });
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function dateKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function fromKey(ymd) {
    var p = (ymd || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  }

  function startOfWeek(d, weekStart) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var diff = (x.getDay() - weekStart + 7) % 7;
    x.setDate(x.getDate() - diff);
    return x;
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function addMonths(d, n) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
  }

  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  function formatTitle(d) {
    if (titleDay) titleDay.textContent = HEB_DAYS[d.getDay()];
    if (titleDate) titleDate.textContent = pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  function weekLabel(d, weekStart) {
    var s = startOfWeek(d, weekStart);
    var e = new Date(s);
    e.setDate(s.getDate() + 6);
    var sM = HEB_MONTHS[s.getMonth()],
        eM = HEB_MONTHS[e.getMonth()];

    if (s.getMonth() === e.getMonth()) {
      return s.getDate() + '–' + e.getDate() + ' ' + sM + ' ' + e.getFullYear();
    }

    return s.getDate() + ' ' + sM + ' – ' + e.getDate() + ' ' + eM + ' ' + e.getFullYear();
  }
  /* ===================== Greeting / profile name ===================== */


  function getAuth() {
    try {
      var raw = localStorage.getItem('authUser');
      if (!raw) return null;
      var o = JSON.parse(raw);
      return o && _typeof(o) === 'object' ? o : null;
    } catch (e) {
      return null;
    }
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem('profile') || '{}');
    } catch (e) {
      return {};
    }
  }

  function getDisplayName() {
    var prof = getProfile();
    if (prof && prof.name) return prof.name;
    var au = getAuth();
    if (au && (au.name || au.displayName || au.firstName)) return au.name || au.displayName || au.firstName;
    var alt = localStorage.getItem('authName');
    if (alt) return alt;
    return 'חברה';
  }

  function setGreeting() {
    var name = getDisplayName();
    var au = getAuth();
    var SPECIAL_EMAIL = 'special.person@example.com'; // set your VIP here

    if (subtitleEl) {
      if (au && au.email === SPECIAL_EMAIL) {
        subtitleEl.innerHTML = '✨ שמחים לראותך שוב, <strong>' + escapeHtml(name) + '</strong>. לוח מושלם מחכה לך.';
      } else {
        subtitleEl.innerHTML = 'ברוך/ה השב/ה, <span id="uiName">' + escapeHtml(name) + '</span>!<br>מה בלוז היום?';
      }
    }

    if (uiName) uiName.textContent = name;
  }

  setGreeting();
  /* ===================== State ===================== */

  var STORAGE_KEY = 'plannerTasks';
  var PREFS_KEY = 'plannerPrefs';

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (e) {}
  }

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function persistPrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  var prefs = loadPrefs();
  var weekStart = prefs.weekStart === 'mon' ? 1 : 0;
  var today = new Date();
  var state = {
    view: prefs.defaultView || 'day',
    current: today,
    tasks: loadTasks()
  };

  function markToday() {
    if (titleBadge) titleBadge.setAttribute('data-today', '1');
  }
  /* ===================== Lemon nav ===================== */


  (function initNav() {
    if (!lemonToggle || !appNav || !navPanel) return;
    appNav.classList.add('u-is-collapsed');
    lemonToggle.setAttribute('aria-expanded', 'false');
    appNav.setAttribute('aria-hidden', 'true');

    function open() {
      appNav.classList.remove('u-is-collapsed');
      appNav.setAttribute('aria-hidden', 'false');
      lemonToggle.setAttribute('aria-expanded', 'true');
      navPanel.style.maxHeight = navPanel.scrollHeight + 'px';
      navPanel.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'max-height') {
          navPanel.style.maxHeight = '';
          navPanel.removeEventListener('transitionend', onEnd);
        }
      });
    }

    function close() {
      var h = navPanel.scrollHeight;
      navPanel.style.maxHeight = h + 'px';
      void navPanel.offsetHeight;
      navPanel.style.maxHeight = '0px';
      lemonToggle.setAttribute('aria-expanded', 'false');
      appNav.setAttribute('aria-hidden', 'true');
      appNav.classList.add('u-is-collapsed');
    }

    lemonToggle.addEventListener('click', function () {
      var collapsed = appNav.classList.contains('u-is-collapsed') || appNav.getAttribute('aria-hidden') === 'true';
      collapsed ? open() : close();
    });
  })();
  /* ===================== Planner rendering ===================== */


  function render() {
    formatTitle(state.current);
    markToday();
    if (!plannerRoot) return;
    if (btnDay) btnDay.classList.toggle('is-active', state.view === 'day');
    if (btnWeek) btnWeek.classList.toggle('is-active', state.view === 'week');
    if (btnMonth) btnMonth.classList.toggle('is-active', state.view === 'month');
    if (state.view === 'day') renderDay();else if (state.view === 'week') renderWeek();else renderMonth();
  }

  function renderDay() {
    plannerRoot.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-dayview';
    var head = document.createElement('div');
    head.className = 'p-dayview__head';
    head.innerHTML = '<div class="p-dayview__title">' + HEB_DAYS[state.current.getDay()] + '</div>' + '<div class="p-dayview__date">' + pad2(state.current.getDate()) + '.' + pad2(state.current.getMonth() + 1) + '.' + state.current.getFullYear() + '</div>';
    wrap.appendChild(head);
    var ymd = dateKey(state.current);
    var items = state.tasks.filter(function (t) {
      return t.date === ymd;
    }).sort(function (a, b) {
      return (a.time || '').localeCompare(b.time || '');
    });

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'p-empty';
      empty.textContent = 'אין אירועים ליום זה.';
      wrap.appendChild(empty);
    } else {
      items.forEach(function (t) {
        var row = document.createElement('div');
        row.className = 'p-daytask';
        row.innerHTML = '<div class="p-daytask__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-daytask__time">' + (t.time || '') + '</div>' + '<div class="p-daytask__actions">' + '<button class="p-daytask__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-daytask__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        wrap.appendChild(row);
      });
    }

    plannerRoot.appendChild(wrap);
  }

  function renderWeek() {
    plannerRoot.innerHTML = ''; // Week bar (prev / title / next)

    var bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.innerHTML = '<button class="p-weekbar__btn" data-weeknav="prev" aria-label="שבוע קודם">‹</button>' + '<div class="p-weekbar__title">' + weekLabel(state.current, weekStart) + '</div>' + '<div class="p-weekbar__right">' + '<button class="p-weekbar__btn" data-weeknav="today">היום</button>' + '<button class="p-weekbar__btn" data-weeknav="next" aria-label="שבוע הבא">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var a = e.target.closest('[data-weeknav]');
      if (!a) return;
      var kind = a.getAttribute('data-weeknav');

      if (kind === 'prev') {
        state.current.setDate(state.current.getDate() - 7);
      } else if (kind === 'next') {
        state.current.setDate(state.current.getDate() + 7);
      } else {
        state.current = new Date();
      }

      render();
      persistPrefs();
    }); // Week grid

    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current, weekStart);

    for (var i = 0; i < 7; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var box = document.createElement('div');
      box.className = 'p-day' + (sameDay(day, new Date()) ? ' p-day--today' : '');
      box.dataset["goto"] = ymd;
      var head = document.createElement('div');
      head.className = 'p-day__head';
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[day.getDay()] + '</span>' + '<span class="p-day__date">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span>';
      box.appendChild(head);
      var dayTasks = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).sort(function (a, b) {
        return (a.time || '').localeCompare(b.time || '');
      });
      dayTasks.forEach(function (t) {
        var row = document.createElement('div');
        row.className = 'p-task';
        row.innerHTML = '<div class="p-task__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-task__time">' + (t.time || '') + '</div>' + '<div class="p-task__actions">' + '<button class="p-task__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-task__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        box.appendChild(row);
      });
      wrap.appendChild(box);
    }

    plannerRoot.appendChild(wrap);
  }

  function renderMonth() {
    plannerRoot.innerHTML = ''; // Month bar (prev / title / next)

    var bar = document.createElement('div');
    bar.className = 'p-monthbar';
    bar.innerHTML = '<div class="p-monthbar__left">' + '<button class="p-monthbar__btn" data-monthnav="prev" aria-label="חודש קודם">‹</button>' + '</div>' + '<div class="p-monthbar__title">' + HEB_MONTHS[state.current.getMonth()] + ' ' + state.current.getFullYear() + '</div>' + '<div class="p-monthbar__right">' + '<button class="p-monthbar__btn" data-monthnav="today">היום</button>' + '<button class="p-monthbar__btn" data-monthnav="next" aria-label="חודש הבא">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var a = e.target.closest('[data-monthnav]');
      if (!a) return;
      var kind = a.getAttribute('data-monthnav');

      if (kind === 'prev') {
        state.current = addMonths(startOfMonth(state.current), -1);
      } else if (kind === 'next') {
        state.current = addMonths(startOfMonth(state.current), 1);
      } else {
        state.current = new Date();
      }

      render();
      persistPrefs();
    });
    var grid = document.createElement('div');
    grid.className = 'p-month';
    var anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    var firstDow = (anchor.getDay() - weekStart + 7) % 7;
    var start = new Date(anchor);
    start.setDate(anchor.getDate() - firstDow);
    var curKey = dateKey(state.current);

    for (var i = 0; i < 42; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var cell = document.createElement('div');
      var cls = 'p-cell';
      if (sameDay(day, new Date())) cls += ' p-cell--today';
      if (ymd === curKey) cls += ' p-cell--selected';
      if (day.getMonth() !== state.current.getMonth()) cls += ' p-cell--pad';
      cell.className = cls;
      cell.dataset["goto"] = ymd;
      var num = document.createElement('div');
      num.className = 'p-cell__num';
      num.textContent = day.getDate();
      cell.appendChild(num);
      grid.appendChild(cell);
    }

    plannerRoot.appendChild(grid);
  }
  /* ===================== Interactions ===================== */
  // view tabs


  if (btnDay) btnDay.addEventListener('click', function () {
    state.view = 'day';
    render();
    prefs.defaultView = 'day';
    persistPrefs();
  });
  if (btnWeek) btnWeek.addEventListener('click', function () {
    state.view = 'week';
    render();
    prefs.defaultView = 'week';
    persistPrefs();
  });
  if (btnMonth) btnMonth.addEventListener('click', function () {
    state.view = 'month';
    render();
    prefs.defaultView = 'month';
    persistPrefs();
  }); // go to a specific day (week+month cards)

  if (plannerRoot) {
    plannerRoot.addEventListener('click', function (e) {
      var host = e.target && e.target.closest('[data-goto]');
      var go = host && host.dataset["goto"];

      if (go) {
        state.current = fromKey(go);
        state.view = 'day';
        render();
        return;
      }

      var doneId = e.target && e.target.getAttribute('data-done');
      var delId = e.target && e.target.getAttribute('data-del');

      if (doneId) {
        state.tasks = state.tasks.filter(function (t) {
          return t.id !== doneId;
        });
        saveTasks();
        render();
      } else if (delId) {
        state.tasks = state.tasks.filter(function (t) {
          return t.id !== delId;
        });
        saveTasks();
        render();
      }
    });
  }
  /* ===================== Bottom Sheet (Create event) ===================== */


  function openSheet() {
    if (!sheet) return;
    var now = new Date();
    if (dateInput && !dateInput.value) dateInput.value = dateKey(now);
    if (timeInput && !timeInput.value) timeInput.value = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    sheet.classList.remove('u-hidden');
    sheet.classList.add('is-open');

    try {
      titleInput && titleInput.focus();
    } catch (_) {}
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    setTimeout(function () {
      return sheet.classList.add('u-hidden');
    }, 220);
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest('#addEventBtn')) {
      e.preventDefault();
      openSheet();
    }
  });

  if (sheetPanel) {
    sheetPanel.addEventListener('click', function (e) {
      var qd = e.target && e.target.closest('.qp__chip[data-date]');

      if (qd) {
        e.preventDefault();
        var kind = qd.getAttribute('data-date');
        var base = new Date();

        if (kind === 'today') {} else if (kind === 'tomorrow') {
          base.setDate(base.getDate() + 1);
        } else if (kind === 'nextweek') {
          base.setDate(base.getDate() + 7);
        } else if (/^\+\d+$/.test(kind)) {
          base.setDate(base.getDate() + parseInt(kind.slice(1), 10));
        }

        if (dateInput) dateInput.value = dateKey(base);
        return;
      }

      var qt = e.target && e.target.closest('.qp__chip[data-time]');

      if (qt) {
        e.preventDefault();
        var kindT = qt.getAttribute('data-time');
        var now = new Date();

        if (/^now\+\d+$/.test(kindT)) {
          var m = parseInt(kindT.split('+')[1], 10) || 0;
          now.setMinutes(now.getMinutes() + m);
          if (timeInput) timeInput.value = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
        } else if (/^\d{2}:\d{2}$/.test(kindT) && timeInput) {
          timeInput.value = kindT;
        }

        return;
      }

      var closeBtn = e.target && e.target.closest('[data-close]');

      if (closeBtn) {
        e.preventDefault();
        closeSheet();
      }
    });
  }

  if (sheet) {
    sheet.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.c-sheet__backdrop')) closeSheet();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  if (sheetForm) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = (titleInput && titleInput.value || '').trim();
      var d = (dateInput && dateInput.value || '').trim();
      var h = (timeInput && timeInput.value || '').trim();
      if (!t || !d || !h) return;
      var id = 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      state.tasks.push({
        id: id,
        title: t,
        date: d,
        time: h
      });
      saveTasks();
      state.current = fromKey(d);
      state.view = 'day';
      render();
      sheetForm.reset();
      closeSheet();
    });
  }
  /* ===================== Robust Log-out (works for #btnExit or [data-logout]) ===================== */


  function clearAuthAll() {
    try {
      var KEYS = ['authUser', 'authName', 'token', 'auth.token', 'auth.user', 'looz:justLoggedIn', 'looz:loggedOut'];
      KEYS.forEach(function (k) {
        try {
          localStorage.removeItem(k);
        } catch (e) {}

        try {
          sessionStorage.removeItem(k);
        } catch (e) {}
      });
    } catch (e) {}
  }

  function handleLogout() {
    // prevent any stray handlers from re-writing auth during this tick
    window.__loozLoggingOut = true;
    clearAuthAll(); // hard replace so Back won’t bounce you into the app again

    try {
      // add a small tombstone so auth.html can also clean extras if it wants
      localStorage.setItem('looz:loggedOut', '1');
    } catch (e) {}

    window.location.replace('/Calendar/auth.html?loggedout=1');
  } // attach both direct and delegated handlers (covers late DOM or markup changes)


  var exitBtn = document.getElementById('btnExit');
  if (exitBtn) exitBtn.addEventListener('click', function (ev) {
    ev.preventDefault();
    handleLogout();
  });
  document.addEventListener('click', function (e) {
    var trg = e.target && e.target.closest('[data-logout]');

    if (trg) {
      e.preventDefault();
      handleLogout();
    }
  });
  /* ===================== Elegant post-login intro (glowy lemon) ===================== */

  function welcomeIntro() {
    var root = document.createElement('div');
    root.className = 'looz-welcome';
    root.innerHTML = '<div class="looz-welcome__scrim"></div>';
    var wrap = document.createElement('div');
    wrap.className = 'lw-wrap';
    var halo = document.createElement('div');
    halo.className = 'lw-halo';
    var lemon = document.createElement('div');
    lemon.className = 'lw-lemon';
    lemon.innerHTML = "\n      <svg viewBox=\"0 0 64 64\" width=\"96\" height=\"96\" aria-hidden=\"true\">\n        <defs>\n          <radialGradient id=\"wLemonCore\" cx=\"48%\" cy=\"40%\" r=\"60%\">\n            <stop offset=\"0%\"  stop-color=\"#FFF8C6\"/>\n            <stop offset=\"62%\" stop-color=\"#FFE36E\"/>\n            <stop offset=\"100%\" stop-color=\"#F7C843\"/>\n          </radialGradient>\n          <linearGradient id=\"wLeaf\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#8BC34A\"/>\n            <stop offset=\"100%\" stop-color=\"#4E8B2A\"/>\n          </linearGradient>\n        </defs>\n        <path d=\"M48 20c-9-9-23-9-32 0-6 6-6 16 0 22 6.4 6 16.9 6.9 23.4 0 6.4-6.1 7.6-15.6 1.6-22\"\n              fill=\"url(#wLemonCore)\" stroke=\"#C59A21\" stroke-width=\"1.2\"/>\n        <path d=\"M45 18c2.9-2.9 5.5-5.8 7.4-8.7\" stroke=\"url(#wLeaf)\" stroke-width=\"2.2\" stroke-linecap=\"round\"/>\n      </svg>\n    ";
    var shine = document.createElement('div');
    shine.className = 'lw-shine';
    var rays = document.createElement('div');
    rays.className = 'lw-rays';

    for (var i = 0; i < 12; i++) {
      var r = document.createElement('span');
      r.className = 'lw-ray';
      r.style.setProperty('--a', i * 30 + 'deg');
      r.style.animationDelay = 80 + i * 20 + 'ms';
      rays.appendChild(r);
    }

    wrap.appendChild(halo);
    wrap.appendChild(lemon);
    wrap.appendChild(shine);
    wrap.appendChild(rays);
    root.appendChild(wrap);
    document.body.appendChild(root);
    setTimeout(function () {
      root.remove();
    }, 1500);
  }

  try {
    if (localStorage.getItem('looz:justLoggedIn') === '1') {
      localStorage.removeItem('looz:justLoggedIn');
      setTimeout(welcomeIntro, 40);
    }
  } catch (_) {}
  /* ===================== Initial render ===================== */


  formatTitle(today);
  state.current = today;
  render();
})();