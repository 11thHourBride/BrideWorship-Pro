/* ═══════════════════════════════════════════════════════════
  BRIDEWORSHIP PRESENTATION FIX 3
═══════════════════════════════════════════════════════════ */

(function BW_Fix3() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     FIX 1 — SLIDE FILLS ENTIRE STAGE / PROJECTION FULLSCREEN
  ══════════════════════════════════════════════════════════ */

  function injectFullscreenCSS() {
    const s = document.createElement('style');
    s.id = 'bw-fix3-fullscreen';
    s.textContent = `
      .stage {
        flex: 1 1 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: stretch !important;
        justify-content: stretch !important;
      }
      .main-slide {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        aspect-ratio: unset !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
        border-top: none !important;
        flex: 1 !important;
      }
      .slide-inner {
        position: relative;
        z-index: 2;
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: clamp(10px,4vh,56px) clamp(18px,7vw,90px) !important;
      }
      .slide-lyrics {
        width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .slide-bg {
        position: absolute;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
      }
      .out-screen {
        width: 100% !important;
        aspect-ratio: 16 / 9 !important;
        max-height: none !important;
        flex-shrink: 0;
      }
      #slides-view {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 1 0 !important;
        overflow: hidden !important;
        min-height: 0 !important;
      }
    `;
    document.head.appendChild(s);
  }

  const _origOpenProj = window.openProjection;
  window.openProjection = async function () {
    if (_origOpenProj) await _origOpenProj();
    setTimeout(() => {
      try {
        const pw = S?.projWin;
        if (pw && !pw.closed) pw.document.documentElement.requestFullscreen?.();
      } catch (e) {}
    }, 900);
  };

  /* ══════════════════════════════════════════════════════════
     FIX 2 — SMART SCRIPTURE LOOKUP
  ══════════════════════════════════════════════════════════ */

  /* ── Book abbreviations ── */
  const SCL_ABBREV = {
    'gen':'Genesis','exo':'Exodus','ex':'Exodus','lev':'Leviticus','num':'Numbers',
    'deu':'Deuteronomy','deut':'Deuteronomy','dt':'Deuteronomy','josh':'Joshua',
    'jdg':'Judges','judg':'Judges','rut':'Ruth','ru':'Ruth',
    '1sa':'1 Samuel','1sam':'1 Samuel','2sa':'2 Samuel','2sam':'2 Samuel',
    '1ki':'1 Kings','1kgs':'1 Kings','2ki':'2 Kings','2kgs':'2 Kings',
    '1ch':'1 Chronicles','1chr':'1 Chronicles','2ch':'2 Chronicles','2chr':'2 Chronicles',
    'ezr':'Ezra','neh':'Nehemiah','est':'Esther','esth':'Esther','jb':'Job',
    'ps':'Psalms','psa':'Psalms','psalm':'Psalms','pro':'Proverbs','prov':'Proverbs',
    'ecc':'Ecclesiastes','eccl':'Ecclesiastes','song':'Song of Solomon','sos':'Song of Solomon',
    'isa':'Isaiah','is':'Isaiah','jer':'Jeremiah','lam':'Lamentations',
    'eze':'Ezekiel','ezek':'Ezekiel','dan':'Daniel','da':'Daniel','hos':'Hosea',
    'jl':'Joel','am':'Amos','ob':'Obadiah','jon':'Jonah','mic':'Micah',
    'nah':'Nahum','hab':'Habakkuk','zep':'Zephaniah','zeph':'Zephaniah',
    'hag':'Haggai','zec':'Zechariah','zech':'Zechariah','mal':'Malachi',
    'mat':'Matthew','matt':'Matthew','mt':'Matthew','mk':'Mark','mar':'Mark',
    'lk':'Luke','luk':'Luke','jn':'John','joh':'John','act':'Acts','ac':'Acts',
    'rom':'Romans','ro':'Romans','1co':'1 Corinthians','1cor':'1 Corinthians',
    '2co':'2 Corinthians','2cor':'2 Corinthians','gal':'Galatians','ga':'Galatians',
    'eph':'Ephesians','php':'Philippians','phil':'Philippians',
    'col':'Colossians','1th':'1 Thessalonians','1thes':'1 Thessalonians',
    '2th':'2 Thessalonians','2thes':'2 Thessalonians',
    '1ti':'1 Timothy','1tim':'1 Timothy','2ti':'2 Timothy','2tim':'2 Timothy',
    'tit':'Titus','ti':'Titus','phm':'Philemon','phlm':'Philemon',
    'heb':'Hebrews','he':'Hebrews','jas':'James','jm':'James',
    '1pe':'1 Peter','1pet':'1 Peter','2pe':'2 Peter','2pet':'2 Peter',
    '1jn':'1 John','1jo':'1 John','2jn':'2 John','3jn':'3 John',
    'jude':'Jude','rev':'Revelation','re':'Revelation',
  };

  function resolveBookName(raw) {
    if (!raw) return '';
    const q = raw.trim();
    if (typeof KJV_BOOKS !== 'undefined') {
      const exact = KJV_BOOKS.find(b => b.name.toLowerCase() === q.toLowerCase());
      if (exact) return exact.name;
      const key = q.replace(/\s/g,'').toLowerCase();
      if (SCL_ABBREV[key]) return SCL_ABBREV[key];
      const prefix = KJV_BOOKS.find(b => b.name.toLowerCase().startsWith(q.toLowerCase()));
      if (prefix) return prefix.name;
    }
    return q;
  }

  function getMaxChapter(bookName) {
    if (typeof KJV_BOOKS === 'undefined') return 150;
    const b = KJV_BOOKS.find(x => x.name === bookName);
    return b ? b.ch : 150;
  }

  function getMaxVerse(bookName, ch) {
    if (typeof KJV_VERSES === 'undefined') return 176;
    const counts = KJV_VERSES[bookName];
    return (counts && counts[ch - 1]) ? counts[ch - 1] : 176;
  }

  /* ─────────────────────────────────────────
     Build the lookup widget
  ───────────────────────────────────────── */
  function buildSmartLookup() {
    let targetSection = null;
    document.querySelectorAll('.r-section').forEach(sec => {
      const tag = sec.querySelector('.panel-tag');
      if (tag && tag.textContent.includes('Scripture Lookup')) targetSection = sec;
    });
    if (!targetSection) return;

    targetSection.innerHTML = `
      <!-- Panel tag — click to focus the book input (requirement 4) -->
      <div class="panel-tag" id="scl-panel-label"
        style="cursor:pointer;user-select:none;"
        title="Click or press Ctrl+K to activate">
        Scripture Lookup — KJV
        <span style="font-size:8px;color:var(--text-3);margin-left:6px;
          font-family:'Lato',sans-serif;letter-spacing:1px;
          text-transform:none;font-weight:400;">Ctrl+K</span>
      </div>

      <!-- Book name with custom autocomplete -->
      <div style="margin-top:6px;position:relative;" id="scl-book-wrap">
        <input
          id="scl-book"
          class="sc-input"
          placeholder="Book name or abbreviation…"
          style="width:100%;padding-right:26px;"
          autocomplete="off"
          spellcheck="false"
        >
        <!-- Clear button -->
        <button id="scl-book-clear"
          style="position:absolute;right:6px;top:50%;transform:translateY(-50%);
            background:none;border:none;color:var(--text-3);cursor:pointer;
            font-size:13px;padding:0;line-height:1;display:none;"
          tabindex="-1"
          onclick="sclClearBook()">✕</button>
        <!-- Autocomplete dropdown — hidden until typing -->
        <div id="scl-book-drop"
          style="display:none;position:absolute;left:0;right:0;top:calc(100% + 3px);
            z-index:2000;background:var(--bg-card);
            border:1px solid var(--border-dim);border-radius:6px;
            max-height:200px;overflow-y:auto;
            box-shadow:0 6px 20px rgba(0,0,0,.55);">
        </div>
      </div>

      <!-- Chapter : Verse row -->
      <div style="display:flex;align-items:center;gap:4px;margin-top:5px;">
        <span style="font-size:10px;color:var(--text-3);white-space:nowrap;min-width:18px;">Ch.</span>
        <input
          id="scl-ch"
          type="number" min="1" value="1"
          class="sc-input"
          style="width:52px;text-align:center;padding:5px 3px;"
          onfocus="this.select()"
        >
        <span style="color:var(--text-3);font-size:13px;flex-shrink:0;">:</span>
        <span style="font-size:10px;color:var(--text-3);white-space:nowrap;min-width:18px;">Vs.</span>
        <input
          id="scl-vs"
          type="number" min="1" value="1"
          class="sc-input"
          style="width:52px;text-align:center;padding:5px 3px;"
          onfocus="this.select()"
        >
        <span style="color:var(--text-3);font-size:11px;flex-shrink:0;">–</span>
        <input
          id="scl-vs-end"
          type="number" min="1"
          placeholder="end"
          class="sc-input"
          style="width:46px;text-align:center;padding:5px 2px;color:var(--text-3);"
          onfocus="this.select()"
        >
      </div>

      <!-- Hint line -->
      <div id="scl-hint"
        style="font-size:9px;color:var(--text-3);margin-top:3px;
          line-height:1.55;min-height:14px;transition:color .2s;">
      </div>

      <!-- Action buttons -->
      <div style="display:flex;gap:4px;margin-top:5px;">
        <button class="sc-add"
          style="flex:3;font-size:11px;padding:7px;"
          onclick="sclProject()">▶ Project</button>
        <button class="sc-add"
          style="flex:1;font-size:11px;padding:7px;background:var(--gold-dim);"
          onclick="sclAddSO()" title="Add to Service Order">📋</button>
        <button class="sc-add"
          style="flex:1;font-size:11px;padding:7px;
            background:var(--bg-card);border:1px solid var(--border-dim);color:var(--text-2);"
          onclick="sclAddSchedule()" title="Add to Schedule">📅</button>
      </div>
    `;

    /* Wire up all events */
    _wirePanelLabel();
    _wireBookAutocomplete();
    _wireChapterInput();
    _wireVerseKeys();
    _wireVsEndKey();

    /* Default: Genesis 1 */
    sclSetBook('Genesis', false);
  }

  /* ── Panel label click → focus + select book ── */
  function _wirePanelLabel() {
    const label = document.getElementById('scl-panel-label');
    if (!label) return;
    label.addEventListener('click', () => {
      const bookEl = document.getElementById('scl-book');
      if (bookEl) { bookEl.focus(); bookEl.select(); }
    });
  }

  /* ── Custom autocomplete ── */
  function _wireBookAutocomplete() {
    const input = document.getElementById('scl-book');
    const drop  = document.getElementById('scl-book-drop');
    const clear = document.getElementById('scl-book-clear');
    if (!input || !drop) return;

    let activeIdx = -1;

    function getMatches(q) {
      if (!q || !q.trim()) return [];
      const qLower = q.toLowerCase();
      const qKey   = q.replace(/\s/g,'').toLowerCase();
      const out    = [];
      const seen   = new Set();

      if (typeof KJV_BOOKS !== 'undefined') {
        KJV_BOOKS.forEach(b => {
          const bLower = b.name.toLowerCase();
          if (bLower.startsWith(qLower) ||
              bLower.replace(/\s/g,'').startsWith(qKey)) {
            if (!seen.has(b.name)) { out.push(b.name); seen.add(b.name); }
          }
        });
        /* Partial-word match (e.g. "cor" → 1/2 Corinthians) */
        if (out.length < 8) {
          KJV_BOOKS.forEach(b => {
            if (!seen.has(b.name) &&
                b.name.toLowerCase().includes(qLower)) {
              out.push(b.name); seen.add(b.name);
            }
          });
        }
      }
      /* Abbreviations */
      Object.entries(SCL_ABBREV).forEach(([abbr, full]) => {
        if (abbr.startsWith(qKey) && !seen.has(full)) {
          out.push(full); seen.add(full);
        }
      });
      return out.slice(0, 8);
    }

    function renderDrop(matches) {
      if (!matches.length) { drop.style.display = 'none'; activeIdx = -1; return; }
      drop.innerHTML = matches.map((name, i) => `
        <div class="scl-drop-item" data-name="${name}" data-idx="${i}"
          style="padding:7px 12px;cursor:pointer;font-size:12px;
            font-family:'Lato',sans-serif;
            border-bottom:1px solid var(--border-dim);
            transition:background .1s;"
        >${name}</div>`).join('');
      drop.style.display = 'block';
      activeIdx = -1;
      drop.querySelectorAll('.scl-drop-item').forEach(item => {
        item.addEventListener('mousedown', e => {
          e.preventDefault();
          _selectDropBook(item.dataset.name);
        });
        item.addEventListener('mouseenter', () => {
          _highlightDrop(parseInt(item.dataset.idx));
        });
      });
    }

    function _highlightDrop(idx) {
      activeIdx = idx;
      drop.querySelectorAll('.scl-drop-item').forEach((x, i) => {
        x.style.background = i === idx ? 'var(--bg-hover)' : '';
      });
    }

    function _selectDropBook(name) {
      input.value = name;
      drop.style.display = 'none';
      if (clear) clear.style.display = name ? 'block' : 'none';
      sclSetBook(name, true);
      activeIdx = -1;
    }

    input.addEventListener('input', () => {
      const val = input.value;
      if (clear) clear.style.display = val ? 'block' : 'none';
      renderDrop(getMatches(val));
      /* Update hint with abbreviation resolution */
      const resolved = resolveBookName(val);
      const hintEl   = document.getElementById('scl-hint');
      if (hintEl && resolved && resolved !== val && val.trim()) {
        hintEl.textContent = '→ ' + resolved;
        hintEl.style.color = 'var(--gold-dim)';
      } else if (hintEl) {
        const mc = getMaxChapter(resolved);
        hintEl.textContent = resolved && mc < 200 ? `${resolved} · ${mc} ch.` : '';
        hintEl.style.color = 'var(--text-3)';
      }
    });

    input.addEventListener('focus', () => {
      /* Select all on focus so the user can replace immediately */
      input.select();
      const val = input.value.trim();
      if (val) renderDrop(getMatches(val));
    });

    input.addEventListener('blur', () => {
      setTimeout(() => { drop.style.display = 'none'; activeIdx = -1; }, 160);
    });

    input.addEventListener('keydown', e => {
      const items = drop.querySelectorAll('.scl-drop-item');
      const open  = drop.style.display !== 'none';

      if (e.key === 'ArrowDown' && open) {
        e.preventDefault();
        _highlightDrop(Math.min(activeIdx + 1, items.length - 1));
        return;
      }
      if (e.key === 'ArrowUp' && open) {
        e.preventDefault();
        _highlightDrop(Math.max(activeIdx - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        if (open && activeIdx >= 0) {
          e.preventDefault();
          const item = items[activeIdx];
          if (item) { _selectDropBook(item.dataset.name); return; }
        }
        /* No dropdown selection — resolve abbreviation and project */
        const resolved = resolveBookName(input.value.trim());
        if (resolved) { input.value = resolved; sclSetBook(resolved, false); }
        drop.style.display = 'none';
        sclProject();
        return;
      }
      if (e.key === ' ' || e.key === 'Tab') {
        /* Space/Tab while typing a book name → resolve + jump to chapter */
        const resolved = resolveBookName(input.value.trim());
        if (resolved) {
          e.preventDefault();
          _selectDropBook(resolved);
        }
      }
    });
  }

  /* ── Chapter input ── */
  function _wireChapterInput() {
    const chEl = document.getElementById('scl-ch');
    if (!chEl) return;
    chEl.addEventListener('input', () => sclChInput(chEl.value));
    chEl.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === ':') {
        e.preventDefault();
        const ch      = parseInt(chEl.value) || 1;
        const bName   = resolveBookName(document.getElementById('scl-book')?.value || '');
        const maxVs   = getMaxVerse(bName, ch);
        const vsEl    = document.getElementById('scl-vs');
        const hintEl  = document.getElementById('scl-hint');
        if (vsEl) { vsEl.max = String(maxVs); vsEl.value = '1'; vsEl.focus(); vsEl.select(); }
        if (hintEl) { hintEl.textContent = `Ch ${ch} · ${maxVs} verses`; hintEl.style.color = 'var(--text-3)'; }
      }
      if (e.key === 'Enter') sclProject();
    });
  }

  /* ── Verse "from" input — Space → jump to "end" field ── */
  function _wireVerseKeys() {
    const vsEl = document.getElementById('scl-vs');
    if (!vsEl) return;
    vsEl.addEventListener('keydown', e => {
      if (e.key === ' ') {
        /* Space jumps to the "end verse" field (requirement 2) */
        e.preventDefault();
        const vsEndEl = document.getElementById('scl-vs-end');
        if (vsEndEl) { vsEndEl.focus(); vsEndEl.select(); }
        const hintEl = document.getElementById('scl-hint');
        if (hintEl) { hintEl.textContent = 'Enter end verse, then press Enter to project'; hintEl.style.color = 'var(--text-3)'; }
        return;
      }
      if (e.key === 'Enter') sclProject();
    });
  }

  /* ── Verse "end" input ── */
  function _wireVsEndKey() {
    const vsEndEl = document.getElementById('scl-vs-end');
    if (!vsEndEl) return;
    vsEndEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sclProject(); }
    });
  }

  /* ─────────────────────────────────────────
     Public helpers
  ───────────────────────────────────────── */

  window.sclClearBook = function () {
    const input = document.getElementById('scl-book');
    const clear = document.getElementById('scl-book-clear');
    const drop  = document.getElementById('scl-book-drop');
    if (input) { input.value = ''; input.focus(); }
    if (clear) clear.style.display = 'none';
    if (drop)  drop.style.display  = 'none';
    const hintEl = document.getElementById('scl-hint');
    if (hintEl) { hintEl.textContent = ''; }
  };

  window.sclSetBook = function (name, moveFocusToChapter) {
    const bookEl  = document.getElementById('scl-book');
    const chEl    = document.getElementById('scl-ch');
    const vsEl    = document.getElementById('scl-vs');
    const vsEndEl = document.getElementById('scl-vs-end');
    const hintEl  = document.getElementById('scl-hint');
    const clearEl = document.getElementById('scl-book-clear');
    if (!bookEl) return;
    bookEl.value = name;
    if (clearEl) clearEl.style.display = name ? 'block' : 'none';
    const maxCh = getMaxChapter(name);
    if (chEl)   { chEl.max = String(maxCh); chEl.value = '1'; }
    const maxVs = getMaxVerse(name, 1);
    if (vsEl)   { vsEl.max = String(maxVs); vsEl.value = '1'; }
    if (vsEndEl){ vsEndEl.max = String(maxVs); vsEndEl.value = ''; }
    if (hintEl) {
      hintEl.textContent = `${name} · ${maxCh} ch. · Press Enter to project`;
      hintEl.style.color = 'var(--text-3)';
    }
    if (moveFocusToChapter && chEl) { chEl.focus(); chEl.select(); }
  };

  window.sclChInput = function (val) {
    const bookName = resolveBookName(document.getElementById('scl-book')?.value || '');
    const ch       = parseInt(val) || 1;
    const maxVs    = getMaxVerse(bookName, ch);
    const vsEl     = document.getElementById('scl-vs');
    const vsEndEl  = document.getElementById('scl-vs-end');
    const hintEl   = document.getElementById('scl-hint');
    if (vsEl)   { vsEl.max = String(maxVs); if (parseInt(vsEl.value) > maxVs) vsEl.value = '1'; }
    if (vsEndEl){ vsEndEl.max = String(maxVs); }
    if (hintEl) {
      hintEl.textContent = `Ch ${ch} · ${maxVs} verses · Space → jump to verse`;
      hintEl.style.color = 'var(--text-3)';
    }
  };

  /* ─────────────────────────────────────────
     sclProject — THE FIX
     Root bug: _bib is a local `let` in BrideWorship.js, not on
     window, so `window._bib` is always undefined.  Calling
     projectBiblePassage() silently returned because
     `_bib.lastPassage` was null.

     Fix: build S.slides directly from the fetched verses,
     completely bypassing _bib / projectBiblePassage.
  ───────────────────────────────────────── */
  window.sclProject = async function () {
    const rawBook  = document.getElementById('scl-book')?.value.trim() || '';
    const bookName = resolveBookName(rawBook);
    const ch       = parseInt(document.getElementById('scl-ch')?.value)    || 1;
    const vsFrom   = parseInt(document.getElementById('scl-vs')?.value)    || 1;
    const vsEndRaw = document.getElementById('scl-vs-end')?.value.trim();
    const vsTo     = (vsEndRaw && parseInt(vsEndRaw) >= vsFrom)
                       ? parseInt(vsEndRaw)
                       : vsFrom;

    if (!bookName) {
      document.getElementById('scl-book')?.focus();
      _sclFeedback('⚠ Enter a book name first', 'var(--amber)');
      return;
    }

    const rangeStr = vsFrom === vsTo ? String(vsFrom) : `${vsFrom}–${vsTo}`;
    const ref      = `${bookName} ${ch}:${rangeStr}`;

    /* ── 1. Try offline SCRIPTURE_DB ── */
    if (typeof SCRIPTURE_DB !== 'undefined') {
      const key  = ref.toLowerCase().replace('–','-');
      const key2 = `${bookName.toLowerCase()} ${ch}:${vsFrom}`;
      const text = SCRIPTURE_DB[key] || SCRIPTURE_DB[key2] || SCRIPTURE_DB[ref.toLowerCase()];
      if (text) {
        _sclLoadSlides(ref, [{ num: vsFrom, text }]);
        _sclFeedback(`✓ ${ref}`, 'var(--green)');
        return;
      }
    }

    /* ── 2. Fetch via KJV API ── */
    const book = (typeof KJV_BOOKS !== 'undefined')
      ? KJV_BOOKS.find(b => b.name === bookName)
      : null;

    if (book && typeof loadBibVerses === 'function') {
      _sclFeedback('Loading…', 'var(--text-3)');
      try {
        const verses = await loadBibVerses(book, ch, vsFrom, vsTo);
        if (!verses || !verses.length) {
          _sclFeedback(`⚠ No verses found for ${ref}`, 'var(--amber)');
          return;
        }
        _sclLoadSlides(ref, verses);
        _sclFeedback(`✓ ${ref} — ${verses.length} verse${verses.length > 1 ? 's' : ''}`, 'var(--green)');
      } catch (err) {
        _sclFeedback('⚠ ' + err.message, 'var(--red)');
      }
      return;
    }

    /* ── 3. Fallback ── */
    const scRefEl = document.getElementById('sc-ref');
    if (scRefEl) scRefEl.value = ref;
    if (typeof quickScriptureLookup === 'function') quickScriptureLookup();
  };

  /* ── Direct slide injection (the actual fix) ── */
  function _sclLoadSlides(ref, verses) {
    /* Parse "BookName Chapter" from ref to build per-verse labels cleanly */
    const refBase = ref.replace(/:\d.*$/, '').trim(); // e.g. "Genesis 1"

    /* S is a `let` in BrideWorship.js — accessible as plain S, not window.S */
    S.songIdx = null;
    S.slides  = verses.map(v => ({
      section: `${refBase}:${v.num}`,
      text:    v.text.trim(),
      version: 'KJV',
    }));
    S.cur = 0;

    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof centerTab   === 'function') {
      centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
    }
  }

  window.sclAddSO = function () {
    const ref = _sclBuildRef();
    if (!ref) return;
    if (typeof S !== 'undefined' && Array.isArray(S.so)) {
      S.so.push({ name: ref, type: 'scripture', content: '' });
      if (typeof renderSO      === 'function') renderSO();
      if (typeof showSchToast  === 'function') showSchToast(`Added "${ref}" to Service Order`);
    }
  };

  window.sclAddSchedule = function () {
    const ref = _sclBuildRef();
    if (!ref) return;
    if (typeof schInsertFromLibrary === 'function') {
      schInsertFromLibrary({ type:'scripture', label:ref, content:'', notes:'', duration:1 }, -1);
    }
  };

  function _sclBuildRef() {
    const bName  = resolveBookName(document.getElementById('scl-book')?.value.trim() || '');
    const ch     = parseInt(document.getElementById('scl-ch')?.value)    || 1;
    const vs     = parseInt(document.getElementById('scl-vs')?.value)    || 1;
    const vsEnd  = document.getElementById('scl-vs-end')?.value.trim();
    const vsTo   = (vsEnd && parseInt(vsEnd) >= vs) ? parseInt(vsEnd) : vs;
    if (!bName) return null;
    return `${bName} ${ch}:${vs === vsTo ? vs : vs + '-' + vsTo}`;
  }

  function _sclFeedback(msg, color) {
    const el = document.getElementById('scl-hint');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color || 'var(--text-3)';
    /* Auto-clear green feedback after 3 s */
    if (color === 'var(--green)') {
      clearTimeout(el._clearTimer);
      el._clearTimer = setTimeout(() => {
        if (el.style.color === 'var(--green)') el.textContent = '';
      }, 3000);
    }
  }

  /* ─────────────────────────────────────────
     Ctrl+K global shortcut — activate the
     Scripture Lookup from anywhere in the app
  ───────────────────────────────────────── */
  function _wireCtrlK() {
    document.addEventListener('keydown', e => {
      /* Ctrl+K (Windows/Linux) or Cmd+K (Mac) */
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        /* Don't intercept inside actual text fields that use Ctrl+K natively */
        const tag = document.activeElement?.tagName;
        if (tag === 'TEXTAREA') return; /* leave it for text editors */

        e.preventDefault();

        /* 1. Ensure the right panel Scripture Lookup accordion is open */
        if (typeof openAccordionByLabel === 'function') {
          /* Scripture Lookup lives outside an accordion (it's a plain .r-section),
             so we just need to scroll to it */
        }

        /* 2. Switch library to Scripture tab so the panel is in view */
        const scrTab = document.querySelector('.ltab[onclick*="scripture"]');
        /* Don't force-switch library tab — just scroll the right panel instead */

        /* 3. Focus the book input and select all */
        const bookEl = document.getElementById('scl-book');
        if (bookEl) {
          bookEl.focus();
          bookEl.select();
          /* Scroll the right panel so the lookup is visible */
          bookEl.scrollIntoView({ behavior:'smooth', block:'nearest' });
          /* Visual feedback: briefly highlight the panel label */
          const label = document.getElementById('scl-panel-label');
          if (label) {
            label.style.color = 'var(--gold)';
            setTimeout(() => { label.style.color = ''; }, 800);
          }
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     FIX 3 — REMOTE CONTROL  (WebRTC via PeerJS)
  ══════════════════════════════════════════════════════════ */

  let _rwPeer  = null;
  let _rwConns = [];
  let _rwCode  = null;

  function addRemoteButton() {
    const goBtn = document.getElementById('go-btn');
    if (!goBtn || document.getElementById('remote-ctrl-btn')) return;
    const btn     = document.createElement('button');
    btn.id        = 'remote-ctrl-btn';
    btn.className = 'proj-btn';
    btn.innerHTML = '📱 Remote';
    btn.title     = 'Connect a phone or tablet as a remote control';
    btn.onclick   = openRemoteModal;
    goBtn.parentNode.insertBefore(btn, goBtn);
  }

  function buildRemoteModal() {
    if (document.getElementById('remote-ctrl-modal')) return;
    const wrap = document.createElement('div');
    wrap.id        = 'remote-ctrl-modal';
    wrap.className = 'modal-overlay';
    wrap.style.display = 'none';
    wrap.onclick   = e => { if (e.target === wrap) closeRemoteModal(); };
    wrap.innerHTML = `
      <div class="modal" style="width:480px;max-width:96vw;">
        <div class="modal-head">
          <div class="modal-title">📱 Remote Control</div>
          <button class="modal-x" onclick="closeRemoteModal()">✕</button>
        </div>
        <div class="modal-body" style="padding:16px;">
          <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;
               background:var(--bg-card);border:1px solid var(--border-dim);
               border-radius:6px;margin-bottom:14px;">
            <div id="rw-dot" style="width:10px;height:10px;border-radius:50%;
                 background:var(--text-3);flex-shrink:0;transition:background .3s;"></div>
            <span id="rw-status" style="font-size:12px;color:var(--text-2);flex:1;">Not started</span>
            <button id="rw-start-btn" class="sc-add" style="padding:5px 14px;" onclick="rwStart()">Start Remote</button>
            <button id="rw-stop-btn"  class="sc-add" style="padding:5px 14px;background:var(--red);display:none;" onclick="rwStop()">■ Stop</button>
          </div>
          <div id="rw-connect-area" style="display:none;">
            <div style="display:grid;grid-template-columns:1fr 132px;gap:16px;align-items:start;">
              <div>
                <div class="modal-label" style="margin-bottom:5px;">Room Code</div>
                <div id="rw-code-display" style="
                  font-family:'Cinzel',serif;font-size:32px;letter-spacing:10px;
                  color:var(--gold);text-align:center;padding:10px 12px;
                  background:var(--bg-deep);border:1px solid var(--border-dim);
                  border-radius:6px;user-select:all;">——————</div>
                <div class="modal-label" style="margin-top:10px;margin-bottom:4px;">Connect URL</div>
                <div style="display:flex;gap:4px;">
                  <input id="rw-url-inp" class="modal-input" readonly
                    style="flex:1;font-size:10px;color:var(--text-3);" value="Starting…">
                  <button class="lib-icon-btn" onclick="rwCopyUrl()" title="Copy URL">📋</button>
                </div>
                <div class="modal-label" style="margin-top:10px;margin-bottom:4px;">Connected Devices</div>
                <div id="rw-device-list" style="
                  padding:7px 10px;background:var(--bg-deep);border:1px solid var(--border-dim);
                  border-radius:4px;font-size:11px;color:var(--text-3);min-height:32px;">
                  No devices connected yet</div>
              </div>
              <div>
                <div class="modal-label" style="margin-bottom:5px;">Scan with Phone</div>
                <div id="rw-qr" style="
                  width:128px;height:128px;background:#fff;border-radius:5px;
                  display:flex;align-items:center;justify-content:center;
                  overflow:hidden;font-size:10px;color:#888;text-align:center;padding:4px;">
                  Generating…</div>
              </div>
            </div>
            <div style="margin-top:12px;padding:9px 12px;font-size:11px;color:var(--text-3);
                 line-height:1.7;background:rgba(201,168,76,.04);
                 border:1px solid rgba(201,168,76,.14);border-radius:5px;">
              <strong style="color:var(--gold);">How to connect:</strong>
              Scan the QR code <em>or</em> open the URL on your phone/tablet.
              Type the Room Code on the remote page and tap <strong>Connect</strong>.
            </div>
          </div>
          <div style="margin-top:12px;padding:9px 12px;font-size:11px;color:var(--text-3);
               line-height:1.7;background:rgba(74,144,217,.05);
               border:1px solid rgba(74,144,217,.18);border-radius:5px;">
            <strong style="color:var(--blue);">ℹ Remote Control</strong> uses a secure peer-to-peer
            (WebRTC) connection. Works best when both devices are online or on the same Wi-Fi.
          </div>
        </div>
        <div class="modal-foot">
          <button class="modal-btn-cancel" onclick="closeRemoteModal()">Close</button>
          <button class="modal-btn-save" onclick="rwOpenRemotePage()">🖥 Open Remote Page</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  }

  window.openRemoteModal  = function () { buildRemoteModal(); document.getElementById('remote-ctrl-modal').style.display = 'flex'; };
  window.closeRemoteModal = function () { const m = document.getElementById('remote-ctrl-modal'); if (m) m.style.display = 'none'; };

  function _genCode() {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({length:6}, () => a[Math.floor(Math.random()*a.length)]).join('');
  }

  window.rwStart = async function () {
    document.getElementById('rw-start-btn').style.display = 'none';
    _setRwStatus('Connecting…', 'var(--amber)');
    await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js');
    _rwCode  = _genCode();
    _rwPeer  = new Peer('bw-remote-' + _rwCode.toLowerCase(), {
      config: { iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}] },
    });
    _rwPeer.on('open', () => {
      _setRwStatus('Active · Code: ' + _rwCode, 'var(--green)');
      document.getElementById('rw-stop-btn').style.display  = 'inline-block';
      document.getElementById('rw-connect-area').style.display = 'block';
      document.getElementById('rw-code-display').textContent  = _rwCode;
      const url = _buildRemoteUrl(_rwCode);
      document.getElementById('rw-url-inp').value = url;
      _generateQR(url, document.getElementById('rw-qr'));
      document.getElementById('remote-ctrl-btn')?.classList.add('on');
    });
    _rwPeer.on('connection', conn => {
      _rwConns.push(conn);
      conn.on('open',  () => { _updateDeviceList(); if (typeof showSchToast==='function') showSchToast('📱 Remote device connected'); _sendStateToConn(conn); });
      conn.on('data',  d  => { if (d?.cmd) _handleRemoteCmd(d, conn); });
 
      conn.on('close', () => { _rwConns = _rwConns.filter(c=>c!==conn); _updateDeviceList(); if (typeof showSchToast==='function') showSchToast('📱 Remote device disconnected'); });
      conn.on('error', err => console.error('[BW Remote]', err));
    });
    _rwPeer.on('error', err => {
      _setRwStatus('Error: ' + err.type, 'var(--red)');
      document.getElementById('rw-start-btn').style.display = 'inline-block';
      document.getElementById('rw-stop-btn').style.display  = 'none';
    });
  };

  window.rwStop = function () {
    if (_rwPeer) { _rwPeer.destroy(); _rwPeer = null; }
    _rwConns = []; _rwCode = null;
    _setRwStatus('Stopped', 'var(--text-3)');
    document.getElementById('rw-start-btn').style.display  = 'inline-block';
    document.getElementById('rw-stop-btn').style.display   = 'none';
    document.getElementById('rw-connect-area').style.display = 'none';
    document.getElementById('remote-ctrl-btn')?.classList.remove('on');
  };

  function _handleRemoteCmd(data, conn) {
  /* Accept either a plain string (legacy) or the full data object */
  const cmd = (typeof data === 'string') ? data : data.cmd;
 
  const fns = {
    next:        'nextSlide',
    prev:        'prevSlide',
    blank:       'toggleBlank',
    live:        'toggleLive',
    freeze:      'toggleFreeze',
    logo:        'toggleLogo',
    timer_start: 'startTimer',
    timer_pause: 'pauseTimer',
    timer_reset: 'resetTimer',
  };
 
  if (cmd === 'ping') {
    conn.open && conn.send({ type: 'pong' });
 
  } else if (cmd === 'sch_project') {
    /* Remote tapped a schedule item — project it */
    const idx = (typeof data === 'object') ? data.idx : -1;
    if (typeof idx === 'number' && idx >= 0 && typeof schProject === 'function') {
      schProject(idx);
    }
 
  } else if (cmd === 'sv_prev') {
    /* Viewer slide navigation from remote */
    if (typeof svPrev === 'function') svPrev();
 
  } else if (cmd === 'sv_next') {
    if (typeof svNext === 'function') svNext();
 
  } else if (fns[cmd] && typeof window[fns[cmd]] === 'function') {
    window[fns[cmd]]();
  }
 
  _broadcastState();
}
 
/* ── REPLACEMENT for _sendStateToConn ── */
function _sendStateToConn(conn) {
  if (!conn.open) return;
 
  /* Include schedule items so remote.html can render the list */
  const schItems = (typeof SCH !== 'undefined' && Array.isArray(SCH.items))
    ? SCH.items.map((it, idx) => ({
        i:     idx,
        label: it.label || it.name || 'Item',
        type:  it.type  || 'announcement',
        done:  it.done  || false,
      }))
    : [];
 
  const schCur = (typeof SCH !== 'undefined') ? (SCH.current ?? -1) : -1;
 
  conn.send({
    type:     'state',
    live:     S?.live    ?? false,
    blanked:  S?.blanked ?? false,
    frozen:   S?.frozen  ?? false,
    logo:     S?.logo    ?? false,
    cur:      S?.cur     ?? 0,
    total:    S?.slides?.length ?? 0,
    section:  S?.slides?.[S?.cur]?.section || '—',
    song:     S?.songIdx != null ? (SONGS?.[S.songIdx]?.title || '') : '',
    schItems,
    schCur,
  });
}

  function _broadcastState() { _rwConns.filter(c=>c.open).forEach(c=>_sendStateToConn(c)); }

  function _patchForBroadcast(fnName) {
    const orig = window[fnName]; if (!orig) return;
    window[fnName] = function(...a) { const r=orig.apply(this,a); setTimeout(_broadcastState,80); return r; };
  }
  ['nextSlide','prevSlide','toggleLive','toggleBlank','toggleFreeze','toggleLogo','jumpSlide'].forEach(_patchForBroadcast);

  function _updateDeviceList() {
    const el = document.getElementById('rw-device-list'); if (!el) return;
    const n = _rwConns.filter(c=>c.open).length;
    el.textContent = n ? `✓ ${n} device${n>1?'s':''} connected` : 'No devices connected yet';
    el.style.color = n ? 'var(--green)' : 'var(--text-3)';
  }

  function _setRwStatus(msg, color) {
    const dot = document.getElementById('rw-dot'), txt = document.getElementById('rw-status');
    if (dot) dot.style.background = color;
    if (txt) txt.textContent = msg;
  }

  window.rwCopyUrl = function () {
    const val = document.getElementById('rw-url-inp')?.value;
    if (val && navigator.clipboard) {
      navigator.clipboard.writeText(val).then(() => { if (typeof showSchToast==='function') showSchToast('Remote URL copied'); });
    }
  };

  window.rwOpenRemotePage = function () {
    if (!_rwCode) { if (typeof showSchToast==='function') showSchToast('Start Remote first'); return; }
    window.open(_buildRemoteUrl(_rwCode), 'BW_Remote', 'width=420,height=700,menubar=no,toolbar=no,location=no');
  };

  function _buildRemoteUrl(code) {
    const o = window.location.origin;
    const p = window.location.pathname.replace(/[^/]*$/,'');
    if (o && o !== 'null' && !o.startsWith('file:')) return `${o}${p}remote.html?code=${code}`;
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(_buildInlineRemotePage(code));
  }

  async function _generateQR(text, container) {
    if (!container) return;
    try {
      if (typeof QRCode === 'undefined') await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
      container.innerHTML = '';
      new QRCode(container, { text, width:124, height:124, colorDark:'#000000', colorLight:'#ffffff', correctLevel:QRCode.CorrectLevel.M });
    } catch(e) { container.innerHTML = `<span style="font-size:9px;color:#888;padding:6px;display:block;">${text.substring(0,40)}…</span>`; }
  }

  function _loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = () => rej(new Error('Load failed: ' + src));
      document.head.appendChild(s);
    });
  }

  function _buildInlineRemotePage(code) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>BrideWorship Remote</title>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{--gold:#c9a84c;--bg:#09090f;--bg2:#13131e;--b:rgba(255,255,255,.09);--green:#4caf7a;--red:#e05050;--blue:#4a90d9;}
html,body{height:100%;background:var(--bg);color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden;}
#app{display:flex;flex-direction:column;height:100%;max-width:440px;margin:0 auto;padding:14px;gap:8px;}
.logo{font-family:Georgia,serif;font-size:13px;color:var(--gold);letter-spacing:3px;}
#status{font-size:11px;padding:4px 10px;border-radius:20px;background:var(--bg2);border:1px solid var(--b);}
#status.on{border-color:var(--green);color:var(--green);background:rgba(76,175,122,.12);}
.slide-card{background:var(--bg2);border:1px solid var(--b);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;align-items:center;gap:4px;}
.slide-section{font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;}
.slide-count{font-size:13px;color:rgba(255,255,255,.4);}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.btn{border:none;border-radius:10px;cursor:pointer;padding:13px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;transition:transform .1s,opacity .15s;user-select:none;}
.btn:active{transform:scale(.93);opacity:.75;}
.btn .ic{font-size:24px;} .btn .lb{font-size:10px;opacity:.65;letter-spacing:1px;}
.btn-prev{background:rgba(255,255,255,.08);}
.btn-next{background:var(--gold);color:#000;}
.btn-live{background:rgba(76,175,122,.12);border:2px solid var(--green);}
.btn-live.on{background:var(--green);color:#000;}
.btn-blank{background:rgba(255,255,255,.06);border:2px solid transparent;}
.btn-blank.on{border-color:#fff;background:rgba(255,255,255,.15);}
.btn-freeze{background:rgba(74,144,217,.1);border:2px solid transparent;}
.btn-freeze.on{border-color:var(--blue);background:rgba(74,144,217,.2);}
.btn-logo{background:rgba(201,168,76,.08);border:2px solid transparent;}
.btn-logo.on{border-color:var(--gold);background:rgba(201,168,76,.2);}
.btn-sm{flex:1;padding:10px 4px;background:rgba(212,160,23,.1);border:1px solid rgba(212,160,23,.25);border-radius:8px;}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.lbl{font-size:9px;color:rgba(255,255,255,.28);letter-spacing:2px;text-transform:uppercase;text-align:center;}
#cs{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px;}
.title{font-size:17px;font-weight:700;color:var(--gold);}
.subtitle{font-size:12px;color:rgba(255,255,255,.45);text-align:center;}
.code-box{width:100%;max-width:210px;text-align:center;font-size:24px;letter-spacing:8px;padding:12px;background:var(--bg2);border:2px solid var(--b);border-radius:8px;color:#fff;outline:none;text-transform:uppercase;}
.code-box:focus{border-color:var(--gold);}
.conn-btn{width:100%;max-width:210px;padding:13px;background:var(--gold);color:#000;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;}
.err{font-size:12px;color:var(--red);min-height:16px;}
#main{display:none;flex-direction:column;height:100%;gap:8px;}
</style>
</head>
<body>
<div id="app">
<div id="cs">
  <div style="font-size:36px;">📱</div>
  <div class="title">BrideWorship Remote</div>
  <div class="subtitle">Enter the 6-character Room Code<br>shown on the main screen</div>
  <input id="code-inp" class="code-box" maxlength="6" placeholder="XXXXXX"
    oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
  <button class="conn-btn" onclick="connect()">Connect →</button>
  <div id="err" class="err"></div>
</div>
<div id="main">
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <div class="logo">BW REMOTE</div><div id="status">Connecting…</div>
  </div>
  <div class="slide-card">
    <div class="slide-section" id="sl-section">—</div>
    <div class="slide-count"   id="sl-count">— / —</div>
  </div>
  <div class="row2">
    <button class="btn btn-prev" onclick="send('prev')"><span class="ic">◀</span><span class="lb">PREV</span></button>
    <button class="btn btn-next" onclick="send('next')"><span class="ic">▶</span><span class="lb">NEXT</span></button>
  </div>
  <div class="lbl">Controls</div>
  <div class="row2">
    <button class="btn btn-live"   id="b-live"   onclick="send('live')"  ><span class="ic">📡</span><span class="lb">LIVE</span></button>
    <button class="btn btn-blank"  id="b-blank"  onclick="send('blank')" ><span class="ic">■</span><span class="lb">BLANK</span></button>
  </div>
  <div class="row2">
    <button class="btn btn-freeze" id="b-freeze" onclick="send('freeze')"><span class="ic">❄</span><span class="lb">FREEZE</span></button>
    <button class="btn btn-logo"   id="b-logo"   onclick="send('logo')"  ><span class="ic">◈</span><span class="lb">LOGO</span></button>
  </div>
  <div class="lbl">Timer</div>
  <div class="row3">
    <button class="btn btn-sm" onclick="send('timer_start')"><span class="ic">▶</span><span class="lb">START</span></button>
    <button class="btn btn-sm" onclick="send('timer_pause')"><span class="ic">⏸</span><span class="lb">PAUSE</span></button>
    <button class="btn btn-sm" onclick="send('timer_reset')"><span class="ic">↺</span><span class="lb">RESET</span></button>
  </div>
  <div class="lbl" style="margin-top:auto;">BrideWorship Pro</div>
</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js"><\/script>
<script>
let peer=null,conn=null;
const PRE='${code}';
if(PRE&&PRE.length===6){document.getElementById('code-inp').value=PRE;setTimeout(connect,600);}
function connect(){
  const c=document.getElementById('code-inp').value.trim().toUpperCase();
  if(c.length<6){setErr('Enter a 6-character code');return;}
  setErr('');
  peer=new Peer({config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});
  peer.on('open',()=>{
    conn=peer.connect('bw-remote-'+c.toLowerCase(),{reliable:true});
    conn.on('open',()=>{
      document.getElementById('cs').style.display='none';
      document.getElementById('main').style.display='flex';
      setSt('● Connected',true);
      setInterval(()=>conn.open&&conn.send({cmd:'ping'}),4000);
    });
    conn.on('data',d=>d.type==='state'&&applyState(d));
    conn.on('close',()=>setSt('Disconnected',false));
    conn.on('error',e=>setErr('Error: '+e));
  });
  peer.on('error',e=>{setErr(e.type==='peer-unavailable'?'Room not found — check the code':e.type);});
}
function send(cmd){conn&&conn.open&&conn.send({cmd});}
function applyState(s){
  const tog=(id,on)=>document.getElementById(id)?.classList.toggle('on',on);
  tog('b-live',s.live);tog('b-blank',s.blanked);tog('b-freeze',s.frozen);tog('b-logo',s.logo);
  const sec=s.song?s.song+' · '+s.section:s.section;
  const se=document.getElementById('sl-section'),co=document.getElementById('sl-count');
  if(se)se.textContent=sec||'—';
  if(co)co.textContent=s.total>0?(s.cur+1)+' / '+s.total:'— / —';
}
function setSt(msg,on){const el=document.getElementById('status');el.textContent=msg;el.className=on?'on':'';}
function setErr(m){document.getElementById('err').textContent=m;}
<\/script>
</body>
</html>`;
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    injectFullscreenCSS();
    _wireCtrlK();
    setTimeout(() => {
      buildSmartLookup();
      addRemoteButton();
      buildRemoteModal();
    }, 400);
    console.info('[BW fix3.js v2] ✓ Fullscreen  ✓ Scripture lookup  ✓ Ctrl+K  ✓ Remote');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }

})();