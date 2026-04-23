/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix17.js
   Definitive fix for import button:
   1. Fully self-contained file extraction pipeline.
   2. Wires directly to the DOM button with addEventListener
      — bypasses the broken global-function chain entirely.
   3. Multiple files supported (process sequentially).
   4. Refreshes every known sermon list after each import.
═══════════════════════════════════════════════════════════ */

(function BW_Fix17() {
  'use strict';

  const SERMON_KEY = 'bw_imported_sermons_v2';

  /* ══════════════════════════════════════════════════════════
     STORAGE
  ══════════════════════════════════════════════════════════ */

  function _persist(title, author, paras) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(SERMON_KEY) || '[]'); } catch(e) {}

    const idx   = list.findIndex(s => s.title === title);
    const entry = {
      id:      'imp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title:   title  || 'Imported Sermon',
      author:  author || '',
      addedAt: new Date().toISOString(),
      paras,
    };
    if (idx >= 0) list[idx] = entry; else list.unshift(entry);
    if (list.length > 120) list.pop();

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        localStorage.setItem(SERMON_KEY,
          JSON.stringify(attempt === 0 ? list : list.slice(0, list.length - attempt * 8)));
        return true;
      } catch(e) { /* quota — retry with fewer */ }
    }
    return false;
  }

  function _refreshLists() {
    ['renderImportedSermonList', '_renderSavedList', '_renderLibraryList'].forEach(fn => {
      if (typeof window[fn] === 'function') {
        try { window[fn](); } catch(e) {}
      }
    });
    /* fix13 library list */
    const libInner = document.getElementById('f13-lib-list-inner');
    if (libInner) {
      try {
        if (typeof window.f13ToggleLibrary === 'function') {
          /* re-render by closing+opening */
          const panel = document.getElementById('f13-library-panel');
          if (panel?.classList.contains('open')) {
            window.f13ToggleLibrary();
            setTimeout(window.f13ToggleLibrary, 50);
          }
        }
      } catch(e) {}
    }
  }

  /* ══════════════════════════════════════════════════════════
     TEXT EXTRACTION
  ══════════════════════════════════════════════════════════ */

  function _readText(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = e => res(e.target.result);
      r.onerror = () => rej(new Error('Could not read ' + file.name));
      r.readAsText(file, 'UTF-8');
    });
  }

  function _stripRTF(rtf) {
    return rtf
      .replace(/\{[^{}]*\}/g, ' ')
      .replace(/\\par\b|\\line\b/gi, '\n')
      .replace(/\\[a-z*]+[-]?\d*\s?/gi, '')
      .replace(/[{}\\]/g, '')
      .replace(/[ \t]+/g, ' ')
      .split('\n').map(l => l.trim()).join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function _loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload  = res;
      s.onerror = () => rej(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function _extractPDF(file) {
    if (typeof pdfjsLib === 'undefined') {
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const buf = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: buf }).promise;
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
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value || '';
  }

  async function _extractEPUB(file) {
    if (typeof JSZip === 'undefined')
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const zip  = await JSZip.loadAsync(await file.arrayBuffer());
    const fns  = Object.keys(zip.files).filter(n => /\.(html?|xhtml)$/i.test(n)).sort();
    const texts = [];
    for (const fn of fns) {
      const html = await zip.files[fn].async('text');
      texts.push(new DOMParser().parseFromString(html, 'text/html').body?.textContent || '');
    }
    return texts.join('\n\n');
  }

  async function _extractText(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (['txt', 'md', 'markdown'].includes(ext)) return _readText(file);
    if (ext === 'rtf')                            return _stripRTF(await _readText(file));
    if (ext === 'pdf')                            return _extractPDF(file);
    if (['docx', 'doc'].includes(ext))            return _extractDOCX(file);
    if (ext === 'epub')                           return _extractEPUB(file);
    return _readText(file); // fallback
  }

  /* ══════════════════════════════════════════════════════════
     CORE: PROCESS ONE FILE
  ══════════════════════════════════════════════════════════ */

  async function processFile(file) {
    if (!file) return null;
    _toast('⏳ Reading ' + file.name + '…');

    let raw = '';
    try { raw = await _extractText(file); }
    catch(err) { _toast('⚠ ' + err.message); return null; }

    if (!raw.trim()) { _toast('⚠ No text found in ' + file.name); return null; }

    const title = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    const paras = raw.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    const saved = _persist(title, '', paras);

    /* Populate reader globals */
    window._readerTitle  = title;
    window._readerAuthor = '';
    if (window._selectedParas) window._selectedParas.clear();
    window._readerParas  = paras.map((text, i) => ({ text, section: title, idx: i }));
    if (typeof window._renderReaderParas === 'function') window._renderReaderParas();

    /* Show viewer */
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = title;
    viewer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (typeof window.logActivity === 'function')
      window.logActivity('📄', `Imported: "${title}" (${paras.length} paragraphs)`);

    _toast(saved
      ? `✓ "${title}" saved — ${paras.length} paragraphs`
      : `✓ "${title}" loaded (storage full)`);

    return { title, paras };
  }

  /* Expose globally so any code can call it */
  window.bwImportFile        = processFile;
  window.f12HandleFile       = processFile;
  window._handleImportedFile = processFile;  // fix13 checks this exact name

  function _toast(msg) {
    if (typeof window.showSchToast === 'function') window.showSchToast(msg);
  }

  /* ══════════════════════════════════════════════════════════
     MULTI-FILE PICKER  (the real import button handler)
  ══════════════════════════════════════════════════════════ */

  function _openFilePicker() {
    const inp    = document.createElement('input');
    inp.type     = 'file';
    inp.accept   = '.txt,.pdf,.docx,.doc,.epub,.rtf,.md,.markdown';
    inp.multiple = true;
    inp.style.display = 'none';

    inp.addEventListener('change', async () => {
      const files = Array.from(inp.files || []);
      inp.remove();
      if (!files.length) return;

      if (files.length === 1) {
        await processFile(files[0]);
      } else {
        _toast(`⏳ Importing ${files.length} sermons…`);
        let ok = 0;
        for (const f of files) {
          const result = await processFile(f);
          if (result) ok++;
          await new Promise(r => setTimeout(r, 300)); // brief pause between files
        }
        _toast(`✓ ${ok} of ${files.length} sermons imported`);
      }

      _refreshLists();
    });

    document.body.appendChild(inp);
    inp.click();
  }

  /* Override the global so any onclick="f13TriggerImport()" call works */
  window.f13TriggerImport = _openFilePicker;

  /* ══════════════════════════════════════════════════════════
     WIRE DIRECTLY TO THE IMPORT BUTTON IN THE DOM
     Runs every time The Table opens to catch freshly built UI.
  ══════════════════════════════════════════════════════════ */

  function _wireImportButton() {
    /* Find every element that could be the import button */
    const candidates = [
      ...document.querySelectorAll('[onclick*="f13TriggerImport"]'),
      ...document.querySelectorAll('[onclick*="Import"]'),
      document.getElementById('f12-import-zone'),
      document.getElementById('reader-import-zone'),
    ].filter(Boolean);

    candidates.forEach(el => {
      if (el.dataset.f17wired) return;
      el.dataset.f17wired = '1';

      /* Replace onclick attribute entirely */
      el.removeAttribute('onclick');
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        _openFilePicker();
      });
    });

    /* Also wire drag-and-drop on import zones */
    ['f12-import-zone', 'reader-import-zone', 'f13-import-zone'].forEach(id => {
      const zone = document.getElementById(id);
      if (!zone || zone.dataset.f17drop) return;
      zone.dataset.f17drop = '1';
      zone.addEventListener('dragover',  e => { e.preventDefault(); zone.style.borderColor = 'var(--gold,#c9a84c)'; });
      zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
      zone.addEventListener('drop', async e => {
        e.preventDefault();
        zone.style.borderColor = '';
        const files = Array.from(e.dataTransfer?.files || []);
        for (const f of files) {
          await processFile(f);
          await new Promise(r => setTimeout(r, 300));
        }
        _refreshLists();
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  const _origOT = window.openTheTable;
  window.openTheTable = function () {
    if (_origOT) _origOT();
    /* Retry wiring a few times to catch UI built by other fixes */
    [200, 500, 1000].forEach(delay =>
      setTimeout(_wireImportButton, delay)
    );
  };

  /* Wire immediately if table is already open */
  setTimeout(_wireImportButton, 200);

  console.info('[BW fix17] ✓ Import handler  ✓ Multi-file  ✓ DOM-wired button');

})();