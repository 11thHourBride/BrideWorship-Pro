

(function BW_Patch2() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     PART 1 — PROJECTION WINDOW: FULL-SCREEN + TEXT FORMATTING
  ═══════════════════════════════════════════════════════════ */

  /* ── Override projWindowHTML to use viewport units ──
     The original used fixed px widths and padding so content
     only occupied part of the window on large displays.
     This version scales everything to vw/vh and uses flex
     centering so text always fills the projection surface.   */
  window.projWindowHTML = function () {
    const curBg = (typeof BACKGROUNDS !== 'undefined')
      ? (BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0])
      : { bg: '#08051a' };

    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{
  width:100vw;height:100vh;overflow:hidden;
  background:#000;
  font-family:'Playfair Display',serif;
  color:#fff;
}
#proj-bg{
  position:fixed;inset:0;
  background:${curBg.bg};
  transition:background .5s;
  z-index:0;
}
#proj-inner{
  position:fixed;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:5vw 7vw;
  z-index:2;
  text-align:center;
  width:100vw;height:100vh;
}
#proj-ref{
  font-family:'Cinzel',serif;
  font-size:clamp(10px,1.1vw,20px);
  letter-spacing:.42em;
  color:rgba(201,168,76,.8);
  text-transform:uppercase;
  margin-bottom:clamp(12px,2.2vh,30px);
  width:100%;
}
#proj-text{
  width:100%;
  line-height:1.6;
  text-shadow:0 2px 30px rgba(0,0,0,.95);
  transition:font-size .2s,color .2s,font-family .2s;
  word-wrap:break-word;
}
#proj-footer{
  position:fixed;bottom:2.5vh;left:0;right:0;
  text-align:center;
  font-family:'Cinzel',serif;
  font-size:clamp(8px,.9vw,15px);
  letter-spacing:.28em;
  color:rgba(255,255,255,.28);
  text-transform:uppercase;
  z-index:3;
}
#proj-lt{
  position:fixed;bottom:0;left:0;right:0;
  padding:clamp(10px,1.6vh,26px) clamp(20px,3vw,56px);
  display:none;text-align:center;
  font-size:clamp(14px,1.9vw,38px);
  font-weight:700;letter-spacing:.08em;
  color:#fff;z-index:10;
}
#proj-lt.visible{display:block;}
#proj-lt.lt-default{background:rgba(8,5,26,.88);border-top:1px solid rgba(201,168,76,.3);}
#proj-lt.lt-gold{background:linear-gradient(90deg,#8a5a00,#c9a84c,#8a5a00);}
#proj-lt.lt-dark{background:rgba(0,0,0,.95);border-top:2px solid rgba(255,255,255,.18);}
#proj-lt.lt-alert{background:rgba(140,0,0,.9);border-top:2px solid #e05050;}
#proj-blank{position:fixed;inset:0;background:#000;display:none;z-index:99;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateY(2vh)}to{opacity:1;transform:none}}
@keyframes zoomIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
.trans-fade  #proj-inner{animation:fadeIn  var(--ts,.5s) ease;}
.trans-slide #proj-inner{animation:slideIn var(--ts,.5s) ease;}
.trans-zoom  #proj-inner{animation:zoomIn  var(--ts,.5s) ease;}
</style>
</head><body>
<div id="proj-bg"></div>
<div id="proj-inner">
  <div id="proj-ref"></div>
  <div id="proj-text"></div>
</div>
<div id="proj-footer"></div>
<div id="proj-lt"></div>
<div id="proj-blank"></div>
</body></html>`;
  };

  /* ── Core: resolve a shadow key to a CSS value ── */
  function _shadow(key, color) {
    const c = color || '#f6f2ec';
    return ({
      none:    'none',
      soft:    '0 2px 30px rgba(0,0,0,.95)',
      hard:    '2px 2px 0 rgba(0,0,0,.9)',
      glow:    `0 0 30px ${c}88,0 2px 20px rgba(0,0,0,.8)`,
      outline: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
    })[key] || '0 2px 30px rgba(0,0,0,.95)';
  }

  /* ── Apply format object to any DOM element ── */
  function _applyFmt(el, f, fontSize) {
    if (!el || !f) return;
    el.style.fontFamily  = `'${f.font || 'Playfair Display'}',serif`;
    el.style.textAlign   = f.align     || 'center';
    el.style.fontWeight  = f.bold      ? '700' : '400';
    el.style.fontStyle   = f.italic    ? 'italic' : 'normal';
    el.style.color       = f.color     || '#f6f2ec';
    el.style.fontSize    = fontSize    || '26px';
    el.style.lineHeight  = f.lineHeight|| '1.65';
    el.style.textShadow  = _shadow(f.shadow, f.color);
    el.style.display     = 'block';
    el.style.width       = '100%';
  }

  /* ── Override push() — fixes the template-literal bug in the original
     and ensures the projection window always gets proper formatting. ── */
  window.push = function () {
    _pushPreview();
    _pushProjection();
  };

  /* Update the right-panel output preview */
  function _pushPreview() {
    if (!S || !S.slides || !S.slides.length) return;
    const sl    = S.slides[S.cur];
    const song  = S.songIdx !== null ? (SONGS[S.songIdx]?.title || '') : '';
    const f     = S.format;
    const curBg = (BACKGROUNDS || []).find(b => b.id === S.bgId) || { bg: '#08051a' };

    const outBg = document.getElementById('out-bg');
    if (outBg && !String(S.bgId || '').startsWith('custom_media')) {
      outBg.style.background = curBg.bg;
    }

    const oRef = document.getElementById('o-ref');
    if (oRef) oRef.textContent = song
      ? `${song} · ${sl.section || ''}`
      : (sl.section || '');

    const oTxt = document.getElementById('o-txt');
    if (oTxt) {
      oTxt.innerHTML = (sl.text || '').replace(/\n/g, '<br>');
      _applyFmt(oTxt, f, '9px');   /* small for preview pane */
    }

    const badge  = document.getElementById('o-badge');
    const screen = document.getElementById('out-screen');
    if (badge) {
      badge.textContent = S.live ? 'LIVE' : (S.blanked ? 'BLANK' : 'HIDDEN');
      badge.classList.toggle('live', S.live);
    }
    if (screen) screen.classList.toggle('live', S.live);

    const omc = document.getElementById('omt-counter');
    if (omc) omc.textContent = `${S.cur + 1} / ${S.slides.length}`;

    /* Lower-third in preview */
    const outLt = document.getElementById('out-lt');
    if (outLt) {
      outLt.className = 'out-lt';
      if (S.lowerThird?.active && S.lowerThird.text) {
        outLt.classList.add('visible', 'lt-' + S.lowerThird.style);
        outLt.textContent = S.lowerThird.text;
      }
    }
  }

  /* Push to projection popup window */
  function _pushProjection() {
    if (!S.projWin || S.projWin.closed) return;
    const d = S.projWin.document;

    const bg    = d.getElementById('proj-bg');
    const ref   = d.getElementById('proj-ref');
    const txt   = d.getElementById('proj-text');
    const foot  = d.getElementById('proj-footer');
    const lt    = d.getElementById('proj-lt');
    const blank = d.getElementById('proj-blank');
    const body  = d.body;

    const curBg = (BACKGROUNDS || []).find(b => b.id === S.bgId) || { bg: '#08051a' };
    if (bg) bg.style.background = curBg.bg;
    if (blank) blank.style.display = S.blanked ? 'block' : 'none';

    if (body) {
      body.className = 'trans-' + (S.transName || 'fade');
      body.style.setProperty('--ts', (S.transSpeed || .5) + 's');
    }

    if (!S.slides.length || !S.live) {
      if (txt && !S.live) txt.textContent = '';
      return;
    }

    const sl   = S.slides[S.cur];
    const song = S.songIdx !== null ? (SONGS[S.songIdx]?.title || '') : '';
    const f    = S.format;

    if (ref) ref.textContent = (song ? song + ' · ' : '') + (sl.section || '');

    if (txt) {
      txt.innerHTML = (sl.text || '').replace(/\n/g, '<br>');
      /* ─── THIS IS THE CRITICAL FIX ───
         The original push() used the literal string '${f.font}'
         instead of a template literal, so formatting was never applied.
         We call _applyFmt() which correctly interpolates all values. */
      _applyFmt(txt, f, S.fontSize + 'px');
    }

    if (foot) {
      const parts = [];
      if (sl.section) parts.push(sl.section);
      if (sl.version) parts.push(sl.version);
      if (S.ccli) parts.push('CCLI #' + S.ccli);
      foot.textContent = parts.join('  ·  ');
    }

    if (lt) {
      lt.className = '';
      if (S.lowerThird?.active && S.lowerThird.text) {
        lt.className = 'visible lt-' + S.lowerThird.style;
        lt.textContent = S.lowerThird.text;
      }
    }
  }

  /* Export so other modules (fix.js timers, theme-engine) can reuse */
  window._bwApplyFmt = _applyFmt;

  /* ── Also patch applyStyleToEl so the main slide + preview always stay in sync ── */
  const _origApplyStyleToEl = window.applyStyleToEl;
  window.applyStyleToEl = function (el) {
    if (_origApplyStyleToEl) _origApplyStyleToEl(el);
    requestAnimationFrame(_pushPreview);
  };


 
})();
