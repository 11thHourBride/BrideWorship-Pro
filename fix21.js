/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix21.js
   Five targeted fixes for the two-panel reader:
   1. CSS specificity bug — reader leaked over other panels
      because #tt-reader.f20-ready beat fix16's display:none.
   2. Sermon display — restructured flex layout so paragraphs
      actually render and scroll.
   3. Project/Schedule/Nugget — safe wrappers that work even
      when BrideWorship globals are not yet initialised.
   4. Golden Nugget button added to every selection bar.
   5. Full-page reader — table modal expands to 100vw/100vh
      when the reader tab is active; shrinks back on exit.
═══════════════════════════════════════════════════════════ */

(function BW_Fix21() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS PATCHES
  ══════════════════════════════════════════════════════════ */

  const _style = document.createElement('style');
  _style.id = 'bw-fix21-styles';
  _style.textContent = `

  /* ── FIX 1: reader only shows when IT is the active tab ── */
  /*
   * fix20 used #tt-reader.f20-ready { display:flex !important }
   * Specificity: (1,1,0) — beats fix16's (0,2,0) hide rule,
   * so the reader stayed visible behind every other tab.
   * Solution: require BOTH f20-ready AND tp-active.
   */
  #tt-reader.f20-ready                  { display: none   !important; }
  #tt-reader.f20-ready.tp-active        { display: flex   !important;
                                          flex-direction: row !important;
                                          overflow: hidden !important;
                                          padding: 0       !important;
                                          flex: 1 1 0;
                                          min-height: 0; }

  /* ── FIX 2: correct flex layout so paragraphs scroll ───── */
  /*
   * .f20-view-panel had overflow:hidden which trapped the
   * sticky sel-bar and prevented para-list from scrolling.
   * Restructure: sel-bar = flex-shrink:0, para-list = flex:1.
   */
  .f20-view-panel {
    display: none;
    flex: 1 1 0;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;         /* clip only — children scroll */
  }
  .f20-view-panel.active { display: flex; }

  /* Sel-bar — flex child, never grows, never shrinks */
  #f20-sel-bar {
    display: none;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 7px 10px;
    background: rgba(9,9,15,.97);
    border-bottom: 1px solid rgba(201,168,76,.25);
    z-index: 5;
  }
  #f20-sel-bar.visible { display: flex; }

  /* Para list — takes all remaining height and scrolls */
  #f20-para-list {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 10px;
  }
  #f20-para-list::-webkit-scrollbar       { width: 4px; }
  #f20-para-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

  /* Search view similarly */
  #f20-search-view {
    padding: 0;
    gap: 0;
  }
  #f20-scope-row        { padding: 8px 10px 0; flex-shrink: 0; }
  #f20-search-input-row { padding: 6px 10px;  flex-shrink: 0; }
  #f20-search-results {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 0;
  }
  #f20-search-results::-webkit-scrollbar       { width: 3px; }
  #f20-search-results::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); }

  #f20-action-bar { flex-shrink: 0; }

  /* ── FIX 5: full-page reader ─────────────────────────── */
  /*
   * When the reader tab is active we push the table modal
   * to full viewport. The class .reader-fs is toggled by JS.
   */
  .modal-overlay.reader-fs               { align-items: flex-start; padding: 0; }
  .modal-overlay.reader-fs .table-modal-box {
    width:        100vw   !important;
    max-width:    100vw   !important;
    height:       100vh   !important;
    max-height:   100vh   !important;
    border-radius: 0      !important;
    margin:       0       !important;
  }
  /* Keep the tab bar visible but compact */
  .modal-overlay.reader-fs .modal-head   { padding: 8px 14px; }
  .modal-overlay.reader-fs .db-tabs-bar  { border-bottom: 1px solid var(--border-dim); }

  /* ── Nugget button style ─────────────────────────────── */
  .f20-action-btn.nugget {
    background: rgba(212,160,23,.15);
    border-color: rgba(212,160,23,.4);
    color: #d4a017;
  }
  .f20-action-btn.nugget:hover { background: rgba(212,160,23,.25); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 2 — PATCH THE SELECTION BARS IN fix20's HTML
     Run after fix20 has built the UI, update the bars with
     the missing nugget button and corrected markup.
  ══════════════════════════════════════════════════════════ */

  function _patchSelBars() {
    /* ── Book-view sel-bar ── */
    const bookBar = document.getElementById('f20-sel-bar');
    if (bookBar && !bookBar.dataset.f21) {
      bookBar.dataset.f21 = '1';
      bookBar.innerHTML = `
        <span id="f20-sel-count" style="flex:1;font-size:10px;color:var(--gold-dim,#8a6a20);font-family:'Cinzel',serif;"></span>
        <button class="f20-action-btn project"  onclick="f20ProjectSelected()">▶ Project</button>
        <button class="f20-action-btn schedule" onclick="f20ScheduleSelected()">📅 Schedule</button>
        <button class="f20-action-btn nugget"   onclick="f20NuggetSelected()">⭐ Nugget</button>
        <button class="f20-action-btn clear"    onclick="f20ClearSel()">✕ Clear</button>
      `;
    }

    /* ── Search action-bar ── */
    const searchBar = document.getElementById('f20-action-bar');
    if (searchBar && !searchBar.dataset.f21) {
      searchBar.dataset.f21 = '1';
      searchBar.innerHTML = `
        <span id="f20-sel-count-search" style="flex:1;font-size:10px;color:var(--gold-dim,#8a6a20);font-family:'Cinzel',serif;"></span>
        <button class="f20-action-btn project"  onclick="f20ProjectSearchSel()">▶ Project</button>
        <button class="f20-action-btn schedule" onclick="f20ScheduleSearchSel()">📅 Schedule</button>
        <button class="f20-action-btn nugget"   onclick="f20NuggetSearchSel()">⭐ Nugget</button>
        <button class="f20-action-btn clear"    onclick="f20ClearSearchSel()">✕ Clear</button>
      `;
    }
  }

  /* ── Also ensure #f20-para-list has correct flex in markup ── */
  function _patchLayout() {
    const bookView = document.getElementById('f20-book-view');
    if (!bookView || bookView.dataset.f21layout) return;
    bookView.dataset.f21layout = '1';

    /* Move sel-bar to be first flex child (before para-list) */
    const selBar   = document.getElementById('f20-sel-bar');
    const paraList = document.getElementById('f20-para-list');
    if (selBar && paraList && bookView.contains(selBar) && bookView.contains(paraList)) {
      bookView.insertBefore(selBar, paraList);
    }

    /* Remove any inline styles that fight the CSS */
    if (paraList) {
      paraList.style.flex     = '';
      paraList.style.overflow = '';
      paraList.style.padding  = '';
    }
  }


  /* ══════════════════════════════════════════════════════════
     FIX 3 — SAFE PROJECT / SCHEDULE / NUGGET WRAPPERS
     Replace fix20's versions with ones that handle missing
     BrideWorship globals gracefully.
  ══════════════════════════════════════════════════════════ */

  function _safeProject(text, title) {
    if (!text || !text.trim()) {
      _toast('Select at least one paragraph first');
      return;
    }
    const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

    /* Initialise S if missing */
    window.S = window.S || {};

    /* Build slides array */
    window.S.slides = paras.map(p => ({
      section: title || 'Message',
      text:    p,
      author:  '',
    }));
    window.S.cur     = 0;
    window.S.songIdx = null;

    /* Render */
    if (typeof window.renderQueue === 'function') window.renderQueue();
    if (typeof window.renderSlide === 'function') window.renderSlide();

    /* Close The Table modal */
    const modal = document.getElementById('table-modal');
    if (modal) modal.style.display = 'none';
    _exitFullscreen();

    _toast(`▶ Projecting ${paras.length} slide${paras.length !== 1 ? 's' : ''}`);
  }

  function _safeSchedule(text, title) {
    if (!text || !text.trim()) {
      _toast('Select at least one paragraph first');
      return;
    }

    if (typeof window.schInsertFromLibrary === 'function') {
      window.schInsertFromLibrary(
        { type:'sermon', label: title || 'Message', content: text, notes:'', duration: 0 },
        -1
      );
    } else {
      window.S = window.S || {};
      window.S.so = window.S.so || [];
      window.S.so.push({ name: title || 'Message', type: 'sermon', content: text });
      if (typeof window.renderSO === 'function') window.renderSO();
    }
    _toast(`📅 "${title || 'Message'}" added to Schedule`);
  }

  function _safeNugget(text, title, author) {
    if (!text || !text.trim()) {
      _toast('Select at least one paragraph first');
      return;
    }
    if (typeof window.addNugget === 'function') {
      window.addNugget(text, title || 'Message', author || '');
      _toast('⭐ Saved to Golden Nuggets');
    } else if (typeof window.showSchToast === 'function') {
      _toast('⭐ Golden Nuggets not available yet');
    }
  }

  function _toast(msg) {
    if (typeof window.showSchToast === 'function') window.showSchToast(msg);
  }

  /* ── Rewire fix20's action globals ── */
  window.f20ProjectSelected = function () {
    const sel  = window._f20SelectedParas || new Set();
    const ser  = window._f20CurrentSermon;
    if (!ser || !sel.size) { _toast('Select at least one paragraph first'); return; }
    const text = [...sel].sort((a,b)=>a-b).map(i => ser.paras[i] || '').filter(Boolean).join('\n\n');
    _safeProject(text, ser.title);
  };

  window.f20ScheduleSelected = function () {
    const sel = window._f20SelectedParas || new Set();
    const ser = window._f20CurrentSermon;
    if (!ser || !sel.size) { _toast('Select at least one paragraph first'); return; }
    const text = [...sel].sort((a,b)=>a-b).map(i => ser.paras[i] || '').filter(Boolean).join('\n\n');
    _safeSchedule(text, ser.title);
  };

  window.f20NuggetSelected = function () {
    const sel = window._f20SelectedParas || new Set();
    const ser = window._f20CurrentSermon;
    if (!ser || !sel.size) { _toast('Select at least one paragraph first'); return; }
    const text = [...sel].sort((a,b)=>a-b).map(i => ser.paras[i] || '').filter(Boolean).join('\n\n');
    _safeNugget(text, ser.title, ser.author);
  };

  window.f20ProjectSearchSel = function () {
    const sel = window._f20SelResults || new Set();
    const map = window._f20ResultMap  || {};
    if (!sel.size) { _toast('Select at least one result first'); return; }
    const text  = [...sel].sort((a,b)=>a-b).map(i => map[i]?.text || '').filter(Boolean).join('\n\n');
    const title = map[[...sel][0]]?.sermonTitle || 'Message';
    _safeProject(text, title);
  };

  window.f20ScheduleSearchSel = function () {
    const sel = window._f20SelResults || new Set();
    const map = window._f20ResultMap  || {};
    if (!sel.size) { _toast('Select at least one result first'); return; }
    const text  = [...sel].sort((a,b)=>a-b).map(i => map[i]?.text || '').filter(Boolean).join('\n\n');
    const title = map[[...sel][0]]?.sermonTitle || 'Message';
    _safeSchedule(text, title);
  };

  window.f20NuggetSearchSel = function () {
    const sel = window._f20SelResults || new Set();
    const map = window._f20ResultMap  || {};
    if (!sel.size) { _toast('Select at least one result first'); return; }
    const text   = [...sel].sort((a,b)=>a-b).map(i => map[i]?.text || '').filter(Boolean).join('\n\n');
    const title  = map[[...sel][0]]?.sermonTitle || 'Message';
    _safeNugget(text, title, '');
  };

  /* ── Expose shared state so our wrappers can reach it ── */
  /*
   * fix20 keeps _selectedParas and _currentSermon as private
   * IIFE variables. We bridge them via window globals that
   * fix20's f20TogglePara / f20OpenSermon update.
   */
  function _bridgeFix20State() {
    /* Patch f20TogglePara to also update window._f20SelectedParas */
    const _origToggle = window.f20TogglePara;
    window.f20TogglePara = function (i, event) {
      if (typeof _origToggle === 'function') _origToggle(i, event);
      /* Mirror the private set to a public one */
      /* We read the DOM — checkbox state is authoritative */
      const el  = document.getElementById('f20-p-' + i);
      const chk = el?.querySelector('.f20-para-chk');
      window._f20SelectedParas = window._f20SelectedParas || new Set();
      if (chk?.checked) window._f20SelectedParas.add(i);
      else              window._f20SelectedParas.delete(i);
    };

    /* Patch f20OpenSermon to expose current sermon */
    const _origOpen = window.f20OpenSermon;
    window.f20OpenSermon = function (id) {
      /* Reset selection mirror */
      window._f20SelectedParas = new Set();
      if (typeof _origOpen === 'function') _origOpen(id);
      /* After open, mirror current sermon via reader globals */
      setTimeout(() => {
        window._f20CurrentSermon = {
          id,
          title:  window._readerTitle  || '',
          author: window._readerAuthor || '',
          paras:  (window._readerParas || []).map(p => p.text),
        };
      }, 100);
    };

    /* Patch f20ToggleResult to mirror search selections */
    const _origToggleR = window.f20ToggleResult;
    window.f20ToggleResult = function (i) {
      if (typeof _origToggleR === 'function') _origToggleR(i);
      window._f20SelResults = window._f20SelResults || new Set();
      const card = document.getElementById('f20-rc-' + i);
      const chk  = card?.querySelector('.f20-rc-chk');
      if (chk?.checked) window._f20SelResults.add(i);
      else              window._f20SelResults.delete(i);
    };

    /* Expose result map */
    const _origSearch = window.f20DoSearch;
    window.f20DoSearch = function (exact) {
      window._f20SelResults = new Set();
      window._f20ResultMap  = {};
      if (typeof _origSearch === 'function') _origSearch(exact);
      /* After render, read the map from fix20's rendered data-attrs */
      setTimeout(() => {
        const map = {};
        document.querySelectorAll('.f20-result-card').forEach(card => {
          const m = (card.id || '').match(/f20-rc-(\d+)/);
          if (!m) return;
          map[parseInt(m[1])] = {
            sermonTitle: card.dataset.sermonTitle || '',
            sermonId:    card.dataset.sermonId    || '',
            paraIdx:     parseInt(card.dataset.paraIdx || '0'),
            text:        card.querySelector('.f20-rc-text')?.textContent || '',
          };
        });
        window._f20ResultMap = map;
      }, 300);
    };
  }


  /* ══════════════════════════════════════════════════════════
     FIX 5 — FULL-PAGE READER
  ══════════════════════════════════════════════════════════ */

  function _enterFullscreen() {
    const overlay = document.querySelector('.modal-overlay#\\#table-modal,#table-modal')
                 || document.getElementById('table-modal')?.closest('.modal-overlay')
                 || document.getElementById('table-modal');
    if (overlay) overlay.classList.add('reader-fs');
    /* Also mark the modal box directly */
    document.querySelector('.table-modal-box')?.classList.add('reader-fs-box');
  }

  function _exitFullscreen() {
    const overlay = document.getElementById('table-modal')?.closest?.('.modal-overlay')
                 || document.getElementById('table-modal');
    if (overlay) overlay.classList.remove('reader-fs');
    document.querySelector('.table-modal-box')?.classList.remove('reader-fs-box');
  }

  /* Patch tableTab to enter/exit fullscreen based on active panel */
  const _origTableTab = window.tableTab;
  window.tableTab = function (clickedTab, panelId) {
    if (typeof _origTableTab === 'function') _origTableTab(clickedTab, panelId);
    if (panelId === 'tt-reader') {
      _enterFullscreen();
    } else {
      _exitFullscreen();
    }
  };

  /* Also apply fullscreen immediately if reader is already active */
  function _checkIfReaderActive() {
    const reader = document.getElementById('tt-reader');
    if (reader && reader.classList.contains('tp-active')) {
      _enterFullscreen();
    }
  }

  /* Additional CSS for fullscreen box (can't use .modal-overlay selector reliably
     because the overlay div wraps the modal-box, but the IDs differ per project) */
  const _fsStyle = document.createElement('style');
  _fsStyle.textContent = `
    /* Target the table-modal-box directly when in fullscreen mode */
    .table-modal-box.reader-fs-box {
      width:         100vw  !important;
      max-width:     100vw  !important;
      height:        100vh  !important;
      max-height:    100vh  !important;
      border-radius: 0      !important;
      margin:        0      !important;
      top:           0      !important;
      left:          0      !important;
    }
    /* The overlay itself */
    #table-modal.reader-fs,
    #table-modal .reader-fs {
      align-items:  flex-start !important;
      padding:      0          !important;
    }
    /* Direct target: the modal-overlay that contains table-modal-box */
    .modal-overlay:has(.table-modal-box.reader-fs-box) {
      align-items:  flex-start !important;
      padding:      0          !important;
    }
  `;
  document.head.appendChild(_fsStyle);


  /* ══════════════════════════════════════════════════════════
     BOOT — run patches after fix20 has built the UI
  ══════════════════════════════════════════════════════════ */

  function _runPatches() {
    _patchSelBars();
    _patchLayout();
    _checkIfReaderActive();
  }

  /* Hook openTheTable to run patches after fix20 fires */
  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    /* fix20 builds at 200ms, we patch at 400ms */
    setTimeout(_runPatches, 400);
    setTimeout(_runPatches, 800); /* retry */
  };

  /* Bridge fix20 state so our wrappers work */
  _bridgeFix20State();

  /* Run immediately in case modal is already open */
  setTimeout(_runPatches, 500);

  console.info('[BW fix21] ✓ CSS leak fixed  ✓ Scroll layout  ✓ Project/Schedule/Nugget  ✓ Full-page reader');

})();