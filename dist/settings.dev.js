"use strict";

(function () {
  'use strict';

  var back = document.getElementById('sBack');
  if (back) back.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = '/Calendar/index.html';
  }); // reflect theme toggle

  var darkCb = document.getElementById('setDark');

  function sync() {
    if (darkCb) darkCb.checked = window.__loozTheme && window.__loozTheme.isDark();
  }

  sync();
  window.addEventListener('looz-theme', sync);
  if (darkCb) darkCb.addEventListener('change', function () {
    window.__loozTheme.set(darkCb.checked ? 'dark' : 'light');
  }); // (optional) you can persist other settings here

  var save = document.getElementById('sSave');
  if (save) save.addEventListener('click', function () {
    return alert('נשמר!');
  });
})();