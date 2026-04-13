// Override existing renderTimerDisp
window._bwTimerTick = function () {
  const rem = S.timer.rem;
  const m   = Math.floor(rem / 60);
  const sc  = rem % 60;
  const str = (m < 10 ? '0' : '') + m + ':' + (sc < 10 ? '0' : '') + sc;

  // ── Local display (center panel timer view)
  const el = document.getElementById('t-display');
  if (el) {
    el.textContent = str;
    el.className   = 'timer-display';
    if (rem <= 30 && rem > 10) el.classList.add('warning');
    if (rem <= 10)              el.classList.add('urgent');
  }

  // ── Stage display timer
  pushStageTimer(str);

  // ── If projected, push to projection window
  if (S.timer.projected) {
    pushTimerToProjectionWindow(str);
  }
};

// Replace startTimer to use new tick
function startTimer() {
  if (S.timer.running) return;
  S.timer.running = true;
  document.getElementById('tc-start').disabled = true;
  document.getElementById('tc-pause').disabled = false;

  S.timer.iv = setInterval(() => {
    if (S.timer.countUp) {
      S.timer.rem++;
      window._bwTimerTick();
    } else {
      if (S.timer.rem > 0) {
        S.timer.rem--;
        window._bwTimerTick();
      } else {
        // Timer finished
        pauseTimer();
        handleTimerEnd();
      }
    }
  }, 1000);
}

function pauseTimer() {
  S.timer.running = false;
  clearInterval(S.timer.iv);
  const startBtn = document.getElementById('tc-start');
  const pauseBtn = document.getElementById('tc-pause');
  if (startBtn) startBtn.disabled = false;
  if (pauseBtn) pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  S.timer.rem = S.timer.total;
  window._bwTimerTick();
  // Clear any end-message from projection
  clearTimerEndMessage();
}

// Push running timer to actual projection window
function pushTimerToProjectionWindow(str) {
  if (!S.projWin || S.projWin.closed) return;
  const d    = S.projWin.document;
  const ref  = d.getElementById('proj-ref');
  const txt  = d.getElementById('proj-text');
  const foot = d.getElementById('proj-footer');

  if (ref)  ref.textContent  = 'COUNTDOWN';
  if (foot) foot.textContent = '';
  if (txt) {
    // Detect warning / urgent for colour
    const rem = S.timer.rem;
    let color = '#c9a84c';
    if (rem <= 30 && rem > 10) color = '#d4a017';
    if (rem <= 10)              color = '#e05050';

    const size = Math.max(S.fontSize + 22, 72);
    txt.innerHTML = `<span style="
      font-family:'Cinzel',serif;
      font-size:${size}px;
      letter-spacing:8px;
      color:${color};
      text-shadow:0 0 60px ${color}44, 0 2px 30px rgba(0,0,0,.95);
      transition:color .5s;
    ">${str}</span>`;
  }
}

// Push stage timer (stage display window)
function pushStageTimer(str) {
  if (!S.stageWin || S.stageWin.closed) return;
  const d       = S.stageWin.document;
  const timerEl = d.getElementById('stg-timer');
  if (!timerEl) return;

  if (S.timer.projected && (S.timer.running || S.timer.rem < S.timer.total)) {
    const rem = S.timer.rem;
    timerEl.style.color = rem <= 10 ? '#e05050' : rem <= 30 ? '#d4a017' : 'var(--gold)';
    timerEl.textContent = str;
    timerEl.classList.add('visible');
  } else {
    timerEl.classList.remove('visible');
  }
}

// Handle timer reaching 00:00
function handleTimerEnd() {
  const msg = document.getElementById('timer-end-msg')?.value.trim();

  // Local display — show end message in timer panel
  const el = document.getElementById('t-display');
  if (el) {
    el.textContent = '00:00';
    el.className   = 'timer-display urgent';
  }

  if (msg) {
    // Project end message to slides view with fade-in
    projectTimerEndMessage(msg);
  } else {
    // Just flash 00:00 on projection
    if (S.timer.projected) {
      pushTimerToProjectionWindow('00:00');
    }
  }
}

function projectTimerEndMessage(msg) {
  // Apply to local slide preview
  const tEl = document.getElementById('s-title');
  const lEl = document.getElementById('s-text');
  if (tEl) tEl.textContent = '';
  if (lEl) {
    lEl.innerHTML  = msg.replace(/\n/g, '<br>');
    lEl.classList.remove('timer-end-msg-anim');
    void lEl.offsetWidth; // reflow to restart animation
    lEl.classList.add('timer-end-msg-anim');
    applyStyleToEl(lEl);
  }

  // Push to projection window with animation
  if (S.timer.projected && S.projWin && !S.projWin.closed) {
    const d   = S.projWin.document;
    const ref = d.getElementById('proj-ref');
    const txt = d.getElementById('proj-text');
    const foot= d.getElementById('proj-footer');
    if (ref)  ref.textContent = '';
    if (foot) foot.textContent = '';
    if (txt) {
      txt.innerHTML = `<span style="
        font-family:'${S.format.font}',serif;
        font-size:${S.fontSize}px;
        color:${S.format.color};
        text-align:${S.format.align};
        line-height:${S.format.lineHeight || 1.65};
        text-shadow:0 2px 30px rgba(0,0,0,.95);
        display:block;
        animation:projEndFadeIn .9s cubic-bezier(.22,1,.36,1) both;
      ">${msg.replace(/\n/g,'<br>')}</span>`;
    }
    // Inject keyframe into projection window if not already present
    injectProjEndAnim();
  }

  // Update output preview
  const oRef = document.getElementById('o-ref');
  const oTxt = document.getElementById('o-txt');
  if (oRef) oRef.textContent = '';
  if (oTxt) oTxt.innerHTML   = msg.replace(/\n/g,'<br>');
}

function clearTimerEndMessage() {
  // Restore slide content after timer reset
  if (S.slides.length) {
    renderSlide();
  } else {
    const lEl = document.getElementById('s-text');
    if (lEl) {
      lEl.innerHTML = 'Select a song or build your Service Order to begin projecting.';
      lEl.style.fontSize = '20px';
      lEl.style.color    = 'var(--text-3)';
      lEl.classList.remove('timer-end-msg-anim');
    }
  }
  // Clear projection window
  if (S.timer.projected && S.projWin && !S.projWin.closed) {
    push();
  }
}

function injectProjEndAnim() {
  if (!S.projWin || S.projWin.closed) return;
  const d = S.projWin.document;
  if (d.getElementById('bw-end-anim')) return; // already injected
  const style = d.createElement('style');
  style.id   = 'bw-end-anim';
  style.textContent = `
    @keyframes projEndFadeIn {
      from { opacity:0; transform:translateY(18px) scale(.95); }
      to   { opacity:1; transform:none; }
    }`;
  d.head.appendChild(style);
}

// Also fix toggleTimerProj to use new pushTimerToProjectionWindow
function toggleTimerProj() {
  S.timer.projected = !S.timer.projected;
  const btn  = document.getElementById('tc-proj');
  const note = document.getElementById('t-note');
  btn?.classList.toggle('on', S.timer.projected);
  if (note) note.textContent = S.timer.projected
    ? '📡 Timer is projected — showing on Second Screen.'
    : 'Timer not projected — click "Project" to show on live screen.';

  if (!S.timer.projected) {
    // Restore normal slide content in projection window
    if (S.slides.length && S.projWin && !S.projWin.closed) push();
    // Hide timer from stage
    if (S.stageWin && !S.stageWin.closed) {
      const el = S.stageWin.document.getElementById('stg-timer');
      if (el) el.classList.remove('visible');
    }
  } else {
    // Immediately push current time if running
    if (S.timer.running) {
      const m   = Math.floor(S.timer.rem/60);
      const sc  = S.timer.rem % 60;
      const str = (m<10?'0':'')+m+':'+(sc<10?'0':'')+sc;
      pushTimerToProjectionWindow(str);
    }
  }
}

// Ensure renderTimerDisp also uses the new tick function
function renderTimerDisp() {
  window._bwTimerTick();
}

// Patch setTimer and setTimerCustom to refresh display too
function setTimer(mins) {
  pauseTimer();
  clearTimerEndMessage();
  S.timer.rem = S.timer.total = mins * 60;
  window._bwTimerTick();
}

function setTimerCustom() {
  const m  = parseInt(document.getElementById('t-min')?.value) || 0;
  const sc = parseInt(document.getElementById('t-sec')?.value) || 0;
  pauseTimer();
  clearTimerEndMessage();
  S.timer.rem = S.timer.total = m * 60 + sc;
  window._bwTimerTick();
}

/* ═══════════════════════════════════════════════════════════════
   BrideWorship Pro — fix.js
   Fixes:
   1. Schedule view bleeds into Service Order / Timer tabs
      Root cause: 'schedule-view' was absent from centerTab's
      hide list, so it stayed visible on other tabs.
   2. Countdown Timer tab is blank
      Root cause: #timer-view is a child of #service-view in the
      HTML. The original centerTab hid service-view then tried to
      show timer-view — but a child of a hidden element never
      renders, so the timer panel was invisible.
═══════════════════════════════════════════════════════════════ */

(function installFixes() {

  /* ─────────────────────────────────────────────────────────
     centerTab — complete replacement
     Handles all four tabs:
       slides-view      direct child of .center
       service-view     direct child of .center
       schedule-view    direct child of .center
       timer-view       NESTED INSIDE service-view  ← special case
  ───────────────────────────────────────────────────────── */
  window.centerTab = function(btn, panelId) {

    /* 1. Highlight the clicked tab button */
    document.querySelectorAll('.ctab').forEach(b => b.classList.remove('on'));
    if (btn) btn.classList.add('on');

    /* 2. Hide every top-level center panel
          (schedule-view was the missing one causing the bleed) */
    ['slides-view', 'service-view', 'schedule-view'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    /* 3. Undo any leftover timer-tab DOM changes inside service-view.
          When we leave the timer tab we need to restore SO children
          so Service Order still works next time it's shown. */
    _resetServiceViewChildren();

    /* 4. Timer lives INSIDE service-view — special handling.
          We show service-view as the shell but hide every child
          except #timer-view, making only the timer visible. */
    if (panelId === 'timer-view') {
      const sv = document.getElementById('service-view');
      if (sv) {
        sv.style.display = 'flex';
        Array.from(sv.children).forEach(child => {
          child.style.display = child.id === 'timer-view' ? 'flex' : 'none';
        });
      }
      return;
    }

    /* 5. All other panels — show normally */
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'flex';
  };

  /* ─────────────────────────────────────────────────────────
     _resetServiceViewChildren
     Clears any display overrides we applied when showing the
     timer tab, restoring the service-order layout.
     The so-editor-drawer is left alone — its visibility is
     managed exclusively by openSODrawer / closeSODrawer.
  ───────────────────────────────────────────────────────── */
  function _resetServiceViewChildren() {
    const sv = document.getElementById('service-view');
    if (!sv) return;

    Array.from(sv.children).forEach(child => {
      if (child.id === 'timer-view') {
        /* Timer always hidden unless we're on the timer tab */
        child.style.display = 'none';
      } else if (child.id === 'so-editor-drawer') {
        /* Drawer visibility is owned by its own open/close functions */
      } else {
        /* Remove any inline style so the CSS class rules take over */
        child.style.display = '';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     Patch fixTemplatesModalNesting (if theme-engine.js has
     not been loaded yet, supply a safe fallback here too).
  ───────────────────────────────────────────────────────── */
  function _fixTemplatesNesting() {
    const tmplModal  = document.getElementById('templates-modal');
    const tableModal = document.getElementById('table-modal');
    if (!tmplModal || !tableModal) return;
    if (tableModal.contains(tmplModal)) {
      document.body.appendChild(tmplModal);
    }
  }

  /* ─────────────────────────────────────────────────────────
     Boot — run after the main app JS has initialised
  ───────────────────────────────────────────────────────── */
  function doFix() {
    _fixTemplatesNesting();

    /* Ensure the initial view state is correct:
       slides-view visible, everything else hidden */
    const slides  = document.getElementById('slides-view');
    const service = document.getElementById('service-view');
    const sched   = document.getElementById('schedule-view');
    const timer   = document.getElementById('timer-view');

    if (slides)  slides.style.display  = 'flex';
    if (service) service.style.display = 'none';
    if (sched)   sched.style.display   = 'none';
    if (timer)   timer.style.display   = 'none';

    /* Mark the first ctab (Slides) as active if nothing is */
    const activeTabs = document.querySelectorAll('.ctab.on');
    if (!activeTabs.length) {
      document.querySelector('.ctab')?.classList.add('on');
    }

    console.info('[BW fix.js] centerTab patched — schedule bleed & timer display fixed.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doFix);
  } else {
    /* DOMContentLoaded has already fired — run on next tick so
       BrideWorship.js's own DOMContentLoaded handler runs first */
    setTimeout(doFix, 0);
  }

})();