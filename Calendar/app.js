// Calendar/app.js
(() => {
  // ============ DOM REFS ============
  const lemonToggle      = document.getElementById('lemonToggle');
  const appNav           = document.getElementById('appNav');

  const titleDate        = document.querySelector('.c-title--date');

  const taskList         = document.getElementById('taskList');       // <ul>
  const completedList    = document.getElementById('completedList');  // <ul>
  const completedToggle  = document.getElementById('completedToggle'); // "בוצע" button
  const completedSection = document.getElementById('completedSection');

  const addEventBtn      = document.getElementById('addEventBtn');
  const sheet            = document.getElementById('eventSheet');
  const sheetBackdrop    = sheet ? sheet.querySelector('[data-close]') : null;
  const sheetCloseBtn    = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;
  const sheetForm        = document.getElementById('sheetForm');

  const titleInput       = document.getElementById('evtTitle');
  const dateInput        = document.getElementById('evtDate');
  const timeInput        = document.getElementById('evtTime');
  const peopleBtn        = document.getElementById('addPeopleBtn');
  const peopleHint       = document.getElementById('peopleHint');

  // ============ SMALL STATE ============
  let peopleCount = 0;

  // ============ HELPERS ============
  function show(el) { if (el) el.classList.remove('u-hidden'); }
  function hide(el) { if (el) el.classList.add('u-hidden'); }

  function openSheet() {
    if (!sheet) return;
    show(sheet);
    sheet.setAttribute('aria-hidden', 'false');

    const panel = sheet.querySelector('.c-sheet__panel');
    if (panel) {
      panel.animate(
        [{ transform: 'translateY(20px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
        { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
    const bd = sheet.querySelector('.c-sheet__backdrop');
    if (bd) {
      bd.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'linear' });
    }
    if (titleInput) titleInput.focus();
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.setAttribute('aria-hidden', 'true');

    const panel = sheet.querySelector('.c-sheet__panel');
    const bd = sheet.querySelector('.c-sheet__backdrop');

    let done = 0;
    const maybeHide = () => { done += 1; if (done >= 2) hide(sheet); };

    if (panel) {
      panel.animate(
        [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(20px)', opacity: 0 }],
        { duration: 180, easing: 'cubic-bezier(.2,.7,.2,1)' }
      ).finished.then(maybeHide);
    } else {
      maybeHide();
    }

    if (bd) {
      bd.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'linear' })
        .finished.then(maybeHide);
    } else {
      maybeHide();
    }
  }

  // Big, visible confetti burst from an element
  function confettiAtEl(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const originX = r.left + r.width / 2 + window.scrollX;
    const originY = r.top  + r.height / 2 + window.scrollY;

    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#B8C0FF','#F896D8'];
    const COUNT = 48;
    const MIN = 80, MAX = 200, DURATION = 1200;

    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement('span');
      s.className = 'c-confetti';
      s.style.left = originX + 'px';
      s.style.top  = originY + 'px';
      s.style.width = s.style.height = (6 + Math.random() * 6) + 'px';
      s.style.background = colors[i % colors.length];
      document.body.appendChild(s);

      const angle = Math.random() * Math.PI * 2;
      const dist  = MIN + Math.random() * (MAX - MIN);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      s.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(0.6)', opacity: 0 }
        ],
        { duration: DURATION, easing: 'cubic-bezier(.2,.7,.2,1)' }
      ).finished.then(() => s.remove());
    }
  }

  // Build an ACTIVE row (minus → text → checkbox)
  function makeActiveItem(text) {
    const li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = [
      '<button class="c-item__remove" type="button" aria-label="הסר">−</button>',
      '<label class="c-item__label">',
      '  <span class="c-item__text"></span>',
      '  <input class="c-item__check" type="checkbox" />',
      '</label>'
    ].join('');
    const span = li.querySelector('.c-item__text');
    if (span) span.textContent = text;
    return li;
  }

  // Build a COMPLETED row (minus → text → phantom)
  function makeCompletedItem(text) {
    const li = document.createElement('li');
    li.className = 'c-item c-item--done';
    li.innerHTML = [
      '<button class="c-item__remove" type="button" aria-label="הסר">−</button>',
      '<span class="c-item__text"></span>',
      '<span class="c-item__phantom" aria-hidden="true"></span>'
    ].join('');
    const span = li.querySelector('.c-item__text');
    if (span) span.textContent = text;
    return li;
  }

  function ensureCompletedVisible() {
    if (!completedSection) return;
    completedSection.classList.remove('u-hidden');
  }

  // ============ NAV (LEMON) ============

  function toggleNav() {
    if (!appNav) return;
    const collapsed = appNav.classList.contains('u-is-collapsed');
    appNav.classList.toggle('u-is-collapsed');

    // gently shift the date up/down to make room
    if (titleDate) {
      const moveDown = collapsed; // we are opening → move down
      titleDate.animate(
        moveDown
          ? [{ transform: 'translateY(0)' }, { transform: 'translateY(10px)' }]
          : [{ transform: 'translateY(10px)' }, { transform: 'translateY(0)' }],
        { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
      );
    }
  }

  if (lemonToggle) {
    lemonToggle.addEventListener('click', toggleNav);
  }

  // ============ COMPLETED toggle ============
  if (completedToggle && completedList) {
    completedToggle.addEventListener('click', () => {
      const isHidden = completedList.classList.contains('u-hidden');
      completedList.classList.toggle('u-hidden');

      // Elegant little expand/collapse animation
      completedList.animate(
        isHidden
          ? [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }]
          : [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }],
        { duration: 200, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );

      completedToggle.setAttribute('aria-expanded', String(isHidden));
    });
  }

  // ============ TASKS: remove / complete ============
  if (taskList) {
    // remove (minus)
    taskList.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.classList.contains('c-item__remove')) return;
      const li = t.closest('.c-item');
      if (li) li.remove();
    });

    // complete (checkbox)
    taskList.addEventListener('change', (e) => {
      const t = e.target;
      if (!t || !t.classList.contains('c-item__check')) return;

      const li   = t.closest('.c-item');
      if (!li) return;
      const span = li.querySelector('.c-item__text');
      const text = span ? (span.textContent || '').trim() : '';

      // strike + fade + confetti
      li.classList.add('is-completing');
      confettiAtEl(t);

      li.addEventListener('animationend', function onEnd() {
        li.removeEventListener('animationend', onEnd);
        // remove from tasks
        li.remove();
        // add to completed
        ensureCompletedVisible();
        if (completedList) completedList.appendChild(makeCompletedItem(text));
      }, { once: true });
    });
  }

  // Completed list: allow removing too
  if (completedList) {
    completedList.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.classList.contains('c-item__remove')) return;
      const li = t.closest('.c-item');
      if (li) li.remove();
    });
  }

  // ============ BOTTOM SHEET ============

  if (addEventBtn) {
    addEventBtn.addEventListener('click', openSheet);
  }
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', closeSheet);
  }
  if (sheetCloseBtn) {
    sheetCloseBtn.addEventListener('click', closeSheet);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  // Add participants (tiny demo counter)
  if (peopleBtn && peopleHint) {
    peopleBtn.addEventListener('click', () => {
      peopleCount += 1;
      peopleHint.textContent = peopleCount + ' משתתפים';
    });
  }

  // Submit new event
  if (sheetForm && taskList) {
    sheetForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = (titleInput && titleInput.value || '').trim();
      const date  = (dateInput && dateInput.value || '').trim();
      const time  = (timeInput && timeInput.value || '').trim();
      if (!title || !date || !time) return;

      const dt = new Date(date);
      const dd = String(dt.getDate()).padStart(2,'0');
      const mm = String(dt.getMonth()+1).padStart(2,'0');
      const yy = String(dt.getFullYear()).slice(-2);

      const label = title + ' ' + time + ' (' + dd + '/' + mm + '/' + yy + ')';
      taskList.appendChild(makeActiveItem(label));

      sheetForm.reset();
      peopleCount = 0;
      if (peopleHint) peopleHint.textContent = '—';
      closeSheet();
    });
  }
})();
// Calendar/app.js
document.addEventListener('DOMContentLoaded', () => {
  // ----- Nav (lemon) + date slide -----
  const lemonToggle = document.getElementById('lemonToggle');
  const appNav      = document.getElementById('appNav');
  const header      = document.querySelector('.o-header'); // for a tiny date shift

  function toggleNav() {
    if (!appNav) return;
    const isCollapsed = appNav.classList.toggle('u-is-collapsed');
    // When nav opens, nudge the date down a bit; when it closes, bring it back up
    if (header) header.classList.toggle('is-nav-open', !isCollapsed);
  }
  if (lemonToggle) lemonToggle.addEventListener('click', toggleNav);

  // ----- Bottom sheet controls -----
  const addEventBtn   = document.getElementById('addEventBtn');
  const sheet         = document.getElementById('eventSheet');
  const sheetBackdrop = sheet ? sheet.querySelector('[data-close]') : null;
  const sheetCloseBtn = sheet ? sheet.querySelector('.c-icon-btn--ghost[data-close]') : null;

  const sheetForm   = document.getElementById('sheetForm');
  const titleInput  = document.getElementById('evtTitle');
  const dateInput   = document.getElementById('evtDate');
  const timeInput   = document.getElementById('evtTime');

  function openSheet()  { if (sheet) { sheet.classList.remove('u-hidden'); if (titleInput) titleInput.focus(); } }
  function closeSheet() { if (sheet) sheet.classList.add('u-hidden'); }

  if (addEventBtn)   addEventBtn.addEventListener('click', openSheet);
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  // ----- Add new task from sheet -----
  const taskList = document.getElementById('taskList');

  function makeTaskItem(text) {
    const li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = `
      <button class="c-item__remove" type="button" aria-label="הסר">−</button>
      <label class="c-item__label">
        <span class="c-item__text"></span>
        <input class="c-item__check" type="checkbox" />
      </label>
    `;
    li.querySelector('.c-item__text').textContent = text;
    return li;
  }

  if (sheetForm) {
    sheetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = titleInput ? titleInput.value.trim() : '';
      const d = dateInput  ? dateInput.value.trim()  : '';
      const h = timeInput  ? timeInput.value.trim()  : '';
      if (!t || !d || !h || !taskList) return;

      // Format label: "כותרת HH:MM (DD/MM/YY)"
      const dt = new Date(d);
      const dd = String(dt.getDate()).padStart(2, '0');
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const yy = String(dt.getFullYear()).slice(-2);
      const label = `${t} ${h} (${dd}/${mm}/${yy})`;

      taskList.appendChild(makeTaskItem(label));
      sheetForm.reset();
      closeSheet();
    });
  }

  // ----- Remove / complete handlers (event delegation) -----
  // Confetti: larger, more visible
  function confettiAt(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2 + window.scrollX;
    const y = r.top  + r.height / 2 + window.scrollY;

    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#B8C0FF','#F896D8'];
    const COUNT = 40, MIN = 80, MAX = 180, DUR = 1100;

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'c-confetti';
      p.style.position = 'absolute';
      p.style.left = `${x}px`;
      p.style.top  = `${y}px`;
      p.style.width = p.style.height = `${6 + Math.random() * 6}px`;
      p.style.borderRadius = '50%';
      p.style.background = colors[i % colors.length];
      p.style.pointerEvents = 'none';
      p.style.zIndex = 9999;
      document.body.appendChild(p);

      const ang = Math.random() * Math.PI * 2;
      const dist = MIN + Math.random() * (MAX - MIN);
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist;

      p.animate(
        [{ transform: 'translate(0,0) scale(1)', opacity: 1 },
         { transform: `translate(${tx}px, ${ty}px) scale(.6)`, opacity: 0 }],
        { duration: DUR, easing: 'cubic-bezier(.2,.7,.2,1)' }
      ).finished.finally(() => p.remove());
    }
  }

  if (taskList) {
    taskList.addEventListener('click', (e) => {
      const btn = e.target.closest('.c-item__remove');
      if (!btn) return;
      const row = btn.closest('.c-item');
      if (row) row.remove();
    });

    taskList.addEventListener('change', (e) => {
      const chk = e.target;
      if (!chk.classList.contains('c-item__check')) return;
      const row = chk.closest('.c-item');
      if (!row) return;

      // play completion effect then remove row (or you can move it to "completed")
      confettiAt(chk);
      row.classList.add('is-completing');
      row.addEventListener('animationend', () => row.remove(), { once: true });
    });
  }
});
