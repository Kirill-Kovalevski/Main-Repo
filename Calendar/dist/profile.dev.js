"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  'use strict';

  var back = document.getElementById('pBack');
  if (back) back.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = 'index.html';
  }); // Prefill name from storage (same logic as app)

  var nameNode = document.getElementById('pName');
  var fullInput = document.getElementById('fFullName');
  var name = 'דניאלה';

  try {
    var au = localStorage.getItem('authUser');

    if (au) {
      var p = JSON.parse(au);

      if (p && _typeof(p) === 'object') {
        if (p.name) name = p.name;else if (p.displayName) name = p.displayName;else if (p.firstName) name = p.firstName;
      }
    } else {
      var alt = localStorage.getItem('authName');
      if (alt) name = alt;
    }
  } catch (e) {}

  if (nameNode) nameNode.textContent = name;
  if (fullInput) fullInput.value = name; // Theme chips (demo only)

  var themes = document.getElementById('themeChips');

  if (themes) {
    themes.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest('.chip');
      if (!chip) return;
      themes.querySelectorAll('.chip').forEach(function (c) {
        c.classList.remove('is-active');
      });
      chip.classList.add('is-active'); // store theme selection

      localStorage.setItem('loozTheme', chip.dataset.theme || 'light');
    });
  } // Save button persists simple fields


  var saveBtn = document.getElementById('pSave');

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var email = (document.getElementById('fEmail') || {}).value || '';
      var phone = (document.getElementById('fPhone') || {}).value || '';
      var next = {
        name: fullInput && fullInput.value || name,
        email: email,
        phone: phone
      };
      localStorage.setItem('profile', JSON.stringify(next));
      alert('נשמר בהצלחה!');
    });
  }

  var logoutBtn = document.getElementById('pLogout');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      try {
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        localStorage.removeItem('authName');
      } catch (e) {}

      window.location.href = 'index.html';
    });
  }
})();