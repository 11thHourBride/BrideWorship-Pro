/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix8.js  (v2)
   Enhanced Library Search

   Ranking order (highest → lowest):
     1. Exact phrase in slide text       ← "Im bound…" matches "I'm bound…" first
     2. Exact phrase in song title
     3. Exact phrase in slide section label
     4. All tokens in slide text         (words scattered, not a phrase)
     5. All tokens in song title
     6. Author / tag / key
   Within the same rank, results are sorted alphabetically by title.

   Features:
   • Punctuation-agnostic  ("Im" → "I'm", "dont" → "Don't")
   • Per-slide results with highlighted snippets
   • ↑↓ keyboard navigation · Enter projects from that exact slide
   • Esc closes dropdown
═══════════════════════════════════════════════════════════ */

(function BW_Fix8() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     NORMALISATION  — strips punctuation so matching works
     without it.  Both query and haystack are normalised before
     any comparison; the original text is never modified.
  ══════════════════════════════════════════════════════════ */

  function _norm(str) {
    return (str || '')
      .toLowerCase()
      /* Apostrophes / curly quotes → remove  (I'm → im) */
      .replace(/['''\u2018\u2019\u201C\u201D\u201A\u201E"]/g, '')
      /* Hyphens / dashes → space  (God-given → god given) */
      .replace(/[-\u2013\u2014\u2012]/g, ' ')
      /* Everything else non-alphanumeric → remove */
      .replace(/[^a-z0-9\s]/g, '')
      /* Collapse whitespace */
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Individual tokens split from the query */
  function _tokens(normQ) {
    return normQ.split(' ').filter(Boolean);
  }

  /* True if the normalised haystack contains the full normalised phrase */
  function _hasPhrase(normHaystack, normPhrase) {
    return normPhrase.length > 0 && normHaystack.includes(normPhrase);
  }

  /* True if ALL tokens appear anywhere in the normalised haystack */
  function _hasAllTokens(normHaystack, tokens) {
    return tokens.every(t => normHaystack.includes(t));
  }

  /* ──────────────────────────────────────────────────────────
     SCORE TABLE
     Higher number = floats to the top of results.
  ────────────────────────────────────────────────────────── */
  const SCORE = {
    EXACT_PHRASE_TEXT   : 1000,   // "I'm bound for the promised land" — full phrase in lyrics
    EXACT_PHRASE_TITLE  :  800,   // full phrase in song title
    EXACT_PHRASE_SECTION:  600,   // full phrase in section label (VERSE, CHORUS, …)
    ALL_TOKENS_TEXT     :   50,   // every word found in lyrics (not necessarily consecutive)
    ALL_TOKENS_TITLE    :   40,   // every word found in title
    ALL_TOKENS_SECTION  :   20,   // every word found in section label
    AUTHOR_TAG          :    5,   // author / tag / key match
  };

  /* ══════════════════════════════════════════════════════════
     RESULT BUILDER
  ══════════════════════════════════════════════════════════ */

  function _buildResults(rawQuery) {
    const normQ  = _norm(rawQuery);
    const tokens = _tokens(normQ);
    if (!normQ || !tokens.length) return [];

    const results = [];
    /* Track which (songIdx, slideIdx) pairs we've already added */
    const seen = new Set();

    (typeof SONGS !== 'undefined' ? SONGS : []).forEach((song, songIdx) => {
      const normTitle  = _norm(song.title   || '');
      const normAuthor = _norm(song.author  || '');
      const normTag    = _norm(song.tag     || '');
      const normKey    = _norm(song.key     || '');

      const titlePhraseMatch  = _hasPhrase(normTitle,  normQ);
      const titleTokenMatch   = !titlePhraseMatch && _hasAllTokens(normTitle, tokens);
      const metaMatch = _hasAllTokens(normAuthor, tokens)
                     || _hasAllTokens(normTag,    tokens)
                     || _hasAllTokens(normKey,    tokens);

      /* ── Per-slide scoring ── */
      (song.slides || []).forEach((slide, slideIdx) => {
        const normText    = _norm(slide.text    || '');
        const normSection = _norm(slide.section || '');

        const textPhraseMatch   = _hasPhrase(normText,    normQ);
        const secPhraseMatch    = _hasPhrase(normSection,  normQ);
        const textTokenMatch    = !textPhraseMatch  && _hasAllTokens(normText,    tokens);
        const secTokenMatch     = !secPhraseMatch   && _hasAllTokens(normSection, tokens);

        /* Calculate score — additive; highest single component drives ranking */
        let score = 0;
        if (textPhraseMatch)   score += SCORE.EXACT_PHRASE_TEXT;
        if (titlePhraseMatch)  score += SCORE.EXACT_PHRASE_TITLE;
        if (secPhraseMatch)    score += SCORE.EXACT_PHRASE_SECTION;
        if (textTokenMatch)    score += SCORE.ALL_TOKENS_TEXT;
        if (titleTokenMatch)   score += SCORE.ALL_TOKENS_TITLE;
        if (secTokenMatch)     score += SCORE.ALL_TOKENS_SECTION;
        if (metaMatch)         score += SCORE.AUTHOR_TAG;

        if (score === 0) return; /* no match at all */

        const key = songIdx + ':' + slideIdx;
        if (seen.has(key)) return;
        seen.add(key);

        /* Snippet: 80-char window around the first match in the raw slide text */
        let snippet = '';
        const raw = slide.text || '';
        if (textPhraseMatch || textTokenMatch) {
          /* Find approximate position in raw text */
          const approxPos = (() => {
            const rawLower = raw.toLowerCase();
            /* Try exact phrase first (after light apostrophe strip) */
            const lightNorm = raw.replace(/['''\u2018\u2019]/g, '').toLowerCase();
            const phrasePos = lightNorm.indexOf(normQ.replace(/\s+/g,' '));
            if (phrasePos >= 0) return phrasePos;
            /* Fall back to first token position */
            for (const t of tokens) {
              const p = rawLower.indexOf(t);
              if (p >= 0) return p;
            }
            return 0;
          })();
          const start = Math.max(0, approxPos - 12);
          const end   = Math.min(raw.length, start + 85);
          snippet = (start > 0 ? '…' : '') + raw.slice(start, end).trim()
                  + (end < raw.length ? '…' : '');
        } else {
          /* Title / meta match only — show beginning of slide text */
          snippet = raw.slice(0, 70).trim() + (raw.length > 70 ? '…' : '');
        }

        results.push({
          songIdx, slideIdx,
          songTitle   : song.title    || 'Untitled',
          songAuthor  : song.author   || '',
          slideSection: slide.section || ('Slide ' + (slideIdx + 1)),
          snippet,
          score,
          /* Pass normQ and tokens to the highlighter */
          normQ,
          tokens,
          /* Badge: show which kind of match this is */
          matchType: textPhraseMatch  ? 'phrase'
                   : titlePhraseMatch ? 'title'
                   : secPhraseMatch   ? 'section'
                   : textTokenMatch   ? 'words'
                   : 'meta',
        });
      });

      /* If ONLY title/meta matched (no slide scored), add slide 0 as a
         representative entry so the song still appears */
      const songHasEntry = results.some(r => r.songIdx === songIdx);
      if (!songHasEntry && (titlePhraseMatch || titleTokenMatch || metaMatch)) {
        const slide0 = song.slides?.[0];
        const key    = songIdx + ':0';
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            songIdx, slideIdx: 0,
            songTitle   : song.title    || 'Untitled',
            songAuthor  : song.author   || '',
            slideSection: slide0?.section || 'Slide 1',
            snippet     : (slide0?.text || '').slice(0, 70),
            score       : titlePhraseMatch
              ? SCORE.EXACT_PHRASE_TITLE
              : titleTokenMatch
                ? SCORE.ALL_TOKENS_TITLE
                : SCORE.AUTHOR_TAG,
            normQ, tokens,
            matchType: titlePhraseMatch ? 'title' : 'meta',
          });
        }
      }
    });

    /* ── Sort: score DESC, then title ASC ── */
    results.sort((a, b) =>
      b.score - a.score || a.songTitle.localeCompare(b.songTitle)
    );

    return results.slice(0, 35);
  }

  /* ══════════════════════════════════════════════════════════
     HIGHLIGHT HELPER
     Marks matching characters in the raw display text.
  ══════════════════════════════════════════════════════════ */

  function _highlight(rawText, normQ, tokens) {
    if (!rawText) return '';
    const raw = String(rawText);

    /* Build a bool array: marked[i] = true means raw[i] should be highlighted */
    const marked = new Array(raw.length).fill(false);

    /* Relaxed lowercase version for position scanning */
    const rawRelax = raw
      .replace(/['''\u2018\u2019\u201C\u201D"]/g, ' ')
      .replace(/[-\u2013\u2014]/g, ' ')
      .replace(/[^a-z0-9\s]/gi, ' ')
      .toLowerCase();

    /* Try to mark the full phrase first */
    if (normQ) {
      let pos = 0;
      while (pos < rawRelax.length) {
        const idx = rawRelax.indexOf(normQ, pos);
        if (idx === -1) break;
        for (let k = idx; k < Math.min(idx + normQ.length, raw.length); k++) marked[k] = true;
        pos = idx + 1;
      }
    }

    /* Also mark individual tokens so partial matches show highlights */
    tokens.forEach(token => {
      let pos = 0;
      while (pos < rawRelax.length) {
        const idx = rawRelax.indexOf(token, pos);
        if (idx === -1) break;
        for (let k = idx; k < Math.min(idx + token.length, raw.length); k++) marked[k] = true;
        pos = idx + 1;
      }
    });

    /* Build HTML */
    let out = '', inMark = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = _esc(raw[i]);
      if (marked[i]  && !inMark) { out += '<mark>'; inMark = true; }
      if (!marked[i] && inMark)  { out += '</mark>'; inMark = false; }
      out += ch;
    }
    if (inMark) out += '</mark>';
    return out;
  }

  function _esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */

  document.head.insertAdjacentHTML('beforeend', `<style id="bw-fix8-css">
    #bw-search-drop {
      position:absolute; left:0; right:0; top:calc(100% + 2px);
      background:var(--bg-card,#13131e);
      border:1px solid var(--border-dim,rgba(255,255,255,.08));
      border-radius:6px;
      box-shadow:0 8px 32px rgba(0,0,0,.6);
      z-index:9999;
      max-height:390px;
      overflow-y:auto; overflow-x:hidden;
    }
    #bw-search-drop::-webkit-scrollbar{width:3px;}
    #bw-search-drop::-webkit-scrollbar-thumb{background:var(--border-dim);border-radius:2px;}

    /* Song group header */
    .bsd-song-header {
      padding:6px 10px 3px;
      font-family:'Cinzel',serif; font-size:9px;
      letter-spacing:2px; text-transform:uppercase;
      color:var(--gold,#c9a84c);
      background:rgba(201,168,76,.06);
      border-bottom:1px solid var(--border-dim);
      display:flex; align-items:baseline; gap:6px;
      position:sticky; top:0; z-index:2;
    }
    .bsd-song-header .bsd-author {
      font-family:'Lato',sans-serif; font-size:9px;
      color:var(--text-3,#55535a);
      letter-spacing:0; text-transform:none; font-weight:400;
    }

    /* Result row */
    .bsd-item {
      padding:6px 10px 6px 18px;
      cursor:pointer;
      border-bottom:1px solid rgba(255,255,255,.03);
      transition:background .1s;
      display:flex; gap:8px; align-items:flex-start;
    }
    .bsd-item:hover, .bsd-item.focused {
      background:var(--bg-hover,rgba(255,255,255,.06));
    }

    /* Slide section tag */
    .bsd-slide-tag {
      flex-shrink:0;
      font-family:'Cinzel',serif; font-size:8px;
      letter-spacing:1px; text-transform:uppercase;
      color:var(--text-3,#55535a);
      padding:2px 5px;
      border:1px solid var(--border-dim); border-radius:3px;
      margin-top:1px; white-space:nowrap; min-width:52px; text-align:center;
    }

    /* Match-type pill — tells user WHY this result appeared */
    .bsd-match-pill {
      flex-shrink:0; align-self:center;
      font-size:7px; font-family:'Lato',sans-serif;
      padding:1px 5px; border-radius:10px;
      letter-spacing:.5px; text-transform:uppercase;
      white-space:nowrap;
    }
    .bsd-match-pill.phrase  { background:rgba(201,168,76,.25); color:var(--gold,#c9a84c); border:1px solid rgba(201,168,76,.4); }
    .bsd-match-pill.title   { background:rgba(74,144,217,.2);  color:#6ab0ff;             border:1px solid rgba(74,144,217,.35); }
    .bsd-match-pill.section { background:rgba(76,175,122,.15); color:#6fdfab;             border:1px solid rgba(76,175,122,.3); }
    .bsd-match-pill.words   { background:rgba(255,255,255,.06);color:var(--text-2);       border:1px solid var(--border-dim); }
    .bsd-match-pill.meta    { background:rgba(255,255,255,.04);color:var(--text-3);       border:1px solid var(--border-dim); }

    /* Snippet text */
    .bsd-snippet {
      font-size:11px; color:var(--text-2,#9a9890);
      line-height:1.5; flex:1; min-width:0;
    }
    .bsd-snippet mark {
      background:rgba(201,168,76,.38); color:#fff;
      border-radius:2px; padding:0 1px;
    }

    /* "↵ Project" hint on focused row */
    .bsd-enter-hint {
      font-size:9px; color:var(--gold,#c9a84c); opacity:.75;
      margin-left:auto; flex-shrink:0; align-self:center;
      white-space:nowrap; font-family:'Cinzel',serif; letter-spacing:1px;
    }

    /* Footer hint */
    .bsd-footer-hint {
      padding:6px 10px;
      font-size:9px; color:var(--text-3,#55535a);
      text-align:center;
      border-top:1px solid var(--border-dim);
      font-family:'Lato',sans-serif;
    }
    .bsd-empty {
      padding:14px 10px; font-size:11px;
      color:var(--text-3,#55535a); text-align:center;
    }
  </style>`);

  /* ══════════════════════════════════════════════════════════
     DROPDOWN STATE
  ══════════════════════════════════════════════════════════ */

  let _drop      = null;
  let _results   = [];
  let _focused   = -1;
  let _lastQuery = '';

  /* ── Get / create dropdown element ── */
  function _getDrop() {
    if (_drop && _drop.isConnected) return _drop;
    const inp = document.getElementById('search');
    if (!inp) return null;
    const parent = inp.parentElement;
    if (parent && window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    _drop = document.createElement('div');
    _drop.id = 'bw-search-drop';
    if (parent) parent.insertBefore(_drop, inp.nextSibling);
    return _drop;
  }

  /* ── Render the dropdown ── */
  function _render(results, query) {
    const drop = _getDrop();
    if (!drop) return;
    _results = results;
    if (_focused >= results.length) _focused = results.length ? 0 : -1;

    if (!query) { _hideDrop(); return; }

    if (!results.length) {
      drop.innerHTML = `<div class="bsd-empty">No results for <strong>"${_esc(query)}"</strong></div>`;
      drop.style.display = 'block';
      return;
    }

    let html     = '';
    let lastSong = -1;

    const PILL_LABEL = { phrase:'Exact phrase', title:'Title match',
                         section:'Section', words:'All words', meta:'Author/Tag' };

    results.forEach((r, i) => {
      /* Song group header when song changes */
      if (r.songIdx !== lastSong) {
        lastSong = r.songIdx;
        html += `<div class="bsd-song-header">
          ${_esc(r.songTitle)}
          ${r.songAuthor
            ? `<span class="bsd-author">— ${_esc(r.songAuthor)}</span>`
            : ''}
        </div>`;
      }

      const focused   = i === _focused;
      const snipHL    = _highlight(r.snippet, r.normQ, r.tokens);
      const pillLabel = PILL_LABEL[r.matchType] || '';

      html += `<div class="bsd-item ${focused ? 'focused' : ''}"
        data-idx="${i}"
        onmousedown="event.preventDefault()"
        onclick="_bsdSelect(${i})">
        <span class="bsd-slide-tag">${_esc(r.slideSection)}</span>
        <span class="bsd-snippet">${snipHL}</span>
        <span class="bsd-match-pill ${_esc(r.matchType)}">${pillLabel}</span>
        ${focused ? '<span class="bsd-enter-hint">↵ Project</span>' : ''}
      </div>`;
    });

    html += `<div class="bsd-footer-hint">
      ↑↓ navigate &nbsp;·&nbsp; ↵ project from highlighted slide &nbsp;·&nbsp; Esc close
    </div>`;

    drop.innerHTML  = html;
    drop.style.display = 'block';
  }

  /* ── Move keyboard focus ── */
  function _focusIdx(i) {
    if (!_results.length) return;
    _focused = Math.max(0, Math.min(_results.length - 1, i));
    _render(_results, _lastQuery);
    const drop = _getDrop();
    drop?.querySelector('.bsd-item.focused')
        ?.scrollIntoView({ block:'nearest' });
  }

  /* ── Select and project ── */
  window._bsdSelect = function (i) {
    const r = _results[i];
    if (!r) return;
    _hideDrop();
    const inp = document.getElementById('search');
    if (inp) inp.value = '';
    _lastQuery = '';

    /* Load song then jump to the exact slide */
    if (typeof loadSong === 'function') loadSong(r.songIdx);
    requestAnimationFrame(() => {
      if (typeof jumpSlide === 'function') jumpSlide(r.slideIdx);
      document.querySelectorAll('#ls-songs .lib-item').forEach(el => el.classList.remove('sel'));
      document.getElementById('li-' + r.songIdx)?.classList.add('sel');
    });
  };

  /* ── Hide dropdown ── */
  function _hideDrop() {
    if (_drop) _drop.style.display = 'none';
    _results = [];
    _focused = -1;
    /* Restore library list */
    document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
      el.style.display = '';
    });
  }

  /* ══════════════════════════════════════════════════════════
     PATCH filterSongs
  ══════════════════════════════════════════════════════════ */

  window.filterSongs = function () {
    const q = document.getElementById('search')?.value.trim() || '';
    _lastQuery = q;

    if (!q) {
      _hideDrop();
      document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
        el.style.display = '';
      });
      return;
    }

    /* Hide raw list while dropdown is active */
    document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
      el.style.display = 'none';
    });

    const results = _buildResults(q);
    if (_focused === -1 && results.length) _focused = 0;
    _render(results, q);
  };

  /* ══════════════════════════════════════════════════════════
     KEYBOARD WIRING ON #search
  ══════════════════════════════════════════════════════════ */

  function _wireSearch() {
    const inp = document.getElementById('search');
    if (!inp || inp._fix8Wired) return;
    inp._fix8Wired = true;

    inp.addEventListener('keydown', e => {
      const open = _drop && _drop.style.display !== 'none';

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open && _lastQuery) _render(
            _results.length ? _results : _buildResults(_lastQuery), _lastQuery
          );
          _focusIdx(_focused < 0 ? 0 : _focused + 1);
          break;

        case 'ArrowUp':
          e.preventDefault();
          _focusIdx(_focused - 1);
          break;

        case 'Enter':
          e.preventDefault();
          if (open && _focused >= 0) {
            window._bsdSelect(_focused);
          } else if (_results.length) {
            window._bsdSelect(0);
          }
          break;

        case 'Escape':
          e.preventDefault();
          _hideDrop();
          inp.value = '';
          _lastQuery = '';
          break;
      }
    });

    inp.addEventListener('blur', () => {
      setTimeout(() => {
        if (!_drop?.contains(document.activeElement)) _hideDrop();
      }, 180);
    });

    inp.addEventListener('focus', () => {
      if (_lastQuery) filterSongs();
    });
  }

  /* ══════════════════════════════════════════════════════════
     CLOSE ON OUTSIDE CLICK
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('click', e => {
    if (!_drop) return;
    const inp = document.getElementById('search');
    if (!_drop.contains(e.target) && e.target !== inp) _hideDrop();
  });

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    _wireSearch();
    /* Re-wire after song library rebuild (import etc.) */
    const _origBSL = window.buildSongLibrary;
    if (typeof _origBSL === 'function') {
      window.buildSongLibrary = function () {
        _origBSL();
        setTimeout(_wireSearch, 100);
      };
    }
    console.info(
      '[BW fix8.js v2] ✓ Exact phrase first  ' +
      '✓ Punctuation-agnostic  ✓ Slide-level  ✓ Enter projects'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }

})();
