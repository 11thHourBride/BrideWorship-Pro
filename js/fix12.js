/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix12.js
   Direct surgical fixes for three confirmed bugs:
   1. Imported sermons: bypass fix9's observer — own handler
      saves to localStorage before rendering.
   2. Clock drag: pointer-capture approach, strips CSS class
      that fights inline positioning.
   3. Clock off → hides on second screen and stage.
═══════════════════════════════════════════════════════════ */

(function BW_Fix12() {
  'use strict';

  const SERMON_KEY = 'bw_imported_sermons_v2'; // fresh key, no legacy conflicts

  /* ══════════════════════════════════════════════════════════
     SERMON STORAGE HELPERS
  ══════════════════════════════════════════════════════════ */

  function _loadSermons() {
    try { return JSON.parse(localStorage.getItem(SERMON_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function _persistSermon(title, author, paras) {
    const list  = _loadSermons();
    const idx   = list.findIndex(s => s.title === title);
    const entry = {
      id:      'imp_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
      title:   title  || 'Imported Sermon',
      author:  author || '',
      addedAt: new Date().toISOString(),
      paras,                             // string[]
    };
    if (idx >= 0) list[idx] = entry;
    else          list.unshift(entry);
    if (list.length > 60) list.pop();

    /* Try to save; if quota hit, drop oldest entries until it fits */
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        localStorage.setItem(SERMON_KEY, JSON.stringify(
          attempt === 0 ? list : list.slice(0, list.length - attempt * 5)
        ));
        return true;
      } catch(e) { /* keep trying */ }
    }
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     FILE EXTRACTION (own copies — no dependency on fix9)
  ══════════════════════════════════════════════════════════ */

  function _readFileAsText(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = e => res(e.target.result);
      r.onerror = () => rej(new Error('Could not read file'));
      r.readAsText(file, 'UTF-8');
    });
  }

  function _stripRTF(rtf) {
    return rtf
      .replace(/\{[^{}]*\}/g, ' ')
      .replace(/\\par\b|\\line\b/gi, '\n')
      .replace(/\\[a-z*]+[-]?\d*[ ]?/gi, '')
      .replace(/[{}\\]/g, '')
      .replace(/[ \t]+/g, ' ')
      .split('\n').map(l => l.trim()).join('\n')
      .replace(/\n{3,}/g, '\n\n').trim();
  }

  async function _extractPDF(file) {
    if (typeof pdfjsLib === 'undefined') {
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const buf  = await file.arrayBuffer();
    const doc  = await pdfjsLib.getDocument({ data: buf }).promise;
    const pages = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page    = await doc.getPage(p);
      const content = await page.getTextContent();
      pages.push(content.items.map(i => i.str).join(' '));
    }
    return pages.join('\n\n');
  }

  async function _extractDOCX(file) {
    if (typeof mammoth === 'undefined')
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const buf    = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value || '';
  }

  async function _extractEPUB(file) {
    if (typeof JSZip === 'undefined')
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const buf   = await file.arrayBuffer();
    const zip   = await JSZip.loadAsync(buf);
    const fns   = Object.keys(zip.files).filter(n => /\.(html?|xhtml)$/i.test(n)).sort();
    const texts = [];
    for (const fn of fns) {
      const html = await zip.files[fn].async('text');
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      texts.push(doc.body?.textContent || '');
    }
    return texts.join('\n\n');
  }

  function _loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = () => rej(new Error('Failed to load: ' + src));
      document.head.appendChild(s);
    });
  }

  /* ── Master file handler ── */
  async function _handleImportedFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (typeof showSchToast === 'function') showSchToast('⏳ Reading ' + file.name + '…');

    let rawText = '';
    try {
      if (['txt', 'md', 'markdown'].includes(ext)) rawText = await _readFileAsText(file);
      else if (ext === 'rtf')                        rawText = _stripRTF(await _readFileAsText(file));
      else if (ext === 'pdf')                        rawText = await _extractPDF(file);
      else if (['docx', 'doc'].includes(ext))        rawText = await _extractDOCX(file);
      else if (ext === 'epub')                       rawText = await _extractEPUB(file);
      else                                            rawText = await _readFileAsText(file);
    } catch(err) {
      if (typeof showSchToast === 'function') showSchToast('⚠ ' + err.message);
      return;
    }

    if (!rawText.trim()) {
      if (typeof showSchToast === 'function') showSchToast('⚠ No text found in file');
      return;
    }

    const title  = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
                      .replace(/\b\w/g, c => c.toUpperCase());
    const author = '';
    const paras  = rawText.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

    /* ① SAVE FIRST — before any rendering */
    const saved = _persistSermon(title, author, paras);

    /* ② Populate window globals so Reader can use them */
    window._readerTitle  = title;
    window._readerAuthor = author;
    if (window._selectedParas) window._selectedParas.clear();
    window._readerParas  = paras.map((text, i) => ({ text, section: title, idx: i }));

    /* ③ Render paragraph list */
    if (typeof window._renderReaderParas === 'function') {
      window._renderReaderParas();
    } else {
      /* Fallback: build the list ourselves */
      _renderParasFallback(paras, title);
    }

    /* ④ Show viewer */
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* ⑤ Refresh the saved-sermons list */
    _renderSavedList();

    if (typeof showSchToast === 'function')
      showSchToast(saved
        ? `✓ "${title}" saved — ${paras.length} paragraphs`
        : `✓ "${title}" loaded (storage full — not saved)`);
  }

  function _renderParasFallback(paras, title) {
    let list = document.getElementById('reader-para-list');
    if (!list) {
      const ta = document.getElementById('reader-content');
      list = document.createElement('div');
      list.id = 'reader-para-list';
      if (ta) ta.replaceWith(list); else document.getElementById('reader-viewer')?.appendChild(list);
    }
    list.innerHTML = paras.map((p, i) => `
      <div class="reader-para" id="rpara-${i}"
           onclick="readerTogglePara(${i}, event)">
        <input type="checkbox" class="reader-para-chk"
          onclick="event.stopPropagation();readerTogglePara(${i},event)">
        <div class="reader-para-num">${i + 1}</div>
        <div class="reader-para-text">${_esc(p)}</div>
      </div>`).join('');
  }

  /* ══════════════════════════════════════════════════════════
     SAVED SERMON LIST (persisted across refresh)
  ══════════════════════════════════════════════════════════ */

  function _renderSavedList() {
    const wrap = document.getElementById('f12-saved-list');
    if (!wrap) return;
    const list = _loadSermons();
    if (!list.length) {
      wrap.innerHTML = '<div style="font-size:10px;color:var(--text-3);padding:4px 0 10px;">No imported sermons saved yet.</div>';
      return;
    }
    wrap.innerHTML = list.map(s => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;
           background:var(--bg-card);border:1px solid var(--border-dim);
           border-radius:6px;margin-bottom:5px;cursor:pointer;transition:border-color .15s;"
           onmouseover="this.style.borderColor='var(--gold-dim)'"
           onmouseout="this.style.borderColor='var(--border-dim)'"
           onclick="f12OpenSermon('${s.id}')">
        <span style="font-size:16px;flex-shrink:0;">📄</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;color:var(--text-1,#e0ddd8);
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${_esc(s.title)}
          </div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px;">
            ${s.author ? _esc(s.author) + ' · ' : ''}${s.paras.length} paragraphs · ${new Date(s.addedAt).toLocaleDateString()}
          </div>
        </div>
        <span onclick="event.stopPropagation();f12DeleteSermon('${s.id}')"
          title="Remove"
          style="font-size:11px;color:var(--text-3);cursor:pointer;padding:3px 6px;
            border-radius:3px;flex-shrink:0;"
          onmouseover="this.style.color='var(--red,#e05050)'"
          onmouseout="this.style.color='var(--text-3)'">✕</span>
      </div>`).join('');
  }

  window.f12OpenSermon = function (id) {
    const s = _loadSermons().find(s => s.id === id);
    if (!s) return;
    window._readerTitle  = s.title;
    window._readerAuthor = s.author || '';
    if (window._selectedParas) window._selectedParas.clear();
    window._readerParas  = s.paras.map((text, i) => ({ text, section: s.title, idx: i }));
    if (typeof window._renderReaderParas === 'function') window._renderReaderParas();
    else _renderParasFallback(s.paras, s.title);
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = s.title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window.f12DeleteSermon = function (id) {
    const list = _loadSermons().filter(s => s.id !== id);
    try { localStorage.setItem(SERMON_KEY, JSON.stringify(list)); } catch(e) {}
    _renderSavedList();
    if (typeof showSchToast === 'function') showSchToast('Sermon removed');
  };

  /* ── Build / refresh the import zone inside Built-in Reader ── */
  function _buildReaderImportZone() {
    /* Remove old zone from fix9 if present — replace with ours */
    document.getElementById('reader-import-zone')?.remove();

    const readerBody = document.querySelector('#tt-reader .modal-body, #tt-reader > .modal-body');
    if (!readerBody) return;
    if (document.getElementById('f12-import-zone')) {
      _renderSavedList(); // just refresh the list
      return;
    }

    const zone = document.createElement('div');
    zone.id = 'f12-import-zone';
    zone.style.cssText = `
      border:2px dashed var(--border-dim);border-radius:7px;
      padding:14px;text-align:center;margin-bottom:10px;
      cursor:pointer;transition:border-color .2s,background .2s;
    `;
    zone.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;">📄</div>
      <div style="font-size:12px;color:var(--text-2);margin-bottom:3px;">
        Import sermon file — saved permanently to Your Library
      </div>
      <div style="font-size:10px;color:var(--text-3);">Click to browse or drag & drop</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:7px;">
        ${['.TXT','.PDF','.DOCX','.EPUB','.RTF','.MD'].map(f =>
          `<span style="font-size:9px;padding:2px 7px;border-radius:10px;
            background:var(--bg-card);border:1px solid var(--border-dim);
            color:var(--text-3);font-family:'Cinzel',serif;">${f}</span>`
        ).join('')}
      </div>
    `;

    /* Drag over styling */
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.style.borderColor='var(--gold,#c9a84c)'; zone.style.background='rgba(201,168,76,.06)'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor=''; zone.style.background=''; });
    zone.addEventListener('drop',      e => {
      e.preventDefault(); zone.style.borderColor=''; zone.style.background='';
      _handleImportedFile(e.dataTransfer.files[0]);
    });

    /* Click to browse */
    zone.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.txt,.pdf,.docx,.doc,.epub,.rtf,.md,.markdown';
      inp.style.display = 'none';
      inp.addEventListener('change', e => _handleImportedFile(e.target.files[0]));
      document.body.appendChild(inp);
      inp.click();
      setTimeout(() => inp.remove(), 15000);
    });

    /* Saved list */
    const savedWrap = document.createElement('div');
    savedWrap.innerHTML = `
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;
        color:var(--gold-dim,#8a6a20);text-transform:uppercase;
        margin-bottom:5px;margin-top:2px;">
        📚 Your Imported Sermons
      </div>
      <div id="f12-saved-list"></div>
    `;

    /* Prepend both elements to the reader body */
    readerBody.insertBefore(savedWrap, readerBody.firstChild);
    readerBody.insertBefore(zone, readerBody.firstChild);
    _renderSavedList();
  }


  /* ══════════════════════════════════════════════════════════
     FIX 2 — CLOCK DRAG (pointer capture — bulletproof)
  ══════════════════════════════════════════════════════════ */

  function _wireDraggableClock() {
    const ck     = document.getElementById('out-clock');
    const screen = document.getElementById('out-screen');
    if (!ck || !screen || ck.dataset.f12drag) return;
    ck.dataset.f12drag = '1';

    /* Make sure out-screen is positioned so absolute children work */
    const screenStyle = window.getComputedStyle(screen);
    if (screenStyle.position === 'static') screen.style.position = 'relative';

    /* Restore persisted position */
    _restoreClockPos(ck, screen);

    let startX, startY, startL, startT;

    ck.style.cursor = 'grab';
    ck.title = 'Drag to reposition clock';

    ck.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();

      /* Capture pointer so mousemove fires even outside the element */
      ck.setPointerCapture(e.pointerId);

      const sr   = screen.getBoundingClientRect();
      const ckr  = ck.getBoundingClientRect();

      /* Strip the position CSS class (pos-br, pos-bl etc.) */
      ck.className = ck.className.split(' ')
        .filter(c => !c.startsWith('pos-')).join(' ');

      /* Switch to absolute inside out-screen */
      ck.style.position = 'absolute';
      ck.style.right    = 'auto';
      ck.style.bottom   = 'auto';

      startL = ckr.left - sr.left;
      startT = ckr.top  - sr.top;
      startX = e.clientX;
      startY = e.clientY;

      ck.style.left    = startL + 'px';
      ck.style.top     = startT + 'px';
      ck.style.cursor  = 'grabbing';
      ck.style.zIndex  = '999';
    });

    ck.addEventListener('pointermove', function (e) {
      if (!ck.hasPointerCapture(e.pointerId)) return;
      const sr  = screen.getBoundingClientRect();
      const dx  = e.clientX - startX;
      const dy  = e.clientY - startY;
      const nx  = Math.max(0, Math.min(sr.width  - ck.offsetWidth,  startL + dx));
      const ny  = Math.max(0, Math.min(sr.height - ck.offsetHeight, startT + dy));
      ck.style.left = nx + 'px';
      ck.style.top  = ny + 'px';
    });

    ck.addEventListener('pointerup', function (e) {
      if (!ck.hasPointerCapture(e.pointerId)) return;
      ck.releasePointerCapture(e.pointerId);
      ck.style.cursor = 'grab';

      const sr  = screen.getBoundingClientRect();
      const pct = {
        x: parseFloat(ck.style.left) / sr.width  * 100,
        y: parseFloat(ck.style.top)  / sr.height * 100,
      };
      try { localStorage.setItem('bw_ck_pos', JSON.stringify(pct)); } catch(e) {}
      _mirrorClockToProj(pct);
    });
  }

  function _restoreClockPos(ck, screen) {
    try {
      const pct = JSON.parse(localStorage.getItem('bw_ck_pos') || 'null');
      if (!pct) return;
      /* Wait one frame for layout to settle */
      requestAnimationFrame(() => {
        const sr = screen.getBoundingClientRect();
        ck.className = ck.className.split(' ').filter(c => !c.startsWith('pos-')).join(' ');
        ck.style.position = 'absolute';
        ck.style.right  = 'auto';
        ck.style.bottom = 'auto';
        ck.style.left   = (pct.x / 100 * sr.width)  + 'px';
        ck.style.top    = (pct.y / 100 * sr.height) + 'px';
      });
    } catch(e) {}
  }

  function _mirrorClockToProj(pct) {
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const pc = pw.document.getElementById('proj-clock');
    if (!pc) return;
    /* Map to 1920×1080 virtual canvas */
    pc.style.position = 'fixed';
    pc.style.left     = (pct.x / 100 * 1920) + 'px';
    pc.style.top      = (pct.y / 100 * 1080) + 'px';
    pc.style.right    = 'auto';
    pc.style.bottom   = 'auto';
    try { localStorage.setItem('bw_ck_proj', JSON.stringify({x: pct.x/100*1920, y: pct.y/100*1080})); } catch(e) {}
  }


  /* ══════════════════════════════════════════════════════════
     FIX 2b — CLOCK FONT → SECOND SCREEN
  ══════════════════════════════════════════════════════════ */

  function _applyClockFontToAll() {
    const font = localStorage.getItem('bw_clock_font') || 'Cinzel';

    /* Local preview */
    const ck = document.getElementById('out-clock');
    if (ck) { ck.style.fontFamily = `'${font}', monospace`; ck.style.fontWeight = '700'; }

    /* Projection window */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const pc = pw.document.getElementById('proj-clock');
      if (pc) { pc.style.fontFamily = `'${font}', monospace`; pc.style.fontWeight = '700'; }
    }

    /* Stage display */
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) { sc.style.fontFamily = `'${font}', monospace`; }
    }
  }

  /* Patch pushClockToProj — runs every tick — reapplies font + saved position */
  const _origPushCTP = window.pushClockToProj;
  if (typeof _origPushCTP === 'function') {
    window.pushClockToProj = function (str) {
      _origPushCTP(str);
      const pw = S?.projWin;
      if (!pw || pw.closed) return;
      const pc = pw.document.getElementById('proj-clock');
      if (!pc) return;
      const font = localStorage.getItem('bw_clock_font') || 'Cinzel';
      pc.style.fontFamily = `'${font}', monospace`;
      pc.style.fontWeight = '700';
      /* Reapply saved position (pushClockToProj sets cssText which wipes position) */
      try {
        const saved = JSON.parse(localStorage.getItem('bw_ck_proj') || 'null');
        if (saved) {
          pc.style.position = 'fixed';
          pc.style.left = saved.x + 'px'; pc.style.top = saved.y + 'px';
          pc.style.right = 'auto'; pc.style.bottom = 'auto';
        }
      } catch(e) {}
    };
  }

  /* Patch clockFontChange (from fix10) */
  const _origCFC = window.clockFontChange;
  window.clockFontChange = function (font) {
    if (_origCFC) _origCFC(font);
    _applyClockFontToAll();
  };


  /* ══════════════════════════════════════════════════════════
     FIX 3 — CLOCK TOGGLE OFF → HIDES ON SECOND SCREEN
  ══════════════════════════════════════════════════════════ */

  const _origToggleClock = window.toggleClock;
  window.toggleClock = function (on) {
    if (_origToggleClock) _origToggleClock(on);

    /* Hide / show on projection window */
    const pw = S?.projWin;
    if (pw && !pw.closed) {
      const pc = pw.document.getElementById('proj-clock');
      if (pc) pc.style.display = on ? 'block' : 'none';
    }

    /* Hide / show on stage display */
    const sw = S?.stageWin;
    if (sw && !sw.closed) {
      const sc = sw.document.getElementById('stg-clock');
      if (sc) sc.style.display = on ? 'block' : 'none';
    }
  };

  /* Also patch tickClock so it hides proj-clock when CLOCK_STATE.on is false */
  const _origTick = window.tickClock;
  if (typeof _origTick === 'function') {
    window.tickClock = function () {
      _origTick();
      const on = window.CLOCK_STATE?.on ?? true;
      const pw = S?.projWin;
      if (pw && !pw.closed) {
        const pc = pw.document.getElementById('proj-clock');
        if (pc) {
          pc.style.display = on ? 'block' : 'none';
          if (on) {
            const font = localStorage.getItem('bw_clock_font') || 'Cinzel';
            pc.style.fontFamily = `'${font}', monospace`;
            pc.style.fontWeight = '700';
          }
        }
      }
    };
  }

  /* Restore proj-clock position after projection window opens */
  const _origOpenProj = window.openProjection;
  if (typeof _origOpenProj === 'function') {
    window.openProjection = async function () {
      await _origOpenProj();
      setTimeout(() => {
        _applyClockFontToAll();
        try {
          const saved = JSON.parse(localStorage.getItem('bw_ck_proj') || 'null');
          if (!saved) return;
          const pw = S?.projWin;
          if (!pw || pw.closed) return;
          const pc = pw.document.getElementById('proj-clock');
          if (!pc) return;
          pc.style.position = 'fixed';
          pc.style.left = saved.x + 'px'; pc.style.top = saved.y + 'px';
          pc.style.right = 'auto'; pc.style.bottom = 'auto';
        } catch(e) {}
      }, 1000);
    };
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    /* Wire clock drag — retry until elements exist */
    let n = 0;
    const t = setInterval(() => {
      _wireDraggableClock();
      if (document.getElementById('out-clock')?.dataset.f12drag || ++n > 30) clearInterval(t);
    }, 300);

    /* Apply clock font immediately */
    setTimeout(_applyClockFontToAll, 500);

    console.info('[BW fix12] ✓ Sermon persist  ✓ Clock drag  ✓ Clock font  ✓ Clock hide');
  }

  /* Hook openTheTable every time */
  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    setTimeout(_buildReaderImportZone, 180);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { setTimeout(boot, 350); }


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) {
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();