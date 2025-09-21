"use strict";

(function () {
  'use strict';

  var addEventBtn = document.getElementById('addEventBtn');
  var sheet = document.getElementById('eventSheet');
  var sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  var sheetBackdrop = sheet ? sheet.querySelector('.c-sheet__backdrop') : null;
  var sheetCloseBtn = sheet ? sheet.querySelector('[data-close].c-icon-btn--ghost') : null;
  var sheetForm = document.getElementById('sheetForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime');
  var taskList = document.getElementById('taskList');

  function add(el, c) {
    if (el && el.classList) el.classList.add(c);
  }

  function rem(el, c) {
    if (el && el.classList) el.classList.remove(c);
  }

  function buildTaskItem(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = '<label class="c-item__label">' + '<input class="c-item__check" type="checkbox" />' + '<span class="c-item__text"></span>' + '</label>' + '<button class="c-item__remove" type="button" aria-label="הסר">−</button>';
    li.querySelector('.c-item__text').textContent = text || '';
    return li;
  }

  function openSheet() {
    if (!sheet) return;
    rem(sheet, 'u-hidden');
    add(sheet, 'is-open');
    if (titleInput) try {
      titleInput.focus();
    } catch (e) {}
  }

  function closeSheet() {
    if (!sheet) return;
    rem(sheet, 'is-open');
    setTimeout(function () {
      add(sheet, 'u-hidden');
    }, 200);
  }

  if (addEventBtn) addEventBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openSheet();
  });
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });
  if (sheetPanel) sheetPanel.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  if (sheetForm) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = (titleInput && titleInput.value || '').trim();
      var d = (dateInput && dateInput.value || '').trim();
      var h = (timeInput && timeInput.value || '').trim();
      if (!t || !d || !h) return;
      var dt = new Date(d);
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = String(dt.getFullYear()).slice(-2);
      var label = t + ' ' + h + ' (' + dd + '/' + mm + '/' + yy + ')';
      if (taskList) taskList.appendChild(buildTaskItem(label));
      sheetForm.reset();
      closeSheet();
    });
  }
})();