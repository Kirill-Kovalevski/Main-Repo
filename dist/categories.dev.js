"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function () {
  'use strict';

  var back = document.getElementById('cBack');
  if (back) back.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = 'index.html';
  });
  var chosen = {}; // key -> chip text

  document.querySelectorAll('.chips').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target && e.target.closest('.chip');
      if (!chip) return;

      _toConsumableArray(group.querySelectorAll('.chip')).forEach(function (c) {
        c.classList.remove('is-on');
      });

      chip.classList.add('is-on');
      var key = group.getAttribute('data-key');
      chosen[key] = chip.textContent.trim();
    });
  }); // Quick templates -> draft

  document.querySelector('.card--templates').addEventListener('click', function (e) {
    var tpl = e.target && e.target.closest('.tpl');
    if (!tpl) return;
    var t = tpl.getAttribute('data-title');
    var tm = tpl.getAttribute('data-time');
    var today = new Date();
    var ymd = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    localStorage.setItem('draftEvent', JSON.stringify({
      title: t,
      time: tm,
      date: ymd
    }));
    window.location.href = 'index.html';
  }); // Build simple title from chips

  var apply = document.getElementById('cApply');

  if (apply) {
    apply.addEventListener('click', function () {
      var parts = [];
      if (chosen.mood) parts.push(chosen.mood);
      if (chosen.timeofday) parts.push(chosen.timeofday);
      if (chosen.people) parts.push(chosen.people);
      if (chosen.place) parts.push(chosen.place);
      if (chosen.season) parts.push(chosen.season);
      if (chosen.country) parts.push(chosen.country);
      var title = parts.length ? parts.join(' · ') : 'פעילות';
      var today = new Date();
      var ymd = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      var t = '12:00';
      localStorage.setItem('draftEvent', JSON.stringify({
        title: title,
        time: t,
        date: ymd
      }));
      window.location.href = 'index.html';
    });
  }
})();