/* ═══════════════════════════════════════════════════════════
   fix10-patch.js
   Hotfix: renderImportedSermonList crashes when a stored
   sermon entry has `content` instead of `paras`, or when
   either field is missing entirely.
   Drop this file in js/ and add the script tag after fix10.
═══════════════════════════════════════════════════════════ */

(function BW_Fix10Patch() {
  'use strict';

  /* Normalise a stored sermon so it always has .paras (string[]) */
  function _normalise(s) {
    if (!s) return null;
    /* Already correct shape */
    if (Array.isArray(s.paras) && s.paras.length) return s;
    /* fix10 stored content:[{section,text}] */
    if (Array.isArray(s.content)) {
      return { ...s, paras: s.content.map(c => (typeof c === 'string' ? c : c.text || '')) };
    }
    /* Fallback — empty but safe */
    return { ...s, paras: [] };
  }

  /* Safe paragraph count helper */
  function _paraCount(s) {
    if (Array.isArray(s.paras))   return s.paras.length;
    if (Array.isArray(s.content)) return s.content.length;
    return 0;
  }

  /* ── Replace renderImportedSermonList ── */
  window.renderImportedSermonList = function () {
    const wrap = document.getElementById('imported-sermon-list');
    if (!wrap) return;

    /* Load from both possible keys */
    let list = [];
    ['bw_imported_sermons', 'bw_imported_sermons_v2'].forEach(key => {
      try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(raw)) list = list.concat(raw.map(_normalise).filter(Boolean));
      } catch(e) {}
    });

    /* Deduplicate by title */
    const seen = new Set();
    list = list.filter(s => {
      if (seen.has(s.title)) return false;
      seen.add(s.title); return true;
    });

    if (!list.length) {
      wrap.innerHTML = '<div style="font-size:10px;color:var(--text-3);padding:6px 0 10px;">No imported sermons yet.</div>';
      return;
    }

    wrap.innerHTML = list.map(s => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;
           background:var(--bg-card);border:1px solid var(--border-dim);
           border-radius:6px;margin-bottom:5px;cursor:pointer;transition:border-color .15s;"
           onmouseover="this.style.borderColor='var(--gold-dim)'"
           onmouseout="this.style.borderColor='var(--border-dim)'"
           onclick="f12OpenSermon('${s.id || ''}');fix11OpenSermon('${s.id || ''}')">
        <span style="font-size:16px;flex-shrink:0;">📄</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;color:var(--text-1,#e0ddd8);
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${_esc(s.title || 'Untitled')}
          </div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px;">
            ${s.author ? _esc(s.author) + ' · ' : ''}${_paraCount(s)} paragraphs · ${s.addedAt ? new Date(s.addedAt).toLocaleDateString() : ''}
          </div>
        </div>
        <span onclick="event.stopPropagation();f12DeleteSermon('${s.id || ''}');fix11DeleteSermon('${s.id || ''}')"
          title="Remove"
          style="font-size:11px;color:var(--text-3);cursor:pointer;padding:3px 6px;border-radius:3px;"
          onmouseover="this.style.color='var(--red,#e05050)'"
          onmouseout="this.style.color='var(--text-3)'">✕</span>
      </div>`).join('');
  };

  /* Also patch the open handler so both id-schemes work */
  const _origF12Open = window.f12OpenSermon;
  window.f12OpenSermon = function (id) {
    if (!id) return;
    /* Try fix12 key first */
    let found = null;
    ['bw_imported_sermons_v2', 'bw_imported_sermons'].forEach(key => {
      if (found) return;
      try {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        found = list.find(s => s.id === id);
        if (found) found = _normalise(found);
      } catch(e) {}
    });
    if (!found) { if (_origF12Open) _origF12Open(id); return; }

    window._readerTitle  = found.title;
    window._readerAuthor = found.author || '';
    if (window._selectedParas) window._selectedParas.clear();
    window._readerParas  = found.paras.map((text, i) => ({ text, section: found.title, idx: i }));
    if (typeof window._renderReaderParas === 'function') window._renderReaderParas();
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = found.title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  console.info('[BW fix10-patch] ✓ renderImportedSermonList crash fixed');
})();