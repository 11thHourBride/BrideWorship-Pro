/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix5.js  (v4)
   Fix 1 : Schedule fills the full center column correctly
           (sidebars are NEVER touched — they stay visible).
   Fix 2 : Clicking a schedule item loads its slides into a
           lineup list in the right column; click any slide
           card to project it. No tab-switching.
   Fix 3 : Remote.html receives live schedule data.
═══════════════════════════════════════════════════════════ */

(function BW_Fix5() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix5-styles';
  _style.textContent = `

    /* ── FIX 1: schedule fills center column ───────────────
       The center column is flex-column. Every tab panel needs
       display:flex + flex:1 + min-height:0 to fill it.
       schedule-view was missing these.                        */

    #schedule-view {
      /* display is controlled by JS (centerTab) — do NOT set it here */
      flex-direction: column !important;
      flex: 1 1 0 !important;
      min-height: 0 !important;
      overflow: hidden !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Toolbar + add-bar must not grow beyond their content */
    .sch-toolbar,
    .sch-add-bar {
      flex-shrink: 0 !important;
    }

    /* Body row fills remaining space */
    .sch-body {
      flex: 1 1 0 !important;
      min-height: 0 !important;
      overflow: hidden !important;
      display: flex !important;
    }

    /* Run-order column: scrollable list */
    .sch-list-col {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
    }
    .sch-list {
      flex: 1 1 0 !important;
      min-height: 0 !important;
      overflow-y: auto !important;
    }

    /* Right editor column: fixed width, scrollable */
    .sch-edit-col {
      display: flex !important;
      flex-direction: column !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    .sch-edit-col::-webkit-scrollbar       { width: 3px; }
    .sch-edit-col::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

    /* Duration bar at bottom */
    .sch-duration-bar {
      flex-shrink: 0 !important;
    }


    /* ── FIX 2: slide lineup panel ─────────────────────────
       Injected at the top of .sch-edit-col.
       Shows slides of the selected run-order item.           */

    #sl-panel {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--border-dim);
    }

    .sl-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sl-item-name {
      flex: 1;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: var(--gold, #c9a84c);
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sl-proj-all {
      flex-shrink: 0;
      padding: 5px 9px;
      background: var(--gold, #c9a84c);
      border: none;
      border-radius: 4px;
      color: #000;
      font-size: 10px;
      font-weight: 700;
      font-family: 'Cinzel', serif;
      letter-spacing: 1px;
      cursor: pointer;
      transition: opacity .15s;
      white-space: nowrap;
    }
    .sl-proj-all:hover  { opacity: .85; }
    .sl-proj-all:active { opacity: .6; }

    .sl-empty {
      padding: 12px 10px;
      font-size: 11px;
      color: var(--text-3);
      text-align: center;
      line-height: 1.7;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 6px;
    }

    .sl-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 340px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .sl-list::-webkit-scrollbar       { width: 3px; }
    .sl-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

    .sl-card {
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      padding: 7px 10px;
      cursor: pointer;
      transition: background .1s, border-color .15s;
      user-select: none;
    }
    .sl-card:hover        { background: var(--bg-hover); border-color: rgba(201,168,76,.25); }
    .sl-card.sl-live      { border-color: var(--green, #4caf7a); background: rgba(76,175,122,.07); }

    .sl-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .sl-card-label {
      font-family: 'Cinzel', serif;
      font-size: 7px;
      letter-spacing: 2px;
      color: var(--gold-dim, #8a6a20);
      text-transform: uppercase;
    }
    .sl-card.sl-live .sl-card-label { color: var(--green, #4caf7a); }
    .sl-card-num {
      font-size: 9px;
      color: var(--text-3);
    }
    .sl-card-text {
      font-size: 11px;
      color: var(--text-1, #e0ddd8);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .sl-counter {
      font-size: 9px;
      color: var(--text-3);
      text-align: center;
    }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — no sidebar changes; just ensure schedule-view
     is shown with display:flex when its tab is active.
     The original centerTab already hides/shows panels but
     sets display:'flex' only for some. We guarantee it here.
  ══════════════════════════════════════════════════════════ */

  /* centerTab is handled correctly by fix.js — no override needed here.
     We only intercept schProject to load the slide lineup panel.      */


  /* ══════════════════════════════════════════════════════════
     FIX 2 — slide lineup panel in .sch-edit-col
  ══════════════════════════════════════════════════════════ */

  let _sl = { slides: [], liveIdx: -1 };

  function buildPanel() {
    if (document.getElementById('sl-panel')) return;
    const col = document.querySelector('.sch-edit-col');
    if (!col) return;

    const wrap = document.createElement('div');
    wrap.id = 'sl-panel';
    wrap.innerHTML = `
      <div class="panel-tag" style="margin:0 0 5px;">Slides</div>
      <div class="sl-header">
        <div class="sl-item-name" id="sl-item-name">— select an item —</div>
        <button class="sl-proj-all" id="sl-proj-all"
          onclick="slProjectAll()" style="display:none;">▶ All</button>
      </div>
      <div class="sl-empty" id="sl-empty">Click an item in the<br>run order to see its slides.</div>
      <div class="sl-list"  id="sl-list"  style="display:none;"></div>
      <div class="sl-counter" id="sl-counter"></div>
    `;
    col.insertBefore(wrap, col.firstChild);
  }

  function slLoad(item) {
    _sl.slides  = _buildSlides(item);
    _sl.liveIdx = -1;

    const nameEl    = document.getElementById('sl-item-name');
    const emptyEl   = document.getElementById('sl-empty');
    const listEl    = document.getElementById('sl-list');
    const cntEl     = document.getElementById('sl-counter');
    const projAllEl = document.getElementById('sl-proj-all');

    if (nameEl) nameEl.textContent = item.label || item.name || 'Item';

    if (!_sl.slides.length) {
      if (emptyEl)   emptyEl.style.display   = 'block';
      if (listEl)    listEl.style.display    = 'none';
      if (cntEl)     cntEl.textContent       = '';
      if (projAllEl) projAllEl.style.display = 'none';
      return;
    }

    if (emptyEl)   emptyEl.style.display   = 'none';
    if (listEl)    listEl.style.display    = 'flex';
    if (projAllEl) projAllEl.style.display = 'inline-block';
    if (cntEl)     cntEl.textContent =
      `${_sl.slides.length} slide${_sl.slides.length !== 1 ? 's' : ''}`;

    _renderCards();
  }

  function _renderCards() {
    const listEl = document.getElementById('sl-list');
    if (!listEl) return;
    listEl.innerHTML = _sl.slides.map((sl, i) => `
      <div class="sl-card ${i === _sl.liveIdx ? 'sl-live' : ''}"
           id="sl-c-${i}" onclick="slProject(${i})">
        <div class="sl-card-top">
          <span class="sl-card-label">${_esc((sl.section||'Slide').substring(0,22))}</span>
          <span class="sl-card-num">${i + 1}</span>
        </div>
        <div class="sl-card-text">${_esc((sl.text||'').replace(/\n/g,' ').substring(0,110))}</div>
      </div>`).join('');
  }

  window.slProject = function (i) {
    if (i < 0 || i >= _sl.slides.length) return;
    _sl.liveIdx = i;
    S.songIdx = null;
    S.slides  = _sl.slides;
    S.cur     = i;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof push        === 'function') push();
    if (typeof pushStage   === 'function') pushStage();
    /* Highlight the active card */
    document.querySelectorAll('.sl-card').forEach((el, idx) =>
      el.classList.toggle('sl-live', idx === i));
    if (typeof showSchToast === 'function')
      showSchToast(`▶ ${_sl.slides[i].section || 'Slide ' + (i+1)}`);
  };

  window.slProjectAll = function () {
    if (!_sl.slides.length) return;
    _sl.liveIdx = 0;
    S.songIdx = null;
    S.slides  = _sl.slides;
    S.cur     = 0;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof push        === 'function') push();
    _renderCards();
    if (typeof showSchToast === 'function')
      showSchToast(`▶ Projecting all — ${document.getElementById('sl-item-name')?.textContent || ''}`);
  };

  function _buildSlides(item) {
    /* Song */
    if (item.type === 'song' && item.songIdx !== undefined &&
        typeof SONGS !== 'undefined' && SONGS[item.songIdx]) {
      return SONGS[item.songIdx].slides.map(s =>
        ({ section: s.section, text: s.text }));
    }
    /* Scripture (no content) → offline DB */
    if (item.type === 'scripture' && !item.content) {
      const key  = (item.label || '').toLowerCase().trim();
      const text = (typeof SCRIPTURE_DB !== 'undefined')
        ? (SCRIPTURE_DB[key] || '') : '';
      return text
        ? [{ section: item.label, text, version:'KJV' }]
        : [{ section:'SCRIPTURE',
             text: item.label + '\n\n(Add verse text via ✎ Edit)' }];
    }
    /* Stored content */
    if (item.content && item.content.trim()) {
      const lbl = (item.label || 'SLIDE').toUpperCase();
      return (typeof splitSOContent === 'function')
        ? splitSOContent(item.content.trim(), lbl)
        : [{ section: lbl, text: item.content }];
    }
    /* Special types */
    if (item.type === 'blank') return [{ section:'BLANK SCREEN', text:'' }];
    if (item.type === 'logo') {
      const t = typeof S !== 'undefined' && S.appSettings
        ? (S.appSettings.logoText || 'Bride Worship') : 'Bride Worship';
      return [{ section:'LOGO', text: t }];
    }
    if (item.type === 'timer') {
      const m=item.timerMin||5, sc=item.timerSec||0;
      return [{ section:'TIMER',
                text:`${m}:${String(sc).padStart(2,'0')} Countdown` }];
    }
    return [{ section:(item.label||'SLIDE').toUpperCase(),
              text: item.label + '\n\n(Click ✎ Edit to add content)' }];
  }

  /* Override schProject — load slides, do NOT switch tab */
  window.schProject = function (i) {
    const item = typeof SCH !== 'undefined' ? SCH.items[i] : null;
    if (!item) return;

    if (typeof SCH !== 'undefined') {
      if (SCH.current >= 0 && SCH.current !== i)
        SCH.items[SCH.current].done = true;
      SCH.current = i;
    }

    slLoad(item);

    if (typeof renderSchedule    === 'function') renderSchedule();
    if (typeof updateSchCounter  === 'function') updateSchCounter();
    if (typeof updateSchProgress === 'function') updateSchProgress();

    _broadcastSch();
  };


  /* ══════════════════════════════════════════════════════════
     FIX 3 — remote schedule broadcast
  ══════════════════════════════════════════════════════════ */

  function _broadcastSch() {
    const conns = window._bwRwConns;
    if (!Array.isArray(conns) || !conns.length) return;
    const schItems = typeof SCH !== 'undefined' && Array.isArray(SCH.items)
      ? SCH.items.map((it, idx) => ({
          i:     idx,
          label: it.label || it.name || 'Item',
          type:  it.type  || 'announcement',
          done:  it.done  || false,
        }))
      : [];
    const schCur = typeof SCH !== 'undefined' ? (SCH.current ?? -1) : -1;
    conns.filter(c => c.open).forEach(c => {
      try {
        c.send({
          type:'state',
          live:    S?.live    ?? false,
          blanked: S?.blanked ?? false,
          frozen:  S?.frozen  ?? false,
          logo:    S?.logo    ?? false,
          cur:     S?.cur     ?? 0,
          total:   S?.slides?.length ?? 0,
          section: S?.slides?.[S?.cur]?.section || '—',
          song:    S?.songIdx != null ? (SONGS?.[S.songIdx]?.title||'') : '',
          schItems, schCur,
        });
      } catch(e) {}
    });
  }
  window._bwBroadcastSchedule = _broadcastSch;

  [
    'schNavNext','schNavPrev','schNavFirst','schNavLast',
    'schMoveItem','schDeleteItem',
    'scheduleAddSong','scheduleAddScripture',
    'scheduleAddItem','scheduleAddBlank','scheduleAddLogo',
    'scheduleDeleteSelected','newSchedule','loadSavedSchedule',
  ].forEach(fn => {
    const orig = window[fn];
    if (typeof orig !== 'function') return;
    window[fn] = function (...a) {
      const r = orig.apply(this, a);
      setTimeout(_broadcastSch, 130);
      return r;
    };
  });


  /* ══════════════════════════════════════════════════════════
     UTILITY
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    buildPanel();
    console.info('[BW fix5 v4] ✓ Schedule layout  ✓ Slide lineup  ✓ Remote sync');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 250);
  }

})();
