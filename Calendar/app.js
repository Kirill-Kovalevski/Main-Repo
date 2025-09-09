// Calendar/app.js
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Dom refs ----------
  const lemonToggle     = document.getElementById('lemonToggle');
  const appNav          = document.getElementById('appNav');

  const taskList        = document.getElementById('taskList');
  const completedList   = document.getElementById('completedList');
  const completedSection= document.getElementById('completedSection');

  const addEventBtn     = document.getElementById('addEventBtn');
  const modal           = document.getElementById('newEventModal');
  const modalBackdrop   = modal?.querySelector('[data-close]');
  const modalCloseBtn   = modal?.querySelector('.c-btn--ghost[data-close]');
  const modalForm       = document.getElementById('newEventForm');
  const titleInput      = document.getElementById('evtTitle');
  const dateInput       = document.getElementById('evtDate');
  const timeInput       = document.getElementById('evtTime');

  // ---------- Helpers ----------
  const open = (el)  => el?.classList.remove('u-hidden');
  const close = (el) => el?.classList.add('u-hidden');

  const showCompleted = () => completedSection?.classList.remove('u-hidden');

  function taskItemTemplate(text) {
    const li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = `
      <label class="c-item__label">
        <input class="c-item__check" type="checkbox" />
        <p class="c-item__text">${text}</p>
      </label>
    `;
    return li;
  }

  function completedItemTemplate(text) {
    const li = document.createElement('li');
    li.className = 'c-item';
    li.innerHTML = `
      <div class="c-item__label">
        <p class="c-item__text">${text}</p>
      </div>
    `;
    return li;
  }

  // ---------- Nav (lemon) ----------
  lemonToggle?.addEventListener('click', () => {
    appNav?.classList.toggle('u-is-collapsed');
  });

  // ---------- Check-off flow ----------
  taskList?.addEventListener('change', (e) => {
    const chk = e.target;
    if (!chk.matches('.c-item__check')) return;

    const li   = chk.closest('.c-item');
    const text = li?.querySelector('.c-item__text')?.textContent?.trim() || '';

    // 1) play crossing + rainbow fade
    li.classList.add('is-completing');

    // 2) when animation ends, move to Completed
    const onDone = () => {
      li.removeEventListener('animationend', onDone);
      // Remove from task list
      li.remove();
      // Add to Completed
      showCompleted();
      completedList.appendChild(completedItemTemplate(text));
    };

    li.addEventListener('animationend', onDone, { once: true });
  });

  // ---------- Modal: open / close ----------
  addEventBtn?.addEventListener('click', () => {
    open(modal);
    titleInput?.focus();
  });

  modalBackdrop?.addEventListener('click', () => close(modal));
  modalCloseBtn?.addEventListener('click', () => close(modal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close(modal);
  });

  // ---------- Modal: submit new event ----------
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (titleInput.value || '').trim();
    const date  = (dateInput.value || '').trim();
    const time  = (timeInput.value || '').trim();

    if (!title || !date || !time) return;

    // Format: "כותרת HH:MM (DD/MM/YY)"
    const dt = new Date(date);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yy = String(dt.getFullYear()).slice(-2);

    const label = `${title} ${time} (${dd}/${mm}/${yy})`;

    taskList.appendChild(taskItemTemplate(label));

    // reset + close
    modalForm.reset();
    close(modal);
  });
});
