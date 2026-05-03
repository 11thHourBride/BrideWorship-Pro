/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix24.js
   Three features:
   1. Templates — applying any template (preset or custom)
      immediately pushes every style property to the
      projection and stage windows.
   2. Second text box — a draggable "Lower Box" that sits
      below the main slide content in the Output Preview
      and is mirrored to the projection window. Users type
      freely (announcement, scripture ref, etc.).
   3. Decoration toggles — "Show Title" and "Show Header"
      checkboxes added to the existing Decorations section
      so the song title / section label can be hidden on
      the projected output.
═══════════════════════════════════════════════════════════ */

(function BW_Fix24() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _css = document.createElement('style');
  _css.id = 'bw-fix24-css';
  _css.textContent = `

  /* ── Second text box ────────────────────────────────────── */
  #f23-lower-wrap {
    margin-top: 8px;
  }

  #f23-lower-label {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--gold-dim, #8a6a20);
    text-transform: uppercase;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #f23-lower-screen {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #08051a;
    border-radius: 4px;
    border: 1px solid var(--border-dim);
    overflow: hidden;
    cursor: text;
  }

  #f23-lower-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }

  #f23-lower-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 22%;
    background: rgba(0,0,0,.55);
    padding: 6px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ns-resize;
    border-top: 1px solid rgba(201,168,76,.2);
  }

  #f23-lower-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 10px;
    font-family: 'Lato', sans-serif;
    text-align: center;
    resize: none;
    line-height: 1.5;
    min-height: 24px;
  }
  #f23-lower-input::placeholder { color: rgba(255,255,255,.3); }

  .f23-lb-row {
    display: flex;
    gap: 5px;
    margin-top: 5px;
    flex-wrap: wrap;
  }
  .f23-lb-btn {
    flex: 1;
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid var(--border-dim);
    background: var(--bg-card);
    color: var(--text-2);
    font-size: 11px;
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    transition: all .12s;
    white-space: nowrap;
  }
  .f23-lb-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
  .f23-lb-btn.send  { background: var(--gold,#c9a84c); border-color: var(--gold,#c9a84c); color:#000; font-weight:700; }
  .f23-lb-btn.clear { border-color: rgba(224,80,80,.3); color: var(--red,#e05050); }

  /* Height resize handle */
  #f23-resize-handle {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    cursor: ns-resize;
    background: transparent;
  }
  #f23-resize-handle:hover { background: rgba(201,168,76,.2); }

  /* ── Decoration toggles (injected into existing section) ── */
  .f23-deco-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 5px;
  }
  .f23-deco-label {
    font-size: 11px;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  /* ── Proj lower box overlay ─────────────────────────────── */
  /* Injected into projection window via JS */
  .f23-proj-lower {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    z-index: 90;
    border-top: 1px solid rgba(201,168,76,.15);
    min-height: 10%;
    transition: min-height .2s;
  }
  .f23-proj-lower-text {
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: clamp(14px, 2.5vw, 32px);
    text-align: center;
    line-height: 1.5;
    white-space: pre-wrap;
    text-shadow: 0 1px 4px rgba(0,0,0,.8);
  }
  `;
  document.head.appendChild(_css);


  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */

  function _projWin()  { return window.S?.projWin; }
  function _stageWin() { return window.S?.stageWin; }
  function _toast(m)   { if (typeof window.showSchToast === 'function') window.showSchToast(m); }


  /* ══════════════════════════════════════════════════════════
     1 — TEMPLATE → SECOND SCREEN SYNC
     ──────────────────────────────────────────────────────────
     Root cause: applySelectedTemplate() / editorApplyAndClose()
     update the main-slide's CSS variables and inline styles
     but never push anything to proj-window or stage-window.

     Fix: patch every template-apply function. After the
     original runs, snapshot the relevant CSS from the main
     slide and push it to the projection window.
  ══════════════════════════════════════════════════════════ */

  /* Collect the computed styles we need to mirror */
  function _snapshotSlideStyles() {
    const slide = document.getElementById('main-slide');
    const bg    = document.getElementById('slide-bg');
    const grid  = document.getElementById('slide-grid');
    const text  = document.getElementById('s-text');
    const title = document.getElementById('s-title');
    const foot  = document.getElementById('s-footer');
    if (!slide) return null;

    const cs = window.getComputedStyle(slide);

    return {
      /* Background */
      slideBg:         bg    ? bg.style.background    || bg.style.backgroundImage || cs.background : '',
      slideBgColor:    cs.backgroundColor,
      /* Text */
      textColor:       text  ? window.getComputedStyle(text).color : cs.color,
      titleColor:      title ? window.getComputedStyle(title).color : '',
      footerColor:     foot  ? window.getComputedStyle(foot).color : '',
      textAlign:       text  ? window.getComputedStyle(text).textAlign : 'center',
      fontFamily:      text  ? window.getComputedStyle(text).fontFamily : cs.fontFamily,
      /* Grid lines */
      gridDisplay:     grid  ? window.getComputedStyle(grid).display : 'none',
      /* Inline background (theme engine sets this) */
      slideBgInline:   bg    ? bg.getAttribute('style') || '' : '',
      /* CSS custom properties on main-slide */
      vars: _getCSSVars(slide),
    };
  }

  function _getCSSVars(el) {
    /* Grab any CSS custom properties set inline on the element */
    const style = el.getAttribute('style') || '';
    const vars  = {};
    const re    = /--([\w-]+)\s*:\s*([^;]+)/g;
    let m;
    while ((m = re.exec(style)) !== null) vars['--' + m[1]] = m[2].trim();
    return vars;
  }

  function _pushStylesToProj(snap) {
    if (!snap) return;

    const pw = _projWin();
    if (!pw || pw.closed) return;

    const pd  = pw.document;
    const pSlide = pd.getElementById('main-slide') || pd.querySelector('.main-slide');
    const pBg    = pd.getElementById('slide-bg');
    const pGrid  = pd.getElementById('slide-grid');
    const pText  = pd.getElementById('s-text');
    const pTitle = pd.getElementById('s-title');
    const pFoot  = pd.getElementById('s-footer');

    /* Apply CSS vars to projection main-slide */
    if (pSlide) {
      Object.entries(snap.vars).forEach(([k, v]) => pSlide.style.setProperty(k, v));
    }

    /* Background */
    if (pBg && snap.slideBgInline) pBg.setAttribute('style', snap.slideBgInline);

    /* Text styles */
    if (pText) {
      pText.style.color      = snap.textColor;
      pText.style.textAlign  = snap.textAlign;
      pText.style.fontFamily = snap.fontFamily;
    }
    if (pTitle) pTitle.style.color = snap.titleColor;
    if (pFoot)  pFoot.style.color  = snap.footerColor;

    /* Grid */
    if (pGrid) pGrid.style.display = snap.gridDisplay;

    /* Also push the theme class if any */
    const mainSlide = document.getElementById('main-slide');
    if (mainSlide && pSlide) {
      /* Mirror class list (theme classes like "theme-dark", "bg-*" etc.) */
      const themeClasses = [...mainSlide.classList].filter(c =>
        c.startsWith('theme-') || c.startsWith('bg-') || c.startsWith('trans-')
      );
      themeClasses.forEach(c => pSlide.classList.add(c));
    }
  }

  /* Wrap every template-apply entry point */
  function _wrapTemplateFns() {
    const fns = [
      'applySelectedTemplate',
      'editorApplyAndClose',
      'editorSaveAndApply',
      'applyTemplate',
      'applyTheme',
      'pickTheme',
    ];

    fns.forEach(fn => {
      const orig = window[fn];
      if (typeof orig !== 'function' || orig._f23wrapped) return;
      window[fn] = function (...args) {
        const result = orig.apply(this, args);
        /* Push after a short delay so the original has time to paint */
        setTimeout(() => {
          const snap = _snapshotSlideStyles();
          _pushStylesToProj(snap);
          _pushThemeToStage(snap);
        }, 150);
        return result;
      };
      window[fn]._f23wrapped = true;
    });
  }

  function _pushThemeToStage(snap) {
    const sw = _stageWin();
    if (!sw || sw.closed || !snap) return;
    const sd  = sw.document;
    const sBg = sd.getElementById('slide-bg') || sd.querySelector('.out-bg');
    if (sBg && snap.slideBgInline) sBg.setAttribute('style', snap.slideBgInline);
  }

  /* Also patch the theme grid (theme-grid click handler) */
  function _patchThemeGrid() {
    const grid = document.getElementById('theme-grid');
    if (!grid || grid.dataset.f23) return;
    grid.dataset.f23 = '1';
    grid.addEventListener('click', () => {
      setTimeout(() => {
        const snap = _snapshotSlideStyles();
        _pushStylesToProj(snap);
        _pushThemeToStage(snap);
      }, 200);
    });
  }

  /* Re-push every time projection window opens */
  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      setTimeout(() => {
        const snap = _snapshotSlideStyles();
        _pushStylesToProj(snap);
      }, 900);
    };
  }


  /* ══════════════════════════════════════════════════════════
     2 — SECOND TEXT BOX (Lower Box)
     ──────────────────────────────────────────────────────────
     Added below the existing Output Preview. Sends text to a
     fixed overlay at the bottom of the projection window.
  ══════════════════════════════════════════════════════════ */

  let _lowerBoxActive = false;
  let _lowerText      = '';
  let _lowerHeightPct = 18; /* % of projection height */

  function _buildLowerBox() {
    const outWrap = document.getElementById('out-wrap-sticky');
    if (!outWrap || document.getElementById('f23-lower-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'f23-lower-wrap';
    wrap.innerHTML = `
      <div id="f23-lower-label">
        <span>✦ Lower Text Box</span>
        <label style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text-3);cursor:pointer;font-family:'Lato',sans-serif;letter-spacing:0;text-transform:none;">
          <input type="checkbox" id="f23-lower-live" onchange="f23LowerToggle(this.checked)">
          Show on screen
        </label>
      </div>
      <div id="f23-lower-screen">
        <div id="f23-lower-bg"></div>
        <!-- Resize handle -->
        <div id="f23-lower-box">
          <div id="f23-resize-handle"></div>
          <textarea id="f23-lower-input"
            rows="2"
            placeholder="Type announcement, scripture ref, name…"
            oninput="f23LowerInput(this.value)"></textarea>
        </div>
      </div>
      <div class="f23-lb-row">
        <button class="f23-lb-btn send"  onclick="f23LowerSend()">▶ Send to Screen</button>
        <button class="f23-lb-btn"       onclick="f23LowerUpdate()">↺ Update</button>
        <button class="f23-lb-btn clear" onclick="f23LowerClear()">✕ Clear</button>
      </div>
      <div style="margin-top:5px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <span style="font-size:10px;color:var(--text-3);">Box height:</span>
        <input type="range" min="8" max="40" value="18" style="flex:1;accent-color:var(--gold,#c9a84c);"
          oninput="f23LowerHeight(this.value)" id="f23-height-slider">
        <span id="f23-height-val" style="font-size:10px;color:var(--gold,#c9a84c);min-width:30px;">18%</span>
      </div>
      <div style="margin-top:5px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <span style="font-size:10px;color:var(--text-3);">Font size:</span>
        <input type="range" min="12" max="60" value="28" style="flex:1;accent-color:var(--gold,#c9a84c);"
          oninput="f23LowerFontSize(this.value)" id="f23-lower-fs">
        <span id="f23-lower-fs-val" style="font-size:10px;color:var(--gold,#c9a84c);min-width:30px;">28px</span>
      </div>
    `;

    outWrap.appendChild(wrap);

    /* Mirror the slide background into the lower preview */
    _syncLowerBg();

    /* Resize handle drag */
    _wireLowerResize();
  }

  function _syncLowerBg() {
    const mainBg  = document.getElementById('out-bg');
    const lowerBg = document.getElementById('f23-lower-bg');
    if (!mainBg || !lowerBg) return;
    lowerBg.setAttribute('style', mainBg.getAttribute('style') || '');
    lowerBg.style.opacity = '.5';
  }

  function _wireLowerResize() {
    const handle = document.getElementById('f23-resize-handle');
    const box    = document.getElementById('f23-lower-box');
    const screen = document.getElementById('f23-lower-screen');
    if (!handle || !box || !screen) return;
    if (handle.dataset.wired) return;
    handle.dataset.wired = '1';

    let startY, startH;

    handle.addEventListener('pointerdown', e => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      startY = e.clientY;
      startH = box.offsetHeight;
    });

    handle.addEventListener('pointermove', e => {
      if (!handle.hasPointerCapture(e.pointerId)) return;
      const dy   = startY - e.clientY; // dragging up = bigger
      const newH = Math.max(30, Math.min(screen.offsetHeight * 0.6, startH + dy));
      box.style.minHeight = newH + 'px';
      _lowerHeightPct = Math.round(newH / screen.offsetHeight * 100);
      _pushLowerToProj();
    });

    handle.addEventListener('pointerup', e => {
      if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
    });
  }

  /* Global handlers */
  window.f23LowerInput = function(val) { _lowerText = val; };

  window.f23LowerToggle = function(on) {
    _lowerBoxActive = on;
    _pushLowerToProj();
  };

  window.f23LowerSend = function() {
    const inp = document.getElementById('f23-lower-input');
    if (inp) _lowerText = inp.value;
    _lowerBoxActive = true;
    const chk = document.getElementById('f23-lower-live');
    if (chk) chk.checked = true;
    _pushLowerToProj();
    _toast('Lower box sent to screen');
  };

  window.f23LowerUpdate = function() {
    const inp = document.getElementById('f23-lower-input');
    if (inp) _lowerText = inp.value;
    _pushLowerToProj();
    _toast('Lower box updated');
  };

  window.f23LowerClear = function() {
    _lowerText = '';
    _lowerBoxActive = false;
    const inp = document.getElementById('f23-lower-input');
    if (inp) inp.value = '';
    const chk = document.getElementById('f23-lower-live');
    if (chk) chk.checked = false;
    _pushLowerToProj();
    _toast('Lower box cleared');
  };

  window.f23LowerHeight = function(v) {
    _lowerHeightPct = parseInt(v);
    const val = document.getElementById('f23-height-val');
    if (val) val.textContent = v + '%';
    _pushLowerToProj();
  };

  let _lowerFontSize = 28;
  window.f23LowerFontSize = function(v) {
    _lowerFontSize = parseInt(v);
    const val = document.getElementById('f23-lower-fs-val');
    if (val) val.textContent = v + 'px';
    _pushLowerToProj();
  };

  function _ensureProjLowerEl(pw) {
    const pd = pw.document;
    let el = pd.getElementById('f23-proj-lower');
    if (!el) {
      el = pd.createElement('div');
      el.id        = 'f23-proj-lower';
      el.className = 'f23-proj-lower';
      /* Inject styles into proj window */
      if (!pd.getElementById('f23-proj-css')) {
        const s = pd.createElement('style');
        s.id = 'f23-proj-css';
        s.textContent = `
          .f23-proj-lower {
            position:fixed;bottom:0;left:0;right:0;
            background:rgba(0,0,0,.6);
            display:flex;align-items:center;justify-content:center;
            padding:12px 20px;z-index:90;
            border-top:1px solid rgba(201,168,76,.15);
            transition:min-height .2s;
          }
          .f23-proj-lower-text {
            color:#fff;font-family:'Lato',sans-serif;
            text-align:center;line-height:1.5;white-space:pre-wrap;
            text-shadow:0 1px 4px rgba(0,0,0,.8);
          }`;
        pd.head.appendChild(s);
      }
      const innerText = pd.createElement('div');
      innerText.className = 'f23-proj-lower-text';
      innerText.id = 'f23-proj-lower-text';
      el.appendChild(innerText);
      pd.body.appendChild(el);
    }
    return el;
  }

  function _pushLowerToProj() {
    const pw = _projWin();
    if (!pw || pw.closed) return;

    const el = _ensureProjLowerEl(pw);
    const tx = pw.document.getElementById('f23-proj-lower-text');

    el.style.display    = _lowerBoxActive ? 'flex' : 'none';
    el.style.minHeight  = _lowerHeightPct + 'vh';
    if (tx) {
      tx.textContent    = _lowerText;
      tx.style.fontSize = _lowerFontSize + 'px';
    }
  }

  /* Keep lower bg in sync with slide bg changes */
  const _bgObserver = new MutationObserver(() => _syncLowerBg());


  /* ══════════════════════════════════════════════════════════
     3 — DECORATION TOGGLES: SHOW TITLE / SHOW HEADER
  ══════════════════════════════════════════════════════════ */

  function _buildDecoToggles() {
    /* Find the existing decorations section in the right panel */
    const decoSection = _findDecoSection();
    if (!decoSection || decoSection.dataset.f23deco) return;
    decoSection.dataset.f23deco = '1';

    /* Load saved states */
    const showTitle  = localStorage.getItem('f23_show_title')  !== '0';
    const showHeader = localStorage.getItem('f23_show_header') !== '0';

    const row = document.createElement('div');
    row.className = 'f23-deco-row';
    row.innerHTML = `
      <label class="f23-deco-label">
        <input type="checkbox" id="f23-show-title"
          ${showTitle ? 'checked' : ''}
          onchange="f23ToggleTitle(this.checked)">
        Song Title
      </label>
      <label class="f23-deco-label">
        <input type="checkbox" id="f23-show-header"
          ${showHeader ? 'checked' : ''}
          onchange="f23ToggleHeader(this.checked)">
        Section Header
      </label>
    `;
    decoSection.appendChild(row);

    /* Apply saved states immediately */
    _applyTitleVis(showTitle);
    _applyHeaderVis(showHeader);
  }

  function _findDecoSection() {
    /* Look for the div that contains #deco-grid or #deco-corners */
    const decoGrid = document.getElementById('deco-grid');
    if (decoGrid) {
      /* Walk up to the containing flex/block wrapper */
      let p = decoGrid.parentElement;
      while (p && !p.classList.contains('r-acc-body') && p.tagName !== 'SECTION') {
        p = p.parentElement;
        if (!p) break;
      }
      return p || decoGrid.parentElement;
    }
    /* Fallback: find by label text */
    const allLabels = [...document.querySelectorAll('.fmt-label, label')];
    const decoLabel = allLabels.find(el => /grid lines|corners/i.test(el.textContent));
    return decoLabel?.closest('.r-acc-body, .r-section, section');
  }

  /* Apply to local preview */
  function _applyTitleVis(on) {
    const el = document.getElementById('s-title');
    if (el) el.style.display = on ? '' : 'none';
    _pushVisToProj('title', on);
  }

  function _applyHeaderVis(on) {
    /* The section header appears as the footer label (e.g. "VERSE 1") */
    const el = document.getElementById('s-footer');
    if (el) el.style.visibility = on ? '' : 'hidden';
    _pushVisToProj('header', on);
  }

  function _pushVisToProj(which, on) {
    const pw = _projWin();
    if (!pw || pw.closed) return;
    const pd = pw.document;
    if (which === 'title') {
      const el = pd.getElementById('s-title');
      if (el) el.style.display = on ? '' : 'none';
    }
    if (which === 'header') {
      const el = pd.getElementById('s-footer');
      if (el) el.style.visibility = on ? '' : 'hidden';
    }
    /* Stage display */
    const sw = _stageWin();
    if (!sw || sw.closed) return;
    const sd = sw.document;
    if (which === 'title') {
      const el = sd.getElementById('s-title') || sd.querySelector('.slide-song-title');
      if (el) el.style.display = on ? '' : 'none';
    }
    if (which === 'header') {
      const el = sd.getElementById('s-footer') || sd.querySelector('.slide-footer');
      if (el) el.style.visibility = on ? '' : 'hidden';
    }
  }

  window.f23ToggleTitle = function(on) {
    localStorage.setItem('f23_show_title', on ? '1' : '0');
    _applyTitleVis(on);
  };

  window.f23ToggleHeader = function(on) {
    localStorage.setItem('f23_show_header', on ? '1' : '0');
    _applyHeaderVis(on);
  };

  /* Re-apply after every slide render */
  const _origRenderSlide = window.renderSlide;
  if (typeof _origRenderSlide === 'function') {
    window.renderSlide = function (...args) {
      const r = _origRenderSlide.apply(this, args);
      const showTitle  = localStorage.getItem('f23_show_title')  !== '0';
      const showHeader = localStorage.getItem('f23_show_header') !== '0';
      _applyTitleVis(showTitle);
      _applyHeaderVis(showHeader);
      /* Also re-push template styles */
      setTimeout(() => {
        const snap = _snapshotSlideStyles();
        _pushStylesToProj(snap);
      }, 80);
      return r;
    };
  }

  /* Re-apply after projection window opens */
  const _origOP2 = window.openProjection;
  if (typeof _origOP2 === 'function' && !_origOP2._f23) {
    window.openProjection = async function (...args) {
      await _origOP2.apply(this, args);
      setTimeout(() => {
        const showTitle  = localStorage.getItem('f23_show_title')  !== '0';
        const showHeader = localStorage.getItem('f23_show_header') !== '0';
        _pushVisToProj('title',  showTitle);
        _pushVisToProj('header', showHeader);
        const snap = _snapshotSlideStyles();
        _pushStylesToProj(snap);
        _pushLowerToProj();
      }, 1000);
    };
    window.openProjection._f23 = true;
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    /* 1. Wrap template functions */
    _wrapTemplateFns();

    /* 2. Build lower box */
    let attempts = 0;
    const t = setInterval(() => {
      _buildLowerBox();
      _patchThemeGrid();
      if (document.getElementById('f23-lower-wrap') || ++attempts > 20) clearInterval(t);
    }, 400);

    /* 3. Build deco toggles */
    /* Settings accordion opens lazily — try on openSettings */
    const _origOS = window.openSettings;
    window.openSettings = function (...args) {
      if (typeof _origOS === 'function') _origOS.apply(this, args);
      setTimeout(_buildDecoToggles, 200);
    };

    /* Also try immediately (right panel may already be rendered) */
    setTimeout(_buildDecoToggles, 600);
    setTimeout(_buildDecoToggles, 1500);

    /* Observe accordion opens in right panel */
    const rightPanel = document.querySelector('.right, #right-inner-scroll');
    if (rightPanel) {
      new MutationObserver(_buildDecoToggles)
        .observe(rightPanel, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    }

    /* Watch bg changes to keep lower preview in sync */
    const outBg = document.getElementById('out-bg');
    if (outBg) _bgObserver.observe(outBg, { attributes: true, attributeFilter: ['style', 'class'] });

    console.info('[BW fix24] ✓ Template→2nd screen  ✓ Lower box  ✓ Title/Header toggles');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 400);

})();
