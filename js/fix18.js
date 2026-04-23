/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix18.js
   1. Imported-sermon list collapsed/hidden by default in
      the reader panel — visible only via the Library button.
   2. Clock toggle (on/off) now syncs to projection window
      and stage display.
   3. Draggable clock on Output Preview — pointer-capture,
      works reliably, mirrors position to second screen.
      Position is re-applied every tick so pushClockToProj
      cannot wipe it out.
═══════════════════════════════════════════════════════════ */

(function BW_Fix18() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1 — HIDE IMPORTED SERMON LIST IN READER PANEL
         The list shown by fix10/11/12 clutters the reader.
         We keep it inside the Library panel (fix13) only.
  ══════════════════════════════════════════════════════════ */

  const _hideStyle = document.createElement('style');
  _hideStyle.id = 'bw-fix18-hide';
  _hideStyle.textContent = `
    /* Hide the standalone imported-sermon sections injected
       by fix10 / fix11 / fix12 — they live in the Library
       panel now (fix13). */
    #imported-sermon-list,
    #f12-saved-list,
    #f12-import-zone,
    #reader-import-zone {
      display: none !important;
    }

    /* Also hide their wrapper labels */
    #imported-sermon-list,
    #f12-saved-list {
      display: none !important;
    }
  `;
  document.head.appendChild(_hideStyle);

  /* Aggressively hide the wrappers that contain the lists */
  function _hideSermonLists() {
    ['imported-sermon-list','f12-saved-list','f12-import-zone','reader-import-zone']
      .forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        /* Hide the element and its nearest labelled wrapper */
        el.style.display = 'none';
        const wrap = el.parentElement;
        if (wrap && !wrap.id && !wrap.classList.contains('modal-body') &&
            !wrap.classList.contains('db-scroll')) {
          wrap.style.display = 'none';
        }
      });
  }

  /* Run on open and periodically */
  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    [100, 400, 900].forEach(d => setTimeout(_hideSermonLists, d));
  };
  setTimeout(_hideSermonLists, 500);


  /* ══════════════════════════════════════════════════════════
     CLOCK STATE HELPERS
  ══════════════════════════════════════════════════════════ */

  let _clockOn  = true;  // track on/off state
  let _clockPos = null;  // {px, py} percent of preview container

  /* Load saved state */
  (function () {
    try { _clockPos = JSON.parse(localStorage.getItem('bw_ck18_pos') || 'null'); } catch(e) {}
    const storedOn = localStorage.getItem('bw_ck18_on');
    if (storedOn !== null) _clockOn = storedOn !== '0';
  })();

  function _getClockFont() {
    return localStorage.getItem('bw_clock_font') || 'Cinzel';
  }

  /* Apply visibility + font + position to the proj-clock element */
  function _applyToProj() {
    const pw = window.S?.projWin;
    if (!pw || pw.closed) return;
    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;

    pc.style.display     = _clockOn ? '' : 'none';
    pc.style.fontFamily  = `'${_getClockFont()}', monospace`;
    pc.style.fontWeight  = '700';

    if (_clockPos) {
      pc.style.position = 'fixed';
      pc.style.left     = (_clockPos.px / 100 * 1920) + 'px';
      pc.style.top      = (_clockPos.py / 100 * 1080) + 'px';
      pc.style.right    = 'auto';
      pc.style.bottom   = 'auto';
    }
  }

  function _applyToStage() {
    const sw = window.S?.stageWin;
    if (!sw || sw.closed) return;
    const sc = sw.document.getElementById('stg-clock');
    if (!sc) return;
    sc.style.display    = _clockOn ? '' : 'none';
    sc.style.fontFamily = `'${_getClockFont()}', monospace`;
  }

  function _applyToPreview() {
    const ck = document.getElementById('out-clock');
    if (!ck) return;
    ck.style.display    = _clockOn ? '' : 'none';
    ck.style.fontFamily = `'${_getClockFont()}', monospace`;
    ck.style.fontWeight = '700';
  }


  /* ══════════════════════════════════════════════════════════
     2 — CLOCK TOGGLE → SYNC TO SECOND SCREEN & STAGE
  ══════════════════════════════════════════════════════════ */

  const _origToggleClock = window.toggleClock;
  window.toggleClock = function (on) {
    _clockOn = !!on;
    localStorage.setItem('bw_ck18_on', _clockOn ? '1' : '0');

    /* Call original */
    if (typeof _origToggleClock === 'function') _origToggleClock(on);

    /* Sync everywhere */
    _applyToPreview();
    _applyToProj();
    _applyToStage();
  };

  /* Patch tickClock so every second re-applies visibility
     (pushClockToProj resets cssText — we correct it here) */
  const _origTick = window.tickClock;
  window.tickClock = function () {
    if (typeof _origTick === 'function') _origTick();
    _applyToProj();
    _applyToStage();
    _applyToPreview();
  };

  /* Patch pushClockToProj — runs every second tick */
  const _origPushCTP = window.pushClockToProj;
  if (typeof _origPushCTP === 'function') {
    window.pushClockToProj = function (str) {
      _origPushCTP(str);
      /* Immediately correct what pushClockToProj just set */
      const pw = window.S?.projWin;
      if (!pw || pw.closed) return;
      const pc = pw.document.getElementById('proj-clock');
      if (!pc) return;
      pc.style.display    = _clockOn ? '' : 'none';
      pc.style.fontFamily = `'${_getClockFont()}', monospace`;
      pc.style.fontWeight = '700';
      if (_clockPos) {
        pc.style.position = 'fixed';
        pc.style.left     = (_clockPos.px / 100 * 1920) + 'px';
        pc.style.top      = (_clockPos.py / 100 * 1080) + 'px';
        pc.style.right    = 'auto';
        pc.style.bottom   = 'auto';
      }
    };
  }

  /* Re-apply when projection window opens */
  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      setTimeout(_applyToProj,  800);
      setTimeout(_applyToProj, 1500);
    };
  }


  /* ══════════════════════════════════════════════════════════
     3 — DRAGGABLE CLOCK ON OUTPUT PREVIEW
  ══════════════════════════════════════════════════════════ */

  const _drag = { active: false, startX: 0, startY: 0, startL: 0, startT: 0 };

  function _wireDrag() {
    const ck     = document.getElementById('out-clock');
    const screen = document.getElementById('out-screen');
    if (!ck || !screen || ck.dataset.f18drag) return;
    ck.dataset.f18drag = '1';

    /* out-screen must be a positioning context */
    if (getComputedStyle(screen).position === 'static') {
      screen.style.position = 'relative';
    }

    /* Restore saved position */
    _restoreClockPos(ck, screen);

    /* ── styles ── */
    ck.style.cursor     = 'grab';
    ck.style.userSelect = 'none';
    ck.title            = 'Drag to reposition clock';

    /* ── pointer-capture approach ── */
    ck.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      ck.setPointerCapture(e.pointerId);

      /* Strip CSS position class (pos-br etc) */
      ck.className = ck.className.split(' ')
        .filter(c => !c.startsWith('pos-')).join(' ');

      const sr  = screen.getBoundingClientRect();
      const ckr = ck.getBoundingClientRect();

      _drag.startX = e.clientX;
      _drag.startY = e.clientY;
      _drag.startL = ckr.left - sr.left;
      _drag.startT = ckr.top  - sr.top;

      ck.style.position = 'absolute';
      ck.style.left     = _drag.startL + 'px';
      ck.style.top      = _drag.startT + 'px';
      ck.style.right    = 'auto';
      ck.style.bottom   = 'auto';
      ck.style.cursor   = 'grabbing';
      ck.style.zIndex   = '999';
    });

    ck.addEventListener('pointermove', function (e) {
      if (!ck.hasPointerCapture(e.pointerId)) return;
      const sr  = screen.getBoundingClientRect();
      const nx  = Math.max(0, Math.min(sr.width  - ck.offsetWidth,
                    _drag.startL + (e.clientX - _drag.startX)));
      const ny  = Math.max(0, Math.min(sr.height - ck.offsetHeight,
                    _drag.startT + (e.clientY - _drag.startY)));
      ck.style.left = nx + 'px';
      ck.style.top  = ny + 'px';
    });

    ck.addEventListener('pointerup', function (e) {
      if (!ck.hasPointerCapture(e.pointerId)) return;
      ck.releasePointerCapture(e.pointerId);
      ck.style.cursor = 'grab';

      const sr  = screen.getBoundingClientRect();
      _clockPos = {
        px: parseFloat(ck.style.left) / sr.width  * 100,
        py: parseFloat(ck.style.top)  / sr.height * 100,
      };
      try { localStorage.setItem('bw_ck18_pos', JSON.stringify(_clockPos)); } catch(err) {}

      /* Mirror to projection immediately */
      _applyToProj();
    });
  }

  function _restoreClockPos(ck, screen) {
    if (!_clockPos) return;
    requestAnimationFrame(() => {
      const sr = screen.getBoundingClientRect();
      if (!sr.width) return; // not laid out yet — try again
      ck.className  = ck.className.split(' ').filter(c => !c.startsWith('pos-')).join(' ');
      ck.style.position = 'absolute';
      ck.style.left     = (_clockPos.px / 100 * sr.width)  + 'px';
      ck.style.top      = (_clockPos.py / 100 * sr.height) + 'px';
      ck.style.right    = 'auto';
      ck.style.bottom   = 'auto';
    });
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    /* Wire drag — retry until out-clock exists */
    let n = 0;
    const t = setInterval(() => {
      _wireDrag();
      if (document.getElementById('out-clock')?.dataset.f18drag || ++n > 30) {
        clearInterval(t);
      }
    }, 300);

    /* Apply clock font + visibility to preview immediately */
    setTimeout(() => { _applyToPreview(); }, 400);

    /* Sync clock font change */
    const _origCFC = window.clockFontChange;
    window.clockFontChange = function (font) {
      if (_origCFC) _origCFC(font);
      _applyToPreview();
      _applyToProj();
      _applyToStage();
    };

    console.info('[BW fix18] ✓ Sermon list hidden  ✓ Clock toggle sync  ✓ Draggable clock');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 350);
  }

})();