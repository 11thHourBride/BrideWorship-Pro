/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix4.js
   Fix 1 : Database import — bulk one-click import (no per-song
            checkbox grind). File loads → summary card → one button.
   Fix 2 : Schedule — remove the Item Preview pane from the
            right column of the Schedule view.
═══════════════════════════════════════════════════════════ */

(function BW_Fix4() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     FIX 2 (CSS first — instant, no flash)
     Hide the Item Preview card inside .sch-edit-col.
     The editor and saved-schedules list are kept; only the
     .sch-preview-wrap block is removed from sight.
  ══════════════════════════════════════════════════════════ */
  (function injectScheduleCSS() {
    const s = document.createElement('style');
    s.id = 'bw-fix4-styles';
    s.textContent = `
      /* ── Remove schedule item-preview pane ── */
      .sch-preview-wrap { display: none !important; }

      /* ── Give the editor column the reclaimed space ── */
      .sch-edit-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* ── DB import: bulk summary card ── */
      #bw-bulk-summary {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 4px 0 8px;
      }
      .bwbs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 11px 14px;
        background: rgba(201,168,76,.08);
        border: 1px solid rgba(201,168,76,.22);
        border-radius: 7px;
        gap: 10px;
      }
      .bwbs-count {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        color: var(--gold);
        line-height: 1;
      }
      .bwbs-label {
        font-size: 11px;
        color: var(--text-2);
        line-height: 1.5;
        flex: 1;
      }
      .bwbs-import-btn {
        padding: 10px 20px;
        background: var(--gold);
        color: #000;
        border: none;
        border-radius: 6px;
        font-family: 'Cinzel', serif;
        font-size: 13px;
        letter-spacing: 1px;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity .15s, transform .1s;
        flex-shrink: 0;
      }
      .bwbs-import-btn:hover  { opacity: .88; }
      .bwbs-import-btn:active { transform: scale(.96); }
      .bwbs-import-btn:disabled {
        opacity: .45; cursor: default; transform: none;
      }

      /* Dupe-policy row */
      .bwbs-dupe-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        color: var(--text-3);
        flex-wrap: wrap;
      }
      .bwbs-dupe-row select {
        flex: 1;
        min-width: 160px;
      }

      /* Song list — compact, scrollable */
      .bwbs-list {
        max-height: 260px;
        overflow-y: auto;
        border: 1px solid var(--border-dim);
        border-radius: 6px;
        background: var(--bg-card);
      }
      .bwbs-song {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 12px;
        border-bottom: 1px solid var(--border-dim);
        cursor: pointer;
        transition: background .1s;
      }
      .bwbs-song:last-child { border-bottom: none; }
      .bwbs-song:hover      { background: var(--bg-hover); }
      .bwbs-song.excluded   { opacity: .4; }
      .bwbs-song-check {
        accent-color: var(--gold);
        width: 14px; height: 14px;
        flex-shrink: 0;
        cursor: pointer;
      }
      .bwbs-song-info { flex: 1; min-width: 0; }
      .bwbs-song-title {
        font-size: 12px;
        color: var(--text-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bwbs-song-meta {
        font-size: 10px;
        color: var(--text-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bwbs-song-badge {
        font-size: 9px;
        padding: 1px 6px;
        border-radius: 10px;
        background: rgba(76,175,122,.15);
        color: var(--green);
        white-space: nowrap;
        flex-shrink: 0;
      }
      .bwbs-song-badge.dup {
        background: rgba(212,160,23,.15);
        color: var(--amber);
      }

      /* Select-all row */
      .bwbs-selrow {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 2px;
        font-size: 11px;
        color: var(--text-3);
      }
      .bwbs-selrow button {
        font-size: 10px;
        padding: 2px 8px;
        background: none;
        border: 1px solid var(--border-dim);
        border-radius: 4px;
        color: var(--text-2);
        cursor: pointer;
      }
      .bwbs-selrow button:hover { background: var(--bg-hover); }

      /* Result banner */
      .bwbs-result {
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.6;
        display: none;
      }
      .bwbs-result.success {
        display: block;
        background: rgba(76,175,122,.1);
        border: 1px solid rgba(76,175,122,.3);
        color: var(--green);
      }
      .bwbs-result.error {
        display: block;
        background: rgba(224,80,80,.1);
        border: 1px solid rgba(224,80,80,.3);
        color: var(--red);
      }
    `;
    document.head.appendChild(s);
  })();


  /* ══════════════════════════════════════════════════════════
     FIX 1 — BULK DATABASE IMPORT
  ══════════════════════════════════════════════════════════ */

  /* Internal buffer: array of parsed song objects */
  let _bulkBuffer = [];

  /* ── Patch renderImportPreview ── */
  window.renderImportPreview = function (songs) {
    _bulkBuffer = songs || [];

    const preview    = document.getElementById('db-preview');
    const countEl    = document.getElementById('db-import-count');
    if (!preview) return;

    if (countEl) countEl.textContent = songs.length ? `${songs.length} song(s) ready` : '';

    if (!songs.length) {
      preview.innerHTML = `
        <div style="color:var(--text-3);font-size:11px;padding:14px;text-align:center;">
          No songs loaded yet — select a file above.
        </div>`;
      return;
    }

    /* Mark duplicates against current library */
    const existingLower = new Set(SONGS.map(s => s.title.toLowerCase()));
    const dupCount  = songs.filter(s => existingLower.has(s.title.toLowerCase())).length;
    const newCount  = songs.length - dupCount;

    preview.innerHTML = `<div id="bw-bulk-summary">

      <!-- ── Summary header + primary action ── -->
      <div class="bwbs-header">
        <div>
          <div class="bwbs-count">${songs.length}</div>
          <div style="font-size:9px;color:var(--gold-dim);font-family:'Cinzel',serif;
            letter-spacing:1px;text-transform:uppercase;margin-top:2px;">Songs Found</div>
        </div>
        <div class="bwbs-label">
          <strong style="color:var(--text-1);">${newCount} new</strong>
          ${dupCount ? ` · <span style="color:var(--amber);">${dupCount} duplicate${dupCount>1?'s':''}</span>` : ''}
          &nbsp;ready to import from this file.
        </div>
        <button class="bwbs-import-btn" id="bwbs-main-btn"
          onclick="bwBulkImport()">
          ⬇ Import All
        </button>
      </div>

      <!-- ── Duplicate handling ── -->
      <div class="bwbs-dupe-row">
        <span style="white-space:nowrap;">Duplicates:</span>
        <select class="fmt-select" id="db-dupe-mode">
          <option value="skip">Skip (keep existing song)</option>
          <option value="replace">Replace existing with imported</option>
          <option value="add">Add anyway (allow duplicates)</option>
        </select>
      </div>

      <!-- ── Result banner (shown after import) ── -->
      <div class="bwbs-result" id="bwbs-result"></div>

      <!-- ── Scrollable song list ── -->
      <div class="bwbs-selrow">
        <span id="bwbs-sel-label">All ${songs.length} selected</span>
        <button onclick="bwBulkSelectAll(true)">Select All</button>
        <button onclick="bwBulkSelectAll(false)">Deselect All</button>
      </div>

      <div class="bwbs-list" id="bwbs-list">
        ${songs.map((s, i) => {
          const isDup = existingLower.has(s.title.toLowerCase());
          return `
          <div class="bwbs-song" id="bwbs-row-${i}">
            <input type="checkbox" class="bwbs-song-check" checked
              data-idx="${i}"
              onchange="bwBulkToggle(${i},this.checked)">
            <div class="bwbs-song-info">
              <div class="bwbs-song-title" title="${escapeHTML(s.title)}">
                ${escapeHTML(s.title)}
              </div>
              <div class="bwbs-song-meta">
                ${escapeHTML(s.author||'Unknown')}
                ${s.key ? ' · ' + escapeHTML(s.key) : ''}
                · ${s.slides.length} slide${s.slides.length!==1?'s':''}
                ${s.tag ? ' · ' + escapeHTML(s.tag) : ''}
              </div>
            </div>
            <span class="bwbs-song-badge ${isDup?'dup':''}">
              ${isDup ? '⚠ Duplicate' : '✓ New'}
            </span>
          </div>`;
        }).join('')}
      </div>

    </div>`;
  };

  /* ── Toggle individual row ── */
  window.bwBulkToggle = function (idx, checked) {
    const row = document.getElementById('bwbs-row-' + idx);
    if (row) row.classList.toggle('excluded', !checked);
    _updateBulkSelLabel();
  };

  /* ── Select / deselect all ── */
  window.bwBulkSelectAll = function (val) {
    document.querySelectorAll('.bwbs-song-check').forEach(chk => {
      chk.checked = val;
      const i = parseInt(chk.dataset.idx);
      const row = document.getElementById('bwbs-row-' + i);
      if (row) row.classList.toggle('excluded', !val);
    });
    _updateBulkSelLabel();
  };

  function _updateBulkSelLabel() {
    const all      = document.querySelectorAll('.bwbs-song-check').length;
    const checked  = document.querySelectorAll('.bwbs-song-check:checked').length;
    const label    = document.getElementById('bwbs-sel-label');
    const btn      = document.getElementById('bwbs-main-btn');
    if (label) label.textContent = `${checked} of ${all} selected`;
    if (btn)   btn.textContent   = checked ? `⬇ Import ${checked}` : '⬇ Import All';
    if (btn)   btn.disabled      = !checked;
  }

  /* ── The actual import ── */
  window.bwBulkImport = function () {
    /* Gather only checked songs */
    const checkedIdxs = Array.from(
      document.querySelectorAll('.bwbs-song-check:checked')
    ).map(chk => parseInt(chk.dataset.idx));

    const toImport = checkedIdxs
      .map(i => _bulkBuffer[i])
      .filter(Boolean);

    if (!toImport.length) {
      _bulkResult('Select at least one song to import.', false);
      return;
    }

    const dupeMode      = document.getElementById('db-dupe-mode')?.value || 'skip';
    const existingLower = new Set(SONGS.map(s => s.title.toLowerCase()));
    let   added = 0, replaced = 0, skipped = 0;

    toImport.forEach(song => {
      const key    = song.title.toLowerCase();
      const isDupe = existingLower.has(key);

      if (isDupe) {
        if (dupeMode === 'skip') {
          skipped++;
          return;
        }
        if (dupeMode === 'replace') {
          const idx = SONGS.findIndex(s => s.title.toLowerCase() === key);
          if (idx >= 0) { SONGS[idx] = song; replaced++; return; }
        }
        /* 'add' — fall through to push */
      }
      SONGS.push(song);
      existingLower.add(key);
      added++;
    });

    /* Persist + refresh library */
    if (typeof saveSongsToStorage === 'function') saveSongsToStorage();
    if (typeof buildSongLibrary   === 'function') buildSongLibrary();

    /* Feedback */
    let msg = `✓ Imported ${added} new song${added!==1?'s':''}.`;
    if (replaced) msg += `  Replaced ${replaced}.`;
    if (skipped)  msg += `  Skipped ${skipped} duplicate${skipped!==1?'s':''}.`;
    _bulkResult(msg, true);

    /* Disable the button to prevent double-import */
    const btn = document.getElementById('bwbs-main-btn');
    if (btn) { btn.disabled = true; btn.textContent = '✓ Done'; }

    /* Clear buffer */
    _bulkBuffer = [];

    /* Switch library to Songs tab so the user sees results */
    const ltabSongs = document.getElementById('ltab-songs');
    if (ltabSongs && typeof libTab === 'function') libTab(ltabSongs, 'ls-songs');

    /* Toast */
    if (typeof showSchToast === 'function') showSchToast(msg);
  };

  /* Backward-compat: original confirmImport still calls bwBulkImport */
  window.confirmImport = window.bwBulkImport;

  /* Backward-compat: selectAllImport still works */
  window.selectAllImport = window.bwBulkSelectAll;

  function _bulkResult(msg, success) {
    const el = document.getElementById('bwbs-result');
    if (!el) return;
    el.textContent  = msg;
    el.className    = 'bwbs-result ' + (success ? 'success' : 'error');
    el.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  /* ── Also patch showImportStatus so loading messages still show ── */
  window.showImportStatus = function (msg, isError) {
    const el = document.getElementById('db-import-status');
    if (el) {
      el.textContent = msg;
      el.style.color = isError ? 'var(--red)' : 'var(--text-2)';
    }
    /* Mirror loading state into the result banner if it's already visible */
    const res = document.getElementById('bwbs-result');
    if (res && res.style.display !== 'none') return; /* don't overwrite success */
    if (res && msg) {
      res.textContent = msg;
      res.className   = 'bwbs-result ' + (isError ? 'error' : 'success');
    }
  };

  console.info('[BW fix4.js] ✓ Bulk import UI  ✓ Schedule preview removed');

})();
