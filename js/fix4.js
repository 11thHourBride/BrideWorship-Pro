/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix4.js
   Fix 1 : Database import — bulk multi-file, instant "Import All"
           no tedious per-song checkbox workflow
   Fix 2 : Schedule — remove the item preview panel
═══════════════════════════════════════════════════════════ */

(function BW_Fix4() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     FIX 2 — REMOVE SCHEDULE ITEM PREVIEW PANEL
  ══════════════════════════════════════════════════════════ */

  function removeSchedulePreview() {
    const style = document.createElement('style');
    style.id = 'bw-fix4-no-preview';
    style.textContent = `
      /* Hide the "Item Preview" block inside the schedule edit column */
      .sch-preview-wrap { display: none !important; }

      /* Let the editor and saved-schedules fill the freed space */
      .sch-edit-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
      }

      /* Give the saved-schedules panel a reasonable max-height */
      .sch-saved-col {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
      }
    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════
     FIX 1 — BULK DATABASE IMPORT
     Problems with the original:
       - <input type="file"> had no `multiple` attribute
       - Required manually checking each song before importing
       - One file at a time only
       - No way to "just import everything" quickly

     What this fix does:
       - "Import All Now" mode: drop/pick files → imported instantly
       - "Review & Select" mode: original per-song workflow preserved
       - Multi-file picker + multi-file drag-and-drop
       - Live progress bar during parse + import
  ══════════════════════════════════════════════════════════ */

  function patchDBImport() {
    const _origOpen = window.openDBModal;
    window.openDBModal = function () {
      if (_origOpen) _origOpen();
      setTimeout(_rebuildImportPanel, 60);
    };
  }

  function _rebuildImportPanel() {
    const panel = document.getElementById('db-import-panel');
    if (!panel) return;

    panel.innerHTML = `
      <div class="modal-body db-scroll" id="db-import-body">

        <!-- Mode toggle -->
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <button id="db-mode-quick"
            onclick="dbSetMode('quick')"
            style="flex:1;padding:9px 6px;border-radius:6px;font-size:12px;
              background:var(--gold);color:#000;border:none;cursor:pointer;
              font-family:'Cinzel',serif;letter-spacing:1px;font-weight:700;">
            &#9889; Import All Now
          </button>
          <button id="db-mode-review"
            onclick="dbSetMode('review')"
            style="flex:1;padding:9px 6px;border-radius:6px;font-size:12px;
              background:var(--bg-card);color:var(--text-2);
              border:1px solid var(--border-dim);cursor:pointer;
              font-family:'Cinzel',serif;letter-spacing:1px;">
            &#128269; Review &amp; Select
          </button>
        </div>

        <!-- Mode description -->
        <div id="db-mode-desc"
          style="font-size:11px;color:var(--text-3);margin-bottom:10px;
            padding:7px 10px;background:var(--bg-card);
            border:1px solid var(--border-dim);border-radius:5px;line-height:1.65;">
          <strong style="color:var(--gold);">&#9889; Import All Now:</strong>
          Drop one or more files — all songs are imported instantly.
          No checkboxes, no confirmation step.
        </div>

        <!-- Drop zone — accepts MULTIPLE files -->
        <div class="drop-zone" id="db-drop-zone"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="event.preventDefault();this.classList.remove('drag-over');dbHandleDrop(event)">
          <div class="dz-icon" id="dz-icon">&#128194;</div>
          <div class="dz-text" id="dz-text">Drop song files here</div>
          <div class="dz-sub" style="font-size:10px;color:var(--text-3);">
            Multiple files supported
          </div>
          <div class="dz-sub">or</div>
          <button class="sc-add"
            onclick="document.getElementById('db-file-input-bulk').click()"
            style="padding:6px 18px;">
            Browse Files
          </button>
          <input type="file" id="db-file-input-bulk"
            multiple
            accept=".json,.xml,.pro6,.pro6x,.txt,.csv,.cho,.chordpro,.ewsx,.ews,.usr,.bwsongs"
            style="display:none;"
            onchange="dbHandleFilePicker(event)">
        </div>

        <!-- Supported formats -->
        <div class="format-matrix" style="margin-top:10px;">
          <div class="fmt-matrix-head">Supported Formats</div>
          <div class="fmt-matrix-grid">
            <div class="fmg-item"><span class="fmg-ext">.json</span><span class="fmg-name">BrideWorship Native</span></div>
            <div class="fmg-item"><span class="fmg-ext">.pro6</span><span class="fmg-name">ProPresenter 6</span></div>
            <div class="fmg-item"><span class="fmg-ext">.xml</span><span class="fmg-name">OpenLyrics / EasyWorship</span></div>
            <div class="fmg-item"><span class="fmg-ext">.txt</span><span class="fmg-name">Plain Text [Sections]</span></div>
            <div class="fmg-item"><span class="fmg-ext">.csv</span><span class="fmg-name">CSV Spreadsheet</span></div>
            <div class="fmg-item"><span class="fmg-ext">.cho</span><span class="fmg-name">ChordPro</span></div>
            <div class="fmg-item"><span class="fmg-ext">.ewsx</span><span class="fmg-name">EasyWorship Database</span></div>
            <div class="fmg-item"><span class="fmg-ext">.usr</span><span class="fmg-name">SongSelect / CCLI</span></div>
          </div>
        </div>

        <!-- Duplicate policy -->
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <span style="font-size:11px;color:var(--text-3);white-space:nowrap;">Duplicates:</span>
          <select class="fmt-select" id="db-dupe-mode" style="flex:1;min-width:160px;">
            <option value="skip">Skip (keep existing song)</option>
            <option value="replace">Replace existing with imported</option>
            <option value="add">Add anyway (allow duplicates)</option>
          </select>
        </div>

        <!-- Progress bar -->
        <div id="db-bulk-progress" style="display:none;margin-top:12px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
            <span id="db-progress-label"
              style="font-size:12px;color:var(--text-2);flex:1;">Parsing...</span>
            <span id="db-progress-pct"
              style="font-size:11px;color:var(--gold);
                font-family:'Cinzel',serif;letter-spacing:1px;"></span>
          </div>
          <div style="height:5px;background:var(--bg-card);border-radius:3px;overflow:hidden;">
            <div id="db-progress-bar"
              style="height:100%;width:0%;background:var(--gold);
                border-radius:3px;transition:width .25s ease;"></div>
          </div>
        </div>

        <!-- Status message -->
        <div id="db-import-status"
          style="font-size:11px;color:var(--text-2);padding:5px 0;
            min-height:20px;margin-top:4px;"></div>

        <!-- Review panel (hidden in quick mode) -->
        <div id="db-review-panel" style="display:none;margin-top:8px;">
          <div class="db-preview-header">
            <span style="font-family:'Cinzel',serif;font-size:9px;
              letter-spacing:2px;color:var(--gold-dim);text-transform:uppercase;">
              Song Preview
            </span>
            <div style="display:flex;gap:5px;">
              <button class="lib-icon-btn" onclick="selectAllImport(true)">Select All</button>
              <button class="lib-icon-btn" onclick="selectAllImport(false)">Deselect All</button>
            </div>
          </div>
          <div id="db-preview" class="db-preview-list">
            <div style="color:var(--text-3);font-size:11px;padding:14px;text-align:center;">
              No songs loaded yet.
            </div>
          </div>
        </div>

      </div><!-- .modal-body -->

      <!-- Footer -->
      <div class="modal-foot">
        <button class="modal-btn-cancel" onclick="closeDBModal()">Cancel</button>
        <button id="db-import-action-btn" class="modal-btn-save"
          onclick="dbImportAction()" style="min-width:200px;">
          &#9889; Import All From File
        </button>
      </div>
    `;

    window._dbImportMode  = 'quick';
    window._importBuffer  = window._importBuffer || [];

    const whichSel = document.getElementById('export-which');
    if (whichSel && typeof SONGS !== 'undefined') {
      whichSel.options[0].text = `All songs in library (${SONGS.length})`;
    }
  }

  /* ── Mode switcher ── */
  window.dbSetMode = function (mode) {
    window._dbImportMode = mode;

    const quickBtn   = document.getElementById('db-mode-quick');
    const reviewBtn  = document.getElementById('db-mode-review');
    const reviewPane = document.getElementById('db-review-panel');
    const actionBtn  = document.getElementById('db-import-action-btn');
    const desc       = document.getElementById('db-mode-desc');

    const activeStyle   = 'background:var(--gold);color:#000;border:none;';
    const inactiveStyle = 'background:var(--bg-card);color:var(--text-2);border:1px solid var(--border-dim);';

    if (mode === 'quick') {
      if (quickBtn)  quickBtn.style.cssText  += activeStyle;
      if (reviewBtn) reviewBtn.style.cssText += inactiveStyle;
      if (reviewPane) reviewPane.style.display = 'none';
      if (actionBtn)  actionBtn.textContent    = '\u26A1 Import All From File';
      if (desc) desc.innerHTML = '<strong style="color:var(--gold);">&#9889; Import All Now:</strong> Drop one or more files — all songs are imported instantly. No checkboxes, no confirmation step.';
    } else {
      if (reviewBtn) reviewBtn.style.cssText += activeStyle;
      if (quickBtn)  quickBtn.style.cssText  += inactiveStyle;
      if (reviewPane) reviewPane.style.display = 'block';
      if (actionBtn)  actionBtn.textContent    = '\u2B07 Import Selected Songs';
      if (desc) desc.innerHTML = '<strong style="color:var(--blue);">&#128269; Review &amp; Select:</strong> Preview every song from the file and choose which ones to import. Uncheck any songs you want to skip.';
    }
  };

  /* ── File picker (multi) ── */
  window.dbHandleFilePicker = async function (event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    if (!files.length) return;
    await _processFiles(files);
  };

  /* ── Drop (multi) ── */
  window.dbHandleDrop = async function (event) {
    const files = Array.from(event.dataTransfer.files);
    if (!files.length) return;
    await _processFiles(files);
  };

  /* ── Process one or many files ── */
  async function _processFiles(files) {
    const mode = window._dbImportMode || 'quick';

    _setProgress(true, 'Parsing ' + files.length + ' file' + (files.length > 1 ? 's' : '') + '...', 0);
    _setStatus('');

    let allSongs = [];
    let errors   = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const pct  = Math.round(((i) / files.length) * 75);
      _setProgress(true, 'Parsing ' + (i + 1) + ' / ' + files.length + ': ' + file.name, pct);

      try {
        const songs = await _parseOneFile(file);
        allSongs = allSongs.concat(songs);
      } catch (err) {
        errors.push(file.name + ': ' + err.message);
      }
    }

    _setProgress(true, 'Finalising...', 80);

    if (!allSongs.length) {
      _setProgress(false);
      _setStatus(
        errors.length ? '\u2715 ' + errors.join(' | ') : '\u2715 No songs found in the selected file(s).',
        true
      );
      return;
    }

    window._importBuffer = allSongs;

    if (mode === 'quick') {
      _setProgress(true, 'Importing ' + allSongs.length + ' songs...', 90);
      _doImport(allSongs);
    } else {
      _setProgress(false);
      if (typeof renderImportPreview === 'function') renderImportPreview(allSongs);
      const reviewPane = document.getElementById('db-review-panel');
      if (reviewPane) reviewPane.style.display = 'block';
      _setStatus(
        '\u2713 Found ' + allSongs.length + ' song' + (allSongs.length !== 1 ? 's' : '') +
        ' \u2014 review below, then click "Import Selected Songs".'
      );
    }
  }

  /* ── Parse one file using the existing BrideWorship.js parsers ── */
  async function _parseOneFile(file) {
    const ext = file.name.toLowerCase().split('.').pop();

    function readText() {
      return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload  = e => res(e.target.result);
        r.onerror = () => rej(new Error('Could not read file'));
        r.readAsText(file, 'UTF-8');
      });
    }

    if (ext === 'json' || ext === 'bwsongs')       return parseNativeJSON(await readText());
    if (ext === 'pro6' || ext === 'pro6x')          return parsePro6XML(await readText());
    if (ext === 'xml')                               return parseXMLAuto(await readText());
    if (ext === 'txt'  || ext === 'usr')            return parsePlainText(await readText(), file.name);
    if (ext === 'csv')                               return parseCSVSongs(await readText());
    if (ext === 'cho'  || ext === 'chordpro')       return parseChordPro(await readText(), file.name);
    if ((ext === 'ewsx' || ext === 'ews') && typeof parseEWSX === 'function')
      return await parseEWSX(file);
    /* fallback */
    return parsePlainText(await readText(), file.name);
  }

  /* ── Do the actual SONGS array mutation ── */
  function _doImport(songs) {
    if (!songs || !songs.length) {
      _setStatus('\u26A0 No songs to import.', true);
      _setProgress(false);
      return;
    }

    const dupeMode      = document.getElementById('db-dupe-mode')?.value || 'skip';
    const existingLower = new Set(SONGS.map(s => s.title.toLowerCase()));
    const toAdd    = [];
    const replaced = [];
    const skipped  = [];

    songs.forEach(song => {
      if (!song || !song.title || !song.slides) return;
      const key    = song.title.toLowerCase();
      const isDupe = existingLower.has(key);

      if (isDupe) {
        if (dupeMode === 'skip') { skipped.push(song.title); return; }
        if (dupeMode === 'replace') {
          const idx = SONGS.findIndex(s => s.title.toLowerCase() === key);
          if (idx >= 0) { SONGS[idx] = song; replaced.push(song.title); return; }
        }
      }
      toAdd.push(song);
      existingLower.add(key);
    });

    SONGS.push(...toAdd);
    if (typeof saveSongsToStorage === 'function') saveSongsToStorage();
    if (typeof buildSongLibrary   === 'function') buildSongLibrary();
    if (typeof buildSchSongPicker === 'function') buildSchSongPicker();

    _setProgress(true, 'Done!', 100);
    setTimeout(() => _setProgress(false), 900);

    const parts = [];
    if (toAdd.length)    parts.push('\u2713 ' + toAdd.length + ' new song' + (toAdd.length !== 1 ? 's' : '') + ' imported');
    if (replaced.length) parts.push(replaced.length + ' replaced');
    if (skipped.length)  parts.push(skipped.length + ' duplicate' + (skipped.length !== 1 ? 's' : '') + ' skipped');
    const msg = parts.join(' \u00B7 ');
    _setStatus(msg, false);

    /* Reset drop zone label */
    const total  = toAdd.length + replaced.length;
    const dzIcon = document.getElementById('dz-icon');
    const dzText = document.getElementById('dz-text');
    if (dzIcon) dzIcon.textContent = '\u2713';
    if (dzText) { dzText.textContent = total + ' song' + (total !== 1 ? 's' : '') + ' imported'; dzText.style.color = 'var(--green)'; }
    setTimeout(() => {
      if (dzIcon) dzIcon.textContent = '\uD83D\uDCC2';
      if (dzText) { dzText.textContent = 'Drop song files here'; dzText.style.color = ''; }
    }, 3500);

    /* Switch library panel to Songs */
    const ltabSongs = document.getElementById('ltab-songs');
    if (ltabSongs && typeof libTab === 'function') libTab(ltabSongs, 'ls-songs');

    if (typeof showSchToast === 'function') showSchToast(msg || '\u2713 Import complete');
    window._importBuffer = [];
  }

  /* ── Footer button action ── */
  window.dbImportAction = function () {
    const mode = window._dbImportMode || 'quick';
    if (mode === 'quick') {
      if (!window._importBuffer || !window._importBuffer.length) {
        document.getElementById('db-file-input-bulk')?.click();
        return;
      }
      _doImport(window._importBuffer);
    } else {
      /* Review mode: import only checked songs */
      const checked = Array.from(document.querySelectorAll('.db-song-chk:checked'))
        .map(chk => (window._importBuffer || [])[parseInt(chk.dataset.idx)])
        .filter(Boolean);
      if (!checked.length) { _setStatus('\u26A0 Select at least one song to import.', true); return; }
      _doImport(checked);
    }
  };

  /* ── Progress helpers ── */
  function _setProgress(visible, label, pct) {
    const wrap  = document.getElementById('db-bulk-progress');
    const lbl   = document.getElementById('db-progress-label');
    const bar   = document.getElementById('db-progress-bar');
    const pctEl = document.getElementById('db-progress-pct');
    if (!wrap) return;
    wrap.style.display = visible ? 'block' : 'none';
    if (lbl   && label !== undefined) lbl.textContent   = label;
    if (bar   && pct   !== undefined) bar.style.width   = pct + '%';
    if (pctEl && pct   !== undefined) pctEl.textContent = pct < 100 ? pct + '%' : '\u2713';
  }

  function _setStatus(msg, isError) {
    const el = document.getElementById('db-import-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'var(--red)' : 'var(--text-2)';
  }

  /* ── Redirect old single-file handler so legacy drop-zone still works ── */
  window.handleDBFile = async function (event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    if (!files.length) return;
    await _processFiles(files);
  };

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    removeSchedulePreview();
    patchDBImport();
    console.info('[BW fix4.js] \u2713 Bulk import  \u2713 Schedule preview removed');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }

})();