/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix10.js
   1. Imported files saved as permanent sermons in Built-in
      Reader — appear alongside built-in entries, persist
      across sessions.
   2. Activity log — every significant user action is
      timestamped and stored.
   3. Clock upgrades: font selector + drag-to-position on
      the output preview and projection window.
   4. Backup / Restore — one-click JSON export of every
      piece of user data; one-click restore.
═══════════════════════════════════════════════════════════ */

(function BW_Fix10() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix10-styles';
  _style.textContent = `

    /* ── Imported sermon list in reader ─────────────────── */
    .imported-sermon-item {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: 6px;
      background: var(--bg-card); border: 1px solid var(--border-dim);
      margin-bottom: 5px; cursor: pointer; transition: border-color .15s;
    }
    .imported-sermon-item:hover { border-color: var(--gold-dim); }
    .imported-sermon-icon { font-size: 18px; flex-shrink: 0; }
    .imported-sermon-info { flex: 1; min-width: 0; }
    .imported-sermon-title {
      font-size: 12px; color: var(--text-1, #e0ddd8);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .imported-sermon-meta { font-size: 10px; color: var(--text-3); margin-top: 2px; }
    .imported-sermon-del {
      font-size: 11px; color: var(--text-3); cursor: pointer; flex-shrink: 0;
      padding: 3px 6px; border-radius: 3px; transition: background .1s;
    }
    .imported-sermon-del:hover { background: rgba(224,80,80,.15); color: var(--red, #e05050); }

    /* ── Activity log ────────────────────────────────────── */
    #activity-panel {
      max-height: 340px; overflow-y: auto; padding: 2px 0;
    }
    #activity-panel::-webkit-scrollbar { width: 3px; }
    #activity-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }
    .activity-row {
      display: flex; align-items: flex-start; gap: 8px;
      padding: 6px 0; border-bottom: 1px solid var(--border-dim);
      font-size: 11px;
    }
    .activity-time { color: var(--text-3); flex-shrink: 0; white-space: nowrap; }
    .activity-icon { flex-shrink: 0; font-size: 12px; }
    .activity-desc { flex: 1; color: var(--text-2); line-height: 1.5; }

    /* ── Clock font + drag ───────────────────────────────── */
    #clock-font-row {
      display: flex; gap: 5px; align-items: center; margin-top: 5px;
    }
    #clock-font-sel { flex: 1; }

    #clock-drag-hint {
      font-size: 9px; color: var(--gold-dim, #8a6a20);
      margin-top: 4px; line-height: 1.5;
    }
    .clock-drag-handle {
      cursor: move !important;
      user-select: none;
    }

    /* ── Backup section ──────────────────────────────────── */
    #backup-section {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .bk-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .bk-btn {
      flex: 1; padding: 9px 12px;
      border-radius: 5px; cursor: pointer; font-size: 12px;
      font-family: 'Lato', sans-serif; transition: opacity .15s;
      display: flex; align-items: center; gap: 6px;
      justify-content: center; white-space: nowrap;
    }
    .bk-btn:hover { opacity: .85; }
    .bk-export {
      background: var(--gold, #c9a84c); color: #000;
      border: none; font-weight: 700;
    }
    .bk-restore {
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      color: var(--text-2);
    }
    .bk-restore:hover { border-color: var(--gold-dim); color: var(--gold); }
    .bk-clear {
      background: none;
      border: 1px solid rgba(224,80,80,.3);
      color: var(--red, #e05050);
    }
    .bk-info {
      font-size: 10px; color: var(--text-3); line-height: 1.6;
      padding: 6px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
    }
    .bk-last { font-size: 10px; color: var(--gold-dim, #8a6a20); min-height: 14px; }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     1 — IMPORTED SERMONS: SAVED PERMANENTLY
  ══════════════════════════════════════════════════════════ */

  /* Storage key */
  const SERMON_STORE_KEY = 'bw_imported_sermons';

  let _importedSermons = _loadImportedSermons();

  function _loadImportedSermons() {
    try { return JSON.parse(localStorage.getItem(SERMON_STORE_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function _saveImportedSermons() {
    try { localStorage.setItem(SERMON_STORE_KEY, JSON.stringify(_importedSermons)); }
    catch(e) { if (typeof showSchToast === 'function') showSchToast('⚠ Storage full — some sermons may not be saved'); }
  }

  /* Add a new imported sermon to the store */
  function _storeSermon(title, author, paras, filename) {
    const existing = _importedSermons.findIndex(s => s.title === title);
    const entry = {
      id:       'imp_' + Date.now(),
      title,
      author:   author || '',
      filename: filename || title,
      addedAt:  new Date().toISOString(),
      content:  paras.map((text, i) => ({ section: title, text })),
    };
    if (existing >= 0) { _importedSermons[existing] = entry; }
    else               { _importedSermons.unshift(entry); }
    if (_importedSermons.length > 1000) _importedSermons.pop();
    _saveImportedSermons();
    logActivity('📄', `Imported sermon: "${title}" (${paras.length} paragraphs)`);
    return entry;
  }

  function deleteImportedSermon(id) {
    _importedSermons = _importedSermons.filter(s => s.id !== id);
    _saveImportedSermons();
    renderImportedSermonList();
    if (typeof showSchToast === 'function') showSchToast('Sermon removed');
  }
  window.deleteImportedSermon = deleteImportedSermon;

  /* Render the imported sermon list inside the Reader tab */
  function renderImportedSermonList() {
    const wrap = document.getElementById('imported-sermon-list');
    if (!wrap) return;
    if (!_importedSermons.length) {
      wrap.innerHTML = '<div style="font-size:10px;color:var(--text-3);padding:6px 0;">No imported sermons yet.</div>';
      return;
    }
    wrap.innerHTML = _importedSermons.map(s => `
      <div class="imported-sermon-item" onclick="openImportedSermon('${s.id}')">
        <div class="imported-sermon-icon">📄</div>
        <div class="imported-sermon-info">
          <div class="imported-sermon-title">${_esc(s.title)}</div>
          <div class="imported-sermon-meta">
            ${s.author ? _esc(s.author) + ' · ' : ''}
           // AFTER
${(Array.isArray(s.content) ? s.content.length : Array.isArray(s.paras) ? s.paras.length : 0)} paragraphs ·
            ${new Date(s.addedAt).toLocaleDateString()}
          </div>
        </div>
        <span class="imported-sermon-del"
          onclick="event.stopPropagation();deleteImportedSermon('${s.id}')"
          title="Remove">✕</span>
      </div>`).join('');
  }

  window.openImportedSermon = function (id) {
    const sermon = _importedSermons.find(s => s.id === id);
    if (!sermon) return;

    /* Populate _readerParas and show in reader */
    window._readerTitle  = sermon.title;
    window._readerAuthor = sermon.author || '';
    if (window._selectedParas) window._selectedParas.clear();

   // AFTER
const _paras = Array.isArray(sermon.paras)
  ? sermon.paras.map((text, i) => ({ text, section: sermon.title, idx: i }))
  : Array.isArray(sermon.content)
    ? sermon.content.map((c, i) => ({ text: typeof c === 'string' ? c : c.text, section: sermon.title, idx: i }))
    : [];
window._readerParas = _paras;

    if (typeof window._renderReaderParas === 'function') window._renderReaderParas();

    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = sermon.title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    logActivity('📖', `Opened imported sermon: "${sermon.title}"`);
  };

  /* ── Patch fix9's _handleFile to also save to store ── */
  function _patchHandleFile() {
    /* We watch for when reader paras are populated after a file load,
       detect the newly rendered viewer title, and save to store */
    const origOpen = window.openTheTable;
    window.openTheTable = function () {
      if (origOpen) origOpen();
      setTimeout(() => {
        _injectImportedSermonSection();
        renderImportedSermonList();
      }, 200);
    };
  }

  /* Intercept the file handler from fix9 */
  const _origHandleFile = window._fix9HandleFile; /* may not exist yet */

  /* Monkey-patch the zone click after it exists */
  function _patchImportZone() {
    const zone = document.getElementById('reader-import-zone');
    if (!zone || zone.dataset.fix10) return;
    zone.dataset.fix10 = '1';

    /* Wrap the existing drop handler */
    const existingDrop = zone.ondrop;
    zone.addEventListener('drop', async (e) => {
      /* wait for fix9 to process, then save */
      setTimeout(() => _saveCurrentReaderAsSermon(), 600);
    }, true);

    /* Wrap file input clicks */
    const existingClick = zone.onclick;
    zone.addEventListener('click', () => {
      setTimeout(() => {
        /* After file is processed, listen for viewer becoming visible */
        const observer = new MutationObserver(() => {
          const viewer = document.getElementById('reader-viewer');
          if (viewer && viewer.style.display !== 'none') {
            observer.disconnect();
            setTimeout(_saveCurrentReaderAsSermon, 400);
          }
        });
        const viewer = document.getElementById('reader-viewer');
        if (viewer) observer.observe(viewer, { attributes: true, attributeFilter: ['style'] });
      }, 100);
    }, true);
  }

  function _saveCurrentReaderAsSermon() {
    const paras  = window._readerParas;
    const title  = window._readerTitle;
    const author = window._readerAuthor || '';
    if (!paras?.length || !title) return;
    _storeSermon(title, author, paras.map(p => p.text), title);
    renderImportedSermonList();
    if (typeof showSchToast === 'function')
      showSchToast(`✓ "${title}" saved to Your Library`);
  }

  function _injectImportedSermonSection() {
    const readerBody = document.querySelector('#tt-reader .modal-body');
    if (!readerBody || document.getElementById('imported-sermon-list')) return;

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom:10px;';
    section.innerHTML = `
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;
        color:var(--gold-dim,#8a6a20);text-transform:uppercase;margin-bottom:5px;">
        📚 Your Imported Sermons
      </div>
      <div id="imported-sermon-list"></div>
    `;

    /* Insert after the search bar */
    const searchBar = readerBody.querySelector('.db-scroll > div:first-child, input');
    if (searchBar) {
      const parent = searchBar.closest('.db-scroll') || readerBody;
      parent.appendChild(section);
    } else {
      readerBody.appendChild(section);
    }

    renderImportedSermonList();
    setTimeout(_patchImportZone, 100);
  }


  /* ══════════════════════════════════════════════════════════
     2 — ACTIVITY LOG
  ══════════════════════════════════════════════════════════ */

  const ACT_KEY = 'bw_activity_log';
  let _actLog = [];

  (function _loadLog() {
    try { _actLog = JSON.parse(localStorage.getItem(ACT_KEY) || '[]'); } catch(e) { _actLog = []; }
  })();

  function logActivity(icon, desc) {
    const entry = {
      ts:   new Date().toISOString(),
      icon: icon || '•',
      desc: desc || '',
    };
    _actLog.unshift(entry);
    if (_actLog.length > 500) _actLog.pop();
    try { localStorage.setItem(ACT_KEY, JSON.stringify(_actLog)); } catch(e) {}
  }
  window.logActivity = logActivity;

  /* Hook key actions */
  function _wireActivityHooks() {
    const hooks = {
      loadSong:          (idx) => logActivity('🎵', `Loaded song: "${SONGS?.[idx]?.title || idx}"`),
      saveSong:          ()    => logActivity('💾', 'Song saved'),
      toggleLive:        ()    => logActivity('📡', S?.live ? 'Went LIVE' : 'Ended LIVE'),
      toggleBlank:       ()    => logActivity('■',  S?.blanked ? 'Screen blanked' : 'Screen un-blanked'),
      openProjection:    ()    => logActivity('🖥', 'Second screen opened'),
      saveSchedule:      ()    => logActivity('📅', `Schedule saved: "${document.getElementById('sch-title')?.value || ''}"`),
      exportDatabase:    ()    => logActivity('⬆', 'Song database exported'),
      confirmImport:     ()    => logActivity('⬇', 'Songs imported'),
    };
    Object.entries(hooks).forEach(([fn, cb]) => {
      const orig = window[fn];
      if (typeof orig !== 'function') return;
      window[fn] = function (...a) {
        const r = orig.apply(this, a);
        try { cb(...a); } catch(e) {}
        return r;
      };
    });
  }

  function renderActivityLog() {
    const panel = document.getElementById('activity-panel');
    if (!panel) return;
    if (!_actLog.length) {
      panel.innerHTML = '<div style="font-size:11px;color:var(--text-3);padding:10px 0;">No activity recorded yet.</div>';
      return;
    }
    panel.innerHTML = _actLog.slice(0, 100).map(a => `
      <div class="activity-row">
        <span class="activity-time">${new Date(a.ts).toLocaleTimeString()}</span>
        <span class="activity-icon">${_esc(a.icon)}</span>
        <span class="activity-desc">${_esc(a.desc)}</span>
      </div>`).join('');
  }


  /* ══════════════════════════════════════════════════════════
     3 — CLOCK: FONT SELECTOR + DRAG POSITION
  ══════════════════════════════════════════════════════════ */

  const CLOCK_FONTS = [
    'Cinzel', 'Lato', 'Playfair Display',
    'Arial', 'Georgia', 'Courier New',
    'Trebuchet MS', 'Verdana', 'Tahoma',
    'Palatino Linotype', 'Garamond', 'Impact',
  ];

  let _clockFont = localStorage.getItem('bw_clock_font') || 'Cinzel';
  let _clockPos  = JSON.parse(localStorage.getItem('bw_clock_xy') || 'null');
  /* _clockPos: {x,y} in percent of container, or null (use CSS class position) */

  function buildClockFontRow() {
    if (document.getElementById('clock-font-row')) return;
    const panel = document.getElementById('clock-settings-panel');
    if (!panel) return;

    const row = document.createElement('div');
    row.id = 'clock-font-row';
    row.innerHTML = `
      <span class="fmt-label">Font:</span>
      <select class="fmt-select" id="clock-font-sel" onchange="clockFontChange(this.value)">
        ${CLOCK_FONTS.map(f => `<option value="${f}" ${f===_clockFont?'selected':''}>${f}</option>`).join('')}
      </select>
    `;
    panel.appendChild(row);

    const hint = document.createElement('div');
    hint.id = 'clock-drag-hint';
    hint.textContent = '✦ Drag the clock in the Output Preview to reposition it on screen.';
    panel.appendChild(hint);

    _applyClockFont();
  }

  window.clockFontChange = function (font) {
    _clockFont = font;
    localStorage.setItem('bw_clock_font', font);
    _applyClockFont();
    if (typeof updateClockSettings === 'function') updateClockSettings();
  };

  function _applyClockFont() {
    const ck = document.getElementById('out-clock');
    if (ck) ck.style.fontFamily = `'${_clockFont}', monospace`;

    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const pc = pw.document.getElementById('proj-clock');
      if (pc) pc.style.fontFamily = `'${_clockFont}', monospace`;
    }
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) sc.style.fontFamily = `'${_clockFont}', monospace`;
    }
  }

  /* ── Draggable clock on the output preview ── */
  function makeDraggableClock() {
    const ck      = document.getElementById('out-clock');
    const screen  = document.getElementById('out-screen');
    if (!ck || !screen || ck.dataset.draggable) return;
    ck.dataset.draggable = '1';
    ck.classList.add('clock-drag-handle');
    ck.title = 'Drag to reposition clock';

    /* Apply saved position */
    if (_clockPos) _applyClockXY(_clockPos.x, _clockPos.y, ck, screen);

    let dragging = false, startX, startY, startL, startT;

    ck.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      const rect = screen.getBoundingClientRect();
      const ckRect = ck.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startL = ckRect.left - rect.left;
      startT = ckRect.top  - rect.top;

      /* Switch to absolute positioning */
      ck.style.position = 'absolute';
      ck.style.left     = startL + 'px';
      ck.style.top      = startT + 'px';
      ck.style.right    = 'auto';
      ck.style.bottom   = 'auto';
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect  = screen.getBoundingClientRect();
      const dx    = e.clientX - startX;
      const dy    = e.clientY - startY;
      let   newL  = Math.max(0, Math.min(rect.width  - ck.offsetWidth,  startL + dx));
      let   newT  = Math.max(0, Math.min(rect.height - ck.offsetHeight, startT + dy));
      ck.style.left = newL + 'px';
      ck.style.top  = newT + 'px';
    });

    document.addEventListener('mouseup', e => {
      if (!dragging) return;
      dragging = false;
      /* Save as percentage of container */
      const rect = screen.getBoundingClientRect();
      const pctX = (parseFloat(ck.style.left) / rect.width)  * 100;
      const pctY = (parseFloat(ck.style.top)  / rect.height) * 100;
      _clockPos = { x: pctX, y: pctY };
      localStorage.setItem('bw_clock_xy', JSON.stringify(_clockPos));
      /* Mirror position to projection window */
      _syncClockPosToProj(pctX, pctY);
    });

    /* Touch support */
    ck.addEventListener('touchstart', e => {
      const t = e.touches[0];
      ck.dispatchEvent(new MouseEvent('mousedown', {clientX:t.clientX, clientY:t.clientY}));
    }, {passive:true});
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      document.dispatchEvent(new MouseEvent('mousemove', {clientX:t.clientX, clientY:t.clientY}));
    }, {passive:true});
    document.addEventListener('touchend', () => {
      if (dragging) document.dispatchEvent(new MouseEvent('mouseup'));
    }, {passive:true});
  }

  function _applyClockXY(pctX, pctY, ck, screen) {
    if (!ck || !screen) return;
    const rect = screen.getBoundingClientRect();
    ck.style.position = 'absolute';
    ck.style.left   = (pctX / 100 * rect.width) + 'px';
    ck.style.top    = (pctY / 100 * rect.height) + 'px';
    ck.style.right  = 'auto';
    ck.style.bottom = 'auto';
  }

  function _syncClockPosToProj(pctX, pctY) {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;
    /* Map preview percentage to virtual canvas (1920×1080) */
    const vx = pctX / 100 * 1920;
    const vy = pctY / 100 * 1080;
    pc.style.position = 'fixed';
    pc.style.left     = vx + 'px';
    pc.style.top      = vy + 'px';
    pc.style.right    = 'auto';
    pc.style.bottom   = 'auto';
    localStorage.setItem('bw_clock_proj_xy', JSON.stringify({x:vx, y:vy}));
  }

  /* Patch tickClock to keep font applied */
  const _origTick = window.tickClock;
  if (typeof _origTick === 'function') {
    window.tickClock = function () {
      _origTick();
      const ck = document.getElementById('out-clock');
      if (ck) ck.style.fontFamily = `'${_clockFont}', monospace`;
    };
  }


  /* ══════════════════════════════════════════════════════════
     4 — BACKUP / RESTORE / ACTIVITY LOG BUTTON IN SETTINGS
  ══════════════════════════════════════════════════════════ */

  /* All keys we back up */
  const BACKUP_KEYS = [
    'bw_songs', 'bw_presentations', 'bw_so', 'bw_settings',
    'bw_clock', 'bw_clock_px', 'bw_clock_font', 'bw_clock_xy',
    'bw_bib_saved', 'bw_sch_saved', 'bw_sch_active',
    'bw_imported_fonts', 'bw_imported_sermons',
    'bw_nuggets', 'bw_activity_log', 'bw_timer_font',
    'bw_templates', 'bw_screen_permission',
  ];

  window.backupAllData = function () {
    const data = { version: 1, exportedAt: new Date().toISOString(), data: {} };
    BACKUP_KEYS.forEach(k => {
      try { const v = localStorage.getItem(k); if (v) data.data[k] = JSON.parse(v); } catch(e) {}
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'brideworship-backup-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    logActivity('💾', 'Full backup exported');
    const lbl = document.getElementById('bk-last-lbl');
    if (lbl) lbl.textContent = 'Last backup: ' + new Date().toLocaleString();
    localStorage.setItem('bw_last_backup', new Date().toISOString());
    if (typeof showSchToast === 'function') showSchToast('✓ Backup downloaded');
  };

  window.restoreBackup = function () {
    const inp = document.createElement('input');
    inp.type   = 'file'; inp.accept = '.json'; inp.style.display = 'none';
    inp.addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!data.data) throw new Error('Invalid backup file');
          if (!confirm(`Restore backup from ${new Date(data.exportedAt).toLocaleString()}?\n\nThis will overwrite your current data.`)) return;
          Object.entries(data.data).forEach(([k, v]) => {
            try { localStorage.setItem(k, JSON.stringify(v)); } catch(ee) {}
          });
          logActivity('♻', 'Backup restored from ' + data.exportedAt);
          if (typeof showSchToast === 'function') showSchToast('✓ Backup restored — refresh to apply all changes');
          setTimeout(() => window.location.reload(), 2000);
        } catch(err) {
          if (typeof showSchToast === 'function') showSchToast('⚠ Invalid backup file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
    document.body.appendChild(inp); inp.click();
    setTimeout(() => inp.remove(), 12000);
  };

  window.clearActivityLog = function () {
    if (!confirm('Clear the entire activity log?')) return;
    _actLog = []; localStorage.removeItem(ACT_KEY);
    renderActivityLog();
    if (typeof showSchToast === 'function') showSchToast('Activity log cleared');
  };

  function buildBackupSection() {
    /* Append to the Settings modal body */
    const settingsBody = document.querySelector('#settings-modal .modal-body');
    if (!settingsBody || document.getElementById('backup-section')) return;

    const sec = document.createElement('div');
    sec.id = 'backup-section';

    const lastBackup = localStorage.getItem('bw_last_backup');
    const lastStr    = lastBackup ? 'Last backup: ' + new Date(lastBackup).toLocaleString() : 'No backup made yet';

    sec.innerHTML = `
      <div class="settings-section-label">Data & Backup</div>

      <div class="bk-row">
        <button class="bk-btn bk-export" onclick="backupAllData()">
          💾 Export Full Backup
        </button>
        <button class="bk-btn bk-restore" onclick="restoreBackup()">
          ♻ Restore Backup
        </button>
      </div>

      <div class="bk-info">
        Backup includes: songs, schedules, settings, nuggets, imported sermons,
        fonts, clock config, and activity log.
      </div>

      <div class="bk-last" id="bk-last-lbl">${lastStr}</div>

      <div class="settings-section-label" style="margin-top:12px;">Activity Log</div>

      <div id="activity-panel"></div>

      <div class="bk-row" style="margin-top:6px;">
        <button class="bk-btn bk-clear" onclick="clearActivityLog()" style="flex:0 0 auto;padding:7px 14px;">
          ✕ Clear Log
        </button>
        <button class="bk-btn bk-restore" onclick="renderActivityLog()" style="flex:0 0 auto;padding:7px 14px;">
          ↺ Refresh
        </button>
      </div>
    `;
    settingsBody.appendChild(sec);
    renderActivityLog();
  }

  /* Patch openSettings to inject backup section */
  const _origOpenSettings = window.openSettings;
  window.openSettings = function () {
    if (_origOpenSettings) _origOpenSettings();
    setTimeout(() => { buildBackupSection(); renderActivityLog(); }, 80);
  };

  /* ── Also add a Backup button to the topbar ── */
  function addTopbarBackupBtn() {
    if (document.getElementById('backup-topbar-btn')) return;
    const goBtn = document.getElementById('go-btn');
    if (!goBtn) return;
    const btn = document.createElement('button');
    btn.id        = 'backup-topbar-btn';
    btn.className = 'proj-btn';
    btn.title     = 'Export Full Backup';
    btn.innerHTML = '💾 Backup';
    btn.addEventListener('click', () => {
      backupAllData();
    });
    goBtn.parentNode.insertBefore(btn, goBtn);
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    _wireActivityHooks();
    buildClockFontRow();
    makeDraggableClock();
    addTopbarBackupBtn();
    _patchHandleFile();
    logActivity('🚀', 'BrideWorship Pro started');

    /* Re-apply saved clock font */
    const savedFont = localStorage.getItem('bw_clock_font');
    if (savedFont) { _clockFont = savedFont; _applyClockFont(); }

    /* Re-apply saved clock position */
    const savedXY = localStorage.getItem('bw_clock_xy');
    if (savedXY) {
      try {
        _clockPos = JSON.parse(savedXY);
        const ck  = document.getElementById('out-clock');
        const sc  = document.getElementById('out-screen');
        if (ck && sc) setTimeout(() => _applyClockXY(_clockPos.x, _clockPos.y, ck, sc), 300);
      } catch(e) {}
    }

    /* Wait for out-screen to render then wire drag */
    setTimeout(makeDraggableClock, 600);

    console.info('[BW fix10] ✓ Saved sermons  ✓ Activity log  ✓ Clock font+drag  ✓ Backup');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { setTimeout(boot, 300); }


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();