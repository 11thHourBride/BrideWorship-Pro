/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix20-preview-text.js
   1. Output preview shows the active media image/video even
      when no slide content is loaded ("no content" hidden).
   2. "Clear Text" button — hides/shows all text on the
      output preview AND the projection window, leaving only
      the background / media visible. Sits next to "Clear Media."
═══════════════════════════════════════════════════════════ */

(function BW_Fix20() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.textContent = `

    /* ── When media is active, hide the "no content" message ── */
    body.media-active #out-screen .out-no-content,
    body.media-active #out-screen .out-placeholder,
    body.media-active #out-screen [class*="no-content"],
    body.media-active #out-screen [class*="placeholder"] {
      display: none !important;
    }

    #clear-text-btn.text-hidden {
      background: rgba(224,80,80,.1);
      border-color: rgba(224,80,80,.5);
      color: var(--red, #e05050);
    }

    /* Keep Clear Media + Clear Text on the same row */
    #bottom-clear-media-btn,
    #clear-text-btn {
      padding: 0 10px; height: 28px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card); color: var(--text-2);
      font-size: 11px; cursor: pointer; white-space: nowrap;
      transition: background .1s, border-color .15s, color .15s;
      flex-shrink: 0;
      display: inline-flex; align-items: center; gap: 4px;
    }
    #bottom-clear-media-btn:hover,
    #clear-text-btn:hover {
      background: var(--bg-hover);
      border-color: var(--gold-dim);
    }
    #bottom-clear-media-btn.cleared {
      background: rgba(201,168,76,.12);
      border-color: var(--gold,#c9a84c);
      color: var(--gold,#c9a84c);
    }

    /* ── When text is cleared: hide text in output preview ─── */
    body.text-cleared #out-screen .out-inner,
    body.text-cleared #out-screen #out-inner,
    body.text-cleared #out-screen .out-txt,
    body.text-cleared #out-screen #out-txt,
    body.text-cleared #out-screen .out-ref,
    body.text-cleared #out-screen #out-ref {
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — SHOW MEDIA IN OUTPUT PREVIEW EVEN WITH NO SLIDES
     ──────────────────────────────────────────────────────────
     The output preview shows "no content" when S.live is false
     or S.slides is empty. We watch for media being projected
     and add body.media-active to suppress that message.
     We also patch mediaProject / mediaToggleClear from fix28.
  ══════════════════════════════════════════════════════════ */

  function _syncMediaActive() {
    /* Check if fix28's media is on */
    const mediaOn = document.getElementById('out-media-overlay')?.style.display === 'block';
    document.body.classList.toggle('media-active', mediaOn);
  }

  /* Observe the overlay display property */
  function _watchMediaOverlay() {
    const ov = document.getElementById('out-media-overlay');
    if (!ov) { setTimeout(_watchMediaOverlay, 300); return; }
    const obs = new MutationObserver(_syncMediaActive);
    obs.observe(ov, { attributes: true, attributeFilter: ['style'] });
    _syncMediaActive();
  }

  /* Also patch the media functions directly for instant response */
  const _origMediaProject      = window.mediaProject;
  const _origMediaToggleClear  = window.mediaToggleClear;

  window.mediaProject = function () {
    if (_origMediaProject) _origMediaProject();
    setTimeout(_syncMediaActive, 50);
  };

  window.mediaToggleClear = function () {
    if (_origMediaToggleClear) _origMediaToggleClear();
    setTimeout(_syncMediaActive, 50);
  };


  /* ══════════════════════════════════════════════════════════
     FIX 2 — CLEAR TEXT BUTTON
  ══════════════════════════════════════════════════════════ */

  let _textCleared = false;

  function _applyTextClear() {
    document.body.classList.toggle('text-cleared', _textCleared);

    /* Projection window: hide/show text elements */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const d = pw.document;
      const ref  = d.getElementById('proj-ref');
      const txt  = d.getElementById('proj-text');
      const foot = d.getElementById('proj-footer');
      const vis  = _textCleared ? 'hidden' : '';
      if (ref)  ref.style.visibility  = vis;
      if (txt)  txt.style.visibility  = vis;
      if (foot) foot.style.visibility = vis;
    }

    /* Update button appearance */
    const btn = document.getElementById('clear-text-btn');
    if (btn) {
      btn.classList.toggle('text-hidden', _textCleared);
      btn.textContent = _textCleared ? '↩' : '✕';
    }

    if (typeof showSchToast === 'function')
      showSchToast(_textCleared ? 'Text hidden' : 'Text restored');
  }

  window.clearTextToggle = function () {
    _textCleared = !_textCleared;
    _applyTextClear();
  };

  /* Re-apply after every push so clear persists across slide changes.
     But if the user picks a NEW slide, auto-restore text first.      */
  let _lastSlideIdx = -1;

  const _origPush = window.push;
  if (typeof _origPush === 'function') {
    window.push = function () {
      /* Detect a slide change — auto-restore text */
      const currentIdx = S?.cur ?? -1;
      if (_textCleared && currentIdx !== _lastSlideIdx) {
        _textCleared = false;
        _lastSlideIdx = currentIdx;
        _origPush();
        _applyTextClear();   // updates button + proj window
        return;
      }
      _lastSlideIdx = currentIdx;
      _origPush();
      if (_textCleared) requestAnimationFrame(() => _applyTextClear());
    };
  }

  /* Re-apply after openProjection */
  const _origOP = window.openProjection;
  if (typeof _origOP === 'function') {
    window.openProjection = async function () {
      await _origOP();
      setTimeout(() => { if (_textCleared) _applyTextClear(); }, 1200);
    };
  }


  /* ══════════════════════════════════════════════════════════
     INJECT "CLEAR TEXT" BUTTON
  ══════════════════════════════════════════════════════════ */

  function _addClearTextBtn() {
    if (document.getElementById('clear-text-btn')) return;

    const btn = document.createElement('button');
    btn.id          = 'clear-text-btn';
    btn.textContent = '✕';
    btn.title       = 'Hide / show text on output and projection';
    btn.addEventListener('click', clearTextToggle);

    /* Ideal: insert directly after Clear Media in the same row */
    const mediaBtn = document.getElementById('bottom-clear-media-btn');
    if (mediaBtn) {
      mediaBtn.insertAdjacentElement('afterend', btn);
      /* Ensure the parent row is flex so they sit side by side */
      const parent = mediaBtn.parentElement;
      if (parent) {
        parent.style.display     = parent.style.display || 'flex';
        parent.style.flexWrap    = 'wrap';
        parent.style.gap         = parent.style.gap || '5px';
        parent.style.alignItems  = 'center';
      }
      return;
    }

    /* Fallback: same anchor as Clear Media */
    const anchor = document.querySelector(
      '#out-ctrl, .out-ctrl, #out-bar, .out-bar, ' +
      '#out-btns, .out-btns, #out-controls, .out-controls, ' +
      '.out-wrap .ctrl-row, #out-wrap-sticky .ctrl-row, ' +
      '.out-wrap .bar, #out-wrap-sticky .bar'
    );
    if (anchor) { anchor.appendChild(btn); return; }

    const outScreen = document.getElementById('out-screen');
    if (outScreen) outScreen.insertAdjacentElement('afterend', btn);
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    _watchMediaOverlay();
    /* Retry button injection — fix28 may inject Clear Media after us */
    let n = 0;
    const t = setInterval(() => {
      _addClearTextBtn();
      if (document.getElementById('clear-text-btn') || ++n > 20) clearInterval(t);
    }, 300);

    console.info('[BW fix20] ✓ Media active preview  ✓ Clear Text button');
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot);
  else
    setTimeout(boot, 500);

})();
