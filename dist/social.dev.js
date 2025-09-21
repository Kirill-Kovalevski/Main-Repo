"use strict";

(function () {
  'use strict';

  var POSTS_KEY = 'socialPosts';

  function loadPosts() {
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function savePosts(arr) {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function uid() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function escape(s) {
    return (s || '').replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[m];
    });
  }

  var sBack = document.getElementById('sBack');
  if (sBack) sBack.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : location.href = 'index.html';
  });
  var pTitle = document.getElementById('pTitle');
  var pDesc = document.getElementById('pDesc');
  var pTags = document.getElementById('pTags');
  var pTime = document.getElementById('pTime');
  var pPost = document.getElementById('pPost');
  var sFeed = document.getElementById('sFeed');

  function render() {
    var posts = loadPosts().slice().reverse(); // newest first

    if (!posts.length) {
      sFeed.innerHTML = '<div class="card"><div class="card__desc">עדיין אין פוסטים. שתף רעיון לפעילות 👇</div></div>';
      return;
    }

    sFeed.innerHTML = posts.map(function (p) {
      return "\n      <article class=\"card\" id=\"".concat(p.id, "\" data-id=\"").concat(p.id, "\">\n        <h3 class=\"card__title\">").concat(escape(p.title), "</h3>\n        <p class=\"card__desc\">").concat(escape(p.desc || ''), "</p>\n        <div class=\"card__tags\">\n          ").concat((p.tags || []).map(function (t) {
        return "<span class=\"tag\">".concat(escape(t), "</span>");
      }).join(''), "\n          ").concat(p.time ? "<span class=\"tag\">\u23F0 ".concat(escape(p.time), "</span>") : '', "\n          ").concat(p.user && p.user.handle ? "<span class=\"tag\">\u05DE\u05D0\u05EA ".concat(escape(p.user.handle), "</span>") : '', "\n        </div>\n        <div class=\"card__actions\">\n          <button class=\"btn\" data-use=\"").concat(p.id, "\">\u05D4\u05D5\u05E1\u05E3 \u05DC\u05D9</button>\n          <button class=\"btn\" data-del=\"").concat(p.id, "\">\u05DE\u05D7\u05E7</button>\n        </div>\n      </article>\n    ");
    }).join('');
  }

  if (pPost) {
    pPost.addEventListener('click', function () {
      var title = (pTitle.value || '').trim();
      var desc = (pDesc.value || '').trim();
      var time = (pTime.value || '').trim() || '12:00';
      var tags = (pTags.value || '').split(',').map(function (s) {
        return s.trim();
      }).filter(Boolean);

      if (!title) {
        pTitle.focus();
        return;
      } // crude "current user"


      var user = null;

      try {
        var au = localStorage.getItem('authUser');

        if (au) {
          var parsed = JSON.parse(au);
          var handle = parsed && parsed.username ? '@' + parsed.username : '@me';
          user = {
            id: parsed && parsed.id || 'u_me',
            name: parsed && parsed.name || 'אני',
            handle: handle
          };
        }
      } catch (e) {}

      if (!user) user = {
        id: 'u_me',
        name: 'אני',
        handle: '@me'
      };
      var posts = loadPosts();
      posts.push({
        id: uid(),
        title: title,
        desc: desc,
        time: time,
        tags: tags,
        user: user
      });
      savePosts(posts);
      pTitle.value = '';
      pDesc.value = '';
      pTags.value = '';
      pTime.value = '12:00';
      render();
    });
  }

  sFeed.addEventListener('click', function (e) {
    var use = e.target.closest('[data-use]');
    var del = e.target.closest('[data-del]');

    if (use) {
      var id = use.getAttribute('data-use');
      var posts = loadPosts();
      var p = posts.find(function (x) {
        return x.id === id;
      });

      if (p) {
        var today = new Date();
        var ymd = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        localStorage.setItem('draftEvent', JSON.stringify({
          title: p.title,
          time: p.time || '12:00',
          date: ymd
        }));
        location.href = 'index.html';
      }
    }

    if (del) {
      var _id = del.getAttribute('data-del');

      var _posts = loadPosts();

      _posts = _posts.filter(function (x) {
        return x.id !== _id;
      });
      savePosts(_posts);
      render();
    }
  }); // If came from "Contact" with ?to=@handle — prefill composer

  (function maybePrefillTo() {
    var to = qs('to');
    if (!to) return;
    pDesc.value = 'פניה אל ' + to + ': ';
    pDesc.focus();
  })();

  render();
})();