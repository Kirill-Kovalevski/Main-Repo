
(function () {
  'use strict';

  // ---------- helpers ----------
  function okEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim()); }
  function appUrl(file){
    var b = document.querySelector('base');
    if (b && b.href) return new URL(file, b.href).href;
    if (/github\.io$/.test(location.hostname)) {
      var seg = location.pathname.split('/').filter(Boolean)[0] || '';
      return '/' + (seg ? seg + '/' : '') + file;
    }
    return file;
  }
  function go(file){ location.assign(appUrl(file)); }

  // password rule: ≥10 chars, at least 1 letter, 1 digit, 1 symbol
  function strongPass(p){
    p = String(p||'');
    return p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);
  }

  // ---------- tabs ----------
  var tLogin = document.getElementById('tab-login');
  var tReg   = document.getElementById('tab-register');
  var pLogin = document.getElementById('panel-login');
  var pReg   = document.getElementById('panel-register');

  function show(which){
    var loginOn = which === 'login';
    tLogin.classList.toggle('is-active', loginOn);
    tReg.classList.toggle('is-active', !loginOn);
    pLogin.classList.toggle('is-active', loginOn);
    pReg.classList.toggle('is-active', !loginOn);
    pReg.toggleAttribute('hidden', loginOn);
    pLogin.toggleAttribute('hidden', !loginOn);
  }
  if (tLogin) tLogin.addEventListener('click', function(){ show('login'); });
  if (tReg)   tReg.addEventListener('click',   function(){ show('reg');   });

  // ---------- password eye ----------
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-eye]');
    if (!btn) return;
    var input = document.getElementById(btn.getAttribute('data-eye'));
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });

  // ---------- LOGIN ----------
  var loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = ((document.getElementById('loginEmail')||{}).value||'').trim().toLowerCase();
      var pass  = (document.getElementById('loginPassword')||{}).value || '';

      (document.getElementById('loginEmailErr')||{}).textContent = okEmail(email)? '' : 'אימייל לא תקין';
      (document.getElementById('loginPasswordErr')||{}).textContent = pass ? '' : 'נדרש סיסמה';
      if (!okEmail(email) || !pass) return;

      var user = { id: Date.now(), email: email, name: email.split('@')[0] };
      try{
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.removeItem('looz:loggedOut');
        localStorage.setItem('looz:justLoggedIn','1');
      }catch(_){}
      go('index.html');
    });
  }

  // ---------- REGISTER ----------
  var regForm = document.getElementById('registerForm');
  if (regForm){
    regForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (document.getElementById('regName')||{}).value || '';
      var email = ((document.getElementById('regEmail')||{}).value||'').trim().toLowerCase();
      var pass  = (document.getElementById('regPassword')||{}).value || '';
      var conf  = (document.getElementById('regConfirm')||{}).value || '';
      var terms = (document.getElementById('regTerms')||{}).checked;

      var ok = true;
      (document.getElementById('regNameErr')||{}).textContent     = name ? '' : (ok=false,'נדרש שם');
      (document.getElementById('regEmailErr')||{}).textContent    = okEmail(email) ? '' : (ok=false,'אימייל לא תקין');
      (document.getElementById('regPasswordErr')||{}).textContent = strongPass(pass) ? '' : (ok=false,'לפחות 10 תווים, אות, מספר וסימן');
      (document.getElementById('regConfirmErr')||{}).textContent  = (conf===pass) ? '' : (ok=false,'לא תואם');
      if (!terms) ok=false;
      if (!ok) return;

      var user = { id: Date.now(), email: email, name: name };
      try{
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.removeItem('looz:loggedOut');
        localStorage.setItem('looz:justLoggedIn','1');
      }catch(_){}
      go('index.html');
    });
  }
})();

