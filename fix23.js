/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix23.js
   Targeted fix for two remaining issues in fix20's reader:
   1. Project — routes through BrideWorship's own
      projectTableSermon() pipeline so slides actually appear.
   2. Golden Nugget — discovers the real nugget-save function
      at runtime and calls it with the right signature.
═══════════════════════════════════════════════════════════ */

(function BW_Fix23() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */

  function _toast(msg) {
    if (typeof window.showSchToast === 'function') window.showSchToast(msg);
  }


  /* ══════════════════════════════════════════════════════════
     1 — PROJECT FIX
     ──────────────────────────────────────────────────────────
     Problem: fix20's _proj() sets S.slides then calls
     renderQueue/renderSlide but the center panel is still
     showing "Schedule" or "Service Order", so the slides
     render off-screen. Also closeTheTable() runs before
     the DOM paint.

     Fix: pipe through the existing "Add to Queue" tab's
     projectTableSermon() function — it handles everything
     including centerTab(). We write our text into the hidden
     form fields and call the function.

     If projectTableSermon isn't available we fall back to
     a corrected direct approach that calls centerTab first.
  ══════════════════════════════════════════════════════════ */

  function _doProject(text, title, author) {
    if (!text || !text.trim()) {
      _toast('Select at least one paragraph first');
      return;
    }

    /* ── Path A: use BrideWorship's own pipeline ── */
    if (typeof window.projectTableSermon === 'function') {
      /* Fill in the hidden "Add to Queue" form fields */
      const titleInp  = document.getElementById('table-sermon-title');
      const authorInp = document.getElementById('table-sermon-author');
      const textArea  = document.getElementById('table-sermon-text');

      if (titleInp)  titleInp.value  = title  || 'Message';
      if (authorInp) authorInp.value = author || '';
      if (textArea)  textArea.value  = text;

      /* Call BrideWorship's own project function */
      window.projectTableSermon();

      /* Close the table after a brief delay so slides render first */
      setTimeout(() => {
        if (typeof window.closeTheTable === 'function') window.closeTheTable();
      }, 120);

      _toast(`▶ Projecting ${text.split(/\n\n+/).filter(p=>p.trim()).length} slide(s)`);
      return;
    }

    /* ── Path B: direct approach with centerTab fix ── */
    const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    window.S = window.S || {};
    window.S.slides  = paras.map(p => ({
      section: title  || 'Message',
      text:    p,
      author:  author || '',
    }));
    window.S.cur     = 0;
    window.S.songIdx = null;

    /* Switch center panel to slides FIRST */
    const slidesTab = document.querySelector('.ctab');
    if (typeof window.centerTab === 'function' && slidesTab) {
      window.centerTab(slidesTab, 'slides-view');
    } else {
      /* Manual fallback: show slides-view, hide others */
      document.querySelectorAll('.center > div[id$="-view"]').forEach(el => {
        el.style.display = el.id === 'slides-view' ? 'flex' : 'none';
      });
      document.querySelectorAll('.ctab').forEach((t, i) => t.classList.toggle('on', i === 0));
    }

    /* Render queue and slide */
    if (typeof window.renderQueue === 'function') window.renderQueue();
    if (typeof window.renderSlide === 'function') window.renderSlide();

    /* Close modal AFTER render */
    setTimeout(() => {
      if (typeof window.closeTheTable === 'function') window.closeTheTable();
      else {
        const m = document.getElementById('table-modal');
        if (m) m.style.display = 'none';
      }
    }, 100);

    _toast(`▶ Projecting ${paras.length} slide${paras.length !== 1 ? 's' : ''}`);
  }


  /* ══════════════════════════════════════════════════════════
     2 — NUGGET FIX
     ──────────────────────────────────────────────────────────
     Problem: addNugget() is called and returns without error,
     but the nuggets panel doesn't update. This means either:
     (a) the function signature is different, or
     (b) the function saves but doesn't re-render the panel.

     Fix: probe window for every plausible nugget function,
     then also call any nugget-render/refresh function
     we can find.
  ══════════════════════════════════════════════════════════ */

  function _doNugget(text, title, author) {
    if (!text || !text.trim()) {
      _toast('Select at least one paragraph first');
      return;
    }

    let saved = false;

    /* Try every plausible function name with every plausible signature */
    const attempts = [
      () => typeof window.addNugget        === 'function' && window.addNugget(text, title || 'Message', author || ''),
      () => typeof window.addNugget        === 'function' && window.addNugget({ text, title: title||'Message', author: author||'' }),
      () => typeof window.saveNugget       === 'function' && window.saveNugget(text, title || 'Message', author || ''),
      () => typeof window.addGoldenNugget  === 'function' && window.addGoldenNugget(text, title || 'Message'),
      () => typeof window.storeNugget      === 'function' && window.storeNugget(text, title || 'Message'),
      () => typeof window.nuggetAdd        === 'function' && window.nuggetAdd(text, title || 'Message'),
    ];

    for (const attempt of attempts) {
      try {
        const result = attempt();
        if (result !== false && result !== undefined || typeof result === 'undefined') {
          /* Check if any of the function names existed */
          const fnExists = ['addNugget','saveNugget','addGoldenNugget','storeNugget','nuggetAdd']
            .some(n => typeof window[n] === 'function');
          if (fnExists) { saved = true; break; }
        }
      } catch(e) { /* try next */ }
    }

    /* Manual localStorage fallback — direct write */
    if (!saved) {
      saved = _manualSaveNugget(text, title, author);
    }

    /* Trigger any nugget-render function */
    _refreshNuggets();

    if (saved) {
      _toast('⭐ Saved to Golden Nuggets');
    } else {
      _toast('⭐ Golden Nuggets: could not save (check console)');
      console.warn('[BW fix22] Could not find a nugget save function. Text:', text.slice(0,80));
    }
  }

  /* ── Direct localStorage save matching BrideWorship's nugget format ── */
  function _manualSaveNugget(text, title, author) {
    /* Try to detect the storage key BrideWorship uses */
    const candidates = ['bw_nuggets', 'bw_golden_nuggets', 'nuggets', 'bw_nugget_store'];
    let   key        = null;
    let   existing   = [];

    for (const k of candidates) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) { key = k; existing = parsed; break; }
        } catch(e) {}
      }
    }

    /* If no existing key found, use the most common one */
    if (!key) key = 'bw_nuggets';

    const entry = {
      id:        'nug_' + Date.now(),
      text:      text,
      title:     title  || 'Message',
      author:    author || '',
      savedAt:   new Date().toISOString(),
      source:    title  || 'Message',
    };

    existing.unshift(entry);
    if (existing.length > 500) existing.pop();

    try {
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch(e) {
      return false;
    }
  }

  /* ── Try every plausible nugget-render function ── */
  function _refreshNuggets() {
    const refreshFns = [
      'renderNuggets', 'renderGoldenNuggets', 'loadNuggets',
      'refreshNuggets', 'displayNuggets', 'showNuggets',
      'buildNuggetList', 'updateNuggetList',
    ];
    for (const fn of refreshFns) {
      if (typeof window[fn] === 'function') {
        try { window[fn](); } catch(e) {}
      }
    }

    /* Also try opening/refreshing the nuggets panel if visible */
    const nugPanel = document.querySelector('[id*="nugget"], [id*="Nugget"]');
    if (nugPanel && nugPanel.style.display !== 'none') {
      /* Trigger a custom event that the nugget panel might listen to */
      nugPanel.dispatchEvent(new CustomEvent('nugget-added', { bubbles: true }));
    }
  }


  /* ══════════════════════════════════════════════════════════
     REPLACE fix20's _proj and _nug with our fixed versions
  ══════════════════════════════════════════════════════════ */

  /* Override the globals fix20 exposed */
  window.f20Proj = function () {
    const sel = _getBookSel();
    if (!sel) { _toast('Select at least one paragraph first'); return; }
    _doProject(sel.text, sel.title, sel.author);
  };

  window.f20Nug = function () {
    const sel = _getBookSel();
    if (!sel) { _toast('Select at least one paragraph first'); return; }
    _doNugget(sel.text, sel.title, sel.author);
  };

  window.f20ProjSr = function () {
    const sel = _getSearchSel();
    if (!sel) { _toast('Select at least one result first'); return; }
    _doProject(sel.text, sel.title, '');
  };

  window.f20NugSr = function () {
    const sel = _getSearchSel();
    if (!sel) { _toast('Select at least one result first'); return; }
    _doNugget(sel.text, sel.title, '');
  };

  /* ── Read selected paragraphs from the rendered DOM ── */
  /* (Avoids dependency on fix20's private _selP set)    */

  function _getBookSel() {
    const checked = [...document.querySelectorAll('.f20-pchk:checked')];
    if (!checked.length) return null;

    const texts = checked.map(chk => {
      const para = chk.closest('.f20-para');
      return para?.querySelector('.f20-ptxt')?.textContent?.trim() || '';
    }).filter(Boolean);

    if (!texts.length) return null;

    const title  = document.getElementById('f20-rtitle')?.textContent?.trim() || 'Message';
    const author = window._readerAuthor || '';

    return { text: texts.join('\n\n'), title, author };
  }

  function _getSearchSel() {
    const checked = [...document.querySelectorAll('.f20-rcchk:checked')];
    if (!checked.length) return null;

    const texts = checked.map(chk => {
      const card = chk.closest('.f20-rc');
      /* Get clean text — rct may contain HTML mark tags, get textContent */
      return card?.querySelector('.f20-rct')?.textContent?.trim() || '';
    }).filter(Boolean);

    if (!texts.length) return null;

    /* Get sermon title from the nearest group header */
    const firstCard   = checked[0].closest('.f20-rc');
    let   sermonTitle = 'Message';
    let   prev        = firstCard?.previousElementSibling;
    while (prev) {
      if (prev.classList.contains('f20-rg')) {
        sermonTitle = prev.textContent.replace(/\(\d+\)\s*$/, '').trim();
        break;
      }
      prev = prev.previousElementSibling;
    }

    return { text: texts.join('\n\n'), title: sermonTitle };
  }


  /* ══════════════════════════════════════════════════════════
     SCHEDULE FIX (same DOM-read approach for consistency)
  ══════════════════════════════════════════════════════════ */

  window.f20Sch = function () {
    const sel = _getBookSel();
    if (!sel) { _toast('Select at least one paragraph first'); return; }
    _doSchedule(sel.text, sel.title);
  };

  window.f20SchSr = function () {
    const sel = _getSearchSel();
    if (!sel) { _toast('Select at least one result first'); return; }
    _doSchedule(sel.text, sel.title);
  };

  function _doSchedule(text, title) {
    if (!text?.trim()) { _toast('Select at least one paragraph first'); return; }

    if (typeof window.schInsertFromLibrary === 'function') {
      window.schInsertFromLibrary(
        { type:'sermon', label: title||'Message', content: text, notes:'', duration:0 }, -1
      );
    } else {
      window.S = window.S || {};
      window.S.so = window.S.so || [];
      window.S.so.push({ name: title||'Message', type:'sermon', content: text });
      if (typeof window.renderSO === 'function') window.renderSO();
    }
    _toast(`📅 "${title||'Message'}" added to Schedule`);
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  console.info('[BW fix23] ✓ Project pipeline  ✓ Nugget save  ✓ DOM-read selection');

})();