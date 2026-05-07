/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix26.js
   Complete Bible viewer upgrade:
   1. Ch input (type chapter) + Vs-From / Vs-To inputs with
      Space to jump field-to-field, Enter to project.
   2. Book abbreviation resolver: Gen→Genesis instantly.
      Space / Enter from book field jumps to Ch input.
   3. Ctrl+E opens book switcher from anywhere in the app.
   4. Word/phrase search moved below book switcher, Ctrl+G.
   5. Green highlight follows the live slide as user navigates.
   6. "Add to Schedule" button beside ▶ Project.
═══════════════════════════════════════════════════════════ */

(function BW_fix26() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     BOOK ABBREVIATIONS
  ══════════════════════════════════════════════════════════ */
  const ABBREV = {
    gen:'Genesis', ge:'Genesis', gn:'Genesis',
    ex:'Exodus', exo:'Exodus', exod:'Exodus',
    lev:'Leviticus', le:'Leviticus', lv:'Leviticus',
    num:'Numbers', nu:'Numbers', nm:'Numbers',
    deu:'Deuteronomy', deut:'Deuteronomy', dt:'Deuteronomy', de:'Deuteronomy',
    jos:'Joshua', josh:'Joshua',
    jdg:'Judges', judg:'Judges', jg:'Judges',
    rut:'Ruth', ru:'Ruth',
    '1sa':'1 Samuel', '1sam':'1 Samuel',
    '2sa':'2 Samuel', '2sam':'2 Samuel',
    '1ki':'1 Kings', '1kgs':'1 Kings',
    '2ki':'2 Kings', '2kgs':'2 Kings',
    '1ch':'1 Chronicles', '1chr':'1 Chronicles',
    '2ch':'2 Chronicles', '2chr':'2 Chronicles',
    ezr:'Ezra', neh:'Nehemiah', est:'Esther', esth:'Esther',
    jb:'Job', job:'Job',
    ps:'Psalms', psa:'Psalms', psalm:'Psalms', pss:'Psalms',
    pro:'Proverbs', prov:'Proverbs', pr:'Proverbs',
    ecc:'Ecclesiastes', eccl:'Ecclesiastes', ec:'Ecclesiastes',
    song:'Song of Solomon', sos:'Song of Solomon', ss:'Song of Solomon',
    isa:'Isaiah', is:'Isaiah',
    jer:'Jeremiah', je:'Jeremiah',
    lam:'Lamentations', la:'Lamentations',
    eze:'Ezekiel', ezek:'Ezekiel',
    dan:'Daniel', da:'Daniel', dn:'Daniel',
    hos:'Hosea', ho:'Hosea',
    jl:'Joel', joel:'Joel',
    am:'Amos', amos:'Amos',
    ob:'Obadiah', obad:'Obadiah',
    jon:'Jonah', jnh:'Jonah',
    mic:'Micah', mi:'Micah',
    nah:'Nahum', na:'Nahum',
    hab:'Habakkuk', hb:'Habakkuk',
    zep:'Zephaniah', zeph:'Zephaniah',
    hag:'Haggai', hg:'Haggai',
    zec:'Zechariah', zech:'Zechariah',
    mal:'Malachi', ml:'Malachi',
    mat:'Matthew', matt:'Matthew', mt:'Matthew',
    mk:'Mark', mar:'Mark',
    lk:'Luke', luk:'Luke',
    jn:'John', joh:'John',
    act:'Acts', ac:'Acts',
    rom:'Romans', ro:'Romans', rm:'Romans',
    '1co':'1 Corinthians', '1cor':'1 Corinthians',
    '2co':'2 Corinthians', '2cor':'2 Corinthians',
    gal:'Galatians', ga:'Galatians',
    eph:'Ephesians',
    php:'Philippians', phil:'Philippians',
    col:'Colossians',
    '1th':'1 Thessalonians', '1thes':'1 Thessalonians',
    '2th':'2 Thessalonians', '2thes':'2 Thessalonians',
    '1ti':'1 Timothy', '1tim':'1 Timothy',
    '2ti':'2 Timothy', '2tim':'2 Timothy',
    tit:'Titus', ti:'Titus',
    phm:'Philemon', phlm:'Philemon',
    heb:'Hebrews', he:'Hebrews',
    jas:'James', jm:'James',
    '1pe':'1 Peter', '1pet':'1 Peter',
    '2pe':'2 Peter', '2pet':'2 Peter',
    '1jn':'1 John', '1jo':'1 John',
    '2jn':'2 John', '3jn':'3 John',
    jude:'Jude', jud:'Jude',
    rev:'Revelation', re:'Revelation',
  };

  function resolveBook(raw) {
    const q   = raw.trim().toLowerCase().replace(/\s+/g, '');
    /* Try abbreviation map */
    if (ABBREV[q]) return ABBREV[q];
    /* Try KJV_BOOKS direct match or starts-with */
    if (typeof KJV_BOOKS === 'undefined') return raw;
    const exact = KJV_BOOKS.find(b => b.name.toLowerCase() === raw.trim().toLowerCase());
    if (exact) return exact.name;
    const starts = KJV_BOOKS.find(b =>
      b.name.toLowerCase().startsWith(raw.trim().toLowerCase()) ||
      b.name.toLowerCase().replace(/\s/g,'').startsWith(q)
    );
    return starts ? starts.name : raw.trim();
  }

  function bookIdx(name) {
    if (typeof KJV_BOOKS === 'undefined') return -1;
    return KJV_BOOKS.findIndex(b => b.name === name);
  }

  function maxVs(bookName, ch) {
    if (typeof KJV_VERSES === 'undefined') return 176;
    const c = KJV_VERSES[bookName];
    return (c && c[ch - 1]) ? c[ch - 1] : 176;
  }

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix26-styles';
  _style.textContent = `
    body.bible-mode .stage       { display: none !important; }
    body.bible-mode .notes-panel { display: none !important; }
    body.bible-mode .queue       { display: none !important; }
    body.bible-mode #bv-verse-panel { display: flex !important; }

    #bv-verse-panel {
      display: none; flex-direction: column;
      flex: 1 1 0; min-height: 0; overflow: hidden;
    }

    /* ── Top bar ── */
    #bv-bar {
      flex-shrink: 0;
      display: flex; flex-direction: column;
      gap: 0;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-dim);
    }

    /* Row 1: close + book + ch + vs + action buttons */
    #bv-row1 {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 10px; flex-wrap: wrap;
    }

    #bv-close-btn {
      padding: 5px 9px; border: 1px solid var(--border-dim);
      border-radius: 4px; background: none; color: var(--text-2);
      font-size: 11px; cursor: pointer; white-space: nowrap;
      transition: background .1s; flex-shrink: 0;
    }
    #bv-close-btn:hover { background: var(--bg-hover); }

    /* Book input */
    #bv-book-wrap { position: relative; flex: 0 0 auto; }
    #bv-book-inp {
      font-size: 13px !important;
      font-family: 'Cinzel', serif !important;
      color: var(--gold, #c9a84c) !important;
      width: 160px; font-weight: 700;
      letter-spacing: 1px;
    }
    #bv-book-inp::placeholder { color: var(--text-3); font-size: 11px; font-weight: 400; }

    #bv-book-drop {
      position: absolute; left: 0; top: calc(100% + 3px);
      min-width: 180px; z-index: 600;
      background: var(--bg-card); border: 1px solid var(--border-dim);
      border-radius: 5px; max-height: 200px; overflow-y: auto;
      box-shadow: 0 6px 20px rgba(0,0,0,.55); display: none;
    }
    .bv-drop-item {
      padding: 7px 12px; font-size: 12px; color: var(--text-2);
      cursor: pointer; border-bottom: 1px solid var(--border-dim);
      transition: background .1s;
    }
    .bv-drop-item:last-child { border-bottom: none; }
    .bv-drop-item:hover, .bv-drop-item.hi {
      background: var(--bg-hover); color: var(--gold, #c9a84c);
    }

    /* Ch / Vs fields */
    .bv-field-grp {
      display: flex; align-items: center; gap: 4px; flex-shrink: 0;
    }
    .bv-field-lbl {
      font-size: 10px; color: var(--text-3); white-space: nowrap;
      font-family: 'Cinzel', serif; letter-spacing: 1px;
    }
    .bv-num-inp {
      width: 52px; text-align: center;
      font-size: 14px !important;
      padding: 5px 4px !important;
      font-family: 'Cinzel', serif !important;
      font-weight: 700 !important;
      color: var(--text-1, #e0ddd8) !important;
    }
    .bv-num-inp:focus { border-color: var(--gold, #c9a84c) !important; }

    .bv-sep { color: var(--text-3); font-size: 13px; flex-shrink: 0; }

    /* Action buttons */
    #bv-proj-btn {
      padding: 6px 12px; background: var(--gold,#c9a84c); border: none;
      border-radius: 4px; color: #000; font-size: 11px; font-weight: 700;
      font-family: 'Cinzel', serif; letter-spacing: 1px;
      cursor: pointer; white-space: nowrap; flex-shrink: 0;
    }
    #bv-proj-btn:hover { opacity: .85; }

    #bv-sch-btn {
      padding: 6px 10px; background: var(--bg-card);
      border: 1px solid var(--border-dim); border-radius: 4px;
      color: var(--text-2); font-size: 11px; cursor: pointer;
      white-space: nowrap; flex-shrink: 0; transition: background .1s, border-color .15s;
    }
    #bv-sch-btn:hover { background: var(--bg-hover); border-color: var(--gold-dim); color: var(--gold); }

    /* Row 2: word search */
    #bv-row2 {
      display: flex; align-items: center; gap: 5px;
      padding: 5px 10px;
      border-top: 1px solid var(--border-dim);
    }
    #bv-word-inp {
      flex: 1; font-size: 12px !important;
    }
    #bv-word-inp::placeholder { font-size: 11px; }
    #bv-word-search-btn {
      padding: 5px 10px; background: var(--bg-card);
      border: 1px solid var(--border-dim); border-radius: 4px;
      color: var(--text-2); font-size: 11px; cursor: pointer;
      white-space: nowrap; transition: background .1s;
    }
    #bv-word-search-btn:hover { background: var(--bg-hover); }
    #bv-word-exact-btn {
      padding: 5px 9px; background: var(--bg-card);
      border: 1px solid var(--border-dim); border-radius: 4px;
      color: var(--text-2); font-size: 13px; cursor: pointer;
      transition: background .1s;
    }
    #bv-word-exact-btn:hover { background: var(--bg-hover); }

    /* Verse list */
    #bv-verse-list {
      flex: 1 1 0; min-height: 0;
      overflow-y: auto; padding: 6px 8px;
      display: flex; flex-direction: column; gap: 4px;
      scroll-behavior: smooth;
    }
    #bv-verse-list::-webkit-scrollbar       { width: 3px; }
    #bv-verse-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

    .bv-vc {
      display: flex; align-items: flex-start; gap: 8px;
      padding: 9px 12px; border-radius: 5px;
      background: var(--bg-card); border: 1px solid var(--border-dim);
      cursor: pointer; transition: background .1s, border-color .15s, box-shadow .15s;
    }
    .bv-vc:hover { background: var(--bg-hover); border-color: rgba(201,168,76,.3); }
    .bv-vc.bv-live {
      border-color: var(--green, #4caf7a) !important;
      background: rgba(76,175,122,.07) !important;
      box-shadow: 0 0 0 1px var(--green, #4caf7a);
    }
    .bv-vc.bv-queued {
      border-color: rgba(201,168,76,.4);
      background: rgba(201,168,76,.04);
    }

    .bv-vnum {
      font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 1.5px;
      color: var(--gold, #c9a84c); flex-shrink: 0; min-width: 26px;
      text-align: right; padding-top: 4px;
    }
    .bv-vtext { flex: 1; font-size: 25px; color: var(--text-1,#e0ddd8); line-height: 1.7; }
    .bv-vref  { font-size: 9px; color: var(--text-3); font-family:'Cinzel',serif; flex-shrink:0; padding-top:4px; white-space:nowrap; }

    #bv-status { padding: 20px; text-align: center; font-size: 12px; color: var(--text-3); line-height: 1.7; }

    /* Keyboard hint strip */
    #bv-hints {
      flex-shrink: 0; padding: 3px 10px;
      background: rgba(201,168,76,.04);
      border-top: 1px solid var(--border-dim);
      font-size: 9px; color: var(--text-3);
      display: flex; gap: 12px; flex-wrap: wrap;
    }
    .bv-hint kbd {
      background: var(--bg-card); border: 1px solid var(--border-dim);
      border-radius: 3px; padding: 0 4px; font-size: 9px;
      font-family: monospace; color: var(--text-2);
    }

    /* Word search results inside verse list */
    .bv-search-result {
      border-color: rgba(74,144,217,.4) !important;
      background: rgba(74,144,217,.05) !important;
    }
    .bv-search-result .bv-vtext mark {
      background: rgba(201,168,76,.28);
      color: var(--gold, #c9a84c);
      border-radius: 2px; padding: 0 1px;
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
  let _book     = null;
  let _bookIdx  = -1;
  let _ch       = 1;
  let _verses   = [];    /* all verses in current chapter */
  let _slides   = [];    /* currently projected slide set */
  let _liveIdx  = -1;    /* index in _slides of live slide */
  let _dropHi   = -1;
  let _bvReady  = false;


  /* ══════════════════════════════════════════════════════════
     BUILD PANEL
  ══════════════════════════════════════════════════════════ */

  function _buildPanel() {
    if (document.getElementById('bv-verse-panel')) { _bvReady = true; return; }
    const sv = document.getElementById('slides-view');
    if (!sv) return;

    const panel = document.createElement('div');
    panel.id = 'bv-verse-panel';
    panel.innerHTML = `
      <div id="bv-bar">

        <!-- Row 1: navigation controls -->
        <div id="bv-row1">
          <button id="bv-close-btn" onclick="bvClose()">← Close</button>

          <!-- Book input with autocomplete -->
          <div id="bv-book-wrap">
            <input id="bv-book-inp" class="sc-input" placeholder="Book (e.g. Gen, Jn)…"
              autocomplete="off" spellcheck="false"
              oninput="bvBookInput(this.value)"
              onkeydown="bvBookKey(event)">
            <div id="bv-book-drop"></div>
          </div>

          <!-- Chapter -->
          <div class="bv-field-grp">
            <span class="bv-field-lbl">Ch</span>
            <input id="bv-ch-inp" class="sc-input bv-num-inp" type="number"
              min="1" value="1" placeholder="1"
              onkeydown="bvChKey(event)"
              onfocus="this.select()">
          </div>

          <span class="bv-sep">:</span>

          <!-- Verse From -->
          <div class="bv-field-grp">
            <span class="bv-field-lbl">Vs</span>
            <input id="bv-vs-from" class="sc-input bv-num-inp" type="number"
              min="1" value="1" placeholder="1"
              onkeydown="bvVsFromKey(event)"
              onfocus="this.select()">
          </div>

          <!-- Verse To (optional) -->
          <div class="bv-field-grp">
            <span class="bv-field-lbl" style="color:var(--text-3);">–</span>
            <input id="bv-vs-to" class="sc-input bv-num-inp" type="number"
              min="1" placeholder="end"
              style="color:var(--text-3);"
              onkeydown="bvVsToKey(event)"
              onfocus="this.select()">
          </div>

          <!-- Action buttons -->
          <button id="bv-proj-btn" onclick="bvProject()">▶ Project</button>
          <button id="bv-sch-btn"  onclick="bvAddToSchedule()">📅 Schedule</button>
        </div>

        <!-- Row 2: word search -->
        <div id="bv-row2">
          <input id="bv-word-inp" class="sc-input bv-word-inp"
            placeholder="Search any word or phrase in Bible… (Ctrl+G)"
            onkeydown="bvWordKey(event)">
          <button id="bv-word-search-btn" onclick="bvWordSearch(false)">🔍 Any</button>
          <button id="bv-word-exact-btn"  onclick="bvWordSearch(true)" title="Exact phrase">🔎</button>
        </div>
      </div>

      <!-- Hint strip -->
      <div id="bv-hints">
        <span class="bv-hint"><kbd>Space</kbd> next field</span>
        <span class="bv-hint"><kbd>Enter</kbd> project</span>
        <span class="bv-hint"><kbd>Ctrl+E</kbd> switch book</span>
        <span class="bv-hint"><kbd>Ctrl+G</kbd> word search</span>
        <span class="bv-hint"><kbd>←/→</kbd> prev/next slide</span>
      </div>

      <!-- Verse cards -->
      <div id="bv-verse-list">
        <div id="bv-status">Type a book name and chapter to begin.</div>
      </div>
    `;
    sv.appendChild(panel);
    _bvReady = true;
  }


  /* ══════════════════════════════════════════════════════════
     OPEN / CLOSE
  ══════════════════════════════════════════════════════════ */

  window.bvOpen = function (bi) {
    _buildPanel();
    const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
    _book    = books[bi] || null;
    _bookIdx = bi;
    _ch      = 1; _verses = []; _slides = []; _liveIdx = -1;
    if (!_book) return;

    /* Switch to slides tab */
    const tab = document.querySelectorAll('.ctab')[0];
    if (typeof centerTab === 'function') centerTab(tab, 'slides-view');

    document.body.classList.add('bible-mode');

    /* Populate book input */
    const bi2 = document.getElementById('bv-book-inp');
    if (bi2) bi2.value = _book.name;

    /* Reset ch/vs */
    const chi = document.getElementById('bv-ch-inp');
    const vf  = document.getElementById('bv-vs-from');
    const vt  = document.getElementById('bv-vs-to');
    if (chi) { chi.max = _book.ch; chi.value = '1'; }
    if (vf)  { vf.max  = maxVs(_book.name, 1); vf.value = '1'; }
    if (vt)  { vt.value = ''; }

    _setStatus(`${_book.name} · ${_book.ch} chapter${_book.ch > 1 ? 's' : ''}. Press Enter or click ▶ Project.`);
    setTimeout(() => document.getElementById('bv-ch-inp')?.focus(), 80);
  };

  window.bvClose = function () {
    document.body.classList.remove('bible-mode');
    _verses = []; _slides = []; _liveIdx = -1;
  };


  /* ══════════════════════════════════════════════════════════
     BOOK INPUT — abbreviation resolver + autocomplete
  ══════════════════════════════════════════════════════════ */

  window.bvBookInput = function (val) {
    const drop  = document.getElementById('bv-book-drop');
    if (!val.trim()) { drop.style.display = 'none'; return; }
    const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
    const q     = val.toLowerCase();
    const hits  = books
      .map((b, i) => ({ b, i }))
      .filter(({ b }) =>
        b.name.toLowerCase().startsWith(q) ||
        b.name.toLowerCase().replace(/\s/g,'').startsWith(q.replace(/\s/g,'')) ||
        b.name.toLowerCase().includes(q)
      )
      .slice(0, 10);
    if (!hits.length) { drop.style.display = 'none'; return; }
    drop.innerHTML = hits.map(({ b, i }) =>
      `<div class="bv-drop-item" data-bi="${i}" onmousedown="bvPickBook(${i})">${_esc(b.name)}</div>`
    ).join('');
    drop.style.display = 'block';
    _dropHi = -1;
  };

  window.bvBookKey = function (e) {
    const drop  = document.getElementById('bv-book-drop');
    const items = drop.querySelectorAll('.bv-drop-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault(); _dropHi = Math.min(_dropHi + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('hi', i === _dropHi)); return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault(); _dropHi = Math.max(_dropHi - 1, 0);
      items.forEach((el, i) => el.classList.toggle('hi', i === _dropHi)); return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const inp = document.getElementById('bv-book-inp');
      const raw = inp?.value.trim() || '';

      /* Resolve via highlighted drop item, abbreviation, or starts-with */
      let resolved = '';
      if (_dropHi >= 0 && items[_dropHi]) {
        resolved = items[_dropHi].textContent.trim();
        const bi = parseInt(items[_dropHi].dataset.bi);
        bvPickBook(bi, false); // don't move focus yet
      } else if (items.length === 1) {
        resolved = items[0].textContent.trim();
        bvPickBook(parseInt(items[0].dataset.bi), false);
      } else {
        resolved = resolveBook(raw);
        const bi2 = bookIdx(resolved);
        if (bi2 >= 0) { bvPickBook(bi2, false); }
        else if (inp) { inp.value = resolved; drop.style.display = 'none'; }
      }

      /* Jump to chapter input */
      setTimeout(() => {
        const chi = document.getElementById('bv-ch-inp');
        if (chi) { chi.focus(); chi.select(); }
      }, 30);
      return;
    }

    if (e.key === 'Escape') { drop.style.display = 'none'; }
  };

  window.bvPickBook = function (bi, moveFocus = true) {
    const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
    _book = books[bi] || null; _bookIdx = bi;
    if (!_book) return;
    const drop = document.getElementById('bv-book-drop');
    if (drop) drop.style.display = 'none';
    const inp = document.getElementById('bv-book-inp');
    if (inp) inp.value = _book.name;
    const chi = document.getElementById('bv-ch-inp');
    if (chi) { chi.max = _book.ch; chi.value = '1'; }
    _ch = 1;
    _updateMaxVs(1);
    _setStatus(`${_book.name} · ${_book.ch} chapter${_book.ch > 1 ? 's' : ''}.`);
    if (moveFocus) setTimeout(() => { const c = document.getElementById('bv-ch-inp'); c?.focus(); c?.select(); }, 30);
  };


  /* ══════════════════════════════════════════════════════════
     CHAPTER INPUT KEY HANDLER
  ══════════════════════════════════════════════════════════ */

  window.bvChKey = function (e) {
    if (e.key === ' ') {
      e.preventDefault();
      /* Update ch + max verse, then jump to Vs From */
      const v = parseInt(document.getElementById('bv-ch-inp')?.value) || 1;
      _ch = v;
      _updateMaxVs(v);
      const vf = document.getElementById('bv-vs-from');
      if (vf) { vf.focus(); vf.select(); }
    } else if (e.key === 'Enter') {
      e.preventDefault(); bvProject();
    }
  };

  function _updateMaxVs(ch) {
    if (!_book) return;
    const m  = maxVs(_book.name, ch);
    const vf = document.getElementById('bv-vs-from');
    const vt = document.getElementById('bv-vs-to');
    if (vf) vf.max = m;
    if (vt) vt.max = m;
  }


  /* ══════════════════════════════════════════════════════════
     VERSE FROM / TO KEY HANDLERS
  ══════════════════════════════════════════════════════════ */

  window.bvVsFromKey = function (e) {
    if (e.key === ' ') {
      e.preventDefault();
      const vt = document.getElementById('bv-vs-to');
      if (vt) { vt.focus(); vt.select(); }
    } else if (e.key === 'Enter') {
      e.preventDefault(); bvProject();
    }
  };

  window.bvVsToKey = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); bvProject(); }
  };


  /* ══════════════════════════════════════════════════════════
     PROJECT
  ══════════════════════════════════════════════════════════ */

  window.bvProject = async function () {
    if (!_book) return;
    const ch   = parseInt(document.getElementById('bv-ch-inp')?.value)   || 1;
    const from = parseInt(document.getElementById('bv-vs-from')?.value)  || 1;
    const toV  = document.getElementById('bv-vs-to')?.value;
    const to   = (toV && parseInt(toV) >= from) ? parseInt(toV) : null;
    _ch = ch;

    /* Load chapter if needed */
    if (!_verses.length || _verses[0]?._ch !== ch) {
      _setStatus(`Loading ${_book.name} ${ch}…`);
      try {
        const all = await loadBibVerses(_book, ch, 1, maxVs(_book.name, ch));
        _verses = all.map(v => ({ ...v, _ch: ch }));
        _renderVerses(_verses, from, to);
      } catch(err) { _setStatus('⚠ ' + err.message); return; }
    } else {
      _renderVerses(_verses, from, to);
    }

    /* Build slide set */
    const subset = _verses.filter(v => v.num >= from && (!to || v.num <= to));
    if (!subset.length) return;

    _slides = subset.map(v => ({
      section: `${_book.name} ${ch}:${v.num}`,
      text:    v.text.trim(),
      version: 'KJV',
    }));
    _liveIdx = 0;

    S.songIdx = null;
    S.slides  = _slides;
    S.cur     = 0;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof push        === 'function') push();

    _syncHighlight();
  };

  window.bvProjectVerse = function (num) {
    if (!_verses.length) return;
    const idx = _verses.findIndex(v => v.num === num);
    if (idx < 0) return;
    const slide = {
      section: `${_book.name} ${_ch}:${num}`,
      text:    _verses[idx].text.trim(),
      version: 'KJV',
    };
    /* Inject as current slide */
    S.songIdx = null;
    if (!_slides.length) {
      S.slides = [slide]; S.cur = 0; _slides = [slide]; _liveIdx = 0;
    } else {
      S.cur = _slides.findIndex(s => s.section === slide.section);
      if (S.cur < 0) { S.cur = 0; }
      _liveIdx = S.cur;
    }
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof push        === 'function') push();
    _syncHighlight();
  };

  /* ══════════════════════════════════════════════════════════
     ADD TO SCHEDULE
  ══════════════════════════════════════════════════════════ */

  window.bvAddToSchedule = async function () {
    if (!_book) return;
    const ch   = parseInt(document.getElementById('bv-ch-inp')?.value) || 1;
    const from = parseInt(document.getElementById('bv-vs-from')?.value) || 1;
    const toV  = document.getElementById('bv-vs-to')?.value;
    const to   = (toV && parseInt(toV) >= from) ? parseInt(toV) : from;

    /* Ensure verses loaded */
    if (!_verses.length) await bvProject();

    const subset = _verses.filter(v => v.num >= from && v.num <= to);
    if (!subset.length) return;

    const label   = `${_book.name} ${ch}:${from}${to > from ? '-' + to : ''}`;
    const content = subset.map(v =>
      `[${_book.name} ${ch}:${v.num}]\n${v.text.trim()}`
    ).join('\n\n');

    if (typeof schInsertFromLibrary === 'function') {
      schInsertFromLibrary({ type:'scripture', label, content, notes:'', duration:1 }, -1);
    } else if (Array.isArray(S?.so)) {
      S.so.push({ name:label, type:'scripture', content });
      if (typeof renderSO === 'function') renderSO();
    }
    if (typeof showSchToast === 'function') showSchToast(`📅 "${label}" added to Schedule`);
  };


  /* ══════════════════════════════════════════════════════════
     RENDER VERSES
  ══════════════════════════════════════════════════════════ */

  function _renderVerses(verses, highlightFrom, highlightTo) {
    const list = document.getElementById('bv-verse-list');
    if (!list) return;

    const from = highlightFrom || 1;
    const to   = highlightTo || null;

    list.innerHTML = verses.map(v => {
      const inRange = v.num >= from && (!to || v.num <= to);
      return `
        <div class="bv-vc ${inRange ? 'bv-queued' : ''}" id="bv-v${v.num}"
             onclick="bvProjectVerse(${v.num})">
          <div class="bv-vnum">${v.num}</div>
          <div class="bv-vtext">${_esc(v.text)}</div>
          <div class="bv-vref">${_book?.name || ''} ${_ch}:${v.num}</div>
        </div>`;
    }).join('');

    /* Scroll to first highlighted verse */
    setTimeout(() => {
      const el = document.getElementById('bv-v' + from);
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 60);
  }

  /* Sync green highlight with the currently live slide */
  function _syncHighlight() {
    document.querySelectorAll('.bv-vc').forEach(el => el.classList.remove('bv-live'));
    if (!_slides.length || _liveIdx < 0) return;
    const sl  = _slides[S.cur] || _slides[_liveIdx];
    if (!sl) return;
    /* Extract verse number from section e.g. "John 3:16" */
    const m   = sl.section?.match(/:(\d+)$/);
    if (!m) return;
    const num = parseInt(m[1]);
    const el  = document.getElementById('bv-v' + num);
    if (!el) return;
    el.classList.add('bv-live');
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* Hook renderSlide so highlight updates when user presses ← → */
  const _origRS = window.renderSlide;
  window.renderSlide = function () {
    if (_origRS) _origRS();
    if (document.body.classList.contains('bible-mode')) {
      requestAnimationFrame(_syncHighlight);
    }
  };

  function _setStatus(msg) {
    const list = document.getElementById('bv-verse-list');
    if (list) list.innerHTML = `<div id="bv-status">${_esc(msg)}</div>`;
  }


  /* ══════════════════════════════════════════════════════════
     WORD SEARCH (Ctrl+G)
  ══════════════════════════════════════════════════════════ */

  window.bvWordSearch = async function (exact) {
    const inp = document.getElementById('bv-word-inp');
    const q   = inp?.value.trim() || '';
    if (!q) { inp?.focus(); return; }

    _setStatus('Searching…');

    /* Search across the loaded chapter first, then SCRIPTURE_DB */
    const hits = [];
    const term = q.toLowerCase();

    const matches = (text) => exact
      ? text.toLowerCase().includes(term)
      : term.split(/\s+/).every(w => text.toLowerCase().includes(w));

    /* Search loaded verses */
    if (_verses.length) {
      _verses.forEach(v => {
        if (matches(v.text)) hits.push({ book: _book?.name || '', ch: _ch, num: v.num, text: v.text });
      });
    }

    /* Search SCRIPTURE_DB */
    if (typeof SCRIPTURE_DB !== 'undefined') {
      Object.entries(SCRIPTURE_DB).forEach(([ref, text]) => {
        if (matches(text) && !hits.some(h => `${h.book} ${h.ch}:${h.num}` === ref)) {
          /* Parse ref: "john 3:16" */
          const m = ref.match(/^(.+?)\s+(\d+):(\d+)/i);
          if (m) hits.push({ book: m[1], ch: parseInt(m[2]), num: parseInt(m[3]), text });
        }
      });
    }

    if (!hits.length) { _setStatus(`No results for "${q}".`); return; }

    const list = document.getElementById('bv-verse-list');
    if (!list) return;

    /* Highlight matched text */
    const hiText = (text) => {
      const lo  = text.toLowerCase();
      const idx = lo.indexOf(term);
      if (idx < 0) return _esc(text);
      return _esc(text.substring(0, idx)) +
        '<mark>' + _esc(text.substring(idx, idx + term.length)) + '</mark>' +
        _esc(text.substring(idx + term.length));
    };

    list.innerHTML = `
      <div id="bv-status" style="text-align:left;padding:8px 10px;">
        ${hits.length} result${hits.length !== 1 ? 's' : ''} for <strong>"${_esc(q)}"</strong>
        <span style="float:right;cursor:pointer;color:var(--text-3);"
          onclick="bvClearSearch()">✕ Clear</span>
      </div>` +
      hits.map(h => `
        <div class="bv-vc bv-search-result"
             onclick="bvProjectSearchHit(${JSON.stringify(h).replace(/"/g, '&quot;')})">
          <div class="bv-vnum">${h.num}</div>
          <div class="bv-vtext">${hiText(h.text)}</div>
          <div class="bv-vref">${_esc(h.book)} ${h.ch}:${h.num}</div>
        </div>`).join('');
  };

  window.bvClearSearch = function () {
    document.getElementById('bv-word-inp').value = '';
    if (_verses.length) _renderVerses(_verses, 1, null);
    else _setStatus('Search cleared.');
  };

  window.bvProjectSearchHit = function (h) {
    /* Load that book+chapter if needed, then project that verse */
    const bi = bookIdx(resolveBook(h.book));
    if (bi < 0) return;
    if (bi !== _bookIdx || h.ch !== _ch) {
      _book = (typeof KJV_BOOKS !== 'undefined') ? KJV_BOOKS[bi] : null;
      _bookIdx = bi; _ch = h.ch; _verses = [];
    }
    const inp = document.getElementById('bv-book-inp');
    const chi = document.getElementById('bv-ch-inp');
    const vf  = document.getElementById('bv-vs-from');
    if (inp) inp.value = _book?.name || h.book;
    if (chi) chi.value = h.ch;
    if (vf)  vf.value  = h.num;
    document.getElementById('bv-vs-to').value = '';

    /* Project single verse */
    const slide = { section:`${h.book} ${h.ch}:${h.num}`, text:h.text, version:'KJV' };
    S.songIdx = null; S.slides = [slide]; S.cur = 0;
    _slides = [slide]; _liveIdx = 0;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof push        === 'function') push();
  };

  window.bvWordKey = function (e) {
    if (e.key === 'Enter')  { e.preventDefault(); bvWordSearch(false); }
    if (e.key === 'Escape') { document.getElementById('bv-word-inp').value = ''; }
  };


  /* ══════════════════════════════════════════════════════════
     GLOBAL KEYBOARD SHORTCUTS
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('keydown', e => {
    /* Ctrl+E — open book switcher (works from anywhere) */
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      if (!_bvReady) _buildPanel();
      document.body.classList.add('bible-mode');
      const tab = document.querySelectorAll('.ctab')[0];
      if (typeof centerTab === 'function') centerTab(tab, 'slides-view');
      setTimeout(() => { 
        const inp = document.getElementById('bv-book-inp');
        if (inp) { inp.focus(); inp.select(); }
      }, 80);
    }

    /* Ctrl+G — open word search */
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      if (!document.body.classList.contains('bible-mode')) {
        document.body.classList.add('bible-mode');
        const tab = document.querySelectorAll('.ctab')[0];
        if (typeof centerTab === 'function') centerTab(tab, 'slides-view');
        if (!_bvReady) _buildPanel();
      }
      setTimeout(() => {
        const inp = document.getElementById('bv-word-inp');
        if (inp) { inp.focus(); inp.select(); }
      }, 100);
    }
  }, true);


  /* ══════════════════════════════════════════════════════════
     PATCH buildBibBookGrid
  ══════════════════════════════════════════════════════════ */

  const _origGrid = window.buildBibBookGrid;
  window.buildBibBookGrid = function (testament) {
    if (_origGrid) _origGrid(testament);
    setTimeout(() => {
      const grid  = document.getElementById('bib-book-grid');
      const books = typeof KJV_BOOKS !== 'undefined' ? KJV_BOOKS : [];
      grid?.querySelectorAll('.bib-book-btn').forEach(btn => {
        const name = btn.querySelector('.bib-book-name')?.textContent?.trim();
        const bi   = books.findIndex(b => b.name === name);
        if (bi < 0) return;
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        clone.addEventListener('click', () => bvOpen(bi));
      });
    }, 50);
  };


  /* ══════════════════════════════════════════════════════════
     FIX BLANK DROPDOWNS
  ══════════════════════════════════════════════════════════ */

  function _fixDropdowns() {
    const ch = document.getElementById('bib-ch');
    if (ch && !ch.options.length && typeof onBibBookChange === 'function') onBibBookChange();
    const g = document.getElementById('bib-book-grid');
    if (g && !g.children.length && typeof buildBibBookGrid === 'function') buildBibBookGrid('OT');
  }

  const _origLT = window.libTab;
  window.libTab = function (btn, sid) {
    if (_origLT) _origLT(btn, sid);
    if (sid === 'ls-scripture') setTimeout(_fixDropdowns, 80);
  };
  const _origTT = window.topTab;
  window.topTab = function (btn) {
    if (_origTT) _origTT(btn);
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
    setTimeout(() => {
      _buildPanel();
      const g = document.getElementById('bib-book-grid');
      if (g?.children.length && typeof buildBibBookGrid === 'function') {
        const t = document.querySelector('.btt.on')?.textContent || 'OT';
        buildBibBookGrid(t.includes('New') ? 'NT' : 'OT');
      }
    }, 500);
    console.info('[BW fix26] ✓ Book abbrev  ✓ Space nav  ✓ Ctrl+E/G  ✓ Highlight sync  ✓ Schedule');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 400);

})();

