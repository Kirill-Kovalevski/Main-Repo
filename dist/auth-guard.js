"use strict";

// Calendar/auth-guard.js
(function () {
  'use strict';

  // don't guard the login/register page itself
  if (/\/Calendar\/auth\.html$/i.test(location.pathname)) return;
  function getUser() {
    try {
      var raw = localStorage.getItem('auth.user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // no user -> go to auth
  if (!getUser()) {
    location.replace('/auth.html');
    return;
  }

  // expose a logout() the header can call
  window.logout = function () {
    try {
      localStorage.removeItem('auth.user');
      localStorage.removeItem('auth.token');
      sessionStorage.removeItem('auth.session');
    } catch (e) {}
    // IMPORTANT: add a flag so auth.html knows not to bounce back
    location.replace('/auth.html?loggedout=1');
  };
})();
