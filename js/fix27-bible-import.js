
/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix27-bible-import.js  (v3)
   1. Accepts .json .txt .usfm .csv .xml — all parsed.
   2. Imported Bibles stored in IndexedDB (no quota limit).
   3. loadBibVerses() patched to serve from IndexedDB FIRST
      so the app works fully offline after import.
      Internet is only used when NO local Bible covers the
      requested book/chapter.
═══════════════════════════════════════════════════════════ */

(function BW_fix27v3() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     IndexedDB — key/value store for full Bible objects
  ══════════════════════════════════════════════════════════ */

  const DB_NAME  = 'BrideWorshipBibles';
  const DB_VER   = 1;
  const STORE    = 'bibles';
  const IDX_KEY  = 'bw_bible_names_v2';   // localStorage name list only

  let _dbPromise = null;
  function _db() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = e => {
        if (!e.target.result.objectStoreNames.contains(STORE))
          e.target.result.createObjectStore(STORE, { keyPath: 'name' });
      };
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
    return _dbPromise;
  }

  async function idbPut(bible) {
    const db = await _db();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(bible).onsuccess = () => res(true);
      tx.onerror = e => rej(e.target.error);
    });
  }

  async function idbGet(name) {
    const db = await _db();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      tx.objectStore(STORE).get(name).onsuccess = e => res(e.target.result || null);
      tx.onerror = e => rej(e.target.error);
    });
  }

  async function idbKeys() {
    const db = await _db();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      tx.objectStore(STORE).getAllKeys().onsuccess = e => res(e.target.result || []);
      tx.onerror = e => rej(e.target.error);
    });
  }

  async function idbDel(name) {
    const db = await _db();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(name).onsuccess = () => res(true);
      tx.onerror = e => rej(e.target.error);
    });
  }

  /* Name index in localStorage — tiny, just strings */
  function _nameList()          { try { return JSON.parse(localStorage.getItem(IDX_KEY)||'[]'); } catch(e) { return []; } }
  function _addName(n)          { const l=_nameList(); if(!l.includes(n)){l.push(n);try{localStorage.setItem(IDX_KEY,JSON.stringify(l));}catch(e){}} }
  function _delName(n)          { try{localStorage.setItem(IDX_KEY,JSON.stringify(_nameList().filter(x=>x!==n)));}catch(e){} }

  /* Public API */
  window.bwListBibles  = idbKeys;
  window.bwLoadBible   = idbGet;
  window.bwDeleteBible = async n => { await idbDel(n); _delName(n); };

  async function _saveBible(bible) {
    await idbPut(bible);
    _addName(bible.name);
  }

  /* In-memory cache of loaded Bibles this session */
  const _cache = {};   // { [name]: bible }

  async function _getBible(name) {
    if (_cache[name]) return _cache[name];
    const b = await idbGet(name);
    if (b) _cache[name] = b;
    return b;
  }


  /* ══════════════════════════════════════════════════════════
     PATCH loadBibVerses — serve from IndexedDB first
  ══════════════════════════════════════════════════════════ */

  const _origLoadBibVerses = window.loadBibVerses;

  window.loadBibVerses = async function (book, ch, vsFrom, vsTo) {
    /* Which Bible is currently selected? */
    const verSel = document.getElementById('bv-version')
                || document.getElementById('bible-version-sel');
    const selectedVersion = verSel?.value || 'kjv';

    /* Try local first — any imported Bible whose name matches (case-insensitive) */
    const names   = _nameList();
    const localName = names.find(n =>
      n.toLowerCase() === selectedVersion.toLowerCase() ||
      n.toLowerCase().replace(/\s/g,'') === selectedVersion.toLowerCase().replace(/\s/g,'')
    ) || (names.length ? names[0] : null);   // fall back to first imported Bible

    if (localName) {
      try {
        const bible = await _getBible(localName);
        if (bible) {
          const verses = _extractVerses(bible, book.name, ch, vsFrom, vsTo);
          if (verses.length) return verses;
        }
      } catch(e) {
        console.warn('[BW fix27] Local lookup failed, falling back to API:', e);
      }
    }

    /* No local match — fall through to original API fetch */
    if (typeof _origLoadBibVerses === 'function') {
      return _origLoadBibVerses(book, ch, vsFrom, vsTo);
    }
    throw new Error('No local Bible for "' + (book.name||'?') + '" and no internet connection.');
  };

  /* Extract verses from a stored Bible object */
  function _extractVerses(bible, bookName, ch, vsFrom, vsTo) {
    /* Try exact match then normalised match */
    let chapData = bible.books[bookName];
    if (!chapData) {
      const lo  = bookName.toLowerCase();
      const key = Object.keys(bible.books).find(k => k.toLowerCase() === lo);
      chapData  = key ? bible.books[key] : null;
    }
    if (!chapData) return [];

    const arr = chapData[String(ch)] || chapData[ch];
    if (!arr) return [];

    const from = vsFrom || 1;
    const to   = vsTo   || arr.length - 1;
    const out  = [];
    for (let v = from; v <= Math.min(to, arr.length - 1); v++) {
      if (arr[v]) out.push({ num: v, text: String(arr[v]).trim() });
    }
    return out;
  }


  /* ══════════════════════════════════════════════════════════
     PARSERS — all formats
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
    '1sa':'1 Samuel','1sam':'1 Samuel',
    '2sa':'2 Samuel','2sam':'2 Samuel',
    '1ki':'1 Kings','1kgs':'1 Kings',
    '2ki':'2 Kings','2kgs':'2 Kings',
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
    amo:'Amos',am:'Amos',oba:'Obadiah',ob:'Obadiah',obad:'Obadiah',
    jon:'Jonah',jnh:'Jonah',mic:'Micah',mi:'Micah',
    nah:'Nahum',na:'Nahum',hab:'Habakkuk',hb:'Habakkuk',
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

  function _addVerse(books, bookName, ch, vs, txt) {
    const b = String(parseInt(ch)), v = parseInt(vs);
    if (!b || !v || !txt || !bookName) return;
    if (!books[bookName]) books[bookName] = {};
    if (!books[bookName][b]) books[bookName][b] = [null];
    while (books[bookName][b].length <= v) books[bookName][b].push('');
    books[bookName][b][v] = String(txt).trim().replace(/\s+/g, ' ');
  }

  /* ── JSON parsers ── */
  function _booksObjToBW(booksObj, name) {
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

  function _parseVerseArray(arr) {
    const books = {}; let name = 'Custom';
    arr.forEach(entry => {
      if (!entry || typeof entry !== 'object') return;
      const rb = entry.book||entry.book_name||entry.bookname||entry.b||entry.Book||entry.BOOK;
      const rc = entry.chapter||entry.chapter_number||entry.c||entry.Chapter||entry.CHAPTER;
      const rv = entry.verse||entry.verse_number||entry.v||entry.Verse||entry.VERSE;
      const rt = entry.text||entry.verse_text||entry.content||entry.t||entry.Text||entry.scripture;
      if (!rb||!rc||!rv||!rt) return;
      _addVerse(books, normBook(String(rb)), rc, rv, String(rt));
      if (entry.translation||entry.version) name = entry.translation||entry.version;
    });
    return Object.keys(books).length ? {name,books} : null;
  }

  function _parseStructured(data) {
    const books = {}, name = data.version||data.translation||data.name||'Custom';
    (data.books||[]).forEach(bo => {
      const bn = normBook(String(bo.name||bo.book||bo.abbreviation||''));
      if (!bn) return; books[bn] = {};
      (bo.chapters||bo.chapter||[]).forEach(co => {
        const ch = String(parseInt(co.chapter||co.number||co.id||1)), arr=[null];
        (co.verses||co.verse||[]).forEach(vsObj => {
          if (typeof vsObj==='string'){arr.push(vsObj.trim());return;}
          const n=parseInt(vsObj.verse||vsObj.number||vsObj.id||arr.length);
          const t=String(vsObj.text||vsObj.content||vsObj.value||'').trim();
          while(arr.length<=n)arr.push(''); arr[n]=t;
        });
        books[bn][ch]=arr;
      });
    });
    return {name,books};
  }

  function _parseJSON(text) {
    let data; try{data=JSON.parse(text);}catch(e){throw new Error('Invalid JSON: '+e.message);}
    if (data?.name && data.books && typeof data.books==='object') return data;
    if (Array.isArray(data)) { const r=_parseVerseArray(data); if(r) return r; }
    if (data && typeof data==='object') {
      if (Array.isArray(data.verses)) { const r=_parseVerseArray(data.verses); if(r){r.name=data.translation||data.version||r.name;return r;} }
      if (Array.isArray(data.books))  return _parseStructured(data);
      if (data.data && typeof data.data==='object' && !Array.isArray(data.data)) {
        const r=_booksObjToBW(data.data, data.version||data.translation||'Custom');
        if(Object.keys(r.books).length) return r;
      }
      const keys=Object.keys(data);
      if (keys.length>0) {
        const s=data[keys[0]];
        if (s && typeof s==='object' && !Array.isArray(s)) {
          const r=_booksObjToBW(data,'Custom');
          if(Object.keys(r.books).length>0) return r;
        }
      }
    }
    return null;
  }

  /* ── Plain text / USFM / BCV / CSV ── */
  function _parsePlainText(text, filename) {
    const lines  = text.split('\n');
    const books  = {};
    const refRx  = /^(.+?)\s+(\d+):(\d+)\s+(.+)$/;
    const bcvRx  = /^(\d{2})(\d{3})(\d{3})\s+(.+)$/;
    const tabRx  = /^(\w+)\t(\d+)\t(\d+)\t(.+)$/;    /* TSV: book\tch\tvs\ttext */
    const csvRx  = /^"?([^",]+)"?,\s*"?(\d+)"?,\s*"?(\d+)"?,\s*"?(.+?)"?$/; /* CSV */
    let usfmBook='', usfmCh=0, count=0;

    const add = (bn,ch,vs,tx) => { const b=normBook(bn); if(b){_addVerse(books,b,ch,vs,tx);count++;} };

    lines.forEach(raw => {
      const line = raw.replace(/\r/,'').trim();
      if (!line || line.startsWith('#') || line.startsWith('//')) return;

      /* USFM */
      const uid=line.match(/^\\id\s+(\w+)/i); if(uid){usfmBook=normBook(uid[1]);usfmCh=0;return;}
      const uc =line.match(/^\\c\s+(\d+)/);   if(uc) {usfmCh=parseInt(uc[1]);return;}
      const uv =line.match(/^\\v\s+(\d+)\s+(.*)/);
      if(uv&&usfmBook&&usfmCh){add(usfmBook,usfmCh,uv[1],uv[2].replace(/\\[a-z]+\*?/g,'').trim());return;}

      /* BBCCCVVV */
      const bm=bcvRx.exec(line);if(bm){const bn=BCVmap[bm[1]];if(bn)add(bn,parseInt(bm[2]),bm[3],bm[4]);return;}

      /* TSV */
      const tm=tabRx.exec(line);if(tm){add(tm[1],tm[2],tm[3],tm[4]);return;}

      /* CSV */
      const cm=csvRx.exec(line);if(cm){add(cm[1],cm[2],cm[3],cm[4].replace(/"/g,''));return;}

      /* "Book Ch:Vs text" */
      const m=refRx.exec(line);if(m)add(m[1],m[2],m[3],m[4]);
    });

    if (!count) return null;
    const name = filename.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    return {name,books};
  }


  /* ══════════════════════════════════════════════════════════
     VERSION SELECTORS
  ══════════════════════════════════════════════════════════ */

  function _addToSels(name) {
    ['bible-version-sel','bv-version'].forEach(id => {
      const sel=document.getElementById(id); if(!sel)return;
      if(Array.from(sel.options).some(o=>o.value===name))return;
      const opt=document.createElement('option');
      opt.value=opt.textContent=name; sel.appendChild(opt);
    });
  }

  async function _restoreVersionNames() {
    try {
      const names = await idbKeys();
      names.forEach(_addToSels);
    } catch(e) {
      _nameList().forEach(_addToSels);
    }
  }


  /* ══════════════════════════════════════════════════════════
     CORE IMPORT HANDLER
  ══════════════════════════════════════════════════════════ */

  function _toast(msg) {
    if (typeof showSchToast==='function') showSchToast(msg);
    else console.info('[BW fix27]', msg);
  }

  async function handleFile(file) {
    if (!file) return;
    _toast('⏳ Reading ' + file.name + '…');

    /* 1. Read */
    let text;
    try {
      text = await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=e=>res(e.target.result);
        r.onerror=()=>rej(new Error('Cannot read file'));
        r.readAsText(file,'UTF-8');
      });
    } catch(e) { _toast('⚠ '+e.message); return; }

    /* 2. Parse — try all parsers */
    let bible = null;
    const ext = file.name.split('.').pop().toLowerCase();

    try {
      if (ext==='json') {
        bible = _parseJSON(text);
      } else {
        /* For .txt, .usfm, .csv, .tsv, .xml, or unknown: try plain text first */
        bible = _parsePlainText(text, file.name);
        /* If that failed, it might be JSON in a .txt file */
        if (!bible) {
          const firstChar = text.trimStart()[0];
          if (firstChar==='{' || firstChar==='[') bible = _parseJSON(text);
        }
      }
    } catch(e) {
      _toast('⚠ Parse error: ' + e.message);
      return;
    }

    if (!bible || !Object.keys(bible.books||{}).length) {
      _toast('⚠ Could not read Bible. Supported formats: ' +
        'JSON ({Genesis:{1:{1:"text"}}}, [{book,chapter,verse,text}]), ' +
        'plain text (Genesis 1:1 text…), USFM (\\id GEN \\c 1 \\v 1 text), ' +
        'TSV/CSV (book,ch,vs,text).');
      return;
    }

    /* 3. Save */
    try { await _saveBible(bible); } catch(e) {
      _toast('⚠ Save failed: '+e.message);
      /* Still usable this session */
    }

    /* 4. Cache + update selectors */
    _cache[bible.name] = bible;
    _addToSels(bible.name);

    /* 5. Auto-select the imported Bible */
    ['bible-version-sel','bv-version'].forEach(id=>{
      const sel=document.getElementById(id); if(sel) sel.value=bible.name;
    });

    const bc = Object.keys(bible.books).length;
    const vc = Object.values(bible.books).reduce((t,chs)=>
      t+Object.values(chs).reduce((s,arr)=>
        s+(Array.isArray(arr)?arr.filter(Boolean).length:0),0),0);
    _toast(`✓ "${bible.name}" ready — ${bc} books, ${vc.toLocaleString()} verses. Working offline.`);
  }

  /* Expose for external callers */
  window.bwImportBibleFile = handleFile;


  /* ══════════════════════════════════════════════════════════
     WIRE THE IMPORT BUTTON  (replaces fix17/fix26 handler)
  ══════════════════════════════════════════════════════════ */

  function _wireBtn() {
    const btn = document.getElementById('bib-import-btn');
    if (!btn) { setTimeout(_wireBtn, 400); return; }

    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);

    fresh.addEventListener('click', () => {
      const inp=document.createElement('input');
      inp.type='file';
      /* Accept EVERYTHING — we try all parsers client-side */
      inp.accept='.json,.txt,.usfm,.usfx,.osis,.xml,.csv,.tsv,.tab,.text,.sword';
      inp.style.display='none';
      inp.addEventListener('change', e => {
        handleFile(e.target.files[0]);
        setTimeout(()=>inp.remove(),500);
      });
      document.body.appendChild(inp); inp.click();
      setTimeout(()=>{if(inp.parentNode)inp.remove();},15000);
    });

    console.info('[BW fix27 v3] ✓ All formats  ✓ IndexedDB  ✓ Offline loadBibVerses');
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', ()=>{
      _restoreVersionNames();
      setTimeout(_wireBtn, 800);
    });
  } else {
    _restoreVersionNames();
    setTimeout(_wireBtn, 800);
  }

})();
