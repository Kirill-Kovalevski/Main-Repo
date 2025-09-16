"use strict";

// Calendar/app.js — full replacement with correct weekday/date mapping
(function () {
  'use strict';
  /* ========= DOM refs ========= */

  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var addEventBtn = document.getElementById('addEventBtn'); // Bottom sheet (new event)

  var sheet = document.getElementById('eventSheet');
  var sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');
  var plannerRoot = document.getElementById('planner');
  var btnWeek = document.getElementById('btnWeek');
  var btnMonth = document.getElementById('btnMonth');
  var titleDay = document.getElementById('titleDay');
  var titleDate = document.getElementById('titleDate');
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

  function formatDateHeb(d) {
    return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  function dateKey(d) {
    return d.toISOString().slice(0, 10);
  } // YYYY-MM-DD


  function parseYMD(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  } // Week anchors to SUNDAY (0)


  function startOfWeek(d) {
    var tmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = tmp.getDay(); // 0..6, 0=Sunday

    tmp.setDate(tmp.getDate() - dow);
    return tmp;
  }

  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  function updateHeaderDate(d) {
    var idx = d.getDay(); // 0=Sunday ... 6=Saturday

    if (titleDay) titleDay.textContent = HEB_DAYS[idx];
    if (titleDate) titleDate.textContent = formatDateHeb(d);
  }
  /* ========= NAV: collapse/expand (gapless) ========= */


  (function initNav() {
    var btn = lemonToggle;
    var nav = appNav;
    var panel = nav ? nav.querySelector('.c-nav__panel') : null;
    if (!btn || !nav || !panel) return;
    nav.classList.add('u-is-collapsed');
    nav.style.maxHeight = '0';

    function openNav() {
      nav.classList.remove('u-is-collapsed');
      nav.style.visibility = 'visible';
      nav.style.opacity = '1';
      nav.style.maxHeight = panel.scrollHeight + 'px';
      nav.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'max-height') {
          nav.style.maxHeight = 'none';
          nav.removeEventListener('transitionend', onEnd);
        }
      });
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      var current = nav.scrollHeight;
      nav.style.maxHeight = current + 'px';
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

    btn.addEventListener('click', function () {
      hasClass(nav, 'u-is-collapsed') ? openNav() : closeNav();
    });
  })();
  /* ========= Storage ========= */


  var STORAGE_KEY = 'plannerTasks';
  var state = {
    view: 'day',
    // default DAILY (first thing shown)
    current: new Date(),
    // anchor date
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
  /* ========= RENDERERS ========= */


  function render() {
    if (!plannerRoot) return;
    document.body.classList.add('planner-on');
    updateHeaderDate(state.current);
    if (state.view === 'day') renderDay();else if (state.view === 'week') renderWeek();else renderMonth();

    if (btnWeek && btnMonth) {
      btnWeek.classList.toggle('is-active', state.view === 'week');
      btnMonth.classList.toggle('is-active', state.view === 'month');
    }
  }
  /* ----- DAY ----- */


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
    var ymd = dateKey(state.current);
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
        row.innerHTML = '<div class="p-daytask__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-daytask__time">' + t.time + '</div>' + '<div class="p-daytask__actions">' + '<button class="p-daytask__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-daytask__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        wrap.appendChild(row);
      });
    }

    root.appendChild(wrap);
  }
  /* ----- WEEK ----- */


  function renderWeek() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current); // Sunday

    for (var i = 0; i < 7; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var ymd = dateKey(day);
      var box = document.createElement('div');
      box.className = 'p-day';
      var head = document.createElement('div');
      head.className = 'p-day__head';
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[i] + '</span> ' + '<span class="p-day__date" data-goto="' + ymd + '">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span>';
      box.appendChild(head);
      var dayTasks = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).sort(function (a, b) {
        return a.time.localeCompare(b.time);
      });
      dayTasks.forEach(function (t) {
        var row = document.createElement('div');
        row.className = 'p-task';
        row.innerHTML = '<div class="p-task__text">' + escapeHtml(t.title) + '</div>' + '<div class="p-task__time">' + t.time + '</div>' + '<div class="p-task__actions">' + '<button class="p-task__btn" data-done="' + t.id + '">בוצע</button>' + '<button class="p-task__btn" data-del="' + t.id + '">מחק</button>' + '</div>';
        box.appendChild(row);
      });
      wrap.appendChild(box);
    }

    root.appendChild(wrap);
  }
  /* ----- MONTH ----- */


  function renderMonth() {
    var root = plannerRoot;
    root.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'p-month';
    var anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    var firstDow = anchor.getDay(); // 0=Sun..6=Sat

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
      cell.className = cls;
      var head = document.createElement('div');
      head.className = 'p-cell__date';
      head.textContent = day.getDate();
      head.dataset["goto"] = ymd;
      cell.appendChild(head);
      var list = document.createElement('div');
      list.className = 'p-cell__tasks';
      var items = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).sort(function (a, b) {
        return a.time.localeCompare(b.time);
      }); // show up to 2 chips

      items.slice(0, 2).forEach(function (t) {
        var chip = document.createElement('div');
        chip.className = 'p-chip';
        chip.textContent = t.time + ' · ' + t.title;
        list.appendChild(chip);
      });

      if (items.length > 2) {
        var more = document.createElement('div');
        more.className = 'p-chip';
        more.textContent = '…';
        list.appendChild(more);
      }

      cell.appendChild(list);

      if (ymd === curKey) {
        var cnt = document.createElement('span');
        cnt.className = 'p-count';
        cnt.textContent = String(items.length);
        cell.appendChild(cnt);
      }

      grid.appendChild(cell);
    }

    root.appendChild(grid);
  }
  /* ========= Planner interactions ========= */


  plannerRoot && plannerRoot.addEventListener('click', function (e) {
    var t = e.target; // go to a specific day from week/month

    if (t.dataset && t.dataset["goto"]) {
      state.current = parseYMD(t.dataset["goto"]);
      state.view = 'day';
      render();
      return;
    }

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
  if (btnWeek) btnWeek.addEventListener('click', function () {
    state.view = 'week';
    render();
  });
  if (btnMonth) btnMonth.addEventListener('click', function () {
    state.view = 'month';
    render();
  });
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

  if (addEventBtn) addEventBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openSheet();
  });
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  /* ========= New event -> add to selected day ========= */

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
      sheetForm.reset();
      closeSheet();
      state.current = parseYMD(d); // jump to the created date

      state.view = 'day'; // first thing shown = day

      render();
    });
  }
  /* ========= Confetti ========= */


  function confettiAtEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var originX = r.left + r.width / 2 + window.scrollX;
    var originY = r.top + r.height / 2 + window.scrollY;
    var colors = ['#3B82F6', '#60A5FA', '#A78BFA', '#F59E0B', '#F472B6', '#34D399', '#F87171'];
    var COUNT = 52,
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
        var rot = Math.random() * 720 - 360,
            start = null;

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
  /* ========= Logout ========= */


  function logout() {
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
      sessionStorage.clear();
    } catch (e) {}

    var dest = '/Calendar/auth.html';
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') dest = '/Calendar/auth.html';
    window.location.replace(dest);
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  window.logout = logout;
  /* ========= initial render ========= */

  render(); // shows Daily view by default with correct weekday
})();