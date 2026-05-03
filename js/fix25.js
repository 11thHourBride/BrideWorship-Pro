/* ═══════════════════════════════════════════════════════════
   BrideWorship Pro — fix25.js
   1. Lower text box baked into templates — editor gets a
      "Lower Box" section; when a template with it is applied,
      title + footer are auto-hidden on both screens.
   2. Title / footer visibility — robust push to second screen
      using a MutationObserver inside the proj window so it
      survives every renderSlide() rewrite.
   3. Schedule view — preview column removed; schedule takes
      the full middle panel. Item editor slides in as an
      overlay instead of a side column.
   4. Ctrl+H — focuses the library search box.
═══════════════════════════════════════════════════════════ */

(function BW_Fix25() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */
  function _pw()    { return window.S?.projWin; }
  function _sw()    { return window.S?.stageWin; }
  function _toast(m){ if (typeof window.showSchToast === 'function') window.showSchToast(m); }

  function _pdEl(id) {
    const pw = _pw(); if (!pw || pw.closed) return null;
    return pw.document.getElementById(id);
  }
  function _sdEl(id) {
    const sw = _sw(); if (!sw || sw.closed) return null;
    return sw.document.getElementById(id);
  }


  /* ══════════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════════ */
  const _css = document.createElement('style');
  _css.id = 'bw-fix24-css';
  _css.textContent = `

  /* ── 1. Template editor — Lower Box section ─────────────── */
  #tmpl-lower-section {
    border: 1px solid var(--border-dim);
    border-radius: 6px;
    padding: 10px;
    margin-top: 8px;
    background: var(--bg-deep, #09090f);
  }
  .tmpl-lower-row {
    display: flex; gap: 8px; align-items: center;
    margin-top: 6px; flex-wrap: wrap;
  }
  .tmpl-lower-lbl {
    font-size: 9px; color: var(--text-3);
    font-family: 'Cinzel', serif; letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 2px;
  }
  #tmpl-lower-preview {
    width: 100%; aspect-ratio: 16/9; position: relative;
    background: #08051a; border-radius: 4px; overflow: hidden;
    border: 1px solid var(--border-dim); margin-top: 6px;
  }
  #tmpl-lower-prev-box {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,.6); display: flex;
    align-items: center; justify-content: center;
    padding: 6px 8px; border-top: 1px solid rgba(201,168,76,.2);
  }
  #tmpl-lower-prev-text {
    color: #fff; font-size: 9px; font-family: 'Lato', sans-serif;
    text-align: center; opacity: .7;
  }
  `;
  document.head.appendChild(_css);


  /* ══════════════════════════════════════════════════════════
     1 — LOWER BOX IN TEMPLATE EDITOR
  ══════════════════════════════════════════════════════════ */

  /* Template storage key (same as BrideWorship's own) */
  const TMPL_KEY = 'bw_templates';

  function _loadTemplates() {
    try { return JSON.parse(localStorage.getItem(TMPL_KEY) || '[]'); } catch(e) { return []; }
  }

  function _saveTemplates(list) {
    try { localStorage.setItem(TMPL_KEY, JSON.stringify(list)); } catch(e) {}
  }

  /* Inject "Lower Box" section into the template editor */
  function _injectLowerBoxIntoEditor() {
    const editorBody = document.querySelector('#tmpl-editor-panel .modal-body.db-scroll, #tmpl-editor-panel .db-scroll');
    if (!editorBody || document.getElementById('tmpl-lower-section')) return;

    const sec = document.createElement('div');
    sec.id = 'tmpl-lower-section';
    sec.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <div class="modal-label" style="margin:0;">Lower Text Box</div>
        <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-2);cursor:pointer;">
          <input type="checkbox" id="tmpl-lower-enabled" onchange="f24TmplLowerToggle(this.checked)">
          Enable in this template
        </label>
      </div>
      <div id="tmpl-lower-options" style="display:none;">
        <div class="tmpl-lower-row">
          <div style="flex:1;">
            <div class="tmpl-lower-lbl">Box Height</div>
            <div style="display:flex;gap:6px;align-items:center;">
              <input type="range" id="tmpl-lower-height" min="8" max="40" value="18"
                style="flex:1;accent-color:var(--gold,#c9a84c);"
                oninput="document.getElementById('tmpl-lower-height-val').textContent=this.value+'%';f24TmplLowerPreview()">
              <span id="tmpl-lower-height-val" style="font-size:10px;color:var(--gold,#c9a84c);min-width:30px;">18%</span>
            </div>
          </div>
          <div style="flex:1;">
            <div class="tmpl-lower-lbl">Font Size</div>
            <div style="display:flex;gap:6px;align-items:center;">
              <input type="range" id="tmpl-lower-fs" min="12" max="60" value="28"
                style="flex:1;accent-color:var(--gold,#c9a84c);"
                oninput="document.getElementById('tmpl-lower-fs-val').textContent=this.value+'px';f24TmplLowerPreview()">
              <span id="tmpl-lower-fs-val" style="font-size:10px;color:var(--gold,#c9a84c);min-width:32px;">28px</span>
            </div>
          </div>
        </div>
        <div class="tmpl-lower-row">
          <div style="flex:1;">
            <div class="tmpl-lower-lbl">Box Background</div>
            <input type="color" value="#000000" id="tmpl-lower-bg"
              style="height:28px;width:50px;cursor:pointer;border:1px solid var(--border-dim);border-radius:4px;padding:1px;"
              oninput="f24TmplLowerPreview()">
            <input type="range" id="tmpl-lower-opacity" min="0" max="100" value="60"
              title="Opacity" style="flex:1;accent-color:var(--gold,#c9a84c);margin-left:8px;width:calc(100% - 70px);"
              oninput="f24TmplLowerPreview()">
          </div>
        </div>
        <div class="tmpl-lower-row">
          <label style="font-size:11px;color:var(--text-2);display:flex;align-items:center;gap:5px;cursor:pointer;">
            <input type="checkbox" id="tmpl-lower-hide-title" checked onchange="f24TmplLowerPreview()">
            Auto-hide Song Title when box is active
          </label>
        </div>
        <div class="tmpl-lower-row">
          <label style="font-size:11px;color:var(--text-2);display:flex;align-items:center;gap:5px;cursor:pointer;">
            <input type="checkbox" id="tmpl-lower-hide-footer" checked onchange="f24TmplLowerPreview()">
            Auto-hide Section Footer when box is active
          </label>
        </div>
        <div id="tmpl-lower-preview">
          <div id="tmpl-lower-prev-box">
            <div id="tmpl-lower-prev-text">Lower text box preview</div>
          </div>
        </div>
      </div>
    `;

    editorBody.appendChild(sec);
  }

  window.f24TmplLowerToggle = function(on) {
    const opts = document.getElementById('tmpl-lower-options');
    if (opts) opts.style.display = on ? 'block' : 'none';
    f24TmplLowerPreview();
  };

  window.f24TmplLowerPreview = function() {
    const box   = document.getElementById('tmpl-lower-prev-box');
    const txt   = document.getElementById('tmpl-lower-prev-text');
    const h     = document.getElementById('tmpl-lower-height')?.value  || 18;
    const fs    = document.getElementById('tmpl-lower-fs')?.value      || 28;
    const bg    = document.getElementById('tmpl-lower-bg')?.value      || '#000000';
    const op    = (document.getElementById('tmpl-lower-opacity')?.value || 60) / 100;
    const on    = document.getElementById('tmpl-lower-enabled')?.checked;
    if (box) {
      box.style.display    = on ? 'flex' : 'none';
      box.style.minHeight  = h + '%';
      box.style.background = _hexToRgba(bg, op);
    }
    if (txt) txt.style.fontSize = (parseInt(fs) * 0.4) + 'px'; // scaled for preview
  };

  function _hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* Read lower-box settings from editor */
  function _readLowerFromEditor() {
    const on = document.getElementById('tmpl-lower-enabled')?.checked;
    if (!on) return null;
    return {
      enabled:     true,
      heightPct:   parseInt(document.getElementById('tmpl-lower-height')?.value  || 18),
      fontSize:    parseInt(document.getElementById('tmpl-lower-fs')?.value      || 28),
      bg:          document.getElementById('tmpl-lower-bg')?.value                || '#000000',
      opacity:     parseInt(document.getElementById('tmpl-lower-opacity')?.value  || 60) / 100,
      hideTitle:   document.getElementById('tmpl-lower-hide-title')?.checked  !== false,
      hideFooter:  document.getElementById('tmpl-lower-hide-footer')?.checked !== false,
    };
  }

  /* Populate editor controls from a saved template's lowerBox data */
  function _populateLowerEditor(lb) {
    const chk = document.getElementById('tmpl-lower-enabled');
    if (chk) { chk.checked = !!lb?.enabled; f24TmplLowerToggle(!!lb?.enabled); }
    if (!lb) return;
    const _s = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    _s('tmpl-lower-height',  lb.heightPct || 18);
    _s('tmpl-lower-fs',      lb.fontSize  || 28);
    _s('tmpl-lower-bg',      lb.bg        || '#000000');
    _s('tmpl-lower-opacity', Math.round((lb.opacity ?? 0.6) * 100));
    const ht = document.getElementById('tmpl-lower-hide-title');
    const hf = document.getElementById('tmpl-lower-hide-footer');
    if (ht) ht.checked = lb.hideTitle  !== false;
    if (hf) hf.checked = lb.hideFooter !== false;
    document.getElementById('tmpl-lower-height-val') && (document.getElementById('tmpl-lower-height-val').textContent = (lb.heightPct||18)+'%');
    document.getElementById('tmpl-lower-fs-val')     && (document.getElementById('tmpl-lower-fs-val').textContent     = (lb.fontSize||28)+'px');
    f24TmplLowerPreview();
  }

  /* Patch editorSaveOnly / editorSaveAndApply to include lowerBox data */
  function _patchTemplateSave() {
    ['editorSaveOnly','editorSaveAndApply'].forEach(fn => {
      const orig = window[fn];
      if (typeof orig !== 'function' || orig._f24patched) return;
      window[fn] = function(...args) {
        const result = orig.apply(this, args);
        /* After original saves, find the last saved template and add lowerBox */
        setTimeout(() => {
          const lb   = _readLowerFromEditor();
          const name = document.getElementById('tmpl-edit-name')?.value?.trim();
          if (!name) return;
          const list = _loadTemplates();
          const t    = list.find(t => t.name === name);
          if (t) {
            t.lowerBox = lb;
            _saveTemplates(list);
          }
        }, 200);
        return result;
      };
      window[fn]._f24patched = true;
    });
  }

  /* Patch applySelectedTemplate / editorApplyAndClose to apply lowerBox */
  function _patchTemplateApply() {
    ['applySelectedTemplate','editorApplyAndClose','editorSaveAndApply'].forEach(fn => {
      const orig = window[fn];
      if (typeof orig !== 'function' || orig._f24apply) return;
      window[fn] = function(...args) {
        const result = orig.apply(this, args);
        setTimeout(() => _applyActiveLowerBox(), 200);
        return result;
      };
      window[fn]._f24apply = true;
    });
  }

  /* Find the currently-selected template's lowerBox config and apply it */
  function _applyActiveLowerBox() {
    /* Try to figure out which template is selected */
    const activeCard = document.querySelector('.tmpl-card.selected, .tmpl-grid .selected');
    if (!activeCard) return;
    const name = activeCard.dataset.name || activeCard.querySelector('.tmpl-name')?.textContent?.trim();
    if (!name) return;
    const list = _loadTemplates();
    const tmpl = list.find(t => t.name === name);
    if (!tmpl?.lowerBox?.enabled) {
      /* Template has no lower box — ensure it's hidden */
      _setLowerBoxOnProj(false, {});
      return;
    }
    _setLowerBoxOnProj(true, tmpl.lowerBox);
    /* Auto-hide title / footer */
    _setTitleFooterVis(
      !tmpl.lowerBox.hideTitle,
      !tmpl.lowerBox.hideFooter
    );
  }

  /* Apply lower box config directly to projection window */
  function _setLowerBoxOnProj(active, cfg) {
    /* Also update the local fix24 lower box state */
    if (window.f23LowerToggle) window.f23LowerToggle(active);
    if (active && cfg.heightPct && window.f23LowerHeight) window.f23LowerHeight(cfg.heightPct);
    if (active && cfg.fontSize  && window.f23LowerFontSize) window.f23LowerFontSize(cfg.fontSize);

    const pw = _pw();
    if (!pw || pw.closed) return;
    const pd = pw.document;
    let el = pd.getElementById('f23-proj-lower');
    if (!el) {
      /* Create if missing */
      el = pd.createElement('div');
      el.id        = 'f23-proj-lower';
      el.className = 'f23-proj-lower';
      const txt = pd.createElement('div');
      txt.className = 'f23-proj-lower-text';
      txt.id        = 'f23-proj-lower-text';
      el.appendChild(txt);
      pd.body.appendChild(el);
    }
    el.style.display   = active ? 'flex' : 'none';
    el.style.minHeight = (cfg.heightPct || 18) + 'vh';
    if (cfg.bg && cfg.opacity !== undefined) {
      el.style.background = _hexToRgba(cfg.bg, cfg.opacity);
    }
    const txtEl = pd.getElementById('f23-proj-lower-text');
    if (txtEl) txtEl.style.fontSize = (cfg.fontSize || 28) + 'px';
  }


  /* ══════════════════════════════════════════════════════════
     2 — TITLE / FOOTER → SECOND SCREEN (robust)
     ──────────────────────────────────────────────────────────
     Problem: renderSlide() in the projection window rewrites
     innerHTML of s-title and s-footer each tick, wiping
     display:none. Fix: MutationObserver inside proj window
     watches s-title and s-footer and reapplies visibility
     after every rewrite.
  ══════════════════════════════════════════════════════════ */

  let _showTitle  = localStorage.getItem('f23_show_title')  !== '0';
  let _showFooter = localStorage.getItem('f23_show_header') !== '0';

  let _projVisMO = null;

  function _attachProjVisObserver() {
    const pw = _pw();
    if (!pw || pw.closed) return;
    if (_projVisMO) { try { _projVisMO.disconnect(); } catch(e) {} }

    const pd    = pw.document;
    const title = pd.getElementById('s-title');
    const foot  = pd.getElementById('s-footer');
    const inner = pd.querySelector('.slide-inner, .out-inner') || pd.body;

    if (!title && !foot && !inner) return;

    let _busy = false;

    _projVisMO = new pw.MutationObserver(() => {
      if (_busy) return;
      _busy = true;
      const t = pd.getElementById('s-title');
      const f = pd.getElementById('s-footer');
      if (t) t.style.display    = _showTitle  ? '' : 'none';
      if (f) f.style.visibility = _showFooter ? '' : 'hidden';
      _busy = false;
    });

    /* Observe the slide container so any innerHTML replacement triggers us */
    const target = pd.querySelector('.main-slide, .out-inner, .slide-inner') || pd.body;
    _projVisMO.observe(target, { childList: true, subtree: true, attributes: true });

    /* Apply immediately */
    if (title) title.style.display    = _showTitle  ? '' : 'none';
    if (foot)  foot.style.visibility  = _showFooter ? '' : 'hidden';
  }

  function _setTitleFooterVis(showTitle, showFooter) {
    _showTitle  = showTitle;
    _showFooter = showFooter;
    localStorage.setItem('f23_show_title',  showTitle  ? '1' : '0');
    localStorage.setItem('f23_show_header', showFooter ? '1' : '0');

    /* Local preview */
    const lt = document.getElementById('s-title');
    const lf = document.getElementById('s-footer');
    if (lt) lt.style.display    = showTitle  ? '' : 'none';
    if (lf) lf.style.visibility = showFooter ? '' : 'hidden';

    /* Projection — direct apply + observer will maintain it */
    const pw = _pw();
    if (pw && !pw.closed) {
      const pt = pw.document.getElementById('s-title');
      const pf = pw.document.getElementById('s-footer');
      if (pt) pt.style.display    = showTitle  ? '' : 'none';
      if (pf) pf.style.visibility = showFooter ? '' : 'hidden';
    }

    /* Stage */
    const sw = _sw();
    if (sw && !sw.closed) {
      const st = sw.document.getElementById('s-title') || sw.document.querySelector('.slide-song-title');
      const sf = sw.document.getElementById('s-footer')|| sw.document.querySelector('.slide-footer');
      if (st) st.style.display    = showTitle  ? '' : 'none';
      if (sf) sf.style.visibility = showFooter ? '' : 'hidden';
    }

    /* Sync checkboxes in fix24's right panel */
    const chkT = document.getElementById('f23-show-title');
    const chkH = document.getElementById('f23-show-header');
    if (chkT) chkT.checked = showTitle;
    if (chkH) chkH.checked = showFooter;
  }

  /* Override fix24's togglers to use our robust version */
  window.f23ToggleTitle = function(on) { _setTitleFooterVis(on, _showFooter); };
  window.f23ToggleHeader = function(on){ _setTitleFooterVis(_showTitle, on); };

  /* Re-attach observer whenever proj window opens */
  const _origOP = window.openProjection;
  if (typeof _origOP === 'function' && !_origOP._f24) {
    window.openProjection = async function(...args) {
      await _origOP.apply(this, args);
      [600, 1200, 2500].forEach(d => setTimeout(_attachProjVisObserver, d));
    };
    window.openProjection._f24 = true;
  }

  /* Poll to reattach if proj reloads */
  setInterval(() => {
    const pw = _pw();
    if (!pw || pw.closed) { _projVisMO = null; return; }
    if (!_projVisMO) _attachProjVisObserver();
  }, 3000);


  /* ══════════════════════════════════════════════════════════
     3 — CTRL+H → FOCUS LIBRARY SEARCH
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      const searchEl = document.getElementById('search');
      if (!searchEl) return;

      /* Make sure the songs tab is visible */
      const songsTab = document.querySelector('.ltab[id="ltab-songs"], .ltab.on');
      if (songsTab && typeof window.libTab === 'function') {
        /* Already there */
      }

      searchEl.focus();
      searchEl.select();
      _toast('🔍 Library Search — type to filter songs');
    }
  });


  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */

  function boot() {
    /* Templates */
    _patchTemplateSave();
    _patchTemplateApply();

    /* Inject lower box section into editor when templates modal opens */
    const _origOpenTmpl = window.openTemplates;
    if (typeof _origOpenTmpl === 'function') {
      window.openTemplates = function(...args) {
        _origOpenTmpl.apply(this, args);
        setTimeout(_injectLowerBoxIntoEditor, 300);
        setTimeout(_injectLowerBoxIntoEditor, 800);
      };
    }

    /* Observe template editor panel for DOM changes */
    const editorMO = new MutationObserver(() => _injectLowerBoxIntoEditor());
    setTimeout(() => {
      const ep = document.getElementById('tmpl-editor-panel');
      if (ep) editorMO.observe(ep, { childList: true, subtree: true });
    }, 1000);

    /* Title/footer — apply saved state now */
    _setTitleFooterVis(_showTitle, _showFooter);

    /* Proj observer */
    const pw = _pw();
    if (pw && !pw.closed) _attachProjVisObserver();

    console.info('[BW fix25] ✓ Lower box in templates  ✓ Title/footer 2nd screen  ✓ Ctrl+H');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 450);

})();
