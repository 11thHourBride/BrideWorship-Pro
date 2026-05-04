
/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix26.js
   1. Clicking a Bible book hides the main slide stage and
      shows verse cards in that same space inside #slides-view.
      Sidebars stay untouched. Every verse card projects when
      clicked. "← Close" restores normal slides view.
   2. Fixes blank chapter/verse dropdowns in the library.
   3. Bible database import (.json, .txt, plain-text USFM).
═══════════════════════════════════════════════════════════ */

(function BW_fix26() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix26-styles';
  _style.textContent = `

    /* Hide stage when bible-mode is active */
    body.bible-mode .stage       { display: none !important; }
    body.bible-mode .notes-panel { display: none !important; }
    body.bible-mode .queue       { display: none !important; }

    /* Show our verse panel instead */
    body.bible-mode #bv-verse-panel { display: flex !important; }

    /* ── Verse panel lives inside #slides-view ─────────────── */
    #bv-verse-panel {
      display: none;
      flex-direction: column;
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden;
    }

    /* Compact toolbar */
    #bv-bar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 10px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-dim);
      flex-wrap: wrap;
    }
    #bv-close-btn {
      padding: 5px 10px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: none;
      color: var(--text-2);
      font-size: 11px;
      cursor: pointer;
      white-space: nowrap;
      transition: background .1s;
      flex-shrink: 0;
    }
    #bv-close-btn:hover { background: var(--bg-hover); }

    #bv-book-name {
      font-family: 'Arial', serif;
      font-size: 13px;
      letter-spacing: 2px;
      color: var(--gold, #c9a84c);
      text-transform: uppercase;
      flex-shrink: 0;
    }

    /* Book search */
    #bv-book-wrap { position: relative; flex: 1; min-width: 100px; max-width: 180px; }
    #bv-book-inp  { width: 100%; font-size: 11px; }
    #bv-book-drop {
      position: absolute; left: 0; right: 0; top: calc(100% + 3px);
      z-index: 500;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      max-height: 180px; overflow-y: auto;
      box-shadow: 0 6px 20px rgba(0,0,0,.55);
      display: none;
    }
    .bv-drop-item {
      padding: 6px 10px; font-size: 11px; color: var(--text-2);
      cursor: pointer; border-bottom: 1px solid var(--border-dim);
      transition: background .1s;
    }
    .bv-drop-item:last-child { border-bottom: none; }
    .bv-drop-item:hover, .bv-drop-item.hi { background: var(--bg-hover); color: var(--text-1,#e0ddd8); }

    /* Chapter buttons */
    #bv-ch-wrap {
      display: flex; flex-wrap: wrap; gap: 3px;
      flex: 2; min-width: 0;
    }
    .bv-ch-btn {
      min-width: 28px; height: 24px; padding: 0 5px;
      border: 1px solid var(--border-dim);
      border-radius: 3px;
      background: var(--bg-card); color: var(--text-2);
      font-size: 10px; cursor: pointer;
      transition: background .1s, border-color .12s;
    }
    .bv-ch-btn:hover  { background: var(--bg-hover); }
    .bv-ch-btn.active { background: rgba(201,168,76,.15); border-color: var(--gold,#c9a84c); color: var(--gold,#c9a84c); font-weight:700; }

    /* Verse from/to */
    #bv-vs-wrap {
      display: flex; align-items: center; gap: 4px; flex-shrink: 0;
    }
    .bv-vs-lbl { font-size: 10px; color: var(--text-3); white-space: nowrap; }
    .bv-vs-sel { width: 52px; font-size: 11px; padding: 3px 4px; }
    #bv-proj-btn {
      padding: 5px 10px;
      background: var(--gold,#c9a84c); border: none; border-radius: 4px;
      color: #000; font-size: 11px; font-weight:700;
      cursor: pointer; white-space: nowrap; flex-shrink:0;
    }
    #bv-full-btn {
      padding: 5px 8px;
      background: var(--bg-card); border: 1px solid var(--border-dim);
      border-radius: 4px; color: var(--text-2); font-size: 10px;
      cursor: pointer; white-space: nowrap; flex-shrink:0;
    }
    #bv-full-btn:hover { background: var(--bg-hover); }

    /* Verse list */
    #bv-verse-list {
      flex: 1 1 0; min-height: 0;
      overflow-y: auto;
      padding: 6px 8px;
      display: flex; flex-direction: column; gap: 4px;
    }
    #bv-verse-list::-webkit-scrollbar       { width: 3px; }
    #bv-verse-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

    .bv-vc {
      display: flex; align-items: flex-start; gap: 8px;
      padding: 8px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 5px;
      cursor: pointer;
      transition: background .1s, border-color .15s;
    }
    .bv-vc:hover      { background: var(--bg-hover); border-color: rgba(201,168,76,.3); }
    .bv-vc.bv-live    { border-color: var(--green,#4caf7a); background: rgba(76,175,122,.07); }

    .bv-vnum {
      font-family: 'Arial', serif;
      font-size: 10px; letter-spacing: 1.5px;
      color: var(--gold,#c9a84c);
      flex-shrink: 0; min-width: 28px;
      text-align: right; padding-top: 3px;
    }
    .bv-vtext {
      flex: 1; font-size: 17px;
      color: var(--text-1,#e0ddd8);
      line-height: 1.7;
    }
    .bv-vref {
      font-size: 9px; color: var(--text-3);
      letter-spacing: 1px; font-family:'Arial',serif;
      flex-shrink:0; padding-top:3px;
      white-space:nowrap;
    }

    #bv-status {
      padding: 20px; text-align: center;
      font-size: 12px; color: var(--text-3); line-height: 1.7;
    }

    /* Bible import button */
    #bib-import-btn {
      padding: 5px 9px;
      background: var(--bg-card); border: 1px solid var(--border-dim);
      border-radius: 4px; color: var(--text-2); font-size: 11px;
      cursor: pointer; white-space: nowrap;
      transition: background .1s, border-color .15s;
      margin-top: 4px; width: 100%;
    }
    #bib-import-btn:hover { background: var(--bg-hover); border-color: var(--gold-dim); color: var(--gold); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════════════ */
  let _book   = null;   // KJV_BOOKS entry
  let _bookIdx = 0;
  let _ch     = 1;
  let _verses = [];     // [{num, text}]
  let _live   = -1;
  let _dropHi = -1;


  /* ══════════════════════════════════════════════════════════
     BUILD VERSE PANEL (injected into #slides-view once)
  ══════════════════════════════════════════════════════════ */

  function _buildPanel() {
    if (document.getElementById('bv-verse-panel')) return;
    const slidesView = document.getElementById('slides-view');
    if (!slidesView) return;

    const panel = document.createElement('div');
    panel.id = 'bv-verse-panel';
    panel.innerHTML = `
      <div id="bv-bar">
        <button id="bv-close-btn" onclick="bvClose()">← Close</button>
        <span id="bv-book-name">—</span>
        <div id="bv-book-wrap">
          <input id="bv-book-inp" class="sc-input" placeholder="Switch book…"
            autocomplete="off" spellcheck="false"
            oninput="bvBookInput(this.value)"
            onkeydown="bvBookKey(event)">
          <div id="bv-book-drop"></div>
        </div>
        <div id="bv-ch-wrap"></div>
        <div id="bv-vs-wrap">
          <span class="bv-vs-lbl">Vs</span>
          <select id="bv-from" class="bv-vs-sel sc-input" onchange="bvFromChange()"
            onkeydown="if(event.key==='Enter')bvProjectRange()"></select>
          <span class="bv-vs-lbl">–</span>
          <select id="bv-to" class="bv-vs-sel sc-input" onchange="bvToChange()"
            onkeydown="if(event.key==='Enter')bvProjectRange()">
            <option value="">All</option>
          </select>
          <button id="bv-full-btn" onclick="bvLoadChapter(_ch)">Full Ch.</button>
          <button id="bv-proj-btn" onclick="bvProjectRange()">▶ Project</button>
        </div>
      </div>
      <div id="bv-verse-list">
        <div id="bv-status">Select a chapter above.</div>
      </div>
    `;

    /* Append at the END of slides-view so it sits below the other elements
       but is shown/hidden via CSS */
    slidesView.appendChild(panel);
  }


  /* ══════════════════════════════════════════════════════════
     OPEN / CLOSE
  ══════════════════════════════════════════════════════════ */

  window.bvOpen = function (bookIdx) {
    _buildPanel();
    const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
    _book    = books[bookIdx] || null;
    _bookIdx = bookIdx;
    _ch      = 1;
    _verses  = [];
    _live    = -1;
    if (!_book) return;

    /* Switch to slides tab if not already there */
    const slidesTab = document.querySelectorAll('.ctab')[0];
    if (typeof centerTab === 'function') centerTab(slidesTab, 'slides-view');

    /* Enter bible-mode */
    document.body.classList.add('bible-mode');

    /* Populate toolbar */
    const nameEl = document.getElementById('bv-book-name');
    if (nameEl) nameEl.textContent = _book.name;
    const inp = document.getElementById('bv-book-inp');
    if (inp) inp.value = '';

    _buildChBtns();
    _buildVsSelects(1);
    _setStatus(`${_book.name} · ${_book.ch} chapter${_book.ch > 1 ? 's' : ''}. Click a chapter number.`);
  };

  window.bvClose = function () {
    document.body.classList.remove('bible-mode');
    _verses = []; _live = -1;
    /* Restore queue display */
    const q = document.getElementById('queue');
    if (q) q.style.display = '';
    const stage = document.querySelector('.stage');
    if (stage) stage.style.display = '';
  };


  /* ══════════════════════════════════════════════════════════
     CHAPTER BUTTONS
  ══════════════════════════════════════════════════════════ */

  function _buildChBtns() {
    const wrap = document.getElementById('bv-ch-wrap');
    if (!wrap || !_book) return;
    wrap.innerHTML = '';
    for (let c = 1; c <= _book.ch; c++) {
      const btn = document.createElement('button');
      btn.className = 'bv-ch-btn' + (c === _ch ? ' active' : '');
      btn.textContent = c;
      btn.onclick     = () => bvLoadChapter(c);
      wrap.appendChild(btn);
    }
  }

  window.bvLoadChapter = async function (ch) {
    _ch   = ch;
    _live = -1;

    /* Highlight */
    document.querySelectorAll('.bv-ch-btn').forEach((b, i) =>
      b.classList.toggle('active', i + 1 === ch)
    );

    _buildVsSelects(ch);
    _setStatus(`Loading ${_book.name} ${ch}…`);

    try {
      const verses = await loadBibVerses(_book, ch, 1, _maxVs(ch));
      _verses = verses;
      _renderVerses(verses);
    } catch(e) {
      _setStatus('⚠ ' + e.message);
    }
  };

  function _maxVs(ch) {
    if (typeof KJV_VERSES === 'undefined') return 176;
    const c = KJV_VERSES[_book.name];
    return (c && c[ch - 1]) ? c[ch - 1] : 176;
  }


  /* ══════════════════════════════════════════════════════════
     VERSE SELECTS
  ══════════════════════════════════════════════════════════ */

  function _buildVsSelects(ch) {
    const max     = _maxVs(ch);
    const fromSel = document.getElementById('bv-from');
    const toSel   = document.getElementById('bv-to');
    if (!fromSel || !toSel) return;

    fromSel.innerHTML = '';
    toSel.innerHTML   = '<option value="">All</option>';
    for (let v = 1; v <= max; v++) {
      const o1 = document.createElement('option');
      o1.value = v; o1.textContent = v;
      fromSel.appendChild(o1);

      const o2 = document.createElement('option');
      o2.value = v; o2.textContent = v;
      toSel.appendChild(o2);
    }
    fromSel.value = '1';
    toSel.value   = '';
  }

  window.bvFromChange = function () {};
  window.bvToChange   = function () {};


  /* ══════════════════════════════════════════════════════════
     PROJECT
  ══════════════════════════════════════════════════════════ */

  window.bvProjectRange = async function () {
    const from = parseInt(document.getElementById('bv-from')?.value) || 1;
    const toV  = document.getElementById('bv-to')?.value;
    const to   = (toV && parseInt(toV) >= from) ? parseInt(toV) : _maxVs(_ch);

    if (!_verses.length) {
      await bvLoadChapter(_ch);
    }

    const subset = _verses.filter(v => v.num >= from && v.num <= to);
    if (!subset.length) return;

    _pushSlides(subset, 0);
    _highlightLive(subset[0].num - 1);
  };

  window.bvProjectVerse = function (verseNum) {
    const idx = _verses.findIndex(v => v.num === verseNum);
    if (idx < 0) return;
    _pushSlides(_verses, idx);
    _highlightLive(verseNum - 1);
  };

  function _pushSlides(verses, startIdx) {
    S.songIdx = null;
    S.slides  = verses.map(v => ({
      section: `${_book.name} ${_ch}:${v.num}`,
      text:    v.text.trim(),
      version: 'KJV',
    }));
    S.cur = startIdx;
    _live = startIdx;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof push        === 'function') push();
  }


  /* ══════════════════════════════════════════════════════════
     RENDER VERSE LIST
  ══════════════════════════════════════════════════════════ */

  function _renderVerses(verses) {
    const list = document.getElementById('bv-verse-list');
    if (!list) return;
    list.innerHTML = verses.map(v => `
      <div class="bv-vc" id="bv-v${v.num}"
           onclick="bvProjectVerse(${v.num})">
        <div class="bv-vnum">${v.num}</div>
        <div class="bv-vtext">${_esc(v.text)}</div>
        <div class="bv-vref">${_book.name} ${_ch}:${v.num}</div>
      </div>`).join('');
  }

  function _highlightLive(idx) {
    document.querySelectorAll('.bv-vc').forEach((el, i) =>
      el.classList.toggle('bv-live', i === idx)
    );
    /* Scroll into view */
    const el = document.querySelectorAll('.bv-vc')[idx];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function _setStatus(msg) {
    const list = document.getElementById('bv-verse-list');
    if (list) list.innerHTML = `<div id="bv-status">${_esc(msg)}</div>`;
  }


  /* ══════════════════════════════════════════════════════════
     BOOK SEARCH AUTOCOMPLETE
  ══════════════════════════════════════════════════════════ */

  window.bvBookInput = function (val) {
    const drop  = document.getElementById('bv-book-drop');
    if (!val.trim()) { drop.style.display = 'none'; return; }
    const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
    const q     = val.toLowerCase();
    const hits  = books
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => b.name.toLowerCase().includes(q))
      .slice(0, 10);
    if (!hits.length) { drop.style.display = 'none'; return; }
    drop.innerHTML = hits.map(({ b, i }) =>
      `<div class="bv-drop-item" data-idx="${i}"
            onmousedown="bvPickBook(${i})">${_esc(b.name)}</div>`
    ).join('');
    drop.style.display = 'block';
    _dropHi = -1;
  };

  window.bvBookKey = function (e) {
    const drop  = document.getElementById('bv-book-drop');
    const items = drop.querySelectorAll('.bv-drop-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); _dropHi = Math.min(_dropHi+1, items.length-1); _hiDrop(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _dropHi = Math.max(_dropHi-1, 0); _hiDrop(items); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const item = _dropHi >= 0 ? items[_dropHi] : items[0];
      if (item) bvPickBook(parseInt(item.dataset.idx));
    }
    else if (e.key === 'Escape') { drop.style.display = 'none'; }
  };

  function _hiDrop(items) {
    items.forEach((el, i) => el.classList.toggle('hi', i === _dropHi));
  }

  window.bvPickBook = function (idx) {
    document.getElementById('bv-book-drop').style.display = 'none';
    document.getElementById('bv-book-inp').value = '';
    bvOpen(idx);
  };


  /* ══════════════════════════════════════════════════════════
     PATCH buildBibBookGrid — book buttons open bvOpen
  ══════════════════════════════════════════════════════════ */

  const _origGrid = window.buildBibBookGrid;
  window.buildBibBookGrid = function (testament) {
    if (_origGrid) _origGrid(testament);
    setTimeout(() => {
      const grid = document.getElementById('bib-book-grid');
      if (!grid) return;
      const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
      grid.querySelectorAll('.bib-book-btn').forEach(btn => {
        const name = btn.querySelector('.bib-book-name')?.textContent?.trim();
        const idx  = books.findIndex(b => b.name === name);
        if (idx < 0) return;
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        clone.addEventListener('click', () => bvOpen(idx));
      });
    }, 50);
  };


  /* ══════════════════════════════════════════════════════════
     FIX — BLANK CHAPTER/VERSE DROPDOWNS
  ══════════════════════════════════════════════════════════ */

  function _fixDropdowns() {
    const chSel = document.getElementById('bib-ch');
    if (chSel && chSel.options.length === 0) {
      if (typeof onBibBookChange === 'function') onBibBookChange();
    }
    const grid = document.getElementById('bib-book-grid');
    if (grid && !grid.children.length) {
      if (typeof buildBibBookGrid === 'function') buildBibBookGrid('OT');
    }
  }

  /* Patch libTab + topTab to trigger fix */
  const _origLibTab = window.libTab;
  window.libTab = function (btn, sectionId) {
    if (_origLibTab) _origLibTab(btn, sectionId);
    if (sectionId === 'ls-scripture') setTimeout(_fixDropdowns, 80);
  };
  const _origTopTab = window.topTab;
  window.topTab = function (btn) {
    if (_origTopTab) _origTopTab(btn);
    if (btn?.getAttribute('data-lib') === 'ls-scripture') setTimeout(_fixDropdowns, 80);
  };


  /* ══════════════════════════════════════════════════════════
     BIBLE DATABASE IMPORT
  ══════════════════════════════════════════════════════════ */

  /* Storage for imported Bibles */
  const BIB_KEY = 'bw_custom_bibles';

  function _loadCustomBibles() {
    try { return JSON.parse(localStorage.getItem(BIB_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function _addImportBtn() {
    /* Add an import button to the bible navigator area */
    const versionBar = document.querySelector('.bible-version-bar');
    if (!versionBar || document.getElementById('bib-import-btn')) return;
    const btn = document.createElement('button');
    btn.id        = 'bib-import-btn';
    btn.className = 'lib-icon-btn';
    btn.textContent = '⬆ Import Bible';
    btn.title     = 'Import a Bible database (.json, .txt)';
    btn.addEventListener('click', _triggerBibleImport);
    versionBar.insertAdjacentElement('afterend', btn);
  }

  function _triggerBibleImport() {
    const inp = document.createElement('input');
    inp.type    = 'file';
    inp.accept  = '.json,.txt,.usfm,.xml';
    inp.style.display = 'none';
    inp.addEventListener('change', e => _handleBibleFile(e.target.files[0]));
    document.body.appendChild(inp); inp.click();
    setTimeout(() => inp.remove(), 12000);
  }

  async function _handleBibleFile(file) {
    if (!file) return;
    if (typeof showSchToast === 'function') showSchToast('⏳ Parsing ' + file.name + '…');
    try {
      const text = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload  = e => res(e.target.result);
        r.onerror = () => rej(new Error('Could not read file'));
        r.readAsText(file, 'UTF-8');
      });

      const ext  = file.name.split('.').pop().toLowerCase();
      let   bible = null;

      if (ext === 'json') {
        bible = _parseBibleJSON(text);
      } else {
        bible = _parseBiblePlainText(text, file.name);
      }

      if (!bible) throw new Error('Unrecognised Bible format');

      /* Save */
      const list = _loadCustomBibles();
      const existing = list.findIndex(b => b.name === bible.name);
      if (existing >= 0) list[existing] = bible; else list.push(bible);
      try { localStorage.setItem(BIB_KEY, JSON.stringify(list)); } catch(e) {
        throw new Error('Storage full — try a smaller Bible file');
      }

      /* Add to version selector */
      _addBibleToVersionSel(bible);

      if (typeof showSchToast === 'function')
        showSchToast(`✓ "${bible.name}" imported — ${Object.keys(bible.books).length} books`);
    } catch(err) {
      if (typeof showSchToast === 'function') showSchToast('⚠ ' + err.message);
      console.error('[BW Bible Import]', err);
    }
  }

  /* Parse JSON format:
     { name:"NIV", books:{ "Genesis":{ "1":[null,"verse1","verse2",...] } } }
     or array-of-books OpenBible-style */
  function _parseBibleJSON(text) {
    const data = JSON.parse(text);
    if (data.name && data.books) return data;

    /* Try OpenBible / osis2mod array format */
    if (Array.isArray(data)) {
      const books = {};
      data.forEach(entry => {
        if (!entry.book || !entry.chapter || !entry.verse || !entry.text) return;
        const b = entry.book;
        const c = String(entry.chapter);
        if (!books[b]) books[b] = {};
        if (!books[b][c]) books[b][c] = [null];
        while (books[b][c].length <= parseInt(entry.verse)) books[b][c].push('');
        books[b][c][parseInt(entry.verse)] = entry.text;
      });
      return { name: data[0]?.translation || 'Custom', books };
    }
    return null;
  }

  /* Parse plain-text format:
     Genesis 1:1 In the beginning...
     Genesis 1:2 And the earth... */
  function _parseBiblePlainText(text, filename) {
    const lines = text.split('\n');
    const books = {};
    const re    = /^(.+?)\s+(\d+):(\d+)\s+(.+)$/;
    let   count = 0;
    lines.forEach(line => {
      const m = re.exec(line.trim());
      if (!m) return;
      const [, book, ch, vs, content] = m;
      if (!books[book]) books[book] = {};
      if (!books[book][ch]) books[book][ch] = [null];
      while (books[book][ch].length <= parseInt(vs)) books[book][ch].push('');
      books[book][ch][parseInt(vs)] = content.trim();
      count++;
    });
    if (!count) return null;
    const name = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    return { name, books };
  }

  function _addBibleToVersionSel(bible) {
    ['bible-version-sel', 'bv-version'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      if (Array.from(sel.options).some(o => o.value === bible.name)) return;
      const opt = document.createElement('option');
      opt.value = bible.name; opt.textContent = bible.name;
      sel.appendChild(opt);
    });
  }

  /* Restore imported Bibles into selectors on load */
  function _restoreCustomBibles() {
    _loadCustomBibles().forEach(_addBibleToVersionSel);
  }


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */

  function _esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    _fixDropdowns();
    _addImportBtn();
    _restoreCustomBibles();
    /* Pre-build the panel so it's ready */
    setTimeout(() => {
      _buildPanel();
      /* Re-wire book grid if already rendered */
      const grid = document.getElementById('bib-book-grid');
      if (grid && grid.children.length) {
        if (typeof buildBibBookGrid === 'function') {
          const active = document.querySelector('.btt.on')?.textContent;
          const t = active?.includes('New') ? 'NT' : active?.includes('Fav') ? 'FAV' : 'OT';
          buildBibBookGrid(t);
        }
      }
    }, 500);

    console.info('[BW fix26] ✓ Verse panel  ✓ Dropdown fix  ✓ Bible import');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { setTimeout(boot, 400); }

})();


