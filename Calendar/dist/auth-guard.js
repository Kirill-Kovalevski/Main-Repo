"use strict";

// Calendar/auth-guard.js
(function () {
  'use strict';

  // Do not run the guard on the auth page itself
  var isAuthPage = /\/Calendar\/auth\.html$/i.test(window.location.pathname);
  if (isAuthPage) return;
  function getUser() {
    try {
      var raw = localStorage.getItem('auth.user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // If no user -> redirect to login/register
  if (!getUser()) {
    window.location.replace('/Calendar/auth.html');
    return;
  }

  // Expose a safe global logout used by the app's header button
  window.logout = function () {
    try {
      localStorage.removeItem('auth.user');
      localStorage.removeItem('auth.token');
      sessionStorage.removeItem('auth.session');
    } catch (e) {}
    // replace() prevents the back button from re-entering a protected page
    window.location.replace('/Calendar/auth.html');
  };
})();
