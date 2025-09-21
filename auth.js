// LooZ auth: tabs, eyes, and simple local auth
(function(){
  'use strict';

  // Tabs
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

  // Password eye
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-eye]');
    if (!btn) return;
    var id = btn.getAttribute('data-eye');
    var input = document.getElementById(id);
    if (!input) return;
    input.type = (input.type === 'password') ? 'text' : 'password';
  });

  // Helpers
  function okEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ''); }

  // LOGIN
  var loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (document.getElementById('loginEmail')||{}).value || '';
      var pass  = (document.getElementById('loginPassword')||{}).value || '';
      if (!okEmail(email) || pass.length < 1){
        (document.getElementById('loginEmailErr')||{}).textContent = okEmail(email)? '' : 'אימייל לא תקין';
        (document.getElementById('loginPasswordErr')||{}).textContent = pass ? '' : 'נדרש סיסמה';
        return;
      }
      var user = { id: Date.now(), email: email, name: email.split('@')[0] };
      try{
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.removeItem('looz:loggedOut');
        localStorage.setItem('looz:justLoggedIn','1');
      }catch(_){}
      window.location.replace('/index.html');
    });
  }

  // REGISTER
  var regForm = document.getElementById('registerForm');
  if (regForm){
    regForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (document.getElementById('regName')||{}).value || '';
      var email = (document.getElementById('regEmail')||{}).value || '';
      var pass  = (document.getElementById('regPassword')||{}).value || '';
      var conf  = (document.getElementById('regConfirm')||{}).value || '';
      var terms = (document.getElementById('regTerms')||{}).checked;

      var ok = true;
      if (!name) { (document.getElementById('regNameErr')||{}).textContent = 'נדרש שם'; ok = false; }
      else (document.getElementById('regNameErr')||{}).textContent = '';
      if (!okEmail(email)){ (document.getElementById('regEmailErr')||{}).textContent = 'אימייל לא תקין'; ok = false; }
      else (document.getElementById('regEmailErr')||{}).textContent = '';
      if (pass.length < 8 || !/\d/.test(pass)){ (document.getElementById('regPasswordErr')||{}).textContent = 'לפחות 8 תווים ומספר'; ok = false; }
      else (document.getElementById('regPasswordErr')||{}).textContent = '';
      if (conf !== pass){ (document.getElementById('regConfirmErr')||{}).textContent = 'לא תואם'; ok = false; }
      else (document.getElementById('regConfirmErr')||{}).textContent = '';
      if (!terms){ ok = false; }

      if (!ok) return;

      var user = { id: Date.now(), email: email, name: name };
      try{
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.removeItem('looz:loggedOut');
        localStorage.setItem('looz:justLoggedIn','1');
      }catch(_){}
      window.location.replace('/index.html');
    });
  }
})();
