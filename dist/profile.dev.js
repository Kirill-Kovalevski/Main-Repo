"use strict";

(function () {
  'use strict'; // ---------- NAV ----------

  var back = document.getElementById('pBack');
  if (back) back.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = '/Calendar/index.html';
  }); // ---------- THEME ----------
  // Sync checkbox to current theme (theme.js handles the apply + storage)

  function syncDarkToggle() {
    var cb = document.getElementById('pDark');
    if (cb) cb.checked = window.__loozTheme && window.__loozTheme.isDark();
  }

  syncDarkToggle();
  window.addEventListener('looz-theme', syncDarkToggle); // ---------- PROFILE / STATUS ----------

  var nameNode = document.getElementById('pName');
  var statusNode = document.getElementById('pStatus');
  var fullInput = document.getElementById('fFullName'); // load profile basics

  (function loadProfile() {
    var display = 'דניאלה';

    try {
      var p = JSON.parse(localStorage.getItem('profile') || '{}');
      if (p.name) display = p.name;
      if (p.status) statusNode.textContent = p.status;
      if (p.email) (document.getElementById('fEmail') || {}).value = p.email;
      if (p.phone) (document.getElementById('fPhone') || {}).value = p.phone;
    } catch (e) {} // fallbacks from auth


    try {
      var au = localStorage.getItem('authUser');

      if (au) {
        var o = JSON.parse(au);
        if (!display && o) display = o.name || o.displayName || o.firstName || display;
      }

      var alt = localStorage.getItem('authName');
      if (alt) display = alt;
    } catch (e) {}

    nameNode.textContent = display;
    if (fullInput) fullInput.value = display; // avatar

    var a = localStorage.getItem('profileAvatar');
    if (a) setAvatar(a);
  })(); // edit button: status (and optional name) quick edit


  var editBtn = document.getElementById('pEdit');
  if (editBtn) editBtn.addEventListener('click', function () {
    var newStatus = prompt('עדכן/י סטטוס (מתחת לשם):', statusNode.textContent.trim());

    if (newStatus != null) {
      statusNode.textContent = newStatus.trim();
      persistProfile();
    }
  }); // save footer button

  var saveBtn = document.getElementById('pSave');
  if (saveBtn) saveBtn.addEventListener('click', function () {
    persistProfile();
    alert('נשמר בהצלחה!');
  });

  function persistProfile() {
    var data = {
      name: (document.getElementById('fFullName') || {}).value || nameNode.textContent.trim(),
      email: (document.getElementById('fEmail') || {}).value || '',
      phone: (document.getElementById('fPhone') || {}).value || '',
      status: statusNode.textContent.trim()
    };
    localStorage.setItem('profile', JSON.stringify(data));
    nameNode.textContent = data.name || '—';
  } // logout


  var logoutBtn = document.getElementById('pLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', function () {
    ['authUser', 'token', 'authName'].forEach(function (k) {
      return localStorage.removeItem(k);
    });
    window.location.href = '/Calendar/index.html';
  }); // ---------- AVATAR ----------

  var avatarBtn = document.getElementById('pAvatarBtn');
  var avatarImg = document.getElementById('pAvatar');
  var avatarFile = document.getElementById('pAvatarFile');

  function setAvatar(dataUrl) {
    avatarImg.style.backgroundImage = "url(\"".concat(dataUrl, "\")");
  }

  if (avatarBtn && avatarFile) {
    avatarBtn.addEventListener('click', function () {
      return avatarFile.click();
    });
    avatarFile.addEventListener('change', function () {
      var f = avatarFile.files && avatarFile.files[0];
      if (!f) return;
      var reader = new FileReader();

      reader.onload = function (e) {
        var dataUrl = e.target.result;
        setAvatar(dataUrl);
        localStorage.setItem('profileAvatar', dataUrl);
      };

      reader.readAsDataURL(f);
    });
  } // ---------- TASKS ----------


  function loadEvents() {
    // Try multiple keys to be compatible with previous versions
    var raw = localStorage.getItem('events') || localStorage.getItem('loozEvents') || '[]';

    try {
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  function dateKey(d) {
    return String(d).slice(0, 10); // expects ISO date, or 'YYYY-MM-DD'
  }

  function buildTasks() {
    var events = loadEvents();
    var open = [];
    var done = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ev = _step.value;
        var item = {
          title: ev.title || ev.name || 'ללא כותרת',
          date: ev.date || ev.day || ev.d,
          time: ev.time || ev.t || '',
          done: !!ev.done
        };
        (item.done ? done : open).push(item);
      } // stats

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    document.getElementById('stOpen').textContent = open.length;
    document.getElementById('stDone').textContent = done.length;
    document.getElementById('stTotal').textContent = open.length + done.length; // lists

    fillList('openList', open, false);
    fillList('doneList', done, true);
    var emptyDone = document.getElementById('doneEmpty');
    if (emptyDone) emptyDone.style.display = done.length ? 'none' : '';
  }

  function fillList(id, arr, muted) {
    var ul = document.getElementById(id);
    ul.innerHTML = '';
    arr.sort(function (a, b) {
      return (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || '');
    });
    arr.forEach(function (ev) {
      var li = document.createElement('li');
      li.className = 'trow';
      li.innerHTML = "\n        <span class=\"trow__tag\">".concat(muted ? 'הושלם' : 'פתוח', "</span>\n        <span class=\"trow__title\">").concat(escapeHtml(ev.title), "</span>\n        <span class=\"trow__meta\">").concat(escapeHtml(ev.date || '')).concat(ev.time ? ' · ' + escapeHtml(ev.time) : '', "</span>\n      ");
      li.addEventListener('click', function () {
        // pass the chosen date to the app
        if (ev.date) localStorage.setItem('goToDate', dateKey(ev.date));
        window.location.href = '/Calendar/index.html';
      });
      ul.appendChild(li);
    });
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

  buildTasks(); // ---------- SOCIAL LINKS ----------

  var icons = document.getElementById('socialIcons');
  var addBtn = document.getElementById('btnLink');
  var input = document.getElementById('socialHandle');
  var select = document.getElementById('socialSelect');
  var LINKS_KEY = 'socialLinks';

  function readLinks() {
    try {
      return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeLinks(o) {
    localStorage.setItem(LINKS_KEY, JSON.stringify(o));
  }

  function openLink(net) {
    var map = readLinks();
    var url = map[net];
    if (url) window.open(url, '_blank');else alert('אין קישור שמור לרשת זו. הוסף קישור למטה.');
  }

  if (icons) {
    icons.addEventListener('click', function (e) {
      var b = e.target.closest('.sicon');
      if (!b) return;
      openLink(b.dataset.net);
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var v = input.value.trim();
      if (!v) return;
      var map = readLinks();
      map[select.value] = v.startsWith('http') ? v : 'https://' + v.replace(/^@/, '');
      writeLinks(map);
      input.value = '';
      alert('הקישור נשמר!');
    });
  }
})();