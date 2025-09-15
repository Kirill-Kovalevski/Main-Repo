"use strict";

// Calendar/auth.js
(function () {
  'use strict';

  // If already authenticated, go straight to the app
  try {
    var raw = localStorage.getItem('auth.user');
    if (raw) {
      window.location.replace('/Calendar/index.html');
      return;
    }
  } catch (e) {}
  function $(id) {
    return document.getElementById(id);
  }
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  }
  function validatePassword(v) {
    v = String(v || '');
    return v.length >= 8 && /\d/.test(v);
  }
  document.addEventListener('DOMContentLoaded', function () {
    // Tabs
    var tabLogin = $('tab-login');
    var tabRegister = $('tab-register');
    var paneLogin = $('panel-login');
    var paneRegister = $('panel-register');
    function activate(tab) {
      var isLogin = tab === 'login';
      tabLogin.classList.toggle('is-active', isLogin);
      tabRegister.classList.toggle('is-active', !isLogin);
      paneLogin.hidden = !isLogin;
      paneRegister.hidden = isLogin;
      paneLogin.classList.toggle('is-active', isLogin);
      paneRegister.classList.toggle('is-active', !isLogin);
    }
    tabLogin.addEventListener('click', function () {
      activate('login');
    });
    tabRegister.addEventListener('click', function () {
      activate('register');
    });

    // Show/hide password (both forms)
    document.querySelectorAll('.f-eye[data-eye]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-eye');
        var input = $(id);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });

    // LOGIN
    var loginForm = $('loginForm');
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ($('loginEmail').value || '').trim();
      var pass = $('loginPassword').value || '';
      var remember = $('rememberMe').checked;
      $('loginEmailErr').textContent = '';
      $('loginPasswordErr').textContent = '';
      var ok = true;
      if (!validateEmail(email)) {
        $('loginEmailErr').textContent = 'אימייל לא תקין';
        ok = false;
      }
      if (!pass) {
        $('loginPasswordErr').textContent = 'נא להזין סיסמה';
        ok = false;
      }
      if (!ok) return;
      var user = {
        email: email,
        name: email.split('@')[0],
        ts: Date.now(),
        remember: !!remember
      };
      try {
        localStorage.setItem('auth.user', JSON.stringify(user));
        if (remember) sessionStorage.setItem('auth.session', 'keep');
      } catch (e) {}
      window.location.replace('/Calendar/index.html');
    });

    // REGISTER
    var registerForm = $('registerForm');
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('regName').value || '').trim();
      var email = ($('regEmail').value || '').trim();
      var pass = $('regPassword').value || '';
      var conf = $('regConfirm').value || '';
      var terms = $('regTerms').checked;

      // clear errors
      $('regNameErr').textContent = '';
      $('regEmailErr').textContent = '';
      $('regPasswordErr').textContent = '';
      $('regConfirmErr').textContent = '';
      var ok = true;
      if (!name) {
        $('regNameErr').textContent = 'נא להזין שם';
        ok = false;
      }
      if (!validateEmail(email)) {
        $('regEmailErr').textContent = 'אימייל לא תקין';
        ok = false;
      }
      if (!validatePassword(pass)) {
        $('regPasswordErr').textContent = 'סיסמה חייבת להיות באורך 8+ ולכלול ספרה';
        ok = false;
      }
      if (pass !== conf) {
        $('regConfirmErr').textContent = 'סיסמאות אינן תואמות';
        ok = false;
      }
      if (!terms) {
        alert('יש לאשר את התנאים');
        ok = false;
      }
      if (!ok) return;
      var user = {
        email: email,
        name: name,
        ts: Date.now(),
        "new": true
      };
      try {
        localStorage.setItem('auth.user', JSON.stringify(user));
      } catch (e) {}
      window.location.replace('/Calendar/index.html');
    });
  });
})();
