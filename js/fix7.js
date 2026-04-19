/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix7.js  (v2)
   Fix 1 : Projection text fills the screen like EasyWorship.
           Size is calculated from screen dimensions and the
           actual line/character count of each slide — always
           large, always visible from a distance.
   Fix 3 : System font detection + import font files.
═══════════════════════════════════════════════════════════ */

(function BW_Fix7() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix7-styles';
  _style.textContent = `

    /* ── Projection window — text fill behaviour ──────────── */
    /* These rules are injected INTO the projection popup window
       via projWindowHTML override — see below.               */

    /* ── Timer: bold + size controls ─────────────────────── */
    #t-display {
      font-weight: 700 !important;
      transition: font-size .2s;
    }

    #timer-size-row {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-top: 10px;
    }
    .tsz-label {
      font-size: 11px;
      color: var(--text-3);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tsz-btn {
      width: 26px; height: 26px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background .1s;
      line-height: 1;
      user-select: none;
    }
    .tsz-btn:hover  { background: var(--bg-hover); }
    .tsz-btn:active { opacity: .6; }
    #tsz-inp {
      width: 56px;
      text-align: center;
      padding: 4px 6px;
      font-size: 12px;
      font-family: 'Lato', sans-serif;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-1, #e0ddd8);
      flex-shrink: 0;
    }
    #tsz-inp:focus {
      outline: none;
      border-color: var(--gold-dim);
    }

    /* ── Font manager ─────────────────────────────────────── */
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
      flex-wrap: wrap;
    }
    #fm-font-sel { flex: 1; min-width: 0; }

    .fm-apply-btn {
      flex-shrink: 0;
      padding: 5px 10px;
      background: var(--gold, #c9a84c);
      border: none; border-radius: 4px;
      color: #000; font-size: 11px; font-weight: 700;
      cursor: pointer; transition: opacity .15s;
    }
    .fm-apply-btn:hover { opacity: .85; }

    .fm-scan-btn, .fm-import-btn {
      flex-shrink: 0;
      padding: 5px 9px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-2); font-size: 11px;
      cursor: pointer; white-space: nowrap;
      transition: background .1s, border-color .15s;
    }
    .fm-scan-btn:hover,
    .fm-import-btn:hover {
      background: var(--bg-hover);
      border-color: var(--gold-dim);
      color: var(--gold);
    }

    #fm-preview {
      padding: 8px 10px;
      background: var(--bg-deep, #09090f);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      font-size: 20px;
      color: #f6f2ec;
      text-align: center;
      min-height: 44px;
      transition: font-family .2s;
      word-break: break-word;
    }
    #fm-status {
      font-size: 10px;
      color: var(--text-3);
      min-height: 14px;
    }
    .fm-chip-row { display: flex; flex-wrap: wrap; gap: 4px; }
    .fm-chip {
      display: flex; align-items: center; gap: 5px;
      padding: 3px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 12px;
      font-size: 10px; color: var(--text-2);
      cursor: pointer; transition: border-color .12s;
    }
    .fm-chip:hover        { border-color: var(--gold-dim); }
    .fm-chip-del {
      font-size: 10px; color: var(--text-3);
      cursor: pointer; line-height: 1; padding: 0 2px;
    }
    .fm-chip-del:hover { color: var(--red, #e05050); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — PROJECTION TEXT FILLS THE SCREEN
     ──────────────────────────────────────────────────────────
     Formula (mirrors EasyWorship / ProPresenter):
       1. Count logical lines (newline-split + word-wrap estimate)
       2. fontSize = min(
             availH / lines * LINE_FILL,   ← fill vertically
             availW / maxCharsInLine * CHAR_W  ← don't overflow horizontally
          )
       3. Clamp to [MIN_PX, MAX_PX]
     Result: short text → very large; long text → smaller but
     always fills the slide area and stays fully readable.
  ══════════════════════════════════════════════════════════ */

  const LINE_FILL = 0.80;   // fraction of a "line slot" the text occupies
  const CHAR_W    = 0.60;   // average char width as fraction of font-size
  const PAD_H     = 0.10;   // horizontal padding (each side, fraction of W)
  const PAD_V     = 0.12;   // vertical padding (each side, fraction of H)
  const REF_H_EST = 0.04;   // estimated reference-line height fraction of H
  const FOOT_H_EST= 0.035;
  const MIN_PX    = 28;     // absolute minimum — always readable from a distance
  const MAX_PX    = 200;

  /**
   * Calculate the ideal font size for the given text on a
   * screen of (screenW × screenH) pixels.
   */
  function calcFitSize(text, screenW, screenH) {
    if (!text || !screenW || !screenH) return 60;

    const availW = screenW * (1 - PAD_H * 2);
    const availH = screenH * (1 - PAD_V * 2)
                 - screenH * REF_H_EST
                 - screenH * FOOT_H_EST;

    /* Split into raw lines */
    const rawLines = text.split('\n').filter(l => l.trim() !== '');
    if (!rawLines.length) return MIN_PX;

    /* For each raw line, estimate how many display lines it wraps to
       at a trial font size.  We start with a rough estimate then refine. */
    function countDisplayLines(fz) {
      const charsPerLine = availW / (fz * CHAR_W);
      let total = 0;
      rawLines.forEach(line => {
        total += Math.max(1, Math.ceil(line.length / charsPerLine));
      });
      return total;
    }

    /* Find font size where all display lines fit vertically */
    /* Start from a generous size and work down if needed */
    let fz = Math.floor(availH / rawLines.length * LINE_FILL);
    fz = Math.min(fz, MAX_PX);
    fz = Math.max(fz, MIN_PX);

    /* Refine: if wrapped lines overflow, reduce */
    for (let i = 0; i < 20; i++) {
      const lines = countDisplayLines(fz);
      const usedH = lines * (fz / LINE_FILL);
      if (usedH <= availH || fz <= MIN_PX) break;
      fz = Math.floor(fz * (availH / usedH) * 0.95);
      fz = Math.max(fz, MIN_PX);
    }

    return Math.round(Math.max(MIN_PX, Math.min(MAX_PX, fz)));
  }

  /* Apply the calculated size to the projection window */
  function applyFitToProj() {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    if (!S?.slides?.length) return;

    const d   = pw.document;
    const txt = d.getElementById('proj-text');
    if (!txt) return;

    /* Don't resize during timer projection */
    if (S?.timer?.projected && S?.timer?.running) return;

    const W  = pw.innerWidth  || 1920;
    const H  = pw.innerHeight || 1080;
    const sl = S.slides[S.cur] || {};
    const fz = calcFitSize(sl.text || '', W, H);

    txt.style.fontSize   = fz + 'px';
    txt.style.lineHeight = '1.25';
    txt.style.width      = '100%';

    /* Keep local sz-val label in sync — informational only */
    const szVal = document.getElementById('sz-val');
    if (szVal) szVal.textContent = fz;
  }

  /* Patch push() */
  const _origPush = window.push;
  window.push = function () {
    if (_origPush) _origPush();
    requestAnimationFrame(() => setTimeout(applyFitToProj, 30));
  };

  /* Re-fit on projection window resize / fullscreen */
  const _origOpenProj = window.openProjection;
  window.openProjection = async function () {
    if (_origOpenProj) await _origOpenProj();
    setTimeout(() => {
      const pw = S?.projWin;
      if (!pw || pw.closed) return;
      pw.addEventListener('resize',           () => setTimeout(applyFitToProj, 80), {passive:true});
      pw.document.addEventListener('fullscreenchange', () => setTimeout(applyFitToProj, 120));
      setTimeout(applyFitToProj, 500);
    }, 900);
  };

  window.applyFitToProj = applyFitToProj;


  /* ══════════════════════════════════════════════════════════
     FIX 2 — TIMER: BOLD + CUSTOM SIZE INPUT
  ══════════════════════════════════════════════════════════ */

  let _timerPx = parseInt(localStorage.getItem('bw_timer_font') || '96');

  function buildTimerSizeRow() {
    if (document.getElementById('timer-size-row')) return;
    const disp = document.getElementById('t-display');
    if (!disp) return;

    const row = document.createElement('div');
    row.id = 'timer-size-row';
    row.innerHTML = `
      <span class="tsz-label">Timer Size</span>
      <button class="tsz-btn" onclick="tszStep(-8)" title="Decrease">−</button>
      <input  id="tsz-inp" type="number" min="24" max="480"
              value="${_timerPx}"
              onchange="tszSet(parseInt(this.value))"
              onkeydown="if(event.key==='Enter')tszSet(parseInt(this.value))">
      <span class="tsz-label">px</span>
      <button class="tsz-btn" onclick="tszStep(+8)" title="Increase">+</button>
    `;
    disp.insertAdjacentElement('afterend', row);
    _applyTimerPx();
  }

  window.tszStep = function (d) {
    tszSet(_timerPx + d);
  };
  window.tszSet  = function (v) {
    if (!v || isNaN(v)) return;
    _timerPx = Math.max(24, Math.min(480, v));
    const inp = document.getElementById('tsz-inp');
    if (inp) inp.value = _timerPx;
    _applyTimerPx();
    localStorage.setItem('bw_timer_font', String(_timerPx));
  };

  function _applyTimerPx() {
    const disp = document.getElementById('t-display');
    if (disp) { disp.style.fontSize = _timerPx + 'px'; disp.style.fontWeight = '700'; }

    /* Projection window timer */
    const pw = S?.projWin;
    if (pw && !pw.closed && S?.timer?.projected) {
      const el = pw.document.getElementById('proj-text');
      if (el) el.style.fontSize = _timerPx + 'px';
    }
    /* Stage */
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const el = sw.document.getElementById('stg-timer');
      if (el) { el.style.fontSize = Math.round(_timerPx * 0.42) + 'px'; el.style.fontWeight = '700'; }
    }
  }


  /* ══════════════════════════════════════════════════════════
     FIX 3 — SYSTEM + IMPORTED FONT MANAGER
  ══════════════════════════════════════════════════════════ */

  const COMMON_SYSTEM_FONTS = [
    'Georgia','Palatino Linotype','Book Antiqua','Times New Roman',
    'Garamond','Cambria','Constantia','Rockwell','Bodoni MT','Baskerville',
    'Hoefler Text','Perpetua','Didot','Copperplate',
    'Arial','Arial Black','Helvetica','Helvetica Neue','Verdana','Tahoma',
    'Trebuchet MS','Geneva','Calibri','Candara','Corbel','Segoe UI',
    'Franklin Gothic Medium','Gill Sans','Impact','Optima','Myriad Pro',
    'Lucida Sans','Futura','Avenir','Avenir Next',
    'Courier New','Consolas','Lucida Console','Monaco','Menlo',
    'Brush Script MT','Copperplate Gothic','Papyrus','Broadway',
    'Segoe Print','Segoe Script','Vladimir Script',
    'Playfair Display','Cinzel','Lato',
  ].sort();

  let _importedFonts = JSON.parse(localStorage.getItem('bw_imported_fonts') || '[]');
  let _allFonts      = [];

  function _mountImportedFonts() {
    _importedFonts.forEach(f => {
      if (!document.getElementById('ff-' + _slug(f.family)))
        _injectFF(f.family, f.url);
    });
  }
  function _injectFF(family, url) {
    const s = document.createElement('style');
    s.id = 'ff-' + _slug(family);
    s.textContent = `@font-face{font-family:'${family}';src:url('${url}');font-display:swap;}`;
    document.head.appendChild(s);
  }

  async function _detectFonts() {
    const st = document.getElementById('fm-status');
    if (st) st.textContent = 'Scanning…';
    let detected = [];

    if ('queryLocalFonts' in window) {
      try {
        const fonts = await window.queryLocalFonts();
        detected = [...new Set(fonts.map(f => f.family))].sort();
        if (st) st.textContent = `✓ ${detected.length} system fonts found`;
      } catch(e) {
        detected = await _canvasDetect(st);
      }
    } else {
      detected = await _canvasDetect(st);
    }

    _allFonts = [...new Set([
      ...detected,
      ..._importedFonts.map(f => f.family)
    ])].sort();
    _populateSelectors();
    return _allFonts;
  }

  async function _canvasDetect(st) {
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 50;
    const ctx  = canvas.getContext('2d');
    const base = (function() {
      ctx.font = "36px '__x999'";
      return ctx.measureText('mmmmmmmmmmlli').width;
    })();
    const found = [];
    for (let i = 0; i < COMMON_SYSTEM_FONTS.length; i++) {
      ctx.font = `36px '${COMMON_SYSTEM_FONTS[i]}', serif`;
      if (ctx.measureText('mmmmmmmmmmlli').width !== base)
        found.push(COMMON_SYSTEM_FONTS[i]);
      if (i % 15 === 0) await new Promise(r => setTimeout(r, 0));
    }
    if (st) st.textContent = `✓ ${found.length} fonts detected`;
    return found;
  }

  function _populateSelectors() {
    const imported = _importedFonts.map(f => f.family);
    ['#font-sel','#tmpl-font','#fm-font-sel'].forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cur = el.value;
      /* Remove previously injected dynamic options */
      Array.from(el.querySelectorAll('optgroup[data-dyn]')).forEach(g => g.remove());

      if (imported.length) {
        const g = document.createElement('optgroup');
        g.label = '── Imported ──';
        g.dataset.dyn = '1';
        imported.forEach(n => {
          const o = document.createElement('option');
          o.value = n; o.textContent = n;
          g.appendChild(o);
        });
        el.appendChild(g);
      }
      if (_allFonts.length) {
        const g = document.createElement('optgroup');
        g.label = '── System ──';
        g.dataset.dyn = '1';
        _allFonts.filter(n => !imported.includes(n)).forEach(n => {
          const o = document.createElement('option');
          o.value = n; o.textContent = n;
          g.appendChild(o);
        });
        el.appendChild(g);
      }
      if (cur) el.value = cur;
    });
    _renderChips();
  }

  function _renderChips() {
    const row = document.getElementById('fm-chips');
    if (!row) return;
    if (!_importedFonts.length) {
      row.innerHTML = '<span style="font-size:10px;color:var(--text-3);">No imported fonts yet.</span>';
      return;
    }
    row.innerHTML = _importedFonts.map((f, i) => `
      <div class="fm-chip" onclick="fmApply('${_esc(f.family)}')">
        <span style="font-family:'${_esc(f.family)}',serif;">${_esc(f.family)}</span>
        <span class="fm-chip-del" onclick="event.stopPropagation();fmRemove(${i})">✕</span>
      </div>`).join('');
  }

  window.fmApply = function (family) {
    ['#font-sel','#tmpl-font','#fm-font-sel'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.value = family;
    });
    S.format.font = family;
    const el = document.getElementById('s-text');
    if (el && typeof applyStyleToEl === 'function') applyStyleToEl(el);
    if (typeof push === 'function') push();
    const prev = document.getElementById('fm-preview');
    if (prev) prev.style.fontFamily = `'${family}', serif`;
    if (typeof showSchToast === 'function') showSchToast(`Font: ${family}`);
  };

  window.fmRemove = function (i) {
    const f = _importedFonts[i];
    if (!f) return;
    document.getElementById('ff-' + _slug(f.family))?.remove();
    _importedFonts.splice(i, 1);
    _allFonts = _allFonts.filter(n => n !== f.family);
    try { localStorage.setItem('bw_imported_fonts', JSON.stringify(_importedFonts)); } catch(e) {}
    _populateSelectors();
  };

  window.fmScanFonts = async function () { await _detectFonts(); };

  window.triggerFontImport = function () {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.ttf,.otf,.woff,.woff2'; inp.multiple = true;
    inp.style.display = 'none';
    inp.addEventListener('change', e => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      const st = document.getElementById('fm-status');
      let done = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const url    = ev.target.result;
          const family = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
                           .replace(/\b\w/g, c => c.toUpperCase());
          if (!_importedFonts.some(f => f.family === family)) {
            _injectFF(family, url);
            _importedFonts.push({ family, url });
            if (_importedFonts.length > 20) _importedFonts.shift();
            if (!_allFonts.includes(family)) _allFonts.unshift(family);
            try { localStorage.setItem('bw_imported_fonts', JSON.stringify(_importedFonts)); } catch(e) {}
          }
          done++;
          if (done === files.length) {
            _populateSelectors();
            if (st) st.textContent = `✓ ${files.length} font${files.length>1?'s':''} imported`;
            if (typeof showSchToast === 'function')
              showSchToast(`✓ Font imported: ${family}`);
          }
        };
        reader.readAsDataURL(file);
      });
    });
    document.body.appendChild(inp);
    inp.click();
    setTimeout(() => inp.remove(), 15000);
  };

  function buildFontManager() {
    if (document.getElementById('font-manager-section')) return;
    const accHead = Array.from(document.querySelectorAll('.r-acc-head'))
      .find(h => h.textContent.includes('Text Style'));
    if (!accHead) return;
    const accBody = accHead.nextElementSibling;
    if (!accBody) return;

    const wrap = document.createElement('div');
    wrap.id = 'font-manager-section';
    wrap.innerHTML = `
      <div class="fm-label">Font Library</div>
      <div class="fm-row">
        <select class="fmt-select" id="fm-font-sel"></select>
        <button class="fm-apply-btn" onclick="fmApply(document.getElementById('fm-font-sel').value)">Apply</button>
      </div>
      <div id="fm-preview">The Lord is my shepherd</div>
      <div class="fm-row">
        <button class="fm-scan-btn" onclick="fmScanFonts()">🔍 Scan System Fonts</button>
        <button class="fm-import-btn" onclick="triggerFontImport()">⬆ Import Font File</button>
      </div>
      <div id="fm-status"></div>
      <div class="fm-label" style="margin-top:4px;">Imported</div>
      <div class="fm-chip-row" id="fm-chips"></div>
    `;
    accBody.appendChild(wrap);

    /* Preview updates on selection */
    document.getElementById('fm-font-sel')?.addEventListener('change', e => {
      const prev = document.getElementById('fm-preview');
      if (prev) prev.style.fontFamily = `'${e.target.value}', serif`;
    });

    _populateSelectors();
    _renderChips();
  }


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g,'_'); }
  function _esc(s)  {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;').replace(/'/g,'&#39;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    buildTimerSizeRow();
    buildFontManager();
    _mountImportedFonts();

    /* Silent background font scan */
    setTimeout(() => {
      if (!_allFonts.length) _canvasDetect(null).then(fonts => {
        _allFonts = [...new Set([...fonts, ..._importedFonts.map(f => f.family)])].sort();
        _populateSelectors();
        const st = document.getElementById('fm-status');
        if (st) st.textContent = `✓ ${_allFonts.length} fonts available`;
      });
    }, 1500);

    console.info('[BW fix7 v2] ✓ Screen-fill text  ✓ Timer bold+size  ✓ Font manager');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 300);
  }

})();
