(function () {
  'use strict';

  // ---------- NAV ----------
  const back = document.getElementById('pBack');
  if (back) back.addEventListener('click', () => {
    window.history.length > 1 ? history.back() : (window.location.href = '/Calendar/index.html');
  });

  // ---------- THEME ----------
  // Sync checkbox to current theme (theme.js handles the apply + storage)
  function syncDarkToggle() {
    const cb = document.getElementById('pDark');
    if (cb) cb.checked = window.__loozTheme && window.__loozTheme.isDark();
  }
  syncDarkToggle();
  window.addEventListener('looz-theme', syncDarkToggle);

  // ---------- PROFILE / STATUS ----------
  const nameNode   = document.getElementById('pName');
  const statusNode = document.getElementById('pStatus');
  const fullInput  = document.getElementById('fFullName');

  // load profile basics
  (function loadProfile() {
    let display = 'דניאלה';
    try {
      const p = JSON.parse(localStorage.getItem('profile') || '{}');
      if (p.name) display = p.name;
      if (p.status) statusNode.textContent = p.status;
      if (p.email)  (document.getElementById('fEmail') || {}).value  = p.email;
      if (p.phone)  (document.getElementById('fPhone') || {}).value  = p.phone;
    } catch(e){}

    // fallbacks from auth
    try {
      const au = localStorage.getItem('authUser');
      if (au) {
        const o = JSON.parse(au);
        if (!display && o) display = o.name || o.displayName || o.firstName || display;
      }
      const alt = localStorage.getItem('authName');
      if (alt) display = alt;
    } catch(e){}

    nameNode.textContent = display;
    if (fullInput) fullInput.value = display;

    // avatar
    const a = localStorage.getItem('profileAvatar');
    if (a) setAvatar(a);
  })();

  // edit button: status (and optional name) quick edit
  const editBtn = document.getElementById('pEdit');
  if (editBtn) editBtn.addEventListener('click', () => {
    const newStatus = prompt('עדכן/י סטטוס (מתחת לשם):', statusNode.textContent.trim());
    if (newStatus != null) {
      statusNode.textContent = newStatus.trim();
      persistProfile();
    }
  });

  // save footer button
  const saveBtn = document.getElementById('pSave');
  if (saveBtn) saveBtn.addEventListener('click', () => {
    persistProfile();
    alert('נשמר בהצלחה!');
  });

  function persistProfile() {
    const data = {
      name:  (document.getElementById('fFullName') || {}).value || nameNode.textContent.trim(),
      email: (document.getElementById('fEmail')    || {}).value || '',
      phone: (document.getElementById('fPhone')    || {}).value || '',
      status: statusNode.textContent.trim()
    };
    localStorage.setItem('profile', JSON.stringify(data));
    nameNode.textContent = data.name || '—';
  }

  // logout
  const logoutBtn = document.getElementById('pLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    ['authUser','token','authName'].forEach(k => localStorage.removeItem(k));
    window.location.href = '/Calendar/index.html';
  });

  // ---------- AVATAR ----------
  const avatarBtn  = document.getElementById('pAvatarBtn');
  const avatarImg  = document.getElementById('pAvatar');
  const avatarFile = document.getElementById('pAvatarFile');

  function setAvatar(dataUrl) {
    avatarImg.style.backgroundImage = `url("${dataUrl}")`;
  }

  if (avatarBtn && avatarFile) {
    avatarBtn.addEventListener('click', () => avatarFile.click());
    avatarFile.addEventListener('change', () => {
      const f = avatarFile.files && avatarFile.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target.result;
        setAvatar(dataUrl);
        localStorage.setItem('profileAvatar', dataUrl);
      };
      reader.readAsDataURL(f);
    });
  }

  // ---------- TASKS ----------
  function loadEvents() {
    // Try multiple keys to be compatible with previous versions
    const raw = localStorage.getItem('events') || localStorage.getItem('loozEvents') || '[]';
    try { return JSON.parse(raw) || []; } catch(e) { return []; }
  }

  function dateKey(d) {
    return String(d).slice(0,10); // expects ISO date, or 'YYYY-MM-DD'
  }

  function buildTasks() {
    const events = loadEvents();
    const open   = [];
    const done   = [];

    for (const ev of events) {
      const item = {
        title: ev.title || ev.name || 'ללא כותרת',
        date:  ev.date || ev.day  || ev.d,
        time:  ev.time || ev.t || '',
        done:  !!ev.done
      };
      (item.done ? done : open).push(item);
    }

    // stats
    document.getElementById('stOpen').textContent  = open.length;
    document.getElementById('stDone').textContent  = done.length;
    document.getElementById('stTotal').textContent = open.length + done.length;

    // lists
    fillList('openList', open, false);
    fillList('doneList', done,  true );

    const emptyDone = document.getElementById('doneEmpty');
    if (emptyDone) emptyDone.style.display = done.length ? 'none' : '';
  }

  function fillList(id, arr, muted) {
    const ul = document.getElementById(id);
    ul.innerHTML = '';
    arr.sort((a,b) => (a.date||'').localeCompare(b.date||'') || (a.time||'').localeCompare(b.time||''));
    arr.forEach(ev => {
      const li = document.createElement('li');
      li.className = 'trow';
      li.innerHTML = `
        <span class="trow__tag">${muted ? 'הושלם' : 'פתוח'}</span>
        <span class="trow__title">${escapeHtml(ev.title)}</span>
        <span class="trow__meta">${escapeHtml(ev.date || '')}${ev.time ? ' · ' + escapeHtml(ev.time) : ''}</span>
      `;
      li.addEventListener('click', () => {
        // pass the chosen date to the app
        if (ev.date) localStorage.setItem('goToDate', dateKey(ev.date));
        window.location.href = '/Calendar/index.html';
      });
      ul.appendChild(li);
    });
  }

  function escapeHtml(s){
    return (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  buildTasks();

  // ---------- SOCIAL LINKS ----------
  const icons = document.getElementById('socialIcons');
  const addBtn = document.getElementById('btnLink');
  const input  = document.getElementById('socialHandle');
  const select = document.getElementById('socialSelect');

  const LINKS_KEY = 'socialLinks';

  function readLinks(){
    try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}'); } catch(e){ return {}; }
  }
  function writeLinks(o){ localStorage.setItem(LINKS_KEY, JSON.stringify(o)); }

  function openLink(net){
    const map = readLinks();
    const url = map[net];
    if (url) window.open(url, '_blank');
    else alert('אין קישור שמור לרשת זו. הוסף קישור למטה.');
  }

  if (icons) {
    icons.addEventListener('click', (e) => {
      const b = e.target.closest('.sicon');
      if (!b) return;
      openLink(b.dataset.net);
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const v = input.value.trim();
      if (!v) return;
      const map = readLinks();
      map[select.value] = v.startsWith('http') ? v : ('https://' + v.replace(/^@/, ''));
      writeLinks(map);
      input.value = '';
      alert('הקישור נשמר!');
    });
  }

})();
