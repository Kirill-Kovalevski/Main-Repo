"use strict";

/* Calendar/dist/app.js (safe for plain browsers) */
(function () {
  console.log('[app] loaded'); // ---------- Elements ----------

  var lemonToggle = document.getElementById('lemonToggle');
  var appNav = document.getElementById('appNav');
  var taskList = document.getElementById('taskList');
  var completedList = document.getElementById('completedList');
  var completedSection = document.getElementById('completedSection');
  var addEventBtn = document.getElementById('addEventBtn');
  var modal = document.getElementById('newEventModal'); // dialog/div

  var modalBackdrop = modal ? modal.querySelector('[data-close]') : null;
  var modalCloseBtn = modal ? modal.querySelector('.c-btn--ghost[data-close]') : null;
  var modalForm = document.getElementById('newEventForm');
  var titleInput = document.getElementById('evtTitle');
  var dateInput = document.getElementById('evtDate');
  var timeInput = document.getElementById('evtTime'); // ---------- Small helpers ----------

  function open(el) {
    if (el) el.classList.remove('u-hidden');
  }

  function close(el) {
    if (el) el.classList.add('u-hidden');
  }

  function showCompleted() {
    if (completedSection) completedSection.classList.remove('u-hidden');
  }

  function taskItemTemplate(text) {
    var li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = '<label class="c-item__label">' + '<input class="c-item__check" type="checkbox" />' + '<p class="c-item__text">' + text + '</p>' + '</label>';
    return li;
  }

  function completedItemTemplate(text) {
    var li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML = '<div class="c-item__label">' + '<p class="c-item__text">' + text + '</p>' + '</div>';
    return li;
  } // Bigger, smoother confetti burst


  function confettiBurst(anchorEl) {
    if (!anchorEl) return;
    var rect = anchorEl.getBoundingClientRect();
    var originX = rect.left + rect.width / 2 + window.scrollX;
    var originY = rect.top + rect.height / 2 + window.scrollY;
    var colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B8C0FF', '#F896D8', '#A3E635', '#22D3EE'];
    var COUNT = 60; // pieces

    var MAXD = 220; // distance

    var DURA = 1200; // ms

    for (var i = 0; i < COUNT; i++) {
      (function (i) {
        var p = document.createElement('span');
        p.className = 'c-confetti';
        p.style.background = colors[i % colors.length];
        p.style.left = originX + 'px';
        p.style.top = originY + 'px';
        var size = 6 + Math.random() * 6;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        document.body.appendChild(p);
        var angle = Math.random() * Math.PI * 2;
        var dist = 60 + Math.random() * (MAXD - 60);
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist + Math.random() * 60;
        p.animate([{
          transform: 'translate(0,0) scale(1)',
          opacity: 1
        }, {
          transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + (0.6 + Math.random() * 0.4) + ')',
          opacity: 0
        }], {
          duration: DURA,
          easing: 'cubic-bezier(.2,.7,.2,1)'
        });
        setTimeout(function () {
          if (p && p.parentNode) p.parentNode.removeChild(p);
        }, DURA + 40);
      })(i);
    }
  } // ---------- Lemon → toggle nav + nudge day ----------


  if (lemonToggle) {
    lemonToggle.addEventListener('click', function () {
      if (!appNav) return;
      var collapsed = appNav.classList.toggle('u-is-collapsed'); // true if now collapsed
      // Toggle a class on the header so we can shift the day slightly

      var headerEl = lemonToggle.closest('.o-header');
      if (headerEl) headerEl.classList.toggle('is-nav-open', !collapsed);
    });
  } // ---------- Check-off flow (rainbow strike + fade + move to Completed) ----------


  if (taskList) {
    taskList.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.classList.contains('c-item__check')) return;
      var li = t.closest('.c-item');
      var textEl = li ? li.querySelector('.c-item__text') : null;
      var text = textEl ? (textEl.textContent || '').trim() : ''; // play animation and confetti

      if (li) li.classList.add('is-completing');
      confettiBurst(t); // when animation ends → move to Completed

      function onDone() {
        if (!li) return;
        li.removeEventListener('animationend', onDone);
        if (li.parentNode) li.parentNode.removeChild(li);
        showCompleted();
        if (completedList) completedList.appendChild(completedItemTemplate(text));
      }

      if (li) li.addEventListener('animationend', onDone, {
        once: true
      });
    });
  } // ---------- Modal open/close ----------


  if (addEventBtn) {
    addEventBtn.addEventListener('click', function () {
      open(modal);
      if (titleInput) titleInput.focus();
    });
  }

  if (modalBackdrop) modalBackdrop.addEventListener('click', function () {
    close(modal);
  });
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', function () {
    close(modal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close(modal);
  }); // ---------- Create new event from modal ----------

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = (titleInput && titleInput.value || '').trim();
      var date = (dateInput && dateInput.value || '').trim();
      var time = (timeInput && timeInput.value || '').trim();
      if (!title || !date || !time) return;
      var dt = new Date(date);
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = String(dt.getFullYear()).slice(-2);
      var label = title + ' ' + time + ' (' + dd + '/' + mm + '/' + yy + ')';
      if (taskList) taskList.appendChild(taskItemTemplate(label));
      modalForm.reset();
      close(modal);
    });
  }
})();