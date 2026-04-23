/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix19.js  (v3)
   1. Clock on second screen — MutationObserver inside the
      projection window beats pushClockToProj every tick.
   2. Search result click:
      - Builds an exact result map (sermonTitle + paraIdx)
        from the same pool fix13 searches — stamped as
        data-attributes on every card.
      - Always forces the correct sermon to load first,
        replacing whatever is currently open.
      - Only THEN scrolls to and highlights the exact paragraph.
      - Checkbox click still just toggles selection.
═══════════════════════════════════════════════════════════ */

(function BW_Fix19() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CLOCK HELPERS
  ══════════════════════════════════════════════════════════ */

  function _clockOn()  { return localStorage.getItem('bw_ck18_on') !== '0'; }
  function _clockFont(){ return localStorage.getItem('bw_clock_font') || 'Cinzel'; }
  function _clockPos() {
    try { return JSON.parse(localStorage.getItem('bw_ck18_pos') || 'null'); }
    catch(e) { return null; }
  }
  function _projWin()  { return window.S?.projWin; }
  function _stageWin() { return window.S?.stageWin; }

  let _projObserver = null;

  function _applyClockToEl(pc) {
    if (!pc) return;
    const on  = _clockOn();
    const pos = _clockPos();
    pc.style.display    = on ? 'block' : 'none';
    pc.style.visibility = on ? 'visible' : 'hidden';
    pc.style.fontFamily = `'${_clockFont()}', monospace`;
    pc.style.fontWeight = '700';
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
    if (_projObserver) { try { _projObserver.disconnect(); } catch(e) {} _projObserver = null; }
    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;
    _applyClockToEl(pc);
    let _busy = false;
    _projObserver = new pw.MutationObserver(() => {
      if (_busy) return;
      _busy = true;
      _applyClockToEl(pc);
      _busy = false;
    });
    _projObserver.observe(pc, { attributes: true, attributeFilter: ['style'] });
    if (pw._ck19iv) pw.clearInterval(pw._ck19iv);
    pw._ck19iv = pw.setInterval(() => { if (!_busy) _applyClockToEl(pc); }, 500);
  }

  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      [700, 1400, 2500].forEach(d => setTimeout(() => _attachProjObserver(_projWin()), d));
    };
  }

  const _origToggle = window.toggleClock;
  window.toggleClock = function (on) {
    localStorage.setItem('bw_ck18_on', on ? '1' : '0');
    if (typeof _origToggle === 'function') _origToggle(on);
    const pw = _projWin();
    if (pw && !pw.closed) _applyClockToEl(pw.document.getElementById('proj-clock'));
    const sw = _stageWin();
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) { sc.style.display = on ? 'block' : 'none'; sc.style.visibility = on ? 'visible' : 'hidden'; }
    }
    const ck = document.getElementById('out-clock');
    if (ck) ck.style.display = on ? '' : 'none';
  };

  const _origCFC = window.clockFontChange;
  window.clockFontChange = function (font) {
    if (typeof _origCFC === 'function') _origCFC(font);
    const pw = _projWin();
    if (pw && !pw.closed) _applyClockToEl(pw.document.getElementById('proj-clock'));
  };

  function _hookDragEnd() {
    const ck = document.getElementById('out-clock');
    if (!ck || ck.dataset.f19drag) return;
    ck.dataset.f19drag = '1';
    ck.addEventListener('pointerup', () =>
      setTimeout(() => {
        const pw = _projWin();
        if (pw && !pw.closed) _applyClockToEl(pw.document.getElementById('proj-clock'));
      }, 120)
    );
  }

  setInterval(() => {
    const pw = _projWin();
    if (!pw || pw.closed) { _projObserver = null; return; }
    if (!_projObserver) _attachProjObserver(pw);
  }, 2000);


  /* ══════════════════════════════════════════════════════════
     SERMON POOL  (built-in + imported, normalised)
  ══════════════════════════════════════════════════════════ */

  function _getPool() {
    const pool = [];
    const seen = new Set();

    if (typeof BUILTIN_SERMONS !== 'undefined') {
      BUILTIN_SERMONS.forEach(s => {
        if (seen.has(s.title)) return;
        seen.add(s.title);
        pool.push({
          title:  s.title,
          author: 'William Branham',
          paras:  (s.content || []).map(c => typeof c === 'string' ? c : (c.text || '')),
        });
      });
    }

    ['bw_imported_sermons_v2', 'bw_imported_sermons'].forEach(key => {
      try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]');
        raw.forEach(s => {
          if (seen.has(s.title)) return;
          seen.add(s.title);
          const paras = Array.isArray(s.paras)   ? s.paras
                      : Array.isArray(s.content) ? s.content.map(c => typeof c === 'string' ? c : (c.text || ''))
                      : [];
          pool.push({ title: s.title, author: s.author || '', paras });
        });
      } catch(e) {}
    });

    return pool;
  }


  /* ══════════════════════════════════════════════════════════
     RESULT MAP  — mirrors fix13's search exactly
  ══════════════════════════════════════════════════════════ */

  /*
   * _resultMap[cardIndex] = { sermonTitle, paraIdx, text }
   * Rebuilt every time a search runs, BEFORE fix13 renders.
   * Cards are stamped with data-f19title / data-f19para
   * so click handlers never have to guess.
   */

  let _resultMap = {};

  function _buildResultMap(term, exact, scope) {
    _resultMap = {};
    if (!term) return;

    const q = term.trim().toLowerCase();
    let   pool;

    if (scope === 'current') {
      const title  = window._readerTitle  || '';
      const author = window._readerAuthor || '';
      const paras  = (window._readerParas || []).map(p => p.text);
      pool = [{ title, author, paras }];
    } else {
      pool = _getPool();
    }

    let idx = 0;
    pool.forEach(sermon => {
      sermon.paras.forEach((text, pi) => {
        const lo  = text.toLowerCase();
        const hit = exact
          ? lo.includes(q)
          : q.split(/\s+/).every(w => lo.includes(w));
        if (hit) {
          _resultMap[idx] = {
            sermonTitle: sermon.title,
            author:      sermon.author || '',
            paraIdx:     pi,
            text,
          };
          idx++;
        }
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     STAMP + WIRE CARDS
  ══════════════════════════════════════════════════════════ */

  function _stampAndWireCards() {
    document.querySelectorAll('.f13-result-card').forEach(card => {
      /* Get card index from id="f13-rc-N" */
      const m = (card.id || '').match(/f13-rc-(\d+)/);
      if (!m) return;
      const cardIdx = parseInt(m[1]);
      const r = _resultMap[cardIdx];
      if (!r) return;

      /* Stamp exact metadata */
      card.dataset.f19title = r.sermonTitle;
      card.dataset.f19para  = String(r.paraIdx);

      /* Only wire once */
      if (card.dataset.f19wired) return;
      card.dataset.f19wired = '1';

      /* Remove inline onclick */
      card.removeAttribute('onclick');

      /* Checkbox = toggle selection only, no navigation */
      const chk = card.querySelector('.f13-rc-chk');
      if (chk) {
        chk.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof window.f13ToggleResult === 'function') {
            window.f13ToggleResult(cardIdx, e);
          }
        });
      }

      /* Add jump hint text */
      const body = card.querySelector('.f13-rc-body');
      if (body && !body.querySelector('.f19-hint')) {
        const hint = document.createElement('div');
        hint.className   = 'f19-hint';
        hint.textContent = '↵ Click to open sermon at this quote';
        body.appendChild(hint);
      }

      /* Card click = force-open the correct sermon then scroll */
      card.addEventListener('click', (e) => {
        if (e.target === chk) return;

        const title   = card.dataset.f19title;
        const paraIdx = parseInt(card.dataset.f19para);

        _forceOpenSermonAndJump(title, paraIdx);

        /* Also mark selected so the action bar appears */
        if (typeof window.f13ToggleResult === 'function') {
          window.f13ToggleResult(cardIdx, e);
        }
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     CORE: FORCE-OPEN SERMON → SCROLL TO EXACT PARAGRAPH
     ──────────────────────────────────────────────────────────
     This runs regardless of what is currently open.
     Steps:
       1. Find the sermon in the pool.
       2. Overwrite ALL reader globals (title, author, paras).
       3. Call _renderReaderParas() to rebuild the paragraph list.
       4. Show the reader viewer and update its title.
       5. Wait for the DOM to update, then scroll to rpara-N
          and highlight it.
  ══════════════════════════════════════════════════════════ */

  function _forceOpenSermonAndJump(sermonTitle, paraIdx) {
    const pool   = _getPool();
    const sermon = pool.find(s => s.title === sermonTitle);

    if (!sermon) {
      if (typeof showSchToast === 'function') showSchToast('⚠ Sermon not found: ' + sermonTitle);
      return;
    }

    /* ── Close any open sermon first ── */
    /* Clear selection state */
    if (window._selectedParas) window._selectedParas.clear();

    /* ── Load the target sermon ── */
    window._readerTitle  = sermon.title;
    window._readerAuthor = sermon.author || '';
    window._readerParas  = sermon.paras.map((text, i) => ({
      text,
      section: sermon.title,
      idx:     i,
    }));

    /* Show viewer + set title */
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = sermon.title;

    /* Render the paragraph list */
    if (typeof window._renderReaderParas === 'function') {
      window._renderReaderParas();
    } else {
      _fallbackRender(sermon.paras, sermon.title);
    }

    /* ── Scroll + highlight ── */
    /* Use progressive delays: render may be async */
    [250, 500, 900].forEach(delay => {
      setTimeout(() => _scrollToParа(paraIdx), delay);
    });

    /* Toast */
    if (typeof showSchToast === 'function') {
      showSchToast(`📖 Opened: ${sermon.title}`);
    }
  }

  function _scrollToParа(paraIdx) {
    const target = document.getElementById('rpara-' + paraIdx);
    if (!target) return;

    /* Clear old highlights */
    document.querySelectorAll('.f19-highlight').forEach(el => {
      el.classList.remove('f19-highlight');
    });

    /* Highlight */
    target.classList.add('f19-highlight');

    /* Auto-check checkbox */
    const chk = target.querySelector('input[type="checkbox"]');
    if (chk && !chk.checked) chk.checked = true;
    if (window._selectedParas) window._selectedParas.add(paraIdx);

    /* Scroll into view */
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Fallback paragraph renderer if _renderReaderParas isn't available */
  function _fallbackRender(paras, title) {
    let list = document.getElementById('reader-para-list');
    if (!list) {
      const viewer = document.getElementById('reader-viewer');
      list = document.createElement('div');
      list.id = 'reader-para-list';
      if (viewer) viewer.appendChild(list);
    }
    list.innerHTML = paras.map((p, i) => `
      <div class="reader-para" id="rpara-${i}">
        <input type="checkbox" class="reader-para-chk">
        <div class="reader-para-num">${i + 1}</div>
        <div class="reader-para-text">${_esc(p)}</div>
      </div>`).join('');
  }

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }


  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */

  const _css = document.createElement('style');
  _css.id = 'bw-fix19-css';
  _css.textContent = `
    .f19-highlight {
      background: rgba(201,168,76,.18) !important;
      border-left: 3px solid var(--gold, #c9a84c) !important;
      border-radius: 0 4px 4px 0 !important;
      animation: f19pulse .7s ease;
    }
    @keyframes f19pulse {
      0%   { background: rgba(201,168,76,.45); }
      100% { background: rgba(201,168,76,.18); }
    }
    .f19-hint {
      font-size: 9px;
      color: var(--gold-dim, #8a6a20);
      font-family: 'Cinzel', serif;
      letter-spacing: 1px;
      margin-top: 3px;
    }
    .f13-result-card .f13-rc-body { cursor: pointer; }
    .f13-result-card:hover .f13-rc-text { color: var(--gold, #c9a84c); }
  `;
  document.head.appendChild(_css);


  /* ══════════════════════════════════════════════════════════
     PATCH f13Search — rebuild map first, then let fix13 render
  ══════════════════════════════════════════════════════════ */

  const _origSearch = window.f13Search;
  window.f13Search = function (exact) {
    const inp   = document.getElementById('f13-input');
    const term  = inp?.value.trim() || '';
    /* Read scope from fix13's state (default 'all') */
    const scope = window._f13Scope || 'all';

    /* Build map BEFORE fix13 renders so indices match */
    _buildResultMap(term, !!exact, scope);

    /* Let fix13 run its render */
    if (typeof _origSearch === 'function') _origSearch(exact);

    /* Stamp + wire after render */
    setTimeout(_stampAndWireCards, 200);
    setTimeout(_stampAndWireCards, 600);
  };

  /* Also intercept f13SetScope so our map knows the scope */
  const _origSetScope = window.f13SetScope;
  window.f13SetScope = function (scope) {
    window._f13Scope = scope;
    if (typeof _origSetScope === 'function') _origSetScope(scope);
  };

  /* Watch the results list for DOM mutations */
  const _mo = new MutationObserver(() => setTimeout(_stampAndWireCards, 80));

  function _observeResultsList() {
    const list = document.getElementById('f13-results-list');
    if (list && !list.dataset.f19obs) {
      list.dataset.f19obs = '1';
      _mo.observe(list, { childList: true });
    }
  }

  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    setTimeout(_observeResultsList, 400);
  };


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    let n = 0;
    const t = setInterval(() => {
      _hookDragEnd();
      if (document.getElementById('out-clock')?.dataset.f19drag || ++n > 30) clearInterval(t);
    }, 300);

    const pw = _projWin();
    if (pw && !pw.closed) _attachProjObserver(pw);

    _observeResultsList();

    console.info('[BW fix19] ✓ Clock sync  ✓ Force-open sermon + exact paragraph jump');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 350);

})();
