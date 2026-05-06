/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix6.js
   Output Preview (#out-screen) Layout Fix

   1. HIDDEN / LIVE badge  → pinned top-left
   2. Content (ref + text) → true vertical + horizontal centre
   3. Clock                → bottom-left by default
                              (still respects the Clock Display
                               position selector in the right panel)
═══════════════════════════════════════════════════════════ */

(function BW_Fix6() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1 — CSS LAYOUT FIXES
  ══════════════════════════════════════════════════════════ */

  const style = document.createElement('style');
  style.id    = 'bw-fix6-layout';
  style.textContent = `

    /* ── Out-screen: explicit relative container ── */
    #out-screen {
      position: relative !important;
      overflow: hidden   !important;
      display: flex      !important;
      flex-direction: column !important;
    }

    /* ══════════════════════════════════════════════
       BADGE — top-left corner, always on top
    ══════════════════════════════════════════════ */
    #o-badge {
      position : absolute !important;
      top      : 6px      !important;
      left     : 7px      !important;
      right    : auto     !important;
      bottom   : auto     !important;
      z-index  : 10       !important;

      /* appearance */
      font-family    : 'Cinzel', serif !important;
      font-size      : 7px             !important;
      font-weight    : 700             !important;
      letter-spacing : 2px             !important;
      text-transform : uppercase       !important;
      padding        : 2px 6px         !important;
      border-radius  : 3px             !important;
      line-height    : 1.4             !important;

      /* default: HIDDEN style */
      background : rgba(30,30,40,.75)           !important;
      border     : 1px solid rgba(255,255,255,.15) !important;
      color      : rgba(255,255,255,.45)          !important;
    }
    /* LIVE state — green glow */
    #o-badge.live {
      background : rgba(76,175,122,.85)  !important;
      border     : 1px solid #4caf7a     !important;
      color      : #000                  !important;
    }

    /* ══════════════════════════════════════════════
       INNER CONTENT — centred in the remaining space
    ══════════════════════════════════════════════ */
    .out-inner {
      position        : absolute !important;
      inset           : 0        !important;
      display         : flex     !important;
      flex-direction  : column   !important;
      align-items     : center   !important;
      justify-content : center   !important;
      padding         : 18% 8% 12% !important; /* top pad clears the badge */
      z-index         : 2        !important;
      pointer-events  : none     !important;
      text-align      : center   !important;
    }

    /* Reference line */
    #o-ref {
      width         : 100%                !important;
      font-family   : 'Cinzel', serif     !important;
      font-size     : clamp(6px,.9vw,10px) !important;
      letter-spacing: .3em                !important;
      text-transform: uppercase           !important;
      color         : rgba(201,168,76,.75)!important;
      margin-bottom : 4%                  !important;
      white-space   : nowrap              !important;
      overflow      : hidden              !important;
      text-overflow : ellipsis            !important;
    }

    /* Main lyrics / text */
    #o-txt {
      width      : 100%                    !important;
      font-size  : clamp(7px,1.1vw,13px)  !important;
      line-height: 1.55                    !important;
      word-wrap  : break-word              !important;
      text-align : center                  !important;
    }

    /* ══════════════════════════════════════════════
       CLOCK — position classes
       Default is pos-bl (bottom-left).
       All positions are supported via the selector.
    ══════════════════════════════════════════════ */
    .out-clock {
      position   : absolute !important;
      z-index    : 5        !important;
      font-family: 'Cinzel', serif !important;
      font-size  : 9px      !important;
      white-space: nowrap   !important;
      pointer-events: none  !important;
    }

    /* --- Position classes --- */
    .out-clock.pos-bl { bottom:5px; left:7px;  right:auto; top:auto;  transform:none; }
    .out-clock.pos-br { bottom:5px; right:7px; left:auto;  top:auto;  transform:none; }
    .out-clock.pos-tl { top:5px;    left:7px;  right:auto; bottom:auto; transform:none; }
    .out-clock.pos-tr { top:5px;    right:7px; left:auto;  bottom:auto; transform:none; }
    .out-clock.pos-bc { bottom:5px; left:50%;  right:auto; top:auto;  transform:translateX(-50%); }
    .out-clock.pos-tc { top:5px;    left:50%;  right:auto; bottom:auto; transform:translateX(-50%); }

    /* --- Clock style sub-classes --- */
    .out-clock.style-plain   { text-shadow:none; background:none; }
    .out-clock.style-shadow  { text-shadow:0 1px 4px rgba(0,0,0,.95); background:none; }
    .out-clock.style-box     { background:rgba(0,0,0,.6); padding:1px 5px; border-radius:3px; }
    .out-clock.style-outline { -webkit-text-stroke:1px rgba(0,0,0,.8); text-shadow:none; background:none; }
    .out-clock.style-gold    { text-shadow:0 0 8px rgba(201,168,76,.7); background:none; }

    /* ── Hide the old out-lt lower-third from overlapping ── */
    .out-lt { z-index:4 !important; }

    /* ── Background layer stays below everything ── */
    #out-bg, #out-media-overlay { z-index:0 !important; }
    .out-vignette { z-index:1 !important; }
  `;
  document.head.appendChild(style);


  /* ══════════════════════════════════════════════════════════
     2 — DEFAULT CLOCK POSITION: bottom-left
     Overrides CLOCK_STATE.pos and updates the dropdown so the
     right-panel control stays in sync.
  ══════════════════════════════════════════════════════════ */

  function _patchClockDefault() {
    /* Only change if the user hasn't already saved a preference */
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem('bw_clock') || 'null'); }
      catch (e) { return null; }
    })();

    /* If no saved preference exists, default to bottom-left */
    if (!saved || !saved.pos) {
      if (typeof CLOCK_STATE !== 'undefined') {
        CLOCK_STATE.pos = 'bl';
      }
      /* Update the dropdown in the right panel */
      const sel = document.getElementById('clock-pos');
      if (sel) sel.value = 'bl';
    }

    /* Apply the position to the live clock element */
    _applyClockPosition();
  }

  function _applyClockPosition() {
    const el = document.getElementById('out-clock');
    if (!el) return;

    /* Determine current position from CLOCK_STATE or the dropdown */
    let pos = 'bl';
    if (typeof CLOCK_STATE !== 'undefined' && CLOCK_STATE.pos) {
      pos = CLOCK_STATE.pos;
    } else {
      const sel = document.getElementById('clock-pos');
      if (sel) pos = sel.value || 'bl';
    }

    /* Remove all position classes then add the correct one */
    ['pos-bl','pos-br','pos-tl','pos-tr','pos-bc','pos-tc'].forEach(c =>
      el.classList.remove(c)
    );
    el.classList.add('pos-' + pos);
  }


  /* ══════════════════════════════════════════════════════════
     3 — PATCH updateClockSettings so position changes apply
         to the preview clock immediately
  ══════════════════════════════════════════════════════════ */

  const _origUpdateClockSettings = window.updateClockSettings;
  window.updateClockSettings = function () {
    if (_origUpdateClockSettings) _origUpdateClockSettings();
    /* Re-apply position classes after the original function runs */
    requestAnimationFrame(_applyClockPosition);
  };


  /* ══════════════════════════════════════════════════════════
     4 — PATCH tickClock so pos-* class is reapplied every tick
         (tickClock rebuilds the className each second)
  ══════════════════════════════════════════════════════════ */

  const _origTickClock = window.tickClock;
  window.tickClock = function () {
    if (_origTickClock) _origTickClock();
    requestAnimationFrame(_applyClockPosition);
  };


  /* ══════════════════════════════════════════════════════════
     5 — ENSURE .out-inner EXISTS
     The original HTML uses #out-screen > .out-inner.
     If it's missing (some builds render differently), create it.
  ══════════════════════════════════════════════════════════ */

  function _ensureOutInner() {
    const screen = document.getElementById('out-screen');
    if (!screen) return;

    let inner = screen.querySelector('.out-inner');
    if (inner) return; /* already exists */

    /* Wrap #o-ref + #o-txt inside a new .out-inner div */
    const ref = document.getElementById('o-ref');
    const txt = document.getElementById('o-txt');
    if (!ref && !txt) return;

    inner = document.createElement('div');
    inner.className = 'out-inner';

    /* Insert before the first of the two elements */
    const first = ref || txt;
    screen.insertBefore(inner, first);
    if (ref) inner.appendChild(ref);
    if (txt) inner.appendChild(txt);
  }


  /* ══════════════════════════════════════════════════════════
     6 — BADGE TEXT GUARD
     Ensure the badge always says HIDDEN or LIVE (never blank).
  ══════════════════════════════════════════════════════════ */

  function _guardBadge() {
    const badge = document.getElementById('o-badge');
    if (!badge) return;
    if (!badge.textContent.trim()) {
      badge.textContent = (typeof S !== 'undefined' && S.live) ? 'LIVE' : 'HIDDEN';
    }
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    _ensureOutInner();
    _patchClockDefault();
    _guardBadge();

    /* Re-apply on every push() so slide changes don't break layout */
    const _origPush = window.push;
    if (typeof _origPush === 'function') {
      window.push = function () {
        _origPush();
        requestAnimationFrame(() => {
          _applyClockPosition();
          _guardBadge();
        });
      };
    }

    console.info('[BW fix6.js] ✓ Badge top-left  ✓ Content centred  ✓ Clock bottom-left default');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }

})();
