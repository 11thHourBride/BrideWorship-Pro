
/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — preview-fix.js
   The main slide stage (#slides-view) bleeds into Service
   Order, Schedule and Timer tabs because a previous fix set
   display:flex !important on it.
   Fix: CSS classes on <body> control which panel is visible,
   with !important to win over any prior rule.
   A MutationObserver on .ctab.on keeps it always in sync.
═══════════════════════════════════════════════════════════ */

(function BW_PreviewFix() {
  'use strict';

  /* ── CSS ── */
  const st = document.createElement('style');
  st.id = 'bw-preview-fix-css';
  st.textContent = `
    /* Default: hide all center panels */
    body.tab-slides   #slides-view,
    body.tab-service  #slides-view,
    body.tab-schedule #slides-view,
    body.tab-timer    #slides-view,

    body.tab-slides   #service-view,
    body.tab-service  #service-view,
    body.tab-schedule #service-view,
    body.tab-timer    #service-view,

    body.tab-slides   #schedule-view,
    body.tab-service  #schedule-view,
    body.tab-schedule #schedule-view,
    body.tab-timer    #schedule-view
    {
      display: none !important;
    }

    /* Show only the active panel */
    body.tab-slides   #slides-view   { display: flex !important; }
    body.tab-service  #service-view  { display: flex !important; }
    body.tab-schedule #schedule-view { display: flex !important; }

    /* Timer lives inside service-view */
    body.tab-timer #service-view         { display: flex !important; }
    body.tab-timer #service-view > *     { display: none !important; }
    body.tab-timer #service-view #timer-view { display: flex !important; }
    /* Keep the SO editor drawer hidden on timer (its own logic shows it) */
    body.tab-timer #service-view #so-editor-drawer { display: none !important; }
  `;
  document.head.appendChild(st);

  /* ── Tab name → body class map ── */
  const TAB_CLASSES = ['tab-slides','tab-service','tab-schedule','tab-timer'];

  function _getActiveTabClass() {
    const tabs = Array.from(document.querySelectorAll('.ctab'));
    const idx  = tabs.findIndex(t => t.classList.contains('on'));
    return TAB_CLASSES[idx] ?? 'tab-slides';
  }

  function _sync() {
    const body = document.body;
    TAB_CLASSES.forEach(c => body.classList.remove(c));
    body.classList.add(_getActiveTabClass());
  }

  function _wire() {
    const tabs = document.querySelectorAll('.ctab');
    if (!tabs.length) { setTimeout(_wire, 200); return; }

    _sync(); // initial

    const obs = new MutationObserver(_sync);
    tabs.forEach(tab =>
      obs.observe(tab, { attributes: true, attributeFilter: ['class'] })
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wire);
  } else {
    _wire();
  }

  console.info('[BW preview-fix] ✓ Slide stage hidden on non-Slides tabs');
})();
