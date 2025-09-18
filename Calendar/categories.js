(function(){
  'use strict';
  const back = document.getElementById('cBack');
  if (back) back.addEventListener('click', function(){ window.history.length>1 ? history.back() : window.location.href='index.html'; });

  const chosen = {}; // key -> chip text

  document.querySelectorAll('.chips').forEach(function(group){
    group.addEventListener('click', function(e){
      const chip = e.target && e.target.closest('.chip');
      if (!chip) return;
      [...group.querySelectorAll('.chip')].forEach(function(c){ c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      const key = group.getAttribute('data-key');
      chosen[key] = chip.textContent.trim();
    });
  });

  // Quick templates -> draft
  document.querySelector('.card--templates').addEventListener('click', function(e){
    const tpl = e.target && e.target.closest('.tpl');
    if (!tpl) return;
    const t = tpl.getAttribute('data-title');
    const tm = tpl.getAttribute('data-time');
    const today = new Date();
    const ymd = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
    localStorage.setItem('draftEvent', JSON.stringify({ title: t, time: tm, date: ymd }));
    window.location.href = 'index.html';
  });

  // Build simple title from chips
  const apply = document.getElementById('cApply');
  if (apply){
    apply.addEventListener('click', function(){
      const parts = [];
      if (chosen.mood) parts.push(chosen.mood);
      if (chosen.timeofday) parts.push(chosen.timeofday);
      if (chosen.people) parts.push(chosen.people);
      if (chosen.place) parts.push(chosen.place);
      if (chosen.season) parts.push(chosen.season);
      if (chosen.country) parts.push(chosen.country);
      const title = parts.length ? parts.join(' · ') : 'פעילות';
      const today = new Date();
      const ymd = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
      const t = '12:00';
      localStorage.setItem('draftEvent', JSON.stringify({ title: title, time: t, date: ymd }));
      window.location.href = 'index.html';
    });
  }
})();
