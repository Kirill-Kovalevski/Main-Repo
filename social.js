(function(){
  'use strict';

  const POSTS_KEY = 'socialPosts';

  function loadPosts(){
    try { const raw = localStorage.getItem(POSTS_KEY); const arr=raw?JSON.parse(raw):[]; return Array.isArray(arr)?arr:[]; }
    catch(e){ return []; }
  }
  function savePosts(arr){
    try { localStorage.setItem(POSTS_KEY, JSON.stringify(arr)); } catch(e){}
  }
  function uid(){ return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function qs(name){
    const m = new RegExp('[?&]'+name+'=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : '';
  }
  function escape(s){ return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

  const sBack = document.getElementById('sBack');
  if (sBack) sBack.addEventListener('click', ()=>{ window.history.length>1?history.back():location.href='index.html'; });

  const pTitle = document.getElementById('pTitle');
  const pDesc  = document.getElementById('pDesc');
  const pTags  = document.getElementById('pTags');
  const pTime  = document.getElementById('pTime');
  const pPost  = document.getElementById('pPost');
  const sFeed  = document.getElementById('sFeed');

  function render(){
    const posts = loadPosts().slice().reverse(); // newest first
    if (!posts.length){
      sFeed.innerHTML = '<div class="card"><div class="card__desc">עדיין אין פוסטים. שתף רעיון לפעילות 👇</div></div>';
      return;
    }
    sFeed.innerHTML = posts.map(p=>`
      <article class="card" id="${p.id}" data-id="${p.id}">
        <h3 class="card__title">${escape(p.title)}</h3>
        <p class="card__desc">${escape(p.desc||'')}</p>
        <div class="card__tags">
          ${(p.tags||[]).map(t=>`<span class="tag">${escape(t)}</span>`).join('')}
          ${p.time?`<span class="tag">⏰ ${escape(p.time)}</span>`:''}
          ${p.user&&p.user.handle?`<span class="tag">מאת ${escape(p.user.handle)}</span>`:''}
        </div>
        <div class="card__actions">
          <button class="btn" data-use="${p.id}">הוסף לי</button>
          <button class="btn" data-del="${p.id}">מחק</button>
        </div>
      </article>
    `).join('');
  }

  if (pPost){
    pPost.addEventListener('click', ()=>{
      const title = (pTitle.value||'').trim();
      const desc  = (pDesc.value||'').trim();
      const time  = (pTime.value||'').trim() || '12:00';
      const tags  = (pTags.value||'').split(',').map(s=>s.trim()).filter(Boolean);
      if (!title){ pTitle.focus(); return; }

      // crude "current user"
      let user = null;
      try {
        const au = localStorage.getItem('authUser');
        if (au) {
          const parsed = JSON.parse(au);
          const handle = parsed && parsed.username ? '@'+parsed.username : '@me';
          user = { id:(parsed && parsed.id)||'u_me', name:(parsed && parsed.name)||'אני', handle };
        }
      } catch(e){}
      if (!user) user = { id:'u_me', name:'אני', handle:'@me' };

      const posts = loadPosts();
      posts.push({ id: uid(), title, desc, time, tags, user });
      savePosts(posts);
      pTitle.value=''; pDesc.value=''; pTags.value=''; pTime.value='12:00';
      render();
    });
  }

  sFeed.addEventListener('click', (e)=>{
    const use = e.target.closest('[data-use]');
    const del = e.target.closest('[data-del]');
    if (use){
      const id = use.getAttribute('data-use');
      const posts = loadPosts();
      const p = posts.find(x=>x.id===id);
      if (p){
        const today = new Date();
        const ymd = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
        localStorage.setItem('draftEvent', JSON.stringify({ title: p.title, time: p.time||'12:00', date: ymd }));
        location.href = 'index.html';
      }
    }
    if (del){
      const id = del.getAttribute('data-del');
      let posts = loadPosts();
      posts = posts.filter(x=>x.id!==id);
      savePosts(posts);
      render();
    }
  });

  // If came from "Contact" with ?to=@handle — prefill composer
  (function maybePrefillTo(){
    const to = qs('to');
    if (!to) return;
    pDesc.value = 'פניה אל ' + to + ': ';
    pDesc.focus();
  })();

  render();
})();
