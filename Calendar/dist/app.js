"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function () {
  'use strict';

  /* ===== DOM refs ===== */
  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var navPanel = document.getElementById('navPanel');
  var navSearch = document.getElementById('navSearch');
  var searchClear = document.getElementById('searchClear');
  var searchGo = document.getElementById('searchGo');
  var sugWrap = document.getElementById('sugWrap');
  var sugList = document.getElementById('sugList');
  var srOverlay = document.getElementById('srOverlay');
  var srClose = document.getElementById('srClose');
  var srX = document.getElementById('srX');
  var srList = document.getElementById('srList');
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
  var contactSheet = document.getElementById('contactSheet');
  var contactWho = document.getElementById('contactWho');
  var contactMsg = document.getElementById('contactMsg');
  var contactProfile = document.getElementById('contactProfile');
  var contactCopy = document.getElementById('contactCopy');

  /* ===== Helpers ===== */
  function pad2(n) {
    return String(n).padStart(2, '0');
  }
  function escapeHtml(s) {
    if (s == null) return '';
    var m = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(s).replace(/[&<>"']/g, function (c) {
      return m[c];
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
  function todayYMD() {
    var t = new Date();
    return dateKeyLocal(t);
  }
  function debounce(fn, ms) {
    var id = 0;
    return function () {
      var _this = this;
      var args = arguments;
      clearTimeout(id);
      id = setTimeout(function () {
        return fn.apply(_this, args);
      }, ms);
    };
  }
  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  var HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  function updateHeaderDate(d) {
    var idx = d.getDay();
    if (titleDay) titleDay.textContent = HEB_DAYS[idx];
    if (titleDate) titleDate.textContent = formatDateHeb(d);
    if (titleBadge) titleBadge.classList.add('is-highlight');
  }

  /* ===== Name ===== */
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

  /* ===== NAV open/close (in-flow; expands for suggestions) ===== */
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
      navPanel.style.overflow = 'visible';
    }
    function closeNav() {
      var h = navPanel.scrollHeight;
      navPanel.style.maxHeight = h + 'px';
      void navPanel.offsetHeight;
      appNav.classList.add('u-is-collapsed');
      appNav.setAttribute('aria-hidden', 'true');
      lemonToggle.setAttribute('aria-expanded', 'false');
      navPanel.style.maxHeight = '0';
      navPanel.style.overflow = 'hidden';
      hideSuggestions();
    }
    function isOpen() {
      return !appNav.classList.contains('u-is-collapsed');
    }
    lemonToggle.addEventListener('click', function () {
      isOpen() ? closeNav() : openNav();
    });
    if (navSearch) navSearch.addEventListener('focus', function () {
      if (!isOpen()) openNav();
      renderSuggestions(navSearch.value);
    });
  })();

  /* ===== Routes ===== */
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

  /* ===== Planner storage ===== */
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

  /* ===== Social posts ===== */
  var POSTS_KEY = 'socialPosts';
  function seedPostsIfEmpty() {
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      if (raw) return;
      var seed = [{
        id: 'p1',
        title: 'הליכת בוקר בטיילת',
        desc: '30 דקות עם קפה ומוזיקה רגועה',
        tags: ['בוקר', 'הליכה', 'חוץ'],
        time: '08:00',
        user: {
          id: 'u_dani',
          name: 'דני',
          handle: '@dani'
        }
      }, {
        id: 'p2',
        title: 'ריצה קלה בפארק',
        desc: '5 ק״מ קצב נעים',
        tags: ['ספורט', 'בריאות', 'חוץ'],
        time: '07:00',
        user: {
          id: 'u_lia',
          name: 'ליה',
          handle: '@lia'
        }
      }, {
        id: 'p3',
        title: 'שעת למידה בספרייה',
        desc: 'התמקדות בשקט מוחלט',
        tags: ['למידה', 'פוקוס', 'פנים'],
        time: '20:00',
        user: {
          id: 'u_noa',
          name: 'נועה',
          handle: '@noa'
        }
      }, {
        id: 'p4',
        title: 'קפה עם חבר/ה',
        desc: 'Catch-up נעים לשעה',
        tags: ['חברתי', 'פנאי', 'קפה'],
        time: '10:30',
        user: {
          id: 'u_ron',
          name: 'רון',
          handle: '@ron'
        }
      }, {
        id: 'p5',
        title: 'שקיעה וחול ים',
        desc: 'נשימות עמוקות, בלי טלפון',
        tags: ['מיינדפולנס', 'ים', 'שקיעה'],
        time: '18:30',
        user: {
          id: 'u_gal',
          name: 'גל',
          handle: '@gal'
        }
      }, {
        id: 'p6',
        title: 'שעת יצירה עם ילדים',
        desc: 'פלסטלינה וצבעי גואש',
        tags: ['משפחה', 'יצירה', 'בית'],
        time: '17:00',
        user: {
          id: 'u_maya',
          name: 'מאיה',
          handle: '@maya'
        }
      }, {
        id: 'p7',
        title: 'מדיטציה קצרה',
        desc: '10 דקות לפני השינה',
        tags: ['שקט', 'בריאות', 'לילה'],
        time: '22:00',
        user: {
          id: 'u_shai',
          name: 'שי',
          handle: '@shai'
        }
      }, {
        id: 'p8',
        title: 'שחמט בשדרה',
        desc: 'דו-קרב ידידותי בשבת',
        tags: ['משחק', 'חוץ', 'חברתי'],
        time: '12:00',
        user: {
          id: 'u_avi',
          name: 'אבי',
          handle: '@avi'
        }
      }];
      localStorage.setItem(POSTS_KEY, JSON.stringify(seed));
    } catch (e) {}
  }
  function loadPosts() {
    seedPostsIfEmpty();
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function normalize(s) {
    return (s || '').toString().toLowerCase();
  }
  function scorePost(post, q) {
    var t = normalize(post.title);
    var d = normalize(post.desc);
    var tags = (post.tags || []).map(normalize).join(' ');
    var terms = normalize(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (t.includes(term)) score += 5;
      if (tags.includes(term)) score += 3;
      if (d.includes(term)) score += 1;
      if (t.startsWith(term)) score += 2;
    }
    return score;
  }
  function searchPosts(q) {
    var posts = loadPosts();
    if (!q.trim()) return [];
    return posts.map(function (p) {
      return {
        p: p,
        s: scorePost(p, q)
      };
    }).filter(function (x) {
      return x.s > 0;
    }).sort(function (a, b) {
      return b.s - a.s;
    }).map(function (x) {
      return x.p;
    });
  }

  /* ===== Suggestions engine ===== */
  function showSuggestions() {
    if (!sugWrap) return;
    sugWrap.classList.remove('u-hidden');
    sugWrap.classList.add('is-open');
    // ensure panel grows while suggestions open
    if (navPanel && !appNav.classList.contains('u-is-collapsed')) {
      // let it auto-grow
      navPanel.style.maxHeight = '';
      navPanel.style.overflow = 'visible';
    }
  }
  function hideSuggestions() {
    if (!sugWrap) return;
    sugWrap.classList.add('u-hidden');
    sugWrap.classList.remove('is-open');
  }
  function renderSuggestions(q) {
    if (!sugList) return;
    var posts = loadPosts();
    var list = [];
    if (!q.trim()) {
      list = posts.slice(0, 6); // trending
    } else {
      list = searchPosts(q).slice(0, 6); // filtered
    }
    var html = [];
    if (!list.length) {
      html.push('<div class="sug-item"><div class="sug-title">לא נמצאו הצעות…</div></div>');
    } else {
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        html.push("<div class=\"sug-item\" role=\"option\">\n            <div>\n              <h5 class=\"sug-title\">".concat(escapeHtml(p.title), "</h5>\n              <div class=\"sug-row\">\n                ").concat((p.tags || []).map(function (t) {
          return "<span class=\"sug-tag\">".concat(escapeHtml(t), "</span>");
        }).join(''), "\n                ").concat(p.time ? "<span class=\"sug-tag\">\u23F0 ".concat(p.time, "</span>") : '', "\n                ").concat(p.user && p.user.handle ? "<span class=\"sug-tag\">\u05DE\u05D0\u05EA ".concat(escapeHtml(p.user.handle), "</span>") : '', "\n              </div>\n            </div>\n            <div class=\"sug-actions\">\n              <button class=\"sug-btn\" data-contact=\"").concat(p.id, "\">\u05E6\u05D5\u05E8 \u05E7\u05E9\u05E8</button>\n              <button class=\"sug-btn sug-btn--primary\" data-use=\"").concat(p.id, "\">\u05D4\u05D5\u05E1\u05E3</button>\n            </div>\n          </div>"));
      }
    }
    var allCount = q.trim() ? searchPosts(q).length : posts.length;
    var more = "<div class=\"sug-more\"><button class=\"sug-more__btn\" data-go-all=\"1\">\u05D4\u05E6\u05D2 \u05D4\u05DB\u05DC (".concat(allCount, ")</button></div>");
    sugList.innerHTML = html.join('') + more;
    showSuggestions();
  }

  // IME-friendly typing
  var isComposing = false;
  if (navSearch) {
    navSearch.addEventListener('compositionstart', function () {
      isComposing = true;
    });
    navSearch.addEventListener('compositionend', function () {
      isComposing = false;
      renderSuggestions(navSearch.value);
    });
    var debounced = debounce(function () {
      if (!isComposing) renderSuggestions(navSearch.value);
    }, 120);
    navSearch.addEventListener('input', debounced);
    navSearch.addEventListener('focus', function () {
      return renderSuggestions(navSearch.value);
    });
    navSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideSuggestions();
      }
      if (e.key === 'Enter') {
        openFullResults(navSearch.value);
        hideSuggestions();
      }
    });
  }
  if (searchGo) {
    searchGo.addEventListener('click', function () {
      var q = navSearch ? navSearch.value : '';
      openFullResults(q);
      hideSuggestions();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', function () {
      if (navSearch) navSearch.value = '';
      renderSuggestions('');
      navSearch && navSearch.focus();
    });
  }
  if (sugList) {
    sugList.addEventListener('click', function (e) {
      var useBtn = e.target.closest('[data-use]');
      var ctBtn = e.target.closest('[data-contact]');
      var allBtn = e.target.closest('[data-go-all]');
      if (useBtn) {
        usePost(useBtn.getAttribute('data-use'));
      }
      if (ctBtn) {
        contactFor(ctBtn.getAttribute('data-contact'));
      }
      if (allBtn) {
        openFullResults(navSearch ? navSearch.value : '');
        hideSuggestions();
      }
    });
  }
  document.addEventListener('click', function (e) {
    if (!sugWrap || sugWrap.classList.contains('u-hidden')) return;
    var inside = e.target.closest('.c-search');
    if (!inside) hideSuggestions();
  });

  /* ===== Full results overlay ===== */
  function openResults() {
    srOverlay.classList.remove('u-hidden');
    srOverlay.setAttribute('aria-hidden', 'false');
  }
  function closeResults() {
    srOverlay.classList.add('u-hidden');
    srOverlay.setAttribute('aria-hidden', 'true');
    srList.innerHTML = '';
  }
  function renderResults(q) {
    var list = searchPosts(q);
    var html = [];
    if (!list.length) {
      html.push('<div class="sr-card"><div class="sr-sub">לא נמצאו פעילויות מתאימות…</div></div>');
    } else {
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        html.push("<article class=\"sr-card\" data-id=\"".concat(p.id, "\">\n            <h4 class=\"sr-title\">").concat(escapeHtml(p.title), "</h4>\n            <p class=\"sr-sub\">").concat(escapeHtml(p.desc || ''), "</p>\n            <div class=\"sr-meta\">\n              ").concat((p.tags || []).map(function (t) {
          return "<span class=\"sr-tag\">".concat(escapeHtml(t), "</span>");
        }).join(''), "\n              ").concat(p.time ? "<span class=\"sr-tag\">\u23F0 ".concat(p.time, "</span>") : '', "\n              ").concat(p.user && p.user.handle ? "<span class=\"sr-tag\">\u05DE\u05D0\u05EA ".concat(escapeHtml(p.user.handle), "</span>") : '', "\n            </div>\n            <div class=\"sr-actions\">\n              <button class=\"sr-btn\" data-contact=\"").concat(p.id, "\">\u05E6\u05D5\u05E8 \u05E7\u05E9\u05E8</button>\n              <button class=\"sr-btn sr-btn--primary\" data-use=\"").concat(p.id, "\">\u05D4\u05D5\u05E1\u05E3</button>\n            </div>\n          </article>"));
      }
    }
    srList.innerHTML = html.join('');
  }
  function openFullResults(q) {
    renderResults(q || '');
    openResults();
  }
  if (srClose) srClose.addEventListener('click', closeResults);
  if (srX) srX.addEventListener('click', closeResults);
  if (srList) {
    srList.addEventListener('click', function (e) {
      var useBtn = e.target.closest('[data-use]');
      var ctBtn = e.target.closest('[data-contact]');
      if (useBtn) {
        usePost(useBtn.getAttribute('data-use'));
      }
      if (ctBtn) {
        contactFor(ctBtn.getAttribute('data-contact'));
      }
    });
  }

  /* ===== Use / Contact ===== */
  function usePost(id) {
    var p = loadPosts().find(function (x) {
      return x.id === id;
    });
    if (!p) return;
    if (titleInput) titleInput.value = p.title || '';
    if (dateInput) dateInput.value = todayYMD();
    if (timeInput) timeInput.value = p.time || '12:00';
    closeResults();
    hideSuggestions();
    openSheet();
  }
  var contactPayload = null;
  function contactFor(id) {
    var p = loadPosts().find(function (x) {
      return x.id === id;
    });
    if (!p || !p.user) return;
    contactPayload = p.user;
    if (contactWho) contactWho.textContent = p.user.name + ' ' + (p.user.handle || '');
    openContactSheet();
  }
  function openContactSheet() {
    contactSheet.classList.remove('u-hidden');
    contactSheet.classList.add('is-open');
  }
  function closeContactSheet() {
    contactSheet.classList.remove('is-open');
    setTimeout(function () {
      return contactSheet.classList.add('u-hidden');
    }, 220);
  }
  if (contactSheet) {
    contactSheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeContactSheet();
    });
  }
  if (contactMsg) {
    contactMsg.addEventListener('click', function () {
      if (contactPayload) window.location.href = 'social.html?to=' + encodeURIComponent(contactPayload.handle || '');
    });
  }
  if (contactProfile) {
    contactProfile.addEventListener('click', function () {
      if (contactPayload) window.location.href = 'profile.html?u=' + encodeURIComponent(contactPayload.id || 'user');
    });
  }
  if (contactCopy) {
    contactCopy.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return navigator.clipboard.writeText(contactPayload && contactPayload.handle || '');
          case 1:
            contactCopy.textContent = 'הועתק ✓';
            setTimeout(function () {
              return contactCopy.textContent = 'העתק משתמש';
            }, 900);
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    })));
  }

  /* ===== Planner (abridged; unchanged rendering) ===== */
  function render() {
    if (!plannerRoot) return;
    updateHeaderDate(state.current);
    if (state.view === 'day') renderDay();else if (state.view === 'week') renderWeek();else if (state.view === 'month') renderMonth();else renderYear();
    if (btnDay && btnWeek && btnMonth) {
      btnDay.classList.toggle('is-active', state.view === 'day');
      btnWeek.classList.toggle('is-active', state.view === 'week');
      btnMonth.classList.toggle('is-active', state.view === 'month' || state.view === 'year');
    }
  }
  function renderDay() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-dayview';
    var h = document.createElement('div');
    h.className = 'p-dayview__head';
    var idx = state.current.getDay();
    h.innerHTML = '<div class="p-dayview__title">' + HEB_DAYS[idx] + '</div><div class="p-dayview__date">' + formatDateHeb(state.current) + '</div>';
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
      for (var i = 0; i < items.length; i++) {
        var t = items[i];
        var row = document.createElement('div');
        row.className = 'p-daytask';
        row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-daytask__text">' + escapeHtml(t.title) + '</div><div class="p-daytask__time">' + t.time + '</div>' + '<div class="p-daytask__actions"><button class="p-daytask__btn" data-done="' + t.id + '">בוצע</button><button class="p-daytask__btn" data-del="' + t.id + '">מחק</button></div>';
        wrap.appendChild(row);
      }
    }
    root.appendChild(wrap);
  }
  function renderWeek() {
    var root = plannerRoot;
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'p-week';
    var start = startOfWeek(state.current);
    var todayKey = dateKeyLocal(new Date());
    var _loop = function _loop() {
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
      head.innerHTML = '<span class="p-day__name">' + HEB_DAYS[i] + '</span><span class="p-day__date">' + pad2(day.getDate()) + '.' + pad2(day.getMonth() + 1) + '</span><span class="p-day__count">' + count + '</span>';
      box.appendChild(head);
      var dayTasks = state.tasks.filter(function (t) {
        return t.date === ymd;
      }).sort(function (a, b) {
        return a.time.localeCompare(b.time);
      });
      for (var k = 0; k < dayTasks.length; k++) {
        var t = dayTasks[k];
        var row = document.createElement('div');
        row.className = 'p-task';
        row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-task__text">' + escapeHtml(t.title) + '</div><div class="p-task__time">' + t.time + '</div>' + '<div class="p-task__actions"><button class="p-task__btn" data-done="' + t.id + '">בוצע</button><button class="p-task__btn" data-del="' + t.id + '">מחק</button></div>';
        box.appendChild(row);
      }
      wrap.appendChild(box);
    };
    for (var i = 0; i < 7; i++) {
      _loop();
    }
    root.appendChild(wrap);
  }
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
    plannerRoot.appendChild(wrap);
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
    });
    addVerticalSwipe(grid, function (dir) {
      var d = new Date(state.current);
      if (dir === 'down') d.setMonth(d.getMonth() + 1);else d.setMonth(d.getMonth() - 1);
      d.setDate(1);
      state.current = d;
      render();
    });
  }
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

  /* ===== Interactions ===== */
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

  /* ===== Sheet open/close + quick picks ===== */
  function openSheet() {
    if (!sheet) return;
    sheet.classList.remove('u-hidden');
    sheet.classList.add('is-open');
    try {
      titleInput && titleInput.focus();
    } catch (e) {}
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    setTimeout(function () {
      return sheet.classList.add('u-hidden');
    }, 220);
  }
  if (addEventBtn) addEventBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openSheet();
  });
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    return e.stopPropagation();
  });
  (function initQuickPicks() {
    var qp = document.querySelector('.qp');
    if (!qp) return;
    qp.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest('.qp__chip');
      if (!chip) return;
      if (chip.dataset.date) {
        var today = new Date();
        var target = new Date(today);
        if (chip.dataset.date === 'tomorrow') target.setDate(today.getDate() + 1);else if (chip.dataset.date === 'nextweek') target.setDate(today.getDate() + 7);else if (chip.dataset.date.startsWith('+')) target.setDate(today.getDate() + parseInt(chip.dataset.date.replace('+', ''), 10));
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
      state.current = parseYMD(d);
      state.view = 'day';
      render();
      var targetEl = document.querySelector('[data-task-id="' + id + '"]');
      flyFromTo(addEventBtn, targetEl, t);
    });
  }

  /* ===== Confetti + fly chip ===== */
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
  function flyFromTo(fromEl, toEl, label) {
    if (!fromEl || !toEl) return;
    var fr = fromEl.getBoundingClientRect();
    var tr = toEl.getBoundingClientRect();
    var chip = document.createElement('div');
    chip.className = 'fly-chip';
    chip.textContent = label.length > 18 ? label.slice(0, 16) + '…' : label;
    document.body.appendChild(chip);
    var sx = fr.left + fr.width / 2,
      sy = fr.top + fr.height / 2;
    var ex = tr.left + tr.width / 2,
      ey = tr.top + tr.height / 2;
    chip.style.left = sx + 'px';
    chip.style.top = sy + 'px';
    var DURATION = 700;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / DURATION),
        e = t * (2 - t);
      var cx = sx + (ex - sx) * e;
      var cy = sy - (1 - 2 * Math.abs(.5 - e)) * 90 + (ey - sy) * e;
      chip.style.left = cx + 'px';
      chip.style.top = cy + 'px';
      chip.style.opacity = String(1 - t * 0.2);
      if (t < 1) requestAnimationFrame(step);else chip.remove();
    }
    requestAnimationFrame(step);
  }

  /* ===== Swipe util ===== */
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
        cb(dy > 0 ? 'down' : 'up');
      }
    });
  }

  /* ===== Prefill from categories / social ===== */
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

  /* ===== Initial render ===== */
  state.current = new Date();
  state.view = 'day';
  render();
})();
