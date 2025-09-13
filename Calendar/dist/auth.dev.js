"use strict";

// Calendar/auth.js
(function () {
  'use strict'; // ===== Helpers =====

  function $(id) {
    return document.getElementById(id);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').toLowerCase());
  }

  function hasGoodPassword(v) {
    return typeof v === 'string' && v.length >= 8 && /\d/.test(v);
  }

  function setError(el, msg) {
    if (el) el.textContent = msg || '';
  }

  function saveUsers(users) {
    try {
      localStorage.setItem('auth.users', JSON.stringify(users));
    } catch (e) {}
  }

  function loadUsers() {
    try {
      var raw = localStorage.getItem('auth.users');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setSession(user, remember) {
    try {
      localStorage.setItem('auth.user', JSON.stringify(user));

      if (!remember) {
        // fallback: session-like behavior
        sessionStorage.setItem('auth.session', '1');
      }
    } catch (e) {}
  }

  function getSession() {
    try {
      var raw = localStorage.getItem('auth.user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  } // Redirect to app if already logged in


  if (getSession()) {
    window.location.replace('/Calendar/index.html');
    return;
  } // ===== Tabs =====


  var tabLogin = $('tab-login');
  var tabRegister = $('tab-register');
  var panelLogin = $('panel-login');
  var panelRegister = $('panel-register');

  function switchTo(panel) {
    var loginActive = panel === 'login';

    if (tabLogin) {
      tabLogin.classList.toggle('is-active', loginActive);
      tabLogin.setAttribute('aria-selected', loginActive ? 'true' : 'false');
    }

    if (tabRegister) {
      tabRegister.classList.toggle('is-active', !loginActive);
      tabRegister.setAttribute('aria-selected', !loginActive ? 'true' : 'false');
    }

    if (panelLogin) {
      panelLogin.hidden = !loginActive;
      panelLogin.classList.toggle('is-active', loginActive);
    }

    if (panelRegister) {
      panelRegister.hidden = loginActive;
      panelRegister.classList.toggle('is-active', !loginActive);
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', function () {
    switchTo('login');
  });
  if (tabRegister) tabRegister.addEventListener('click', function () {
    switchTo('register');
  }); // ===== Show/hide password buttons =====

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.matches('.f-eye')) return;
    var targetId = t.getAttribute('data-eye');
    var input = targetId ? $(targetId) : null;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }); // ===== Login =====

  var loginForm = $('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ($('loginEmail') && $('loginEmail').value || '').trim();
      var pass = ($('loginPassword') && $('loginPassword').value || '').trim();
      var remember = $('rememberMe') ? $('rememberMe').checked : false;
      setError($('loginEmailErr'), '');
      setError($('loginPasswordErr'), '');
      var ok = true;

      if (!isEmail(email)) {
        setError($('loginEmailErr'), 'אימייל לא תקין');
        ok = false;
      }

      if (!pass) {
        setError($('loginPasswordErr'), 'נא להזין סיסמה');
        ok = false;
      }

      if (!ok) return;
      var users = loadUsers();
      var u = users[email];

      if (!u) {
        setError($('loginEmailErr'), 'משתמש לא קיים');
        return;
      }

      if (u.p !== btoa(pass)) {
        setError($('loginPasswordErr'), 'סיסמה שגויה');
        return;
      }

      setSession({
        email: email,
        name: u.n || 'משתמש/ת'
      }, remember);
      window.location.replace('/Calendar/index.html');
    });
  } // ===== Register =====


  var registerForm = $('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('regName') && $('regName').value || '').trim();
      var email = ($('regEmail') && $('regEmail').value || '').trim();
      var pass = ($('regPassword') && $('regPassword').value || '').trim();
      var conf = ($('regConfirm') && $('regConfirm').value || '').trim();
      var terms = $('regTerms') ? $('regTerms').checked : false;
      setError($('regNameErr'), '');
      setError($('regEmailErr'), '');
      setError($('regPasswordErr'), '');
      setError($('regConfirmErr'), '');
      var ok = true;

      if (!name) {
        setError($('regNameErr'), 'נא להזין שם');
        ok = false;
      }

      if (!isEmail(email)) {
        setError($('regEmailErr'), 'אימייל לא תקין');
        ok = false;
      }

      if (!hasGoodPassword(pass)) {
        setError($('regPasswordErr'), 'לפחות 8 תווים ומספר אחד');
        ok = false;
      }

      if (conf !== pass) {
        setError($('regConfirmErr'), 'הסיסמאות אינן תואמות');
        ok = false;
      }

      if (!terms) {
        alert('נא לאשר את התנאים');
        ok = false;
      }

      if (!ok) return;
      var users = loadUsers();

      if (users[email]) {
        setError($('regEmailErr'), 'האימייל כבר רשום');
        return;
      }

      users[email] = {
        n: name,
        p: btoa(pass)
      }; // demo only; replace with real hashing in backend

      saveUsers(users);
      setSession({
        email: email,
        name: name
      }, true);
      window.location.replace('/Calendar/index.html');
    });
  }
})();