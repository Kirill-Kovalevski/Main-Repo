"use strict";

(function () {
  'use strict';

  var backBtn = document.getElementById('sBack');
  var feed = document.getElementById('sFeed');
  var tabs = document.querySelector('.s-tabbar');
  if (backBtn) backBtn.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = 'index.html';
  }); // simple demo feed

  var demo = [{
    name: 'דניאלה',
    text: 'סיימתי את משימת הגיטרה להיום 🎸',
    time: 'לפני שעה'
  }, {
    name: 'יואב',
    text: 'מחפש פרטנר לריצה בפארק מחר בבוקר 🏃‍♂️',
    time: 'לפני 3 שעות'
  }, {
    name: 'מאיה',
    text: 'עוגת גבינה יצאה חלום. מי רוצה מתכון? 🍰',
    time: 'אתמול'
  }];

  if (feed) {
    demo.forEach(function (p) {
      var card = document.createElement('article');
      card.className = 's-card';
      card.innerHTML = '<div class="s-card__head">' + '<div class="s-avatar"></div>' + '<div class="s-username">' + p.name + '</div>' + '<div class="s-time">' + p.time + '</div>' + '</div>' + '<div class="s-card__body">' + p.text + '</div>';
      feed.appendChild(card);
    });
  }

  if (tabs) {
    tabs.addEventListener('click', function (e) {
      var t = e.target && e.target.closest('.s-tab');
      if (!t) return;
      tabs.querySelectorAll('.s-tab').forEach(function (btn) {
        btn.classList.remove('is-active');
      });
      t.classList.add('is-active');
    });
  }
})();