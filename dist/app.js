"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* ===== LooZ — Planner App (home) — vFinal.6 (Day: X icon + equal arrows) ===== */
(function () {
  'use strict';

  /* -------- AUTH GUARD (runs before anything else) -------- */
  (function guard() {
    try {
      var u = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
      if (!u) {
        location.replace('auth.html');
      }
    } catch (_) {
      location.replace('auth.html');
    }
  })();

  /* ===================== Helpers ===================== */
  var $ = function $(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return root.querySelector(sel);
  };
  var $$ = function $$(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return Array.from(root.querySelectorAll(sel));
  };
  var go = function go(href) {
    return window.location.href = href;
  };
  var pad2 = function pad2(n) {
    return String(n).padStart(2, '0');
  };
  var escapeHtml = function escapeHtml() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return s.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m];
    });
  };
  var sameDay = function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };
  var dateKey = function dateKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  };
  var fromKey = function fromKey(ymd) {
    var p = (ymd || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  };
  var startOfWeek = function startOfWeek(d, weekStart) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var diff = (x.getDay() - weekStart + 7) % 7;
    x.setDate(x.getDate() - diff);
    return x;
  };
  var startOfMonth = function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };
  var addMonths = function addMonths(d, n) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
  };
  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'דצמבר'];
  var weekLabel = function weekLabel(d, weekStart) {
    var s = startOfWeek(d, weekStart);
    var e = new Date(s);
    e.setDate(s.getDate() + 6);
    var sM = HEB_MONTHS[s.getMonth()],
      eM = HEB_MONTHS[e.getMonth()];
    return s.getMonth() === e.getMonth() ? "".concat(s.getDate(), "\u2013").concat(e.getDate(), " ").concat(sM, " ").concat(s.getFullYear()) : "".concat(s.getDate(), " ").concat(sM, " \u2013 ").concat(e.getDate(), " ").concat(eM, " ").concat(s.getFullYear());
  };

  /* ===================== DOM refs ===================== */
  var btnProfile = $('#btnProfile');
  var btnMenu = $('#btnMenu');
  var btnCategories = $('#btnCategories');
  var btnSocial = $('#btnSocial');
  if (btnProfile) btnProfile.addEventListener('click', function () {
    return go('profile.html');
  });
  if (btnMenu) btnMenu.addEventListener('click', function () {
    return go('settings.html');
  });
  if (btnCategories) btnCategories.addEventListener('click', function () {
    return go('categories.html');
  });
  if (btnSocial) btnSocial.addEventListener('click', function () {
    return go('social.html');
  });
  var lemonToggle = $('#lemonToggle');
  var appNav = $('#appNav');
  var navPanel = appNav ? appNav.querySelector('.c-nav__panel') : null;
  var titleDay = $('#titleDay');
  var titleDate = $('#titleDate');
  var titleBadge = $('#titleBadge');
  var plannerRoot = $('#planner');
  var btnDay = $('#btnDay');
  var btnWeek = $('#btnWeek');
  var btnMonth = $('#btnMonth');
  var sheet = $('#eventSheet');
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetClose = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetForm = $('#sheetForm');
  var titleInput = $('#evtTitle');
  var dateInput = $('#evtDate');
  var timeInput = $('#evtTime');
  var subtitleEl = $('.c-subtitle');
  var addEventBtn = $('#addEventBtn');
  var btnExit = $('#btnExit');

  /* ===================== Greeting ===================== */
  function getAuth() {
    try {
      var raw = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
      return raw ? JSON.parse(raw) : null;
    } catch (_unused) {
      return null;
    }
  }
  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem('profile') || '{}');
    } catch (_unused2) {
      return {};
    }
  }
  function getDisplayName() {
    var prof = getProfile();
    if (prof.firstName) return prof.firstName;
    if (prof.name) return prof.name;
    var au = getAuth();
    if (au) return au.firstName || au.name || au.displayName || au.email || 'חברה';
    return localStorage.getItem('authName') || 'חברה';
  }
  (function setGreeting() {
    var name = escapeHtml(getDisplayName());
    var au = getAuth();
    var SPECIAL_EMAIL = 'daniellagg21@gmail.com';
    var isSpecial = au && String(au.email || '').toLowerCase() === SPECIAL_EMAIL.toLowerCase();
    if (subtitleEl) {
      subtitleEl.innerHTML = isSpecial ? '<div style="font-weight:800;margin-bottom:.15rem">נשמולית שלי</div>' + '<div>איזה כיף שחזרת <strong>' + name + '</strong></div>' + '<div>לוז מושלם מחכה לך</div>' : 'ברוכים השבים, <strong id="uiName">' + name + '</strong>!<br>מה בלוז היום?';
    }
  })();

  /* ===================== State ===================== */
  var STORAGE_KEY = 'plannerTasks';
  var PREFS_KEY = 'plannerPrefs';
  var loadTasks = function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var a = raw ? JSON.parse(raw) : [];
      return Array.isArray(a) ? a : [];
    } catch (_unused3) {
      return [];
    }
  };
  var saveTasks = function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (_unused4) {}
  };
  var loadPrefs = function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch (_unused5) {
      return {};
    }
  };
  var persistPrefs = function persistPrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (_unused6) {}
  };
  var prefs = loadPrefs();
  var weekStart = prefs.weekStart === 'mon' ? 1 : 0;
  var state = {
    view: prefs.defaultView || 'week',
    current: new Date(),
    tasks: loadTasks()
  };
  var formatTitle = function formatTitle(d) {
    if (titleDay) titleDay.textContent = HEB_DAYS[d.getDay()];
    if (titleDate) titleDate.textContent = "".concat(pad2(d.getDate()), ".").concat(pad2(d.getMonth() + 1), ".").concat(d.getFullYear());
  };
  var markToday = function markToday() {
    titleBadge && titleBadge.setAttribute('data-today', '1');
  };

  /* ===================== Lemon nav open/close ===================== */
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

  /* ===================== Color scale (counter & rings) ===================== */
  function pastelFor(n) {
    var b = n <= 0 ? 0 : Math.min(6, Math.floor((n - 1) / 3) + 1);
    var tones = [{
      fg: '#475569',
      ring: '#e5e7eb'
    },
    // 0
    {
      fg: '#0ea5e9',
      ring: '#93c5fd'
    },
    // 1
    {
      fg: '#16a34a',
      ring: '#86efac'
    },
    // 2
    {
      fg: '#f59e0b',
      ring: '#fde68a'
    },
    // 3
    {
      fg: '#a855f7',
      ring: '#ddd6fe'
    },
    // 4
    {
      fg: '#db2777',
      ring: '#fbcfe8'
    },
    // 5
    {
      fg: '#1d4ed8',
      ring: '#bfdbfe'
    } // 6
    ];
    return _objectSpread({
      band: b
    }, tones[b]);
  }

  /* ===================== Renderers ===================== */
  function render() {
    formatTitle(state.current);
    markToday();
    if (!plannerRoot) return;
    btnDay && btnDay.classList.toggle('is-active', state.view === 'day');
    btnWeek && btnWeek.classList.toggle('is-active', state.view === 'week');
    btnMonth && btnMonth.classList.toggle('is-active', state.view === 'month');
    if (state.view === 'day') renderDay();else if (state.view === 'week') renderWeek();else renderMonth();
  }
  function renderDay() {
    plannerRoot.innerHTML = '';

    // Day nav (prev / today / next)
    var bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.setAttribute('data-scope', 'day'); // scope for day-only CSS
    bar.innerHTML = '<button class="p-weekbar__btn" data-daynav="prev" aria-label="יום קודם">‹</button>' + "<div class=\"p-weekbar__title\">".concat(HEB_DAYS[state.current.getDay()], " \u2014 ").concat(pad2(state.current.getDate()), ".").concat(pad2(state.current.getMonth() + 1), ".").concat(state.current.getFullYear(), "</div>") + '<div class="p-weekbar__right">' + '<button class="p-weekbar__btn" data-daynav="today">היום</button>' + '<button class="p-weekbar__btn" data-daynav="next" aria-label="יום הבא">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-daynav]');
      if (!b) return;
      var k = b.getAttribute('data-daynav');
      if (k === 'prev') state.current.setDate(state.current.getDate() - 1);else if (k === 'next') state.current.setDate(state.current.getDate() + 1);else state.current = new Date();
      render();
      persistPrefs();
    });
    var wrap = document.createElement('div');
    wrap.className = 'p-dayview';
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
        // ORDER (RTL): X, V, hour, text
        row.innerHTML = '<div class="p-daytask__actions">' + "<button class=\"p-ico p-ico--del\" title=\"\u05DE\u05D7\u05E7\"  data-del=\"".concat(t.id, "\"  aria-label=\"\u05DE\u05D7\u05E7\"></button>") + // ❌ pill
        "<button class=\"p-ico p-ico--ok\"  title=\"\u05D1\u05D5\u05E6\u05E2\" data-done=\"".concat(t.id, "\" aria-label=\"\u05D1\u05D5\u05E6\u05E2\"></button>") +
        // ✓ pill
        '</div>' + "<div class=\"p-daytask__time\">".concat(t.time || '', "</div>") + "<div class=\"p-daytask__text\">".concat(escapeHtml(t.title), "</div>");
        wrap.appendChild(row);
      });
    }
    plannerRoot.appendChild(wrap);
  }
  function renderWeek() {
    plannerRoot.innerHTML = '';
    var bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.innerHTML = '<button class="p-weekbar__btn" data-weeknav="prev" aria-label="שבוע קודם">‹</button>' + "<div class=\"p-weekbar__title\">".concat(weekLabel(state.current, weekStart), "</div>") + '<div class="p-weekbar__right">' + '<button class="p-weekbar__btn" data-weeknav="today">היום</button>' + '<button class="p-weekbar__btn" data-weeknav="next" aria-label="שבוע הבא">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var a = e.target.closest('[data-weeknav]');
      if (!a) return;
      var k = a.getAttribute('data-weeknav');
      if (k === 'prev') state.current.setDate(state.current.getDate() - 7);else if (k === 'next') state.current.setDate(state.current.getDate() + 7);else state.current = new Date();
      render();
      persistPrefs();
    });
    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current, weekStart);
    var _loop = function _loop() {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var count = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).length;
      var tone = pastelFor(count);
      var box = document.createElement('div');
      box.className = 'p-day' + (sameDay(day, new Date()) ? ' p-day--today' : '');
      box.dataset["goto"] = ymd;
      var head = document.createElement('div');
      head.className = 'p-day__head p-day__head--flex';
      head.innerHTML = "<span class=\"p-day__name\">".concat(HEB_DAYS[day.getDay()], "</span>") + "<span class=\"p-day__date\">".concat(pad2(day.getDate()), ".").concat(pad2(day.getMonth() + 1), "</span>") + "<button class=\"p-day__count\" data-open=\"".concat(ymd, "\" style=\"--tone:").concat(tone.fg, "; color:").concat(tone.fg, "\">").concat(count, "</button>");
      box.appendChild(head);
      if (state._openWeek === ymd) {
        var items = state.tasks.filter(function (t) {
          return t.date === ymd;
        }).sort(function (a, b) {
          return (a.time || '').localeCompare(b.time || '');
        });
        var list = document.createElement('div');
        list.className = 'p-day__list';
        if (!items.length) {
          list.innerHTML = '<div class="p-empty small">אין אירועים</div>';
        } else {
          items.forEach(function (t) {
            var row = document.createElement('div');
            row.className = 'p-task';
            row.innerHTML = '<div class="p-task__actions">' + "<button class=\"p-ico p-ico--del\" title=\"\u05DE\u05D7\u05E7\"  data-del=\"".concat(t.id, "\"  aria-label=\"\u05DE\u05D7\u05E7\"></button>") + "<button class=\"p-ico p-ico--ok\"  title=\"\u05D1\u05D5\u05E6\u05E2\" data-done=\"".concat(t.id, "\" aria-label=\"\u05D1\u05D5\u05E6\u05E2\"></button>") + '</div>' + "<div class=\"p-task__time\">".concat(t.time || '', "</div>") + "<div class=\"p-task__text\">".concat(escapeHtml(t.title), "</div>");
            list.appendChild(row);
          });
        }
        box.appendChild(list);
      }
      wrap.appendChild(box);
    };
    for (var i = 0; i < 7; i++) {
      _loop();
    }
    plannerRoot.appendChild(wrap);
  }
  function renderMonth() {
    plannerRoot.innerHTML = '';
    var bar = document.createElement('div');
    bar.className = 'p-monthbar';
    bar.innerHTML = '<div class="p-monthbar__left"><button class="p-monthbar__btn" data-monthnav="prev" aria-label="חודש קודם">‹</button></div>' + "<div class=\"p-monthbar__title\">".concat(HEB_MONTHS[state.current.getMonth()], " ").concat(state.current.getFullYear(), "</div>") + '<div class="p-monthbar__right">' + '<button class="p-monthbar__btn" data-monthnav="today">היום</button>' + '<button class="p-monthbar__btn" data-monthnav="next" aria-label="חודש הבא">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var a = e.target.closest('[data-monthnav]');
      if (!a) return;
      var k = a.getAttribute('data-monthnav');
      if (k === 'prev') state.current = addMonths(startOfMonth(state.current), -1);else if (k === 'next') state.current = addMonths(startOfMonth(state.current), 1);else state.current = new Date();
      render();
      persistPrefs();
    });
    var grid = document.createElement('div');
    grid.className = 'p-month';
    var anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    var firstDow = (anchor.getDay() - weekStart + 7) % 7;
    var start = new Date(anchor);
    start.setDate(anchor.getDate() - firstDow);
    var now = new Date();
    var _loop2 = function _loop2() {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var count = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).length;
      var tone = pastelFor(count);
      var cell = document.createElement('div');
      var cls = 'p-cell';
      if (day.getMonth() !== state.current.getMonth()) cls += ' p-cell--pad';
      if (sameDay(day, now)) cls += ' p-cell--today';
      cell.className = cls;
      cell.dataset["goto"] = ymd;
      cell.style.setProperty('--ring-color', tone.fg);
      var num = document.createElement('div');
      num.className = 'p-cell__num';
      num.textContent = day.getDate();
      if (count > 0) {
        var badge = document.createElement('span');
        badge.className = 'p-count';
        badge.textContent = count;
        badge.style.setProperty('--tone', tone.fg);
        badge.style.color = tone.fg;
        cell.appendChild(badge);
      }
      cell.appendChild(num);
      grid.appendChild(cell);
    };
    for (var i = 0; i < 42; i++) {
      _loop2();
    }
    plannerRoot.appendChild(grid);

    // swipe months
    var touchX = 0,
      swiping = false;
    grid.addEventListener('touchstart', function (e) {
      if (e.touches[0]) {
        touchX = e.touches[0].clientX;
        swiping = true;
      }
    }, {
      passive: true
    });
    grid.addEventListener('touchend', function (e) {
      if (!swiping) return;
      var dx = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX - touchX : 0;
      if (Math.abs(dx) > 40) {
        state.current = addMonths(startOfMonth(state.current), dx < 0 ? 1 : -1);
        render();
      }
      swiping = false;
    }, {
      passive: true
    });
  }

  /* ===================== Interactions ===================== */
  btnDay && btnDay.addEventListener('click', function () {
    state.view = 'day';
    render();
    prefs.defaultView = 'day';
    persistPrefs();
  });
  btnWeek && btnWeek.addEventListener('click', function () {
    state.view = 'week';
    render();
    prefs.defaultView = 'week';
    persistPrefs();
  });
  btnMonth && btnMonth.addEventListener('click', function () {
    state.view = 'month';
    render();
    prefs.defaultView = 'month';
    persistPrefs();
  });
  if (plannerRoot) {
    plannerRoot.addEventListener('click', function (e) {
      var openBtn = e.target && e.target.closest('[data-open]');
      if (openBtn) {
        var dayKey = openBtn.getAttribute('data-open');
        state._openWeek = state._openWeek === dayKey ? null : dayKey;
        render();
        return;
      }
      var hostGoto = e.target && e.target.closest('[data-goto]');
      if (hostGoto && !e.target.closest('[data-open]')) {
        state.current = fromKey(hostGoto.dataset["goto"]);
        state.view = 'day';
        render();
        return;
      }
      var doneId = e.target && e.target.getAttribute('data-done');
      var delId = e.target && e.target.getAttribute('data-del');
      if (doneId) {
        blastConfetti(e.clientX || 0, e.clientY || 0, 1.0);
        state.tasks = state.tasks.filter(function (t) {
          return t.id !== doneId;
        });
        saveTasks();
        render();
      } else if (delId) {
        var row = e.target.closest('.p-task,.p-daytask');
        if (row) {
          row.classList.add('is-scratching');
          setTimeout(function () {
            state.tasks = state.tasks.filter(function (t) {
              return t.id !== delId;
            });
            saveTasks();
            render();
          }, 520);
        } else {
          state.tasks = state.tasks.filter(function (t) {
            return t.id !== delId;
          });
          saveTasks();
          render();
        }
      }
    });
  }

  /* ===================== Bottom Sheet ===================== */
  function openSheet() {
    if (!sheet) return;
    var now = new Date();
    if (dateInput && !dateInput.value) dateInput.value = dateKey(now);
    if (timeInput && !timeInput.value) timeInput.value = "".concat(pad2(now.getHours()), ":").concat(pad2(now.getMinutes()));
    sheet.classList.remove('u-hidden');
    sheet.classList.add('is-open');
    try {
      titleInput && titleInput.focus();
    } catch (_unused7) {}
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    setTimeout(function () {
      return sheet.classList.add('u-hidden');
    }, 220);
  }
  if (sheet) {
    sheetClose && sheetClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeSheet();
    });
    sheetPanel && sheetPanel.addEventListener('click', function (e) {
      var qd = e.target && e.target.closest('.qp__chip[data-date]');
      if (qd) {
        e.preventDefault();
        var kind = qd.getAttribute('data-date');
        var base = new Date();
        if (kind === 'tomorrow') base.setDate(base.getDate() + 1);else if (kind === 'nextweek') base.setDate(base.getDate() + 7);else if (/^\+\d+$/.test(kind)) base.setDate(base.getDate() + parseInt(kind.slice(1), 10));
        if (dateInput) dateInput.value = dateKey(base);
        return;
      }
      var qt = e.target && e.target.closest('.qp__chip[data-time]');
      if (qt) {
        e.preventDefault();
        var k = qt.getAttribute('data-time');
        var now = new Date();
        if (/^now\+\d+$/.test(k)) {
          var m = parseInt(k.split('+')[1], 10) || 0;
          now.setMinutes(now.getMinutes() + m);
          timeInput && (timeInput.value = "".concat(pad2(now.getHours()), ":").concat(pad2(now.getMinutes())));
        } else if (/^\d{2}:\d{2}$/.test(k)) {
          timeInput && (timeInput.value = k);
        }
      }
    });
    sheet.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.c-sheet__backdrop')) closeSheet();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  sheetForm && sheetForm.addEventListener('submit', function (e) {
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

  /* ===================== Logout ===================== */
  function clearAuthAll() {
    try {
      ['authUser', 'authName', 'token', 'auth.token', 'auth.user', 'looz:justLoggedIn', 'looz:loggedOut'].forEach(function (k) {
        try {
          localStorage.removeItem(k);
        } catch (_unused8) {}
        try {
          sessionStorage.removeItem(k);
        } catch (_unused9) {}
      });
    } catch (_unused0) {}
  }
  function handleLogout() {
    window.__loozLoggingOut = true;
    clearAuthAll();
    try {
      localStorage.setItem('looz:loggedOut', '1');
    } catch (_unused1) {}
    window.location.replace('auth.html?loggedout=1');
  }

  /* ===================== Effects & INLINE CSS ===================== */
  function blastConfetti(x, y, scale) {
    var layer = document.createElement('div');
    layer.className = 'fx-confetti';
    document.body.appendChild(layer);
    var N = 110;
    for (var i = 0; i < N; i++) {
      var s = document.createElement('span');
      s.className = 'fx-c';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.random() * 2 - 1) * 200 * scale + 'px');
      s.style.setProperty('--dy', -Math.random() * 240 * scale + 'px');
      s.style.setProperty('--r', Math.random() * 720 + 'deg');
      s.style.setProperty('--t', 600 + Math.random() * 700 + 'ms');
      layer.appendChild(s);
    }
    setTimeout(function () {
      return layer.remove();
    }, 1600);
  }

  // Replace previous injected styles
  var prev = document.getElementById('looz-fixes-v12');
  if (prev) prev.remove();
  var style = document.createElement('style');
  style.id = 'looz-fixes-v12';
  style.textContent = "\n  /* --- Week header: name + date (counter centered on day) --- */\n  .p-day__head.p-day__head--flex{\n    display:grid; grid-template-columns:1fr auto; align-items:center; column-gap:.5rem; padding:0 .5rem;\n  }\n  .p-day__name{justify-self:start;font-weight:700}\n  .p-day__date{justify-self:end;opacity:.9;font-weight:800}\n\n  /* Counter centered in the day box */\n  .p-day{ position:relative; }\n  .p-day__count{\n    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);\n    width:24px; height:24px; border-radius:999px; display:grid; place-items:center;\n    font:800 12px/1 'Rubik',system-ui,sans-serif; background:#fff; border:1.5px solid var(--tone,#e5e7eb);\n    box-shadow:0 2px 6px rgba(0,0,0,.08);\n  }\n  html[data-theme=\"dark\"] .p-day__count{background:rgba(13,23,44,.92);}\n\n  /* Week rows (unchanged) */\n  .p-task{ display:grid; grid-template-columns:auto auto 1fr; align-items:center; gap:.5rem; }\n  .p-task__actions, .p-daytask__actions{ display:flex; gap:.35rem; align-items:center; }\n  .p-task__time{ font-weight:700; min-width:3.2rem; text-align:center; }\n  .p-task__text{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n\n  /* Day rows: X, V, hour, text */\n  .p-daytask{ display:grid; grid-template-columns:auto auto auto 1fr; align-items:center; gap:.5rem; }\n  .p-daytask__time{ font-weight:700; min-width:3.2rem; text-align:center; }\n  .p-daytask__text{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n\n  /* Icon pills */\n  .p-ico{\n    width:30px; height:30px; border-radius:999px; display:inline-grid; place-items:center; cursor:pointer;\n    background:\n      radial-gradient(140% 120% at 35% 30%, #fff 0%, rgba(255,255,255,.45) 46%, rgba(255,255,255,0) 70%),\n      linear-gradient(180deg,#fff7df,#f2e5bf);\n    border:1px solid #e2d4a6;\n    box-shadow:0 2px 6px rgba(0,0,0,.08), inset 0 0 .4rem rgba(255,255,255,.75);\n  }\n  .p-ico:active{ transform:translateY(1px); }\n  .p-ico--ok::before,\n  .p-ico--del::before{\n    content:\"\"; display:block; width:18px; height:18px; background:transparent;\n    -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;\n    -webkit-mask-position:center; mask-position:center;\n    -webkit-mask-size:contain; mask-size:contain;\n  }\n  /* \u2713 */\n  .p-ico--ok::before{\n    background:#0f7b4b;\n    -webkit-mask-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path d=\"M7.8 13.6 3.9 9.8l-1.4 1.4 5.3 5.2L18 6.2l-1.4-1.4z\" fill=\"%23000\"/></svg>');\n            mask-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path d=\"M7.8 13.6 3.9 9.8l-1.4 1.4 5.3 5.2L18 6.2l-1.4-1.4z\" fill=\"%23000\"/></svg>');\n  }\n  /* \u274C \u2014 stroke with width so it actually shows */\n  .p-ico--del::before{\n    background:#b3261e;\n    -webkit-mask-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path d=\"M5 5L15 15M15 5L5 15\" stroke=\"%23000\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></svg>');\n            mask-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path d=\"M5 5L15 15M15 5L5 15\" stroke=\"%23000\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></svg>');\n  }\n\n  /* Month grid (unchanged) */\n  .p-month{display:grid;grid-template-columns:repeat(7,1fr);gap:.7rem}\n  .p-cell{\n    position:relative; aspect-ratio:1/1; border-radius:16px; background:#fff;\n    box-shadow: inset 0 0 0 2px var(--ring-color, #e5e7eb), 0 8px 16px rgba(15,23,42,.06);\n    display:grid; place-items:center; cursor:pointer;\n  }\n  .p-cell--pad{background:#f8fafc; opacity:.9}\n  .p-cell__num{ font-weight:900; font-size:1.15rem; color:#0f172a; position:relative; z-index:1; }\n  .p-cell--today{ --ring-color:#e8c65c; }\n  .p-cell--today .p-cell__num{ color:#0f172a; }\n\n  /* Month counter badge */\n  .p-count{\n    position:absolute; top:-9px; left:50%; transform:translateX(-50%);\n    min-width:18px; height:18px; padding:0 6px; border-radius:999px;\n    display:grid; place-items:center; font:800 10px/1 'Rubik',system-ui,sans-serif;\n    background:#fff; border:2px solid var(--tone, #94a3b8); z-index:2;\n    box-shadow:0 2px 6px rgba(0,0,0,.08);\n  }\n\n  /* Day-only nav arrows (same square size as week/month) */\n  .p-weekbar[data-scope=\"day\"] .p-weekbar__btn[data-daynav=\"prev\"],\n  .p-weekbar[data-scope=\"day\"] .p-weekbar__btn[data-daynav=\"next\"]{\n    width:36px; height:36px; padding:0;\n    border-radius:999px; border:1px solid #e5e7eb; background:#fff;\n    display:grid; place-items:center; font-size:18px; font-weight:800; line-height:1;\n  }\n\n  /* Bottom actions & Confetti */\n  .c-bottom-cta{ position:sticky; bottom:max(12px, env(safe-area-inset-bottom)); display:grid; justify-items:center; gap:.55rem; }\n  .looz-bottom-stack{ display:grid; gap:.55rem; justify-items:center; }\n  .c-fab{ width:60px; height:60px; border-radius:999px; display:grid; place-items:center;\n          background:radial-gradient(140% 120% at 35% 30%, #fff 0, rgba(255,255,255,.35) 45%, rgba(255,255,255,0) 70%),\n                     linear-gradient(180deg,#fff4d0,#ffd08a);\n          border:1px solid rgba(0,0,0,.06); box-shadow:inset 0 0 .45rem rgba(255,255,255,.75),0 .35rem 1rem rgba(0,0,0,.14);}\n  .c-fab svg{ width:28px; height:28px; }\n  #btnExit.c-topbtn{ inline-size:2.4rem; height:2.4rem; border-radius:50%; display:grid; place-items:center; }\n\n  /* Confetti */\n  .fx-confetti{position:fixed;inset:0;pointer-events:none;z-index:9999}\n  .fx-c{position:absolute;width:9px;height:9px;background:hsl(calc(360*var(--h,.5)),90%,60%);transform:translate(-50%,-50%);border-radius:2px;animation:confThrow var(--t) ease-out forwards}\n  .fx-c:nth-child(4n){--h:.1}.fx-c:nth-child(4n+1){--h:.22}.fx-c:nth-child(4n+2){--h:.62}.fx-c:nth-child(4n+3){--h:.82}\n  @keyframes confThrow{to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--r));opacity:0}}\n\n  /* Dark mode tweaks */\n  html[data-theme=\"dark\"] .p-day__count{background:rgba(13,23,44,.92);}\n  html[data-theme=\"dark\"] .p-cell{ background:#0f1b32; box-shadow: inset 0 0 0 2px var(--ring-color,#2a4674); }\n  html[data-theme=\"dark\"] .p-cell__num{ color:#eaf2ff; }\n  html[data-theme=\"dark\"] .p-cell--today .p-cell__num{ color:#eed27b; }\n  html[data-theme=\"dark\"] .p-count{ background:rgba(13,23,44,.92); color:#cbd5e1; border-color:#334155; }\n  ";
  document.head.appendChild(style);

  /* ===================== Bottom buttons (icons & layout) ===================== */
  (function pinBottom() {
    var ctaWrap = document.querySelector('.c-bottom-cta');
    if (!ctaWrap || !addEventBtn || !btnExit) return;
    ctaWrap.innerHTML = '<div class="looz-bottom-stack"></div>';
    var host = ctaWrap.firstElementChild;

    // Create Event
    addEventBtn.className = 'c-fab';
    addEventBtn.setAttribute('aria-label', 'יצירת אירוע חדש');
    addEventBtn.innerHTML = "\n      <svg viewBox=\"0 0 48 48\" aria-hidden=\"true\">\n        <defs>\n          <linearGradient id=\"papScroll\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#fff6d6\"/><stop offset=\"100%\" stop-color=\"#f0d6a8\"/></linearGradient>\n          <linearGradient id=\"inkPlus\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#1e3a8a\"/><stop offset=\"100%\" stop-color=\"#0ea5e9\"/></linearGradient>\n        </defs>\n        <rect x=\"12\" y=\"10\" width=\"24\" height=\"28\" rx=\"6\" ry=\"6\" fill=\"url(#papScroll)\" stroke=\"#c9aa6b\"/>\n        <circle cx=\"35\" cy=\"14\" r=\"6\" fill=\"url(#inkPlus)\"/>\n        <path d=\"M35 11v6M32 14h6\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n      </svg>";
    addEventBtn.onclick = function (e) {
      e.preventDefault();
      openSheet();
    };

    // Logout
    btnExit.className = 'c-topbtn';
    btnExit.setAttribute('aria-label', 'התנתקות');
    btnExit.innerHTML = "\n      <svg viewBox=\"0 0 28 28\" width=\"18\" height=\"18\" aria-hidden=\"true\">\n        <defs>\n          <linearGradient id=\"exDoor2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#F4D27A\"/><stop offset=\"100%\" stop-color=\"#C8A043\"/>\n          </linearGradient>\n          <linearGradient id=\"exArrow2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n            <stop offset=\"0%\" stop-color=\"#22D3EE\"/><stop offset=\"100%\" stop-color=\"#60A5FA\"/>\n          </linearGradient>\n        </defs>\n        <rect x=\"4\" y=\"6\" width=\"10\" height=\"16\" rx=\"2\" fill=\"url(#exDoor2)\" stroke=\"#9A7A2E\"/>\n        <circle cx=\"11\" cy=\"14\" r=\"1\" fill=\"#7C5B13\"/>\n        <path d=\"M14 14h8m0 0-3-3m3 3-3 3\" fill=\"none\" stroke=\"url(#exArrow2)\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>";
    btnExit.onclick = function (e) {
      e.preventDefault();
      handleLogout();
    };
    host.appendChild(addEventBtn);
    host.appendChild(btnExit);
  })();

  /* ===================== Login Intro (kept) ===================== */
  (function intro() {
    var lemonBtn = document.getElementById('lemonToggle');
    if (!lemonBtn) return;
    try {
      if (localStorage.getItem('looz:justLoggedIn') !== '1') return;
      localStorage.removeItem('looz:justLoggedIn');
    } catch (_unused10) {}
    var screen = document.createElement('div');
    screen.className = 'intro-screen';
    var wrap = document.createElement('div');
    wrap.className = 'intro-wrap';
    wrap.innerHTML = "\n      <svg class=\"intro-lemon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n        <defs>\n          <radialGradient id=\"introLem\" cx=\"50%\" cy=\"40%\" r=\"75%\">\n            <stop offset=\"0%\" stop-color=\"#FFF8C6\"/><stop offset=\"50%\" stop-color=\"#FFE36E\"/><stop offset=\"100%\" stop-color=\"#F7C843\"/>\n          </radialGradient>\n          <linearGradient id=\"introSweepG\" x1=\"0\" y1=\"1\" x2=\"0\" y2=\"0\">\n            <stop offset=\"0\" stop-color=\"rgba(0,229,255,0)\"/><stop offset=\".28\" stop-color=\"rgba(0,229,255,.30)\"/>\n            <stop offset=\".54\" stop-color=\"rgba(255,215,102,.70)\"/><stop offset=\".78\" stop-color=\"rgba(136,167,255,.40)\"/>\n            <stop offset=\"1\" stop-color=\"rgba(0,229,255,0)\"/>\n          </linearGradient>\n          <radialGradient id=\"introGlintG\" cx=\"50%\" cy=\"50%\" r=\"60%\">\n            <stop offset=\"0%\" stop-color=\"rgba(255,248,198,.98)\"/><stop offset=\"70%\" stop-color=\"rgba(255,214,100,.45)\"/>\n            <stop offset=\"100%\" stop-color=\"rgba(255,214,100,0)\"/>\n          </radialGradient>\n          <clipPath id=\"introClip\"><path d=\"M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6\"/></clipPath>\n        </defs>\n        <g>\n          <path d=\"M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6\" fill=\"url(#introLem)\" stroke=\"#C59A21\" stroke-width=\"1.1\"/>\n          <path d=\"M18 6c.9-.9 1.7-1.8 2.3-2.8\" stroke=\"#6FA14D\" stroke-linecap=\"round\" stroke-width=\"1.2\"/>\n        </g>\n        <g clip-path=\"url(#introClip)\"><rect class=\"intro-sweep\" x=\"0\" y=\"0\" width=\"100%\" height=\"140%\" fill=\"url(#introSweepG)\"/><circle class=\"intro-glint\" cx=\"12\" cy=\"22\" r=\"3.6\" fill=\"url(#introGlintG)\"/></g>\n      </svg>";
    screen.appendChild(wrap);
    document.body.appendChild(screen);
    requestAnimationFrame(function () {
      wrap.classList.add('is-in');
    });
    setTimeout(function () {
      var r = lemonBtn.getBoundingClientRect();
      var w = wrap.getBoundingClientRect();
      var dx = r.left + r.width / 2 - (w.left + w.width / 2);
      var dy = r.top + r.height / 2 - (w.top + w.height / 2);
      var scale = r.width / w.width * 1.0;
      screen.classList.add('is-fly');
      wrap.style.transform = "translate(".concat(dx, "px,").concat(dy, "px) scale(").concat(scale, ")");
      wrap.style.opacity = '0.0';
      setTimeout(function () {
        screen.remove();
      }, 900);
    }, 3000);
    if (!document.getElementById('intro-style')) {
      var s2 = document.createElement('style');
      s2.id = 'intro-style';
      s2.textContent = "\n        .intro-screen{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;pointer-events:none;background:#fff;}\n        html[data-theme=\"dark\"] .intro-screen{background:#0b1529;}\n        .intro-wrap{opacity:0;transform:scale(.85);filter:blur(18px);transition:opacity 900ms cubic-bezier(.16,1,.3,1),transform 900ms cubic-bezier(.16,1,.3,1),filter 900ms;}\n        .intro-wrap.is-in{opacity:1;transform:scale(1);filter:blur(0);}\n        .intro-lemon{display:block;width:clamp(120px,34vw,180px);filter:drop-shadow(0 20px 42px rgba(6,12,26,.35));}\n        .intro-sweep{transform:translateY(80%);opacity:.7;animation:introSweep 1600ms cubic-bezier(.16,1,.3,1) 450ms forwards;}\n        .intro-glint{transform: translateY(78%) scale(.9);opacity:0;animation:introGlint 1300ms cubic-bezier(.16,1,.3,1) 600ms forwards;}\n        @keyframes introSweep{0%{transform:translateY(80%);opacity:.65;}70%{transform:translateY(-6%);opacity:.95;}100%{transform:translateY(-16%);opacity:0;}}\n        @keyframes introGlint{0%{opacity:0;transform: translateY(78%) scale(.9);}55%{opacity:.95;}100%{opacity:0;transform: translateY(-10%) scale(1.06);}}\n        .intro-screen.is-fly .intro-wrap{transition:transform 800ms cubic-bezier(.4,0,.2,1), opacity 800ms;}\n      ";
      document.head.appendChild(s2);
    }
  })();

  /* ===================== Initial ===================== */
  var _today = new Date();
  state.current = _today;
  formatTitle(_today);
  render();
})();

/* --- AUTH GUARD (skip on auth page) --- */
(function () {
  try {
    if (/auth\.html(?:$|\?)/.test(location.pathname)) return;
    var u = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
    if (!u) location.replace('auth.html');
  } catch (_) {
    location.replace('auth.html');
  }
})();
