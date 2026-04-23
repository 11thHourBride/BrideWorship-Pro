/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix11.js
   Targets four specific bugs:
   1. Imported sermons persist across page refresh.
   2. Clock is truly draggable; font change hits second screen.
   3. Reader selection bar stays sticky at the top so users
      never have to scroll up to project/schedule.
═══════════════════════════════════════════════════════════ */

(function BW_Fix11() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS FIXES
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix11-styles';
  _style.textContent = `

    /* ── FIX 3: sticky selection bar ─────────────────────── */
    #reader-sel-bar {
      position: sticky !important;
      top: 0 !important;
      z-index: 50 !important;
      background: var(--bg-deep, #09090f) !important;
      border-radius: 0 !important;
      border-left: none !important;
      border-right: none !important;
      border-top: none !important;
      border-bottom: 1px solid rgba(201,168,76,.25) !important;
      margin-bottom: 8px !important;
      padding: 8px 12px !important;
    }

    /* ── FIX 2: clock draggable cursor ────────────────────── */
    #out-clock {
      cursor: grab !important;
      user-select: none !important;
      touch-action: none !important;
      transition: none !important;   /* no transition while dragging */
    }
    #out-clock:active { cursor: grabbing !important; }

    #out-clock.dragging {
      cursor: grabbing !important;
      box-shadow: 0 2px 12px rgba(0,0,0,.6) !important;
      z-index: 999 !important;
    }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — IMPORTED SERMONS PERSIST
     ──────────────────────────────────────────────────────────
     Root cause: fix9 / fix10's observer approach raced with
     the async file reader. Fix: directly intercept the zone's
     input element change event and save AFTER the paras are
     written, using a MutationObserver on #reader-para-list.
  ══════════════════════════════════════════════════════════ */

  const SERMON_KEY = 'bw_imported_sermons';

  function _loadSermons() {
    try { return JSON.parse(localStorage.getItem(SERMON_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function _saveSermon(title, author, paras) {
    const list = _loadSermons();
    const idx  = list.findIndex(s => s.title === title);
    const entry = {
      id:      'imp_' + Date.now(),
      title,
      author:  author || '',
      addedAt: new Date().toISOString(),
      paras,   /* plain text array */
    };
    if (idx >= 0) list[idx] = entry; else list.unshift(entry);
    if (list.length > 60) list.pop();
    try {
      localStorage.setItem(SERMON_KEY, JSON.stringify(list));
      return true;
    } catch(e) {
      /* Quota exceeded — try without the biggest entries */
      const trimmed = list.slice(0, 20);
      try { localStorage.setItem(SERMON_KEY, JSON.stringify(trimmed)); return true; }
      catch(e2) { return false; }
    }
  }

  /* Watch for the reader-para-list being populated after file load */
  function _watchReaderForSave() {
    const viewer = document.getElementById('reader-viewer');
    if (!viewer) return;

    const observer = new MutationObserver(() => {
      const list = document.getElementById('reader-para-list');
      if (!list || !list.children.length) return;

      const title  = window._readerTitle  || '';
      const author = window._readerAuthor || '';
      const paras  = (window._readerParas || []).map(p => p.text).filter(Boolean);

      if (!title || !paras.length) return;

      /* Only save if this looks like a new file load (not a built-in sermon re-open) */
      const builtins = (typeof BUILTIN_SERMONS !== 'undefined')
        ? BUILTIN_SERMONS.map(s => s.title) : [];
      if (builtins.includes(title)) return;

      const ok = _saveSermon(title, author, paras);
      if (ok) {
        _refreshImportedList();
        if (typeof showSchToast === 'function')
          showSchToast(`✓ "${title}" saved to Your Library`);
        if (typeof logActivity === 'function')
          logActivity('📄', `Saved imported sermon: "${title}"`);
      }
    });

    observer.observe(viewer, { childList: true, subtree: true });
  }

  /* Rebuild the imported sermon list in the reader */
  function _refreshImportedList() {
    const wrap = document.getElementById('imported-sermon-list');
    if (!wrap) return;

    const list = _loadSermons();
    if (!list.length) {
      wrap.innerHTML = '<div style="font-size:10px;color:var(--text-3);padding:6px 0 10px;">No imported sermons yet.</div>';
      return;
    }

    wrap.innerHTML = list.map(s => `
      <div class="imported-sermon-item" onclick="fix11OpenSermon('${s.id}')">
        <div class="imported-sermon-icon">📄</div>
        <div class="imported-sermon-info">
          <div class="imported-sermon-title">${_esc(s.title)}</div>
          <div class="imported-sermon-meta">
            ${s.author ? _esc(s.author) + ' · ' : ''}
            ${s.paras.length} paragraphs ·
            ${new Date(s.addedAt).toLocaleDateString()}
          </div>
        </div>
        <span class="imported-sermon-del"
          onclick="event.stopPropagation();fix11DeleteSermon('${s.id}')"
          title="Remove">✕</span>
      </div>`).join('');
  }

  window.fix11OpenSermon = function (id) {
    const list   = _loadSermons();
    const sermon = list.find(s => s.id === id);
    if (!sermon) return;

    window._readerTitle  = sermon.title;
    window._readerAuthor = sermon.author || '';
    if (window._selectedParas) window._selectedParas.clear();

    window._readerParas = sermon.paras.map((text, i) => ({
      text, section: sermon.title, idx: i,
    }));

    if (typeof window._renderReaderParas === 'function') {
      window._renderReaderParas();
    }

    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = sermon.title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window.fix11DeleteSermon = function (id) {
    const list    = _loadSermons();
    const updated = list.filter(s => s.id !== id);
    try { localStorage.setItem(SERMON_KEY, JSON.stringify(updated)); } catch(e) {}
    _refreshImportedList();
    if (typeof showSchToast === 'function') showSchToast('Sermon removed');
  };

  /* Build / refresh the imported sermons section every time The Table opens */
  function _ensureImportedSection() {
    const readerBody = document.querySelector('#tt-reader .modal-body, #tt-reader .db-scroll');
    if (!readerBody) return;

    /* Try to find the search bar to insert after */
    let anchor = readerBody.querySelector('.db-scroll') || readerBody;

    if (!document.getElementById('imported-sermon-list')) {
      const sec = document.createElement('div');
      sec.style.cssText = 'margin:4px 0 10px;';
      sec.innerHTML = `
        <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;
          color:var(--gold-dim,#8a6a20);text-transform:uppercase;margin-bottom:5px;">
          📚 Your Imported Sermons
        </div>
        <div id="imported-sermon-list"></div>`;
      anchor.appendChild(sec);
    }

    _refreshImportedList();
    _watchReaderForSave();
  }

  /* Patch openTheTable to wire up the section */
  const _origOpenTable = window.openTheTable;
  window.openTheTable = function () {
    if (_origOpenTable) _origOpenTable();
    setTimeout(_ensureImportedSection, 200);
  };

  /* On page load, immediately make saved sermons available */
  (function _restoreOnLoad() {
    /* The table isn't open yet, but we pre-load into a global so
       _renderReaderParas can be called when the table does open */
    window._savedSermons = _loadSermons();
  })();


  /* ══════════════════════════════════════════════════════════
     FIX 2a — CLOCK DRAG (proper hit-testing)
     ──────────────────────────────────────────────────────────
     The out-clock sits INSIDE out-screen which is a flex child.
     We need coordinates relative to out-screen only.
     We also strip the pos-* CSS class on first drag so the
     existing CSS rule doesn't fight our inline positioning.
  ══════════════════════════════════════════════════════════ */

  let _ckDrag = { active: false, startMX: 0, startMY: 0, startEL: 0, startET: 0 };

  function rewireDraggableClock() {
    const ck     = document.getElementById('out-clock');
    const screen = document.getElementById('out-screen');
    if (!ck || !screen) return;
    if (ck.dataset.fix11drag) return;
    ck.dataset.fix11drag = '1';

    /* Restore persisted position */
    const saved = localStorage.getItem('bw_clock_xy_11');
    if (saved) {
      try {
        const {px, py} = JSON.parse(saved);
        _setClockAbsolute(ck, screen, px, py);
      } catch(e) {}
    }

    /* Mouse */
    ck.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      const sr   = screen.getBoundingClientRect();
      const ckr  = ck.getBoundingClientRect();
      _ckDrag.active = true;
      _ckDrag.startMX = e.clientX;
      _ckDrag.startMY = e.clientY;
      _ckDrag.startEL = ckr.left - sr.left;
      _ckDrag.startET = ckr.top  - sr.top;
      ck.classList.add('dragging');

      /* Strip the CSS position class and switch to absolute */
      ck.className = ck.className.replace(/\bpos-\S+/g, '').trim() + ' dragging';
      ck.style.position = 'absolute';
      ck.style.left   = _ckDrag.startEL + 'px';
      ck.style.top    = _ckDrag.startET + 'px';
      ck.style.right  = 'auto';
      ck.style.bottom = 'auto';
    });

    document.addEventListener('mousemove', e => {
      if (!_ckDrag.active) return;
      const sr  = screen.getBoundingClientRect();
      const dx  = e.clientX - _ckDrag.startMX;
      const dy  = e.clientY - _ckDrag.startMY;
      const nx  = Math.max(0, Math.min(sr.width  - ck.offsetWidth,  _ckDrag.startEL + dx));
      const ny  = Math.max(0, Math.min(sr.height - ck.offsetHeight, _ckDrag.startET + dy));
      ck.style.left = nx + 'px';
      ck.style.top  = ny + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!_ckDrag.active) return;
      _ckDrag.active = false;
      ck.classList.remove('dragging');

      const sr  = screen.getBoundingClientRect();
      const px  = parseFloat(ck.style.left) / sr.width  * 100;
      const py  = parseFloat(ck.style.top)  / sr.height * 100;
      localStorage.setItem('bw_clock_xy_11', JSON.stringify({px, py}));
      _pushClockPosToProjection(parseFloat(ck.style.left) / sr.width,
                                 parseFloat(ck.style.top)  / sr.height);
    });

    /* Touch */
    ck.addEventListener('touchstart', e => {
      const t = e.touches[0];
      ck.dispatchEvent(new MouseEvent('mousedown', {clientX:t.clientX, clientY:t.clientY, bubbles:true}));
    }, {passive:false});
    document.addEventListener('touchmove', e => {
      if (!_ckDrag.active) return;
      const t = e.touches[0];
      document.dispatchEvent(new MouseEvent('mousemove', {clientX:t.clientX, clientY:t.clientY}));
    }, {passive:true});
    document.addEventListener('touchend', () => {
      if (_ckDrag.active) document.dispatchEvent(new MouseEvent('mouseup'));
    }, {passive:true});
  }

  function _setClockAbsolute(ck, screen, pxPct, pyPct) {
    const sr = screen.getBoundingClientRect();
    ck.style.position = 'absolute';
    ck.style.left   = (pxPct / 100 * sr.width) + 'px';
    ck.style.top    = (pyPct / 100 * sr.height) + 'px';
    ck.style.right  = 'auto';
    ck.style.bottom = 'auto';
    ck.className    = ck.className.replace(/\bpos-\S+/g, '').trim();
  }

  /* Push clock position to the virtual canvas in the projection window */
  function _pushClockPosToProjection(fracX, fracY) {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;
    /* 1920 × 1080 virtual canvas */
    const vx = Math.round(fracX * 1920);
    const vy = Math.round(fracY * 1080);
    pc.style.position = 'fixed';
    pc.style.left     = vx + 'px';
    pc.style.top      = vy + 'px';
    pc.style.right    = 'auto';
    pc.style.bottom   = 'auto';
    try { localStorage.setItem('bw_clock_proj_xy', JSON.stringify({x:vx, y:vy})); } catch(e) {}
  }

  /* Restore saved clock position in the projection window after it opens */
  function _restoreClockPosOnProj() {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    try {
      const saved = JSON.parse(localStorage.getItem('bw_clock_proj_xy') || 'null');
      if (!saved) return;
      const pc = pw.document.getElementById('proj-clock');
      if (!pc) return;
      pc.style.position = 'fixed';
      pc.style.left     = saved.x + 'px';
      pc.style.top      = saved.y + 'px';
      pc.style.right    = 'auto';
      pc.style.bottom   = 'auto';
    } catch(e) {}
  }


  /* ══════════════════════════════════════════════════════════
     FIX 2b — CLOCK FONT → SECOND SCREEN
     ──────────────────────────────────────────────────────────
     The root cause: pushClockToProj() in BrideWorship.js sets
     cssText on proj-clock, which overwrites any font-family we
     set afterwards. We patch pushClockToProj to append the font.
  ══════════════════════════════════════════════════════════ */

  function _getClockFont() {
    return localStorage.getItem('bw_clock_font') || 'Cinzel';
  }

  /* Patch pushClockToProj (defined in BrideWorship.js) */
  const _origPushClock = window.pushClockToProj;
  if (typeof _origPushClock === 'function') {
    window.pushClockToProj = function (str) {
      _origPushClock(str);
      const pw = S?.projWin;
      if (!pw || pw.closed) return;
      const pc = pw.document.getElementById('proj-clock');
      if (pc) {
        pc.style.fontFamily = `'${_getClockFont()}', monospace`;
        pc.style.fontWeight = '700';
        /* Restore saved position if clock gets repositioned by the tick */
        try {
          const saved = JSON.parse(localStorage.getItem('bw_clock_proj_xy') || 'null');
          if (saved) {
            pc.style.position = 'fixed';
            pc.style.left = saved.x + 'px'; pc.style.top = saved.y + 'px';
            pc.style.right = 'auto'; pc.style.bottom = 'auto';
          }
        } catch(e) {}
      }
    };
  }

  /* Also patch pushStageTimer/stg-clock for the stage display font */
  const _origPushStage = window.pushStage;
  if (typeof _origPushStage === 'function') {
    window.pushStage = function () {
      _origPushStage();
      const sw = S?.stageWin;
      if (!sw || sw.closed) return;
      const sc = sw.document.getElementById('stg-clock');
      if (sc) sc.style.fontFamily = `'${_getClockFont()}', monospace`;
    };
  }

  /* Ensure font is reapplied whenever the clock font dropdown changes */
  const _origClockFontChange = window.clockFontChange;
  window.clockFontChange = function (font) {
    if (_origClockFontChange) _origClockFontChange(font);
    /* Force immediate push to proj window */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const pc = pw.document.getElementById('proj-clock');
      if (pc) { pc.style.fontFamily = `'${font}', monospace`; pc.style.fontWeight = '700'; }
    }
  };

  /* Re-apply after openProjection */
  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      setTimeout(() => {
        _restoreClockPosOnProj();
        const pw = S?.projWin;
        if (!pw || pw.closed) return;
        const pc = pw.document.getElementById('proj-clock');
        if (pc) { pc.style.fontFamily = `'${_getClockFont()}', monospace`; pc.style.fontWeight = '700'; }
      }, 900);
    };
  }


  /* ══════════════════════════════════════════════════════════
     FIX 3 — STICKY SELECTION BAR (already in CSS above)
     The bar needs to live INSIDE the scrolling container.
     If it's outside the scroll, sticky won't work. We move it
     to be the first child of the scroll container.
  ══════════════════════════════════════════════════════════ */

  function _fixSelBarPosition() {
    const bar = document.getElementById('reader-sel-bar');
    if (!bar || bar.dataset.fix11) return;
    bar.dataset.fix11 = '1';

    /* Find the scrolling parent (db-scroll or modal-body) */
    const scrollParent = bar.closest('.db-scroll, .modal-body');
    if (!scrollParent) return;

    /* Move bar to be the very first child of the scroll container */
    scrollParent.insertBefore(bar, scrollParent.firstChild);
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    /* Clock drag — retry until the elements exist */
    let attempts = 0;
    const tryWire = setInterval(() => {
      rewireDraggableClock();
      if (document.getElementById('out-clock')?.dataset.fix11drag || ++attempts > 20)
        clearInterval(tryWire);
    }, 400);

    /* Also wire after any projection window opens */
    const _oOP = window.openProjection;
    if (typeof _oOP === 'function') {
      window.openProjection = async function () {
        await _oOP();
        setTimeout(() => {
          _restoreClockPosOnProj();
          const pw = S?.projWin;
          if (pw && !pw.closed) {
            const pc = pw.document.getElementById('proj-clock');
            if (pc) { pc.style.fontFamily=`'${_getClockFont()}',monospace`; pc.style.fontWeight='700'; }
          }
        }, 900);
      };
    }

    console.info('[BW fix11] ✓ Sermons persist  ✓ Clock drag+font  ✓ Sticky sel-bar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { setTimeout(boot, 350); }

  /* Also run _ensureImportedSection and _fixSelBarPosition every time
     The Table is opened (in case DOM wasn't ready on first load) */
  const _origOT2 = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT2) _origOT2();
    setTimeout(() => {
      _ensureImportedSection();
      _fixSelBarPosition();
    }, 250);
  };


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();