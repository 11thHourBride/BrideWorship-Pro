/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix6.js
   Fix 1 : Auto-detect + fill second screen button next to
           the text size +/- controls in the bottom bar.
           Uses Window Management API where available;
           falls back to manual fullscreen on the popup window.
   Fix 2 : All modals expand to 90 % of the viewport.
═══════════════════════════════════════════════════════════ */

(function BW_Fix6() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix6-styles';
  _style.textContent = `

    /* ── Auto-fill button ─────────────────────────────────── */
    #autofill-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 10px;
      height: 28px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 11px;
      font-family: 'Lato', sans-serif;
      cursor: pointer;
      white-space: nowrap;
      transition: background .15s, border-color .15s, color .15s;
      flex-shrink: 0;
    }
    #autofill-btn:hover {
      background: var(--bg-hover);
      border-color: var(--gold-dim);
      color: var(--gold);
    }
    #autofill-btn.active {
      background: rgba(76,175,122,.12);
      border-color: var(--green, #4caf7a);
      color: var(--green, #4caf7a);
    }
    #autofill-btn.detecting {
      animation: afPulse .9s ease-in-out infinite;
    }
    @keyframes afPulse {
      0%,100% { opacity: 1; }
      50%      { opacity: .45; }
    }

    /* Screen indicator dot inside the button */
    #af-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--text-3);
      flex-shrink: 0;
      transition: background .3s;
    }
    #autofill-btn.active  #af-dot { background: var(--green, #4caf7a); }
    #autofill-btn.detecting #af-dot { background: var(--amber, #d4a017); }

    /* Screen-count badge */
    #af-screens {
      font-size: 9px;
      padding: 1px 5px;
      border-radius: 10px;
      background: rgba(255,255,255,.07);
      color: var(--text-3);
      flex-shrink: 0;
      transition: background .3s, color .3s;
    }
    #autofill-btn.active #af-screens {
      background: rgba(76,175,122,.2);
      color: var(--green, #4caf7a);
    }


    /* ── Modal 90 % viewport ──────────────────────────────── */

    /* Override fixed widths on every modal box.
       We target the inner .modal div that sits inside
       .modal-overlay.                                         */
    .modal-overlay .modal {
      width:      min(90vw, 1200px) !important;
      max-width:  90vw !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
    }

    /* Extra-tall modals: give body room to scroll */
    .modal-overlay .modal .modal-body {
      max-height: calc(90vh - 120px) !important;
      overflow-y: auto !important;
    }

    /* Specific wide modals that already had explicit widths */
    .modal-overlay .se-modal,
    .modal-overlay .cs-modal,
    .modal-overlay .db-modal-box,
    .modal-overlay .table-modal-box,
    .modal-overlay .tmpl-modal {
      width:     min(90vw, 1200px) !important;
      max-width: 90vw  !important;
      max-height: 90vh !important;
    }

    /* Song / presentation editor slide list benefits from
       more vertical room                                     */
    .modal-overlay .se-modal .se-slides-list {
      max-height: calc(90vh - 260px) !important;
      overflow-y: auto !important;
    }

    /* DB import/export scrollable panel */
    .modal-overlay .db-scroll {
      max-height: calc(90vh - 180px) !important;
    }

    /* Template modal panels */
    .modal-overlay .tmpl-panel .modal-body {
      max-height: calc(90vh - 160px) !important;
    }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — auto-fill second screen button
  ══════════════════════════════════════════════════════════ */

  /* State */
  let _af = {
    screenDetails: null,   // ScreenDetails object (API)
    extScreen:     null,   // the non-primary Screen
    active:        false,  // currently filling?
    permAsked:     false,
  };

  /* ── Build the button and insert it next to +/- ── */
  function buildButton() {
    if (document.getElementById('autofill-btn')) return;

    /* Find the size-ctrl wrapper */
    const sizeCtrl = document.querySelector('.size-ctrl');
    if (!sizeCtrl) return;

    const btn = document.createElement('button');
    btn.id        = 'autofill-btn';
    btn.title     = 'Detect second screen and fill it with the projection window';
    btn.innerHTML = `<div id="af-dot"></div>
                     <span id="af-label">⛶ Auto-Fill</span>
                     <span id="af-screens">—</span>`;
    btn.addEventListener('click', toggleAutoFill);

    /* Insert immediately after the size-ctrl block */
    sizeCtrl.insertAdjacentElement('afterend', btn);
  }

  /* ── Main toggle ── */
  async function toggleAutoFill() {
    if (_af.active) {
      _setInactive();
      return;
    }
    _setDetecting();
    await _detectAndFill();
  }

  async function _detectAndFill() {
    /* ── Try Window Management API (Chrome 100+) ── */
    if ('getScreenDetails' in window) {
      try {
        _af.screenDetails = await window.getScreenDetails();
        _af.screenDetails.addEventListener('screenschange', _onScreensChanged);
        localStorage.setItem('bw_screen_permission', 'granted');
      } catch (e) {
        /* Permission denied — fall back to popup fullscreen */
        _af.screenDetails = null;
      }
    }

    const screens = _af.screenDetails?.screens || [];
    _updateScreenBadge(screens.length);

    /* Find the external / non-primary screen */
    _af.extScreen = screens.find(s => !s.isPrimary) || null;

    if (_af.extScreen) {
      await _openOnScreen(_af.extScreen);
    } else {
      /* Single-display fallback: fullscreen the existing popup */
      await _fullscreenExisting();
    }
  }

  /* Open / reposition the projection window on a specific Screen object */
  async function _openOnScreen(screen) {
    const left   = screen.availLeft   ?? screen.left   ?? 0;
    const top    = screen.availTop    ?? screen.top    ?? 0;
    const width  = screen.availWidth  ?? screen.width  ?? 1920;
    const height = screen.availHeight ?? screen.height ?? 1080;

    /* If the projection window is already open, just move + resize it */
    if (S.projWin && !S.projWin.closed) {
      try {
        S.projWin.moveTo(left, top);
        S.projWin.resizeTo(width, height);
        _requestFullscreen(S.projWin);
      } catch(e) { _openFresh(left, top, width, height); }
    } else {
      _openFresh(left, top, width, height);
    }

    _setActive(screen.label || `${width}×${height}`);
    if (typeof push === 'function') push();

    if (typeof showSchToast === 'function')
      showSchToast(`⛶ Filling ${screen.label || width+'×'+height}`);
  }

  function _openFresh(left, top, width, height) {
    const features = [
      `left=${left}`,   `top=${top}`,
      `width=${width}`, `height=${height}`,
      'menubar=no','toolbar=no','location=no',
      'status=no','resizable=yes',
    ].join(',');

    S.projWin = window.open('', 'BW_Projection', features);
    if (!S.projWin) {
      if (typeof showSchToast === 'function')
        showSchToast('⚠ Popups blocked — allow popups then try again');
      _setInactive();
      return;
    }
    if (typeof projWindowHTML === 'function') {
      S.projWin.document.open();
      S.projWin.document.write(projWindowHTML());
      S.projWin.document.close();
    }
    document.getElementById('proj-btn')?.classList.add('on');
    _requestFullscreen(S.projWin);
  }

  /* Fullscreen an existing popup window */
  async function _fullscreenExisting() {
    if (!S.projWin || S.projWin.closed) {
      /* No popup open yet — open one normally then fullscreen */
      if (typeof openProjection === 'function') openProjection();
      await _sleep(800);
    }
    _requestFullscreen(S.projWin);
    _setActive('fullscreen');
    if (typeof showSchToast === 'function')
      showSchToast('⛶ Projection window set to fullscreen');
  }

  function _requestFullscreen(win) {
    if (!win || win.closed) return;
    try {
      win.document.documentElement.requestFullscreen?.();
    } catch(e) {}
  }

  /* Handle HDMI plug/unplug */
  function _onScreensChanged() {
    if (!_af.screenDetails) return;
    const screens = _af.screenDetails.screens;
    _updateScreenBadge(screens.length);
    const ext = screens.find(s => !s.isPrimary) || null;

    if (ext && !_af.active) {
      /* New external display connected while inactive — prompt */
      if (typeof showSchToast === 'function')
        showSchToast('📺 External display detected — click ⛶ Auto-Fill to use it');
    }

    if (ext && _af.active && ext !== _af.extScreen) {
      _af.extScreen = ext;
      _openOnScreen(ext);
    }

    if (!ext && _af.active) {
      _setInactive();
      if (typeof showSchToast === 'function')
        showSchToast('📺 External display disconnected');
    }
  }

  /* Keep projection window fullscreen (poll every 5 s) */
  let _fsPoller = null;
  function _startFsPoller() {
    _stopFsPoller();
    _fsPoller = setInterval(() => {
      if (!_af.active) { _stopFsPoller(); return; }
      if (!S.projWin || S.projWin.closed) { _setInactive(); return; }
      try {
        if (!S.projWin.document.fullscreenElement)
          S.projWin.document.documentElement.requestFullscreen?.();
      } catch(e) {}
    }, 5000);
  }
  function _stopFsPoller() { clearInterval(_fsPoller); _fsPoller = null; }

  /* ── Button state helpers ── */
  function _setDetecting() {
    const btn = document.getElementById('autofill-btn');
    const lbl = document.getElementById('af-label');
    btn?.classList.add('detecting');
    btn?.classList.remove('active');
    if (lbl) lbl.textContent = '⛶ Detecting…';
  }

  function _setActive(screenLabel) {
    _af.active = true;
    const btn = document.getElementById('autofill-btn');
    const lbl = document.getElementById('af-label');
    btn?.classList.remove('detecting');
    btn?.classList.add('active');
    if (lbl) lbl.textContent = `⛶ ${screenLabel || 'Filling'}`;
    _startFsPoller();
  }

  function _setInactive() {
    _af.active = false;
    _stopFsPoller();
    const btn = document.getElementById('autofill-btn');
    const lbl = document.getElementById('af-label');
    btn?.classList.remove('active', 'detecting');
    if (lbl) lbl.textContent = '⛶ Auto-Fill';
    /* Exit fullscreen on the projection window if still open */
    if (S.projWin && !S.projWin.closed) {
      try { S.projWin.document.exitFullscreen?.(); } catch(e) {}
    }
  }

  function _updateScreenBadge(count) {
    const el = document.getElementById('af-screens');
    if (!el) return;
    el.textContent = count > 1
      ? `${count} screens`
      : count === 1 ? '1 screen' : '—';
  }

  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* Auto-detect on load if permission was already granted */
  (function _autoInit() {
    if (localStorage.getItem('bw_screen_permission') === 'granted' &&
        'getScreenDetails' in window) {
      window.getScreenDetails()
        .then(sd => {
          _af.screenDetails = sd;
          sd.addEventListener('screenschange', _onScreensChanged);
          const screens = sd.screens || [];
          _updateScreenBadge(screens.length);
          _af.extScreen = screens.find(s => !s.isPrimary) || null;
          if (_af.extScreen && typeof showSchToast === 'function') {
            showSchToast(`📺 External display ready — click ⛶ Auto-Fill`);
          }
        })
        .catch(() => {});
    }
  })();


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    buildButton();
    console.info('[BW fix6] ✓ Auto-Fill button  ✓ 90 % modals');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 300);
  }

})();
