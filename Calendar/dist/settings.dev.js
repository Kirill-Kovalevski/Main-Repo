"use strict";

(function () {
  'use strict';

  var back = document.getElementById('sBack');
  if (back) back.addEventListener('click', function () {
    window.history.length > 1 ? history.back() : window.location.href = 'index.html';
  });
  var save = document.getElementById('sSave');

  if (save) {
    save.addEventListener('click', function () {
      var cfg = {
        defaultView: (document.getElementById('setDefaultView') || {}).value || 'day',
        weekStart: (document.getElementById('setWeekStart') || {}).value || 'sun',
        timeFmt: (document.getElementById('setTimeFmt') || {}).value || '24',
        dark: !!(document.getElementById('setDark') || {}).checked,
        anim: !!(document.getElementById('setAnim') || {}).checked,
        notify: !!(document.getElementById('setNotify') || {}).checked,
        reminder: (document.getElementById('setReminder') || {}).value || '15 ד׳',
        sounds: !!(document.getElementById('setSounds') || {}).checked,
        lang: (document.getElementById('setLang') || {}).value || 'עברית'
      };
      localStorage.setItem('loozSettings', JSON.stringify(cfg));
      alert('נשמר!');
    });
  }

  var exportBtn = document.getElementById('btnExport');
  if (exportBtn) exportBtn.addEventListener('click', function () {
    var data = localStorage.getItem('plannerTasks') || '[]';
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
    a.download = 'looz-tasks.json';
    a.click();
  });
  var importBtn = document.getElementById('btnImport');
  if (importBtn) importBtn.addEventListener('click', function () {
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';

    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var r = new FileReader();

      r.onload = function () {
        try {
          localStorage.setItem('plannerTasks', r.result);
          alert('יובא בהצלחה');
        } catch (e) {
          alert('שגיאה בייבוא');
        }
      };

      r.readAsText(f);
    };

    inp.click();
  });
  var resetBtn = document.getElementById('btnReset');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    if (confirm('לאפס את כל ההגדרות והאירועים?')) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  });
})();