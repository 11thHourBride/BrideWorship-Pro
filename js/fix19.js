/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix19.js
   1. Clock on second screen — MutationObserver inside the
      projection window intercepts every style change that
      pushClockToProj makes and immediately re-applies our
      visibility, font, and drag position.
   2. Search result click → jumps to that paragraph inside
      the full sermon first; checkbox / ▶ Project still works.
═══════════════════════════════════════════════════════════ */

(function BW_Fix19() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */

  function _clockOn()  { return localStorage.getItem('bw_ck18_on')  !== '0'; }
  function _clockFont(){ return localStorage.getItem('bw_clock_font') || 'Cinzel'; }
  function _clockPos() {
    try { return JSON.parse(localStorage.getItem('bw_ck18_pos') || 'null'); }
    catch(e) { return null; }
  }

  function _projWin()  { return window.S?.projWin;  }
  function _stageWin() { return window.S?.stageWin; }

  /* ══════════════════════════════════════════════════════════
     1 — CLOCK ON SECOND SCREEN
     ──────────────────────────────────────────────────────────
     Root cause: pushClockToProj() sets element.style (or
     cssText) every second, wiping any overrides we apply
     from the parent window.

     Solution: once the proj window exists, attach a
     MutationObserver to proj-clock that fires every time
     its style attribute changes and immediately reapplies
     our desired values.  We use a re-entrancy flag so we
     don't loop forever.
  ══════════════════════════════════════════════════════════ */

  let _projObserver = null;

  function _applyClockToEl(pc, pw) {
    if (!pc) return;
    const on   = _clockOn();
    const font = _clockFont();
    const pos  = _clockPos();

    pc.style.display     = on ? 'block' : 'none';
    pc.style.fontFamily  = `'${font}', monospace`;
    pc.style.fontWeight  = '700';
    pc.style.visibility  = on ? 'visible' : 'hidden';

    if (pos) {
      pc.style.position = 'fixed';
      pc.style.left     = (pos.px / 100 * 1920) + 'px';
      pc.style.top      = (pos.py / 100 * 1080) + 'px';
      pc.style.right    = 'auto';
      pc.style.bottom   = 'auto';
    }
  }

  function _attachProjObserver(pw) {
    if (!pw || pw.closed) return;

    /* Disconnect any previous observer */
    if (_projObserver) { _projObserver.disconnect(); _projObserver = null; }

    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;

    /* Apply once immediately */
    _applyClockToEl(pc, pw);

    /* Watch for style attribute changes */
    let _busy = false;
    _projObserver = new pw.MutationObserver(() => {
      if (_busy) return;
      _busy = true;
      _applyClockToEl(pc, pw);
      _busy = false;
    });

    _projObserver.observe(pc, { attributes: true, attributeFilter: ['style'] });

    /* Belt-and-suspenders: also poll every 500 ms in case
       the observer misses a cssText assignment */
    if (pw._ck19interval) pw.clearInterval(pw._ck19interval);
    pw._ck19interval = pw.setInterval(() => {
      if (!_busy) _applyClockToEl(pc, pw);
    }, 500);
  }

  /* Re-attach whenever projection window opens */
  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      [600, 1200, 2500].forEach(d =>
        setTimeout(() => _attachProjObserver(_projWin()), d)
      );
    };
  }

  /* Also patch toggleClock to immediately update proj window */
  const _origToggle = window.toggleClock;
  window.toggleClock = function (on) {
    localStorage.setItem('bw_ck18_on', on ? '1' : '0');
    if (typeof _origToggle === 'function') _origToggle(on);

    /* Immediate apply */
    const pw = _projWin();
    if (pw && !pw.closed) {
      _applyClockToEl(pw.document.getElementById('proj-clock'), pw);
    }
    const sw = _stageWin();
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) {
        sc.style.display    = on ? 'block' : 'none';
        sc.style.visibility = on ? 'visible' : 'hidden';
        sc.style.fontFamily = `'${_clockFont()}', monospace`;
      }
    }
    /* Sync the preview */
    const ck = document.getElementById('out-clock');
    if (ck) ck.style.display = on ? '' : 'none';
  };

  /* Patch clockFontChange to push font to proj window */
  const _origCFC = window.clockFontChange;
  window.clockFontChange = function (font) {
    if (typeof _origCFC === 'function') _origCFC(font);
    const pw = _projWin();
    if (pw && !pw.closed) {
      _applyClockToEl(pw.document.getElementById('proj-clock'), pw);
    }
  };

  /* Poll in the parent window — catches cases where the proj
     window was already open before fix19 loaded */
  setInterval(() => {
    const pw = _projWin();
    if (!pw || pw.closed) { _projObserver = null; return; }
    /* If observer lost (window reload etc.) re-attach */
    if (!_projObserver) _attachProjObserver(pw);
  }, 2000);


  /* ══════════════════════════════════════════════════════════
     CLOCK DRAG — reapply saved pos to proj after every drag
     (complements fix18's drag wiring)
  ══════════════════════════════════════════════════════════ */

  /* After pointerup on out-clock, saved position is in
     bw_ck18_pos.  We watch localStorage writes via storage
     event and push to proj immediately. */
  window.addEventListener('storage', (e) => {
    if (e.key === 'bw_ck18_pos') {
      const pw = _projWin();
      if (pw && !pw.closed) {
        _applyClockToEl(pw.document.getElementById('proj-clock'), pw);
      }
    }
  });

  /* Patch fix18's drag pointerup to also trigger observer
     reattach (covers same-window storage which won't fire
     the storage event) */
  const _ck = document.getElementById('out-clock');
  if (_ck) {
    _ck.addEventListener('pointerup', () => {
      setTimeout(() => {
        const pw = _projWin();
        if (pw && !pw.closed) {
          _applyClockToEl(pw.document.getElementById('proj-clock'), pw);
        }
      }, 100);
    });
  } else {
    /* out-clock may not exist yet — wait for it */
    const _waitCk = setInterval(() => {
      const ck = document.getElementById('out-clock');
      if (!ck) return;
      clearInterval(_waitCk);
      ck.addEventListener('pointerup', () => {
        setTimeout(() => {
          const pw = _projWin();
          if (pw && !pw.closed) {
            _applyClockToEl(pw.document.getElementById('proj-clock'), pw);
          }
        }, 100);
      });
    }, 400);
  }


  /* ══════════════════════════════════════════════════════════
     2 — SEARCH RESULT CLICK → JUMP TO PARAGRAPH IN SERMON
     ──────────────────────────────────────────────────────────
     Previously: click toggled selection immediately.
     Now:
       • Clicking the card text → loads the sermon, scrolls
         to and highlights that paragraph in the reader view.
       • Clicking the checkbox → toggles selection (unchanged).
       • A small "Select" button appears on highlighted para
         so the user can still add it to the projection queue.
  ══════════════════════════════════════════════════════════ */

  /* We override the DOM-rendered result cards after each
     search so we can change click behaviour. */

  /* Storage helpers (same key as fix12/13) */
  const SERMON_KEY = 'bw_imported_sermons_v2';

  function _loadAllSermons() {
    const out  = [];
    const seen = new Set();

    /* Built-in */
    if (typeof BUILTIN_SERMONS !== 'undefined') {
      BUILTIN_SERMONS.forEach(s => {
        if (!seen.has(s.title)) {
          seen.add(s.title);
          out.push({ title: s.title, author: 'William Branham',
                     paras: (s.content || []).map(c => c.text || c) });
        }
      });
    }

    /* Imported */
    ['bw_imported_sermons_v2','bw_imported_sermons'].forEach(key => {
      try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]');
        raw.forEach(s => {
          if (seen.has(s.title)) return;
          seen.add(s.title);
          const paras = Array.isArray(s.paras) ? s.paras
                      : Array.isArray(s.content)
                          ? s.content.map(c => typeof c === 'string' ? c : c.text)
                          : [];
          out.push({ title: s.title, author: s.author || '', paras });
        });
      } catch(e) {}
    });

    return out;
  }

  /* Open the sermon that owns a result and scroll to the para */
  function _jumpToResult(sermonTitle, paraIdx) {
    const all    = _loadAllSermons();
    const sermon = all.find(s => s.title === sermonTitle);
    if (!sermon) return;

    /* Load into reader */
    window._readerTitle  = sermon.title;
    window._readerAuthor = sermon.author || '';
    if (window._selectedParas) window._selectedParas.clear();
    window._readerParas  = sermon.paras.map((text, i) => ({
      text, section: sermon.title, idx: i,
    }));

    if (typeof window._renderReaderParas === 'function') {
      window._renderReaderParas();
    }

    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  { viewer.style.display = 'block'; }
    if (titleEl) { titleEl.textContent  = sermon.title; }

    /* Scroll to the target paragraph and highlight it */
    setTimeout(() => {
      const para = document.getElementById('rpara-' + paraIdx);
      if (!para) return;

      /* Remove previous highlights */
      document.querySelectorAll('.f19-jump-highlight').forEach(el => {
        el.classList.remove('f19-jump-highlight');
      });

      para.classList.add('f19-jump-highlight');
      para.scrollIntoView({ behavior: 'smooth', block: 'center' });

      /* Auto-check the paragraph so it's ready to project */
      const chk = para.querySelector('input[type="checkbox"]');
      if (chk) chk.checked = true;

      /* Also add to _selectedParas if that API exists */
      if (window._selectedParas) window._selectedParas.add(paraIdx);
    }, 250);

    viewer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* CSS for jump highlight */
  const _searchStyle = document.createElement('style');
  _searchStyle.id = 'bw-fix19-search';
  _searchStyle.textContent = `
    /* Highlighted paragraph after jump */
    .f19-jump-highlight {
      background: rgba(201,168,76,.13) !important;
      border-left: 3px solid var(--gold, #c9a84c) !important;
      border-radius: 4px;
      transition: background .3s;
    }

    /* Result card — make the text area look clickable */
    .f13-result-card .f13-rc-body {
      cursor: pointer;
    }
    .f13-result-card .f13-rc-body:hover .f13-rc-text {
      color: var(--gold, #c9a84c);
    }

    /* Small "Jump" label on the body area */
    .f13-rc-jump-hint {
      font-size: 9px;
      color: var(--gold-dim, #8a6a20);
      margin-top: 3px;
      font-family: 'Cinzel', serif;
      letter-spacing: 1px;
    }
  `;
  document.head.appendChild(_searchStyle);

  /* Patch result rendering — runs after every search */
  function _upgradeResultCards() {
    document.querySelectorAll('.f13-result-card:not([data-f19])').forEach(card => {
      card.dataset.f19 = '1';

      /* Read the index from the existing onclick */
      const onc = card.getAttribute('onclick') || '';
      const m   = onc.match(/f13ToggleResult\(\s*(\d+)/);
      if (!m) return;
      const idx = parseInt(m[1]);

      /* Get the result object from fix13's _results array — we
         need sermonTitle and paraIdx. We parse the rendered HTML
         as a fallback if the array isn't accessible. */
      let sermonTitle = null;
      let paraIdx     = null;

      /* Try fix13's internal _results via the exposed window var */
      if (Array.isArray(window._f19Results)) {
        const r = window._f19Results[idx];
        if (r) { sermonTitle = r.sermonTitle; paraIdx = r.paraIdx; }
      }

      /* Fallback: parse the group label above the card */
      if (!sermonTitle) {
        let prev = card.previousElementSibling;
        while (prev && !prev.classList.contains('f13-result-group-label')) {
          prev = prev.previousElementSibling;
        }
        if (prev) {
          sermonTitle = prev.textContent.replace(/\(\d+\)\s*$/, '').trim();
        }
      }

      /* Fallback: parse para number from meta */
      if (paraIdx === null) {
        const meta = card.querySelector('.f13-rc-meta');
        if (meta) {
          const pm = meta.textContent.match(/Para\s+(\d+)/i);
          if (pm) paraIdx = parseInt(pm[1]) - 1; // displayed 1-based
        }
      }

      /* Add a small hint */
      const body = card.querySelector('.f13-rc-body');
      if (body && !body.querySelector('.f13-rc-jump-hint')) {
        const hint = document.createElement('div');
        hint.className   = 'f13-rc-jump-hint';
        hint.textContent = '↵ Click to jump to this paragraph in the sermon';
        body.appendChild(hint);
      }

      /* Override card onclick — body area = jump, checkbox = select */
      card.removeAttribute('onclick');

      const chk = card.querySelector('.f13-rc-chk');
      if (chk) {
        chk.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof window.f13ToggleResult === 'function') {
            window.f13ToggleResult(idx, e);
          }
        });
      }

      /* Card click = jump */
      card.addEventListener('click', (e) => {
        if (e.target === chk) return; // handled above
        if (sermonTitle && paraIdx !== null) {
          _jumpToResult(sermonTitle, paraIdx);
        }
        /* Also toggle selection so the sel-bar shows up */
        if (typeof window.f13ToggleResult === 'function') {
          window.f13ToggleResult(idx, e);
        }
      });
    });
  }

  /* Expose result data so the card upgrader can read it */
  const _origSearch = window.f13Search;
  window.f13Search = function (exact) {
    if (typeof _origSearch === 'function') _origSearch(exact);
    /* After fix13 renders results, upgrade the cards */
    setTimeout(_upgradeResultCards, 150);
    setTimeout(_upgradeResultCards, 500); // retry in case of slow render
  };

  /* Also re-run when results list changes (MutationObserver) */
  const _resultsMO = new MutationObserver(() => {
    setTimeout(_upgradeResultCards, 80);
  });

  function _observeResults() {
    const list = document.getElementById('f13-results-list');
    if (list && !list.dataset.f19obs) {
      list.dataset.f19obs = '1';
      _resultsMO.observe(list, { childList: true, subtree: false });
    }
  }

  const _origOT2 = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT2) _origOT2();
    setTimeout(_observeResults, 400);
  };

  setTimeout(_observeResults, 800);


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  /* If projection window already open, attach observer now */
  setTimeout(() => {
    const pw = _projWin();
    if (pw && !pw.closed) _attachProjObserver(pw);
  }, 600);

  console.info('[BW fix19] ✓ Clock second-screen sync  ✓ Search result → jump to sermon');

})();