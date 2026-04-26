/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix16.js
   Projection text: truly fills any screen at any ratio.
   Problems fixed:
   1. Virtual 1920×1080 canvas was CSS-scaled which made text
      appear small on large/non-16:9 screens.
   2. +/- buttons had no effect (fitText() overrode them).
   3. Max font cap (400 px) was hit on short texts at big sizes.
   Solution:
   • Projection window renders at actual viewport pixels.
   • fitText() runs in the real DOM with no virtual-canvas cap.
   • +/- buttons set a user scale multiplier (0.5×–2.0×) that
     is applied ON TOP of the auto-fit result.
   • Scale persisted; shown in bottom bar.
═══════════════════════════════════════════════════════════ */

(function BW_Fix22() {
  'use strict';

  /* User scale multiplier: 1.0 = auto-fit fills screen */
  let _scale    = parseFloat(localStorage.getItem('bw_proj_scale') || '1.0');
  const S_MIN   = 0.3;
  const S_MAX   = 3.0;
  const S_STEP  = 0.1;

  /* ══════════════════════════════════════════════════════════
     CSS (local app only)
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix16-styles';
  _style.textContent = `
    /* Scale readout next to +/- buttons */
    #proj-scale-wrap {
      display: flex; align-items: center; gap: 4px;
      margin-left: 6px;
    }
    #proj-scale-lbl {
      font-size: 10px; color: var(--text-3);
      white-space: nowrap;
    }
    #proj-scale-val {
      font-size: 11px; color: var(--gold, #c9a84c);
      min-width: 36px; text-align: center;
      font-family: 'Cinzel', serif;
    }
    .psz-btn {
      width: 24px; height: 24px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card); color: var(--text-2);
      font-size: 15px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .1s; user-select: none;
    }
    .psz-btn:hover  { background: var(--bg-hover); }
    .psz-btn:active { opacity: .6; }
    #psz-reset {
      font-size: 10px; color: var(--text-3);
      cursor: pointer; padding: 2px 5px;
      border-radius: 3px; border: 1px solid var(--border-dim);
      background: none; transition: background .1s;
    }
    #psz-reset:hover { background: var(--bg-hover); color: var(--text-1,#e0ddd8); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     REPLACE projWindowHTML — no virtual canvas, true viewport
  ══════════════════════════════════════════════════════════ */

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
  display: flex; flex-direction: column;
}

/* Background fills entire screen */
#proj-bg {
  position: fixed; inset: 0;
  transition: background .5s;
  z-index: 0;
}

/* Reference line — fixed height at top */
#proj-ref {
  position: relative; z-index: 2;
  flex-shrink: 0;
  padding: 1.2vh 4vw 0;
  font-family: 'Cinzel', serif;
  font-size: clamp(10px, 1.6vh, 26px);
  letter-spacing: .35em;
  color: rgba(201,168,76,.8);
  text-transform: uppercase;
  text-align: center;
  min-height: 4.5vh;
  display: flex; align-items: center; justify-content: center;
}

/* Text wrapper — ALL remaining space */
#proj-text-wrap {
  position: relative; z-index: 2;
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1vh 3vw;
  overflow: hidden;
}

/* The text itself — fitText() sets font-size */
#proj-text {
  width: 100%;
  line-height: 1.22;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
}

/* Footer */
#proj-footer {
  position: relative; z-index: 2;
  flex-shrink: 0;
  min-height: 3.5vh;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4vw 1vh;
  font-family: 'Cinzel', serif;
  font-size: clamp(8px, 1.3vh, 20px);
  letter-spacing: .22em;
  color: rgba(255,255,255,.25);
  text-transform: uppercase;
  text-align: center;
}

/* Lower third */
#proj-lt {
  position: fixed; bottom:0; left:0; right:0; z-index:10;
  padding: 1.5vh 3vw;
  display: none; text-align: center;
  font-size: clamp(14px, 2.8vh, 44px);
  font-weight: 700; letter-spacing: .06em; color: #fff;
}
#proj-lt.visible    { display: block; }
#proj-lt.lt-default { background: rgba(8,5,26,.88); border-top:1px solid rgba(201,168,76,.3); }
#proj-lt.lt-gold    { background: linear-gradient(90deg,#8a5a00,#c9a84c,#8a5a00); }
#proj-lt.lt-dark    { background: rgba(0,0,0,.95); border-top:2px solid rgba(255,255,255,.18); }
#proj-lt.lt-alert   { background: rgba(140,0,0,.9); border-top:2px solid #e05050; }

#proj-blank { position:fixed; inset:0; background:#000; display:none; z-index:99; }

/* Transitions */
@keyframes fadeIn  { from{opacity:0}           to{opacity:1} }
@keyframes slideIn { from{opacity:0;transform:translateY(3vh)} to{opacity:1;transform:none} }
@keyframes zoomIn  { from{opacity:0;transform:scale(.93)}      to{opacity:1;transform:scale(1)} }
.trans-fade  #proj-text-wrap { animation: fadeIn  var(--ts,.5s) ease; }
.trans-slide #proj-text-wrap { animation: slideIn var(--ts,.5s) ease; }
.trans-zoom  #proj-text-wrap { animation: zoomIn  var(--ts,.5s) ease; }
</style>
</head><body>
<div id="proj-bg" style="background:${curBg.bg};"></div>
<div id="proj-ref"></div>
<div id="proj-text-wrap">
  <div id="proj-text"></div>
</div>
<div id="proj-footer"></div>
<div id="proj-lt"></div>
<div id="proj-blank"></div>

<script>
/*
 * fitText — binary-search for the largest font-size where
 * #proj-text fits inside #proj-text-wrap.
 * scale: user multiplier injected from the main window.
 */
window._projScale = ${_scale};

window.fitText = function () {
  var txt  = document.getElementById('proj-text');
  var wrap = document.getElementById('proj-text-wrap');
  if (!txt || !wrap) return;

  var W = wrap.clientWidth;
  var H = wrap.clientHeight;
  if (W <= 0 || H <= 0) return;

  txt.style.width    = W + 'px';
  txt.style.maxWidth = W + 'px';

  var lo = 10, hi = 600, best = 10;
  for (var i = 0; i < 28; i++) {
    var mid = (lo + hi) >> 1;
    txt.style.fontSize = mid + 'px';
    var fits = txt.scrollWidth  <= W + 2
            && txt.scrollHeight <= H + 2;
    if (fits) { best = mid; lo = mid + 1; }
    else       { hi  = mid - 1; }
  }

  /* Apply user scale on top of auto-fit */
  var final = Math.max(10, Math.round(best * window._projScale));
  txt.style.fontSize = final + 'px';
  txt.style.width    = '';
  txt.style.maxWidth = '';
};

/* Re-fit on any resize / fullscreen change */
window.addEventListener('resize', function () { setTimeout(fitText, 60); });
document.addEventListener('fullscreenchange', function () { setTimeout(fitText, 100); });
<\/script>
</body></html>`;
  };


  /* ══════════════════════════════════════════════════════════
     PATCH push() — set content then call fitText in proj win
  ══════════════════════════════════════════════════════════ */

  const _origPush = window.push;
  window.push = function () {
    if (_origPush) _origPush();
    _pushContent();
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

  function _pushContent() {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const d = pw.document;

    const bg    = d.getElementById('proj-bg');
    const ref   = d.getElementById('proj-ref');
    const txt   = d.getElementById('proj-text');
    const foot  = d.getElementById('proj-footer');
    const lt    = d.getElementById('proj-lt');
    const blank = d.getElementById('proj-blank');
    const body  = d.body;

    /* Background */
    const curBg = (typeof BACKGROUNDS !== 'undefined')
      ? (BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0])
      : { bg: '#08051a' };
    if (bg) bg.style.background = curBg.bg;

    if (blank) blank.style.display = S.blanked ? 'block' : 'none';

    if (body) {
      body.className = 'trans-' + (S.transName || 'fade');
      body.style.setProperty('--ts', (S.transSpeed || .5) + 's');
    }

    if (!S.slides?.length || !S.live) return;

    const sl   = S.slides[S.cur] || {};
    const song = S.songIdx != null ? (SONGS?.[S.songIdx]?.title || '') : '';
    const f    = S.format || {};

    /* Reference */
    if (ref) ref.textContent =
      (song ? song + ' · ' : '') + (sl.section || '');

    /* Text content + format */
    if (txt) {
      txt.innerHTML     = (sl.text || '').replace(/\n/g, '<br>');
      txt.style.fontFamily  = `'${f.font || 'Playfair Display'}', serif`;
      txt.style.textAlign   = f.align   || 'center';
      txt.style.fontWeight  = f.bold    ? '700' : '400';
      txt.style.fontStyle   = f.italic  ? 'italic' : 'normal';
      txt.style.color       = f.color   || '#f6f2ec';
      txt.style.lineHeight  = '1.22';
      txt.style.textShadow  = _shadow(f.shadow, f.color);
    }

    /* Footer */
    if (foot) {
      const parts = [];
      if (sl.section) parts.push(sl.section);
      if (sl.author)  parts.push(sl.author);
      if (sl.version) parts.push(sl.version);
      if (S.ccli)     parts.push('CCLI #' + S.ccli);
      foot.textContent = parts.join('  ·  ');
    }

    /* Lower third */
    if (lt) {
      lt.className = '';
      if (S.lowerThird?.active && S.lowerThird.text) {
        lt.className  = 'visible lt-' + S.lowerThird.style;
        lt.textContent = S.lowerThird.text;
      }
    }

    /* Update scale then fit */
    pw._projScale = _scale;
    requestAnimationFrame(() => {
      try { pw.fitText?.(); } catch(e) {}
    });
  }


  /* ══════════════════════════════════════════════════════════
     WIRE PROJECTION WINDOW AFTER OPEN
  ══════════════════════════════════════════════════════════ */

  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      setTimeout(() => {
        const pw = S?.projWin;
        if (!pw || pw.closed) return;
        pw._projScale = _scale;
        pw.addEventListener('resize', () => {
          pw._projScale = _scale;
          setTimeout(() => { try { pw.fitText?.(); } catch(e) {} }, 80);
        }, { passive: true });
        pw.document.addEventListener('fullscreenchange', () => {
          setTimeout(() => { pw._projScale = _scale; pw.fitText?.(); }, 120);
        });
        setTimeout(() => {
          try { pw.fitText?.(); } catch(e) {}
          // Apply clock font + pos after open
          if (typeof _applyClockFontToAll === 'function') _applyClockFontToAll();
        }, 600);
      }, 1000);
    };
  }


  /* ══════════════════════════════════════════════════════════
     SCALE CONTROLS — replace original +/- behaviour
  ══════════════════════════════════════════════════════════ */

  function _applyScale(s) {
    _scale = Math.max(S_MIN, Math.min(S_MAX, Math.round(s * 10) / 10));
    const val = document.getElementById('proj-scale-val');
    if (val) val.textContent = Math.round(_scale * 100) + '%';
    try { localStorage.setItem('bw_proj_scale', String(_scale)); } catch(e) {}

    /* Push to open projection window */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      pw._projScale = _scale;
      try { pw.fitText?.(); } catch(e) {}
    }
  }

  /* Override original resize() so +/- adjust scale, not absolute px */
  window.resize = function (delta) {
    _applyScale(_scale + delta * S_STEP);
  };

  window.projScaleReset = function () { _applyScale(1.0); };

  /* ── Build scale controls next to the old +/- buttons ── */
  function _buildScaleControls() {
    if (document.getElementById('proj-scale-wrap')) return;

    const sizeCtrl = document.querySelector('.size-ctrl');
    if (!sizeCtrl) return;

    /* Replace the entire size-ctrl content with scale controls */
    sizeCtrl.innerHTML = `
      <span style="font-size:10px;color:var(--text-3);margin-right:2px;">Text</span>
      <button class="sz-btn psz-btn" onclick="resize(-1)" title="Scale down">−</button>
      <div id="proj-scale-val" class="sz-val">${Math.round(_scale * 100)}%</div>
      <button class="sz-btn psz-btn" onclick="resize(+1)" title="Scale up">+</button>
      <button id="psz-reset" onclick="projScaleReset()" title="Reset to auto-fit">Auto</button>
    `;
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    _buildScaleControls();
    console.info('[BW fix22] ✓ Viewport-native proj  ✓ Scale ±  ✓ Any screen ratio');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { setTimeout(boot, 300); }

})();
ENDOFFILE
