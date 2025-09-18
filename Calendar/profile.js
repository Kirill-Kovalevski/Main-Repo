(function(){
  'use strict';

  const back = document.getElementById('pBack');
  if (back) back.addEventListener('click', function(){ window.history.length>1 ? history.back() : window.location.href='index.html'; });

  // Prefill name from storage (same logic as app)
  const nameNode = document.getElementById('pName');
  const fullInput = document.getElementById('fFullName');
  let name = 'דניאלה';
  try {
    const au = localStorage.getItem('authUser');
    if (au) {
      const p = JSON.parse(au);
      if (p && typeof p==='object') {
        if (p.name) name = p.name;
        else if (p.displayName) name = p.displayName;
        else if (p.firstName) name = p.firstName;
      }
    } else {
      const alt = localStorage.getItem('authName');
      if (alt) name = alt;
    }
  } catch(e) {}
  if (nameNode) nameNode.textContent = name;
  if (fullInput) fullInput.value = name;

  // Theme chips (demo only)
  const themes = document.getElementById('themeChips');
  if (themes) {
    themes.addEventListener('click', function(e){
      const chip = e.target && e.target.closest('.chip');
      if (!chip) return;
      themes.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      // store theme selection
      localStorage.setItem('loozTheme', chip.dataset.theme || 'light');
    });
  }

  // Save button persists simple fields
  const saveBtn = document.getElementById('pSave');
  if (saveBtn) {
    saveBtn.addEventListener('click', function(){
      const email = (document.getElementById('fEmail') || {}).value || '';
      const phone = (document.getElementById('fPhone') || {}).value || '';
      const next = { name: (fullInput && fullInput.value) || name, email:email, phone:phone };
      localStorage.setItem('profile', JSON.stringify(next));
      alert('נשמר בהצלחה!');
    });
  }

  const logoutBtn = document.getElementById('pLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(){
      try {
        localStorage.removeItem('authUser'); localStorage.removeItem('token'); localStorage.removeItem('authName');
      } catch(e) {}
      window.location.href = 'index.html';
    });
  }
})();
