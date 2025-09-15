"use strict";

// Calendar/auth.js
(function () {
  'use strict';

  function qp(name) {
    return new URLSearchParams(location.search).get(name);
  } // If we arrived with ?loggedout=1, nuke any leftovers *before* we do anything else


  if (qp('loggedout') === '1') {
    try {
      localStorage.removeItem('auth.user');
      localStorage.removeItem('auth.token');
      sessionStorage.removeItem('auth.session');
    } catch (e) {}
  } // If already logged in and this is not a logout visit, go to the app


  try {
    var raw = localStorage.getItem('auth.user');

    if (raw && qp('loggedout') !== '1') {
      location.replace('/Calendar/index.html');
      return;
    }
  } catch (e) {}

  function $(id) {
    return document.getElementById(id);
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  }

  function validPass(v) {
    v = String(v || '');
    return v.length >= 8 && /\d/.test(v);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Tabs
    var tLogin = $('tab-login'),
        tReg = $('tab-register');
    var pLogin = $('panel-login'),
        pReg = $('panel-register');

    function activate(which) {
      var isLogin = which === 'login';
      tLogin.classList.toggle('is-active', isLogin);
      tReg.classList.toggle('is-active', !isLogin);
      pLogin.hidden = !isLogin;
      pReg.hidden = isLogin;
      pLogin.classList.toggle('is-active', isLogin);
      pReg.classList.toggle('is-active', !isLogin);
    }

    tLogin.addEventListener('click', function () {
      activate('login');
    });
    tReg.addEventListener('click', function () {
      activate('register');
    }); // show/hide password

    document.querySelectorAll('.f-eye[data-eye]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = $(btn.getAttribute('data-eye'));
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    }); // LOGIN

    $('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ($('loginEmail').value || '').trim();
      var pass = $('loginPassword').value || '';
      var remember = $('rememberMe').checked;
      $('loginEmailErr').textContent = '';
      $('loginPasswordErr').textContent = '';
      var ok = true;

      if (!validEmail(email)) {
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

      location.replace('/Calendar/index.html');
    }); // REGISTER

    $('registerForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('regName').value || '').trim();
      var email = ($('regEmail').value || '').trim();
      var pass = $('regPassword').value || '';
      var conf = $('regConfirm').value || '';
      var terms = $('regTerms').checked;
      $('regNameErr').textContent = '';
      $('regEmailErr').textContent = '';
      $('regPasswordErr').textContent = '';
      $('regConfirmErr').textContent = '';
      var ok = true;

      if (!name) {
        $('regNameErr').textContent = 'נא להזין שם';
        ok = false;
      }

      if (!validEmail(email)) {
        $('regEmailErr').textContent = 'אימייל לא תקין';
        ok = false;
      }

      if (!validPass(pass)) {
        $('regPasswordErr').textContent = 'סיסמה: 8+ תווים ולפחות ספרה אחת';
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

      location.replace('/Calendar/index.html');
    });
  });
})();