/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix28-media.js  (v3)
   Fixes:
   1. Media stored in IndexedDB (no localStorage quota issue).
   2. Clicking a thumbnail previews locally — does NOT open
      the second screen. ▶ Project button sends to screen.
   3. Media shows in the local output preview (#out-screen).
   Upgrades:
   4. Ctrl+O  — toggle media on / off on second screen.
   5. Ctrl+P  — activate opacity mode; +/- adjust opacity.
   6. "Clear Media" button added to the bottom action bar.
═══════════════════════════════════════════════════════════ */

(function BW_fix28() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     IndexedDB — store full media data here (no size limit)
  ══════════════════════════════════════════════════════════ */
  const IDB_NAME  = 'BrideWorshipMedia';
  const IDB_VER   = 1;
  const IDB_STORE = 'media';
  const IDX_KEY   = 'bw_media_index_v3';   // localStorage: array of {id,name,type,mime,addedAt}

  let _idbPromise = null;
  function _idb() {
    if (_idbPromise) return _idbPromise;
    _idbPromise = new Promise((res, rej) => {
      const req = indexedDB.open(IDB_NAME, IDB_VER);
      req.onupgradeneeded = e => {
        if (!e.target.result.objectStoreNames.contains(IDB_STORE))
          e.target.result.createObjectStore(IDB_STORE, { keyPath: 'id' });
      };
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
    return _idbPromise;
  }

  async function idbPut(item)  { const db = await _idb(); return new Promise((r,j)=>{ const tx=db.transaction(IDB_STORE,'readwrite'); tx.objectStore(IDB_STORE).put(item).onsuccess=()=>r(true); tx.onerror=e=>j(e.target.error); }); }
  async function idbGet(id)    { const db = await _idb(); return new Promise((r,j)=>{ const tx=db.transaction(IDB_STORE,'readonly');  const req=tx.objectStore(IDB_STORE).get(id); req.onsuccess=e=>r(e.target.result||null); req.onerror=e=>j(e.target.error); }); }
  async function idbDel(id)    { const db = await _idb(); return new Promise((r,j)=>{ const tx=db.transaction(IDB_STORE,'readwrite'); tx.objectStore(IDB_STORE).delete(id).onsuccess=()=>r(true); tx.onerror=e=>j(e.target.error); }); }

  /* Index = lightweight metadata stored in localStorage */
  function _loadIndex()      { try { return JSON.parse(localStorage.getItem(IDX_KEY)||'[]'); } catch(e) { return []; } }
  function _saveIndex(idx)   { try { localStorage.setItem(IDX_KEY, JSON.stringify(idx)); } catch(e) {} }
  function _addToIndex(meta) { const idx=_loadIndex(); idx.unshift(meta); if(idx.length>200) idx.pop(); _saveIndex(idx); }
  function _delFromIndex(id) { _saveIndex(_loadIndex().filter(m=>m.id!==id)); }


  /* ══════════════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════════════ */
  let _activeItem   = null;   // full item {id,name,type,mime,dataUrl}
  let _mediaOn      = false;  // is media currently projected?
  let _opacity      = 1.0;    // 0.0 – 1.0
  let _opacityMode  = false;  // true = Ctrl+P activated, +/- adjust
  let _activeTab    = 'image';


  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _style = document.createElement('style');
  _style.textContent = `
    /* ── media panel ── */
    #media-tab-bar { display:flex; border-bottom:1px solid var(--border-dim); flex-shrink:0; }
    .mdb-tab { flex:1; padding:7px 4px; text-align:center; font-size:10px; font-family:'Cinzel',serif; letter-spacing:1px; text-transform:uppercase; color:var(--text-3); cursor:pointer; border-bottom:2px solid transparent; transition:color .12s,border-color .12s; }
    .mdb-tab.active { color:var(--gold,#c9a84c); border-bottom-color:var(--gold,#c9a84c); }
    .media-add-row { display:flex; gap:5px; padding:7px 8px; border-bottom:1px solid var(--border-dim); flex-shrink:0; }
    .media-add-btn { flex:1; padding:6px 8px; font-size:11px; border:1px dashed var(--border-dim); border-radius:5px; background:var(--bg-card); color:var(--text-2); cursor:pointer; text-align:center; transition:background .12s,border-color .15s; }
    .media-add-btn:hover { background:var(--bg-hover); border-color:var(--gold-dim); color:var(--gold); }
    #media-grid-wrap { flex:1 1 0; min-height:0; overflow-y:auto; padding:6px; }
    #media-grid-wrap::-webkit-scrollbar { width:3px; }
    .media-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(80px,1fr)); gap:5px; }
    .media-thumb { position:relative; border-radius:5px; overflow:hidden; border:1px solid var(--border-dim); background:var(--bg-card); cursor:pointer; aspect-ratio:16/9; transition:border-color .15s,box-shadow .15s; }
    .media-thumb:hover { border-color:rgba(201,168,76,.4); }
    .media-thumb.selected { border-color:var(--gold,#c9a84c); box-shadow:0 0 0 2px rgba(201,168,76,.3); }
    .media-thumb.live { border-color:var(--green,#4caf7a); box-shadow:0 0 0 2px var(--green,#4caf7a); }
    .media-thumb img,.media-thumb video { width:100%; height:100%; object-fit:cover; pointer-events:none; }
    .media-thumb-label { position:absolute; bottom:0; left:0; right:0; padding:2px 4px; background:rgba(0,0,0,.7); font-size:8px; color:rgba(255,255,255,.8); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .media-thumb-del { position:absolute; top:2px; right:2px; width:15px; height:15px; border-radius:50%; background:rgba(0,0,0,.65); color:#fff; font-size:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity .12s; }
    .media-thumb:hover .media-thumb-del { opacity:1; }
    .media-thumb-del:hover { background:rgba(224,80,80,.85); }
    .media-video-badge { position:absolute; top:2px; left:2px; background:rgba(0,0,0,.65); color:#fff; font-size:7px; padding:1px 3px; border-radius:2px; }
    .media-empty { grid-column:1/-1; padding:16px; text-align:center; font-size:11px; color:var(--text-3); line-height:1.7; }
    #media-action-bar { flex-shrink:0; display:flex; gap:4px; padding:6px 8px; border-top:1px solid var(--border-dim); align-items:center; flex-wrap:wrap; }
    #media-now-label { flex:1; min-width:0; font-size:9px; color:var(--text-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    #media-opacity-row { width:100%; display:none; align-items:center; gap:5px; padding:0 2px; }
    #media-opacity-row.visible { display:flex; }
    .mop-lbl { font-size:9px; color:var(--text-3); flex-shrink:0; }
    #media-opacity-slider { flex:1; accent-color:var(--gold,#c9a84c); }
    #media-opacity-val { font-size:10px; color:var(--gold,#c9a84c); min-width:30px; text-align:right; font-family:'Cinzel',serif; }
    .media-bar-btn { padding:4px 8px; font-size:11px; border-radius:4px; cursor:pointer; white-space:nowrap; flex-shrink:0; border:1px solid var(--border-dim); background:var(--bg-card); color:var(--text-2); transition:background .1s; }
    .media-bar-btn:hover { background:var(--bg-hover); }
    .media-bar-btn:disabled { opacity:.4; cursor:default; }
    #media-proj-btn { background:var(--gold,#c9a84c); border-color:var(--gold,#c9a84c); color:#000; font-weight:700; }
    #media-proj-btn:hover { opacity:.85; }
    #media-proj-btn.live { background:var(--green,#4caf7a); border-color:var(--green,#4caf7a); color:#000; }
    #media-clear-panel-btn.cleared { background:rgba(224,80,80,.12); border-color:rgba(224,80,80,.5); color:var(--red,#e05050); }

    /* ── Local output preview overlay ── */
    #out-media-overlay {
      position: absolute; inset: 0; z-index: 0;  /* BEHIND everything */
      pointer-events: none; display: none;
    }
    #out-media-overlay img, #out-media-overlay video {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover; display: none;
    }
    /* Keep all out-screen children above the media overlay */
    #out-screen > *:not(#out-media-overlay) { position: relative; z-index: 1; }

    /* ── Bottom bar clear button ── */
    #bottom-clear-media-btn {
      padding: 0 10px; height: 28px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-card); color: var(--text-2);
      font-size: 11px; cursor: pointer; white-space: nowrap;
      transition: background .1s, border-color .15s;
      flex-shrink: 0; display: flex; align-items: center; gap: 4px;
    }
    #bottom-clear-media-btn:hover { background: var(--bg-hover); border-color: var(--gold-dim); }
    #bottom-clear-media-btn.cleared { background:rgba(201,168,76,.12); border-color:var(--gold,#c9a84c); color:var(--gold,#c9a84c); }

    /* ── Opacity indicator toast ── */
    #opacity-toast {
      position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,.8); color: #fff; padding: 6px 16px;
      border-radius: 20px; font-size: 13px; font-family:'Cinzel',serif;
      pointer-events: none; opacity: 0; transition: opacity .25s;
      z-index: 9999; white-space: nowrap;
    }
    #opacity-toast.show { opacity: 1; }
  `;
  document.head.appendChild(_style);


  /* ══════════════════════════════════════════════════════════
     OPACITY TOAST
  ══════════════════════════════════════════════════════════ */
  function _showOpacityToast() {
    let t = document.getElementById('opacity-toast');
    if (!t) { t=document.createElement('div'); t.id='opacity-toast'; document.body.appendChild(t); }
    t.textContent = `Opacity ${Math.round(_opacity*100)}%${_opacityMode ? ' (active)' : ''}`;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(()=>t.classList.remove('show'), 1800);
  }


  /* ══════════════════════════════════════════════════════════
     LOCAL PREVIEW OVERLAY (in #out-screen)
  ══════════════════════════════════════════════════════════ */

  function _ensureLocalOverlay() {
    const screen = document.getElementById('out-screen');
    if (!screen) return null;
    if (window.getComputedStyle(screen).position === 'static')
      screen.style.position = 'relative';
    let ov = document.getElementById('out-media-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'out-media-overlay';
      ov.innerHTML = '<img id="out-ml-img" alt=""><video id="out-ml-vid" autoplay loop muted playsinline></video>';
      screen.insertBefore(ov, screen.firstChild);
    }
    return ov;
  }

  function _updateLocalPreview() {
    const ov  = _ensureLocalOverlay();
    const img = document.getElementById('out-ml-img');
    const vid = document.getElementById('out-ml-vid');
    if (!ov) return;

    if (!_activeItem || !_mediaOn) {
      ov.style.display = 'none';
      if (img) img.style.display = 'none';
      if (vid) { vid.pause(); vid.style.display = 'none'; }
      return;
    }

    ov.style.display  = 'block';
    ov.style.opacity  = _opacity;

    if (_activeItem.mime?.startsWith('video/')) {
      if (img) img.style.display = 'none';
      if (vid) {
        vid.style.display = 'block';
        if (vid.src !== _activeItem.dataUrl) { vid.src = _activeItem.dataUrl; vid.load(); vid.play().catch(()=>{}); }
      }
    } else {
      if (vid) { vid.pause(); vid.style.display = 'none'; }
      if (img) {
        img.style.display = 'block';
        if (img.src !== _activeItem.dataUrl) img.src = _activeItem.dataUrl;
      }
    }
  }


  /* ══════════════════════════════════════════════════════════
     PROJECTION WINDOW MEDIA LAYER
  ══════════════════════════════════════════════════════════ */

  const PROJ_CSS = `
    #proj-media-layer { position:fixed; inset:0; z-index:1; display:none; pointer-events:none; }
    #proj-media-layer img,
    #proj-media-layer video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:none; }
    #proj-text-wrap,#proj-ref,#proj-footer { position:relative; z-index:2; }
  `;

  function _ensureProjLayer(pw) {
    if (!pw||pw.closed||!pw.document.body) return null;
    let layer = pw.document.getElementById('proj-media-layer');
    if (!layer) {
      const st = pw.document.createElement('style');
      st.textContent = PROJ_CSS;
      pw.document.head.appendChild(st);
      layer = pw.document.createElement('div');
      layer.id = 'proj-media-layer';
      layer.innerHTML = '<img id="proj-ml-img" alt=""><video id="proj-ml-vid" autoplay loop muted playsinline></video>';
      pw.document.body.insertBefore(layer, pw.document.body.firstChild);
    }
    return layer;
  }

  function _pushToProj() {
    const pw = S?.projWin;
    if (!pw||pw.closed) return;
    const layer = _ensureProjLayer(pw);
    if (!layer) return;
    const img = pw.document.getElementById('proj-ml-img');
    const vid = pw.document.getElementById('proj-ml-vid');

    if (!_activeItem || !_mediaOn) {
      layer.style.display='none';
      if(img) img.style.display='none';
      if(vid){vid.pause();vid.style.display='none';}
      return;
    }
    layer.style.display='block';
    layer.style.opacity=_opacity;

    if (_activeItem.mime?.startsWith('video/')) {
      if(img) img.style.display='none';
      if(vid){
        vid.style.display='block';
        if(vid.src!==_activeItem.dataUrl){vid.src=_activeItem.dataUrl;vid.load();vid.play().catch(()=>{});}
      }
    } else {
      if(vid){vid.pause();vid.style.display='none';}
      if(img){img.style.display='block';if(img.src!==_activeItem.dataUrl)img.src=_activeItem.dataUrl;}
    }
  }

  function _syncAll() { _updateLocalPreview(); _pushToProj(); _updateUI(); }


  /* ══════════════════════════════════════════════════════════
     PROJECT / CLEAR
  ══════════════════════════════════════════════════════════ */

  window.mediaProject = function () {
    if (!_activeItem) return;
    _mediaOn = true;
    _syncAll();
    if (typeof showSchToast === 'function') showSchToast('▶ ' + _activeItem.name);
  };

  window.mediaToggleClear = function () {
    _mediaOn = !_mediaOn;
    _syncAll();
    if (typeof showSchToast === 'function')
      showSchToast(_mediaOn ? '▶ Media on' : '✕ Media cleared');
  };


  /* ══════════════════════════════════════════════════════════
     OPACITY
  ══════════════════════════════════════════════════════════ */

  function _setOpacity(v) {
    _opacity = Math.max(0, Math.min(1, Math.round(v * 20) / 20)); // steps of 0.05
    const sl = document.getElementById('media-opacity-slider');
    const vl = document.getElementById('media-opacity-val');
    if (sl) sl.value = Math.round(_opacity * 100);
    if (vl) vl.textContent = Math.round(_opacity * 100) + '%';
    _syncAll();
    _showOpacityToast();
  }

  window.mediaOpacityChange = v => _setOpacity(parseInt(v) / 100);


  /* ══════════════════════════════════════════════════════════
     UI SYNC
  ══════════════════════════════════════════════════════════ */

  function _updateUI() {
    /* Panel buttons */
    const projBtn  = document.getElementById('media-proj-btn');
    const clrBtn   = document.getElementById('media-clear-panel-btn');
    const bottomBtn = document.getElementById('bottom-clear-media-btn');

    if (projBtn) {
      projBtn.disabled = !_activeItem;
      if (_mediaOn) { projBtn.textContent='⏹ Stop'; projBtn.classList.add('live'); }
      else          { projBtn.textContent='▶ Project'; projBtn.classList.remove('live'); }
    }
    if (clrBtn) {
      clrBtn.disabled = !_activeItem;
      if (!_mediaOn)  { clrBtn.textContent='🖼 Restore'; clrBtn.classList.add('cleared'); }
      else            { clrBtn.textContent='✕ Clear'; clrBtn.classList.remove('cleared'); }
    }
    if (bottomBtn) {
      if (!_mediaOn) { bottomBtn.textContent='🖼 Restore Media'; bottomBtn.classList.add('cleared'); }
      else           { bottomBtn.textContent='✕ Clear Media'; bottomBtn.classList.remove('cleared'); }
    }

    /* Thumbnail highlights */
    document.querySelectorAll('.media-thumb').forEach(el => {
      const id = el.dataset.mediaid;
      el.classList.toggle('selected', id === _activeItem?.id);
      el.classList.toggle('live',     id === _activeItem?.id && _mediaOn);
    });

    /* Label */
    const lbl = document.getElementById('media-now-label');
    if (lbl) lbl.textContent = _activeItem
      ? `${_activeItem.name}${_mediaOn ? ' (live)' : ' (preview)'}`
      : 'No media selected';
  }


  /* ══════════════════════════════════════════════════════════
     LOAD MEDIA FROM IndexedDB THEN PREVIEW
  ══════════════════════════════════════════════════════════ */

  async function _selectItem(id) {
    /* Load full data from IDB */
    let item = null;
    try { item = await idbGet(id); } catch(e) { console.warn(e); }
    if (!item) { if(typeof showSchToast==='function') showSchToast('⚠ Media not found'); return; }

    _activeItem = item;
    _mediaOn    = false;   /* just preview — don't auto-project */

    /* Show in local preview only */
    _updateLocalPreview();
    _updateUI();
  }

  window.mediaSelect = id => _selectItem(id);


  /* ══════════════════════════════════════════════════════════
     FILE IMPORT — save to IndexedDB
  ══════════════════════════════════════════════════════════ */

  window.mediaAddFile = function () {
    const accepts = { image:'image/*', video:'video/*', background:'image/*' };
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = accepts[_activeTab]||'*/*'; inp.multiple = true;
    inp.style.display = 'none';
    inp.addEventListener('change', e => _handleFiles(e.target.files));
    document.body.appendChild(inp); inp.click();
    setTimeout(()=>inp.remove(), 15000);
  };

  function _handleFiles(files) {
    Array.from(files||[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = async e => {
        const id = 'med_' + Date.now() + '_' + Math.random().toString(36).slice(2,5);
        const item = { id, name:file.name, type:_activeTab, mime:file.type,
                       dataUrl:e.target.result, addedAt:new Date().toISOString() };
        try {
          await idbPut(item);
          _addToIndex({ id, name:file.name, type:_activeTab, mime:file.type, addedAt:item.addedAt });
          _renderGrid();
          if (typeof showSchToast==='function') showSchToast('✓ '+file.name+' saved');
        } catch(err) {
          if (typeof showSchToast==='function') showSchToast('⚠ Failed to save: '+err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  window.mediaDelete = async function (id) {
    if (_activeItem?.id === id) { _activeItem=null; _mediaOn=false; _syncAll(); }
    await idbDel(id);
    _delFromIndex(id);
    _renderGrid();
    _updateUI();
    if (typeof showSchToast==='function') showSchToast('Removed');
  };


  /* ══════════════════════════════════════════════════════════
     RENDER GRID
  ══════════════════════════════════════════════════════════ */

  function _renderGrid() {
    const grid = document.getElementById('media-grid');
    if (!grid) return;
    const idx   = _loadIndex();
    const items = idx.filter(m => m.type === _activeTab);
    if (!items.length) {
      const t = {image:'images',video:'videos',background:'backgrounds'}[_activeTab]||'files';
      grid.innerHTML = `<div class="media-empty">No ${t} yet.<br>Click "Add" to import.</div>`;
      return;
    }
    grid.innerHTML = items.map(m => `
      <div class="media-thumb ${m.id===_activeItem?.id?(_mediaOn?'live':'selected'):''}"
           id="mthumb-${m.id}" data-mediaid="${m.id}"
           onclick="mediaSelect('${m.id}')">
        <div style="position:absolute;inset:0;background:var(--bg-card);display:flex;align-items:center;justify-content:center;">
          ${m.mime?.startsWith('video')
            ? `<span style="font-size:22px;">🎬</span><span class="media-video-badge">▶</span>`
            : `<span style="font-size:22px;">🖼</span>`}
        </div>
        <span class="media-thumb-label" title="${_esc(m.name)}">${_esc(m.name)}</span>
        <span class="media-thumb-del"
          onclick="event.stopPropagation();mediaDelete('${m.id}')"
          title="Remove">✕</span>
      </div>`).join('');
    /* Lazy-load thumbnails from IDB */
    items.forEach(m => {
      idbGet(m.id).then(full => {
        if (!full) return;
        const el = document.getElementById('mthumb-'+m.id);
        if (!el) return;
        const inner = el.querySelector('div');
        if (!inner) return;
        if (m.mime?.startsWith('video')) {
          inner.innerHTML = `<video src="${_esc(full.dataUrl)}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover;"></video>`;
        } else {
          inner.innerHTML = `<img src="${_esc(full.dataUrl)}" alt="${_esc(m.name)}" style="width:100%;height:100%;object-fit:cover;">`;
        }
      }).catch(()=>{});
    });
  }


  /* ══════════════════════════════════════════════════════════
     PANEL BUILD
  ══════════════════════════════════════════════════════════ */

  window.mediaSetTab = function (type) {
    _activeTab = type;
    document.querySelectorAll('.mdb-tab').forEach(t=>t.classList.toggle('active',t.dataset.type===type));
    const lbl = document.getElementById('media-add-label');
    if (lbl) lbl.textContent = {image:'Image',video:'Video',background:'Background'}[type]||'File';
    _renderGrid();
  };

  function _buildMediaPanel() {
    const ms = document.querySelector('#ls-media, .ls-media-section');
    if (!ms || document.getElementById('media-tab-bar')) return;
    ms.innerHTML=''; ms.style.cssText='display:flex;flex-direction:column;height:100%;overflow:hidden;';
    ms.innerHTML=`
      <div id="media-tab-bar">
        <div class="mdb-tab active" data-type="image"      onclick="mediaSetTab('image')">🖼 Images</div>
        <div class="mdb-tab"       data-type="video"       onclick="mediaSetTab('video')">🎬 Videos</div>
        <div class="mdb-tab"       data-type="background"  onclick="mediaSetTab('background')">🌅 BG</div>
      </div>
      <div class="media-add-row">
        <button class="media-add-btn" onclick="mediaAddFile()">
          ⬆ Add <span id="media-add-label">Image</span>
        </button>
      </div>
      <div id="media-grid-wrap"><div class="media-grid" id="media-grid"></div></div>
      <div id="media-action-bar">
        <span id="media-now-label">No media selected</span>
        <div id="media-opacity-row">
          <span class="mop-lbl">Opacity</span>
          <input id="media-opacity-slider" type="range" min="0" max="100"
            value="${Math.round(_opacity*100)}"
            oninput="mediaOpacityChange(this.value)">
          <span id="media-opacity-val">${Math.round(_opacity*100)}%</span>
        </div>
        <button class="media-bar-btn" id="media-opacity-btn"
          onclick="document.getElementById('media-opacity-row').classList.toggle('visible')"
          title="Adjust opacity (Ctrl+P)">◑ Opacity</button>
        <button class="media-bar-btn" id="media-clear-panel-btn"
          onclick="mediaToggleClear()" disabled>✕ Clear</button>
        <button class="media-bar-btn" id="media-proj-btn"
          onclick="mediaProject()" disabled>▶ Project</button>
      </div>`;
    _renderGrid();
    _updateUI();
  }


  /* ══════════════════════════════════════════════════════════
     BOTTOM BAR "CLEAR MEDIA" BUTTON
  ══════════════════════════════════════════════════════════ */

  function _addBottomBarButton() {
    if (document.getElementById('bottom-clear-media-btn')) return;
    /* Look for the controls row that sits directly below #out-screen.
       The output preview has an .out-ctrl / #out-ctrl bar with the
       blank/freeze/logo buttons. Inject there; fall back to .size-ctrl. */
    const anchor = document.querySelector(
      '#out-ctrl, .out-ctrl, #out-bar, .out-bar, ' +
      '#out-btns, .out-btns, #out-controls, .out-controls, ' +
      '.out-wrap .ctrl-row, #out-wrap-sticky .ctrl-row, ' +
      '.out-wrap .bar, #out-wrap-sticky .bar'
    );
    const btn = document.createElement('button');
    btn.id = 'bottom-clear-media-btn';
    btn.textContent = '✕ Clear Media';
    btn.title = 'Clear / restore media on projection (Ctrl+O)';
    btn.addEventListener('click', mediaToggleClear);
    if (anchor) {
      anchor.appendChild(btn);
    } else {
      /* Fallback: inject right after the out-screen element */
      const outScreen = document.getElementById('out-screen');
      if (outScreen) outScreen.insertAdjacentElement('afterend', btn);
    }
  }


  /* ══════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    const tag  = document.activeElement?.tagName;
    const inInput = tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';

    /* Ctrl+O — toggle media on/off */
    if (ctrl && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      if (_activeItem) mediaToggleClear();
      else if (typeof showSchToast==='function') showSchToast('No media selected');
      return;
    }

    /* Ctrl+P — toggle opacity mode */
    if (ctrl && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      _opacityMode = !_opacityMode;
      if (typeof showSchToast==='function')
        showSchToast(_opacityMode ? '◑ Opacity mode ON — use + / −' : '◑ Opacity mode OFF');
      /* Show/hide slider row */
      document.getElementById('media-opacity-row')?.classList.toggle('visible', _opacityMode);
      _showOpacityToast();
      return;
    }

    /* + / − when opacity mode active — stop propagation so text resize doesn't fire */
    if (_opacityMode && !inInput) {
      if (e.key==='+' || e.key==='=') {
        e.preventDefault(); e.stopImmediatePropagation();
        _setOpacity(_opacity + 0.05);
      }
      if (e.key==='-' || e.key==='_') {
        e.preventDefault(); e.stopImmediatePropagation();
        _setOpacity(_opacity - 0.05);
      }
    }
  }, true);


  /* ══════════════════════════════════════════════════════════
     PATCH openProjection — inject layer after window ready
  ══════════════════════════════════════════════════════════ */

  const _origOP = window.openProjection;
  if (typeof _origOP === 'function') {
    window.openProjection = async function () {
      await _origOP();
      let n=0;
      const t=setInterval(()=>{
        const pw=S?.projWin;
        if (pw&&!pw.closed&&pw.document.body) {
          clearInterval(t);
          _ensureProjLayer(pw);
          if (_activeItem&&_mediaOn) _pushToProj();
        }
        if (++n>20) clearInterval(t);
      }, 150);
    };
  }

  /* Re-push on every push() so media survives slide changes */
  const _origPush = window.push;
  if (typeof _origPush === 'function') {
    window.push = function () {
      _origPush();
      if (_activeItem && _mediaOn) {
        requestAnimationFrame(() => { _ensureProjLayer(S?.projWin); _pushToProj(); });
      }
    };
  }


  /* ══════════════════════════════════════════════════════════
     HOOKS
  ══════════════════════════════════════════════════════════ */

  const _origLT = window.libTab;
  window.libTab = function (btn, sid) {
    if (_origLT) _origLT(btn, sid);
    if (sid==='ls-media') setTimeout(_buildMediaPanel, 80);
  };
  const _origTT = window.topTab;
  window.topTab = function (btn) {
    if (_origTT) _origTT(btn);
    if (btn?.getAttribute('data-lib')==='ls-media') setTimeout(_buildMediaPanel, 80);
  };


  /* ══════════════════════════════════════════════════════════
     UTILITY
  ══════════════════════════════════════════════════════════ */
  function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  function boot() {
    _ensureLocalOverlay();
    _addBottomBarButton();
    setTimeout(_buildMediaPanel, 400);
    console.info('[BW fix28 v3] ✓ IDB storage ✓ Preview-only click ✓ Opacity ✓ Ctrl+O/P ✓ Bottom bar');
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 300);

})();
