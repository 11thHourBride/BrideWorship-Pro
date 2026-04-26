/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix20.js  (v2 — complete rewrite)
   Two-panel Built-in Reader replacing tt-reader.
   All previous bugs fixed:
   · CSS only activates with tp-active (no bleed over tabs)
   · onclick uses data-id not JSON.stringify (no attr breakage)
   · Proper flex column layout — paragraphs scroll correctly
   · Project / Schedule / Nugget all wired and working
   · Full-page mode when reader tab is active
   · Golden Nugget button on every selection bar
═══════════════════════════════════════════════════════════ */

(function BW_Fix20() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _css = document.createElement('style');
  _css.id = 'bw-fix20-css';
  _css.textContent = `

  /* Reader ONLY shows when it is the active tab */
  #tt-reader.f20-ready                   { display: none   !important; }
  #tt-reader.f20-ready.tp-active         {
    display:         flex   !important;
    flex-direction:  row    !important;
    overflow:        hidden !important;
    padding:         0      !important;
    flex:            1 1 0;
    min-height:      0;
  }

  /* Full-page when reader active */
  .f20-fullpage .table-modal-box {
    width:         100vw !important;
    max-width:     100vw !important;
    height:        100vh !important;
    max-height:    100vh !important;
    border-radius: 0     !important;
    margin:        0     !important;
  }
  .f20-fullpage { padding: 0 !important; align-items: flex-start !important; }

  /* ── LEFT PANEL ─────────────────────────────── */
  #f20-left {
    width: 290px; min-width: 200px; max-width: 330px;
    display: flex; flex-direction: column;
    border-right: 1px solid var(--border-dim);
    background: var(--bg-deep, #09090f);
    flex-shrink: 0; overflow: hidden;
  }
  #f20-ltoolbar {
    padding: 8px 8px 6px; border-bottom: 1px solid var(--border-dim);
    display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  }
  #f20-sort-row { display: flex; gap: 3px; }
  .f20-sb {
    flex: 1; padding: 5px 3px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-3); font-size: 9px; font-family: 'Cinzel', serif;
    cursor: pointer; text-align: center; transition: all .12s;
    display: flex; flex-direction: column; align-items: center; gap: 1px;
  }
  .f20-sb-icon { font-size: 12px; }
  .f20-sb:hover { border-color: var(--gold-dim); color: var(--text-2); }
  .f20-sb.on {
    background: rgba(201,168,76,.12); border-color: var(--gold,#c9a84c);
    color: var(--gold,#c9a84c);
  }
  #f20-sir { display: flex; gap: 5px; align-items: center; }
  #f20-ls {
    flex: 1; font-size: 11px; padding: 5px 8px;
    background: var(--bg-card); border: 1px solid var(--border-dim);
    border-radius: 5px; color: var(--text-1,#e0ddd8); outline: none;
  }
  #f20-ls::placeholder { color: var(--text-3); }
  #f20-ls:focus { border-color: var(--gold-dim); }
  .f20-ib {
    padding: 5px 8px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-2); font-size: 11px; cursor: pointer;
    display: flex; align-items: center; gap: 4px; white-space: nowrap;
    transition: all .12s;
  }
  .f20-ib:hover { border-color: var(--gold-dim); color: var(--gold); }
  #f20-sto {
    font-size: 9px; color: var(--text-3);
    display: flex; gap: 6px; align-items: center; padding: 2px 0;
  }
  #f20-sto-lbl { font-family: 'Cinzel', serif; letter-spacing: 1px; text-transform: uppercase; }
  #f20-sto-val { color: var(--gold,#c9a84c); font-family: 'Cinzel', serif; letter-spacing: 1px; }
  #f20-slist { flex: 1 1 0; overflow-y: auto; }
  #f20-slist::-webkit-scrollbar { width: 3px; }
  #f20-slist::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); }
  .f20-yg {
    padding: 5px 10px 2px; font-family: 'Cinzel', serif; font-size: 8px;
    letter-spacing: 2px; color: var(--gold-dim,#8a6a20); text-transform: uppercase;
    border-bottom: 1px solid rgba(201,168,76,.1);
    position: sticky; top: 0; background: var(--bg-deep,#09090f); z-index: 2;
  }
  .f20-si {
    padding: 7px 10px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,.03);
    transition: background .1s; display: flex; flex-direction: column; gap: 2px;
  }
  .f20-si:hover { background: rgba(255,255,255,.04); }
  .f20-si.on { background: rgba(201,168,76,.1); border-left: 2px solid var(--gold,#c9a84c); padding-left: 8px; }
  .f20-si-t {
    font-size: 11px; color: var(--text-1,#e0ddd8); line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .f20-si-m { font-size: 9px; color: var(--text-3); display: flex; gap: 5px; flex-wrap: wrap; }
  .f20-si-b {
    font-size: 8px; padding: 1px 5px; border-radius: 8px;
    border: 1px solid var(--border-dim); color: var(--text-3);
  }
  .f20-si-b.imp { border-color: rgba(201,168,76,.3); color: var(--gold-dim,#8a6a20); }
  .f20-empty { padding: 20px 12px; text-align: center; font-size: 11px; color: var(--text-3); line-height: 1.8; }

  /* ── RIGHT PANEL ─────────────────────────────── */
  #f20-right {
    flex: 1 1 0; min-width: 0;
    display: flex; flex-direction: column; overflow: hidden;
  }
  #f20-rtb {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 10px; border-bottom: 1px solid var(--border-dim);
    flex-shrink: 0; background: var(--bg-deep,#09090f);
    flex-wrap: wrap;
  }
  .f20-vb {
    padding: 5px 9px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-3); font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 4px; transition: all .12s;
  }
  .f20-vb span { font-size: 10px; font-family: 'Lato', sans-serif; }
  .f20-vb:hover { border-color: var(--gold-dim); color: var(--text-2); }
  .f20-vb.on { background: rgba(201,168,76,.12); border-color: var(--gold,#c9a84c); color: var(--gold,#c9a84c); }
  #f20-rtitle {
    flex: 1; font-family: 'Cinzel', serif; font-size: 10px;
    letter-spacing: 1px; color: var(--gold-dim,#8a6a20);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0;
  }

  /* Format hamburger */
  #f20-fmtwrap { position: relative; }
  #f20-fmtbtn {
    padding: 5px 9px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-3); font-size: 16px; cursor: pointer; transition: all .12s;
  }
  #f20-fmtbtn:hover { border-color: var(--gold-dim); color: var(--text-2); }
  #f20-fmtdd {
    display: none; position: absolute; top: calc(100% + 4px); right: 0;
    z-index: 300; background: var(--bg-card,#1a1825);
    border: 1px solid var(--border-dim); border-radius: 7px;
    padding: 10px; min-width: 210px; gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,.5); flex-direction: column;
  }
  #f20-fmtdd.open { display: flex; }
  .f20-fl { font-size: 9px; color: var(--text-3); font-family: 'Cinzel', serif;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
  .f20-fr { display: flex; gap: 5px; align-items: center; }
  .f20-fsel {
    flex: 1; font-size: 11px; padding: 4px 6px;
    background: var(--bg-deep,#09090f); border: 1px solid var(--border-dim);
    border-radius: 4px; color: var(--text-1,#e0ddd8); outline: none;
  }
  .f20-szb {
    width: 26px; height: 26px; border: 1px solid var(--border-dim);
    border-radius: 4px; background: var(--bg-deep,#09090f);
    color: var(--text-2); font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .f20-szb:hover { background: var(--bg-hover); }
  #f20-szv { min-width: 32px; text-align: center; font-size: 11px; color: var(--gold,#c9a84c); font-family: 'Cinzel', serif; }
  .f20-ci { width: 32px; height: 26px; border: 1px solid var(--border-dim); border-radius: 4px; cursor: pointer; padding: 1px; background: none; }

  /* ── BOOK VIEW ───────────────────────────────── */
  #f20-bv {
    display: none; flex: 1 1 0; min-height: 0;
    flex-direction: column; overflow: hidden;
  }
  #f20-bv.on { display: flex; }

  /* Sticky selection bar */
  #f20-selbar {
    display: none; flex-shrink: 0;
    align-items: center; gap: 5px; flex-wrap: wrap;
    padding: 7px 10px;
    background: rgba(9,9,15,.97);
    border-bottom: 1px solid rgba(201,168,76,.25);
  }
  #f20-selbar.on { display: flex; }
  #f20-selcnt {
    flex: 1; font-size: 10px; color: var(--gold-dim,#8a6a20);
    font-family: 'Cinzel', serif; letter-spacing: .5px;
  }

  /* Paragraph scroll area */
  #f20-pl {
    flex: 1 1 0; min-height: 0; overflow-y: auto; padding: 10px;
  }
  #f20-pl::-webkit-scrollbar { width: 4px; }
  #f20-pl::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }

  .f20-para {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 8px 6px; border-radius: 4px;
    border-bottom: 1px solid rgba(255,255,255,.03);
    cursor: pointer; transition: background .1s; user-select: text;
  }
  .f20-para:hover { background: rgba(255,255,255,.03); }
  .f20-para.on { background: rgba(201,168,76,.1); border-left: 2px solid var(--gold,#c9a84c); padding-left: 4px; }
  .f20-para.hl {
    background: rgba(201,168,76,.2) !important;
    border-left: 3px solid var(--gold,#c9a84c) !important;
    animation: f20hl .7s ease;
  }
  @keyframes f20hl { 0% { background: rgba(201,168,76,.45); } 100% { background: rgba(201,168,76,.2); } }
  .f20-pchk { flex-shrink: 0; margin-top: 4px; accent-color: var(--gold,#c9a84c); width: 14px; height: 14px; cursor: pointer; }
  .f20-pnum { flex-shrink: 0; width: 22px; font-size: 9px; color: var(--text-3); font-family: 'Cinzel', serif; margin-top: 4px; text-align: right; }
  .f20-ptxt { flex: 1; line-height: 1.75; }

  .f20-bempty { padding: 40px 16px; text-align: center; color: var(--text-3); font-size: 12px; line-height: 1.9; }
  .f20-bei   { font-size: 36px; margin-bottom: 10px; }

  /* ── SEARCH VIEW ─────────────────────────────── */
  #f20-sv {
    display: none; flex: 1 1 0; min-height: 0;
    flex-direction: column; overflow: hidden;
  }
  #f20-sv.on { display: flex; }
  #f20-scrow { display: flex; gap: 5px; padding: 8px 10px 0; flex-shrink: 0; }
  .f20-scbtn {
    flex: 1; padding: 6px 8px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-2); font-size: 11px; font-family: 'Lato', sans-serif;
    cursor: pointer; text-align: center; transition: all .12s;
  }
  .f20-scbtn.on { background: rgba(201,168,76,.12); border-color: var(--gold,#c9a84c); color: var(--gold,#c9a84c); font-weight: 700; }
  #f20-sinrow { display: flex; gap: 5px; padding: 6px 10px; flex-shrink: 0; align-items: center; }
  #f20-si2 {
    flex: 1; font-size: 12px; padding: 6px 10px;
    background: var(--bg-card); border: 1px solid var(--border-dim);
    border-radius: 5px; color: var(--text-1,#e0ddd8); outline: none;
  }
  #f20-si2:focus { border-color: var(--gold-dim); }
  #f20-si2::placeholder { color: var(--text-3); }
  .f20-qb {
    padding: 6px 10px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-2); font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 3px; transition: all .12s; white-space: nowrap;
  }
  .f20-qb.any   { border-color: #4a90d9; color: #4a90d9; background: rgba(74,144,217,.08); }
  .f20-qb.exact { border-color: var(--gold,#c9a84c); color: var(--gold,#c9a84c); background: rgba(201,168,76,.08); }
  #f20-rlist { flex: 1 1 0; min-height: 0; overflow-y: auto; padding: 4px 0; }
  #f20-rlist::-webkit-scrollbar { width: 3px; }
  #f20-rlist::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); }
  .f20-rg {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 2px;
    color: var(--gold-dim,#8a6a20); text-transform: uppercase;
    padding: 8px 10px 3px; border-bottom: 1px solid var(--border-dim);
    position: sticky; top: 0; background: var(--bg-deep,#09090f); z-index: 2;
  }
  .f20-rc {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,.03);
    transition: background .1s;
  }
  .f20-rc:hover { background: rgba(255,255,255,.04); }
  .f20-rc.on { background: rgba(201,168,76,.08); }
  .f20-rcchk { flex-shrink: 0; margin-top: 3px; accent-color: var(--gold,#c9a84c); width: 14px; height: 14px; cursor: pointer; }
  .f20-rcb { flex: 1; min-width: 0; cursor: pointer; }
  .f20-rcm { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 1px; color: var(--gold-dim,#8a6a20); margin-bottom: 3px; }
  .f20-rct { font-size: 12px; color: var(--text-1,#e0ddd8); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .f20-rct mark { background: rgba(201,168,76,.28); color: var(--gold,#c9a84c); border-radius: 2px; padding: 0 1px; }
  .f20-rjh { font-size: 9px; color: var(--gold-dim,#8a6a20); font-family: 'Cinzel', serif; letter-spacing: .5px; margin-top: 3px; }
  .f20-noр { padding: 24px 10px; text-align: center; font-size: 11px; color: var(--text-3); line-height: 1.8; }

  /* ── ACTION BARS ─────────────────────────────── */
  .f20-abar {
    display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
    padding: 7px 10px; border-top: 1px solid var(--border-dim);
    background: var(--bg-deep,#09090f); flex-shrink: 0;
  }
  .f20-abar-cnt { flex: 1; font-size: 10px; color: var(--gold-dim,#8a6a20); font-family: 'Cinzel', serif; }
  .f20-ab {
    padding: 5px 10px; border-radius: 5px;
    border: 1px solid var(--border-dim); background: var(--bg-card);
    color: var(--text-2); font-size: 11px; font-family: 'Lato', sans-serif;
    cursor: pointer; transition: all .12s; white-space: nowrap;
  }
  .f20-ab:hover { border-color: var(--gold-dim); }
  .f20-ab.proj   { background: var(--gold,#c9a84c); border-color: var(--gold,#c9a84c); color: #000; font-weight: 700; }
  .f20-ab.sch    { background: rgba(212,160,23,.15); border-color: rgba(212,160,23,.35); color: var(--amber,#d4a017); }
  .f20-ab.nug    { background: rgba(212,160,23,.1); border-color: rgba(212,160,23,.3); color: #d4a017; }
  .f20-ab.clr    { border-color: rgba(224,80,80,.3); color: var(--red,#e05050); background: none; }
  `;
  document.head.appendChild(_css);


  /* ══════════════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════════════ */
  let _sort    = 'year';
  let _scope   = 'all';
  let _rview   = 'book';
  let _current = null;            // { id, title, author, paras[], year, place, time }
  let _selP    = new Set();       // selected paragraph indices
  let _rmap    = {};              // search result map
  let _selR    = new Set();       // selected result indices
  let _fq      = '';              // filter query
  let _pool    = [];

  let _fmt = {
    font: localStorage.getItem('f20_font')  || "'Lato', sans-serif",
    size: parseInt(localStorage.getItem('f20_size') || '14'),
    col:  localStorage.getItem('f20_col')   || '#e0ddd8',
    hl:   localStorage.getItem('f20_hl')    || '#c9a84c',
  };


  /* ══════════════════════════════════════════════════════════
     DATA
  ══════════════════════════════════════════════════════════ */

  function _parseMeta(title) {
    const m = title.match(/(\d{2})-(\d{2})(\d{2})([MEAV]?)/);
    if (!m) return { year:'', month:'', day:'', time:'' };
    const yr  = parseInt(m[1]);
    const yr4 = yr >= 47 ? '19'+m[1] : '20'+m[1];
    const tod = {M:'Morning',E:'Evening',A:'Afternoon',V:'Evening'}[m[4]] || '';
    return { year: yr4, month: m[2], day: m[3], time: tod };
  }

  function _parsePlace(title) {
    const m = title.match(/,\s*([A-Z][a-zA-Z .]+?)(?:\s*[-_\d]|$)/);
    if (m) return m[1].trim();
    return '';
  }

  function _buildPool() {
    const out = []; const seen = new Set();

    if (typeof BUILTIN_SERMONS !== 'undefined') {
      BUILTIN_SERMONS.forEach(s => {
        if (seen.has(s.title)) return; seen.add(s.title);
        const m = _parseMeta(s.title);
        out.push({
          id: 'bi_' + s.title,
          title: s.title, author: 'William Branham', source: 'builtin',
          paras: (s.content || []).map(c => typeof c === 'string' ? c : (c.text || '')),
          year: m.year, month: m.month, day: m.day, time: m.time,
          place: _parsePlace(s.title), date: s.date || '',
        });
      });
    }

    ['bw_imported_sermons_v2','bw_imported_sermons'].forEach(key => {
      try {
        JSON.parse(localStorage.getItem(key) || '[]').forEach(s => {
          if (seen.has(s.title)) return; seen.add(s.title);
          const paras = Array.isArray(s.paras) ? s.paras
                      : Array.isArray(s.content) ? s.content.map(c => typeof c==='string'?c:(c.text||''))
                      : [];
          const m = _parseMeta(s.title);
          out.push({
            id: s.id || ('imp_'+s.title), title: s.title,
            author: s.author || '', source: 'imported', paras,
            year: m.year, month: m.month, day: m.day, time: m.time,
            place: _parsePlace(s.title), date: s.addedAt || '',
          });
        });
      } catch(e) {}
    });
    return out;
  }


  /* ══════════════════════════════════════════════════════════
     BUILD UI (runs once — guarded by dataset.f20)
  ══════════════════════════════════════════════════════════ */

  function _build() {
    const panel = document.getElementById('tt-reader');
    if (!panel || panel.dataset.f20) return;
    panel.dataset.f20 = '1';
    panel.classList.add('f20-ready');
    panel.innerHTML = `
    <div id="f20-left">
      <div id="f20-ltoolbar">
        <div id="f20-sort-row">
          <button class="f20-sb on" data-s="year"  onclick="f20Sort('year')">
            <span class="f20-sb-icon">📅</span>Year</button>
          <button class="f20-sb"    data-s="title" onclick="f20Sort('title')">
            <span class="f20-sb-icon">🔤</span>Title</button>
          <button class="f20-sb"    data-s="place" onclick="f20Sort('place')">
            <span class="f20-sb-icon">📍</span>Place</button>
          <button class="f20-sb"    data-s="time"  onclick="f20Sort('time')">
            <span class="f20-sb-icon">⏰</span>Time</button>
        </div>
        <div id="f20-sir">
          <input id="f20-ls" placeholder="Search title, year, location…"
            oninput="f20LibSearch(this.value)">
          <button class="f20-ib" onclick="f20TriggerImport()">📄 Import</button>
        </div>
        <div id="f20-sto">
          <span id="f20-sto-lbl">Scroll To:</span>
          <span id="f20-sto-val">Year</span>
        </div>
      </div>
      <div id="f20-slist"></div>
    </div>

    <div id="f20-right">
      <div id="f20-rtb">
        <button class="f20-vb on" id="f20-bvbtn" onclick="f20View('book')">📖 <span>Reader</span></button>
        <button class="f20-vb"    id="f20-svbtn" onclick="f20View('search')">🔍 <span>Search</span></button>
        <span id="f20-rtitle">— Select a sermon —</span>
        <div id="f20-fmtwrap">
          <button id="f20-fmtbtn" onclick="f20FmtToggle()" title="Text formatting">☰</button>
          <div id="f20-fmtdd">
            <div>
              <div class="f20-fl">Font</div>
              <div class="f20-fr">
                <select class="f20-fsel" id="f20-fsel" onchange="f20FmtApply()">
                  <option value="'Lato', sans-serif">Lato</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Cinzel', serif">Cinzel</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Arial, sans-serif">Arial</option>
                </select>
              </div>
            </div>
            <div>
              <div class="f20-fl">Font Size</div>
              <div class="f20-fr">
                <button class="f20-szb" onclick="f20FmtSz(-1)">−</button>
                <span id="f20-szv">${_fmt.size}px</span>
                <button class="f20-szb" onclick="f20FmtSz(+1)">+</button>
              </div>
            </div>
            <div>
              <div class="f20-fl">Text Color</div>
              <div class="f20-fr">
                <input type="color" class="f20-ci" id="f20-colr" value="${_fmt.col.slice(0,7)}" onchange="f20FmtApply()">
                <span style="font-size:10px;color:var(--text-3);">Text colour</span>
              </div>
            </div>
            <div>
              <div class="f20-fl">Highlight Color</div>
              <div class="f20-fr">
                <input type="color" class="f20-ci" id="f20-hlr" value="${_fmt.hl.slice(0,7)}" onchange="f20FmtApply()">
                <span style="font-size:10px;color:var(--text-3);">Selected para</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOOK VIEW -->
      <div id="f20-bv" class="on">
        <div id="f20-selbar">
          <span id="f20-selcnt"></span>
          <button class="f20-ab proj" onclick="f20Proj()">▶ Project</button>
          <button class="f20-ab sch"  onclick="f20Sch()">📅 Schedule</button>
          <button class="f20-ab nug"  onclick="f20Nug()">⭐ Nugget</button>
          <button class="f20-ab clr"  onclick="f20ClrSel()">✕ Clear</button>
        </div>
        <div id="f20-pl">
          <div class="f20-bempty"><div class="f20-bei">📖</div>
            Select a sermon from the left panel.<br>
            <span style="font-size:10px;">Click any paragraph to select it for projection.</span>
          </div>
        </div>
      </div>

      <!-- SEARCH VIEW -->
      <div id="f20-sv">
        <div id="f20-scrow">
          <button class="f20-scbtn on" id="f20-sc-all" onclick="f20Scope('all')">All Sermons</button>
          <button class="f20-scbtn"    id="f20-sc-cur" onclick="f20Scope('current')">Current Sermon</button>
        </div>
        <div id="f20-sinrow">
          <input id="f20-si2" placeholder="Search sermons…"
            onkeydown="if(event.key==='Enter')f20Search(false)">
          <button class="f20-qb any"   onclick="f20Search(false)" title="Any Word">🔍</button>
          <button class="f20-qb exact" onclick="f20Search(true)"  title="Exact Quote">&ldquo;&rdquo;</button>
        </div>
        <div id="f20-rlist">
          <div class="f20-noр" style="padding:20px;color:var(--text-3);font-size:11px;text-align:center;">
            Enter a search term and press 🔍 or &ldquo;&rdquo;
          </div>
        </div>
        <div class="f20-abar" id="f20-sabar">
          <span class="f20-abar-cnt" id="f20-scnt"></span>
          <button class="f20-ab proj" onclick="f20ProjSr()">▶ Project</button>
          <button class="f20-ab sch"  onclick="f20SchSr()">📅 Schedule</button>
          <button class="f20-ab nug"  onclick="f20NugSr()">⭐ Nugget</button>
          <button class="f20-ab clr"  onclick="f20ClrSr()">✕ Clear</button>
        </div>
      </div>
    </div>`;

    /* Init format controls */
    const fsel = document.getElementById('f20-fsel');
    if (fsel) fsel.value = _fmt.font;

    /* Close dropdown on outside click */
    document.addEventListener('click', e => {
      const w = document.getElementById('f20-fmtwrap');
      if (w && !w.contains(e.target)) document.getElementById('f20-fmtdd')?.classList.remove('open');
    });
  }


  /* ══════════════════════════════════════════════════════════
     LEFT: SERMON LIST
  ══════════════════════════════════════════════════════════ */

  function _filtered() {
    const q = _fq.toLowerCase();
    return _pool.filter(s => !q
      || s.title.toLowerCase().includes(q)
      || s.year.includes(q)
      || s.place.toLowerCase().includes(q)
    );
  }

  function _sorted(list) {
    if (_sort === 'year')  return [...list].sort((a,b)=> (a.year+a.month+a.day).localeCompare(b.year+b.month+b.day));
    if (_sort === 'title') return [...list].sort((a,b)=> a.title.localeCompare(b.title));
    if (_sort === 'place') return [...list].sort((a,b)=> (a.place||'zzz').localeCompare(b.place||'zzz'));
    if (_sort === 'time')  return [...list].sort((a,b)=> (a.time||'zzz').localeCompare(b.time||'zzz'));
    return list;
  }

  function _groupKey(s) {
    if (_sort === 'year')  return s.year  || 'Unknown Year';
    if (_sort === 'title') return (s.title[0] || '#').toUpperCase();
    if (_sort === 'place') return s.place || 'Unknown Place';
    if (_sort === 'time')  return s.time  || 'Unknown Time';
    return '';
  }

  function _renderList() {
    _pool = _buildPool();
    const wrap = document.getElementById('f20-slist');
    if (!wrap) return;
    const list = _sorted(_filtered());

    if (!list.length) {
      wrap.innerHTML = `<div class="f20-empty">${_fq?`No matches for "<b>${_esc(_fq)}</b>"`:'No sermons found.<br>Import files with the Import button.'}</div>`;
      return;
    }

    let html = '', lastG = null;
    list.forEach((s, i) => {
      const gk = _groupKey(s);
      if (gk !== lastG) {
        html += `<div class="f20-yg">${_esc(gk)}</div>`;
        lastG = gk;
      }
      const active = _current && _current.id === s.id;
      const meta   = [s.year, s.place, s.time].filter(Boolean);
      /* KEY FIX: use data-sid and onclick reads dataset — no JSON.stringify in attribute */
      html += `<div class="f20-si${active?' on':''}" data-sid="${i}" onclick="f20OpenIdx(${i})">
        <div class="f20-si-t">${_esc(s.title)}</div>
        <div class="f20-si-m">
          ${meta.map(m=>`<span>${_esc(m)}</span>`).join('<span style="opacity:.4">·</span>')}
          <span class="f20-si-b${s.source==='imported'?' imp':''}">${s.source==='imported'?'Imported':'Built-in'}</span>
          <span>${s.paras.length}p</span>
        </div>
      </div>`;
    });
    wrap.innerHTML = html;

    /* Store sorted list so f20OpenIdx can look up by index */
    window._f20SortedList = list;

    const stoVal = document.getElementById('f20-sto-val');
    if (stoVal) stoVal.textContent = ({year:'Year',title:'Title (A–Z)',place:'Place',time:'Time of Day'})[_sort];
  }

  /* Open by sorted-list index — avoids ID escaping issue entirely */
  window.f20OpenIdx = function(i) {
    const list = window._f20SortedList || [];
    const s    = list[i];
    if (!s) return;

    _current = s;
    _selP.clear();

    /* Highlight active in list */
    document.querySelectorAll('.f20-si').forEach((el, j) => el.classList.toggle('on', j === i));

    /* Update reader globals */
    window._readerTitle  = s.title;
    window._readerAuthor = s.author || '';
    window._readerParas  = s.paras.map((text, pi) => ({ text, section: s.title, idx: pi }));

    f20View('book');

    const t = document.getElementById('f20-rtitle');
    if (t) t.textContent = s.title;

    _renderParas();
    if (typeof showSchToast === 'function') showSchToast(`📖 ${s.title}`);
  };

  window.f20Sort = function(mode) {
    _sort = mode;
    document.querySelectorAll('.f20-sb').forEach(b => b.classList.toggle('on', b.dataset.s === mode));
    _renderList();
  };

  window.f20LibSearch = function(q) { _fq = q.trim(); _renderList(); };


  /* ══════════════════════════════════════════════════════════
     RIGHT: PARAGRAPH RENDER + SELECTION
  ══════════════════════════════════════════════════════════ */

  function _renderParas() {
    const pl = document.getElementById('f20-pl');
    if (!pl || !_current) return;
    if (!_current.paras.length) {
      pl.innerHTML = '<div class="f20-bempty"><div class="f20-bei">📄</div>No paragraphs in this sermon.</div>';
      return;
    }
    pl.innerHTML = _current.paras.map((text, i) => `
      <div class="f20-para${_selP.has(i)?' on':''}" id="f20p${i}" data-pi="${i}" onclick="f20TP(${i})">
        <input type="checkbox" class="f20-pchk" ${_selP.has(i)?'checked':''} onclick="event.stopPropagation();f20TP(${i})">
        <div class="f20-pnum">${i+1}</div>
        <div class="f20-ptxt" style="font-family:${_fmt.font};font-size:${_fmt.size}px;color:${_fmt.col};">${_esc(text)}</div>
      </div>`).join('');
    _updSelBar();
  }

  window.f20TP = function(i) {     /* toggle paragraph */
    if (_selP.has(i)) _selP.delete(i); else _selP.add(i);
    const el = document.getElementById('f20p'+i);
    const ck = el?.querySelector('.f20-pchk');
    const on = _selP.has(i);
    el?.classList.toggle('on', on);
    if (ck) ck.checked = on;
    _updSelBar();
  };

  function _updSelBar() {
    const bar = document.getElementById('f20-selbar');
    const cnt = document.getElementById('f20-selcnt');
    const n   = _selP.size;
    bar?.classList.toggle('on', n > 0);
    if (cnt) cnt.textContent = `${n} paragraph${n!==1?'s':''} selected`;
  }

  function _scrollTo(pi) {
    f20View('book');
    const el = document.getElementById('f20p'+pi);
    if (!el) return;
    document.querySelectorAll('.f20-para.hl').forEach(x => x.classList.remove('hl'));
    el.classList.add('hl');
    const ck = el.querySelector('.f20-pchk');
    if (ck && !ck.checked) { ck.checked = true; _selP.add(pi); el.classList.add('on'); _updSelBar(); }
    el.scrollIntoView({ behavior:'smooth', block:'center' });
  }


  /* ══════════════════════════════════════════════════════════
     SEARCH
  ══════════════════════════════════════════════════════════ */

  window.f20Scope = function(s) {
    _scope = s;
    document.getElementById('f20-sc-all')?.classList.toggle('on', s==='all');
    document.getElementById('f20-sc-cur')?.classList.toggle('on', s==='current');
  };

  window.f20Search = function(exact) {
    const term = document.getElementById('f20-si2')?.value.trim() || '';
    if (!term) return;
    const q = term.toLowerCase();
    _rmap = {}; _selR.clear();

    const pool = _scope==='current' && _current ? [_current] : _buildPool();
    let idx = 0;
    pool.forEach(ser => {
      ser.paras.forEach((text, pi) => {
        const lo  = text.toLowerCase();
        const hit = exact ? lo.includes(q) : q.split(/\s+/).every(w => lo.includes(w));
        if (hit) { _rmap[idx] = { sid: ser.id, stitle: ser.title, pi, text }; idx++; }
      });
    });

    const wrap = document.getElementById('f20-rlist');
    if (!wrap) return;
    const total = Object.keys(_rmap).length;
    if (!total) {
      wrap.innerHTML = `<div class="f20-noр" style="padding:20px;text-align:center;font-size:11px;color:var(--text-3);">No results for "<b>${_esc(term)}</b>".</div>`;
      return;
    }

    /* Group by sermon */
    const groups = {};
    Object.entries(_rmap).forEach(([i,r]) => {
      if (!groups[r.stitle]) groups[r.stitle] = [];
      groups[r.stitle].push({ i:parseInt(i), r });
    });

    let html = `<div style="font-size:10px;color:var(--gold-dim);font-family:'Cinzel',serif;padding:6px 10px;border-bottom:1px solid var(--border-dim);">${total} result${total!==1?'s':''} · "${_esc(term)}" · ${exact?'exact':'any word'}</div>`;
    Object.entries(groups).forEach(([gt, items]) => {
      html += `<div class="f20-rg">${_esc(gt)} <span style="color:var(--text-3);font-weight:400;">(${items.length})</span></div>`;
      items.forEach(({i,r}) => {
        /* Highlight match */
        const lo  = r.text.toLowerCase();
        const mi  = lo.indexOf(q);
        let   snip = '';
        if (mi >= 0) {
          const s = Math.max(0,mi-40), e = Math.min(r.text.length, mi+q.length+80);
          snip = (s>0?'…':'') + _esc(r.text.slice(s,mi)) + '<mark>' + _esc(r.text.slice(mi,mi+q.length)) + '</mark>' + _esc(r.text.slice(mi+q.length,e)) + (e<r.text.length?'…':'');
        } else {
          snip = _esc(r.text.slice(0,130)) + (r.text.length>130?'…':'');
        }
        html += `<div class="f20-rc${_selR.has(i)?' on':''}" id="f20rc${i}">
          <input type="checkbox" class="f20-rcchk" ${_selR.has(i)?'checked':''} onclick="event.stopPropagation();f20TR(${i})">
          <div class="f20-rcb" onclick="f20Jump(${i})">
            <div class="f20-rcm">Para ${r.pi+1}</div>
            <div class="f20-rct">${snip}</div>
            <div class="f20-rjh">↵ Click to open sermon at this quote</div>
          </div>
        </div>`;
      });
    });
    wrap.innerHTML = html;
    _updSrBar();
  };

  window.f20TR = function(i) {   /* toggle result */
    if (_selR.has(i)) _selR.delete(i); else _selR.add(i);
    const card = document.getElementById('f20rc'+i);
    const ck   = card?.querySelector('.f20-rcchk');
    const on   = _selR.has(i);
    card?.classList.toggle('on', on);
    if (ck) ck.checked = on;
    _updSrBar();
  };

  function _updSrBar() {
    const n   = _selR.size;
    const cnt = document.getElementById('f20-scnt');
    if (cnt) cnt.textContent = n ? `${n} paragraph${n!==1?'s':''} selected` : '';
  }

  window.f20Jump = function(i) {
    const r = _rmap[i];
    if (!r) return;
    f20TR(i);  /* also select */

    /* Find sermon in pool by id */
    const pool = _buildPool();
    const ser  = pool.find(s => s.id === r.sid);
    if (!ser) return;

    /* Load sermon if different */
    if (!_current || _current.id !== ser.id) {
      const list = window._f20SortedList || [];
      const idx  = list.findIndex(s => s.id === ser.id);
      if (idx >= 0) {
        f20OpenIdx(idx);
        setTimeout(() => _scrollTo(r.pi), 400);
        setTimeout(() => _scrollTo(r.pi), 800);
      } else {
        /* Not in sorted list — load directly */
        _current = ser; _selP.clear();
        window._readerTitle  = ser.title;
        window._readerAuthor = ser.author;
        window._readerParas  = ser.paras.map((t,pi)=>({text:t,section:ser.title,idx:pi}));
        f20View('book');
        const t = document.getElementById('f20-rtitle');
        if (t) t.textContent = ser.title;
        _renderParas();
        setTimeout(() => _scrollTo(r.pi), 300);
      }
    } else {
      setTimeout(() => _scrollTo(r.pi), 100);
    }
  };


  /* ══════════════════════════════════════════════════════════
     ACTIONS: PROJECT / SCHEDULE / NUGGET
  ══════════════════════════════════════════════════════════ */

  function _toast(m) { if (typeof window.showSchToast==='function') window.showSchToast(m); }

  function _proj(text, title) {
    if (!text?.trim()) { _toast('Select at least one paragraph first'); return; }
    const paras = text.split(/\n\n+/).map(p=>p.trim()).filter(Boolean);
    window.S = window.S || {};
    window.S.slides  = paras.map(p => ({ section: title||'Message', text: p, author:'' }));
    window.S.cur     = 0;
    window.S.songIdx = null;
    if (typeof window.renderQueue === 'function') window.renderQueue();
    if (typeof window.renderSlide === 'function') window.renderSlide();
    if (typeof window.closeTheTable === 'function') window.closeTheTable();
    else {
      const m = document.getElementById('table-modal');
      if (m) m.style.display = 'none';
    }
    _exitFull();
    _toast(`▶ Projecting ${paras.length} slide${paras.length!==1?'s':''}`);
  }

  function _sch(text, title) {
    if (!text?.trim()) { _toast('Select at least one paragraph first'); return; }
    if (typeof window.schInsertFromLibrary === 'function') {
      window.schInsertFromLibrary({ type:'sermon', label:title||'Message', content:text, notes:'', duration:0 }, -1);
    } else {
      window.S = window.S || {};
      window.S.so = window.S.so || [];
      window.S.so.push({ name: title||'Message', type:'sermon', content:text });
      if (typeof window.renderSO === 'function') window.renderSO();
    }
    _toast(`📅 "${title||'Message'}" added to Schedule`);
  }

  function _nug(text, title, author) {
    if (!text?.trim()) { _toast('Select at least one paragraph first'); return; }
    if (typeof window.addNugget === 'function') {
      window.addNugget(text, title||'Message', author||'');
      _toast('⭐ Saved to Golden Nuggets');
    } else {
      _toast('⭐ Golden Nuggets not available yet');
    }
  }

  function _bookText() {
    if (!_current || !_selP.size) return null;
    return [..._selP].sort((a,b)=>a-b).map(i=>_current.paras[i]||'').filter(Boolean).join('\n\n');
  }
  function _srText() {
    if (!_selR.size) return null;
    return [..._selR].sort((a,b)=>a-b).map(i=>_rmap[i]?.text||'').filter(Boolean).join('\n\n');
  }
  function _srTitle() { return _rmap[[..._selR][0]]?.stitle || 'Message'; }

  window.f20Proj   = () => _proj(_bookText(), _current?.title);
  window.f20Sch    = () => _sch (_bookText(), _current?.title);
  window.f20Nug    = () => _nug (_bookText(), _current?.title, _current?.author);
  window.f20ClrSel = () => {
    _selP.clear();
    document.querySelectorAll('.f20-para.on').forEach(el => {
      el.classList.remove('on'); el.style.background='';
      const c=el.querySelector('.f20-pchk'); if(c) c.checked=false;
    });
    _updSelBar();
  };

  window.f20ProjSr = () => _proj(_srText(), _srTitle());
  window.f20SchSr  = () => _sch (_srText(), _srTitle());
  window.f20NugSr  = () => _nug (_srText(), _srTitle(), '');
  window.f20ClrSr  = () => {
    _selR.clear();
    document.querySelectorAll('.f20-rc.on').forEach(el => {
      el.classList.remove('on');
      const c=el.querySelector('.f20-rcchk'); if(c) c.checked=false;
    });
    _updSrBar();
  };


  /* ══════════════════════════════════════════════════════════
     VIEW SWITCHING + FORMAT
  ══════════════════════════════════════════════════════════ */

  window.f20View = function(v) {
    _rview = v;
    document.getElementById('f20-bv')?.classList.toggle('on', v==='book');
    document.getElementById('f20-sv')?.classList.toggle('on', v==='search');
    document.getElementById('f20-bvbtn')?.classList.toggle('on', v==='book');
    document.getElementById('f20-svbtn')?.classList.toggle('on', v==='search');
  };

  window.f20FmtToggle = () => document.getElementById('f20-fmtdd')?.classList.toggle('open');

  window.f20FmtApply = function() {
    _fmt.font = document.getElementById('f20-fsel')?.value || _fmt.font;
    _fmt.col  = document.getElementById('f20-colr')?.value || _fmt.col;
    _fmt.hl   = document.getElementById('f20-hlr')?.value  || _fmt.hl;
    localStorage.setItem('f20_font', _fmt.font);
    localStorage.setItem('f20_col',  _fmt.col);
    localStorage.setItem('f20_hl',   _fmt.hl);
    document.querySelectorAll('.f20-ptxt').forEach(el => {
      el.style.fontFamily = _fmt.font; el.style.color = _fmt.col;
    });
  };

  window.f20FmtSz = function(d) {
    _fmt.size = Math.max(10, Math.min(28, _fmt.size + d));
    localStorage.setItem('f20_size', String(_fmt.size));
    const v = document.getElementById('f20-szv');
    if (v) v.textContent = _fmt.size + 'px';
    document.querySelectorAll('.f20-ptxt').forEach(el => el.style.fontSize = _fmt.size + 'px');
  };


  /* ══════════════════════════════════════════════════════════
     IMPORT
  ══════════════════════════════════════════════════════════ */

  window.f20TriggerImport = function() {
    const inp = document.createElement('input');
    inp.type='file'; inp.accept='.txt,.pdf,.docx,.doc,.epub,.rtf,.md,.markdown';
    inp.multiple=true; inp.style.display='none';
    inp.addEventListener('change', async () => {
      const files = Array.from(inp.files||[]); inp.remove();
      if (!files.length) return;
      const h = window.bwImportFile||window.f12HandleFile||window._handleImportedFile;
      if (!h) { _toast('⚠ Import handler not ready'); return; }
      _toast(`⏳ Importing ${files.length} file${files.length>1?'s':''}…`);
      let ok=0;
      for (const f of files) {
        try { const r=await h(f); if(r) ok++; } catch(e){}
        await new Promise(r=>setTimeout(r,250));
      }
      _toast(`✓ ${ok} of ${files.length} imported`);
      _renderList();
    });
    document.body.appendChild(inp); inp.click();
  };


  /* ══════════════════════════════════════════════════════════
     FULL-PAGE READER
  ══════════════════════════════════════════════════════════ */

  function _enterFull() {
    const ov = document.getElementById('table-modal');
    const bx = document.querySelector('.table-modal-box');
    if (ov) ov.classList.add('f20-fullpage');
    if (bx) bx.classList.add('f20-fullpage');
  }
  function _exitFull() {
    document.getElementById('table-modal')?.classList.remove('f20-fullpage');
    document.querySelector('.table-modal-box')?.classList.remove('f20-fullpage');
  }

  /* Intercept tableTab to toggle full-page */
  const _origTab = window.tableTab;
  window.tableTab = function(tab, panelId) {
    if (typeof _origTab === 'function') _origTab(tab, panelId);
    if (panelId === 'tt-reader') _enterFull(); else _exitFull();
  };


  /* ══════════════════════════════════════════════════════════
     UTILITY
  ══════════════════════════════════════════════════════════ */

  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  const _origOT = window.openTheTable;
  window.openTheTable = function() {
    if (_origOT) _origOT();
    setTimeout(() => { _build(); _renderList(); }, 220);
  };

  console.info('[BW fix20 v2] ✓ Reader  ✓ Sermon display  ✓ Project  ✓ Nugget  ✓ Full-page');

})();