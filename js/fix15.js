/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix15.js
═══════════════════════════════════════════════════════════ */

(function BW_Fix15() {
  'use strict';

  /* ── Replace sclProject with the corrected version ── */
  window.sclProject = async function () {
    const rawBook  = document.getElementById('scl-book')?.value.trim() || '';
    const bookName = (typeof resolveBookName === 'function')
      ? resolveBookName(rawBook) : rawBook;
    const ch       = parseInt(document.getElementById('scl-ch')?.value)    || 1;
    const vsFrom   = parseInt(document.getElementById('scl-vs')?.value)    || 1;
    const vsEndRaw = (document.getElementById('scl-vs-end')?.value || '').trim();
    const vsTo     = (vsEndRaw && parseInt(vsEndRaw) >= vsFrom)
                       ? parseInt(vsEndRaw)
                       : vsFrom;

    if (!bookName) {
      document.getElementById('scl-book')?.focus();
      if (typeof sclFeedback === 'function') sclFeedback('⚠ Enter a book name first', 'var(--amber)');
      else _fb('⚠ Enter a book name first', 'var(--amber)');
      return;
    }

    const isSingle = vsFrom === vsTo;
    const dash     = vsFrom === vsTo ? String(vsFrom) : `${vsFrom}–${vsTo}`;
    const ref      = `${bookName} ${ch}:${dash}`;

    /* ── 1. Offline DB — ONLY for single-verse lookups ──────
       When the user requests a RANGE, we must skip the DB and
       go straight to the API so all verses are returned.      */
    if (isSingle && typeof SCRIPTURE_DB !== 'undefined') {
      const key  = ref.toLowerCase().replace('–', '-');
      const key2 = `${bookName.toLowerCase()} ${ch}:${vsFrom}`;
      const text = SCRIPTURE_DB[key] || SCRIPTURE_DB[key2] || SCRIPTURE_DB[ref.toLowerCase()];
      if (text) {
        _loadSlides(ref, [{ num: vsFrom, text }]);
        _fb(`✓ ${ref}`, 'var(--green)');
        return;
      }
    }

    /* ── 2. API fetch ──────────────────────────────────────── */
    const book = (typeof KJV_BOOKS !== 'undefined')
      ? KJV_BOOKS.find(b => b.name === bookName)
      : null;

    if (book && typeof loadBibVerses === 'function') {
      _fb('Loading…', 'var(--text-3)');
      try {
        const verses = await loadBibVerses(book, ch, vsFrom, vsTo);
        if (!verses || !verses.length) {
          _fb(`⚠ No verses found for ${ref}`, 'var(--amber)');
          return;
        }

        /* Deduplicate (API occasionally returns verse 1 twice) */
        const seen  = new Set();
        const unique = verses.filter(v => {
          if (seen.has(v.num)) return false;
          seen.add(v.num); return true;
        });

        _loadSlides(ref, unique);
        _fb(`✓ ${ref} — ${unique.length} verse${unique.length !== 1 ? 's' : ''}`, 'var(--green)');
      } catch (err) {
        _fb('⚠ ' + err.message, 'var(--red)');
      }
      return;
    }

    /* ── 3. Fallback: route through existing quickScriptureLookup ── */
    const scRefEl = document.getElementById('sc-ref');
    if (scRefEl) scRefEl.value = ref;
    /* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix15.js
═══════════════════════════════════════════════════════════ */

(function BW_Fix15() {
  'use strict';

  /* ── Replace sclProject with the corrected version ── */
  window.sclProject = async function () {
    const rawBook  = document.getElementById('scl-book')?.value.trim() || '';
    const bookName = (typeof resolveBookName === 'function')
      ? resolveBookName(rawBook) : rawBook;
    const ch       = parseInt(document.getElementById('scl-ch')?.value)    || 1;
    const vsFrom   = parseInt(document.getElementById('scl-vs')?.value)    || 1;
    const vsEndRaw = (document.getElementById('scl-vs-end')?.value || '').trim();
    const vsTo     = (vsEndRaw && parseInt(vsEndRaw) >= vsFrom)
                       ? parseInt(vsEndRaw)
                       : vsFrom;

    if (!bookName) {
      document.getElementById('scl-book')?.focus();
      if (typeof sclFeedback === 'function') sclFeedback('⚠ Enter a book name first', 'var(--amber)');
      else _fb('⚠ Enter a book name first', 'var(--amber)');
      return;
    }

    const isSingle = vsFrom === vsTo;
    const dash     = vsFrom === vsTo ? String(vsFrom) : `${vsFrom}–${vsTo}`;
    const ref      = `${bookName} ${ch}:${dash}`;

    /* ── 1. Offline DB — ONLY for single-verse lookups ──────
       When the user requests a RANGE, we must skip the DB and
       go straight to the API so all verses are returned.      */
    if (isSingle && typeof SCRIPTURE_DB !== 'undefined') {
      const key  = ref.toLowerCase().replace('–', '-');
      const key2 = `${bookName.toLowerCase()} ${ch}:${vsFrom}`;
      const text = SCRIPTURE_DB[key] || SCRIPTURE_DB[key2] || SCRIPTURE_DB[ref.toLowerCase()];
      if (text) {
        _loadSlides(ref, [{ num: vsFrom, text }]);
        _fb(`✓ ${ref}`, 'var(--green)');
        return;
      }
    }

    /* ── 2. API fetch ──────────────────────────────────────── */
    const book = (typeof KJV_BOOKS !== 'undefined')
      ? KJV_BOOKS.find(b => b.name === bookName)
      : null;

    if (book && typeof loadBibVerses === 'function') {
      _fb('Loading…', 'var(--text-3)');
      try {
        const verses = await loadBibVerses(book, ch, vsFrom, vsTo);
        if (!verses || !verses.length) {
          _fb(`⚠ No verses found for ${ref}`, 'var(--amber)');
          return;
        }

        /* Deduplicate (API occasionally returns verse 1 twice) */
        const seen  = new Set();
        const unique = verses.filter(v => {
          if (seen.has(v.num)) return false;
          seen.add(v.num); return true;
        });

        _loadSlides(ref, unique);
        _fb(`✓ ${ref} — ${unique.length} verse${unique.length !== 1 ? 's' : ''}`, 'var(--green)');
      } catch (err) {
        _fb('⚠ ' + err.message, 'var(--red)');
      }
      return;
    }

    /* ── 3. Fallback: route through existing quickScriptureLookup ── */
    const scRefEl = document.getElementById('sc-ref');
    if (scRefEl) scRefEl.value = ref;
    if (typeof quickScriptureLookup === 'function') quickScriptureLookup();
  };

  /* ── Direct slide injection ── */
  function _loadSlides(ref, verses) {
    const refBase = ref.replace(/:\d.*$/, '').trim(); // "John 1"
    S.songIdx = null;
    S.slides  = verses.map(v => ({
      section: `${refBase}:${v.num}`,
      text:    (v.text || '').trim(),
      version: 'KJV',
    }));
    S.cur = 0;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof centerTab   === 'function')
      centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
  }

  /* ── Feedback helper ── */
  function _fb(msg, color) {
    const el = document.getElementById('scl-hint');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color || 'var(--text-3)';
    if (color === 'var(--green)') {
      clearTimeout(el._t);
      el._t = setTimeout(() => { if (el.style.color === 'var(--green)') el.textContent = ''; }, 3000);
    }
  }

  console.info('[BW fix15] ✓ Scripture range from verse 1 now returns all verses');
})();
ENDOFFILE


if (typeof quickScriptureLookup === 'function') quickScriptureLookup();
  };

  /* ── Direct slide injection ── */
  function _loadSlides(ref, verses) {
    const refBase = ref.replace(/:\d.*$/, '').trim(); // "John 1"
    S.songIdx = null;
    S.slides  = verses.map(v => ({
      section: `${refBase}:${v.num}`,
      text:    (v.text || '').trim(),
      version: 'KJV',
    }));
    S.cur = 0;
    if (typeof renderQueue === 'function') renderQueue();
    if (typeof renderSlide === 'function') renderSlide();
    if (typeof centerTab   === 'function')
      centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
  }

  /* ── Feedback helper ── */
  function _fb(msg, color) {
    const el = document.getElementById('scl-hint');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color || 'var(--text-3)';
    if (color === 'var(--green)') {
      clearTimeout(el._t);
      el._t = setTimeout(() => { if (el.style.color === 'var(--green)') el.textContent = ''; }, 3000);
    }
  }

  console.info('[BW fix15] ✓ Scripture range from verse 1 now returns all verses');
})();
ENDOFFILE


