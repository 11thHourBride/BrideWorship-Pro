/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix7.js  (v3)
   Fix 1 : Projection window uses a 1920×1080 virtual canvas
           scaled to fill any screen — identical to output
           preview behaviour. Text fills the slide area.
   Fix 2 : Clock display: bold + custom font-size input.
   Fix 3 : System + imported font manager in Text Style panel.
═══════════════════════════════════════════════════════════ */

(function BW_Fix7() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix7-styles';
  _style.textContent = `

    /* ── Clock: bold + custom size ────────────────────────── */
    #out-clock { font-weight: 700 !important; }

    #clock-size-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      flex-wrap: wrap;
    }
    .cksz-label {
      font-size: 11px;
      color: var(--text-3);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cksz-btn {
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
      user-select: none;
    }
    .cksz-btn:hover  { background: var(--bg-hover); }
    .cksz-btn:active { opacity: .6; }
    #cksz-inp {
      width: 52px;
      text-align: center;
      padding: 4px 5px;
      font-size: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-1, #e0ddd8);
      flex-shrink: 0;
    }
    #cksz-inp:focus { outline: none; border-color: var(--gold-dim); }

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
      padding: 5px 10px;
      background: var(--gold, #c9a84c);
      border: none; border-radius: 4px;
      color: #000; font-size: 11px; font-weight: 700;
      cursor: pointer; flex-shrink: 0;
    }
    .fm-apply-btn:hover { opacity: .85; }
    .fm-scan-btn, .fm-import-btn {
      padding: 5px 9px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--text-2); font-size: 11px;
      cursor: pointer; white-space: nowrap; flex-shrink: 0;
      transition: background .1s, border-color .15s;
    }
    .fm-scan-btn:hover, .fm-import-btn:hover {
      background: var(--bg-hover); border-color: var(--gold-dim); color: var(--gold);
    }
    #fm-preview {
      padding: 8px 10px;
      background: var(--bg-deep, #09090f);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      font-size: 20px; color: #f6f2ec;
      text-align: center; min-height: 44px;
      transition: font-family .2s; word-break: break-word;
    }
    #fm-status { font-size: 10px; color: var(--text-3); min-height: 14px; }
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
    .fm-chip:hover { border-color: var(--gold-dim); }
    .fm-chip-del {
      font-size: 10px; color: var(--text-3);
      cursor: pointer; padding: 0 2px;
    }
    .fm-chip-del:hover { color: var(--red, #e05050); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — PROJECTION WINDOW: VIRTUAL CANVAS SCALE
     ──────────────────────────────────────────────────────────
     Strategy: render slide content at a fixed 1920×1080
     "virtual canvas" using the SAME font-size logic as the
     output preview, then CSS-scale the entire canvas to fill
     whatever physical screen the window is on.
     This guarantees projection == output preview at any size.
  ══════════════════════════════════════════════════════════ */

  /* Base virtual resolution — matches the output preview ratio */
  const BASE_W = '1920'; // 1920;
  const BASE_H = '1000'; // 1080;

  /*
   * Calc ideal font size for a given text on BASE_W × BASE_H.
   * Uses the same proportional logic the output preview uses
   * (which is why they match — both target the same virtual px).
   */
  function calcVirtualFontSize(text) {
    if (!text || !text.trim()) return 72;

    const PAD_X = BASE_W * 0.08;
    const PAD_Y = BASE_H * 0.10;
    const REF_H = BASE_H * 0.10; // ref line height
    const FOOT  = BASE_H * 0.10;
    const availW = BASE_W - PAD_X * 2;
    const availH = BASE_H - PAD_Y * 2 - REF_H - FOOT;

    const lines    = text.split('\n').filter(l => l.trim() !== '');
    const maxLen   = Math.max(...lines.map(l => l.length), 1);
    const lineCount = lines.length;

    /* Size so all lines fill the available height */
    const LINE_H_RATIO = 1.30;
    const sizeByH = (availH / lineCount) / LINE_H_RATIO;

    /* Size so the longest line fits the width (avg char ~0.52em) */
    const CHAR_RATIO  = 0.52;
    const sizeByW = availW / (maxLen * CHAR_RATIO);

    const raw = Math.min(sizeByH, sizeByW);
    return Math.round(Math.max(56, Math.min(180, raw)));
  }

  /*
   * Rebuild projWindowHTML to use the virtual-canvas approach.
   * The entire #proj-canvas is rendered at 1920×1080 px then
   * CSS-scaled to fill the actual window.
   */
  window.projWindowHTML = function () {
    const curBg = (typeof BACKGROUNDS !== 'undefined')
      ? (BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0])
      : { bg: '#08051a' };

    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html, body {
  width: 100vw; height: 100vh;
  overflow: hidden; background: #000;
}

/* ── Virtual canvas: always 1920×1080, scaled to fill ── */
#proj-canvas {
  position: fixed;
  width:  ${BASE_W}px;
  height: ${BASE_H}px;
  top: 0; left: 0;
  transform-origin: top left;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Background */
#proj-bg {
  position: absolute;
  inset: 0;
  background: ${curBg.bg};
  transition: background .5s;
}

/* All text lives here — centered vertically */
#proj-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${Math.round(BASE_H*0.10)}px ${Math.round(BASE_W*0.08)}px;
  z-index: 2;
  width: 100%;
}

#proj-ref {
  font-family: 'Cinzel', serif;
  font-size: ${Math.round(BASE_H*0.022)}px;
  letter-spacing: 0.38em;
  color: rgba(201,168,76,.8);
  text-transform: uppercase;
  margin-bottom: ${Math.round(BASE_H*0.022)}px;
  width: 100%;
  text-align: center;
}

#proj-text {
  width: 100%;
  line-height: 1.30;
  text-shadow: 0 2px ${Math.round(BASE_H*0.028)}px rgba(0,0,0,.95);
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: font-size .18s ease, color .2s;
}

#proj-footer {
  position: absolute;
  bottom: ${Math.round(BASE_H*0.025)}px;
  left: 0; right: 0;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: ${Math.round(BASE_H*0.016)}px;
  letter-spacing: 0.26em;
  color: rgba(255,255,255,.28);
  text-transform: uppercase;
  z-index: 3;
}

#proj-lt {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: ${Math.round(BASE_H*0.018)}px ${Math.round(BASE_W*0.03)}px;
  display: none; text-align: center;
  font-size: ${Math.round(BASE_H*0.032)}px;
  font-weight: 700; letter-spacing: .08em;
  color: #fff; z-index: 10;
}
#proj-lt.visible   { display: block; }
#proj-lt.lt-default{ background: rgba(8,5,26,.88); border-top:1px solid rgba(201,168,76,.3); }
#proj-lt.lt-gold   { background: linear-gradient(90deg,#8a5a00,#c9a84c,#8a5a00); }
#proj-lt.lt-dark   { background: rgba(0,0,0,.95); border-top:2px solid rgba(255,255,255,.18); }
#proj-lt.lt-alert  { background: rgba(140,0,0,.9); border-top:2px solid #e05050; }

#proj-blank {
  position: fixed; inset: 0;
  background: #000; display: none; z-index: 99;
}

/* Transition animations */
@keyframes fadeIn  { from{opacity:0}           to{opacity:1} }
@keyframes slideIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
@keyframes zoomIn  { from{opacity:0;transform:scale(.93)}       to{opacity:1;transform:scale(1)} }
.trans-fade  #proj-inner { animation: fadeIn  var(--ts,.5s) ease; }
.trans-slide #proj-inner { animation: slideIn var(--ts,.5s) ease; }
.trans-zoom  #proj-inner { animation: zoomIn  var(--ts,.5s) ease; }
</style>
</head><body>
<div id="proj-canvas">
  <div id="proj-bg"></div>
  <div id="proj-inner">
    <div id="proj-ref"></div>
    <div id="proj-text"></div>
  </div>
  <div id="proj-footer"></div>
  <div id="proj-lt"></div>
</div>
<div id="proj-blank"></div>
<script>
  /* Scale the virtual canvas to fill the actual window */
  function scaleCanvas() {
    var c  = document.getElementById('proj-canvas');
    if (!c) return;
    var sx = window.innerWidth  / ${BASE_W};
    var sy = window.innerHeight / ${BASE_H};
    /* Use the smaller scale to keep aspect ratio, fill with the larger */
    var s  = Math.max(sx, sy);
    var tx = (window.innerWidth  - ${BASE_W} * s) / 2;
    var ty = (window.innerHeight - ${BASE_H} * s) / 2;
    c.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
  }
  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);
  document.addEventListener('fullscreenchange', function(){ setTimeout(scaleCanvas,80); });
<\/script>
</body></html>`;
  };

  /* ── Override push() to set virtual-px font sizes ── */
  const _origPush = window.push;
  window.push = function () {
    if (_origPush) _origPush();
    _pushFitText();
  };

  function _pushFitText() {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    if (!S?.slides?.length) return;
    if (S?.timer?.projected && S?.timer?.running) return;

    const sl  = S.slides[S.cur] || {};
    const fz  = calcVirtualFontSize(sl.text || '');
    const d   = pw.document;
    const txt = d.getElementById('proj-text');
    const f   = S.format || {};
    if (!txt) return;

    txt.style.fontSize   = fz + 'px';
    txt.style.lineHeight = '1.30';
    txt.style.fontFamily = `'${f.font || 'Arial'}', Arial Black`;
    txt.style.textAlign  = f.align  || 'center';
    txt.style.fontWeight = f.bold   ? '700' : '400';
    txt.style.fontStyle  = f.italic ? 'italic' : 'normal';
    txt.style.color      = f.color  || '#f6f2ec';
    txt.style.textShadow = _shadow(f.shadow, f.color);

    /* Keep local size indicator in sync */
    const szVal = document.getElementById('sz-val');
    if (szVal) szVal.textContent = fz;
    S.fontSize = fz;
  }

  /* Refit after open + resize */
  const _origOpenProj = window.openProjection;
  window.openProjection = async function () {
    if (_origOpenProj) await _origOpenProj();
    setTimeout(() => {
      const pw = S?.projWin;
      if (!pw || pw.closed) return;
      pw.addEventListener('resize', () => { _pushFitText(); pw.scaleCanvas?.(); }, {passive:true});
      pw.document.addEventListener('fullscreenchange', () => setTimeout(_pushFitText, 120));
      setTimeout(_pushFitText, 500);
    }, 900);
  };

  function _shadow(key, color) {
    const c = color || '#f6f2ec';
    return ({
      none:    'none',
      soft:    `0 2px 30px rgba(0,0,0,.95)`,
      hard:    `2px 2px 0 rgba(0,0,0,.9)`,
      glow:    `0 0 30px ${c}88, 0 2px 20px rgba(0,0,0,.8)`,
      outline: `-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000`,
    })[key] || '0 2px 30px rgba(0,0,0,.95)';
  }


  /* ══════════════════════════════════════════════════════════
     FIX 2 — CLOCK: BOLD + CUSTOM SIZE INPUT
  ══════════════════════════════════════════════════════════ */

  let _clockPx = parseInt(localStorage.getItem('bw_clock_px') || '14');

  function buildClockSizeRow() {
    if (document.getElementById('clock-size-row')) return;

    /* Find the clock settings panel */
    const panel = document.getElementById('clock-settings-panel');
    if (!panel) return;

    const row = document.createElement('div');
    row.id = 'clock-size-row';
    row.innerHTML = `
      <span class="cksz-label">Clock Size</span>
      <button class="cksz-btn" onclick="ckszStep(-1)" title="Smaller">−</button>
      <input id="cksz-inp" type="number" min="8" max="120"
             value="${_clockPx}"
             onchange="ckszSet(parseInt(this.value))"
             onkeydown="if(event.key==='Enter')ckszSet(parseInt(this.value))">
      <span class="cksz-label">px</span>
      <button class="cksz-btn" onclick="ckszStep(+1)" title="Larger">+</button>
    `;
    panel.appendChild(row);
    _applyClockPx();
  }

  window.ckszStep = function (d) { ckszSet(_clockPx + d); };
  window.ckszSet  = function (v) {
    if (!v || isNaN(v)) return;
    _clockPx = Math.max(8, Math.min(120, v));
    const inp = document.getElementById('cksz-inp');
    if (inp) inp.value = _clockPx;
    /* Also sync the existing clock-size select — set to closest */
    const sel = document.getElementById('clock-size');
    if (sel) sel.value = _clockPx + 'px';
    _applyClockPx();
    localStorage.setItem('bw_clock_px', String(_clockPx));
    /* Trigger existing clock settings update */
    if (typeof updateClockSettings === 'function') updateClockSettings();
  };

  function _applyClockPx() {
    /* Override the clock-size select value so tickClock() picks it up */
    const sel = document.getElementById('clock-size');
    if (sel) {
      /* inject a matching option if not present */
      let found = Array.from(sel.options).find(o => o.value === _clockPx + 'px');
      if (!found) {
        const opt = document.createElement('option');
        opt.value = _clockPx + 'px';
        opt.textContent = _clockPx + 'px';
        opt.dataset.custom = '1';
        sel.appendChild(opt);
      }
      sel.value = _clockPx + 'px';
    }

    /* Apply bold + size to the local output-preview clock */
    const ck = document.getElementById('out-clock');
    if (ck) {
      ck.style.fontSize   = _clockPx + 'px';
      ck.style.fontWeight = '700';
    }

    /* Apply to projection window clock */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const pc = pw.document.getElementById('proj-clock');
      if (pc) {
        pc.style.fontSize   = Math.round(_clockPx * 1.8) + 'px';
        pc.style.fontWeight = '700';
      }
    }

    /* Apply to stage display clock */
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) { sc.style.fontSize = _clockPx + 'px'; sc.style.fontWeight = '700'; }
    }
  }

  /* Patch tickClock (from BrideWorship.js) to apply bold after each tick */
  const _origTickClock = window.tickClock;
  if (typeof _origTickClock === 'function') {
    window.tickClock = function () {
      _origTickClock();
      /* Reapply bold + custom size after the original sets font-size */
      const ck = document.getElementById('out-clock');
      if (ck) { ck.style.fontSize = _clockPx + 'px'; ck.style.fontWeight = '700'; }
    };
  }


  /* ══════════════════════════════════════════════════════════
     FIX 3 — SYSTEM + IMPORTED FONT MANAGER
  ══════════════════════════════════════════════════════════ */

  const COMMON_FONTS = [
    'Georgia','Palatino Linotype','Book Antiqua','Times New Roman',
    'Garamond','Cambria','Constantia','Rockwell','Baskerville',
    'Hoefler Text','Perpetua','Didot','Copperplate',
    'Arial','Arial Black','Helvetica','Helvetica Neue','Verdana','Tahoma',
    'Trebuchet MS','Geneva','Calibri','Candara','Corbel','Segoe UI',
    'Franklin Gothic Medium','Gill Sans','Impact','Optima','Myriad Pro',
    'Lucida Sans','Futura','Avenir','Avenir Next',
    'Courier New','Consolas','Lucida Console','Monaco','Menlo',
    'Brush Script MT','Papyrus','Broadway',
    'Segoe Print','Segoe Script','Vladimir Script',
    'Playfair Display','Cinzel','Lato',
  ].sort();

  let _imported = JSON.parse(localStorage.getItem('bw_imported_fonts') || '[]');
  let _allFonts = [];

  (function _mountImported() {
    _imported.forEach(f => {
      if (!document.getElementById('ff-' + _slug(f.family)))
        _injectFF(f.family, f.url);
    });
  })();

  function _injectFF(family, url) {
    const s = document.createElement('style');
    s.id = 'ff-' + _slug(family);
    s.textContent = `@font-face{font-family:'${family}';src:url('${url}');font-display:swap;}`;
    document.head.appendChild(s);
  }

  async function _scanFonts() {
    const st = document.getElementById('fm-status');
    if (st) st.textContent = 'Scanning…';
    let found = [];
    if ('queryLocalFonts' in window) {
      try {
        const fonts = await window.queryLocalFonts();
        found = [...new Set(fonts.map(f => f.family))].sort();
        if (st) st.textContent = `✓ ${found.length} system fonts found`;
      } catch(e) { found = await _canvasScan(st); }
    } else {
      found = await _canvasScan(st);
    }
    _allFonts = [...new Set([...found, ..._imported.map(f => f.family)])].sort();
    _fillSelectors();
  }

  async function _canvasScan(st) {
    const c = document.createElement('canvas');
    c.width = 200; c.height = 50;
    const ctx  = c.getContext('2d');
    ctx.font   = "36px '__none__'";
    const base = ctx.measureText('mmmmmmmmmmlli').width;
    const out  = [];
    for (let i = 0; i < COMMON_FONTS.length; i++) {
      ctx.font = `36px '${COMMON_FONTS[i]}', serif`;
      if (ctx.measureText('mmmmmmmmmmlli').width !== base) out.push(COMMON_FONTS[i]);
      if (i % 15 === 0) await new Promise(r => setTimeout(r, 0));
    }
    if (st) st.textContent = `✓ ${out.length} fonts detected`;
    return out;
  }

  function _fillSelectors() {
    const importedNames = _imported.map(f => f.family);
    ['#font-sel','#tmpl-font','#fm-font-sel'].forEach(qs => {
      const el = document.querySelector(qs);
      if (!el) return;
      const cur = el.value;
      Array.from(el.querySelectorAll('optgroup[data-dyn]')).forEach(g => g.remove());
      if (importedNames.length) {
        const g = document.createElement('optgroup');
        g.label = '── Imported Fonts ──'; g.dataset.dyn = '1';
        importedNames.forEach(n => { const o=document.createElement('option'); o.value=n; o.textContent=n; g.appendChild(o); });
        el.appendChild(g);
      }
      if (_allFonts.length) {
        const g = document.createElement('optgroup');
        g.label = '── System Fonts ──'; g.dataset.dyn = '1';
        _allFonts.filter(n => !importedNames.includes(n)).forEach(n => {
          const o=document.createElement('option'); o.value=n; o.textContent=n; g.appendChild(o);
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
    row.innerHTML = _imported.length
      ? _imported.map((f,i) => `
          <div class="fm-chip" onclick="fmApply('${_esc(f.family)}')">
            <span style="font-family:'${_esc(f.family)}',serif;">${_esc(f.family)}</span>
            <span class="fm-chip-del" onclick="event.stopPropagation();fmRemove(${i})">✕</span>
          </div>`).join('')
      : '<span style="font-size:10px;color:var(--text-3);">No imported fonts yet.</span>';
  }

  window.fmApply = function (family) {
    ['#font-sel','#tmpl-font','#fm-font-sel'].forEach(qs => {
      const el = document.querySelector(qs); if (el) el.value = family;
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
    const f = _imported[i]; if (!f) return;
    document.getElementById('ff-' + _slug(f.family))?.remove();
    _imported.splice(i, 1);
    _allFonts = _allFonts.filter(n => n !== f.family);
    try { localStorage.setItem('bw_imported_fonts', JSON.stringify(_imported)); } catch(e) {}
    _fillSelectors();
  };

  window.fmScanFonts = function () { _scanFonts(); };

  window.triggerFontImport = function () {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.ttf,.otf,.woff,.woff2'; inp.multiple = true;
    inp.style.display = 'none';
    inp.addEventListener('change', e => {
      const files = Array.from(e.target.files||[]); if (!files.length) return;
      const st = document.getElementById('fm-status');
      let done = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const url    = ev.target.result;
          const family = file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
          if (!_imported.some(f=>f.family===family)) {
            _injectFF(family, url);
            _imported.push({family, url});
            if (_imported.length > 20) _imported.shift();
            if (!_allFonts.includes(family)) _allFonts.unshift(family);
            try { localStorage.setItem('bw_imported_fonts', JSON.stringify(_imported)); } catch(e) {}
          }
          done++;
          if (done === files.length) {
            _fillSelectors();
            if (st) st.textContent = `✓ ${files.length} font${files.length>1?'s':''} imported`;
            if (typeof showSchToast === 'function') showSchToast(`✓ Font imported: ${family}`);
          }
        };
        reader.readAsDataURL(file);
      });
    });
    document.body.appendChild(inp); inp.click();
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
        <button class="fm-import-btn" onclick="triggerFontImport()">⬆ Import Font</button>
      </div>
      <div id="fm-status"></div>
      <div class="fm-label" style="margin-top:4px;">Imported</div>
      <div class="fm-chip-row" id="fm-chips"></div>
    `;
    accBody.appendChild(wrap);
    document.getElementById('fm-font-sel')?.addEventListener('change', e => {
      const prev = document.getElementById('fm-preview');
      if (prev) prev.style.fontFamily = `'${e.target.value}', serif`;
    });
    _fillSelectors(); _renderChips();
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
    buildClockSizeRow();
    buildFontManager();

    /* Restore persisted clock size */
    const savedPx = parseInt(localStorage.getItem('bw_clock_px') || '0');
    if (savedPx) { _clockPx = savedPx; _applyClockPx(); }

    /* Silent background font scan */
    setTimeout(() => {
      if (!_allFonts.length) _canvasScan(null).then(fonts => {
        _allFonts = [...new Set([...fonts, ..._imported.map(f=>f.family)])].sort();
        _fillSelectors();
        const st = document.getElementById('fm-status');
        if (st) st.textContent = `✓ ${_allFonts.length} fonts available`;
      });
    }, 1500);

    console.info('[BW fix7 v3] ✓ Virtual-canvas projection  ✓ Clock bold+size  ✓ Font manager');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 300);
  }

})();