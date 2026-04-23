/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix14.js
   The Table modal: larger, better typography, user font-size.
   1. Modal expands to 96 vw × 94 vh.
   2. Base font sizes increased throughout the modal.
   3. Font-size slider + −/+ controls persist per session.
═══════════════════════════════════════════════════════════ */

(function BW_Fix14() {
  'use strict';

  const FS_KEY     = 'bw_table_font_px';
  const FS_DEFAULT = 15;
  const FS_MIN     = 11;
  const FS_MAX     = 28;

  let _fsPx = parseInt(localStorage.getItem(FS_KEY) || String(FS_DEFAULT));

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix14-styles';
  _style.textContent = `

    /* ── 1. Modal size ────────────────────────────────────── */
    .modal-overlay .table-modal-box {
      width:      96vw  !important;
      max-width:  96vw  !important;
      height:     94vh  !important;
      max-height: 94vh  !important;
      display:    flex  !important;
      flex-direction: column !important;
    }

    /* Tab bar doesn't grow */
    .table-modal-box .db-tabs-bar { flex-shrink: 0; }

    /* Every panel fills remaining height */
    .table-modal-box .table-panel {
      flex:       1 1 0  !important;
      min-height: 0      !important;
      display:    flex   !important;
      flex-direction: column !important;
      overflow:   hidden !important;
    }

    /* Scrollable body inside panels */
    .table-modal-box .modal-body,
    .table-modal-box .db-scroll {
      flex:       1 1 0  !important;
      min-height: 0      !important;
      overflow-y: auto   !important;
    }

    /* ── 2. Base font sizes ───────────────────────────────── */

    /* General body text */
    .table-modal-box .modal-body,
    .table-modal-box .db-scroll,
    .table-modal-box .table-panel { font-size: var(--tbl-fs, 15px); }

    /* Paragraph list */
    .reader-para-text,
    .f13-rc-text           { font-size: var(--tbl-fs, 15px) !important; line-height: 1.75 !important; }

    /* Search input */
    #f13-input,
    #reader-search         { font-size: var(--tbl-fs, 15px) !important; }

    /* Scope / type buttons */
    .f13-scope-btn,
    .f13-type-btn          { font-size: calc(var(--tbl-fs, 15px) - 2px) !important; }

    /* Library items */
    .f13-lib-title,
    .imported-sermon-title { font-size: var(--tbl-fs, 15px) !important; }
    .f13-lib-meta,
    .imported-sermon-meta  { font-size: calc(var(--tbl-fs, 15px) - 3px) !important; }

    /* Result group label, meta, para-num */
    .f13-result-group-label{ font-size: calc(var(--tbl-fs, 15px) - 5px) !important; }
    .f13-rc-meta,
    .reader-para-num       { font-size: calc(var(--tbl-fs, 15px) - 4px) !important; }

    /* Sermon viewer title */
    #reader-sermon-title   { font-size: calc(var(--tbl-fs, 15px) + 1px) !important; }

    /* Nugget text */
    .nugget-text           { font-size: var(--tbl-fs, 15px) !important; }
    .nugget-meta           { font-size: calc(var(--tbl-fs, 15px) - 4px) !important; }

    /* Queue / add-to-queue textareas and inputs */
    .table-modal-box textarea,
    .table-modal-box input[type="text"],
    .table-modal-box select { font-size: var(--tbl-fs, 15px) !important; }

    /* Browse iframe URL bar */
    #table-url-bar         { font-size: var(--tbl-fs, 15px) !important; }

    /* Buttons */
    .table-modal-box .sc-add,
    .table-modal-box .lib-icon-btn,
    .table-modal-box .qbtn  { font-size: calc(var(--tbl-fs, 15px) - 1px) !important; }

    /* ── 3. Font-size control bar ─────────────────────────── */
    #tbl-fs-bar {
      display:     flex;
      align-items: center;
      gap:         6px;
      padding:     5px 14px;
      background:  var(--bg-card);
      border-bottom: 1px solid var(--border-dim);
      flex-shrink: 0;
    }
    .tbl-fs-label {
      font-size:    10px;
      color:        var(--text-3);
      white-space:  nowrap;
      flex-shrink:  0;
      font-family:  'Lato', sans-serif;
    }
    .tbl-fs-btn {
      width:  24px; height: 24px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-deep, #09090f);
      color:  var(--text-2);
      font-size: 15px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background .1s;
      user-select: none;
      line-height: 1;
    }
    .tbl-fs-btn:hover  { background: var(--bg-hover); }
    .tbl-fs-btn:active { opacity: .6; }
    #tbl-fs-slider {
      flex: 1;
      accent-color: var(--gold, #c9a84c);
      cursor: pointer;
    }
    #tbl-fs-val {
      font-size:   11px;
      color:       var(--gold, #c9a84c);
      font-family: 'Cinzel', serif;
      min-width:   34px;
      text-align:  center;
      flex-shrink: 0;
    }
    .tbl-fs-reset {
      font-size:   10px;
      color:       var(--text-3);
      cursor:      pointer;
      flex-shrink: 0;
      padding:     2px 6px;
      border-radius: 3px;
      border: 1px solid var(--border-dim);
      background: none;
      transition: background .1s, color .15s;
    }
    .tbl-fs-reset:hover { background: var(--bg-hover); color: var(--text-1, #e0ddd8); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     APPLY FONT SIZE TO MODAL
  ══════════════════════════════════════════════════════════ */

  function _applyFs(px) {
    _fsPx = Math.max(FS_MIN, Math.min(FS_MAX, px));
    const modal = document.querySelector('.table-modal-box');
    if (modal) modal.style.setProperty('--tbl-fs', _fsPx + 'px');
    /* Sync controls */
    const slider = document.getElementById('tbl-fs-slider');
    const val    = document.getElementById('tbl-fs-val');
    if (slider) slider.value  = _fsPx;
    if (val)    val.textContent = _fsPx + 'px';
    try { localStorage.setItem(FS_KEY, String(_fsPx)); } catch(e) {}
  }

  /* Exposed for inline handlers */
  window.tblFsStep  = d  => _applyFs(_fsPx + d);
  window.tblFsSlide = v  => _applyFs(parseInt(v));
  window.tblFsReset = () => _applyFs(FS_DEFAULT);


  /* ══════════════════════════════════════════════════════════
     BUILD THE FONT-SIZE BAR (injected once into modal head)
  ══════════════════════════════════════════════════════════ */

  function _buildFsBar() {
    if (document.getElementById('tbl-fs-bar')) {
      _applyFs(_fsPx); return; // just re-apply
    }
    const modal = document.querySelector('.table-modal-box');
    if (!modal) return;

    const tabBar = modal.querySelector('.db-tabs-bar');
    if (!tabBar) return;

    const bar = document.createElement('div');
    bar.id = 'tbl-fs-bar';
    bar.innerHTML = `
      <span class="tbl-fs-label">Text Size</span>
      <button class="tbl-fs-btn" onclick="tblFsStep(-1)" title="Smaller">−</button>
      <input  id="tbl-fs-slider" type="range"
              min="${FS_MIN}" max="${FS_MAX}" value="${_fsPx}"
              oninput="tblFsSlide(this.value)">
      <span   id="tbl-fs-val">${_fsPx}px</span>
      <button class="tbl-fs-btn" onclick="tblFsStep(+1)" title="Larger">+</button>
      <button class="tbl-fs-reset" onclick="tblFsReset()" title="Reset to default">Reset</button>
    `;

    /* Insert between the modal head and the tab bar */
    tabBar.insertAdjacentElement('afterend', bar);
    _applyFs(_fsPx);
  }


  /* ══════════════════════════════════════════════════════════
     HOOK openTheTable
  ══════════════════════════════════════════════════════════ */

  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    /* Retry a few times in case other fixes are still injecting DOM */
    let n = 0;
    const t = setInterval(() => {
      _buildFsBar();
      if (document.getElementById('tbl-fs-bar') || ++n > 12) clearInterval(t);
    }, 120);
  };


  /* ══════════════════════════════════════════════════════════
     BOOT — apply persisted size immediately on load
  ══════════════════════════════════════════════════════════ */
  (function boot() {
    /* If the modal is already open (unlikely but safe) */
    if (document.querySelector('.table-modal-box')) {
      _buildFsBar();
    }
    console.info('[BW fix14] ✓ Table modal expanded  ✓ Larger text  ✓ Font-size bar');
  })();

})();