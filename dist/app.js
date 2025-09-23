"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* ===== LooZ — Planner App (home) — visible tiny counter + tidy month + matched logout size ===== */
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

  /* ===================== Helpers & Path ===================== */
  function go(href) {
    window.location.href = href;
  }
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

  // hex -> rgba
  function hexToRgb(hex) {
    var h = (hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) {
      return c + c;
    }).join('');
    var num = parseInt(h, 16);
    return {
      r: num >> 16 & 255,
      g: num >> 8 & 255,
      b: num & 255
    };
  }
  function rgbaFromHex(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (a == null ? 1 : a) + ')';
  }
  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  function weekLabel(d, weekStart) {
    var s = startOfWeek(d, weekStart);
    var e = new Date(s);
    e.setDate(s.getDate() + 6);
    var sM = HEB_MONTHS[s.getMonth()],
      eM = HEB_MONTHS[e.getMonth()];
    if (s.getMonth() === e.getMonth()) return s.getDate() + '–' + e.getDate() + ' ' + sM + ' ' + e.getFullYear();
    return s.getDate() + ' ' + sM + ' – ' + e.getDate() + ' ' + eM + ' ' + e.getFullYear();
  }

  /* ===================== DOM refs ===================== */
  var btnProfile = document.getElementById('btnProfile');
  var btnMenu = document.getElementById('btnMenu');
  var btnCategories = document.getElementById('btnCategories');
  var btnSocial = document.getElementById('btnSocial');
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
  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var navPanel = appNav ? appNav.querySelector('.c-nav__panel') : null;
  var titleDay = document.getElementById('titleDay');
  var titleDate = document.getElementById('titleDate');
  var titleBadge = document.getElementById('titleBadge');
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
  var subtitleEl = document.querySelector('.c-subtitle');

  // bottom buttons
  var addEventBtn = document.getElementById('addEventBtn'); // big circular
  var btnExit = document.getElementById('btnExit'); // exact same size & shape as header small icons

  /* ===================== Greeting ===================== */
  function getAuth() {
    try {
      var raw = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
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
    if (prof && prof.firstName) return prof.firstName;
    if (prof && prof.name) return prof.name;
    var au = getAuth();
    if (au) return au.firstName || au.name || au.displayName || au.email || 'חברה';
    var alt = localStorage.getItem('authName');
    return alt || 'חברה';
  }
  (function setGreeting() {
    var name = escapeHtml(getDisplayName());
    var au = getAuth();
    var SPECIAL_EMAIL = 'daniellagg21@gmail.com';
    var isSpecial = au && String(au.email || '').toLowerCase() === SPECIAL_EMAIL.toLowerCase();
    if (subtitleEl) {
      subtitleEl.innerHTML = isSpecial ? '<span style="display:block;font-weight:800">מלכה שלי</span>' + '<span style="display:block">איזה כיף שחזרת <strong>' + name + '</strong></span>' + '<span style="display:block">לוז מושלם מחכה לך</span>' : 'ברוכים השבים, <strong id="uiName">' + name + '</strong>!<br>מה בלוז היום?';
    } else {
      var u = document.getElementById('uiName');
      if (u) u.textContent = name;
    }
  })();

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
    view: prefs.defaultView || 'week',
    current: today,
    tasks: loadTasks()
  };
  function formatTitle(d) {
    if (titleDay) titleDay.textContent = HEB_DAYS[d.getDay()];
    if (titleDate) titleDate.textContent = pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }
  function markToday() {
    if (titleBadge) titleBadge.setAttribute('data-today', '1');
  }

  /* ===================== Nav open/close ===================== */
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

  /* ===================== Color scales ===================== */
  function toneFor(n) {
    var bucket = n <= 0 ? 0 : Math.min(6, Math.floor((n - 1) / 3) + 1);
    return ['#D9DEE7',
    // 0
    '#93C5FD',
    // 1–3
    '#86EFAC',
    // 4–6
    '#FBCB6A',
    // 7–9
    '#C4B5FD',
    // 10–12
    '#F9A8D4',
    // 13–15
    '#60A5FA' // 16+
    ][bucket];
  }

  /* ===================== Renderers ===================== */
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

    // Day header with prev/today/next
    var bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.innerHTML = '<button class="p-weekbar__btn" data-daynav="prev" aria-label="אתמול">‹</button>' + '<div class="p-weekbar__title">' + HEB_DAYS[state.current.getDay()] + ' – ' + pad2(state.current.getDate()) + '.' + pad2(state.current.getMonth() + 1) + '.' + state.current.getFullYear() + '</div>' + '<div class="p-weekbar__right">' + '<button class="p-weekbar__btn" data-daynav="today">היום</button>' + '<button class="p-weekbar__btn" data-daynav="next" aria-label="מחר">›</button>' + '</div>';
    plannerRoot.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var a = e.target.closest('[data-daynav]');
      if (!a) return;
      var kind = a.getAttribute('data-daynav');
      if (kind === 'prev') state.current.setDate(state.current.getDate() - 1);else if (kind === 'next') state.current.setDate(state.current.getDate() + 1);else state.current = new Date();
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
      var count = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).length;
      var box = document.createElement('div');
      box.className = 'p-day' + (sameDay(day, new Date()) ? ' p-day--today' : '');
      box.dataset["goto"] = ymd;
      var head = document.createElement('div');
      head.className = 'p-day__head';
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[day.getDay()] + '</span>' + '<span class="p-day__date">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span>' + '<span class="p-day__count" data-open="' + ymd + '">' + count + '</span>';
      box.appendChild(head);
      if (state._openWeek && state._openWeek === ymd) {
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
            row.innerHTML = '<div class="p-task__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-task__time">' + (t.time || '') + '</div>' + '<div class="p-task__actions">' + '<button class="p-task__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-task__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
            list.appendChild(row);
          });
        }
        box.appendChild(list);
      }
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
    var now = new Date();
    var curKey = dateKey(state.current);
    for (var i = 0; i < 42; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var count = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).length;
      var ring = toneFor(count);
      var chipBg = rgbaFromHex(ring, 0.22);
      var chipFg = ring;
      var isToday = sameDay(day, now);
      var cell = document.createElement('div');
      var cls = 'p-cell';
      if (ymd === curKey) cls += ' p-cell--selected';
      if (day.getMonth() !== state.current.getMonth()) cls += ' p-cell--pad';
      cell.className = cls;
      cell.dataset["goto"] = ymd;

      // match ring & chip colors
      cell.style.setProperty('--ring', ring);
      cell.style.setProperty('--chipBg', chipBg);
      cell.style.setProperty('--chipFg', chipFg);
      var num = document.createElement('div');
      num.className = 'p-date';
      num.textContent = day.getDate();
      if (isToday) num.classList.add('is-today');
      cell.appendChild(num);
      if (count > 0) {
        var chip = document.createElement('div');
        chip.className = 'p-chip';
        chip.textContent = String(count);
        cell.appendChild(chip);
      }
      grid.appendChild(cell);
    }
    plannerRoot.appendChild(grid);

    // swipe months (touch)
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
        blastConfetti(e.clientX, e.clientY, 1.0);
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
  if (sheet) {
    if (sheetClose) sheetClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeSheet();
    });
    if (sheetPanel) {
      sheetPanel.addEventListener('click', function (e) {
        var qd = e.target && e.target.closest('.qp__chip[data-date]');
        if (qd) {
          e.preventDefault();
          var kind = qd.getAttribute('data-date');
          var base = new Date();
          if (kind === 'today') {/* keep */} else if (kind === 'tomorrow') base.setDate(base.getDate() + 1);else if (kind === 'nextweek') base.setDate(base.getDate() + 7);else if (/^\+\d+$/.test(kind)) base.setDate(base.getDate() + parseInt(kind.slice(1), 10));
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
      });
    }
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

  /* ===================== Bottom icons (Create big, Logout same size as profile/settings) ===================== */
  (function wireBottomIcons() {
    var host = document.querySelector('.c-bottom-cta');
    if (!host) return;
    host.style.display = 'grid';
    host.style.gridAutoFlow = 'row';
    host.style.justifyItems = 'center';
    host.style.alignContent = 'end';
    host.style.gap = '12px';

    // CREATE — bigger circular fab
    if (addEventBtn) {
      addEventBtn.className = 'c-fab c-fab--create';
      addEventBtn.setAttribute('aria-label', 'יצירת אירוע חדש');
      addEventBtn.innerHTML = "\n        <svg viewBox=\"0 0 64 64\" width=\"28\" height=\"28\" aria-hidden=\"true\">\n          <defs>\n            <linearGradient id=\"tabBg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n              <stop offset=\"0%\" stop-color=\"#FFFFFF\"/><stop offset=\"100%\" stop-color=\"#F0FFF4\"/>\n            </linearGradient>\n            <linearGradient id=\"tabPlus\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n              <stop offset=\"0%\" stop-color=\"#047857\"/><stop offset=\"100%\" stop-color=\"#22C55E\"/>\n            </linearGradient>\n            <linearGradient id=\"tabInk\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n              <stop offset=\"0%\" stop-color=\"#1F2937\"/><stop offset=\"100%\" stop-color=\"#2563EB\"/>\n            </linearGradient>\n          </defs>\n          <rect x=\"18\" y=\"14\" rx=\"6\" ry=\"6\" width=\"28\" height=\"36\" fill=\"url(#tabBg)\" stroke=\"#CDE7D5\"/>\n          <g stroke=\"url(#tabInk)\" stroke-width=\"2\" stroke-linecap=\"round\">\n            <line x1=\"22\" y1=\"22\" x2=\"42\" y2=\"22\"/>\n            <line x1=\"22\" y1=\"28\" x2=\"42\" y2=\"28\"/>\n          </g>\n          <circle cx=\"48\" cy=\"16\" r=\"8\" fill=\"#fff\"/>\n          <path d=\"M48 12v8M44 16h8\" stroke=\"url(#tabPlus)\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        </svg>";
      addEventBtn.onclick = function (e) {
        e.preventDefault();
        openSheet();
      };
      if (!host.contains(addEventBtn)) host.appendChild(addEventBtn);
    }

    // LOGOUT — EXACT same size & shape as small round header icons (44x44 circle)
    if (btnExit) {
      btnExit.className = 'c-fab c-fab--small';
      btnExit.setAttribute('aria-label', 'התנתקות');
      btnExit.innerHTML = "\n        <svg viewBox=\"0 0 28 28\" width=\"18\" height=\"18\" aria-hidden=\"true\">\n          <defs>\n            <linearGradient id=\"doorBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n              <stop offset=\"0%\" stop-color=\"#FFF1C7\"/><stop offset=\"100%\" stop-color=\"#FFE6A9\"/>\n            </linearGradient>\n            <linearGradient id=\"exitArr\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n              <stop offset=\"0%\" stop-color=\"#22D3EE\"/><stop offset=\"100%\" stop-color=\"#60A5FA\"/>\n            </linearGradient>\n          </defs>\n          <rect x=\"5\" y=\"6\" width=\"12\" height=\"16\" rx=\"3\" fill=\"url(#doorBg)\" stroke=\"#E8C75E\"/>\n          <circle cx=\"14\" cy=\"14\" r=\"1\" fill=\"#AF8A2E\"/>\n          <path d=\"M16 14h7m0 0-2.5-2.5M23 14l-2.5 2.5\" fill=\"none\" stroke=\"url(#exitArr)\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>";
      btnExit.addEventListener('click', function (e) {
        e.preventDefault();
        handleLogout();
      });
      if (!host.contains(btnExit)) host.appendChild(btnExit);
    }
  })();

  /* ===================== Logout helpers ===================== */
  function clearAuthAll() {
    try {
      ['authUser', 'authName', 'token', 'auth.token', 'auth.user', 'looz:justLoggedIn', 'looz:loggedOut'].forEach(function (k) {
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
    window.location.replace('auth.html?loggedout=1');
  }

  /* ===================== Effects & injected CSS ===================== */
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
  if (!document.getElementById('looz-inline-fixes')) {
    var s = document.createElement('style');
    s.id = 'looz-inline-fixes';
    s.textContent = "\n      /* --- Bars --- */\n      .p-weekbar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin:.35rem 0 .6rem;gap:.6rem}\n      .p-weekbar__right{justify-self:end;display:flex;gap:.4rem}\n      .p-weekbar__btn{border:1px solid #e5e7eb;background:#fff;border-radius:999px;height:36px;padding:0 14px;font-weight:700}\n      .p-weekbar__btn[data-weeknav=\"prev\"],.p-weekbar__btn[data-weeknav=\"next\"],\n      .p-weekbar__btn[data-daynav=\"prev\"], .p-weekbar__btn[data-daynav=\"next\"]{width:36px;padding:0;display:grid;place-items:center;font-size:18px;line-height:1}\n      .p-weekbar__title{text-align:center;font-weight:800}\n\n      .p-day__head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 8px}\n      .p-day__name{justify-self:start;font-weight:700}\n      .p-day__date{justify-self:end;opacity:.85}\n      .p-day__count{justify-self:center;inline-size:26px;height:26px;border-radius:999px;font:700 12px/26px 'Rubik',system-ui,sans-serif;background:#fff;border:1px solid #e5e7eb}\n\n      /* --- MONTH: airy grid, one circle, visible tiny counter --- */\n      .p-month{display:grid;grid-template-columns:repeat(7,1fr);gap:1.35rem 1.2rem;padding:.4rem .2rem}\n      .p-cell{\n        position:relative; aspect-ratio:1/1; border-radius:18px;\n        background:#fff; border:2px solid var(--ring,#D9DEE7);\n        box-shadow:0 6px 14px rgba(2,6,23,.05);\n        display:flex; align-items:center; justify-content:center;\n        overflow:visible; /* so the chip can breathe */\n        padding-top:10px; /* make room inside for chip without touching number */\n      }\n      /* Kill any theme hooks/semi-circles */\n      .p-cell::before,.p-cell::after,.p-cell .p-date::before,.p-cell .p-date::after{display:none !important;content:none !important;}\n\n      .p-cell--pad{opacity:.92; background:#fafbff; border-color:#EEF2F7}\n      .p-cell--selected{box-shadow:0 8px 18px rgba(2,6,23,.08)}\n\n      .p-date{font:900 20px/1 'Rubik',system-ui,sans-serif;color:#0f172a;margin-top:6px}\n      .p-date.is-today{color:#C6921A;} /* gold number only */\n\n      /* Tiny counter chip \u2014 small, fully visible, color-matched, not touching date */\n      .p-chip{\n        position:absolute; top:4px; left:50%; transform:translateX(-50%);\n        min-width:14px; height:14px; padding:0 4px; border-radius:999px;\n        font:800 9px/14px 'Rubik',system-ui,sans-serif;\n        background:var(--chipBg,rgba(0,0,0,.12)); color:var(--chipFg,#111827);\n        border:1px solid var(--ring,#D9DEE7);\n        box-shadow:0 1px 2px rgba(2,6,23,.08);\n        z-index:2;\n      }\n\n      /* --- Bottom buttons --- */\n      .c-bottom-cta{position:sticky;bottom:max(12px,env(safe-area-inset-bottom));background:transparent;margin-top:.75rem}\n      .c-fab{display:grid;place-items:center;border-radius:999px; border:1px solid #e5e7eb;\n             background:linear-gradient(180deg,#ffffff,#f7fbff); box-shadow:0 10px 20px rgba(2,6,23,.10)}\n      .c-fab--create{inline-size:64px; block-size:64px}\n      /* EXACT same size/shape as profile/settings for logout */\n      .c-fab--small{inline-size:44px; block-size:44px}\n      .c-fab svg{display:block}\n\n      /* Dark mode */\n      html[data-theme=\"dark\"] .p-cell{background:#0f1b32;border-color:#27406f;box-shadow:0 6px 14px rgba(13,99,255,.12)}\n      html[data-theme=\"dark\"] .p-cell--pad{background:#0c1529;border-color:#1b305a}\n      html[data-theme=\"dark\"] .p-date{color:#eaf2ff}\n      html[data-theme=\"dark\"] .p-date.is-today{color:#FFD56B}\n      html[data-theme=\"dark\"] .c-fab{background:linear-gradient(180deg,#0f1b32,#0b1529);border-color:#243b6b;box-shadow:0 10px 20px rgba(13,99,255,.18)}\n\n      /* Confetti */\n      .fx-confetti{position:fixed;inset:0;pointer-events:none;z-index:9999}\n      .fx-c{position:absolute;width:9px;height:9px;background:hsl(calc(360*var(--h,.5)),90%,60%);transform:translate(-50%,-50%);border-radius:2px;animation:confThrow var(--t) ease-out forwards}\n      .fx-c:nth-child(4n){--h:.1}.fx-c:nth-child(4n+1){--h:.22}.fx-c:nth-child(4n+2){--h:.62}.fx-c:nth-child(4n+3){--h:.82}\n      @keyframes confThrow{to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--r));opacity:0}}\n    ";
    document.head.appendChild(s);
  }

  /* ===================== Intro (unchanged) ===================== */
  (function intro() {
    var lemonBtn = document.getElementById('lemonToggle');
    if (!lemonBtn) return;
    try {
      if (localStorage.getItem('looz:justLoggedIn') !== '1') return;
      localStorage.removeItem('looz:justLoggedIn');
    } catch (e) {}
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
      wrap.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
      wrap.style.opacity = '0.0';
      setTimeout(function () {
        screen.remove();
      }, 900);
    }, 3000);
    if (!document.getElementById('intro-style')) {
      var s2 = document.createElement('style');
      s2.id = 'intro-style';
      s2.textContent = "\n        .intro-screen{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;pointer-events:none;background:#fff;}\n        html[data-theme=\"dark\"] .intro-screen{background:#0b1529;}\n        .intro-wrap{opacity:0;transform:scale(.85);filter:blur(18px);transition:opacity 900ms cubic-bezier(.16,1,.3,1),transform 900ms cubic-bezier(.16,1,.3,1),filter 900ms;}\n        .intro-wrap.is-in{opacity:1;transform:scale(1);filter:blur(0);}\n        .intro-lemon{display:block;width:clamp(120px,34vw,180px);filter:drop-shadow(0 20px 42px rgba(6,12,26,.35));}\n        .intro-sweep{transform:translateY(80%);opacity:.7;animation:introSweep 1600ms cubic-bezier(.16,1,.3,1) 450ms forwards;}\n        .intro-glint{transform: translateY(78%) scale(.9);opacity:0;animation:introGlint 1300ms cubic-bezier(.16,1,.3,1) 600ms forwards;}\n        @keyframes introSweep{0%{transform:translateY(80%);opacity:.65;}70%{transform:translateY(-6%);opacity:.95;}100%{transform:translateY(-16%);opacity:0;}}\n        @keyframes introGlint{0%{opacity:0;transform: translateY(78%) scale(.9);}55%{opacity:.95;}100%{opacity:0;transform: translateY(-10%) scale(1.06);}}\n        .intro-screen.is-fly .intro-wrap{transition:transform 800ms cubic-bezier(.4,0,.2,1), opacity 800ms; }\n      ";
      document.head.appendChild(s2);
    }
  })();

  /* ===================== Initial ===================== */
  var _today = new Date();
  formatTitle(_today);
  state.current = _today;
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
