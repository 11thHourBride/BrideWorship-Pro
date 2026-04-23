/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix13.js
   Built-in Reader — complete search & browse redesign.
   1. Imported sermons hidden from main view; accessible via
      a "📚 Library" browse panel.
   2. Search bar with scope + type controls:
        [All | Current Sermon]  [🔍 Any Word]  [🔎 Exact Quote]
      All    + 🔍 = any word across every sermon (built-in + imported)
      All    + 🔎 = exact phrase across every sermon
      Current+ 🔍 = any word in the open sermon's paragraphs
      Current+ 🔎 = exact phrase in the open sermon's paragraphs
      Results render as selectable paragraph cards.
═══════════════════════════════════════════════════════════ */

(function BW_Fix13() {
  'use strict';

  const SERMON_KEY = 'bw_imported_sermons_v2'; // same key as fix12

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix13-styles';
  _style.textContent = `

    /* ── Search toolbar ───────────────────────────────────── */
    #f13-search-bar {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
    }

    /* Row 1: scope toggles */
    #f13-scope-row {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .f13-scope-btn {
      flex: 1;
      padding: 6px 8px;
      border-radius: 5px;
      border: 1px solid var(--border-dim);
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 11px;
      font-family: 'Lato', sans-serif;
      cursor: pointer;
      text-align: center;
      transition: background .12s, border-color .12s, color .12s;
      white-space: nowrap;
    }
    .f13-scope-btn.active {
      background: rgba(201,168,76,.12);
      border-color: var(--gold, #c9a84c);
      color: var(--gold, #c9a84c);
      font-weight: 700;
    }

    /* Row 2: input + search type buttons */
    #f13-input-row {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    #f13-input {
      flex: 1;
      font-size: 12px;
    }
    .f13-type-btn {
      flex-shrink: 0;
      padding: 6px 10px;
      border-radius: 5px;
      border: 1px solid var(--border-dim);
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 15px;
      cursor: pointer;
      transition: background .12s, border-color .12s;
      white-space: nowrap;
      title: attr(title);
    }
    .f13-type-btn:hover    { background: var(--bg-hover); border-color: var(--gold-dim); }
    .f13-type-btn.f13-any  { border-color: var(--blue, #4a90d9); color: var(--blue, #4a90d9); background: rgba(74,144,217,.1); }
    .f13-type-btn.f13-exact{ border-color: var(--gold, #c9a84c); color: var(--gold, #c9a84c); background: rgba(201,168,76,.1); }

    /* Row 3: Library button */
    #f13-library-row {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    #f13-lib-btn {
      flex: 1;
      padding: 6px 10px;
      border-radius: 5px;
      border: 1px solid var(--border-dim);
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 11px;
      cursor: pointer;
      text-align: center;
      transition: background .12s, border-color .12s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    #f13-lib-btn:hover { background: var(--bg-hover); border-color: var(--gold-dim); color: var(--gold); }

    #f13-lib-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 17px; height: 17px;
      border-radius: 9px;
      background: var(--gold, #c9a84c);
      color: #000;
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
    }

    /* ── Library browse panel ─────────────────────────────── */
    #f13-library-panel {
      display: none;
      flex-direction: column;
      gap: 0;
      margin-bottom: 10px;
    }
    #f13-library-panel.open { display: flex; }

    .f13-lib-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 10px;
      background: rgba(201,168,76,.08);
      border: 1px solid rgba(201,168,76,.2);
      border-radius: 6px 6px 0 0;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: var(--gold, #c9a84c);
      text-transform: uppercase;
    }
    .f13-lib-close {
      cursor: pointer;
      font-size: 13px;
      color: var(--text-3);
      line-height: 1;
    }
    .f13-lib-close:hover { color: var(--text-1, #e0ddd8); }

    .f13-lib-list {
      max-height: 220px;
      overflow-y: auto;
      border: 1px solid rgba(201,168,76,.2);
      border-top: none;
      border-radius: 0 0 6px 6px;
    }
    .f13-lib-list::-webkit-scrollbar       { width: 3px; }
    .f13-lib-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

    .f13-lib-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-dim);
      cursor: pointer;
      transition: background .1s;
    }
    .f13-lib-item:last-child { border-bottom: none; }
    .f13-lib-item:hover      { background: var(--bg-hover); }
    .f13-lib-item.active     { background: rgba(201,168,76,.07); }

    .f13-lib-icon { font-size: 15px; flex-shrink: 0; }
    .f13-lib-info { flex: 1; min-width: 0; }
    .f13-lib-title {
      font-size: 12px;
      color: var(--text-1, #e0ddd8);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .f13-lib-meta { font-size: 10px; color: var(--text-3); margin-top: 1px; }
    .f13-lib-del  {
      font-size: 11px; color: var(--text-3);
      cursor: pointer; padding: 3px 5px; flex-shrink: 0;
      border-radius: 3px; transition: background .1s;
    }
    .f13-lib-del:hover { background: rgba(224,80,80,.15); color: var(--red, #e05050); }

    .f13-lib-empty {
      padding: 16px; font-size: 11px; color: var(--text-3); text-align: center; line-height: 1.7;
    }

    /* ── Search results ───────────────────────────────────── */
    #f13-results {
      display: none;
      flex-direction: column;
      margin-bottom: 8px;
    }
    #f13-results.open { display: flex; }

    .f13-results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 2px;
      margin-bottom: 4px;
    }
    .f13-results-title {
      font-size: 10px;
      color: var(--gold-dim, #8a6a20);
      font-family: 'Cinzel', serif;
      letter-spacing: 1px;
    }
    .f13-results-close {
      font-size: 11px; color: var(--text-3); cursor: pointer;
    }
    .f13-results-close:hover { color: var(--text-1, #e0ddd8); }

    .f13-result-group-label {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: var(--gold-dim, #8a6a20);
      text-transform: uppercase;
      padding: 8px 4px 3px;
      border-bottom: 1px solid var(--border-dim);
      margin-bottom: 3px;
    }

    /* Reuse reader-para styles for result cards */
    .f13-result-card {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 7px 6px;
      border-radius: 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--border-dim);
      transition: background .1s;
    }
    .f13-result-card:hover    { background: var(--bg-hover); }
    .f13-result-card.selected { background: rgba(201,168,76,.07); }

    .f13-rc-chk {
      flex-shrink: 0; margin-top: 2px;
      accent-color: var(--gold, #c9a84c);
      width: 14px; height: 14px; cursor: pointer;
    }
    .f13-rc-body { flex: 1; min-width: 0; }
    .f13-rc-meta {
      font-family: 'Cinzel', serif;
      font-size: 8px; letter-spacing: 1px;
      color: var(--gold-dim, #8a6a20);
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .f13-rc-text {
      font-size: 12px; color: var(--text-1, #e0ddd8); line-height: 1.65;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .f13-rc-text mark {
      background: rgba(201,168,76,.28);
      color: var(--gold, #c9a84c);
      border-radius: 2px; padding: 0 1px;
    }

    /* Selection action bar — sticky */
    #f13-sel-bar {
      display: none;
      position: sticky;
      top: 0;
      z-index: 60;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 8px 10px;
      background: var(--bg-deep, #09090f);
      border-bottom: 1px solid rgba(201,168,76,.25);
      margin-bottom: 6px;
    }
    #f13-sel-bar.open { display: flex; }
    #f13-sel-count {
      flex: 1;
      font-size: 11px; color: var(--gold, #c9a84c);
      font-family: 'Cinzel', serif; letter-spacing: 1px;
    }
    .f13-sb-btn {
      padding: 5px 9px; font-size: 11px; cursor: pointer;
      border-radius: 4px; border: 1px solid var(--border-dim);
      background: var(--bg-card); color: var(--text-2);
      transition: background .1s; white-space: nowrap;
    }
    .f13-sb-btn:hover { background: var(--bg-hover); }
    .f13-sb-btn.proj   { background: var(--gold, #c9a84c); border-color: var(--gold); color:#000; font-weight:700; }
    .f13-sb-btn.nugget { background: rgba(212,160,23,.15); border-color:rgba(212,160,23,.35); color:var(--amber,#d4a017); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════════════ */

  let _scope     = 'all';       // 'all' | 'current'
  let _results   = [];          // [{sermonTitle, author, paraIdx, text}]
  let _selected  = new Set();   // indices into _results

  /* ══════════════════════════════════════════════════════════
     LOAD ALL SERMONS (built-in + imported)
  ══════════════════════════════════════════════════════════ */

  function _getAllSermons() {
    const sermons = [];

    /* Built-in */
    if (typeof BUILTIN_SERMONS !== 'undefined') {
      BUILTIN_SERMONS.forEach(s => {
        sermons.push({
          id:     s.id,
          title:  s.title,
          author: 'William Branham',
          source: 'builtin',
          paras:  (s.content || []).map(c => c.text),
        });
      });
    }

    /* Imported (from fix12 storage) */
    try {
      const imported = JSON.parse(localStorage.getItem('bw_imported_sermons_v2') || '[]');
      imported.forEach(s => {
        sermons.push({
          id:     s.id,
          title:  s.title,
          author: s.author || '',
          source: 'imported',
          paras:  s.paras || [],
        });
      });
    } catch(e) {}

    return sermons;
  }

  function _getImportedSermons() {
    try { return JSON.parse(localStorage.getItem('bw_imported_sermons_v2') || '[]'); }
    catch(e) { return []; }
  }

  /* ══════════════════════════════════════════════════════════
     SEARCH ENGINE
  ══════════════════════════════════════════════════════════ */

  function _runSearch(term, exact) {
    if (!term.trim()) return [];
    const q       = term.trim().toLowerCase();
    const results = [];

    let pool;
    if (_scope === 'current') {
      /* Search only open sermon paragraphs */
      const title  = window._readerTitle  || '';
      const author = window._readerAuthor || '';
      pool = [{ title, author, source:'current',
                paras: (window._readerParas||[]).map(p=>p.text) }];
    } else {
      pool = _getAllSermons();
    }

    pool.forEach(sermon => {
      sermon.paras.forEach((text, pi) => {
        const lo   = text.toLowerCase();
        const hit  = exact
          ? lo.includes(q)
          : q.split(/\s+/).every(w => lo.includes(w));
        if (hit) results.push({
          sermonTitle: sermon.title,
          author:      sermon.author || '',
          paraIdx:     pi,
          text,
          term: q,
          exact,
        });
      });
    });

    return results;
  }

  function _doSearch(exact) {
    const inp  = document.getElementById('f13-input');
    const term = inp?.value.trim() || '';
    if (!term) { if(typeof showSchToast==='function') showSchToast('Enter a search term first'); return; }

    _results  = _runSearch(term, exact);
    _selected = new Set();
    _renderResults(term, exact);
    _updateSelBar();
  }

  /* ══════════════════════════════════════════════════════════
     RENDER RESULTS
  ══════════════════════════════════════════════════════════ */

  function _renderResults(term, exact) {
    const panel = document.getElementById('f13-results');
    const rlist = document.getElementById('f13-results-list');
    if (!panel || !rlist) return;

    if (!_results.length) {
      rlist.innerHTML = `<div style="font-size:11px;color:var(--text-3);padding:14px;text-align:center;">
        No results for <strong>"${_esc(term)}"</strong>.<br>
        <span style="font-size:10px;">Try ${exact?'any-word search 🔍':'different words'}.</span>
      </div>`;
      panel.classList.add('open');
      document.getElementById('f13-results-title').textContent =
        `0 results · "${term}"`;
      return;
    }

    /* Group by sermon */
    const groups = {};
    _results.forEach((r, i) => {
      const key = r.sermonTitle;
      if (!groups[key]) groups[key] = { author: r.author, items: [] };
      groups[key].items.push({ r, i });
    });

    let html = '';
    Object.entries(groups).forEach(([sermonTitle, g]) => {
      html += `<div class="f13-result-group-label">
        ${_esc(sermonTitle)}${g.author ? ' · ' + _esc(g.author) : ''}
        <span style="color:var(--text-3);font-weight:400;">(${g.items.length})</span>
      </div>`;
      g.items.forEach(({ r, i }) => {
        html += `
          <div class="f13-result-card" id="f13-rc-${i}"
               onclick="f13ToggleResult(${i}, event)">
            <input type="checkbox" class="f13-rc-chk"
              onclick="event.stopPropagation();f13ToggleResult(${i},event)">
            <div class="f13-rc-body">
              <div class="f13-rc-meta">Para ${r.paraIdx + 1}</div>
              <div class="f13-rc-text">${_highlight(r.text, term)}</div>
            </div>
          </div>`;
      });
    });

    rlist.innerHTML = html;
    panel.classList.add('open');
    document.getElementById('f13-results-title').textContent =
      `${_results.length} result${_results.length!==1?'s':''} · "${term}" · ${exact?'exact':'any word'}`;
  }

  function _highlight(text, term) {
    const lo  = text.toLowerCase();
    const idx = lo.indexOf(term.toLowerCase());
    if (idx < 0) return _esc(text);
    const s = Math.max(0, idx - 30);
    const e = Math.min(text.length, idx + term.length + 60);
    return (s > 0 ? '…' : '') +
      _esc(text.substring(s, idx)) +
      '<mark>' + _esc(text.substring(idx, idx + term.length)) + '</mark>' +
      _esc(text.substring(idx + term.length, e)) +
      (e < text.length ? '…' : '');
  }

  /* ══════════════════════════════════════════════════════════
     RESULT SELECTION
  ══════════════════════════════════════════════════════════ */

  window.f13ToggleResult = function (i, event) {
    if (_selected.has(i)) _selected.delete(i);
    else                   _selected.add(i);
    const card = document.getElementById('f13-rc-' + i);
    const chk  = card?.querySelector('.f13-rc-chk');
    const on   = _selected.has(i);
    card?.classList.toggle('selected', on);
    if (chk) chk.checked = on;
    _updateSelBar();
  };

  function _updateSelBar() {
    const bar = document.getElementById('f13-sel-bar');
    const cnt = document.getElementById('f13-sel-count');
    const n   = _selected.size;
    bar?.classList.toggle('open', n > 0);
    if (cnt) cnt.textContent = n ? `${n} paragraph${n>1?'s':''} selected` : '';
  }

  function _getSelectedText() {
    if (!_selected.size) {
      if (typeof showSchToast==='function') showSchToast('Select at least one result first');
      return null;
    }
    return [..._selected].sort((a,b)=>a-b)
      .map(i => _results[i]?.text || '').filter(Boolean).join('\n\n');
  }

  function _getSelectedMeta() {
    const first = _results[[..._selected][0]];
    return { title: first?.sermonTitle || 'Message', author: first?.author || '' };
  }

  /* Global handlers used by the sticky bar buttons */
  window.f13ProjectSelected = function () {
    const text = _getSelectedText(); if (!text) return;
    const meta = _getSelectedMeta();
    _projectText(text, meta.title, meta.author);
  };
  window.f13ScheduleSelected = function () {
    const text = _getSelectedText(); if (!text) return;
    const meta = _getSelectedMeta();
    _addToSchedule(text, meta.title, meta.author);
  };
  window.f13SaveNugget = function () {
    const text = _getSelectedText(); if (!text) return;
    const meta = _getSelectedMeta();
    if (typeof addNugget === 'function') addNugget(text, meta.title, meta.author);
    else if (typeof showSchToast === 'function') showSchToast('Golden Nuggets not available');
  };
  window.f13ClearSel = function () {
    _selected.clear();
    document.querySelectorAll('.f13-result-card.selected').forEach(el => {
      el.classList.remove('selected');
      const chk = el.querySelector('.f13-rc-chk');
      if (chk) chk.checked = false;
    });
    _updateSelBar();
  };

  /* ══════════════════════════════════════════════════════════
     PROJECT / SCHEDULE HELPERS (local copies so no dependency)
  ══════════════════════════════════════════════════════════ */

  function _projectText(text, title, author) {
    const paras = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
    S.songIdx = null;
    S.slides  = paras.map(p => ({ section: title||'Message', author: author||'', text: p }));
    S.cur     = 0;
    if (typeof renderQueue==='function') renderQueue();
    if (typeof renderSlide==='function') renderSlide();
    if (typeof centerTab  ==='function') centerTab(document.querySelectorAll('.ctab')[0],'slides-view');
    document.getElementById('table-modal').style.display = 'none';
  }

  function _addToSchedule(text, title, author) {
    const paras   = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
    const content = paras.map(p=>`[${title||'Message'}]\n${p}`).join('\n\n');
    if (typeof schInsertFromLibrary==='function') {
      schInsertFromLibrary({ type:'sermon', label:title||'Message', content, notes:author||'', duration:0 }, -1);
    } else if (Array.isArray(S?.so)) {
      S.so.push({ name:title||'Message', type:'sermon', content });
      if (typeof renderSO==='function') renderSO();
    }
    if (typeof showSchToast==='function') showSchToast(`📅 "${title||'Message'}" added to Schedule`);
  }

  /* ══════════════════════════════════════════════════════════
     LIBRARY PANEL (imported sermons browse)
  ══════════════════════════════════════════════════════════ */

  function _renderLibraryList() {
    const list = document.getElementById('f13-lib-list-inner');
    if (!list) return;
    const sermons = _getImportedSermons();

    /* Update badge */
    const badge = document.getElementById('f13-lib-count');
    if (badge) badge.textContent = sermons.length || '0';

    if (!sermons.length) {
      list.innerHTML = `<div class="f13-lib-empty">
        No imported sermons yet.<br>Import a file using the 📄 Import button below.
      </div>`;
      return;
    }

    /* Built-in sermons at top */
    const builtin = typeof BUILTIN_SERMONS !== 'undefined' ? BUILTIN_SERMONS : [];
    let html = '';

    if (builtin.length) {
      html += `<div class="f13-result-group-label">Built-in Sermons</div>`;
      html += builtin.map(s => `
        <div class="f13-lib-item" onclick="f13OpenBuiltin('${s.id}')">
          <span class="f13-lib-icon">📖</span>
          <div class="f13-lib-info">
            <div class="f13-lib-title">${_esc(s.title)}</div>
            <div class="f13-lib-meta">${s.date} · ${(s.content||[]).length} paragraphs</div>
          </div>
        </div>`).join('');
    }

    html += `<div class="f13-result-group-label">Imported Sermons</div>`;
    html += sermons.map(s => `
      <div class="f13-lib-item" onclick="f13OpenImported('${s.id}')">
        <span class="f13-lib-icon">📄</span>
        <div class="f13-lib-info">
          <div class="f13-lib-title">${_esc(s.title)}</div>
          <div class="f13-lib-meta">
            ${s.author ? _esc(s.author)+' · ' : ''}${s.paras.length} paragraphs · ${new Date(s.addedAt).toLocaleDateString()}
          </div>
        </div>
        <span class="f13-lib-del"
          onclick="event.stopPropagation();f13DeleteImported('${s.id}')"
          title="Remove">✕</span>
      </div>`).join('');

    list.innerHTML = html;
  }

  window.f13OpenBuiltin = function (id) {
    if (typeof openBuiltinSermon === 'function') openBuiltinSermon(id);
    document.getElementById('f13-library-panel')?.classList.remove('open');
  };

  window.f13OpenImported = function (id) {
    if (typeof f12OpenSermon === 'function') {
      f12OpenSermon(id);
    } else {
      /* Fallback */
      const s = _getImportedSermons().find(s => s.id === id);
      if (!s) return;
      window._readerTitle  = s.title;
      window._readerAuthor = s.author || '';
      if (window._selectedParas) window._selectedParas.clear();
      window._readerParas  = s.paras.map((text,i) => ({ text, section:s.title, idx:i }));
      if (typeof window._renderReaderParas==='function') window._renderReaderParas();
      const viewer  = document.getElementById('reader-viewer');
      const titleEl = document.getElementById('reader-sermon-title');
      if (viewer)  viewer.style.display = 'block';
      if (titleEl) titleEl.textContent  = s.title;
    }
    document.getElementById('f13-library-panel')?.classList.remove('open');
  };

  window.f13DeleteImported = function (id) {
    const list = _getImportedSermons().filter(s => s.id !== id);
    try { localStorage.setItem('bw_imported_sermons_v2', JSON.stringify(list)); } catch(e) {}
    _renderLibraryList();
    if (typeof showSchToast==='function') showSchToast('Sermon removed');
  };

  /* ══════════════════════════════════════════════════════════
     BUILD THE NEW READER UI
  ══════════════════════════════════════════════════════════ */

  function _buildReaderUI() {
    const readerBody = document.querySelector('#tt-reader .modal-body, #tt-reader > .modal-body');
    if (!readerBody || document.getElementById('f13-search-bar')) return;

    /* Remove old search elements from fix9 / fix10 / fix11 / fix12 */
    ['reader-import-zone','f12-import-zone','f12-saved-list','imported-sermon-list',
     '#tt-reader .modal-body > div:first-child',
    ].forEach(sel => {
      try { document.querySelector(sel)?.remove(); } catch(e) {}
    });

    /* Remove the original search bar area (it will be replaced) */
    const origSearch = readerBody.querySelector('div:has(#reader-search)') ||
                       readerBody.querySelector('input#reader-search')?.parentElement;

    /* ── 1. Selection bar (sticky) ── */
    const selBar = document.createElement('div');
    selBar.id = 'f13-sel-bar';
    selBar.innerHTML = `
      <span id="f13-sel-count"></span>
      <button class="f13-sb-btn proj"   onclick="f13ProjectSelected()">▶ Project</button>
      <button class="f13-sb-btn"        onclick="f13ScheduleSelected()">📅 Schedule</button>
      <button class="f13-sb-btn nugget" onclick="f13SaveNugget()">⭐ Nugget</button>
      <button class="f13-sb-btn"        onclick="f13ClearSel()">✕ Clear</button>
    `;
    readerBody.insertBefore(selBar, readerBody.firstChild);

    /* ── 2. Search bar ── */
    const searchBar = document.createElement('div');
    searchBar.id = 'f13-search-bar';
    searchBar.innerHTML = `
      <!-- Scope -->
      <div id="f13-scope-row">
        <button class="f13-scope-btn active" id="f13-scope-all"
          onclick="f13SetScope('all')">All Sermons</button>
        <button class="f13-scope-btn" id="f13-scope-cur"
          onclick="f13SetScope('current')">Current Sermon</button>
      </div>

      <!-- Input + search type buttons -->
      <div id="f13-input-row">
        <input id="f13-input" class="sc-input"
          placeholder="Search sermons…"
          onkeydown="if(event.key==='Enter')_f13LastType==='exact'?f13Search(true):f13Search(false)">
        <button class="f13-type-btn f13-any"
          onclick="f13Search(false)" title="Any Word Search — matches if any word appears">
          🔍
        </button>
        <button class="f13-type-btn f13-exact"
          onclick="f13Search(true)" title="Exact Quote Search — matches the exact phrase">
          🔎
        </button>
      </div>

      <!-- Library browse -->
      <div id="f13-library-row">
        <button id="f13-lib-btn" onclick="f13ToggleLibrary()">
          📚 Browse Library
          <span id="f13-lib-count">0</span>
        </button>
        <button class="f13-type-btn" onclick="f13TriggerImport()"
          style="font-size:12px;padding:5px 10px;"
          title="Import sermon file (.txt .pdf .docx .epub .rtf)">
          📄 Import
        </button>
      </div>
    `;
    selBar.insertAdjacentElement('afterend', searchBar);

    /* ── 3. Library panel ── */
    const libPanel = document.createElement('div');
    libPanel.id = 'f13-library-panel';
    libPanel.innerHTML = `
      <div class="f13-lib-header">
        📚 Sermon Library
        <span class="f13-lib-close" onclick="f13ToggleLibrary()">✕</span>
      </div>
      <div class="f13-lib-list" id="f13-lib-list-inner"></div>
    `;
    searchBar.insertAdjacentElement('afterend', libPanel);

    /* ── 4. Search results panel ── */
    const resultsPanel = document.createElement('div');
    resultsPanel.id = 'f13-results';
    resultsPanel.innerHTML = `
      <div class="f13-results-header">
        <span id="f13-results-title" class="f13-results-title"></span>
        <span class="f13-results-close" onclick="f13CloseResults()">✕ Close</span>
      </div>
      <div id="f13-results-list"></div>
    `;
    libPanel.insertAdjacentElement('afterend', resultsPanel);

    _renderLibraryList();
  }

  /* Global functions for search bar controls */
  window._f13LastType = 'any';

  window.f13SetScope = function (scope) {
    _scope = scope;
    document.getElementById('f13-scope-all')?.classList.toggle('active', scope === 'all');
    document.getElementById('f13-scope-cur')?.classList.toggle('active', scope === 'current');
  };

  window.f13Search = function (exact) {
    window._f13LastType = exact ? 'exact' : 'any';
    _doSearch(exact);
  };

  window.f13CloseResults = function () {
    document.getElementById('f13-results')?.classList.remove('open');
    _results = []; _selected.clear(); _updateSelBar();
  };

  window.f13ToggleLibrary = function () {
    const panel = document.getElementById('f13-library-panel');
    if (!panel) return;
    const opening = !panel.classList.contains('open');
    panel.classList.toggle('open', opening);
    if (opening) _renderLibraryList();
  };

  window.f13TriggerImport = function () {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.txt,.pdf,.docx,.doc,.epub,.rtf,.md,.markdown';
    inp.style.display = 'none';
    inp.addEventListener('change', e => {
      /* Delegate to fix12's handler if available */
      if (typeof _handleImportedFile === 'function') {
        _handleImportedFile(e.target.files[0]);
      } else if (typeof f12HandleFile === 'function') {
        f12HandleFile(e.target.files[0]);
      } else {
        if (typeof showSchToast === 'function') showSchToast('Import handler not ready — try again');
      }
      /* Refresh library list after a delay */
      setTimeout(_renderLibraryList, 1500);
    });
    document.body.appendChild(inp); inp.click();
    setTimeout(() => inp.remove(), 15000);
  };


  /* ══════════════════════════════════════════════════════════
     HOOK openTheTable
  ══════════════════════════════════════════════════════════ */

  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    setTimeout(_buildReaderUI, 200);
  };


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  console.info('[BW fix13] ✓ Scope search  ✓ Library panel  ✓ Any/Exact  ✓ Results selection');

})();