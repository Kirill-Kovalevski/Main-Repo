"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  'use strict';
  /* DOM */

  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var navPanel = document.getElementById('navPanel');
  var btnSocial = document.getElementById('btnSocial');
  var btnProfile = document.getElementById('btnProfile');
  var btnMenu = document.getElementById('btnMenu');
  var btnCategories = document.getElementById('btnCategories');
  var addEventBtn = document.getElementById('addEventBtn');
  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');
  var plannerRoot = document.getElementById('planner');
  var btnDay = document.getElementById('btnDay');
  var btnWeek = document.getElementById('btnWeek');
  var btnMonth = document.getElementById('btnMonth');
  var titleDay = document.getElementById('titleDay');
  var titleDate = document.getElementById('titleDate');
  var titleBadge = document.getElementById('titleBadge');
  var uiName = document.getElementById('uiName');
  /* Helpers */

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

  function formatDateHeb(d) {
    return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  function dateKeyLocal(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function parseYMD(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function startOfWeek(d) {
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = t.getDay();
    t.setDate(t.getDate() - dow);
    return t;
  }

  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  function updateHeaderDate(d) {
    var idx = d.getDay();
    if (titleDay) titleDay.textContent = HEB_DAYS[idx];
    if (titleDate) titleDate.textContent = formatDateHeb(d);
    if (titleBadge) titleBadge.classList.add('is-highlight');
  }
  /* Name from storage (no optional chaining) */


  (function setHelloName() {
    try {
      var name = null;
      var au = localStorage.getItem('authUser');

      if (au) {
        var parsed = JSON.parse(au);

        if (parsed && _typeof(parsed) === 'object') {
          if (parsed.name) name = parsed.name;else if (parsed.displayName) name = parsed.displayName;else if (parsed.firstName) name = parsed.firstName;
        }
      }

      if (!name) {
        var alt = localStorage.getItem('authName');
        if (alt) name = alt;
      }

      if (uiName) uiName.textContent = name && String(name).trim() || 'דניאלה';
    } catch (e) {
      if (uiName) uiName.textContent = 'דניאלה';
    }
  })();
  /* NAV open/close */


  (function initNav() {
    if (!lemonToggle || !appNav || !navPanel) return;

    function openNav() {
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

    function closeNav() {
      var h = navPanel.scrollHeight;
      navPanel.style.maxHeight = h + 'px';
      void navPanel.offsetHeight;
      appNav.classList.add('u-is-collapsed');
      appNav.setAttribute('aria-hidden', 'true');
      lemonToggle.setAttribute('aria-expanded', 'false');
      navPanel.style.maxHeight = '0';
    }

    function isOpen() {
      return !appNav.classList.contains('u-is-collapsed');
    }

    lemonToggle.addEventListener('click', function () {
      isOpen() ? closeNav() : openNav();
    });
  })();
  /* routes */


  if (btnSocial) btnSocial.addEventListener('click', function () {
    window.location.href = 'social.html';
  });
  if (btnProfile) btnProfile.addEventListener('click', function () {
    window.location.href = 'profile.html';
  });
  if (btnMenu) btnMenu.addEventListener('click', function () {
    window.location.href = 'settings.html';
  });
  if (btnCategories) btnCategories.addEventListener('click', function () {
    window.location.href = 'categories.html';
  });
  /* Storage */

  var STORAGE_KEY = 'plannerTasks';
  var state = {
    view: 'day',
    current: new Date(),
    tasks: loadTasks()
  };

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  }
  /* Render switch */


  function render() {
    if (!plannerRoot) return;
    updateHeaderDate(state.current);
    if (state.view === 'day') renderDay();else if (state.view === 'week') renderWeek();else if (state.view === 'month') renderMonth();else if (state.view === 'year') renderYear();

    if (btnDay && btnWeek && btnMonth) {
      btnDay.classList.toggle('is-active', state.view === 'day');
      btnWeek.classList.toggle('is-active', state.view === 'week');
      btnMonth.classList.toggle('is-active', state.view === 'month' || state.view === 'year');
    }
  }
  /* DAY */


  function renderDay() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-dayview';
    var h = document.createElement('div');
    h.className = 'p-dayview__head';
    var idx = state.current.getDay();
    h.innerHTML = '<div class="p-dayview__title">' + HEB_DAYS[idx] + '</div>' + '<div class="p-dayview__date">' + formatDateHeb(state.current) + '</div>';
    wrap.appendChild(h);
    var ymd = dateKeyLocal(state.current);
    var items = state.tasks.filter(function (t) {
      return t.date === ymd;
    }).sort(function (a, b) {
      return a.time.localeCompare(b.time);
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
        row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-daytask__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-daytask__time">' + t.time + '</div>' + '<div class="p-daytask__actions">' + '<button class="p-daytask__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-daytask__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        wrap.appendChild(row);
      });
    }

    root.appendChild(wrap);
  }
  /* WEEK */


  function renderWeek() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current);
    var todayKey = dateKeyLocal(new Date());

    var _loop = function _loop(i) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKeyLocal(day);
      var box = document.createElement('div');
      box.className = 'p-day' + (ymd === todayKey ? ' p-day--today' : '');
      box.setAttribute('data-goto', ymd);
      var head = document.createElement('div');
      head.className = 'p-day__head';
      var count = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).length;
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[i] + '</span>' + '<span class="p-day__date">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span>' + '<span class="p-day__count">' + count + '</span>';
      box.appendChild(head);
      var dayTasks = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).sort(function (a, b) {
        return a.time.localeCompare(b.time);
      });
      dayTasks.forEach(function (t) {
        var row = document.createElement('div');
        row.className = 'p-task';
        row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-task__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-task__time">' + t.time + '</div>' + '<div class="p-task__actions">' + '<button class="p-task__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-task__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        box.appendChild(row);
      });
      wrap.appendChild(box);
    };

    for (var i = 0; i < 7; i++) {
      _loop(i);
    }

    root.appendChild(wrap);
  }
  /* MONTH */


  function renderMonth() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-monthwrap';
    var bar = document.createElement('div');
    bar.className = 'p-monthbar';
    var left = document.createElement('div');
    left.className = 'p-monthbar__left';
    var title = document.createElement('div');
    title.className = 'p-monthbar__title';
    var right = document.createElement('div');
    right.className = 'p-monthbar__right';
    title.textContent = HEB_MONTHS[state.current.getMonth()] + ' ' + state.current.getFullYear();
    var yearSelect = document.createElement('select');
    yearSelect.className = 'p-yearselect';
    var yearNow = state.current.getFullYear();

    for (var y = yearNow - 5; y <= yearNow + 5; y++) {
      var opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      if (y === yearNow) opt.selected = true;
      yearSelect.appendChild(opt);
    }

    right.appendChild(yearSelect);
    var chips = document.createElement('div');
    chips.className = 'p-monthbar__chips';

    for (var m = 0; m < 12; m++) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'p-chip' + (m === state.current.getMonth() ? ' is-selected' : '');
      chip.textContent = HEB_MONTHS[m];
      chip.dataset.month = String(m);
      chips.appendChild(chip);
    }

    left.appendChild(chips);
    bar.appendChild(left);
    bar.appendChild(title);
    bar.appendChild(right);
    wrap.appendChild(bar);
    var grid = document.createElement('div');
    grid.className = 'p-month';
    var anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    var firstDow = anchor.getDay();
    var start = new Date(anchor);
    start.setDate(anchor.getDate() - firstDow);
    var curKey = dateKeyLocal(state.current);
    var todayKey = dateKeyLocal(new Date());
    var thisMonth = state.current.getMonth();

    for (var i = 0; i < 42; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKeyLocal(day);
      var cell = document.createElement('div');
      var cls = 'p-cell';
      if (day.getMonth() !== thisMonth) cls += ' p-cell--pad';
      if (ymd === todayKey) cls += ' p-cell--today';
      if (ymd === curKey) cls += ' p-cell--selected';
      cell.className = cls;
      cell.setAttribute('data-goto', ymd);
      var num = document.createElement('div');
      num.className = 'p-cell__num';
      num.textContent = day.getDate();
      cell.appendChild(num);
      grid.appendChild(cell);
    }

    wrap.appendChild(grid);
    root.appendChild(wrap);
    chips.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest('.p-chip');
      if (!btn) return;
      var m = parseInt(btn.dataset.month, 10);
      var d = new Date(state.current);
      d.setMonth(m);
      d.setDate(1);
      state.current = d;
      state.view = 'month';
      render();
    });
    yearSelect.addEventListener('change', function () {
      var y = parseInt(yearSelect.value, 10);
      var d = new Date(state.current);
      d.setFullYear(y);
      d.setDate(1);
      state.current = d;
      state.view = 'month';
      render();
    }); // swipe: DOWN => next month, UP => previous month (fixed)

    addVerticalSwipe(grid, function (dir) {
      var d = new Date(state.current);
      if (dir === 'down') d.setMonth(d.getMonth() + 1);else d.setMonth(d.getMonth() - 1);
      d.setDate(1);
      state.current = d;
      render();
    });
  }
  /* YEAR */


  function renderYear() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-monthwrap';
    var bar = document.createElement('div');
    bar.className = 'p-monthbar';
    var title = document.createElement('div');
    title.className = 'p-monthbar__title';
    title.textContent = state.current.getFullYear();
    bar.appendChild(document.createElement('div'));
    bar.appendChild(title);
    bar.appendChild(document.createElement('div'));
    wrap.appendChild(bar);
    var yearGrid = document.createElement('div');
    yearGrid.className = 'p-year';

    for (var m = 0; m < 12; m++) {
      var box = document.createElement('div');
      box.className = 'p-year__month';
      box.innerHTML = '<h4 class="p-year__title">' + HEB_MONTHS[m] + '</h4>';
      var g = document.createElement('div');
      g.className = 'p-year__grid';
      var first = new Date(state.current.getFullYear(), m, 1);
      var dow = first.getDay();
      var start = new Date(first);
      start.setDate(first.getDate() - dow);

      for (var i = 0; i < 42; i++) {
        var d = new Date(start);
        d.setDate(start.getDate() + i);
        var cell = document.createElement('div');
        cell.className = 'p-year__cell';
        if (d.getMonth() !== m) cell.classList.add('p-year__cell--pad');
        cell.textContent = d.getDate();
        cell.setAttribute('data-goto', dateKeyLocal(d));
        g.appendChild(cell);
      }

      box.appendChild(g);
      yearGrid.appendChild(box);
    }

    wrap.appendChild(yearGrid);
    root.appendChild(wrap);
  }
  /* interactions */


  if (plannerRoot) {
    plannerRoot.addEventListener('click', function (e) {
      var gotoEl = e.target && e.target.closest ? e.target.closest('[data-goto]') : null;

      if (gotoEl && gotoEl.getAttribute) {
        var ymd = gotoEl.getAttribute('data-goto');

        if (ymd) {
          state.current = parseYMD(ymd);
          state.view = 'day';
          render();
          return;
        }
      }

      var t = e.target;

      if (t.dataset && t.dataset.done) {
        confettiAtEl(t);
        state.tasks = state.tasks.filter(function (x) {
          return x.id !== t.dataset.done;
        });
        saveTasks();
        render();
      }

      if (t.dataset && t.dataset.del) {
        state.tasks = state.tasks.filter(function (x) {
          return x.id !== t.dataset.del;
        });
        saveTasks();
        render();
      }
    });
  }

  if (btnDay) btnDay.addEventListener('click', function () {
    state.view = 'day';
    render();
  });
  if (btnWeek) btnWeek.addEventListener('click', function () {
    state.view = 'week';
    render();
  });
  if (btnMonth) btnMonth.addEventListener('click', function () {
    state.view = 'month';
    render();
  });
  /* sheet open/close */

  function openSheet() {
    if (!sheet) return;
    sheet.classList.remove('u-hidden');
    sheet.classList.add('is-open');

    try {
      if (titleInput) titleInput.focus();
    } catch (e) {}
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    setTimeout(function () {
      sheet.classList.add('u-hidden');
    }, 220);
  }

  if (addEventBtn) addEventBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openSheet();
  });
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    e.stopPropagation();
  }); // quick picks

  (function initQuickPicks() {
    var qp = document.querySelector('.qp');
    if (!qp) return;
    qp.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest('.qp__chip');
      if (!chip) return;

      if (chip.dataset.date) {
        var today = new Date();
        var target = new Date(today);
        if (chip.dataset.date === 'tomorrow') target.setDate(today.getDate() + 1);else if (chip.dataset.date === 'nextweek') target.setDate(today.getDate() + 7);else if (chip.dataset.date.startsWith('+')) {
          var days = parseInt(chip.dataset.date.replace('+', ''), 10);
          target.setDate(today.getDate() + days);
        }
        var v = target.getFullYear() + '-' + pad2(target.getMonth() + 1) + '-' + pad2(target.getDate());
        if (dateInput) dateInput.value = v;
      }

      if (chip.dataset.time) {
        if (chip.dataset.time.indexOf('now+') === 0) {
          var addMin = parseInt(chip.dataset.time.split('+')[1], 10) || 0;
          var now = new Date();
          now.setMinutes(now.getMinutes() + addMin);

          var _v = pad2(now.getHours()) + ':' + pad2(now.getMinutes());

          if (timeInput) timeInput.value = _v;
        } else {
          if (timeInput) timeInput.value = chip.dataset.time;
        }
      }
    });
  })();
  /* submit + fly animation */


  if (sheetForm) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = titleInput && titleInput.value ? titleInput.value.trim() : '';
      var d = dateInput && dateInput.value ? dateInput.value.trim() : '';
      var h = timeInput && timeInput.value ? timeInput.value.trim() : '';
      if (!t || !d || !h) return;
      var id = 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      state.tasks.push({
        id: id,
        title: t,
        date: d,
        time: h
      });
      saveTasks();
      if (sheetForm) sheetForm.reset();
      closeSheet();
      state.current = parseYMD(d);
      state.view = 'day';
      render();
      var tokenText = t || 'אירוע';
      var targetEl = document.querySelector('[data-task-id="' + id + '"]');
      flyFromTo(addEventBtn, targetEl, tokenText);
    });
  }
  /* confetti */


  function confettiAtEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var originX = r.left + r.width / 2 + window.scrollX;
    var originY = r.top + r.height / 2 + window.scrollY;
    var colors = ['#3B82F6', '#60A5FA', '#A78BFA', '#F59E0B', '#F472B6', '#34D399', '#F87171'];
    var COUNT = 44,
        MIN_DIST = 60,
        MAX_DIST = 160,
        DURATION = 1200;

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'c-confetti';
      Object.assign(p.style, {
        position: 'absolute',
        left: originX + 'px',
        top: originY + 'px',
        width: 6 + Math.random() * 10 + 'px',
        height: 6 + Math.random() * 10 + 'px',
        borderRadius: '2px',
        background: colors[i % colors.length],
        pointerEvents: 'none',
        zIndex: 10000,
        opacity: '1'
      });
      document.body.appendChild(p);

      (function (node) {
        var angle = Math.random() * Math.PI * 2;
        var dist = MIN_DIST + Math.random() * (MAX_DIST - MIN_DIST);
        var tx = Math.cos(angle) * dist,
            ty = Math.sin(angle) * dist * (0.75 + Math.random() * 0.5);
        var rot = Math.random() * 720 - 360;
        var start = null;

        function step(ts) {
          if (!start) start = ts;
          var t = Math.min(1, (ts - start) / DURATION),
              ease = t * (2 - t);
          node.style.transform = 'translate(' + tx * ease + 'px,' + ty * ease + 'px) rotate(' + rot * ease + 'deg) scale(' + (1 - 0.2 * ease) + ')';
          node.style.opacity = String(1 - ease);
          if (t < 1) requestAnimationFrame(step);else node.remove();
        }

        requestAnimationFrame(step);
      })(p);
    }
  }
  /* fly token */


  function flyFromTo(fromEl, toEl, label) {
    if (!fromEl || !toEl) return;
    var fr = fromEl.getBoundingClientRect();
    var tr = toEl.getBoundingClientRect();
    var chip = document.createElement('div');
    chip.className = 'fly-chip';
    chip.textContent = label.length > 18 ? label.slice(0, 16) + '…' : label;
    document.body.appendChild(chip);
    var sx = fr.left + fr.width / 2;
    var sy = fr.top + fr.height / 2;
    var ex = tr.left + tr.width / 2;
    var ey = tr.top + tr.height / 2;
    chip.style.left = sx + 'px';
    chip.style.top = sy + 'px';
    var DURATION = 700;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / DURATION);
      var ease = t * (2 - t);
      var cx = sx + (ex - sx) * ease;
      var cy = sy - (1 - 2 * Math.abs(.5 - ease)) * 90 + (ey - sy) * ease;
      chip.style.left = cx + 'px';
      chip.style.top = cy + 'px';
      chip.style.opacity = String(1 - t * 0.2);
      if (t < 1) requestAnimationFrame(step);else chip.remove();
    }

    requestAnimationFrame(step);
  }
  /* vertical swipe util */


  function addVerticalSwipe(node, cb) {
    if (!node || !cb) return;
    var startY = 0,
        startX = 0,
        t0 = 0;
    node.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      startY = t.clientY;
      startX = t.clientX;
      t0 = Date.now();
    }, {
      passive: true
    });
    node.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0];
      var dy = t.clientY - startY;
      var dx = Math.abs(t.clientX - startX);
      var dt = Date.now() - t0;

      if (Math.abs(dy) > 40 && dx < 60 && dt < 800) {
        cb(dy > 0 ? 'down' : 'up'); // down => next month
      }
    });
  }
  /* Prefill from Categories */


  (function prefillDraft() {
    try {
      var raw = localStorage.getItem('draftEvent');
      if (!raw) return;
      var d = JSON.parse(raw);
      localStorage.removeItem('draftEvent');
      if (titleInput && d.title) titleInput.value = d.title;
      if (dateInput && d.date) dateInput.value = d.date;
      if (timeInput && d.time) timeInput.value = d.time;
      openSheet();
    } catch (e) {}
  })();
  /* initial */


  state.current = new Date();
  state.view = 'day';
  render();
})();