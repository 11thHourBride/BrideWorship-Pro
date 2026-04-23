/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix9.js  (v2)
   The Table — complete upgrade
   1. File import (PDF,TXT,DOCX,EPUB,RTF,MD) → Built-in Reader.
   2. "Add to Schedule" button in the Add-to-Queue tab.
   3. Built-in Reader: full-text + exact-quote search,
      multi-paragraph checkbox selection, Project / Schedule /
      Save Nugget actions for selected paragraphs.
   4. Golden Nuggets tab — save, view, project, schedule.
   5. Slide labels = Sermon Title · Author (not "Para N").
═══════════════════════════════════════════════════════════ */

(function BW_Fix9() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.id = 'bw-fix9-styles';
  _style.textContent = `

    /* ── Golden Nuggets ───────────────────────────────────── */
    #tt-nuggets .nugget-list {
      display:flex; flex-direction:column; gap:6px;
      max-height:340px; overflow-y:auto; padding:2px 0 8px;
    }
    .nugget-card {
      background:var(--bg-card); border:1px solid var(--border-dim);
      border-radius:7px; padding:10px 12px; transition:border-color .15s;
    }
    .nugget-card:hover { border-color:var(--gold-dim); }
    .nugget-card-top {
      display:flex; align-items:flex-start;
      justify-content:space-between; gap:8px; margin-bottom:5px;
    }
    .nugget-meta {
      font-family:'Cinzel',serif; font-size:9px; letter-spacing:1.5px;
      color:var(--gold,#c9a84c); text-transform:uppercase; flex:1;
    }
    .nugget-del { font-size:11px; color:var(--text-3); cursor:pointer; padding:0 2px; }
    .nugget-del:hover { color:var(--red,#e05050); }
    .nugget-text {
      font-size:12px; color:var(--text-1,#e0ddd8); line-height:1.65;
      display:-webkit-box; -webkit-line-clamp:4;
      -webkit-box-orient:vertical; overflow:hidden;
    }
    .nugget-actions { display:flex; gap:5px; margin-top:8px; flex-wrap:wrap; }
    .nugget-btn {
      padding:4px 9px; font-size:10px; border-radius:4px; cursor:pointer;
      border:1px solid var(--border-dim); background:var(--bg-card);
      color:var(--text-2); transition:background .1s;
    }
    .nugget-btn:hover { background:var(--bg-hover); }
    .nugget-btn.proj { background:var(--gold-dim); color:#000; border-color:var(--gold-dim); }
    .nugget-empty {
      font-size:11px; color:var(--text-3); text-align:center;
      padding:20px 10px; line-height:1.7;
    }
    .nugget-count-badge {
      display:inline-flex; align-items:center; justify-content:center;
      width:17px; height:17px; border-radius:50%;
      background:var(--gold,#c9a84c); color:#000; font-size:9px;
      font-weight:700; margin-left:4px; transition:opacity .2s;
    }

    /* ── Reader paragraph selection ───────────────────────── */
    #reader-para-list { display:flex; flex-direction:column; }
    .reader-para {
      display:flex; align-items:flex-start; gap:8px;
      padding:7px 6px; border-radius:4px; cursor:pointer;
      border-bottom:1px solid var(--border-dim); transition:background .1s;
    }
    .reader-para:hover    { background:var(--bg-hover); }
    .reader-para.selected { background:rgba(201,168,76,.07); }
    .reader-para-chk {
      flex-shrink:0; margin-top:3px;
      accent-color:var(--gold,#c9a84c); width:14px; height:14px; cursor:pointer;
    }
    .reader-para-num {
      flex-shrink:0; font-family:'Cinzel',serif; font-size:9px;
      letter-spacing:1px; color:var(--gold-dim,#8a6a20);
      min-width:22px; text-align:right; padding-top:2px;
    }
    .reader-para-text {
      flex:1; font-size:13px; color:var(--text-1,#e0ddd8); line-height:1.7;
    }
    .reader-para-text mark {
      background:rgba(201,168,76,.28); color:var(--gold,#c9a84c);
      border-radius:2px; padding:0 1px;
    }

    /* Selection action bar */
    #reader-sel-bar {
      display:none; align-items:center; gap:6px; flex-wrap:wrap;
      padding:8px 10px;
      background:rgba(201,168,76,.07); border:1px solid rgba(201,168,76,.2);
      border-radius:6px; margin-bottom:6px;
    }
    #reader-sel-bar.visible { display:flex; }
    #reader-sel-count {
      flex:1; font-size:11px; color:var(--gold,#c9a84c);
      font-family:'Cinzel',serif; letter-spacing:1px;
    }
    .rsel-btn {
      padding:5px 10px; font-size:11px; cursor:pointer;
      border-radius:4px; border:1px solid var(--border-dim);
      background:var(--bg-card); color:var(--text-2);
      transition:background .1s; white-space:nowrap;
    }
    .rsel-btn:hover { background:var(--bg-hover); }
    .rsel-btn.proj   { background:var(--gold,#c9a84c); border-color:var(--gold); color:#000; font-weight:700; }
    .rsel-btn.nugget { background:rgba(212,160,23,.15); border-color:rgba(212,160,23,.35); color:var(--amber,#d4a017); }

    /* ── File import zone (in Built-in Reader) ────────────── */
    #reader-import-zone {
      border:2px dashed var(--border-dim); border-radius:7px;
      padding:16px 14px; text-align:center; margin-bottom:10px;
      transition:border-color .2s, background .2s; cursor:pointer;
    }
    #reader-import-zone.drag-over {
      border-color:var(--gold,#c9a84c); background:rgba(201,168,76,.06);
    }
    .tt-imp-icon { font-size:24px; margin-bottom:4px; }
    .tt-imp-text { font-size:12px; color:var(--text-2); margin-bottom:3px; }
    .tt-imp-sub  { font-size:10px; color:var(--text-3); }
    .tt-imp-formats { display:flex; flex-wrap:wrap; gap:4px; justify-content:center; margin-top:7px; }
    .tt-fmt-tag {
      font-size:9px; padding:2px 7px; border-radius:10px;
      background:var(--bg-card); border:1px solid var(--border-dim);
      color:var(--text-3); font-family:'Cinzel',serif; letter-spacing:1px;
    }

    /* ── "Add to Schedule" in queue tab ─────────────────── */
    #queue-sch-btn {
      flex:1; padding:9px; font-size:12px;
      background:var(--bg-card);
      border:1px solid var(--border-dim);
      color:var(--text-2); border-radius:5px; cursor:pointer;
      transition:background .1s, border-color .15s;
      font-family:'Lato',sans-serif;
    }
    #queue-sch-btn:hover { background:var(--bg-hover); border-color:var(--gold-dim); color:var(--gold); }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     GOLDEN NUGGETS
  ══════════════════════════════════════════════════════════ */

  let _nuggets = JSON.parse(localStorage.getItem('bw_nuggets') || '[]');

  function _saveNuggets() {
    try { localStorage.setItem('bw_nuggets', JSON.stringify(_nuggets)); } catch(e) {}
  }

  function addNugget(text, sermonTitle, author) {
    if (!text?.trim()) return;
    _nuggets.unshift({ text:text.trim(), title:sermonTitle||'Sermon', author:author||'William Branham', savedAt:new Date().toISOString() });
    if (_nuggets.length > 100) _nuggets.pop();
    _saveNuggets(); renderNuggets(); _updateNuggetBadge();
    if (typeof showSchToast === 'function') showSchToast('⭐ Golden Nugget saved!');
  }

  function renderNuggets() {
    const list = document.getElementById('nugget-list');
    if (!list) return;
    if (!_nuggets.length) {
      list.innerHTML = `<div class="nugget-empty">⭐ No golden nuggets yet.<br>Select paragraphs in the Reader and click <strong>⭐ Save Nugget</strong>.</div>`;
      return;
    }
    list.innerHTML = _nuggets.map((n,i) => `
      <div class="nugget-card">
        <div class="nugget-card-top">
          <div class="nugget-meta"><strong>${_esc(n.title)}</strong>${n.author?' · '+_esc(n.author):''}</div>
          <span class="nugget-del" onclick="nuggetDelete(${i})" title="Remove">✕</span>
        </div>
        <div class="nugget-text">${_esc(n.text)}</div>
        <div class="nugget-actions">
          <button class="nugget-btn proj" onclick="nuggetProject(${i})">▶ Project</button>
          <button class="nugget-btn"      onclick="nuggetSchedule(${i})">📅 Schedule</button>
          <button class="nugget-btn"      onclick="nuggetQueue(${i})">📋 Add to Queue</button>
          <button class="nugget-btn"      onclick="nuggetCopy(${i})">📋 Copy</button>
        </div>
      </div>`).join('');
  }

  function _updateNuggetBadge() {
    document.querySelectorAll('.nugget-tab-badge').forEach(b => {
      b.textContent = _nuggets.length || '';
      b.style.opacity = _nuggets.length ? '1' : '0';
    });
  }

  window.nuggetDelete   = i => { _nuggets.splice(i,1); _saveNuggets(); renderNuggets(); _updateNuggetBadge(); };
  window.nuggetCopy     = i => { navigator.clipboard?.writeText(_nuggets[i]?.text||''); if(typeof showSchToast==='function') showSchToast('Copied!'); };
  window.nuggetProject  = i => { const n=_nuggets[i]; if(n) _projectText(n.text,n.title,n.author); };
  window.nuggetSchedule = i => { const n=_nuggets[i]; if(n) _addToSchedule(n.text,n.title,n.author); };
  window.nuggetQueue    = function(i) {
    const n=_nuggets[i]; if(!n) return;
    const ta=document.getElementById('table-sermon-text');
    const ti=document.getElementById('table-sermon-title');
    const au=document.getElementById('table-sermon-author');
    if(ta) ta.value=n.text; if(ti) ti.value=n.title; if(au) au.value=n.author;
    const tabs=document.querySelectorAll('#table-modal .db-tab');
    tabs.forEach(t=>{ if(t.textContent.includes('Queue')&&typeof tableTab==='function') tableTab(t,'tt-queue'); });
  };
  window.nuggetClearAll = function() { if(!confirm('Remove all golden nuggets?')) return; _nuggets=[]; _saveNuggets(); renderNuggets(); _updateNuggetBadge(); };


  /* ══════════════════════════════════════════════════════════
     SHARED HELPERS
  ══════════════════════════════════════════════════════════ */

  function _projectText(text, title, author) {
    const paras = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
    S.songIdx = null;
    S.slides  = paras.map(p => ({ section:title||'Message', author:author||'', text:p }));
    S.cur = 0;
    if (typeof renderQueue==='function') renderQueue();
    if (typeof renderSlide==='function') renderSlide();
    if (typeof centerTab==='function')   centerTab(document.querySelectorAll('.ctab')[0],'slides-view');
    document.getElementById('table-modal').style.display = 'none';
  }

  function _addToSchedule(text, title, author) {
    const paras   = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
    const content = paras.map(p=>`[${title||'Message'}]\n${p}`).join('\n\n');
    if (typeof schInsertFromLibrary==='function') {
      schInsertFromLibrary({ type:'sermon', label:title||'Message', content, notes:author||'', duration:0 }, -1);
    } else if (Array.isArray(S?.so)) {
      S.so.push({ name:title||'Message', type:'sermon', content });
      if (typeof renderSO==='function') renderSO();
    }
    if (typeof showSchToast==='function') showSchToast(`📅 "${title||'Message'}" added to Schedule`);
  }


  /* ══════════════════════════════════════════════════════════
     FIX 5 — SLIDE LABELS: SERMON TITLE · AUTHOR
  ══════════════════════════════════════════════════════════ */

  const _origParse = window.parseTableSermonToSlides;
  window.parseTableSermonToSlides = function () {
    const slides = _origParse ? _origParse() : [];
    const title  = (document.getElementById('table-sermon-title')?.value || 'Message').trim();
    const author = (document.getElementById('table-sermon-author')?.value || 'William Branham').trim();
    return slides.map(sl => ({ ...sl, section:title, author }));
  };

  const _origRenderSlide = window.renderSlide;
  window.renderSlide = function () {
    if (_origRenderSlide) _origRenderSlide();
    const sl = S?.slides?.[S?.cur];
    if (!sl?.author) return;
    const fEl = document.getElementById('s-footer');
    if (fEl) fEl.textContent = `${sl.section||''}  ·  ${sl.author}`;
    const oRef = document.getElementById('o-ref');
    if (oRef) oRef.textContent = `${sl.section||''} · ${sl.author}`;
  };

  const _origPush = window.push;
  window.push = function () {
    if (_origPush) _origPush();
    const pw = S?.projWin;
    if (!pw || pw.closed) return;
    const sl = S?.slides?.[S?.cur];
    if (!sl?.author) return;
    const foot = pw.document.getElementById('proj-footer');
    if (foot) foot.textContent = `${sl.section||''}  ·  ${sl.author}`;
  };


  /* ══════════════════════════════════════════════════════════
     FIX 3 — BUILT-IN READER: FULL-TEXT + EXACT SEARCH,
              MULTI-PARAGRAPH SELECTION
  ══════════════════════════════════════════════════════════ */

  let _readerParas  = [];
  let _readerTitle  = '';
  let _readerAuthor = 'William Branham';
  let _selectedParas = new Set();

  window.searchBuiltinSermons = function () {
    const q    = (document.getElementById('reader-search')?.value || '').trim();
    const year = document.getElementById('reader-year')?.value   || '';
    const book = document.getElementById('reader-book')?.value   || '';
    const isExact = q.startsWith('"') && q.endsWith('"') && q.length > 2;
    const term    = isExact ? q.slice(1,-1).toLowerCase() : q.toLowerCase();
    const list = document.getElementById('reader-results');
    if (!list) return;
    if (!q) { if(typeof loadFeaturedSermons==='function') loadFeaturedSermons(); return; }

    const results = (typeof BUILTIN_SERMONS !== 'undefined' ? BUILTIN_SERMONS : []).filter(s => {
      const matchYear = !year || s.date.startsWith(year);
      const matchBook = !book || s.topic === book;
      if (!matchYear || !matchBook) return false;
      const corpus = [s.title,s.date,s.code,s.topic,s.preview,...(s.content||[]).map(c=>c.text)].join(' ').toLowerCase();
      return isExact ? corpus.includes(term) : term.split(/\s+/).every(w=>corpus.includes(w));
    });

    if (!results.length) {
      list.innerHTML = `<div style="color:var(--text-3);font-size:11px;padding:14px;text-align:center;">
        No sermons matched <strong>"${_esc(q)}"</strong>.<br>
        <span style="font-size:10px;">Try fewer words or wrap exact phrases in "quotes".</span>
      </div>`; return;
    }
    list.innerHTML = results.map(s => `
      <div class="reader-result-item" onclick="openBuiltinSermon('${s.id}')">
        <div class="rri-title">${_hi(s.title,term)}</div>
        <div class="rri-meta">${s.date} · ${s.code} · ${s.topic}</div>
        <div style="font-size:10px;color:var(--text-3);margin-top:2px;">${_hi(s.preview,term)}</div>
      </div>`).join('');
  };

  function _hi(text, term) {
    if (!term) return _esc(text);
    const lo=text.toLowerCase(), idx=lo.indexOf(term);
    if (idx<0) return _esc(text);
    return _esc(text.substring(0,idx))+'<mark>'+_esc(text.substring(idx,idx+term.length))+'</mark>'+_esc(text.substring(idx+term.length));
  }

  window.openBuiltinSermon = function (id) {
    const sermon = (typeof BUILTIN_SERMONS!=='undefined'?BUILTIN_SERMONS:[]).find(s=>s.id===id);
    if (!sermon) return;
    _readerTitle  = sermon.title;
    _readerAuthor = 'William Branham';
    _selectedParas.clear();
    _readerParas  = (sermon.content||[]).map((c,i) => ({ text:c.text, section:c.section, idx:i }));
    _renderReaderParas();
    const viewer  = document.getElementById('reader-viewer');
    const titleEl = document.getElementById('reader-sermon-title');
    if (viewer)  viewer.style.display = 'block';
    if (titleEl) titleEl.textContent  = `${sermon.title} — ${sermon.code}`;
    viewer?.scrollIntoView({ behavior:'smooth', block:'nearest' });
  };

  function _renderReaderParas() {
    /* Replace the raw textarea with a paragraph list */
    let list = document.getElementById('reader-para-list');
    if (!list) {
      const ta = document.getElementById('reader-content');
      if (!ta) return;
      list = document.createElement('div');
      list.id = 'reader-para-list';
      ta.replaceWith(list);
    }
    list.innerHTML = _readerParas.map((p,i) => `
      <div class="reader-para ${_selectedParas.has(i)?'selected':''}"
           id="rpara-${i}" onclick="readerTogglePara(${i},event)">
        <input type="checkbox" class="reader-para-chk"
          ${_selectedParas.has(i)?'checked':''}
          onclick="event.stopPropagation();readerTogglePara(${i},event)">
        <div class="reader-para-num">${i+1}</div>
        <div class="reader-para-text">
          <strong style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;
            color:var(--gold-dim,#8a6a20);display:block;margin-bottom:2px;">
            ${_esc(p.section||'')}
          </strong>
          ${_esc(p.text)}
        </div>
      </div>`).join('');
    _updateSelBar();
  }

  window.readerTogglePara = function (i, event) {
    if (_selectedParas.has(i)) _selectedParas.delete(i); else _selectedParas.add(i);
    const row=document.getElementById('rpara-'+i);
    const chk=row?.querySelector('.reader-para-chk');
    const sel=_selectedParas.has(i);
    row?.classList.toggle('selected',sel);
    if(chk) chk.checked=sel;
    _updateSelBar();
  };

  function _updateSelBar() {
    const bar=document.getElementById('reader-sel-bar');
    const cnt=document.getElementById('reader-sel-count');
    const n=_selectedParas.size;
    if(!bar) return;
    bar.classList.toggle('visible',n>0);
    if(cnt) cnt.textContent = n ? `${n} paragraph${n>1?'s':''} selected` : '';
  }

  window.readerProjectSelected = function () {
    const text=_getSelText(); if(!text) return;
    _projectText(text,_readerTitle,_readerAuthor);
  };
  window.readerScheduleSelected = function () {
    const text=_getSelText(); if(!text) return;
    _addToSchedule(text,_readerTitle,_readerAuthor);
  };
  window.readerSaveNugget = function () {
    const text=_getSelText(); if(!text) return;
    addNugget(text,_readerTitle,_readerAuthor);
    /* Switch to nuggets tab */
    document.querySelectorAll('#table-modal .db-tab').forEach(t => {
      if (t.textContent.includes('Nugget') && typeof tableTab==='function') tableTab(t,'tt-nuggets');
    });
  };
  window.readerClearSel = function () {
    _selectedParas.clear();
    document.querySelectorAll('.reader-para').forEach(el => {
      el.classList.remove('selected');
      const chk=el.querySelector('.reader-para-chk'); if(chk) chk.checked=false;
    });
    _updateSelBar();
  };
  window.projectFullReaderSermon = function () {
    _projectText(_readerParas.map(p=>p.text).join('\n\n'),_readerTitle,_readerAuthor);
  };
  window.sendReaderToQueue = function () {
    const text=_readerParas.map(p=>p.text).join('\n\n');
    const ta=document.getElementById('table-sermon-text');
    const ti=document.getElementById('table-sermon-title');
    const au=document.getElementById('table-sermon-author');
    if(ta) ta.value=text; if(ti) ti.value=_readerTitle; if(au) au.value=_readerAuthor;
    document.querySelectorAll('#table-modal .db-tab').forEach(t=>{
      if(t.textContent.includes('Queue')&&typeof tableTab==='function') tableTab(t,'tt-queue');
    });
  };

  function _getSelText() {
    if (!_selectedParas.size) { if(typeof showSchToast==='function') showSchToast('Select at least one paragraph first'); return null; }
    return [..._selectedParas].sort((a,b)=>a-b).map(i=>_readerParas[i]?.text||'').filter(Boolean).join('\n\n');
  }


  /* ══════════════════════════════════════════════════════════
     FIX 1 — FILE IMPORT IN BUILT-IN READER
  ══════════════════════════════════════════════════════════ */

  function buildReaderImport() {
    const readerBody = document.querySelector('#tt-reader .modal-body');
    if (!readerBody || document.getElementById('reader-import-zone')) return;

    const zone = document.createElement('div');
    zone.id = 'reader-import-zone';
    zone.innerHTML = `
      <div class="tt-imp-icon">📄</div>
      <div class="tt-imp-text">Import sermon file — extracted text loads into the reader</div>
      <div class="tt-imp-sub">Click to browse or drag and drop</div>
      <div class="tt-imp-formats">
        <span class="tt-fmt-tag">.TXT</span>
        <span class="tt-fmt-tag">.PDF</span>
        <span class="tt-fmt-tag">.DOCX</span>
        <span class="tt-fmt-tag">.EPUB</span>
        <span class="tt-fmt-tag">.RTF</span>
        <span class="tt-fmt-tag">.MD</span>
      </div>`;

    zone.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type='file'; inp.accept='.txt,.pdf,.docx,.doc,.epub,.rtf,.md,.markdown'; inp.style.display='none';
      inp.addEventListener('change', e => _handleFile(e.target.files[0]));
      document.body.appendChild(inp); inp.click();
      setTimeout(()=>inp.remove(), 12000);
    });
    zone.addEventListener('dragover',  e=>{e.preventDefault();zone.classList.add('drag-over');});
    zone.addEventListener('dragleave', ()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e=>{
      e.preventDefault(); zone.classList.remove('drag-over');
      _handleFile(e.dataTransfer.files[0]);
    });

    /* Insert at top of reader modal body */
    readerBody.insertBefore(zone, readerBody.firstChild);
  }

  async function _handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (typeof showSchToast === 'function') showSchToast('⏳ Reading ' + file.name + '…');
    try {
      let text = '';
      if (['txt','md','markdown'].includes(ext)) {
        text = await _readText(file);
      } else if (ext === 'rtf') {
        text = _stripRTF(await _readText(file));
      } else if (ext === 'pdf') {
        text = await _extractPDF(file);
      } else if (['docx','doc'].includes(ext)) {
        text = await _extractDOCX(file);
      } else if (ext === 'epub') {
        text = await _extractEPUB(file);
      } else {
        text = await _readText(file);
      }
      if (!text.trim()) throw new Error('No text could be extracted from this file.');

      /* Load as a "virtual sermon" in the reader paragraph list */
      const title  = file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      _readerTitle  = title;
      _readerAuthor = '';
      _selectedParas.clear();

      /* Split into paragraphs */
      const paras = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
      _readerParas = paras.map((t,i) => ({ text:t, section:title, idx:i }));
      _renderReaderParas();

      /* Show viewer */
      const viewer  = document.getElementById('reader-viewer');
      const titleEl = document.getElementById('reader-sermon-title');
      if (viewer)  viewer.style.display = 'block';
      if (titleEl) titleEl.textContent  = title;
      viewer?.scrollIntoView({ behavior:'smooth', block:'nearest' });

      if (typeof showSchToast === 'function')
        showSchToast(`✓ "${file.name}" loaded — ${paras.length} paragraphs`);
    } catch(err) {
      if (typeof showSchToast === 'function') showSchToast('⚠ ' + err.message);
    }
  }

  function _readText(file) {
    return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=()=>rej(new Error('Read failed')); r.readAsText(file,'UTF-8'); });
  }
  function _stripRTF(rtf) {
    return rtf.replace(/\{[^{}]*\}/g,' ').replace(/\\par\b|\\line\b/gi,'\n')
      .replace(/\\[a-z*]+[-]?\d*[ ]?/gi,'').replace(/[{}\\]/g,'')
      .replace(/[ \t]+/g,' ').split('\n').map(l=>l.trim()).join('\n')
      .replace(/\n{3,}/g,'\n\n').trim();
  }
  async function _extractPDF(file) {
    if (typeof pdfjsLib==='undefined') {
      await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const buf=await file.arrayBuffer(); const doc=await pdfjsLib.getDocument({data:buf}).promise;
    const pages=[];
    for(let p=1;p<=doc.numPages;p++){const pg=await doc.getPage(p);const c=await pg.getTextContent();pages.push(c.items.map(i=>i.str).join(' '));}
    return pages.join('\n\n');
  }
  async function _extractDOCX(file) {
    if (typeof mammoth==='undefined') await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const buf=await file.arrayBuffer(); const r=await mammoth.extractRawText({arrayBuffer:buf}); return r.value||'';
  }
  async function _extractEPUB(file) {
    if (typeof JSZip==='undefined') await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const buf=await file.arrayBuffer(); const zip=await JSZip.loadAsync(buf);
    const texts=[];
    const files=Object.keys(zip.files).filter(n=>/\.(html?|xhtml)$/i.test(n)).sort();
    for(const fn of files){const html=await zip.files[fn].async('text');const doc=new DOMParser().parseFromString(html,'text/html');texts.push(doc.body?.textContent||'');}
    return texts.join('\n\n');
  }
  function _loadScript(src) {
    return new Promise((res,rej)=>{ if(document.querySelector(`script[src="${src}"]`)){res();return;} const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('Load failed: '+src)); document.head.appendChild(s); });
  }


  /* ══════════════════════════════════════════════════════════
     FIX 2 — "ADD TO SCHEDULE" BUTTON IN QUEUE TAB
  ══════════════════════════════════════════════════════════ */

  function injectQueueScheduleBtn() {
    /* The existing action bar has "Project Now" and "Add to Service Order" */
    const actionBar = document.querySelector('.queue-action-bar');
    if (!actionBar || document.getElementById('queue-sch-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'queue-sch-btn';
    btn.className = 'queue-action-btn';
    btn.innerHTML = `<span class="qab-icon">📅</span>
                     <span class="qab-label">Add to Schedule</span>
                     <span class="qab-sub">Run order</span>`;
    btn.addEventListener('click', () => {
      const title  = (document.getElementById('table-sermon-title')?.value || 'Message').trim();
      const author = (document.getElementById('table-sermon-author')?.value || '').trim();
      const raw    = document.getElementById('table-sermon-text')?.value || '';
      if (!raw.trim()) { if(typeof showSchToast==='function') showSchToast('Add sermon text first'); return; }
      _addToSchedule(raw, title, author);
    });

    /* Insert after the "Add to Service Order" button */
    const soBtn = actionBar.querySelector('.queue-so-btn');
    if (soBtn) soBtn.insertAdjacentElement('afterend', btn);
    else        actionBar.appendChild(btn);
  }


  /* ══════════════════════════════════════════════════════════
     INJECT EVERYTHING WHEN THE TABLE OPENS
  ══════════════════════════════════════════════════════════ */

  const _origOpen = window.openTheTable;
  window.openTheTable = function () {
    if (_origOpen) _origOpen();
    setTimeout(() => {
      _injectNuggetsTab();
      _injectReaderSelBar();
      buildReaderImport();
      injectQueueScheduleBtn();
      renderNuggets();
      _updateNuggetBadge();
    }, 150);
  };

  function _injectNuggetsTab() {
    if (document.getElementById('tt-nuggets')) return;
    const tabBar = document.querySelector('#table-modal .db-tabs-bar');
    if (!tabBar) return;

    const tabBtn = document.createElement('div');
    tabBtn.className = 'db-tab';
    tabBtn.id = 'tt-nuggets-tab';
    tabBtn.innerHTML = `⭐ Golden Nuggets <span class="nugget-tab-badge nugget-count-badge" style="opacity:0;"></span>`;
    tabBtn.addEventListener('click', () => { if(typeof tableTab==='function') tableTab(tabBtn,'tt-nuggets'); renderNuggets(); });
    tabBar.appendChild(tabBtn);

    const panel = document.createElement('div');
    panel.className = 'table-panel'; panel.id = 'tt-nuggets'; panel.style.display = 'none';
    panel.innerHTML = `
      <div class="modal-body db-scroll">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;">
          <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:var(--gold,#c9a84c);text-transform:uppercase;">⭐ Golden Nuggets</div>
          <button class="lib-icon-btn" onclick="nuggetClearAll()" style="color:var(--red,#e05050);">Clear All</button>
        </div>
        <div class="nugget-list" id="nugget-list"></div>
      </div>
      <div class="modal-foot">
        <button class="modal-btn-cancel" onclick="closeTheTable()">Close</button>
      </div>`;
    const modal = document.querySelector('#table-modal .modal');
    if (modal) modal.appendChild(panel);
    _updateNuggetBadge();
  }

  function _injectReaderSelBar() {
    if (document.getElementById('reader-sel-bar')) return;
    const viewer = document.getElementById('reader-viewer');
    if (!viewer) return;
    const bar = document.createElement('div');
    bar.id = 'reader-sel-bar';
    bar.innerHTML = `
      <span id="reader-sel-count"></span>
      <button class="rsel-btn proj"   onclick="readerProjectSelected()">▶ Project Selected</button>
      <button class="rsel-btn"        onclick="readerScheduleSelected()">📅 Add to Schedule</button>
      <button class="rsel-btn nugget" onclick="readerSaveNugget()">⭐ Save Nugget</button>
      <button class="rsel-btn"        onclick="readerClearSel()">✕ Clear</button>`;
    viewer.insertBefore(bar, viewer.firstChild);
  }


  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function _esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }


  console.info('[BW fix9 v2] ✓ File import in Reader  ✓ Queue Schedule btn  ✓ Para-select  ✓ Nuggets  ✓ Title labels');

})();