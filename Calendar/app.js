(function () {
  'use strict';

  /* ===== DOM refs ===== */
  const lemonToggle   = document.getElementById('lemonToggle');
  const appNav        = document.getElementById('appNav');
  const navPanel      = document.getElementById('navPanel');

  const navSearch     = document.getElementById('navSearch');
  const searchClear   = document.getElementById('searchClear');
  const searchGo      = document.getElementById('searchGo');

  const sugWrap       = document.getElementById('sugWrap');
  const sugList       = document.getElementById('sugList');

  const srOverlay     = document.getElementById('srOverlay');
  const srClose       = document.getElementById('srClose');
  const srX           = document.getElementById('srX');
  const srList        = document.getElementById('srList');

  const btnSocial     = document.getElementById('btnSocial');
  const btnProfile    = document.getElementById('btnProfile');
  const btnMenu       = document.getElementById('btnMenu');
  const btnCategories = document.getElementById('btnCategories');

  const addEventBtn   = document.getElementById('addEventBtn');
  const sheet         = document.getElementById('eventSheet');
  const sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  const sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  const sheetPanel    = sheet ? sheet.querySelector('.c-sheet__panel') : null;

  const sheetForm  = document.getElementById('sheetForm');
  const titleInput = document.getElementById('evtTitle');
  const dateInput  = document.getElementById('evtDate');
  const timeInput  = document.getElementById('evtTime');

  const plannerRoot = document.getElementById('planner');
  const btnDay   = document.getElementById('btnDay');
  const btnWeek  = document.getElementById('btnWeek');
  const btnMonth = document.getElementById('btnMonth');

  const titleDay   = document.getElementById('titleDay');
  const titleDate  = document.getElementById('titleDate');
  const titleBadge = document.getElementById('titleBadge');
  const uiName     = document.getElementById('uiName');

  const contactSheet   = document.getElementById('contactSheet');
  const contactWho     = document.getElementById('contactWho');
  const contactMsg     = document.getElementById('contactMsg');
  const contactProfile = document.getElementById('contactProfile');
  const contactCopy    = document.getElementById('contactCopy');

  /* ===== Helpers ===== */
  function pad2(n){ return String(n).padStart(2,'0'); }
  function escapeHtml(s){ if (s==null) return ''; const m={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}; return String(s).replace(/[&<>"']/g, c=>m[c]); }
  function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function formatDateHeb(d){ return pad2(d.getDate())+'.'+pad2(d.getMonth()+1)+'.'+d.getFullYear(); }
  function dateKeyLocal(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
  function parseYMD(s){ const p=s.split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
  function startOfWeek(d){ const t=new Date(d.getFullYear(),d.getMonth(),d.getDate()); const dow=t.getDay(); t.setDate(t.getDate()-dow); return t; }
  function todayYMD(){ const t=new Date(); return dateKeyLocal(t); }
  function debounce(fn, ms){ let id=0; return function(){ const args=arguments; clearTimeout(id); id=setTimeout(()=>fn.apply(this,args),ms); }; }

  const HEB_DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

  function updateHeaderDate(d){
    const idx = d.getDay();
    if (titleDay)  titleDay.textContent  = HEB_DAYS[idx];
    if (titleDate) titleDate.textContent = formatDateHeb(d);
    if (titleBadge) titleBadge.classList.add('is-highlight');
  }

  /* ===== Name ===== */
  (function setHelloName(){
    try {
      let name = null;
      const au = localStorage.getItem('authUser');
      if (au) {
        const parsed = JSON.parse(au);
        if (parsed && typeof parsed === 'object') {
          if (parsed.name) name = parsed.name;
          else if (parsed.displayName) name = parsed.displayName;
          else if (parsed.firstName) name = parsed.firstName;
        }
      }
      if (!name) {
        const alt = localStorage.getItem('authName');
        if (alt) name = alt;
      }
      if (uiName) uiName.textContent = (name && String(name).trim()) || 'דניאלה';
    } catch(e) { if (uiName) uiName.textContent = 'דניאלה'; }
  })();

  /* ===== NAV open/close (in-flow; expands for suggestions) ===== */
  (function initNav() {
    if (!lemonToggle || !appNav || !navPanel) return;
    function openNav() {
      appNav.classList.remove('u-is-collapsed');
      appNav.setAttribute('aria-hidden', 'false');
      lemonToggle.setAttribute('aria-expanded', 'true');
      navPanel.style.maxHeight = navPanel.scrollHeight + 'px';
      navPanel.addEventListener('transitionend', function onEnd(e){
        if (e.propertyName==='max-height'){ navPanel.style.maxHeight=''; navPanel.removeEventListener('transitionend', onEnd); }
      });
      navPanel.style.overflow = 'visible';
    }
    function closeNav() {
      const h = navPanel.scrollHeight;
      navPanel.style.maxHeight = h + 'px';
      void navPanel.offsetHeight;
      appNav.classList.add('u-is-collapsed');
      appNav.setAttribute('aria-hidden', 'true');
      lemonToggle.setAttribute('aria-expanded', 'false');
      navPanel.style.maxHeight = '0';
      navPanel.style.overflow = 'hidden';
      hideSuggestions();
    }
    function isOpen(){ return !appNav.classList.contains('u-is-collapsed'); }
    lemonToggle.addEventListener('click', function(){ isOpen()?closeNav():openNav(); });
    if (navSearch) navSearch.addEventListener('focus', ()=>{ if (!isOpen()) openNav(); renderSuggestions(navSearch.value); });
  })();

  /* ===== Routes ===== */
  if (btnSocial)     btnSocial.addEventListener('click',  () => { window.location.href = 'social.html'; });
  if (btnProfile)    btnProfile.addEventListener('click', () => { window.location.href = 'profile.html'; });
  if (btnMenu)       btnMenu.addEventListener('click',    () => { window.location.href = 'settings.html'; });
  if (btnCategories) btnCategories.addEventListener('click', () => { window.location.href = 'categories.html'; });

  /* ===== Planner storage ===== */
  const STORAGE_KEY = 'plannerTasks';
  const state = { view:'day', current:new Date(), tasks: loadTasks() };

  function loadTasks() {
    try { const raw = localStorage.getItem(STORAGE_KEY); const arr = raw?JSON.parse(raw):[]; return Array.isArray(arr)?arr:[]; }
    catch(e){ return []; }
  }
  function saveTasks(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); }

  /* ===== Social posts ===== */
  const POSTS_KEY = 'socialPosts';
  function seedPostsIfEmpty(){
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      if (raw) return;
      const seed = [
        {id:'p1', title:'הליכת בוקר בטיילת', desc:'30 דקות עם קפה ומוזיקה רגועה', tags:['בוקר','הליכה','חוץ'], time:'08:00', user:{id:'u_dani', name:'דני', handle:'@dani'}},
        {id:'p2', title:'ריצה קלה בפארק',    desc:'5 ק״מ קצב נעים',               tags:['ספורט','בריאות','חוץ'],  time:'07:00', user:{id:'u_lia',  name:'ליה',  handle:'@lia'}},
        {id:'p3', title:'שעת למידה בספרייה', desc:'התמקדות בשקט מוחלט',          tags:['למידה','פוקוס','פנים'],  time:'20:00', user:{id:'u_noa',  name:'נועה', handle:'@noa'}},
        {id:'p4', title:'קפה עם חבר/ה',      desc:'Catch-up נעים לשעה',           tags:['חברתי','פנאי','קפה'],    time:'10:30', user:{id:'u_ron',  name:'רון',  handle:'@ron'}},
        {id:'p5', title:'שקיעה וחול ים',     desc:'נשימות עמוקות, בלי טלפון',     tags:['מיינדפולנס','ים','שקיעה'], time:'18:30', user:{id:'u_gal',  name:'גל',   handle:'@gal'}},
        {id:'p6', title:'שעת יצירה עם ילדים',desc:'פלסטלינה וצבעי גואש',         tags:['משפחה','יצירה','בית'],   time:'17:00', user:{id:'u_maya', name:'מאיה', handle:'@maya'}},
        {id:'p7', title:'מדיטציה קצרה',      desc:'10 דקות לפני השינה',           tags:['שקט','בריאות','לילה'],   time:'22:00', user:{id:'u_shai', name:'שי',   handle:'@shai'}},
        {id:'p8', title:'שחמט בשדרה',        desc:'דו-קרב ידידותי בשבת',          tags:['משחק','חוץ','חברתי'],    time:'12:00', user:{id:'u_avi',  name:'אבי',  handle:'@avi'}}
      ];
      localStorage.setItem(POSTS_KEY, JSON.stringify(seed));
    } catch(e){}
  }
  function loadPosts(){
    seedPostsIfEmpty();
    try { const raw = localStorage.getItem(POSTS_KEY); const arr = raw?JSON.parse(raw):[]; return Array.isArray(arr)?arr:[]; }
    catch(e){ return []; }
  }
  function normalize(s){ return (s||'').toString().toLowerCase(); }
  function scorePost(post, q){
    const t = normalize(post.title);
    const d = normalize(post.desc);
    const tags = (post.tags||[]).map(normalize).join(' ');
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;
    let score = 0;
    for (let i=0;i<terms.length;i++){
      const term = terms[i];
      if (t.includes(term))   score += 5;
      if (tags.includes(term))score += 3;
      if (d.includes(term))   score += 1;
      if (t.startsWith(term)) score += 2;
    }
    return score;
  }
  function searchPosts(q){
    const posts = loadPosts();
    if (!q.trim()) return [];
    return posts.map(p=>({p, s:scorePost(p,q)}))
                .filter(x=>x.s>0)
                .sort((a,b)=>b.s-a.s)
                .map(x=>x.p);
  }

  /* ===== Suggestions engine ===== */
  function showSuggestions(){
    if (!sugWrap) return;
    sugWrap.classList.remove('u-hidden');
    sugWrap.classList.add('is-open');
    // ensure panel grows while suggestions open
    if (navPanel && !appNav.classList.contains('u-is-collapsed')) {
      // let it auto-grow
      navPanel.style.maxHeight = '';
      navPanel.style.overflow = 'visible';
    }
  }
  function hideSuggestions(){
    if (!sugWrap) return;
    sugWrap.classList.add('u-hidden');
    sugWrap.classList.remove('is-open');
  }
  function renderSuggestions(q){
    if (!sugList) return;
    const posts = loadPosts();
    let list = [];
    if (!q.trim()){
      list = posts.slice(0,6);            // trending
    } else {
      list = searchPosts(q).slice(0,6);   // filtered
    }
    const html = [];
    if (!list.length){
      html.push('<div class="sug-item"><div class="sug-title">לא נמצאו הצעות…</div></div>');
    } else {
      for (let i=0;i<list.length;i++){
        const p = list[i];
        html.push(
          `<div class="sug-item" role="option">
            <div>
              <h5 class="sug-title">${escapeHtml(p.title)}</h5>
              <div class="sug-row">
                ${(p.tags||[]).map(t=>`<span class="sug-tag">${escapeHtml(t)}</span>`).join('')}
                ${p.time?`<span class="sug-tag">⏰ ${p.time}</span>`:''}
                ${p.user&&p.user.handle?`<span class="sug-tag">מאת ${escapeHtml(p.user.handle)}</span>`:''}
              </div>
            </div>
            <div class="sug-actions">
              <button class="sug-btn" data-contact="${p.id}">צור קשר</button>
              <button class="sug-btn sug-btn--primary" data-use="${p.id}">הוסף</button>
            </div>
          </div>`
        );
      }
    }
    const allCount = q.trim() ? searchPosts(q).length : posts.length;
    const more = `<div class="sug-more"><button class="sug-more__btn" data-go-all="1">הצג הכל (${allCount})</button></div>`;
    sugList.innerHTML = html.join('') + more;
    showSuggestions();
  }

  // IME-friendly typing
  let isComposing = false;
  if (navSearch){
    navSearch.addEventListener('compositionstart', ()=>{ isComposing = true; });
    navSearch.addEventListener('compositionend',  ()=>{ isComposing = false; renderSuggestions(navSearch.value); });

    const debounced = debounce(function(){
      if (!isComposing) renderSuggestions(navSearch.value);
    }, 120);

    navSearch.addEventListener('input', debounced);
    navSearch.addEventListener('focus', ()=>renderSuggestions(navSearch.value));
    navSearch.addEventListener('keydown', function(e){
      if (e.key==='Escape'){ hideSuggestions(); }
      if (e.key==='Enter'){ openFullResults(navSearch.value); hideSuggestions(); }
    });
  }
  if (searchGo){
    searchGo.addEventListener('click', function(){
      const q = navSearch ? navSearch.value : '';
      openFullResults(q); hideSuggestions();
    });
  }
  if (searchClear){
    searchClear.addEventListener('click', function(){
      if (navSearch) navSearch.value=''; renderSuggestions('');
      navSearch && navSearch.focus();
    });
  }
  if (sugList){
    sugList.addEventListener('click', function(e){
      const useBtn = e.target.closest('[data-use]');
      const ctBtn  = e.target.closest('[data-contact]');
      const allBtn = e.target.closest('[data-go-all]');
      if (useBtn){ usePost(useBtn.getAttribute('data-use')); }
      if (ctBtn){  contactFor(ctBtn.getAttribute('data-contact')); }
      if (allBtn){ openFullResults(navSearch ? navSearch.value : ''); hideSuggestions(); }
    });
  }
  document.addEventListener('click', function(e){
    if (!sugWrap || sugWrap.classList.contains('u-hidden')) return;
    const inside = e.target.closest('.c-search');
    if (!inside) hideSuggestions();
  });

  /* ===== Full results overlay ===== */
  function openResults(){ srOverlay.classList.remove('u-hidden'); srOverlay.setAttribute('aria-hidden','false'); }
  function closeResults(){ srOverlay.classList.add('u-hidden');  srOverlay.setAttribute('aria-hidden','true'); srList.innerHTML=''; }
  function renderResults(q){
    const list = searchPosts(q);
    const html = [];
    if (!list.length){
      html.push('<div class="sr-card"><div class="sr-sub">לא נמצאו פעילויות מתאימות…</div></div>');
    } else {
      for (let i=0;i<list.length;i++){
        const p = list[i];
        html.push(
          `<article class="sr-card" data-id="${p.id}">
            <h4 class="sr-title">${escapeHtml(p.title)}</h4>
            <p class="sr-sub">${escapeHtml(p.desc||'')}</p>
            <div class="sr-meta">
              ${(p.tags||[]).map(t=>`<span class="sr-tag">${escapeHtml(t)}</span>`).join('')}
              ${p.time?`<span class="sr-tag">⏰ ${p.time}</span>`:''}
              ${p.user&&p.user.handle?`<span class="sr-tag">מאת ${escapeHtml(p.user.handle)}</span>`:''}
            </div>
            <div class="sr-actions">
              <button class="sr-btn" data-contact="${p.id}">צור קשר</button>
              <button class="sr-btn sr-btn--primary" data-use="${p.id}">הוסף</button>
            </div>
          </article>`
        );
      }
    }
    srList.innerHTML = html.join('');
  }
  function openFullResults(q){ renderResults(q||''); openResults(); }
  if (srClose) srClose.addEventListener('click', closeResults);
  if (srX)     srX.addEventListener('click', closeResults);
  if (srList){
    srList.addEventListener('click', function(e){
      const useBtn = e.target.closest('[data-use]');
      const ctBtn  = e.target.closest('[data-contact]');
      if (useBtn){ usePost(useBtn.getAttribute('data-use')); }
      if (ctBtn){  contactFor(ctBtn.getAttribute('data-contact')); }
    });
  }

  /* ===== Use / Contact ===== */
  function usePost(id){
    const p = loadPosts().find(x=>x.id===id);
    if (!p) return;
    if (titleInput) titleInput.value = p.title || '';
    if (dateInput)  dateInput.value  = todayYMD();
    if (timeInput)  timeInput.value  = p.time || '12:00';
    closeResults(); hideSuggestions(); openSheet();
  }

  let contactPayload = null;
  function contactFor(id){
    const p = loadPosts().find(x=>x.id===id);
    if (!p || !p.user) return;
    contactPayload = p.user;
    if (contactWho) contactWho.textContent = p.user.name + ' ' + (p.user.handle||'');
    openContactSheet();
  }
  function openContactSheet(){ contactSheet.classList.remove('u-hidden'); contactSheet.classList.add('is-open'); }
  function closeContactSheet(){ contactSheet.classList.remove('is-open'); setTimeout(()=>contactSheet.classList.add('u-hidden'),220); }
  if (contactSheet){ contactSheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeContactSheet(); }); }
  if (contactMsg){ contactMsg.addEventListener('click', ()=>{ if (contactPayload) window.location.href = 'social.html?to=' + encodeURIComponent(contactPayload.handle||''); }); }
  if (contactProfile){ contactProfile.addEventListener('click', ()=>{ if (contactPayload) window.location.href = 'profile.html?u=' + encodeURIComponent(contactPayload.id||'user'); }); }
  if (contactCopy){ contactCopy.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(contactPayload && contactPayload.handle || ''); contactCopy.textContent='הועתק ✓'; setTimeout(()=>contactCopy.textContent='העתק משתמש',900); }catch(e){} }); }

  /* ===== Planner (abridged; unchanged rendering) ===== */
  function render(){
    if (!plannerRoot) return;
    updateHeaderDate(state.current);
    if (state.view==='day') renderDay();
    else if (state.view==='week') renderWeek();
    else if (state.view==='month') renderMonth();
    else renderYear();
    if (btnDay && btnWeek && btnMonth){
      btnDay.classList.toggle('is-active',   state.view==='day');
      btnWeek.classList.toggle('is-active',  state.view==='week');
      btnMonth.classList.toggle('is-active', state.view==='month' || state.view==='year');
    }
  }

  function renderDay(){
    const root = plannerRoot; root.innerHTML='';
    const wrap = document.createElement('div'); wrap.className='p-dayview';
    const h = document.createElement('div'); h.className='p-dayview__head';
    const idx = state.current.getDay();
    h.innerHTML = '<div class="p-dayview__title">'+HEB_DAYS[idx]+'</div><div class="p-dayview__date">'+formatDateHeb(state.current)+'</div>';
    wrap.appendChild(h);

    const ymd = dateKeyLocal(state.current);
    const items = state.tasks.filter(t=>t.date===ymd).sort((a,b)=>a.time.localeCompare(b.time));
    if (!items.length){
      const empty = document.createElement('div'); empty.className='p-empty'; empty.textContent='אין אירועים ליום זה.'; wrap.appendChild(empty);
    } else {
      for (let i=0;i<items.length;i++){
        const t = items[i];
        const row = document.createElement('div'); row.className='p-daytask'; row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-daytask__text">'+escapeHtml(t.title)+'</div><div class="p-daytask__time">'+t.time+'</div>'+
                        '<div class="p-daytask__actions"><button class="p-daytask__btn" data-done="'+t.id+'">בוצע</button><button class="p-daytask__btn" data-del="'+t.id+'">מחק</button></div>';
        wrap.appendChild(row);
      }
    }
    root.appendChild(wrap);
  }

  function renderWeek(){
    const root = plannerRoot; root.innerHTML='';
    const wrap = document.createElement('div'); wrap.className='p-week';
    const start = startOfWeek(state.current);
    const todayKey = dateKeyLocal(new Date());

    for (let i=0;i<7;i++){
      const day = new Date(start); day.setDate(start.getDate()+i);
      const ymd = dateKeyLocal(day);
      const box = document.createElement('div');
      box.className='p-day'+(ymd===todayKey?' p-day--today':''); box.setAttribute('data-goto', ymd);
      const head = document.createElement('div'); head.className='p-day__head';
      const count = state.tasks.filter(t=>t.date===ymd).length;
      head.innerHTML = '<span class="p-day__name">'+HEB_DAYS[i]+'</span><span class="p-day__date">'+pad2(day.getDate())+'.'+pad2(day.getMonth()+1)+'</span><span class="p-day__count">'+count+'</span>';
      box.appendChild(head);

      const dayTasks = state.tasks.filter(t=>t.date===ymd).sort((a,b)=>a.time.localeCompare(b.time));
      for (let k=0;k<dayTasks.length;k++){
        const t = dayTasks[k];
        const row = document.createElement('div'); row.className='p-task'; row.setAttribute('data-task-id', t.id);
        row.innerHTML = '<div class="p-task__text">'+escapeHtml(t.title)+'</div><div class="p-task__time">'+t.time+'</div>'+
                        '<div class="p-task__actions"><button class="p-task__btn" data-done="'+t.id+'">בוצע</button><button class="p-task__btn" data-del="'+t.id+'">מחק</button></div>';
        box.appendChild(row);
      }
      wrap.appendChild(box);
    }
    root.appendChild(wrap);
  }

  function renderMonth(){
    const root = plannerRoot; root.innerHTML='';
    const wrap = document.createElement('div'); wrap.className='p-monthwrap';

    const bar = document.createElement('div'); bar.className='p-monthbar';
    const left = document.createElement('div'); left.className='p-monthbar__left';
    const title = document.createElement('div'); title.className='p-monthbar__title';
    const right = document.createElement('div'); right.className='p-monthbar__right';
    title.textContent = HEB_MONTHS[state.current.getMonth()]+' '+state.current.getFullYear();

    const yearSelect = document.createElement('select'); yearSelect.className='p-yearselect';
    const yearNow = state.current.getFullYear();
    for (let y = yearNow-5; y <= yearNow+5; y++){
      const opt = document.createElement('option'); opt.value = String(y); opt.textContent = String(y);
      if (y===yearNow) opt.selected = true;
      yearSelect.appendChild(opt);
    }
    right.appendChild(yearSelect);

    const chips = document.createElement('div'); chips.className='p-monthbar__chips';
    for (let m=0; m<12; m++){
      const chip = document.createElement('button');
      chip.type='button'; chip.className='p-chip'+(m===state.current.getMonth()?' is-selected':'');
      chip.textContent = HEB_MONTHS[m]; chip.dataset.month = String(m);
      chips.appendChild(chip);
    }
    left.appendChild(chips);

    bar.appendChild(left); bar.appendChild(title); bar.appendChild(right);
    wrap.appendChild(bar);

    const grid = document.createElement('div'); grid.className='p-month';

    const anchor = new Date(state.current.getFullYear(), state.current.getMonth(), 1);
    const firstDow = anchor.getDay();
    const start = new Date(anchor); start.setDate(anchor.getDate()-firstDow);

    const curKey   = dateKeyLocal(state.current);
    const todayKey = dateKeyLocal(new Date());
    const thisMonth = state.current.getMonth();

    for (let i=0;i<42;i++){
      const day = new Date(start); day.setDate(start.getDate()+i);
      const ymd = dateKeyLocal(day);

      const cell = document.createElement('div');
      let cls = 'p-cell';
      if (day.getMonth() !== thisMonth) cls += ' p-cell--pad';
      if (ymd === todayKey) cls += ' p-cell--today';
      if (ymd === curKey)   cls += ' p-cell--selected';
      cell.className = cls; cell.setAttribute('data-goto', ymd);

      const num = document.createElement('div'); num.className = 'p-cell__num'; num.textContent = day.getDate();
      cell.appendChild(num);

      grid.appendChild(cell);
    }

    wrap.appendChild(grid);
    plannerRoot.appendChild(wrap);

    chips.addEventListener('click', function(e){
      const btn = e.target && e.target.closest('.p-chip'); if (!btn) return;
      const m = parseInt(btn.dataset.month,10);
      const d = new Date(state.current); d.setMonth(m); d.setDate(1);
      state.current = d; state.view = 'month'; render();
    });
    yearSelect.addEventListener('change', function(){
      const y = parseInt(yearSelect.value,10);
      const d = new Date(state.current); d.setFullYear(y); d.setDate(1);
      state.current = d; state.view = 'month'; render();
    });

    addVerticalSwipe(grid, function(dir){
      const d = new Date(state.current);
      if (dir==='down') d.setMonth(d.getMonth()+1);
      else              d.setMonth(d.getMonth()-1);
      d.setDate(1);
      state.current = d;
      render();
    });
  }

  function renderYear(){
    const root = plannerRoot; root.innerHTML='';
    const wrap = document.createElement('div'); wrap.className='p-monthwrap';

    const bar = document.createElement('div'); bar.className='p-monthbar';
    const title = document.createElement('div'); title.className='p-monthbar__title';
    title.textContent = state.current.getFullYear();
    bar.appendChild(document.createElement('div')); bar.appendChild(title); bar.appendChild(document.createElement('div'));
    wrap.appendChild(bar);

    const yearGrid = document.createElement('div'); yearGrid.className='p-year';
    for (let m=0; m<12; m++){
      const box = document.createElement('div'); box.className='p-year__month';
      box.innerHTML = '<h4 class="p-year__title">'+HEB_MONTHS[m]+'</h4>';
      const g = document.createElement('div'); g.className='p-year__grid';

      const first = new Date(state.current.getFullYear(), m, 1);
      const dow = first.getDay();
      const start = new Date(first); start.setDate(first.getDate()-dow);

      for (let i=0;i<42;i++){
        const d = new Date(start); d.setDate(start.getDate()+i);
        const cell = document.createElement('div'); cell.className='p-year__cell';
        if (d.getMonth()!==m) cell.classList.add('p-year__cell--pad');
        cell.textContent = d.getDate();
        cell.setAttribute('data-goto', dateKeyLocal(d));
        g.appendChild(cell);
      }

      box.appendChild(g);
      yearGrid.appendChild(box);
    }
    wrap.appendChild(yearGrid);
    root.appendChild(wrap);
  }

  /* ===== Interactions ===== */
  if (plannerRoot) {
    plannerRoot.addEventListener('click', function(e){
      const gotoEl = e.target && e.target.closest ? e.target.closest('[data-goto]') : null;
      if (gotoEl && gotoEl.getAttribute) {
        const ymd = gotoEl.getAttribute('data-goto');
        if (ymd) { state.current = parseYMD(ymd); state.view = 'day'; render(); return; }
      }
      const t = e.target;
      if (t.dataset && t.dataset.done){
        confettiAtEl(t);
        state.tasks = state.tasks.filter(x=>x.id!==t.dataset.done);
        saveTasks(); render();
      }
      if (t.dataset && t.dataset.del){
        state.tasks = state.tasks.filter(x=>x.id!==t.dataset.del);
        saveTasks(); render();
      }
    });
  }
  if (btnDay)   btnDay.addEventListener('click',  ()=>{ state.view='day';   render(); });
  if (btnWeek)  btnWeek.addEventListener('click', ()=>{ state.view='week';  render(); });
  if (btnMonth) btnMonth.addEventListener('click',()=>{ state.view='month'; render(); });

  /* ===== Sheet open/close + quick picks ===== */
  function openSheet(){ if (!sheet) return; sheet.classList.remove('u-hidden'); sheet.classList.add('is-open'); try{ titleInput&&titleInput.focus(); }catch(e){} }
  function closeSheet(){ if (!sheet) return; sheet.classList.remove('is-open'); setTimeout(()=>sheet.classList.add('u-hidden'),220); }
  if (addEventBtn) addEventBtn.addEventListener('click', e=>{ e.preventDefault(); openSheet(); });
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  if (sheetPanel) sheetPanel.addEventListener('click', e=>e.stopPropagation());

  (function initQuickPicks(){
    const qp = document.querySelector('.qp'); if (!qp) return;
    qp.addEventListener('click', function(e){
      const chip = e.target && e.target.closest('.qp__chip'); if (!chip) return;
      if (chip.dataset.date){
        const today = new Date(); let target = new Date(today);
        if (chip.dataset.date==='tomorrow') target.setDate(today.getDate()+1);
        else if (chip.dataset.date==='nextweek') target.setDate(today.getDate()+7);
        else if (chip.dataset.date.startsWith('+')) target.setDate(today.getDate()+parseInt(chip.dataset.date.replace('+',''),10));
        const v = target.getFullYear()+'-'+pad2(target.getMonth()+1)+'-'+pad2(target.getDate());
        if (dateInput) dateInput.value = v;
      }
      if (chip.dataset.time){
        if (chip.dataset.time.indexOf('now+')===0){
          const addMin = parseInt(chip.dataset.time.split('+')[1],10) || 0;
          const now = new Date(); now.setMinutes(now.getMinutes()+addMin);
          const v = pad2(now.getHours())+':'+pad2(now.getMinutes());
          if (timeInput) timeInput.value = v;
        } else { if (timeInput) timeInput.value = chip.dataset.time; }
      }
    });
  })();

  if (sheetForm) {
    sheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const t = titleInput && titleInput.value ? titleInput.value.trim() : '';
      const d = dateInput  && dateInput.value  ? dateInput.value.trim()  : '';
      const h = timeInput  && timeInput.value  ? timeInput.value.trim()  : '';
      if (!t || !d || !h) return;

      const id = 't_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
      state.tasks.push({ id:id, title:t, date:d, time:h }); saveTasks();
      sheetForm.reset(); closeSheet();
      state.current = parseYMD(d); state.view = 'day'; render();
      const targetEl  = document.querySelector('[data-task-id="'+id+'"]');
      flyFromTo(addEventBtn, targetEl, t);
    });
  }

  /* ===== Confetti + fly chip ===== */
  function confettiAtEl(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const originX = r.left + r.width / 2 + window.scrollX;
    const originY = r.top  + r.height / 2 + window.scrollY;
    const colors = ['#3B82F6','#60A5FA','#A78BFA','#F59E0B','#F472B6','#34D399','#F87171'];
    const COUNT=44, MIN_DIST=60, MAX_DIST=160, DURATION=1200;
    for (let i=0;i<COUNT;i++){
      const p=document.createElement('span'); p.className='c-confetti';
      Object.assign(p.style,{position:'absolute',left:originX+'px',top:originY+'px',width:(6+Math.random()*10)+'px',height:(6+Math.random()*10)+'px',
        borderRadius:'2px',background:colors[i%colors.length],pointerEvents:'none',zIndex:10000,opacity:'1'});
      document.body.appendChild(p);
      (function(node){
        const angle=Math.random()*Math.PI*2;
        const dist=MIN_DIST+Math.random()*(MAX_DIST-MIN_DIST);
        const tx=Math.cos(angle)*dist, ty=Math.sin(angle)*dist*(0.75+Math.random()*0.5);
        const rot=(Math.random()*720-360); let start=null;
        function step(ts){ if(!start) start=ts; const t=Math.min(1,(ts-start)/DURATION), ease=t*(2-t);
          node.style.transform='translate('+(tx*ease)+'px,'+(ty*ease)+'px) rotate('+(rot*ease)+'deg) scale('+(1-0.2*ease)+')';
          node.style.opacity=String(1-ease); if(t<1) requestAnimationFrame(step); else node.remove(); }
        requestAnimationFrame(step);
      })(p);
    }
  }
  function flyFromTo(fromEl, toEl, label){
    if (!fromEl || !toEl) return;
    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();
    const chip = document.createElement('div'); chip.className='fly-chip';
    chip.textContent = label.length>18 ? label.slice(0,16)+'…' : label; document.body.appendChild(chip);
    const sx = fr.left + fr.width/2, sy = fr.top + fr.height/2;
    const ex = tr.left + tr.width/2, ey = tr.top + tr.height/2;
    chip.style.left = sx+'px'; chip.style.top = sy+'px';
    const DURATION = 700; let start = null;
    function step(ts){ if(!start) start=ts; const t=Math.min(1,(ts-start)/DURATION), e=t*(2-t);
      const cx = sx + (ex - sx) * e; const cy = sy - (1 - (2*Math.abs(.5-e))) * 90 + (ey - sy) * e;
      chip.style.left = cx+'px'; chip.style.top = cy+'px'; chip.style.opacity = String(1 - t*0.2);
      if (t<1) requestAnimationFrame(step); else chip.remove(); }
    requestAnimationFrame(step);
  }

  /* ===== Swipe util ===== */
  function addVerticalSwipe(node, cb){
    if (!node || !cb) return;
    let startY = 0, startX = 0, t0 = 0;
    node.addEventListener('touchstart', function(e){
      const t = e.changedTouches[0]; startY = t.clientY; startX = t.clientX; t0 = Date.now();
    }, {passive:true});
    node.addEventListener('touchend', function(e){
      const t = e.changedTouches[0]; const dy = t.clientY - startY; const dx = Math.abs(t.clientX - startX); const dt = Date.now() - t0;
      if (Math.abs(dy) > 40 && dx < 60 && dt < 800){ cb(dy>0 ? 'down' : 'up'); }
    });
  }

  /* ===== Prefill from categories / social ===== */
  (function prefillDraft(){
    try {
      const raw = localStorage.getItem('draftEvent'); if (!raw) return;
      const d = JSON.parse(raw); localStorage.removeItem('draftEvent');
      if (titleInput && d.title) titleInput.value = d.title;
      if (dateInput  && d.date)  dateInput.value  = d.date;
      if (timeInput  && d.time)  timeInput.value  = d.time;
      openSheet();
    } catch(e){}
  })();

  /* ===== Initial render ===== */
  state.current = new Date(); state.view = 'day'; render();

})();
