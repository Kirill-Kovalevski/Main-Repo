/* ===== LooZ — Planner App (home) — vFinal.7 (✓/✖ counters + streak support) ===== */
(function () {
  'use strict';

  /* -------- AUTH GUARD (runs before anything else) -------- */
  (function guard() {
    try {
      var u = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
      if (!u) { location.replace('auth.html'); }
    } catch (_) { location.replace('auth.html'); }
  })();

  /* ===================== Helpers ===================== */
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const go = (href) => (window.location.href = href);
  const pad2 = (n) => String(n).padStart(2, '0');
  const escapeHtml = (s='') => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  const dateKey = (d) => d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
  const fromKey = (ymd) => { const p=(ymd||'').split('-'); return new Date(+p[0],(+p[1]||1)-1,+p[2]||1); };
  const startOfWeek = (d, weekStart) => { const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()); const diff=(x.getDay()-weekStart+7)%7; x.setDate(x.getDate()-diff); return x; };
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const addMonths = (d,n) => new Date(d.getFullYear(), d.getMonth()+n, 1);

  const HEB_DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','דצמבר'];

  const weekLabel = (d, weekStart) => {
    const s = startOfWeek(d, weekStart);
    const e = new Date(s); e.setDate(s.getDate()+6);
    const sM = HEB_MONTHS[s.getMonth()], eM = HEB_MONTHS[e.getMonth()];
    return (s.getMonth()===e.getMonth())
      ? `${s.getDate()}–${e.getDate()} ${sM} ${s.getFullYear()}`
      : `${s.getDate()} ${sM} – ${e.getDate()} ${eM} ${s.getFullYear()}`;
  };

  /* ===================== DOM refs ===================== */
  const btnProfile    = $('#btnProfile');
  const btnMenu       = $('#btnMenu');
  const btnCategories = $('#btnCategories');
  const btnSocial     = $('#btnSocial');
  if (btnProfile)    btnProfile.addEventListener('click', () => go('profile.html'));
  if (btnMenu)       btnMenu.addEventListener('click', () => go('settings.html'));
  if (btnCategories) btnCategories.addEventListener('click', () => go('categories.html'));
  if (btnSocial)     btnSocial.addEventListener('click', () => go('social.html'));

  const lemonToggle = $('#lemonToggle');
  const appNav      = $('#appNav');
  const navPanel    = appNav ? appNav.querySelector('.c-nav__panel') : null;

  const titleDay   = $('#titleDay');
  const titleDate  = $('#titleDate');
  const titleBadge = $('#titleBadge');

  const plannerRoot = $('#planner');
  const btnDay   = $('#btnDay');
  const btnWeek  = $('#btnWeek');
  const btnMonth = $('#btnMonth');

  const sheet      = $('#eventSheet');
  const sheetPanel = sheet ? sheet.querySelector('.c-sheet__panel') : null;
  const sheetClose = sheet ? sheet.querySelector('[data-close]') : null;
  const sheetForm  = $('#sheetForm');
  const titleInput = $('#evtTitle');
  const dateInput  = $('#evtDate');
  const timeInput  = $('#evtTime');

  const subtitleEl  = $('.c-subtitle');
  const addEventBtn = $('#addEventBtn');
  const btnExit     = $('#btnExit');

  /* ===================== Greeting ===================== */
  function getAuth() {
    try { const raw = localStorage.getItem('authUser') || localStorage.getItem('auth.user'); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }
  function getProfile() {
    try { return JSON.parse(localStorage.getItem('profile') || '{}'); } catch { return {}; }
  }
  function getDisplayName() {
    const prof = getProfile();
    if (prof.firstName) return prof.firstName;
    if (prof.name) return prof.name;
    const au = getAuth();
    if (au) return au.firstName || au.name || au.displayName || au.email || 'חברה';
    return localStorage.getItem('authName') || 'חברה';
  }
  (function setGreeting(){
    const name = escapeHtml(getDisplayName());
    const au = getAuth();
    const SPECIAL_EMAIL = 'daniellagg21@gmail.com';
    const isSpecial = au && String(au.email||'').toLowerCase()===SPECIAL_EMAIL.toLowerCase();

    if (subtitleEl) {
      subtitleEl.innerHTML = isSpecial
        ? '<div style="font-weight:800;margin-bottom:.15rem">נשמולית שלי</div>'
          + '<div>איזה כיף שחזרת <strong>'+name+'</strong></div>'
          + '<div>לוז מושלם מחכה לך</div>'
        : 'ברוכים השבים, <strong id="uiName">'+name+'</strong>!<br>מה בלוז היום?';
    }
  })();

  /* ===================== State ===================== */
  const STORAGE_KEY = 'plannerTasks';
  const PREFS_KEY   = 'plannerPrefs';
  const loadTasks = () => { try { const raw=localStorage.getItem(STORAGE_KEY); const a=raw?JSON.parse(raw):[]; return Array.isArray(a)?a:[]; } catch { return []; } };
  const saveTasks = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); } catch {} };
  const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch { return {}; } };
  const persistPrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {} };

  const prefs = loadPrefs();
  const weekStart = (prefs.weekStart==='mon') ? 1 : 0;

  let state = { view: (prefs.defaultView || 'week'), current: new Date(), tasks: loadTasks() };

  const formatTitle = (d) => {
    if (titleDay)  titleDay.textContent  = HEB_DAYS[d.getDay()];
    if (titleDate) titleDate.textContent = `${pad2(d.getDate())}.${pad2(d.getMonth()+1)}.${d.getFullYear()}`;
  };
  const markToday = () => { titleBadge && titleBadge.setAttribute('data-today','1'); };

  /* ===================== Lemon nav open/close ===================== */
  (function initNav(){
    if (!lemonToggle || !appNav || !navPanel) return;
    appNav.classList.add('u-is-collapsed');
    lemonToggle.setAttribute('aria-expanded','false');
    appNav.setAttribute('aria-hidden','true');

    function open(){
      appNav.classList.remove('u-is-collapsed');
      appNav.setAttribute('aria-hidden','false');
      lemonToggle.setAttribute('aria-expanded','true');
      navPanel.style.maxHeight = navPanel.scrollHeight+'px';
      navPanel.addEventListener('transitionend', function onEnd(e){
        if (e.propertyName==='max-height'){ navPanel.style.maxHeight=''; navPanel.removeEventListener('transitionend', onEnd); }
      });
    }
    function close(){
      const h = navPanel.scrollHeight;
      navPanel.style.maxHeight = h+'px';
      void navPanel.offsetHeight;
      navPanel.style.maxHeight = '0px';
      lemonToggle.setAttribute('aria-expanded','false');
      appNav.setAttribute('aria-hidden','true');
      appNav.classList.add('u-is-collapsed');
    }
    lemonToggle.addEventListener('click', () => {
      const collapsed = appNav.classList.contains('u-is-collapsed') || appNav.getAttribute('aria-hidden')==='true';
      collapsed ? open() : close();
    });
  })();

  /* ===================== Color scale ===================== */
  function pastelFor(n){
    let b = n<=0 ? 0 : Math.min(6, Math.floor((n-1)/3)+1);
    const tones = [
      { fg:'#475569', ring:'#e5e7eb' }, // 0
      { fg:'#0ea5e9', ring:'#93c5fd' }, // 1
      { fg:'#16a34a', ring:'#86efac' }, // 2
      { fg:'#f59e0b', ring:'#fde68a' }, // 3
      { fg:'#a855f7', ring:'#ddd6fe' }, // 4
      { fg:'#db2777', ring:'#fbcfe8' }, // 5
      { fg:'#1d4ed8', ring:'#bfdbfe' }, // 6
    ];
    return {band:b, ...tones[b]};
  }

  /* ===================== Renderers ===================== */
  function render(){
    formatTitle(state.current); markToday();
    if (!plannerRoot) return;

    btnDay   && btnDay.classList.toggle('is-active', state.view==='day');
    btnWeek  && btnWeek.classList.toggle('is-active', state.view==='week');
    btnMonth && btnMonth.classList.toggle('is-active', state.view==='month');

    if (state.view==='day') renderDay();
    else if (state.view==='week') renderWeek();
    else renderMonth();
  }

  function renderDay(){
    plannerRoot.innerHTML = '';

    // Day nav
    const bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.setAttribute('data-scope','day');
    bar.innerHTML =
      '<button class="p-weekbar__btn" data-daynav="prev" aria-label="יום קודם">‹</button>'+
      `<div class="p-weekbar__title">${HEB_DAYS[state.current.getDay()]} — ${pad2(state.current.getDate())}.${pad2(state.current.getMonth()+1)}.${state.current.getFullYear()}</div>`+
      '<div class="p-weekbar__right">'+
      '<button class="p-weekbar__btn" data-daynav="today">היום</button>'+
      '<button class="p-weekbar__btn" data-daynav="next" aria-label="יום הבא">›</button>'+
      '</div>';
    plannerRoot.appendChild(bar);

    bar.addEventListener('click', (e)=>{
      const b = e.target.closest('[data-daynav]'); if (!b) return;
      const k = b.getAttribute('data-daynav');
      if (k==='prev') state.current.setDate(state.current.getDate()-1);
      else if (k==='next') state.current.setDate(state.current.getDate()+1);
      else state.current = new Date();
      render(); persistPrefs();
    });

    const wrap = document.createElement('div');
    wrap.className = 'p-dayview';

    const ymd = dateKey(state.current);
    const items = state.tasks
      .filter(t => t.date===ymd)
      .sort((a,b)=>(a.time||'').localeCompare(b.time||''));

    if (!items.length){
      const empty = document.createElement('div');
      empty.className = 'p-empty';
      empty.textContent = 'אין אירועים ליום זה.';
      wrap.appendChild(empty);
    } else {
      items.forEach(t=>{
        const row = document.createElement('div');
        row.className = 'p-daytask';
        // ORDER (RTL): X, V, hour, text
        row.innerHTML =
          '<div class="p-daytask__actions">'+
            `<button class="p-ico p-ico--del" title="מחק"  data-del="${t.id}"  aria-label="מחק"></button>`+
            `<button class="p-ico p-ico--ok"  title="בוצע" data-done="${t.id}" aria-label="בוצע"></button>`+
          '</div>'+
          `<div class="p-daytask__time">${t.time||''}</div>`+
          `<div class="p-daytask__text">${escapeHtml(t.title)}</div>`;
        wrap.appendChild(row);
      });
    }
    plannerRoot.appendChild(wrap);
  }

  function renderWeek(){
    plannerRoot.innerHTML = '';
    const bar = document.createElement('div');
    bar.className = 'p-weekbar';
    bar.innerHTML =
      '<button class="p-weekbar__btn" data-weeknav="prev" aria-label="שבוע קודם">‹</button>'+
      `<div class="p-weekbar__title">${weekLabel(state.current, weekStart)}</div>`+
      '<div class="p-weekbar__right">'+
      '<button class="p-weekbar__btn" data-weeknav="today">היום</button>'+
      '<button class="p-weekbar__btn" data-weeknav="next" aria-label="שבוע הבא">›</button>'+
      '</div>';
    plannerRoot.appendChild(bar);

    bar.addEventListener('click', (e)=>{
      const a = e.target.closest('[data-weeknav]'); if (!a) return;
      const k = a.getAttribute('data-weeknav');
      if (k==='prev') state.current.setDate(state.current.getDate()-7);
      else if (k==='next') state.current.setDate(state.current.getDate()+7);
      else state.current = new Date();
      render(); persistPrefs();
    });

    const wrap = document.createElement('div');
    wrap.className = 'p-week';

    const start = startOfWeek(state.current, weekStart);
    for (let i=0;i<7;i++){
      const day = new Date(start); day.setDate(start.getDate()+i);
      const ymd = dateKey(day);

      const count = state.tasks.filter(t=>t.date===ymd).length;
      const tone  = pastelFor(count);

      const box = document.createElement('div');
      box.className = 'p-day'+(sameDay(day,new Date())?' p-day--today':'');
      box.dataset.goto = ymd;

      const head = document.createElement('div');
      head.className = 'p-day__head p-day__head--flex';
      head.innerHTML =
        `<span class="p-day__name">${HEB_DAYS[day.getDay()]}</span>`+
        `<span class="p-day__date">${pad2(day.getDate())}.${pad2(day.getMonth()+1)}</span>`+
        `<button class="p-day__count" data-open="${ymd}" style="--tone:${tone.fg}; color:${tone.fg}">${count}</button>`;
      box.appendChild(head);

      if (state._openWeek===ymd){
        const items = state.tasks.filter(t=>t.date===ymd).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
        const list = document.createElement('div'); list.className='p-day__list';
        if (!items.length){
          list.innerHTML = '<div class="p-empty small">אין אירועים</div>';
        } else {
          items.forEach(t=>{
            const row = document.createElement('div');
            row.className='p-task';
            row.innerHTML =
              '<div class="p-task__actions">'+
                `<button class="p-ico p-ico--del" title="מחק"  data-del="${t.id}"  aria-label="מחק"></button>`+
                `<button class="p-ico p-ico--ok"  title="בוצע" data-done="${t.id}" aria-label="בוצע"></button>`+
              '</div>'+
              `<div class="p-task__time">${t.time||''}</div>`+
              `<div class="p-task__text">${escapeHtml(t.title)}</div>`;
            list.appendChild(row);
          });
        }
        box.appendChild(list);
      }

      wrap.appendChild(box);
    }
    plannerRoot.appendChild(wrap);
  }

  function renderMonth(){
    plannerRoot.innerHTML = '';
    const bar = document.createElement('div');
    bar.className = 'p-monthbar';
    bar.innerHTML =
      '<div class="p-monthbar__left"><button class="p-monthbar__btn" data-monthnav="prev" aria-label="חודש קודם">‹</button></div>'+
      `<div class="p-monthbar__title">${HEB_MONTHS[state.current.getMonth()]} ${state.current.getFullYear()}</div>`+
      '<div class="p-monthbar__right">'+
      '<button class="p-monthbar__btn" data-monthnav="today">היום</button>'+
      '<button class="p-monthbar__btn" data-monthnav="next" aria-label="חודש הבא">›</button>'+
      '</div>';
    plannerRoot.appendChild(bar);

    bar.addEventListener('click', (e)=>{
      const a = e.target.closest('[data-monthnav]'); if (!a) return;
      const k = a.getAttribute('data-monthnav');
      if (k==='prev') state.current = addMonths(startOfMonth(state.current), -1);
      else if (k==='next') state.current = addMonths(startOfMonth(state.current), 1);
      else state.current = new Date();
      render(); persistPrefs();
    });

    const grid = document.createElement('div'); grid.className='p-month';

    const anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    const firstDow = (anchor.getDay()-weekStart+7)%7;
    const start = new Date(anchor); start.setDate(anchor.getDate()-firstDow);

    const now = new Date();
    for (let i=0;i<42;i++){
      const day = new Date(start); day.setDate(start.getDate()+i);
      const ymd = dateKey(day);

      const count = state.tasks.filter(t=>t.date===ymd).length;
      const tone  = pastelFor(count);

      const cell = document.createElement('div');
      let cls = 'p-cell';
      if (day.getMonth()!==state.current.getMonth()) cls += ' p-cell--pad';
      if (sameDay(day, now)) cls += ' p-cell--today';
      cell.className = cls;
      cell.dataset.goto = ymd;

      cell.style.setProperty('--ring-color', tone.fg);

      const num = document.createElement('div');
      num.className = 'p-cell__num';
      num.textContent = day.getDate();

      if (count>0){
        const badge = document.createElement('span');
        badge.className = 'p-count';
        badge.textContent = count;
        badge.style.setProperty('--tone', tone.fg);
        badge.style.color = tone.fg;
        cell.appendChild(badge);
      }

      cell.appendChild(num);
      grid.appendChild(cell);
    }
    plannerRoot.appendChild(grid);

    // swipe months
    let touchX=0, swiping=false;
    grid.addEventListener('touchstart', e=>{ if (e.touches[0]){ touchX=e.touches[0].clientX; swiping=true; } }, {passive:true});
    grid.addEventListener('touchend', e=>{
      if (!swiping) return;
      const dx = (e.changedTouches&&e.changedTouches[0]) ? e.changedTouches[0].clientX-touchX : 0;
      if (Math.abs(dx)>40){ state.current = addMonths(startOfMonth(state.current), dx<0?1:-1); render(); }
      swiping=false;
    }, {passive:true});
  }

  /* ===================== Interactions ===================== */
  btnDay   && btnDay.addEventListener('click',  ()=>{ state.view='day';   render(); prefs.defaultView='day';   persistPrefs(); });
  btnWeek  && btnWeek.addEventListener('click', ()=>{ state.view='week';  render(); prefs.defaultView='week';  persistPrefs(); });
  btnMonth && btnMonth.addEventListener('click',()=>{ state.view='month'; render(); prefs.defaultView='month'; persistPrefs(); });

  if (plannerRoot){
    plannerRoot.addEventListener('click', (e)=>{
      const openBtn = e.target && e.target.closest('[data-open]');
      if (openBtn){
        const dayKey = openBtn.getAttribute('data-open');
        state._openWeek = (state._openWeek===dayKey) ? null : dayKey;
        render(); return;
      }

      const hostGoto = e.target && e.target.closest('[data-goto]');
      if (hostGoto && !e.target.closest('[data-open]')){
        state.current = fromKey(hostGoto.dataset.goto);
        state.view = 'day'; render(); return;
      }

      const doneId = e.target && e.target.getAttribute('data-done');
      const delId  = e.target && e.target.getAttribute('data-del');

      // --- NEW: persist cumulative stats for profile page (loozStats) ---
      function bumpStat(kind){
        try {
          const k = 'loozStats';
          const o = JSON.parse(localStorage.getItem(k) || '{"doneTotal":0,"removedTotal":0}');
          if (kind === 'done')    o.doneTotal    = (o.doneTotal||0) + 1;
          if (kind === 'removed') o.removedTotal = (o.removedTotal||0) + 1;
          localStorage.setItem(k, JSON.stringify(o));
        } catch(_) {}
      }

      if (doneId){
        bumpStat('done');
        blastConfetti(e.clientX||0, e.clientY||0, 1.0);
        state.tasks = state.tasks.filter(t=>t.id!==doneId);
        saveTasks(); render();
      } else if (delId){
        bumpStat('removed');
        const row = e.target.closest('.p-task,.p-daytask');
        if (row){
          row.classList.add('is-scratching');
          setTimeout(()=>{ state.tasks = state.tasks.filter(t=>t.id!==delId); saveTasks(); render(); }, 520);
        } else {
          state.tasks = state.tasks.filter(t=>t.id!==delId); saveTasks(); render();
        }
      }
    });
  }

  /* ===================== Bottom Sheet ===================== */
  function openSheet(){
    if (!sheet) return;
    const now = new Date();
    if (dateInput && !dateInput.value) dateInput.value = dateKey(now);
    if (timeInput && !timeInput.value) timeInput.value = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    sheet.classList.remove('u-hidden'); sheet.classList.add('is-open');
    try { titleInput && titleInput.focus(); } catch {}
  }
  function closeSheet(){ if (!sheet) return; sheet.classList.remove('is-open'); setTimeout(()=>sheet.classList.add('u-hidden'), 220); }

  if (sheet){
    sheetClose && sheetClose.addEventListener('click', e=>{ e.preventDefault(); closeSheet(); });
    sheetPanel && sheetPanel.addEventListener('click', (e)=>{
      const qd = e.target && e.target.closest('.qp__chip[data-date]');
      if (qd){
        e.preventDefault();
        const kind = qd.getAttribute('data-date');
        const base = new Date();
        if (kind==='tomorrow') base.setDate(base.getDate()+1);
        else if (kind==='nextweek') base.setDate(base.getDate()+7);
        else if (/^\+\d+$/.test(kind)) base.setDate(base.getDate()+parseInt(kind.slice(1),10));
        if (dateInput) dateInput.value = dateKey(base);
        return;
      }
      const qt = e.target && e.target.closest('.qp__chip[data-time]');
      if (qt){
        e.preventDefault();
        const k = qt.getAttribute('data-time');
        const now = new Date();
        if (/^now\+\d+$/.test(k)){
          const m = parseInt(k.split('+')[1],10)||0; now.setMinutes(now.getMinutes()+m);
          timeInput && (timeInput.value = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`);
        } else if (/^\d{2}:\d{2}$/.test(k)){
          timeInput && (timeInput.value = k);
        }
      }
    });
    sheet.addEventListener('click', (e)=>{ if (e.target && e.target.matches('.c-sheet__backdrop')) closeSheet(); });
  }
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeSheet(); });

  sheetForm && sheetForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const t = (titleInput && titleInput.value || '').trim();
    const d = (dateInput  && dateInput.value  || '').trim();
    const h = (timeInput  && timeInput.value  || '').trim();
    if (!t || !d || !h) return;
    const id = 't_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
    state.tasks.push({ id, title:t, date:d, time:h });
    saveTasks();
    state.current = fromKey(d); state.view='day';
    render(); sheetForm.reset(); closeSheet();
  });

  /* ===================== Logout ===================== */
  function clearAuthAll(){
    try{
      ['authUser','authName','token','auth.token','auth.user','looz:justLoggedIn','looz:loggedOut']
        .forEach(k=>{ try{localStorage.removeItem(k);}catch{} try{sessionStorage.removeItem(k);}catch{} });
    } catch {}
  }
  function handleLogout(){
    window.__loozLoggingOut = true; clearAuthAll();
    try{ localStorage.setItem('looz:loggedOut','1'); }catch{}
    window.location.replace('auth.html?loggedout=1');
  }

  /* ===================== Effects & INLINE CSS ===================== */
  function blastConfetti(x,y,scale){
    const layer = document.createElement('div'); layer.className='fx-confetti'; document.body.appendChild(layer);
    const N=110;
    for (let i=0;i<N;i++){
      const s=document.createElement('span'); s.className='fx-c'; s.style.left=x+'px'; s.style.top=y+'px';
      s.style.setProperty('--dx', (Math.random()*2-1)*200*scale+'px');
      s.style.setProperty('--dy', (-Math.random()*240)*scale+'px');
      s.style.setProperty('--r',  (Math.random()*720)+'deg');
      s.style.setProperty('--t',  (600+Math.random()*700)+'ms');
      layer.appendChild(s);
    }
    setTimeout(()=>layer.remove(),1600);
  }

  // Replace previous injected styles
  const prev = document.getElementById('looz-fixes-v12'); if (prev) prev.remove();

  const style = document.createElement('style');
  style.id = 'looz-fixes-v12';
  style.textContent = `
  /* --- Week header: name + date (counter centered on day) --- */
  .p-day__head.p-day__head--flex{
    display:grid; grid-template-columns:1fr auto; align-items:center; column-gap:.5rem; padding:0 .5rem;
  }
  .p-day__name{justify-self:start;font-weight:700}
  .p-day__date{justify-self:end;opacity:.9;font-weight:800}

  /* Counter centered in the day box */
  .p-day{ position:relative; }
  .p-day__count{
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:24px; height:24px; border-radius:999px; display:grid; place-items:center;
    font:800 12px/1 'Rubik',system-ui,sans-serif; background:#fff; border:1.5px solid var(--tone,#e5e7eb);
    box-shadow:0 2px 6px rgba(0,0,0,.08);
  }
  html[data-theme="dark"] .p-day__count{background:rgba(13,23,44,.92);}

  /* Week rows */
  .p-task{ display:grid; grid-template-columns:auto auto 1fr; align-items:center; gap:.5rem; }
  .p-task__actions, .p-daytask__actions{ display:flex; gap:.35rem; align-items:center; }
  .p-task__time{ font-weight:700; min-width:3.2rem; text-align:center; }
  .p-task__text{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* Day rows: X, V, hour, text */
  .p-daytask{ display:grid; grid-template-columns:auto auto auto 1fr; align-items:center; gap:.5rem; }
  .p-daytask__time{ font-weight:700; min-width:3.2rem; text-align:center; }
  .p-daytask__text{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* Icon pills */
  .p-ico{
    width:30px; height:30px; border-radius:999px; display:inline-grid; place-items:center; cursor:pointer;
    background:
      radial-gradient(140% 120% at 35% 30%, #fff 0%, rgba(255,255,255,.45) 46%, rgba(255,255,255,0) 70%),
      linear-gradient(180deg,#fff7df,#f2e5bf);
    border:1px solid #e2d4a6;
    box-shadow:0 2px 6px rgba(0,0,0,.08), inset 0 0 .4rem rgba(255,255,255,.75);
  }
  .p-ico:active{ transform:translateY(1px); }
  .p-ico--ok::before,
  .p-ico--del::before{
    content:""; display:block; width:18px; height:18px; background:transparent;
    -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
    -webkit-mask-position:center; mask-position:center;
    -webkit-mask-size:contain; mask-size:contain;
  }
  /* ✓ */
  .p-ico--ok::before{
    background:#0f7b4b;
    -webkit-mask-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.8 13.6 3.9 9.8l-1.4 1.4 5.3 5.2L18 6.2l-1.4-1.4z" fill="%23000"/></svg>');
            mask-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.8 13.6 3.9 9.8l-1.4 1.4 5.3 5.2L18 6.2l-1.4-1.4z" fill="%23000"/></svg>');
  }
  /* ❌ — stroke with width so it actually shows */
  .p-ico--del::before{
    background:#b3261e;
    -webkit-mask-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5L15 15M15 5L5 15" stroke="%23000" stroke-width="2.6" stroke-linecap="round"/></svg>');
            mask-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5L15 15M15 5L5 15" stroke="%23000" stroke-width="2.6" stroke-linecap="round"/></svg>');
  }

  /* Month grid */
  .p-month{display:grid;grid-template-columns:repeat(7,1fr);gap:.7rem}
  .p-cell{
    position:relative; aspect-ratio:1/1; border-radius:16px; background:#fff;
    box-shadow: inset 0 0 0 2px var(--ring-color, #e5e7eb), 0 8px 16px rgba(15,23,42,.06);
    display:grid; place-items:center; cursor:pointer;
  }
  .p-cell--pad{background:#f8fafc; opacity:.9}
  .p-cell__num{ font-weight:900; font-size:1.15rem; color:#0f172a; position:relative; z-index:1; }
  .p-cell--today{ --ring-color:#e8c65c; }
  .p-cell--today .p-cell__num{ color:#0f172a; }

  /* Month counter badge */
  .p-count{
    position:absolute; top:-9px; left:50%; transform:translateX(-50%);
    min-width:18px; height:18px; padding:0 6px; border-radius:999px;
    display:grid; place-items:center; font:800 10px/1 'Rubik',system-ui,sans-serif;
    background:#fff; border:2px solid var(--tone, #94a3b8); z-index:2;
    box-shadow:0 2px 6px rgba(0,0,0,.08);
  }

  /* Day-only nav arrows */
  .p-weekbar[data-scope="day"] .p-weekbar__btn[data-daynav="prev"],
  .p-weekbar[data-scope="day"] .p-weekbar__btn[data-daynav="next"]{
    width:36px; height:36px; padding:0;
    border-radius:999px; border:1px solid #e5e7eb; background:#fff;
    display:grid; place-items:center; font-size:18px; font-weight:800; line-height:1;
  }

  /* Bottom actions & Confetti */
  .c-bottom-cta{ position:sticky; bottom:max(12px, env(safe-area-inset-bottom)); display:grid; justify-items:center; gap:.55rem; }
  .looz-bottom-stack{ display:grid; gap:.55rem; justify-items:center; }
  .c-fab{ width:60px; height:60px; border-radius:999px; display:grid; place-items:center;
          background:radial-gradient(140% 120% at 35% 30%, #fff 0, rgba(255,255,255,.35) 45%, rgba(255,255,255,0) 70%),
                     linear-gradient(180deg,#fff4d0,#ffd08a);
          border:1px solid rgba(0,0,0,.06); box-shadow:inset 0 0 .45rem rgba(255,255,255,.75),0 .35rem 1rem rgba(0,0,0,.14);}
  .c-fab svg{ width:28px; height:28px; }
  #btnExit.c-topbtn{ inline-size:2.4rem; height:2.4rem; border-radius:50%; display:grid; place-items:center; }

  /* Confetti */
  .fx-confetti{position:fixed;inset:0;pointer-events:none;z-index:9999}
  .fx-c{position:absolute;width:9px;height:9px;background:hsl(calc(360*var(--h,.5)),90%,60%);transform:translate(-50%,-50%);border-radius:2px;animation:confThrow var(--t) ease-out forwards}
  .fx-c:nth-child(4n){--h:.1}.fx-c:nth-child(4n+1){--h:.22}.fx-c:nth-child(4n+2){--h:.62}.fx-c:nth-child(4n+3){--h:.82}
  @keyframes confThrow{to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--r));opacity:0}}

  /* Dark mode tweaks */
  html[data-theme="dark"] .p-day__count{background:rgba(13,23,44,.92);}
  html[data-theme="dark"] .p-cell{ background:#0f1b32; box-shadow: inset 0 0 0 2px var(--ring-color,#2a4674); }
  html[data-theme="dark"] .p-cell__num{ color:#eaf2ff; }
  html[data-theme="dark"] .p-cell--today .p-cell__num{ color:#eed27b; }
  html[data-theme="dark"] .p-count{ background:rgba(13,23,44,.92); color:#cbd5e1; border-color:#334155; }
  `;
  document.head.appendChild(style);

  /* ===================== Bottom buttons (icons & layout) ===================== */
  (function pinBottom(){
    const ctaWrap = document.querySelector('.c-bottom-cta');
    if (!ctaWrap || !addEventBtn || !btnExit) return;

    ctaWrap.innerHTML = '<div class="looz-bottom-stack"></div>';
    const host = ctaWrap.firstElementChild;

    // Create Event
    addEventBtn.className = 'c-fab';
    addEventBtn.setAttribute('aria-label','יצירת אירוע חדש');
    addEventBtn.innerHTML = `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="papScroll" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff6d6"/><stop offset="100%" stop-color="#f0d6a8"/></linearGradient>
          <linearGradient id="inkPlus" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient>
        </defs>
        <rect x="12" y="10" width="24" height="28" rx="6" ry="6" fill="url(#papScroll)" stroke="#c9aa6b"/>
        <circle cx="35" cy="14" r="6" fill="url(#inkPlus)"/>
        <path d="M35 11v6M32 14h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    addEventBtn.onclick = (e)=>{ e.preventDefault(); openSheet(); };

    // Logout
    btnExit.className = 'c-topbtn';
    btnExit.setAttribute('aria-label','התנתקות');
    btnExit.innerHTML = `
      <svg viewBox="0 0 28 28" width="18" height="18" aria-hidden="true">
        <defs>
          <linearGradient id="exDoor2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#F4D27A"/><stop offset="100%" stop-color="#C8A043"/>
          </linearGradient>
          <linearGradient id="exArrow2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#22D3EE"/><stop offset="100%" stop-color="#60A5FA"/>
          </linearGradient>
        </defs>
        <rect x="4" y="6" width="10" height="16" rx="2" fill="url(#exDoor2)" stroke="#9A7A2E"/>
        <circle cx="11" cy="14" r="1" fill="#7C5B13"/>
        <path d="M14 14h8m0 0-3-3m3 3-3 3" fill="none" stroke="url(#exArrow2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    btnExit.onclick = (e)=>{ e.preventDefault(); handleLogout(); };

    host.appendChild(addEventBtn);
    host.appendChild(btnExit);
  })();

  /* ===================== Login Intro (kept) ===================== */
  (function intro() {
    const lemonBtn = document.getElementById('lemonToggle');
    if (!lemonBtn) return;

    try {
      if (localStorage.getItem('looz:justLoggedIn') !== '1') return;
      localStorage.removeItem('looz:justLoggedIn');
    } catch {}

    const screen = document.createElement('div');
    screen.className = 'intro-screen';
    const wrap = document.createElement('div'); wrap.className = 'intro-wrap';
    wrap.innerHTML = `
      <svg class="intro-lemon" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <radialGradient id="introLem" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#FFF8C6"/><stop offset="50%" stop-color="#FFE36E"/><stop offset="100%" stop-color="#F7C843"/>
          </radialGradient>
          <linearGradient id="introSweepG" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stop-color="rgba(0,229,255,0)"/><stop offset=".28" stop-color="rgba(0,229,255,.30)"/>
            <stop offset=".54" stop-color="rgba(255,215,102,.70)"/><stop offset=".78" stop-color="rgba(136,167,255,.40)"/>
            <stop offset="1" stop-color="rgba(0,229,255,0)"/>
          </linearGradient>
          <radialGradient id="introGlintG" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="rgba(255,248,198,.98)"/><stop offset="70%" stop-color="rgba(255,214,100,.45)"/>
            <stop offset="100%" stop-color="rgba(255,214,100,0)"/>
          </radialGradient>
          <clipPath id="introClip"><path d="M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6"/></clipPath>
        </defs>
        <g>
          <path d="M19 7c-3-3-8-3-11 0-2 2.3-2 6 0 8 2.2 2.1 5.8 2.4 8 0 2.2-2.1 2.6-5.4 1-7.6" fill="url(#introLem)" stroke="#C59A21" stroke-width="1.1"/>
          <path d="M18 6c.9-.9 1.7-1.8 2.3-2.8" stroke="#6FA14D" stroke-linecap="round" stroke-width="1.2"/>
        </g>
        <g clip-path="url(#introClip)"><rect class="intro-sweep" x="0" y="0" width="100%" height="140%" fill="url(#introSweepG)"/><circle class="intro-glint" cx="12" cy="22" r="3.6" fill="url(#introGlintG)"/></g>
      </svg>`;
    screen.appendChild(wrap);
    document.body.appendChild(screen);

    requestAnimationFrame(() => { wrap.classList.add('is-in'); });

    setTimeout(() => {
      const r = lemonBtn.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      const dx = (r.left + r.width/2) - (w.left + w.width/2);
      const dy = (r.top + r.height/2) - (w.top + w.height/2);
      const scale = (r.width / w.width) * 1.0;
      screen.classList.add('is-fly');
      wrap.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
      wrap.style.opacity = '0.0';
      setTimeout(() => { screen.remove(); }, 900);
    }, 3000);

    if (!document.getElementById('intro-style')) {
      const s2 = document.createElement('style'); s2.id = 'intro-style';
      s2.textContent = `
        .intro-screen{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;pointer-events:none;background:#fff;}
        html[data-theme="dark"] .intro-screen{background:#0b1529;}
        .intro-wrap{opacity:0;transform:scale(.85);filter:blur(18px);transition:opacity 900ms cubic-bezier(.16,1,.3,1),transform 900ms cubic-bezier(.16,1,.3,1),filter 900ms;}
        .intro-wrap.is-in{opacity:1;transform:scale(1);filter:blur(0);}
        .intro-lemon{display:block;width:clamp(120px,34vw,180px);filter:drop-shadow(0 20px 42px rgba(6,12,26,.35));}
        .intro-sweep{transform:translateY(80%);opacity:.7;animation:introSweep 1600ms cubic-bezier(.16,1,.3,1) 450ms forwards;}
        .intro-glint{transform: translateY(78%) scale(.9);opacity:0;animation:introGlint 1300ms cubic-bezier(.16,1,.3,1) 600ms forwards;}
        @keyframes introSweep{0%{transform:translateY(80%);opacity:.65;}70%{transform:translateY(-6%);opacity:.95;}100%{transform:translateY(-16%);opacity:0;}}
        @keyframes introGlint{0%{opacity:0;transform: translateY(78%) scale(.9);}55%{opacity:.95;}100%{opacity:0;transform: translateY(-10%) scale(1.06);}}
        .intro-screen.is-fly .intro-wrap{transition:transform 800ms cubic-bezier(.4,0,.2,1), opacity 800ms;}
      `;
      document.head.appendChild(s2);
    }
  })();

  /* ===================== Initial ===================== */
  const _today = new Date();
  state.current = _today;
  formatTitle(_today);
  render();

})();

/* --- AUTH GUARD (skip on auth page) --- */
(function () {
  try {
    if (/auth\.html(?:$|\?)/.test(location.pathname)) return;
    var u = localStorage.getItem('authUser') || localStorage.getItem('auth.user');
    if (!u) location.replace('auth.html');
  } catch (_) {
    location.replace('auth.html');
  }
})();
