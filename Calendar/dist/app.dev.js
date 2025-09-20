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
    var SPECIAL_EMAIL = 'special.person@example.com'; // your VIP

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
  /* ===================== Counter helpers ===================== */


  function tasksCountFor(ymd) {
    var n = 0;

    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].date === ymd) n++;
    }

    return n;
  }

  function counterClassFor(n) {
    if (n <= 0) return 'cnt--0';
    if (n <= 2) return 'cnt--1';
    if (n <= 5) return 'cnt--2';
    if (n <= 8) return 'cnt--3';
    if (n <= 12) return 'cnt--4';
    if (n <= 16) return 'cnt--5';
    if (n <= 20) return 'cnt--6';
    return 'cnt--7';
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
    plannerRoot.innerHTML = '';
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
    });
    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current, weekStart);

    for (var i = 0; i < 7; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var n = tasksCountFor(ymd);
      var box = document.createElement('div');
      box.className = 'p-day' + (sameDay(day, new Date()) ? ' p-day--today' : '');
      box.dataset["goto"] = ymd;
      var head = document.createElement('div');
      head.className = 'p-day__head p-day__head--grid';
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[day.getDay()] + '</span>' + (n > 0 ? '<span class="p-counter ' + counterClassFor(n) + '" title="' + n + ' משימות">' + n + '</span>' : '<span class="p-counter cnt--0" aria-hidden="true">0</span>') + '<span class="p-day__date">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span>';
      box.appendChild(head); // (No tasks list shown in week view — just the counter)

      wrap.appendChild(box);
    }

    plannerRoot.appendChild(wrap);
  }

  function renderMonth() {
    plannerRoot.innerHTML = '';
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
      var n = tasksCountFor(ymd);
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

      if (n > 0) {
        var cnt = document.createElement('span');
        cnt.className = 'p-cell__count p-counter ' + counterClassFor(n);
        cnt.textContent = n;
        cell.appendChild(cnt);
      }

      grid.appendChild(cell);
    }

    plannerRoot.appendChild(grid);
  }
  /* ===================== Interactions ===================== */


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
  });

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
        completeTask(doneId, e);
      } else if (delId) {
        removeTask(delId, e);
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

        if (kind === 'tomorrow') {
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
  /* ===================== Complete / Delete animations ===================== */


  function completeTask(id, evt) {
    var idx = state.tasks.findIndex(function (x) {
      return x.id === id;
    });
    if (idx === -1) return;
    var x = evt && evt.clientX || window.innerWidth / 2;
    var y = evt && evt.clientY || window.innerHeight / 2;
    confettiBurst(x, y);
    state.tasks.splice(idx, 1);
    saveTasks();
    render();
  }

  function removeTask(id, evt) {
    var el = evt && evt.target && evt.target.closest('.p-daytask');

    if (el) {
      el.classList.add('scratch-out');
      setTimeout(function () {
        reallyRemove(id);
      }, 420);
    } else {
      reallyRemove(id);
    }
  }

  function reallyRemove(id) {
    state.tasks = state.tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks();
    render();
  }

  function confettiBurst(x, y) {
    var root = document.createElement('div');
    root.className = 'confetti';
    document.body.appendChild(root);
    var colors = ['#60a5fa', '#34d399', '#f472b6', '#f59e0b', '#a78bfa', '#22d3ee'];

    for (var i = 0; i < 80; i++) {
      var s = document.createElement('i');
      var deg = Math.random() * 360;
      var dist = 40 + Math.random() * 120;
      var size = 6 + Math.random() * 10;
      s.style.setProperty('--tx', (Math.cos(deg) * dist).toFixed(1) + 'px');
      s.style.setProperty('--ty', (Math.sin(deg) * dist).toFixed(1) + 'px');
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = colors[i % colors.length];
      root.appendChild(s);
    }

    root.style.left = x + 'px';
    root.style.top = y + 'px';
    setTimeout(function () {
      root.remove();
    }, 900);
  }
  /* ===================== Robust Log-out ===================== */


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
    window.__loozLoggingOut = true;
    clearAuthAll();

    try {
      localStorage.setItem('looz:loggedOut', '1');
    } catch (e) {}

    window.location.replace('/Calendar/auth.html?loggedout=1');
  }

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
  /* ===================== Style injections (alignment, counters, effects) ===================== */

  (function injectRuntimeStyles() {
    if (document.getElementById('looz-runtime-style')) return;
    var s = document.createElement('style');
    s.id = 'looz-runtime-style';
    s.textContent = "\n      /* Week header: 3-column grid: day | counter | date  */\n      .p-day__head--grid{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.25rem}\n      .p-day__head--grid .p-day__name{justify-self:end}\n      .p-day__head--grid .p-day__date{justify-self:start}\n\n      /* Counters \u2014 hairline border, small footprint */\n      .p-counter{font:600 .68rem/1.05 'Rubik',system-ui,sans-serif;padding:.15rem .33rem;border:.75px solid currentColor;border-radius:999rem;opacity:.9}\n      .cnt--0{opacity:.28}\n      .cnt--1{color:#16a34a}\n      .cnt--2{color:#f59e0b}\n      .cnt--3{color:#ec4899}\n      .cnt--4{color:#6366f1}\n      .cnt--5{color:#06b6d4}\n      .cnt--6{color:#dc2626}\n      .cnt--7{color:hsl(calc(20 + (var(--h,0))*1deg),90%,50%)}\n\n      /* Month cell counter: tiny chip, never overlaps center date */\n      .p-month .p-cell{position:relative}\n      .p-month .p-cell__num{position:relative;z-index:1}\n      .p-month .p-cell__count{position:absolute;inset-inline-start:6px;inset-block-start:6px;z-index:2;font-size:.62rem;padding:.10rem .28rem}\n\n      /* Confetti + scratch styles */\n      .confetti{position:fixed;transform:translate(-50%,-50%);pointer-events:none;z-index:9999}\n      .confetti i{position:absolute;left:0;top:0;border-radius:2px;opacity:0;animation:cf 700ms ease forwards}\n      @keyframes cf{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.9)}}\n      .scratch-out{position:relative;animation:scratchFade .42s ease forwards}\n      .scratch-out::after{content:\"\";position:absolute;inset-inline-start:-6px;inset-block-start:50%;height:2px;width:0;background:currentColor;opacity:.9;box-shadow:0 0 1px rgba(0,0,0,.25);animation:scratch 0.42s ease forwards}\n      @keyframes scratch{to{width:110%;opacity:0}}\n      @keyframes scratchFade{to{opacity:.0;transform:translateX(-8px)}}\n    ";
    document.head.appendChild(s);
  })();
  /* ===================== Welcome Lemon on BLANK page (veil → reveal) ===================== */


  (function setupWelcomeVeil() {
    function injectStyleOnce(id, css) {
      if (document.getElementById(id)) return;
      var s = document.createElement('style');
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    }

    injectStyleOnce('looz-welcome-veil-style', "\n      .wveil{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;pointer-events:none;opacity:1;transition:opacity .9s ease}\n      .wveil.is-fade{opacity:0}\n      .wveil__wrap{position:relative;width:clamp(96px,26vw,168px);opacity:0;transform:scale(.78);filter:blur(16px);animation:wv-in 2000ms cubic-bezier(.16,1,.3,1) forwards}\n      .wveil__wrap::after{content:\"\";position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);width:120%;height:16px;border-radius:50%;background:radial-gradient(50% 70% at 50% 50%, rgba(255,232,150,.38), rgba(0,0,0,0) 70%);filter:blur(3px);opacity:0;animation: wv-halo 2000ms ease forwards 300ms}\n      .wveil__svg{display:block;width:100%;height:auto;filter:drop-shadow(0 18px 38px rgba(6,12,26,.38))}\n      .wveil__sweep{transform:translateY(82%);animation:wv-sweep 1800ms cubic-bezier(.16,1,.3,1) 700ms forwards}\n      .wveil__glint{transform:translateY(80%) scale(.9);opacity:0;animation:wv-glint 1500ms cubic-bezier(.16,1,.3,1) 820ms forwards}\n      .wveil__wrap.is-collapse{animation: wv-collapse 560ms cubic-bezier(.4,0,.2,1) forwards}\n      @keyframes wv-in{0%{opacity:0;transform:scale(.78);filter:blur(16px)}60%{opacity:.95;filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}\n      @keyframes wv-halo{0%{opacity:0;transform:translateX(-50%) scale(.9)}100%{opacity:1;transform:translateX(-50%) scale(1)}}\n      @keyframes wv-sweep{0%{transform:translateY(82%);opacity:.65}70%{transform:translateY(-6%);opacity:.95}100%{transform:translateY(-16%);opacity:0}}\n      @keyframes wv-glint{0%{transform:translateY(80%) scale(.9);opacity:0}55%{opacity:.95}100%{transform:translateY(-10%) scale(1.06);opacity:0}}\n      @keyframes wv-collapse{0%{opacity:1;transform:scale(1);filter:blur(0)}60%{opacity:.55;transform:scale(.9);filter:blur(1.5px)}100%{opacity:0;transform:scale(.84);filter:blur(2px)}}\n    ");

    function isDarkBG() {
      try {
        if (document.documentElement.dataset.theme === 'dark') return true;
        if (document.documentElement.classList.contains('is-dark')) return true;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (e) {
        return false;
      }
    }

    function showVeil() {
      var veil = document.createElement('div');
      veil.className = 'wveil';
      veil.style.background = isDarkBG() ? '#0b1220' : '#ffffff';
      var wrap = document.createElement('div');
      wrap.className = 'wveil__wrap';
      wrap.innerHTML = "\n        <svg class=\"wveil__svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <defs>\n            <radialGradient id=\"lemFillV\" cx=\"50%\" cy=\"40%\" r=\"75%\">\n              <stop offset=\"0%\"  stop-color=\"#FFF8C6\"/>\n              <stop offset=\"50%\" stop-color=\"#FFE36E\"/>\n              <stop offset=\"100%\" stop-color=\"#F7C843\"/>\n            </radialGradient>\n            <linearGradient id=\"sweepV\" x1=\"0\" y1=\"1\" x2=\"0\" y2=\"0\">\n              <stop offset=\"0%\"   stop-color=\"rgba(0,229,255,0)\"/>\n              <stop offset=\"28%\"  stop-color=\"rgba(0,229,255,.30)\"/>\n              <stop offset=\"54%\"  stop-color=\"rgba(255,215,102,.70)\"/>\n              <stop offset=\"78%\"  stop-color=\"rgba(136,167,255,.40)\"/>\n              <stop offset=\"100%\" stop-color=\"rgba(0,229,255,0)\"/>\n            </linearGradient>\n            <radialGradient id=\"glintV\" cx=\"50%\" cy=\"50%\" r=\"60%\">\n              <stop offset=\"0%\" stop-color=\"rgba(255,248,198,.98)\"/>\n              <stop offset=\"70%\" stop-color=\"rgba(255,214,100,.45)\"/>\n              <stop offset=\"100%\" stop-color=\"rgba(255,214,100,0)\"/>\n            </radialGradient>\n            <clipPath id=\"lemClipV\">\n              <path d=\"M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6\"/>\n            </clipPath>\n          </defs>\n          <g>\n            <path d=\"M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6\"\n                  fill=\"url(#lemFillV)\" stroke=\"#C59A21\" stroke-width=\"1.15\"/>\n            <path d=\"M18 6c.9-.9 1.7-1.8 2.3-2.8\" stroke=\"#6FA14D\" stroke-linecap=\"round\" stroke-width=\"1.2\"/>\n          </g>\n          <g clip-path=\"url(#lemClipV)\">\n            <rect class=\"wveil__sweep\" x=\"0\" y=\"0\" width=\"100%\" height=\"140%\" fill=\"url(#sweepV)\"/>\n            <circle class=\"wveil__glint\" cx=\"12\" cy=\"22\" r=\"3.6\" fill=\"url(#glintV)\"/>\n          </g>\n        </svg>\n      ";
      veil.appendChild(wrap);
      document.body.appendChild(veil); // Collapse lemon then fade the veil to reveal app

      var collapseAt = 2200; // more noticeable fade-in time

      var removeAt = collapseAt + 900;
      setTimeout(function () {
        wrap.classList.add('is-collapse');
      }, collapseAt);
      setTimeout(function () {
        veil.classList.add('is-fade');
      }, collapseAt + 200);
      setTimeout(function () {
        veil.remove();
      }, removeAt);
    }

    try {
      if (localStorage.getItem('looz:justLoggedIn') === '1') {
        localStorage.removeItem('looz:justLoggedIn'); // Show the blank veil immediately on first paint

        requestAnimationFrame(showVeil);
      }
    } catch (e) {}
  })();
  /* ===================== Initial render ===================== */


  formatTitle(today);
  state.current = today;
  render();
})();