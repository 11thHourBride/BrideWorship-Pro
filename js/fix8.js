/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix8.js
   Fix 1 : Full-lyric library search.
   Fix 2 : Song editor — blank lines in any slide textarea
           split into separate slides on save. Each textarea
           is also taller and has a live line-count hint.
   Fix 3 : Song editor modal taller; textarea font larger.
═══════════════════════════════════════════════════════════ */

(function BW_Fix8() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix8-styles';
  _style.textContent = `

    /* ── FIX 3: taller modal + bigger text ───────────────── */
    .modal-overlay .se-modal {
      height:         90vh !important;
      max-height:     90vh !important;
      display:        flex !important;
      flex-direction: column !important;
    }
    .modal-overlay .se-modal .se-slides-list {
      flex:       1 1 0 !important;
      min-height: 0    !important;
      max-height: none !important;
      overflow-y: auto !important;
      padding:    4px 2px 12px !important;
    }

    /* ── FIX 2: slide cards — gap + larger textarea ──────── */
    .se-slide-card {
      display:        flex;
      flex-direction: column;
      gap:            8px;
      padding:        14px 14px 12px !important;
      background:     var(--bg-card);
      border:         1px solid var(--border-dim);
      border-radius:  7px;
      margin-bottom:  12px !important;   /* visible gap = "blank line" */
    }
    .se-slide-card:last-child { margin-bottom: 0 !important; }

    .se-slide-header {
      display:     flex;
      gap:         6px;
      align-items: center;
    }

    /* Section-label input */
    .se-slide-label-inp {
      font-size: 14px !important;
      padding:   7px 10px !important;
      flex:      0 0 180px !important;
    }

    /* Lyrics textarea — big and readable */
    .se-slide-text-ta {
      font-size:   38px !important;
      line-height: 1.7  !important;
      min-height:  700px !important;
      max-height:  700px !important;
      resize:      vertical !important;
      padding:     12px 14px !important;
      width:       100% !important;
      box-sizing:  border-box !important;
    }

    /* Hint line under textarea */
    .se-slide-hint {
      font-size:  10px;
      color:      var(--gold-dim, #8a6a20);
      font-style: italic;
      line-height: 1.5;
      min-height:  14px;
    }

    /* ── Search match highlight ───────────────────────────── */
    .lib-item .li-match {
      font-size:     9px;
      color:         var(--gold-dim, #8a6a20);
      margin-top:    2px;
      line-height:   1.5;
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }
    mark {
      background:    rgba(201,168,76,.25);
      color:         var(--gold, #c9a84c);
      border-radius: 2px;
      padding:       0 1px;
    }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     FIX 1 — FULL-LYRIC SEARCH
  ══════════════════════════════════════════════════════════ */

  window.filterSongs = function () {
    const raw = (document.getElementById('search')?.value || '').trim();
    const q   = raw.toLowerCase();

    document.querySelectorAll('#ls-songs .lib-item').forEach((item, i) => {
      if (i >= SONGS.length) { item.style.display = 'none'; return; }
      const s = SONGS[i];

      if (!q) {
        item.style.display = '';
        _clearMatch(item);
        return;
      }

      const header = [s.title, s.author, s.tag, s.key, s.tempo].join(' ');
      const lyrics  = (s.slides || [])
        .map(sl => (sl.section || '') + ' ' + (sl.text || '')).join(' ');
      const corpus  = (header + ' ' + lyrics).toLowerCase();
      const hit     = corpus.includes(q);

      item.style.display = hit ? '' : 'none';

      if (hit && !header.toLowerCase().includes(q)) {
        const sl = (s.slides || []).find(sl =>
          ((sl.section || '') + ' ' + (sl.text || '')).toLowerCase().includes(q)
        );
        if (sl) _setMatch(item, _snippet((sl.section ? sl.section + ': ' : '') + sl.text, q));
      } else {
        _clearMatch(item);
      }
    });
  };

  function _snippet(text, q) {
    const lo  = text.toLowerCase();
    const idx = lo.indexOf(q);
    if (idx < 0) return '';
    const s = Math.max(0, idx - 22);
    const e = Math.min(text.length, idx + q.length + 35);
    return (s ? '…' : '') +
      _esc(text.substring(s, idx)) +
      '<mark>' + _esc(text.substring(idx, idx + q.length)) + '</mark>' +
      _esc(text.substring(idx + q.length, e)) +
      (e < text.length ? '…' : '');
  }

  function _setMatch(item, html) {
    let el = item.querySelector('.li-match');
    if (!el) { el = document.createElement('div'); el.className = 'li-match'; item.appendChild(el); }
    el.innerHTML = html;
  }
  function _clearMatch(item) { item.querySelector('.li-match')?.remove(); }


  /* ══════════════════════════════════════════════════════════
     FIX 2 — BLANK LINES SPLIT INTO SEPARATE SLIDES
     ──────────────────────────────────────────────────────────
     Strategy:
     • Replace renderEditorSlides() with a version that builds
       the same UI but using our CSS classes + a live hint that
       tells the user blank lines will become new slides.
     • Patch saveSong() to expand _editorSlides: for each raw
       slide, split its text on double-newlines into child
       slides that all share the parent section label
       (VERSE 1, VERSE 1b, VERSE 1c, …).
  ══════════════════════════════════════════════════════════ */

  /* ── Rebuild renderEditorSlides with larger UI ── */
  window.renderEditorSlides = function () {
    const list = document.getElementById('se-slides-list');
    if (!list) return;

    list.innerHTML = _editorSlides.map((sl, i) => `
      <div class="se-slide-card" id="se-card-${i}">

        <div class="se-slide-header">
          <input class="se-inp se-slide-label-inp"
            value="${_esc(sl.section || '')}"
            placeholder="Section label (e.g. VERSE 1, CHORUS)…"
            oninput="_editorSlides[${i}].section = this.value">

          <div style="flex:1;font-size:10px;color:var(--text-3);">
            Slide ${i + 1} of ${_editorSlides.length}
          </div>

          ${i > 0
            ? `<button style="background:none;border:1px solid var(--border-dim);
                 color:var(--text-3);padding:3px 7px;border-radius:3px;
                 cursor:pointer;font-size:11px;"
                 onclick="moveEditorSlide(${i},-1)">↑</button>` : ''}
          ${i < _editorSlides.length - 1
            ? `<button style="background:none;border:1px solid var(--border-dim);
                 color:var(--text-3);padding:3px 7px;border-radius:3px;
                 cursor:pointer;font-size:11px;"
                 onclick="moveEditorSlide(${i},1)">↓</button>` : ''}
          <button style="background:none;border:1px solid rgba(224,80,80,.3);
              color:var(--red);padding:3px 8px;border-radius:3px;
              cursor:pointer;font-size:11px;"
              onclick="removeEditorSlide(${i})">✕</button>
        </div>

        <textarea class="se-inp se-slide-text-ta"
          placeholder="Type lyrics here…&#10;&#10;Leave a BLANK LINE to start a new slide automatically."
          oninput="_editorSlides[${i}].text = this.value; _updateSlideHint(${i}, this)"
          >${_esc(sl.text || '')}</textarea>

        <div class="se-slide-hint" id="se-hint-${i}"></div>

      </div>`).join('');

    /* Initialise hints */
    _editorSlides.forEach((sl, i) => {
      const ta = document.querySelector(`#se-card-${i} .se-slide-text-ta`);
      if (ta) _updateSlideHint(i, ta);
    });
  };

  /* Live hint under each textarea */
  window._updateSlideHint = function (i, ta) {
    const hint = document.getElementById('se-hint-' + i);
    if (!hint) return;
    const parts = (ta.value || '').split(/\n{2,}/).filter(p => p.trim());
    if (parts.length > 1) {
      hint.textContent = `↳ ${parts.length} slides will be created from this block (blank lines = new slide)`;
    } else {
      hint.textContent = 'Tip: leave a blank line to split into a new slide.';
    }
  };


  /* ── Patch saveSong() to expand blank-line splits ── */
  const _origSaveSong = window.saveSong;
  window.saveSong = function () {
    /* Expand _editorSlides: blank lines → separate slides */
    const expanded = [];
    _editorSlides.forEach(sl => {
      const parts = (sl.text || '')
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(p => p);

      if (parts.length <= 1) {
        expanded.push(sl);
        return;
      }

      /* First part keeps the original section label;
         subsequent parts get label + b, c, d … */
      parts.forEach((text, j) => {
        const suffix = j === 0 ? '' : String.fromCharCode(97 + j); // a, b, c…
        expanded.push({
          section: (sl.section || 'SLIDE') + (suffix ? ' ' + suffix.toUpperCase() : ''),
          text,
        });
      });
    });

    /* Temporarily swap _editorSlides so the original saveSong sees the expanded list */
    const backup = _editorSlides.splice(0, _editorSlides.length, ...expanded);
    _origSaveSong();
    /* Restore (saveSong closes the modal, so this is just a safety measure) */
    _editorSlides.splice(0, _editorSlides.length, ...backup);
  };


  /* ── Also patch previewSong() the same way ── */
  const _origPreviewSong = window.previewSong;
  window.previewSong = function () {
    const expanded = [];
    _editorSlides.forEach(sl => {
      const parts = (sl.text || '').split(/\n{2,}/).map(p => p.trim()).filter(p => p);
      if (parts.length <= 1) { expanded.push(sl); return; }
      parts.forEach((text, j) => {
        const suffix = j === 0 ? '' : String.fromCharCode(97 + j).toUpperCase();
        expanded.push({ section: (sl.section || 'SLIDE') + (suffix ? ' ' + suffix : ''), text });
      });
    });
    const backup = _editorSlides.splice(0, _editorSlides.length, ...expanded);
    _origPreviewSong();
    _editorSlides.splice(0, _editorSlides.length, ...backup);
  };


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  console.info('[BW fix8] ✓ Lyric search  ✓ Blank-line slide split  ✓ Larger editor');

})();