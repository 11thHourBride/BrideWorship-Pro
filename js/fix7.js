/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix7.js
   Fix 1 : Projection window text auto-fills the screen.
           Font size scales to fill available space, updates
           live on every slide change.
   Fix 2 : Timer font-size +/- controls in the timer panel.
   Fix 3 : System font detection (Local Font Access API +
           curated fallback list) + import your own font
           files (.ttf / .otf / .woff / .woff2) — all added
           to the Font selector in Text Style and Templates.
═══════════════════════════════════════════════════════════ */

(function BW_Fix7() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix7-styles';
  _style.textContent = `

    /* ── Timer font-size controls ─────────────────────────── */
    #timer-size-ctrl {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
    }
    .timer-sz-label {
      font-size: 11px;
      color: var(--text-3);
      white-space: nowrap;
    }
    .timer-sz-btn {
      width: 26px; height: 26px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 15px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background .1s;
      line-height: 1;
    }
    .timer-sz-btn:hover  { background: var(--bg-hover); }
    .timer-sz-btn:active { opacity: .6; }
    #timer-sz-val {
      font-size: 12px;
      color: var(--text-2);
      min-width: 32px;
      text-align: center;
    }

    /* ── Font manager section ─────────────────────────────── */
    #font-manager-section {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .fm-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: var(--gold-dim, #8a6a20);
      text-transform: uppercase;
    }
    .fm-row {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    #fm-font-sel {
      flex: 1;
      min-width: 0;
    }
    .fm-import-btn {
      flex-shrink: 0;
      padding: 5px 9px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-2);
      font-size: 11px;
      cursor: pointer;
      white-space: nowrap;
      transition: background .1s, border-color .15s;
    }
    .fm-import-btn:hover {
      background: var(--bg-hover);
      border-color: var(--gold-dim);
      color: var(--gold);
    }
    .fm-scan-btn {
      flex-shrink: 0;
      padding: 5px 9px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-2);
      font-size: 11px;
      cursor: pointer;
      white-space: nowrap;
      transition: background .1s;
    }
    .fm-scan-btn:hover { background: var(--bg-hover); }
    .fm-apply-btn {
      flex-shrink: 0;
      padding: 5px 10px;
      background: var(--gold, #c9a84c);
      border: none;
      border-radius: 4px;
      color: #000;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity .15s;
    }
    .fm-apply-btn:hover { opacity: .85; }
    #fm-preview {
      padding: 8px 10px;
      background: var(--bg-deep, #09090f);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      font-size: 18px;
      color: #f6f2ec;
      text-align: center;
      min-height: 40px;
      transition: font-family .2s;
      word-break: break-word;
    }
    #fm-status {
      font-size: 10px;
      color: var(--text-3);
      min-height: 14px;
    }

    /* Imported font chips */
    .fm-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .fm-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 12px;
      font-size: 10px;
      color: var(--text-2);
      cursor: pointer;
      transition: border-color .12s;
    }
    .fm-chip:hover        { border-color: var(--gold-dim); }
    .fm-chip.active       { border-color: var(--gold); color: var(--gold); }
    .fm-chip-del {
      font-size: 10px;
      color: var(--text-3);
      cursor: pointer;
      line-height: 1;
      padding: 0 2px;
    }
    .fm-chip-del:hover { color: var(--red, #e05050); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — AUTO-FIT TEXT IN PROJECTION WINDOW
  ══════════════════════════════════════════════════════════ */

  /*
   * Algorithm: measure the projection window's inner size,
   * then binary-search for the largest font-size (px) where
   * the text element doesn't overflow its container.
   * Runs after every push() and on window resize inside projWin.
   */

  const PROJ_FIT_MIN = 14;   // px — never go below this
  const PROJ_FIT_MAX = 220;  // px — never go above this
  const PROJ_PAD_H   = 0.14; // horizontal padding as fraction of width
  const PROJ_PAD_V   = 0.16; // vertical padding as fraction of height

  function fitProjectionText() {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const d   = pw.document;
    const txt = d.getElementById('proj-text');
    const ref = d.getElementById('proj-ref');
    if (!txt) return;

    const W = pw.innerWidth  || d.documentElement.clientWidth  || 1920;
    const H = pw.innerHeight || d.documentElement.clientHeight || 1080;

    /* Available area (subtract ref height, footer, padding) */
    const refH  = ref ? ref.offsetHeight : 0;
    const footH = 30; // estimated footer height
    const availW = W * (1 - PROJ_PAD_H * 2);
    const availH = H * (1 - PROJ_PAD_V * 2) - refH - footH;

    if (availW <= 0 || availH <= 0) return;

    /* Binary search for best font size */
    let lo = PROJ_FIT_MIN, hi = PROJ_FIT_MAX, best = lo;
    txt.style.whiteSpace = 'pre-wrap';
    txt.style.width      = availW + 'px';

    for (let iter = 0; iter < 16; iter++) {
      const mid = Math.floor((lo + hi) / 2);
      txt.style.fontSize = mid + 'px';
      const fits = txt.scrollWidth <= availW + 2 &&
                   txt.scrollHeight <= availH + 2;
      if (fits) { best = mid; lo = mid + 1; }
      else       { hi = mid - 1; }
    }

    txt.style.fontSize = best + 'px';
    txt.style.width    = '';
    txt.style.whiteSpace = '';

    /* Sync the local preview font size indicator */
    const szVal = document.getElementById('sz-val');
    if (szVal) szVal.textContent = best;
    S.fontSize = best;
  }

  /* Patch push() to auto-fit after every slide update */
  const _origPush = window.push;
  window.push = function () {
    if (_origPush) _origPush();
    /* Give the projection window one frame to render, then fit */
    requestAnimationFrame(() => setTimeout(fitProjectionText, 40));
  };

  /* Also fit when the projection window is resized or goes fullscreen */
  const _origOpenProj = window.openProjection;
  window.openProjection = async function () {
    if (_origOpenProj) await _origOpenProj();
    /* Wait for window to paint then fit */
    setTimeout(() => {
      const pw = S?.projWin;
      if (!pw || pw.closed) return;
      pw.addEventListener('resize', fitProjectionText, { passive:true });
      pw.document.addEventListener('fullscreenchange', () =>
        setTimeout(fitProjectionText, 120));
      setTimeout(fitProjectionText, 400);
    }, 800);
  };

  /* Expose for external callers */
  window.fitProjectionText = fitProjectionText;


  /* ══════════════════════════════════════════════════════════
     FIX 2 — TIMER FONT-SIZE CONTROLS
  ══════════════════════════════════════════════════════════ */

  /* Default timer display size (matches .timer-display CSS) */
  let _timerFontPx = 96;

  function buildTimerSizeCtrl() {
    if (document.getElementById('timer-size-ctrl')) return;

    /* Find the timer panel */
    const timerPanel = document.getElementById('timer-view');
    if (!timerPanel) return;

    /* Insert after the .timer-display element */
    const disp = timerPanel.querySelector('.timer-display, #t-display');
    if (!disp) return;

    const wrap = document.createElement('div');
    wrap.id = 'timer-size-ctrl';
    wrap.innerHTML = `
      <span class="timer-sz-label">Timer Size</span>
      <button class="timer-sz-btn" onclick="timerSzChange(-8)">−</button>
      <span id="timer-sz-val">${_timerFontPx}px</span>
      <button class="timer-sz-btn" onclick="timerSzChange(+8)">+</button>
    `;
    disp.insertAdjacentElement('afterend', wrap);

    /* Apply persisted value */
    const saved = parseInt(localStorage.getItem('bw_timer_font') || '0');
    if (saved) { _timerFontPx = saved; _applyTimerFont(); }
  }

  window.timerSzChange = function (delta) {
    _timerFontPx = Math.max(24, Math.min(320, _timerFontPx + delta));
    _applyTimerFont();
    localStorage.setItem('bw_timer_font', String(_timerFontPx));
  };

  function _applyTimerFont() {
    const disp  = document.getElementById('t-display');
    const label = document.getElementById('timer-sz-val');
    if (disp)  disp.style.fontSize  = _timerFontPx + 'px';
    if (label) label.textContent     = _timerFontPx + 'px';

    /* Also scale on projection window */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const ptxt = pw.document.getElementById('proj-text');
      /* Only if timer is currently projected */
      if (ptxt && S?.timer?.projected) {
        ptxt.style.fontSize = _timerFontPx + 'px';
      }
    }

    /* Stage display */
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const stmr = sw.document.getElementById('stg-timer');
      if (stmr) stmr.style.fontSize = Math.round(_timerFontPx * 0.45) + 'px';
    }
  }


  /* ══════════════════════════════════════════════════════════
     FIX 3 — SYSTEM + IMPORTED FONT MANAGER
  ══════════════════════════════════════════════════════════ */

  /* Curated fallback list — fonts commonly installed on
     Windows, macOS, Linux, Android, iOS                    */
  const COMMON_SYSTEM_FONTS = [
    /* Serif */
    'Georgia','Palatino Linotype','Book Antiqua','Times New Roman',
    'Garamond','Didot','Bodoni MT','Baskerville','Cambria',
    'Constantia','Calisto MT','Copperplate','Goudy Old Style',
    'Hoefler Text','Perpetua','Rockwell',
    /* Sans-serif */
    'Arial','Arial Narrow','Arial Black','Helvetica','Helvetica Neue',
    'Verdana','Tahoma','Trebuchet MS','Geneva','Calibri','Candara',
    'Corbel','Franklin Gothic Medium','Gill Sans','Impact',
    'Lucida Sans','Optima','Segoe UI','Myriad Pro',
    /* Monospace */
    'Courier New','Lucida Console','Consolas','Monaco',
    'Andale Mono','Menlo','Cascadia Code',
    /* Display */
    'Copperplate Gothic','Papyrus','Broadway','Rockwell Extra Bold',
    'Stencil','Brush Script MT',
    /* Google Fonts (loaded in app) */
    'Playfair Display','Cinzel','Lato',
    /* Mac-specific */
    'San Francisco','Avenir','Avenir Next','Futura','Gill Sans MT',
    /* Windows-specific */
    'Segoe Print','Segoe Script','Vladimir Script',
  ].sort();

  /* Imported fonts: { name, url, family } */
  let _importedFonts = JSON.parse(
    localStorage.getItem('bw_imported_fonts') || '[]'
  );

  /* All detected/available fonts merged */
  let _allFonts = [];

  /* Load imported fonts into the document */
  function _mountImportedFonts() {
    _importedFonts.forEach(f => {
      if (!document.getElementById('ff-' + _slugify(f.family))) {
        _injectFontFace(f.family, f.url);
      }
    });
  }

  function _injectFontFace(family, url) {
    const s = document.createElement('style');
    s.id = 'ff-' + _slugify(family);
    s.textContent = `@font-face {
      font-family: '${family}';
      src: url('${url}');
      font-display: swap;
    }`;
    document.head.appendChild(s);
  }

  /* ── Detect available fonts ── */
  async function detectSystemFonts() {
    const statusEl = document.getElementById('fm-status');
    if (statusEl) statusEl.textContent = 'Scanning…';

    let detected = [...COMMON_SYSTEM_FONTS];

    /* Try Local Font Access API (Chrome 103+ with flag or permission) */
    if ('queryLocalFonts' in window) {
      try {
        const fonts = await window.queryLocalFonts();
        const families = [...new Set(fonts.map(f => f.family))].sort();
        detected = [...new Set([...families, ...COMMON_SYSTEM_FONTS])].sort();
        if (statusEl) statusEl.textContent =
          `✓ ${families.length} system fonts detected`;
      } catch(e) {
        /* Permission denied or API not available */
        detected = await _canvasDetect();
        if (statusEl) statusEl.textContent =
          `✓ ${detected.length} fonts detected (canvas method)`;
      }
    } else {
      detected = await _canvasDetect();
      if (statusEl) statusEl.textContent =
        `✓ ${detected.length} fonts available`;
    }

    /* Merge with imported fonts */
    const importedNames = _importedFonts.map(f => f.family);
    _allFonts = [...new Set([...detected, ...importedNames])].sort();

    _populateFontSelectors();
    return _allFonts;
  }

  /* Canvas-based font detection — tests if font renders
     differently from a known baseline                      */
  async function _canvasDetect() {
    const canvas  = document.createElement('canvas');
    canvas.width  = 200; canvas.height = 50;
    const ctx     = canvas.getContext('2d');
    const testStr = 'mmmmmmmmmmlli';
    const baseline = 'monospace';
    const size    = '36px';

    function measure(family) {
      ctx.font = `${size} '${family}', ${baseline}`;
      return ctx.measureText(testStr).width;
    }

    const base = measure('__nonexistent__9999');
    const available = [];
    for (const font of COMMON_SYSTEM_FONTS) {
      if (measure(font) !== base) available.push(font);
      /* Yield every 20 fonts to avoid blocking */
      if (available.length % 20 === 0)
        await new Promise(r => setTimeout(r, 0));
    }
    return available;
  }

  /* ── Populate every font <select> in the app ── */
  function _populateFontSelectors() {
    const importedNames = _importedFonts.map(f => f.family);

    /* All font selectors: right-panel, template editor, any future */
    const selectors = [
      '#font-sel',          /* right panel Text Style */
      '#tmpl-font',         /* template editor */
      '#fm-font-sel',       /* font manager */
    ];

    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;

      const currentVal = el.value;

      /* Remove any previously added dynamic options
         (keep the original hardcoded ones)            */
      Array.from(el.options).forEach(opt => {
        if (opt.dataset.dynamic === 'true') el.remove(opt.index);
      });

      /* Group: Imported fonts */
      if (importedNames.length) {
        const grpImp = document.createElement('optgroup');
        grpImp.label = '── Imported Fonts ──';
        importedNames.forEach(name => {
          const opt = document.createElement('option');
          opt.value = name; opt.textContent = name;
          opt.dataset.dynamic = 'true';
          grpImp.appendChild(opt);
        });
        el.appendChild(grpImp);
      }

      /* Group: System fonts */
      if (_allFonts.length) {
        const grpSys = document.createElement('optgroup');
        grpSys.label = '── System Fonts ──';
        _allFonts.forEach(name => {
          if (importedNames.includes(name)) return; /* already above */
          const opt = document.createElement('option');
          opt.value = name; opt.textContent = name;
          opt.dataset.dynamic = 'true';
          grpSys.appendChild(opt);
        });
        el.appendChild(grpSys);
      }

      /* Restore previous selection */
      if (currentVal) el.value = currentVal;
    });

    /* Refresh chip list */
    _renderImportedChips();
  }

  /* ── Import a font file ── */
  function triggerFontImport() {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.multiple = true;
    input.style.display = 'none';
    input.addEventListener('change', _handleFontFiles);
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 10000);
  }

  function _handleFontFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const statusEl = document.getElementById('fm-status');
    let loaded = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const url    = e.target.result; // data URL
        const family = file.name
          .replace(/\.[^.]+$/, '')         // strip extension
          .replace(/[-_]/g, ' ')           // dashes → spaces
          .replace(/\b\w/g, c => c.toUpperCase()); // title-case

        /* Avoid exact duplicates */
        if (_importedFonts.some(f => f.family === family)) {
          loaded++;
          if (loaded === files.length && statusEl)
            statusEl.textContent = `"${family}" already imported`;
          return;
        }

        _injectFontFace(family, url);
        _importedFonts.push({ family, url, name: file.name });

        /* Persist — data URLs can be large; cap at 20 fonts */
        if (_importedFonts.length > 20) _importedFonts.shift();
        try {
          localStorage.setItem('bw_imported_fonts', JSON.stringify(_importedFonts));
        } catch(e) { /* quota exceeded — keep in memory */ }

        if (!_allFonts.includes(family)) _allFonts.unshift(family);
        loaded++;
        if (loaded === files.length) {
          _populateFontSelectors();
          if (statusEl) statusEl.textContent =
            `✓ Imported ${files.length} font${files.length !== 1 ? 's' : ''}`;
          if (typeof showSchToast === 'function')
            showSchToast(`✓ Font imported: ${family}`);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /* ── Render imported font chips ── */
  function _renderImportedChips() {
    const row = document.getElementById('fm-chips');
    if (!row) return;
    if (!_importedFonts.length) {
      row.innerHTML = '<span style="font-size:10px;color:var(--text-3);">No imported fonts yet.</span>';
      return;
    }
    row.innerHTML = _importedFonts.map((f, i) => `
      <div class="fm-chip" onclick="fmApplyFont('${_esc(f.family)}')">
        <span style="font-family:'${_esc(f.family)}',serif;">${_esc(f.family)}</span>
        <span class="fm-chip-del" onclick="event.stopPropagation();fmRemoveFont(${i})"
          title="Remove">✕</span>
      </div>`).join('');
  }

  window.fmApplyFont = function (family) {
    /* Apply to all font selectors + live preview */
    ['#font-sel','#tmpl-font','#fm-font-sel'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.value = family;
    });
    /* Apply to slide */
    if (typeof setFont === 'function') {
      S.format.font = family;
      const el = document.getElementById('s-text');
      if (el && typeof applyStyleToEl === 'function') applyStyleToEl(el);
      if (typeof push === 'function') push();
    }
    /* Update preview box */
    const prev = document.getElementById('fm-preview');
    if (prev) prev.style.fontFamily = `'${family}', serif`;
    if (typeof showSchToast === 'function')
      showSchToast(`Font: ${family}`);
  };

  window.fmRemoveFont = function (i) {
    const f = _importedFonts[i];
    if (!f) return;
    /* Remove @font-face style */
    const s = document.getElementById('ff-' + _slugify(f.family));
    if (s) s.remove();
    _importedFonts.splice(i, 1);
    _allFonts = _allFonts.filter(n => n !== f.family);
    try {
      localStorage.setItem('bw_imported_fonts', JSON.stringify(_importedFonts));
    } catch(e) {}
    _populateFontSelectors();
  };

  /* Preview font on select change */
  function _wireFmPreview() {
    const sel  = document.getElementById('fm-font-sel');
    const prev = document.getElementById('fm-preview');
    if (!sel || !prev) return;
    sel.addEventListener('change', () => {
      prev.style.fontFamily = `'${sel.value}', serif`;
    });
  }

  /* ── Build the font manager widget inside Text Style accordion ── */
  function buildFontManager() {
    if (document.getElementById('font-manager-section')) return;

    /* Find the r-acc-body of the Text Style accordion */
    const accHead = Array.from(document.querySelectorAll('.r-acc-head'))
      .find(h => h.textContent.includes('Text Style'));
    if (!accHead) return;
    const accBody = accHead.nextElementSibling;
    if (!accBody) return;

    const wrap = document.createElement('div');
    wrap.id = 'font-manager-section';
    wrap.innerHTML = `
      <div class="fm-label">Font Library</div>

      <!-- Font selector + action buttons -->
      <div class="fm-row">
        <select class="fmt-select" id="fm-font-sel"></select>
        <button class="fm-apply-btn" onclick="fmApplyFont(document.getElementById('fm-font-sel').value)">Apply</button>
      </div>

      <!-- Font preview -->
      <div id="fm-preview">The quick brown fox…</div>

      <!-- Action buttons row -->
      <div class="fm-row" style="flex-wrap:wrap;gap:4px;">
        <button class="fm-scan-btn" onclick="fmScanFonts()" title="Detect fonts installed on this computer">
          🔍 Scan System Fonts
        </button>
        <button class="fm-import-btn" onclick="triggerFontImport()" title="Import .ttf/.otf/.woff/.woff2">
          ⬆ Import Font File
        </button>
      </div>

      <!-- Status line -->
      <div id="fm-status"></div>

      <!-- Imported font chips -->
      <div class="fm-label" style="margin-top:4px;">Imported</div>
      <div class="fm-chip-row" id="fm-chips">
        <span style="font-size:10px;color:var(--text-3);">No imported fonts yet.</span>
      </div>
    `;
    accBody.appendChild(wrap);

    _wireFmPreview();
    _populateFontSelectors();
    _renderImportedChips();
  }

  window.fmScanFonts = async function () {
    const statusEl = document.getElementById('fm-status');
    if (statusEl) statusEl.textContent = 'Scanning system fonts…';
    await detectSystemFonts();
  };

  /* Expose import trigger globally */
  window.triggerFontImport = triggerFontImport;


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  function _esc(s) {
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/'/g,'&#39;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    buildTimerSizeCtrl();
    buildFontManager();
    _mountImportedFonts();

    /* Run canvas font detection silently in the background */
    setTimeout(() => {
      if (!_allFonts.length) {
        _canvasDetect().then(fonts => {
          _allFonts = [...new Set([
            ...fonts,
            ..._importedFonts.map(f => f.family)
          ])].sort();
          _populateFontSelectors();
          const st = document.getElementById('fm-status');
          if (st) st.textContent = `✓ ${_allFonts.length} fonts available`;
        });
      }
    }, 1200);

    console.info('[BW fix7] ✓ Auto-fit projection text  ✓ Timer font-size  ✓ Font manager');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 300);
  }

})();
