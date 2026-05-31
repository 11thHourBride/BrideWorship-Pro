/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix8.js
   Enhanced Library Search

   1. Punctuation-agnostic matching
      "Im"  → matches "I'm"
      "dont"→ matches "Don't"
      "hes" → matches "He's"

   2. Slide-level results with highlighting
      Matches shown per slide, not just per song.
      Arrow keys navigate · Enter projects from that exact slide.
═══════════════════════════════════════════════════════════ */

(function BW_Fix8() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     TEXT NORMALISATION
     Strips punctuation so search works without it.
  ══════════════════════════════════════════════════════════ */

  function _norm(str) {
    return (str || '')
      .toLowerCase()
      /* apostrophes / smart quotes / curly quotes → remove */
      .replace(/['''\u2018\u2019\u201C\u201D\u201A\u201E"]/g, '')
      /* hyphens / dashes → space */
      .replace(/[-\u2013\u2014\u2012]/g, ' ')
      /* all other non-alphanumeric chars → remove */
      .replace(/[^a-z0-9\s]/g, '')
      /* collapse whitespace */
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Build normalised tokens from a query string */
  function _tokens(q) {
    return _norm(q).split(' ').filter(Boolean);
  }

  /* Returns true if ALL tokens appear in the normalised haystack */
  function _matches(haystack, tokens) {
    const h = _norm(haystack);
    return tokens.every(t => h.includes(t));
  }

  /* Find byte-position of first token in normalised text,
     so we can extract a context snippet */
  function _findPos(normHaystack, tokens) {
    for (const t of tokens) {
      const i = normHaystack.indexOf(t);
      if (i >= 0) return i;
    }
    return 0;
  }

  /* ══════════════════════════════════════════════════════════
     HIGHLIGHT HELPER
     Wraps every occurrence of every token in the raw (un-
     normalised) display text with a <mark> span.
     Works by aligning the normalised and raw strings.
  ══════════════════════════════════════════════════════════ */

  function _highlight(rawText, tokens) {
    if (!tokens.length) return _esc(rawText);

    /* Build a char-level map: normPos → rawPos */
    const raw  = rawText || '';
    const norm = _norm(raw);

    /* Simple approach: replace each token in the normalised
       string, then reconstruct the raw text around those positions */

    /* We'll use a mark array on the raw string */
    const rawLower = raw.toLowerCase()
      .replace(/['''\u2018\u2019\u201C\u201D"]/g, ' ')
      .replace(/[-\u2013\u2014]/g, ' ');

    /* For each token, find all occurrences in a relaxed raw lower */
    const marked = new Array(raw.length).fill(false);

    tokens.forEach(token => {
      let pos = 0;
      while (pos < rawLower.length) {
        /* Try exact match first */
        const idx = rawLower.indexOf(token, pos);
        if (idx === -1) break;
        for (let k = idx; k < idx + token.length && k < raw.length; k++) {
          marked[k] = true;
        }
        pos = idx + 1;
      }
    });

    /* Build output string */
    let out = '';
    let inMark = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = _esc(raw[i]);
      if (marked[i] && !inMark) { out += '<mark style="background:rgba(201,168,76,.4);color:#fff;border-radius:2px;padding:0 1px;">'; inMark = true; }
      if (!marked[i] && inMark) { out += '</mark>'; inMark = false; }
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
     SEARCH RESULT BUILDER
     Returns an array of result objects, one per matching slide.
  ══════════════════════════════════════════════════════════ */

  function _buildResults(query) {
    const tokens = _tokens(query);
    if (!tokens.length) return [];

    const results = [];

    (typeof SONGS !== 'undefined' ? SONGS : []).forEach((song, songIdx) => {
      /* Check title / author / tag first */
      const titleMatch  = _matches(song.title  || '', tokens);
      const authorMatch = _matches(song.author  || '', tokens);
      const tagMatch    = _matches(song.tag     || '', tokens);

      /* Check each slide */
      (song.slides || []).forEach((slide, slideIdx) => {
        const textMatch    = _matches(slide.text    || '', tokens);
        const sectionMatch = _matches(slide.section || '', tokens);

        if (!titleMatch && !authorMatch && !tagMatch && !textMatch && !sectionMatch) return;

        /* Build a readable snippet */
        let snippet = '';
        if (textMatch) {
          /* 60-char window around the first token occurrence */
          const normText = _norm(slide.text || '');
          const pos      = _findPos(normText, tokens);
          /* Map back to raw text character range (approximate) */
          const raw  = slide.text || '';
          const start = Math.max(0, Math.floor(pos * (raw.length / (normText.length || 1))) - 15);
          const end   = Math.min(raw.length, start + 80);
          snippet = (start > 0 ? '…' : '') + raw.slice(start, end).trim() + (end < raw.length ? '…' : '');
        } else {
          snippet = (slide.text || '').slice(0, 60).trim() + ((slide.text || '').length > 60 ? '…' : '');
        }

        results.push({
          songIdx,
          slideIdx,
          songTitle:    song.title    || 'Untitled',
          songAuthor:   song.author   || '',
          slideSection: slide.section || ('Slide ' + (slideIdx + 1)),
          snippet,
          titleMatch,
          tokens,
          /* Priority: title match = 10, slide text match = 5, section = 3, author/tag = 1 */
          score: (titleMatch ? 10 : 0) + (textMatch ? 5 : 0) + (sectionMatch ? 3 : 0)
            + (authorMatch || tagMatch ? 1 : 0),
        });
      });

      /* If only title/author/tag matched (no slide text), show slide 0 */
      if ((titleMatch || authorMatch || tagMatch) &&
          !results.some(r => r.songIdx === songIdx)) {
        results.push({
          songIdx, slideIdx: 0,
          songTitle:    song.title    || 'Untitled',
          songAuthor:   song.author   || '',
          slideSection: (song.slides?.[0]?.section) || 'Slide 1',
          snippet:      (song.slides?.[0]?.text || '').slice(0, 60),
          titleMatch, tokens,
          score: titleMatch ? 10 : 1,
        });
      }
    });

    /* Deduplicate song-level title hits (keep highest score per songIdx+slideIdx) */
    const seen = new Set();
    const deduped = results.filter(r => {
      const k = r.songIdx + ':' + r.slideIdx;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    /* Sort: highest score first, then alphabetically */
    deduped.sort((a, b) =>
      b.score - a.score || a.songTitle.localeCompare(b.songTitle)
    );

    return deduped.slice(0, 30); /* cap at 30 results */
  }

  /* ══════════════════════════════════════════════════════════
     DROPDOWN PANEL
  ══════════════════════════════════════════════════════════ */

  const CSS = `
    #bw-search-drop {
      position: absolute;
      left: 0; right: 0;
      top: calc(100% + 2px);
      background: var(--bg-card, #13131e);
      border: 1px solid var(--border-dim, rgba(255,255,255,.08));
      border-radius: 6px;
      box-shadow: 0 8px 32px rgba(0,0,0,.6);
      z-index: 9999;
      max-height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    #bw-search-drop::-webkit-scrollbar { width: 3px; }
    #bw-search-drop::-webkit-scrollbar-thumb { background: var(--border-dim); border-radius: 2px; }

    .bsd-song-header {
      padding: 6px 10px 3px;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
      background: rgba(201,168,76,.05);
      border-bottom: 1px solid var(--border-dim);
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .bsd-song-header .bsd-author {
      font-family: 'Lato', sans-serif;
      font-size: 9px;
      color: var(--text-3, #55535a);
      letter-spacing: 0;
      text-transform: none;
      font-weight: 400;
    }

    .bsd-item {
      padding: 6px 10px 6px 18px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,.03);
      transition: background .1s;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .bsd-item:hover,
    .bsd-item.focused {
      background: var(--bg-hover, rgba(255,255,255,.06));
    }
    .bsd-item.focused { outline: none; }

    .bsd-slide-tag {
      flex-shrink: 0;
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--text-3, #55535a);
      padding: 2px 5px;
      border: 1px solid var(--border-dim);
      border-radius: 3px;
      margin-top: 1px;
      white-space: nowrap;
      min-width: 52px;
      text-align: center;
    }
    .bsd-snippet {
      font-size: 11px;
      color: var(--text-2, #9a9890);
      line-height: 1.5;
      flex: 1;
      min-width: 0;
    }
    .bsd-snippet mark {
      background: rgba(201,168,76,.35);
      color: #fff;
      border-radius: 2px;
      padding: 0 1px;
    }

    .bsd-hint {
      padding: 8px 10px;
      font-size: 10px;
      color: var(--text-3, #55535a);
      text-align: center;
    }
    .bsd-empty {
      padding: 14px 10px;
      font-size: 11px;
      color: var(--text-3, #55535a);
      text-align: center;
    }
    .bsd-enter-hint {
      font-size: 9px;
      color: var(--gold, #c9a84c);
      opacity: .7;
      margin-left: auto;
      flex-shrink: 0;
      align-self: center;
      white-space: nowrap;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ── State ── */
  let _drop      = null;
  let _results   = [];
  let _focused   = -1;
  let _lastQuery = '';

  /* ── Get or create the dropdown ── */
  function _getDrop() {
    if (_drop && _drop.isConnected) return _drop;
    const searchInput = document.getElementById('search');
    if (!searchInput) return null;
    /* Parent must be position:relative */
    const parent = searchInput.parentElement;
    if (parent && window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    _drop = document.createElement('div');
    _drop.id = 'bw-search-drop';
    if (parent) parent.insertBefore(_drop, searchInput.nextSibling);
    return _drop;
  }

  /* ── Render dropdown ── */
  function _render(results, query) {
    const drop = _getDrop();
    if (!drop) return;
    _results = results;
    _focused = results.length ? 0 : -1;

    if (!query) { _hideDrop(); return; }

    if (!results.length) {
      drop.innerHTML = `<div class="bsd-empty">No results for <strong>"${_esc(query)}"</strong></div>`;
      drop.style.display = 'block';
      return;
    }

    let html     = '';
    let lastSong = -1;

    results.forEach((r, i) => {
      /* Song header when song changes */
      if (r.songIdx !== lastSong) {
        lastSong = r.songIdx;
        html += `<div class="bsd-song-header">
          ${_esc(r.songTitle)}
          ${r.songAuthor ? `<span class="bsd-author">— ${_esc(r.songAuthor)}</span>` : ''}
        </div>`;
      }

      const snipHL = _highlight(r.snippet, r.tokens);
      const isFocused = i === _focused;

      html += `<div class="bsd-item ${isFocused ? 'focused' : ''}"
        data-idx="${i}"
        onmousedown="event.preventDefault()"
        onclick="_bsdSelect(${i})">
        <span class="bsd-slide-tag">${_esc(r.slideSection)}</span>
        <span class="bsd-snippet">${snipHL}</span>
        ${isFocused ? '<span class="bsd-enter-hint">↵ Project</span>' : ''}
      </div>`;
    });

    html += `<div class="bsd-hint">
      ↑↓ navigate &nbsp;·&nbsp; ↵ project from highlighted slide &nbsp;·&nbsp; Esc close
    </div>`;

    drop.innerHTML  = html;
    drop.style.display = 'block';
  }

  /* ── Focus a result row ── */
  function _focusIdx(i) {
    _focused = Math.max(0, Math.min(_results.length - 1, i));
    /* Re-render to update focused class and Enter hint */
    _render(_results, _lastQuery);
    /* Scroll focused item into view */
    const drop = _getDrop();
    if (drop) {
      const item = drop.querySelector('.bsd-item.focused');
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }

  /* ── Select and project ── */
  window._bsdSelect = function (i) {
    const r = _results[i];
    if (!r) return;
    _hideDrop();
    document.getElementById('search').value = '';

    /* Load song */
    if (typeof loadSong === 'function') loadSong(r.songIdx);

    /* Jump to the matching slide on next tick (loadSong is sync, but
       renderQueue/renderSlide need to finish first) */
    requestAnimationFrame(() => {
      if (typeof jumpSlide === 'function') jumpSlide(r.slideIdx);
      /* Highlight the library item */
      document.querySelectorAll('#ls-songs .lib-item').forEach(el => el.classList.remove('sel'));
      document.getElementById('li-' + r.songIdx)?.classList.add('sel');
    });
  };

  /* ── Hide dropdown ── */
  function _hideDrop() {
    if (_drop) _drop.style.display = 'none';
    _results = [];
    _focused = -1;
    /* Restore the normal song list visibility */
    document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
      el.style.display = '';
    });
  }

  /* ══════════════════════════════════════════════════════════
     PATCH filterSongs  — runs on every keystroke
  ══════════════════════════════════════════════════════════ */

  window.filterSongs = function () {
    const q = document.getElementById('search')?.value.trim() || '';
    _lastQuery = q;

    if (!q) {
      _hideDrop();
      /* Show all songs */
      document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
        el.style.display = '';
      });
      return;
    }

    /* Hide the raw lib-item list while dropdown is showing */
    document.querySelectorAll('#ls-songs .lib-item').forEach(el => {
      el.style.display = 'none';
    });

    const results = _buildResults(q);
    _render(results, q);
  };

  /* ══════════════════════════════════════════════════════════
     KEYBOARD NAVIGATION ON THE SEARCH INPUT
  ══════════════════════════════════════════════════════════ */

  function _wireSearchInput() {
    const inp = document.getElementById('search');
    if (!inp || inp._fix8Wired) return;
    inp._fix8Wired = true;

    inp.addEventListener('keydown', e => {
      const dropVisible = _drop && _drop.style.display !== 'none';

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!dropVisible && _lastQuery) {
            /* Re-open if closed */
            _render(_results.length ? _results : _buildResults(_lastQuery), _lastQuery);
          }
          _focusIdx(_focused + 1);
          break;

        case 'ArrowUp':
          e.preventDefault();
          _focusIdx(_focused - 1);
          break;

        case 'Enter':
          e.preventDefault();
          if (dropVisible && _focused >= 0) {
            window._bsdSelect(_focused);
          } else if (_results.length) {
            /* No dropdown but have results — project best match */
            window._bsdSelect(0);
          }
          break;

        case 'Escape':
          _hideDrop();
          inp.value = '';
          filterSongs(); /* reset list */
          break;
      }
    });

    /* Hide dropdown when input loses focus (except when clicking a result) */
    inp.addEventListener('blur', () => {
      setTimeout(() => {
        /* Only hide if focus didn't move to a result item */
        const active = document.activeElement;
        if (!_drop?.contains(active)) _hideDrop();
      }, 180);
    });

    inp.addEventListener('focus', () => {
      /* Re-show dropdown if query is already typed */
      if (_lastQuery) filterSongs();
    });
  }

  /* ══════════════════════════════════════════════════════════
     ALSO PATCH the topbar Scripture tab to not reset song search
  ══════════════════════════════════════════════════════════ */

  /* Close dropdown when user clicks elsewhere in the library */
  document.addEventListener('click', e => {
    if (!_drop) return;
    const search = document.getElementById('search');
    if (!_drop.contains(e.target) && e.target !== search) {
      _hideDrop();
    }
  });

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    _wireSearchInput();

    /* Re-wire if library re-renders (e.g. after song import) */
    const _origBSL = window.buildSongLibrary;
    if (typeof _origBSL === 'function') {
      window.buildSongLibrary = function () {
        _origBSL();
        setTimeout(_wireSearchInput, 100);
      };
    }

    console.info(
      '[BW fix8.js] ✓ Punctuation-agnostic search  ' +
      '✓ Slide-level results  ✓ Enter projects from highlighted slide'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }

})();
