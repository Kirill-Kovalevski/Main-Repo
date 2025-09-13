"use strict";

// Calendar/auth-guard.js
(function () {
  'use strict';

  function getUser() {
    try {
      var raw = localStorage.getItem('auth.user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  if (!getUser()) {
    // Not logged in → send to auth
    window.location.replace('/Calendar/auth.html');
    return;
  } // Optional: expose logout


  window.logout = function () {
    try {
      localStorage.removeItem('auth.user');
      sessionStorage.removeItem('auth.session');
    } catch (e) {}

    window.location.replace('/Calendar/auth.html');
  };
})();