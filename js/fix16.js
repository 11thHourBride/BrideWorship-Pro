/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix16.js
   Fix: "All Table panels show at once"
   Root cause: fix14.js sets  display:flex !important  on
   .table-panel which overrides the display:none that
   tableTab() uses to hide inactive panels.
   Solution:
     1. CSS counter-rule — hidden panels always win.
     2. Patch tableTab() so it uses a CSS class (.tp-active)
        instead of inline style toggling, making it immune
        to specificity wars.
═══════════════════════════════════════════════════════════ */

(function BW_Fix16() {
  'use strict';

  /* ── CSS: hidden panels must always stay hidden ─────────── */
  const style = document.createElement('style');
  style.id = 'bw-fix16-styles';
  style.textContent = `

    /* All table panels hidden by default */
    .table-modal-box .table-panel {
      display: none !important;
    }

    /* Only the active panel is shown — using a class so JS
       doesn't fight inline style vs !important */
    .table-modal-box .table-panel.tp-active {
      display: flex !important;
      flex: 1 1 0;
      min-height: 0;
      flex-direction: column;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);


  /* ── Patch tableTab() ───────────────────────────────────── */
  window.tableTab = function (clickedTab, panelId) {
    /* Hide all panels */
    document.querySelectorAll('.table-modal-box .table-panel')
      .forEach(p => p.classList.remove('tp-active'));

    /* Deactivate all tab buttons */
    document.querySelectorAll('#table-modal .db-tab')
      .forEach(t => t.classList.remove('on'));

    /* Show the target panel */
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('tp-active');

    /* Activate the clicked tab */
    if (clickedTab) clickedTab.classList.add('on');
  };


  /* ── On open, ensure the first tab is active ────────────── */
  const _origOpen = window.openTheTable;
  window.openTheTable = function () {
    if (_origOpen) _origOpen();

    setTimeout(() => {
      const modal = document.getElementById('table-modal');
      if (!modal) return;

      /* If no panel is active yet, activate the first one */
      const hasActive = modal.querySelector('.table-panel.tp-active');
      if (!hasActive) {
        const firstPanel = modal.querySelector('.table-panel');
        const firstTab   = modal.querySelector('.db-tab');
        if (firstPanel) firstPanel.classList.add('tp-active');
        if (firstTab)   firstTab.classList.add('on');
      }
    }, 50);
  };


  /* ── Also fix any existing open modal immediately ───────── */
  (function _fixIfAlreadyOpen() {
    const modal = document.getElementById('table-modal');
    if (!modal || modal.style.display === 'none') return;

    const hasActive = modal.querySelector('.table-panel.tp-active');
    if (!hasActive) {
      const firstPanel = modal.querySelector('.table-panel');
      const firstTab   = modal.querySelector('.db-tab');
      if (firstPanel) firstPanel.classList.add('tp-active');
      if (firstTab)   firstTab.classList.add('on');
    }
  })();


  console.info('[BW fix16] ✓ Table tab switching restored');
})();