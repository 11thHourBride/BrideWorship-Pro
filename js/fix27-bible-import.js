
/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix27-bible-import.js  (v2)
   Fixes:
   1. QuotaExceededError — Bibles now stored in IndexedDB
      (no size limit). localStorage used only as a tiny
      index of names, never for the full text.
   2. "Unrecognised format" after quota crash — saveBible
      no longer throws synchronously into handleFile.
   Supported formats: same as before.
═══════════════════════════════════════════════════════════ */

(function BW_fix27() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     IndexedDB wrapper
  ══════════════════════════════════════════════════════════ */

  const DB_NAME    = 'BrideWorshipBibles';
  const DB_VERSION = 1;
  const STORE      = 'bibles';

  function _openDB() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE))
          db.createObjectStore(STORE, { keyPath: 'name' });
      };
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function _saveBibleIDB(bible) {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).put(bible);
      req.onsuccess = () => res(true);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function _loadBibleIDB(name) {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(name);
      req.onsuccess = e => res(e.target.result || null);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function _listBiblesIDB() {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAllKeys();
      req.onsuccess = e => res(e.target.result || []);
      req.onerror   = e => rej(e.target.error);
    });
  }

  async function _deleteBibleIDB(name) {
    const db = await _openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).delete(name);
      req.onsuccess = () => res(true);
      req.onerror   = e => rej(e.target.error);
    });
  }

  /* ── Small localStorage index (just names, no verse data) ── */
  const IDX_KEY = 'bw_bible_names_v2';
  function _getNameIndex() {
    try { return JSON.parse(localStorage.getItem(IDX_KEY) || '[]'); } catch(e) { return []; }
  }
  function _addToNameIndex(name) {
    const idx = _getNameIndex();
    if (!idx.includes(name)) { idx.push(name); try { localStorage.setItem(IDX_KEY, JSON.stringify(idx)); } catch(e) {} }
  }
  function _removeFromNameIndex(name) {
    const idx = _getNameIndex().filter(n => n !== name);
    try { localStorage.setItem(IDX_KEY, JSON.stringify(idx)); } catch(e) {}
  }

  /* Public save / load / list / delete */
  async function saveBible(bible) {
    await _saveBibleIDB(bible);
    _addToNameIndex(bible.name);
  }

  window.bwLoadBible    = name => _loadBibleIDB(name);
  window.bwListBibles   = _listBiblesIDB;
  window.bwDeleteBible  = async name => {
    await _deleteBibleIDB(name);
    _removeFromNameIndex(name);
  };


  /* ══════════════════════════════════════════════════════════
     Book-name normaliser
  ══════════════════════════════════════════════════════════ */

  const ALIASES = {
    gen:'Genesis',ge:'Genesis',gn:'Genesis',
    ex:'Exodus',exo:'Exodus',exod:'Exodus',
    lev:'Leviticus',le:'Leviticus',lv:'Leviticus',
    num:'Numbers',nu:'Numbers',nm:'Numbers',nb:'Numbers',
    deu:'Deuteronomy',deut:'Deuteronomy',dt:'Deuteronomy',de:'Deuteronomy',
    jos:'Joshua',josh:'Joshua',
    jdg:'Judges',judg:'Judges',jg:'Judges',
    rut:'Ruth',ru:'Ruth',
    '1sa':'1 Samuel','1sam':'1 Samuel','1samuel':'1 Samuel',
    '2sa':'2 Samuel','2sam':'2 Samuel','2samuel':'2 Samuel',
    '1ki':'1 Kings','1kgs':'1 Kings','1kings':'1 Kings',
    '2ki':'2 Kings','2kgs':'2 Kings','2kings':'2 Kings',
    '1ch':'1 Chronicles','1chr':'1 Chronicles',
    '2ch':'2 Chronicles','2chr':'2 Chronicles',
    ezr:'Ezra',neh:'Nehemiah',est:'Esther',esth:'Esther',
    job:'Job',jb:'Job',
    ps:'Psalms',psa:'Psalms',psalm:'Psalms',psalms:'Psalms',
    pro:'Proverbs',prov:'Proverbs',pr:'Proverbs',
    ecc:'Ecclesiastes',eccl:'Ecclesiastes',ec:'Ecclesiastes',
    song:'Song of Solomon',sos:'Song of Solomon',ss:'Song of Solomon',
    isa:'Isaiah',is:'Isaiah',jer:'Jeremiah',je:'Jeremiah',
    lam:'Lamentations',la:'Lamentations',
    eze:'Ezekiel',ezek:'Ezekiel',
    dan:'Daniel',da:'Daniel',dn:'Daniel',
    hos:'Hosea',ho:'Hosea',joel:'Joel',jl:'Joel',
    amo:'Amos',am:'Amos',amos:'Amos',
    oba:'Obadiah',ob:'Obadiah',obad:'Obadiah',
    jon:'Jonah',jnh:'Jonah',
    mic:'Micah',mi:'Micah',nah:'Nahum',na:'Nahum',
    hab:'Habakkuk',hb:'Habakkuk',
    zep:'Zephaniah',zeph:'Zephaniah',
    hag:'Haggai',hg:'Haggai',
    zec:'Zechariah',zech:'Zechariah',
    mal:'Malachi',ml:'Malachi',
    mat:'Matthew',matt:'Matthew',mt:'Matthew',matthew:'Matthew',
    mk:'Mark',mar:'Mark',mark:'Mark',
    luk:'Luke',lk:'Luke',luke:'Luke',
    jn:'John',joh:'John',john:'John',
    act:'Acts',ac:'Acts',acts:'Acts',
    rom:'Romans',ro:'Romans',rm:'Romans',
    '1co':'1 Corinthians','1cor':'1 Corinthians',
    '2co':'2 Corinthians','2cor':'2 Corinthians',
    gal:'Galatians',ga:'Galatians',
    eph:'Ephesians',php:'Philippians',phil:'Philippians',
    col:'Colossians',
    '1th':'1 Thessalonians','1thes':'1 Thessalonians',
    '2th':'2 Thessalonians','2thes':'2 Thessalonians',
    '1ti':'1 Timothy','1tim':'1 Timothy',
    '2ti':'2 Timothy','2tim':'2 Timothy',
    tit:'Titus',ti:'Titus',phm:'Philemon',phlm:'Philemon',
    heb:'Hebrews',he:'Hebrews',jas:'James',jm:'James',james:'James',
    '1pe':'1 Peter','1pet':'1 Peter',
    '2pe':'2 Peter','2pet':'2 Peter',
    '1jn':'1 John','1jo':'1 John',
    '2jn':'2 John','3jn':'3 John',
    jud:'Jude',jude:'Jude',
    rev:'Revelation',re:'Revelation',apoc:'Revelation',
  };

  const BCVmap = (() => {
    if (typeof KJV_BOOKS === 'undefined') return {};
    const m = {};
    KJV_BOOKS.forEach((b,i) => { m[String(i+1).padStart(2,'0')] = b.name; });
    return m;
  })();

  function normBook(raw) {
    if (!raw) return '';
    const q = String(raw).toLowerCase().replace(/[\s.']/g,'');
    if (ALIASES[q]) return ALIASES[q];
    if (typeof KJV_BOOKS !== 'undefined') {
      const lo = String(raw).toLowerCase().trim();
      const ex = KJV_BOOKS.find(b => b.name.toLowerCase() === lo);
      if (ex) return ex.name;
      const pt = KJV_BOOKS.find(b => b.name.toLowerCase().startsWith(lo));
      if (pt) return pt.name;
    }
    return String(raw).trim().replace(/\b\w/g, c => c.toUpperCase());
  }


  /* ══════════════════════════════════════════════════════════
     Parsers (identical logic to v1 — no changes needed here)
  ══════════════════════════════════════════════════════════ */

  function booksObjToBW(booksObj, name) {
    const books = {};
    Object.entries(booksObj).forEach(([rawBook, chapData]) => {
      if (!chapData || typeof chapData !== 'object') return;
      const bookName = normBook(rawBook);
      if (!bookName) return;
      books[bookName] = {};
      Object.entries(chapData).forEach(([rawCh, verseData]) => {
        const ch = String(parseInt(rawCh) || rawCh);
        if (Array.isArray(verseData)) {
          books[bookName][ch] = verseData;
        } else if (typeof verseData === 'object' && verseData !== null) {
          const arr = [null];
          Object.entries(verseData).forEach(([vn, vt]) => {
            const n = parseInt(vn); if (!n) return;
            while (arr.length <= n) arr.push('');
            arr[n] = String(vt || '').trim();
          });
          books[bookName][ch] = arr;
        } else if (typeof verseData === 'string') {
          books[bookName][ch] = [null, verseData.trim()];
        }
      });
    });
    return { name: name || 'Custom', books };
  }

  function parseVerseArray(arr) {
    const books = {}; let name = 'Custom';
    arr.forEach(entry => {
      if (!entry || typeof entry !== 'object') return;
      const rawBook = entry.book||entry.book_name||entry.bookname||entry.b||entry.Book||entry.BOOK;
      const rawCh   = entry.chapter||entry.chapter_number||entry.c||entry.Chapter||entry.CHAPTER;
      const rawVs   = entry.verse||entry.verse_number||entry.v||entry.Verse||entry.VERSE;
      const rawText = entry.text||entry.verse_text||entry.content||entry.t||entry.Text||entry.scripture;
      if (!rawBook||!rawCh||!rawVs||!rawText) return;
      const bookName=normBook(String(rawBook)), ch=String(parseInt(rawCh)), vs=parseInt(rawVs);
      const txt=String(rawText).trim().replace(/\n/g,' ');
      if (!bookName||!ch||!vs||!txt) return;
      if (!books[bookName]) books[bookName]={};
      if (!books[bookName][ch]) books[bookName][ch]=[null];
      while(books[bookName][ch].length<=vs) books[bookName][ch].push('');
      books[bookName][ch][vs]=txt;
      if (entry.translation||entry.version) name=entry.translation||entry.version;
    });
    return Object.keys(books).length ? {name,books} : null;
  }

  function parseStructuredBooksArray(data) {
    const books={}, name=data.version||data.translation||data.name||'Custom';
    (data.books||[]).forEach(bookObj => {
      const bookName=normBook(String(bookObj.name||bookObj.book||bookObj.abbreviation||''));
      if (!bookName) return;
      books[bookName]={};
      (bookObj.chapters||bookObj.chapter||[]).forEach(chapObj => {
        const ch=String(parseInt(chapObj.chapter||chapObj.number||chapObj.id||1)), arr=[null];
        (chapObj.verses||chapObj.verse||[]).forEach(vsObj => {
          if (typeof vsObj==='string'){arr.push(vsObj.trim());return;}
          const n=parseInt(vsObj.verse||vsObj.number||vsObj.id||arr.length);
          const txt=String(vsObj.text||vsObj.content||vsObj.value||'').trim();
          while(arr.length<=n) arr.push(''); arr[n]=txt;
        });
        books[bookName][ch]=arr;
      });
    });
    return {name,books};
  }

  function parseJSON(text) {
    let data; try{data=JSON.parse(text);}catch(e){throw new Error('Invalid JSON: '+e.message);}
    if (data&&data.name&&data.books&&typeof data.books==='object') return data;
    if (Array.isArray(data)){const r=parseVerseArray(data);if(r)return r;}
    if (data&&typeof data==='object'){
      if (Array.isArray(data.verses)){const r=parseVerseArray(data.verses);if(r){r.name=data.translation||data.version||r.name;return r;}}
      if (Array.isArray(data.books)) return parseStructuredBooksArray(data);
      if (data.data&&typeof data.data==='object'&&!Array.isArray(data.data)){
        const r=booksObjToBW(data.data,data.version||data.translation||'Custom');
        if(Object.keys(r.books).length)return r;
      }
      if (data.resultset&&Array.isArray(data.resultset.row)){
        const r=parseVerseArray(data.resultset.row.map(r=>({
          book:r.field?.[1]||r.book,chapter:r.field?.[2]||r.chapter,
          verse:r.field?.[3]||r.verse,text:r.field?.[4]||r.text,
        })));if(r)return r;
      }
      const keys=Object.keys(data);
      if(keys.length>0){
        const sample=data[keys[0]];
        if(sample&&typeof sample==='object'&&!Array.isArray(sample)){
          const r=booksObjToBW(data,'Custom');if(Object.keys(r.books).length>0)return r;
        }
      }
    }
    return null;
  }

  function parsePlainText(text, filename) {
    const lines=text.split('\n'), books={};
    const refRx=/^(.+?)\s+(\d+):(\d+)\s+(.+)$/, bcvRx=/^(\d{2})(\d{3})(\d{3})\s+(.+)$/;
    let usfmBook='',usfmCh=0,count=0;
    function addVerse(bn,ch,vs,txt){
      const b=String(parseInt(ch)),v=parseInt(vs); if(!b||!v||!txt)return;
      if(!books[bn])books[bn]={};if(!books[bn][b])books[bn][b]=[null];
      while(books[bn][b].length<=v)books[bn][b].push('');
      books[bn][b][v]=String(txt).trim();count++;
    }
    lines.forEach(raw=>{
      const line=raw.replace(/\r/,'').trim(); if(!line)return;
      const uid=line.match(/^\\id\s+(\w+)/i);if(uid){usfmBook=normBook(uid[1]);usfmCh=0;return;}
      const uc=line.match(/^\\c\s+(\d+)/);if(uc){usfmCh=parseInt(uc[1]);return;}
      const uv=line.match(/^\\v\s+(\d+)\s+(.*)/);
      if(uv&&usfmBook&&usfmCh){addVerse(usfmBook,usfmCh,uv[1],uv[2].replace(/\\[a-z]+\*?/g,'').trim());return;}
      const bm=bcvRx.exec(line);if(bm){const bn=BCVmap[bm[1]];if(bn)addVerse(bn,parseInt(bm[2]),bm[3],bm[4]);return;}
      const m=refRx.exec(line);if(m){const bn=normBook(m[1]);if(bn)addVerse(bn,m[2],m[3],m[4]);}
    });
    if(!count)return null;
    return {name:filename.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),books};
  }


  /* ══════════════════════════════════════════════════════════
     Version selector helper
  ══════════════════════════════════════════════════════════ */

  function addToVersionSel(name) {
    ['bible-version-sel','bv-version'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      if (Array.from(sel.options).some(o => o.value === name)) return;
      const opt = document.createElement('option');
      opt.value = opt.textContent = name;
      sel.appendChild(opt);
    });
  }

  /* Restore saved Bible names into selectors on every page load */
  async function restoreVersionNames() {
    try {
      const names = await _listBiblesIDB();
      names.forEach(addToVersionSel);
    } catch(e) {
      /* IDB may not be ready yet — use the name index fallback */
      _getNameIndex().forEach(addToVersionSel);
    }
  }


  /* ══════════════════════════════════════════════════════════
     Core import handler — async, errors caught individually
  ══════════════════════════════════════════════════════════ */

  function toast(msg) {
    if (typeof showSchToast === 'function') showSchToast(msg);
    else console.info('[BW fix27]', msg);
  }

  async function handleFile(file) {
    if (!file) return;
    toast('⏳ Parsing ' + file.name + '…');

    /* 1. Read file text */
    let text;
    try {
      text = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload  = e => res(e.target.result);
        r.onerror = () => rej(new Error('Cannot read file'));
        r.readAsText(file, 'UTF-8');
      });
    } catch(e) { toast('⚠ ' + e.message); return; }

    /* 2. Parse */
    let bible = null;
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'json') {
        bible = parseJSON(text);
      } else {
        bible = parsePlainText(text, file.name);
        if (!bible && (text.trimStart()[0] === '{' || text.trimStart()[0] === '['))
          bible = parseJSON(text);
      }
    } catch(e) { toast('⚠ Parse error: ' + e.message); return; }

    if (!bible || !Object.keys(bible.books || {}).length) {
      toast('⚠ Unrecognised format. Supported: JSON {Genesis:{1:{1:"text"}}}, ' +
            'array [{book,chapter,verse,text}], plain text "Genesis 1:1 text", USFM.');
      return;
    }

    /* 3. Save to IndexedDB (no size limit) */
    try {
      await saveBible(bible);
    } catch(e) {
      toast('⚠ Could not save to IndexedDB: ' + e.message);
      /* Don't return — Bible is still parsed and usable this session */
    }

    /* 4. Add to version selectors */
    addToVersionSel(bible.name);

    /* 5. Expose globally for the Bible viewer to use */
    if (!window._bwCustomBibles) window._bwCustomBibles = {};
    window._bwCustomBibles[bible.name] = bible;

    const bookCount  = Object.keys(bible.books).length;
    const verseCount = Object.values(bible.books).reduce((t,chs) =>
      t + Object.values(chs).reduce((s,arr) =>
        s + (Array.isArray(arr) ? arr.filter(Boolean).length : 0), 0), 0);
    toast(`✓ "${bible.name}" — ${bookCount} books, ${verseCount.toLocaleString()} verses`);
  }


  /* ══════════════════════════════════════════════════════════
     Wire the import button
  ══════════════════════════════════════════════════════════ */

  function wireImportButton() {
    const btn = document.getElementById('bib-import-btn');
    if (!btn) { setTimeout(wireImportButton, 300); return; }

    /* Strip previous listeners */
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);

    fresh.addEventListener('click', () => {
      const inp  = document.createElement('input');
      inp.type   = 'file';
      inp.accept = '.json,.txt,.usfm,.xml,.csv';
      inp.style.display = 'none';
      inp.addEventListener('change', e => {
        handleFile(e.target.files[0]);
        setTimeout(() => inp.remove(), 500);
      });
      document.body.appendChild(inp);
      inp.click();
      setTimeout(() => { if (inp.parentNode) inp.remove(); }, 15000);
    });

    console.info('[BW fix27 v2] ✓ IndexedDB storage  ✓ Robust parser  ✓ Button wired');
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      restoreVersionNames();
      setTimeout(wireImportButton, 700);
    });
  } else {
    restoreVersionNames();
    setTimeout(wireImportButton, 700);
  }

})();

