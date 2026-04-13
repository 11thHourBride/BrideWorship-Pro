/* ═══════════════════════════════════════════════════════════════
   BrideWorship Pro — Theme Engine  (theme-engine.js)
   • App-wide theme switching (7 themes)
   • Template editor: font-size control
   • Template editor: working "Apply" button
   • Template grid: instant "Apply" on each card
   Load this AFTER BrideWorship.js via:
     <script src="js/theme-engine.js"></script>
═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   1. THEME DEFINITIONS
   Each entry mirrors the CSS [data-theme="id"] block.
══════════════════════════════════════════════ */
const APP_THEMES = [
  {
    id:      'dark-gold',
    name:    'Dark Gold',
    tag:     'Default',
    panelBg: '#10101a',
    deepBg:  '#09090f',
    accent:  '#c9a84c',
    text:    '#f0eee8',
    green:   '#4caf7a',
    barColor:'#c9a84c',
    previewBg: 'radial-gradient(ellipse at 28% 28%,#1c0f38 0%,#08051a 100%)',
    previewText: '#f0eee8',
    previewTitle:'#c9a84c',
  },
  {
    id:      'midnight-blue',
    name:    'Midnight Blue',
    tag:     'Cool',
    panelBg: '#0a1422',
    deepBg:  '#060d18',
    accent:  '#5ba3e8',
    text:    '#e8f0fa',
    green:   '#3db870',
    barColor:'#5ba3e8',
    previewBg: 'radial-gradient(ellipse at center,#081830 0%,#020a18 100%)',
    previewText: '#e8f0fa',
    previewTitle:'#5ba3e8',
  },
  {
    id:      'forest-dark',
    name:    'Forest Dark',
    tag:     'Nature',
    panelBg: '#0a1810',
    deepBg:  '#060f08',
    accent:  '#4caf7a',
    text:    '#e8f5ec',
    green:   '#4caf7a',
    barColor:'#4caf7a',
    previewBg: 'radial-gradient(ellipse at center,#0a2010 0%,#050c06 100%)',
    previewText: '#e8f5ec',
    previewTitle:'#4caf7a',
  },
  {
    id:      'crimson',
    name:    'Crimson Church',
    tag:     'Vibrant',
    panelBg: '#1a0a0d',
    deepBg:  '#0f0608',
    accent:  '#e05878',
    text:    '#fae8ec',
    green:   '#50c080',
    barColor:'#e05878',
    previewBg: 'radial-gradient(ellipse at center,#280810 0%,#100206 100%)',
    previewText: '#fae8ec',
    previewTitle:'#e05878',
  },
  {
    id:      'sepia',
    name:    'Warm Sepia',
    tag:     'Warm',
    panelBg: '#1c1810',
    deepBg:  '#100e0a',
    accent:  '#d4a060',
    text:    '#f5ede0',
    green:   '#70a870',
    barColor:'#d4a060',
    previewBg: 'radial-gradient(ellipse at center,#2c2016 0%,#100c08 100%)',
    previewText: '#f5ede0',
    previewTitle:'#d4a060',
  },
  {
    id:      'light',
    name:    'Light Day',
    tag:     'Light',
    panelBg: '#faf8f5',
    deepBg:  '#f4f2ee',
    accent:  '#8a5c20',
    text:    '#1a1610',
    green:   '#1a8050',
    barColor:'#8a5c20',
    previewBg: 'radial-gradient(ellipse at center,#e8e0d0 0%,#d8d0c0 100%)',
    previewText: '#1a1610',
    previewTitle:'#8a5c20',
  },
  {
    id:      'slate',
    name:    'Slate Pro',
    tag:     'Minimal',
    panelBg: '#13161d',
    deepBg:  '#0c0e12',
    accent:  '#7090c8',
    text:    '#dde4f0',
    green:   '#50b888',
    barColor:'#7090c8',
    previewBg: 'radial-gradient(ellipse at 28% 28%,#1c2438 0%,#0a0e16 100%)',
    previewText: '#dde4f0',
    previewTitle:'#7090c8',
  },
];

/* ══════════════════════════════════════════════
   2. THEME STATE
══════════════════════════════════════════════ */
let _activeThemeId = localStorage.getItem('bw_app_theme') || 'dark-gold';

/* ══════════════════════════════════════════════
   3. APPLY A THEME
══════════════════════════════════════════════ */
function applyAppTheme(id, save = true) {
  _activeThemeId = id;
  document.documentElement.setAttribute('data-theme', id);
  if (save) {
    try { localStorage.setItem('bw_app_theme', id); } catch(e) {}
  }
  // Mark active card in switcher panel
  document.querySelectorAll('.tsp-card').forEach(card => {
    card.classList.toggle('active', card.dataset.themeId === id);
  });
  // Update topbar theme button label
  const themeBtn = document.getElementById('app-theme-btn');
  if (themeBtn) {
    const t = APP_THEMES.find(x => x.id === id);
    themeBtn.textContent = '🎨 ' + (t ? t.name : 'Theme');
  }
  // Push updated bg to projection & stage windows
  if (typeof push === 'function') push();
}

/* ══════════════════════════════════════════════
   4. BUILD THEME SWITCHER PANEL HTML
══════════════════════════════════════════════ */
function buildThemeSwitcherPanel() {
  // Remove existing
  document.getElementById('theme-switcher-panel')?.remove();

  const panel = document.createElement('div');
  panel.id        = 'theme-switcher-panel';
  panel.innerHTML = `
    <div class="tsp-head">
      <div class="tsp-title">⬡ App Theme</div>
      <button class="tsp-close" onclick="closeThemeSwitcher()">✕</button>
    </div>
    <div class="tsp-grid" id="tsp-grid"></div>
    <div class="tsp-footer">
      <span class="tsp-footer-label" id="tsp-active-label">Active: Dark Gold</span>
      <button class="tsp-reset-btn" onclick="applyAppTheme('dark-gold')">↺ Reset Default</button>
    </div>`;
  document.body.appendChild(panel);

  // Populate grid
  const grid = document.getElementById('tsp-grid');
  APP_THEMES.forEach(t => {
    const card = document.createElement('div');
    card.className       = 'tsp-card' + (_activeThemeId === t.id ? ' active' : '');
    card.dataset.themeId = t.id;
    card.innerHTML = `
      <div class="tsp-preview" style="background:${t.previewBg};">
        <div class="tsp-preview-bar" style="background:linear-gradient(90deg,${t.accent},transparent);"></div>
        <div class="tsp-preview-check">✓</div>
        <div class="tsp-preview-inner">
          <div class="tsp-preview-title" style="color:${t.previewTitle};">BrideWorship Pro</div>
          <div class="tsp-preview-text" style="color:${t.previewText};">Amazing Grace</div>
        </div>
      </div>
      <div class="tsp-label" style="background:${t.panelBg};color:${t.text};">
        <span>${t.name}</span>
        <span class="tsp-tag" style="background:${t.accent}22;color:${t.accent};">${t.tag}</span>
      </div>`;
    card.addEventListener('click', () => {
      applyAppTheme(t.id);
      updateTspActiveLabel();
    });
    grid.appendChild(card);
  });

  updateTspActiveLabel();
}

function updateTspActiveLabel() {
  const label = document.getElementById('tsp-active-label');
  if (!label) return;
  const t = APP_THEMES.find(x => x.id === _activeThemeId);
  label.textContent = 'Active: ' + (t ? t.name : _activeThemeId);
}

function toggleThemeSwitcher() {
  const panel = document.getElementById('theme-switcher-panel');
  if (!panel) { buildThemeSwitcherPanel(); document.getElementById('theme-switcher-panel').classList.add('open'); return; }
  panel.classList.toggle('open');
}

function closeThemeSwitcher() {
  document.getElementById('theme-switcher-panel')?.classList.remove('open');
}

// Close when clicking outside
document.addEventListener('click', e => {
  const panel = document.getElementById('theme-switcher-panel');
  const btn   = document.getElementById('app-theme-btn');
  if (!panel || !panel.classList.contains('open')) return;
  if (!panel.contains(e.target) && e.target !== btn) {
    panel.classList.remove('open');
  }
});

/* ══════════════════════════════════════════════
   5. INJECT THEME BUTTON INTO TOPBAR
══════════════════════════════════════════════ */
function injectThemeButton() {
  // Find the settings button to insert before it
  const settingsBtn = document.querySelector('.proj-btn[onclick*="openSettings"]');
  if (!settingsBtn || document.getElementById('app-theme-btn')) return;

  const btn = document.createElement('button');
  btn.id          = 'app-theme-btn';
  btn.className   = 'proj-btn';
  btn.title       = 'Switch App Theme';
  btn.style.cssText = 'border-color:rgba(201,168,76,.3);color:var(--accent);';
  const t = APP_THEMES.find(x => x.id === _activeThemeId);
  btn.textContent = '🎨 ' + (t ? t.name : 'Theme');
  btn.addEventListener('click', e => { e.stopPropagation(); toggleThemeSwitcher(); });

  settingsBtn.insertAdjacentElement('beforebegin', btn);

  // Also add a separator before it
  const sep = document.createElement('div');
  sep.className = 'sep';
  btn.insertAdjacentElement('beforebegin', sep);
}

/* ══════════════════════════════════════════════
   6. TEMPLATE EDITOR — FONT SIZE CONTROL
   Injects a font-size row into the editor right column.
══════════════════════════════════════════════ */
let _tmplFontSize = 26; // default slide font size for template

function injectTemplateFontSizeControl() {
  // Find the line spacing row in the template editor (right col)
  const lineSpacingRow = document.querySelector('#tmpl-editor-panel .modal-row:has(#tmpl-line-spacing)');
  // Fallback: find by label text
  const allRows = document.querySelectorAll('#tmpl-editor-panel .modal-row');
  let insertAfterRow = null;
  allRows.forEach(row => {
    if (row.querySelector('#tmpl-line-spacing')) insertAfterRow = row;
  });

  if (!insertAfterRow || document.getElementById('tmpl-font-size-row')) return;

  const row = document.createElement('div');
  row.className = 'modal-row tmpl-font-size-row';
  row.id        = 'tmpl-font-size-row';
  row.innerHTML = `
    <div class="modal-label" style="font-size:9px;margin-bottom:0;">Font Size</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:3px;">
      <input type="range" id="tmpl-font-size-range" min="14" max="60" value="${_tmplFontSize}"
        style="flex:1;accent-color:var(--accent);"
        oninput="onTmplFontSizeChange(this.value)">
      <div class="tmpl-font-size-val" id="tmpl-font-size-val">${_tmplFontSize}px</div>
    </div>`;
  insertAfterRow.insertAdjacentElement('afterend', row);
}

function onTmplFontSizeChange(val) {
  _tmplFontSize = parseInt(val);
  const valEl = document.getElementById('tmpl-font-size-val');
  if (valEl) valEl.textContent = val + 'px';
  // Live preview update
  const textEl = document.getElementById('tmpl-mini-text');
  if (textEl) textEl.style.fontSize = Math.round(val * 0.38) + 'px'; // scaled for mini preview
  if (typeof previewTemplate === 'function') previewTemplate();
}

/* ══════════════════════════════════════════════
   7. TEMPLATE EDITOR — APPLY BUTTON (bottom bar)
   Adds a persistent apply/save bar inside the editor panel.
══════════════════════════════════════════════ */
function injectTemplateApplyBar() {
  const editorPanel = document.getElementById('tmpl-editor-panel');
  if (!editorPanel || document.getElementById('tmpl-apply-bar')) return;

  // Remove any existing modal-foot inside the editor panel
  editorPanel.querySelector('.modal-foot')?.remove();

  const bar = document.createElement('div');
  bar.className = 'tmpl-apply-bar';
  bar.id        = 'tmpl-apply-bar';
  bar.innerHTML = `
    <button class="tmpl-apply-now-btn" onclick="editorApplyAndClose()">
      ✓ Apply Template Now
    </button>
    <button class="tmpl-apply-now-btn"
      style="background:var(--green);flex:0 0 auto;padding:9px 14px;"
      onclick="editorSaveAndApply()">
      💾 Save &amp; Apply
    </button>
    <button class="tmpl-save-only-btn" onclick="editorSaveOnly()">
      Save Only
    </button>`;
  editorPanel.appendChild(bar);
}

/* Apply without saving */
function editorApplyAndClose() {
  const t = buildTemplateFromEditorFull();
  if (!t) return;
  applyTemplateObject(t);
  showSchToast('Template applied ✓');
  closeTemplates();
}

/* Save to custom list AND apply */
function editorSaveAndApply() {
  const t = buildTemplateFromEditorFull();
  if (!t) return;
  // Save to custom list
  if (typeof _customTemplates !== 'undefined') {
    const existingIdx = _customTemplates.findIndex(x => x.name === t.name);
    if (existingIdx >= 0) {
      t.id = _customTemplates[existingIdx].id;
      _customTemplates[existingIdx] = t;
    } else {
      _customTemplates.push(t);
    }
    if (typeof persistCustomTemplates === 'function') persistCustomTemplates();
    if (typeof renderCustomGrid === 'function') renderCustomGrid();
  }
  applyTemplateObject(t);
  showSchToast(`Template "${t.name}" saved & applied ✓`);
  closeTemplates();
}

/* Save without applying */
function editorSaveOnly() {
  const t = buildTemplateFromEditorFull();
  if (!t) return;
  if (typeof _customTemplates !== 'undefined') {
    const existingIdx = _customTemplates.findIndex(x => x.name === t.name);
    if (existingIdx >= 0) {
      t.id = _customTemplates[existingIdx].id;
      _customTemplates[existingIdx] = t;
    } else {
      _customTemplates.push(t);
    }
    if (typeof persistCustomTemplates === 'function') persistCustomTemplates();
    if (typeof renderCustomGrid === 'function') renderCustomGrid();
  }
  showSchToast(`Template "${t.name}" saved ✓`);
}

/* Build template object from editor fields, including font size */
function buildTemplateFromEditorFull() {
  const nameEl = document.getElementById('tmpl-edit-name');
  const name   = nameEl?.value.trim();
  if (!name) { alert('Please give your template a name.'); nameEl?.focus(); return null; }

  // Grab font size from our injected control
  const fsRange = document.getElementById('tmpl-font-size-range');
  const fontSize = fsRange ? parseInt(fsRange.value) : 26;

  // Call the original builder if it exists
  if (typeof buildTemplateFromEditor === 'function') {
    const t = buildTemplateFromEditor();
    if (!t) return null;
    t.fontSize = fontSize;
    return t;
  }

  // Fallback builder (in case BrideWorship.js version isn't available)
  return {
    id:           'custom_' + Date.now(),
    name,
    tag:          'Custom',
    bgType:       document.getElementById('tmpl-bg-type')?.value || 'gradient',
    bgPreset:     document.getElementById('tmpl-bg-preset')?.value,
    bg:           typeof getTmplBgValue === 'function' ? getTmplBgValue() : '#000',
    font:         document.getElementById('tmpl-font')?.value || 'Playfair Display',
    textColor:    document.getElementById('tmpl-text-color')?.value || '#f6f2ec',
    titleColor:   document.getElementById('tmpl-title-color')?.value || '#c9a84c',
    footerColor:  document.getElementById('tmpl-footer-color')?.value || '#55535a',
    align:        document.getElementById('tmpl-align')?.value || 'center',
    shadow:       document.getElementById('tmpl-shadow')?.value || 'soft',
    lineSpacing:  document.getElementById('tmpl-line-spacing')?.value || '1.65',
    fontSize,
    grid:         document.getElementById('tmpl-deco-grid')?.checked ?? true,
    corners:      document.getElementById('tmpl-deco-corners')?.checked ?? true,
    footer:       document.getElementById('tmpl-deco-footer')?.checked ?? true,
    vignette:     document.getElementById('tmpl-deco-vignette')?.checked ?? false,
    watermark:    document.getElementById('tmpl-watermark-text')?.value || '',
    watermarkColor: document.getElementById('tmpl-watermark-color')?.value || '#c9a84c22',
  };
}

/* ══════════════════════════════════════════════
   8. TEMPLATE GRID CARDS — "Apply" hover overlay
   Wraps the original renderPresetGrid / renderCustomGrid
   to inject Apply buttons on each card.
══════════════════════════════════════════════ */
function patchTemplateGridCards() {
  // Patch buildTemplateCard to include the apply overlay
  const originalBuildCard = window.buildTemplateCard;
  if (!originalBuildCard || window._cardPatched) return;
  window._cardPatched = true;

  window.buildTemplateCard = function(t, isCustom, customIdx) {
    const div = originalBuildCard(t, isCustom, customIdx);

    // Add apply overlay to the screen portion
    const screen = div.querySelector('.tmpl-card-screen');
    if (screen) {
      const overlay = document.createElement('div');
      overlay.className = 'tmpl-card-apply-overlay';
      overlay.innerHTML = `<button class="tmpl-card-apply-btn"
        onclick="event.stopPropagation();instantApplyTemplate('${t.id}')">
        ✓ Apply
      </button>`;
      screen.appendChild(overlay);

      // Active badge
      const badge = document.createElement('div');
      badge.className = 'tmpl-active-badge';
      badge.textContent = 'ACTIVE';
      badge.style.display = 'none';
      badge.id = 'tmpl-active-' + t.id;
      screen.appendChild(badge);
    }
    return div;
  };
}

/* Instantly apply a template by id from the grid */
function instantApplyTemplate(id) {
  const all = [
    ...(typeof PRESET_TEMPLATES !== 'undefined' ? PRESET_TEMPLATES : []),
    ...(typeof _customTemplates !== 'undefined' ? _customTemplates : []),
  ];
  const t = all.find(x => x.id === id);
  if (!t) return;

  if (typeof applyTemplateObject === 'function') applyTemplateObject(t);

  // Apply font size if stored
  if (t.fontSize && typeof S !== 'undefined') {
    S.fontSize = t.fontSize;
    const szVal = document.getElementById('sz-val');
    if (szVal) szVal.textContent = t.fontSize;
    const lEl = document.getElementById('s-text');
    if (lEl && typeof applyStyleToEl === 'function') applyStyleToEl(lEl);
    if (typeof push === 'function') push();
  }

  // Mark active badge
  document.querySelectorAll('.tmpl-active-badge').forEach(b => b.style.display = 'none');
  const badge = document.getElementById('tmpl-active-' + id);
  if (badge) badge.style.display = 'block';

  showSchToast(`Template "${t.name}" applied ✓`);
  closeTemplates();
}

/* ══════════════════════════════════════════════
   9. PATCH applyTemplateObject to handle fontSize
══════════════════════════════════════════════ */
(function patchApplyTemplateObject() {
  const original = window.applyTemplateObject;
  if (!original) return;
  window.applyTemplateObject = function(t) {
    original(t);
    // Apply font size from template
    if (t.fontSize && typeof S !== 'undefined') {
      S.fontSize = t.fontSize;
      const szVal = document.getElementById('sz-val');
      if (szVal) szVal.textContent = t.fontSize;
      const lEl = document.getElementById('s-text');
      if (lEl && typeof applyStyleToEl === 'function') applyStyleToEl(lEl);
    }
  };
})();

/* ══════════════════════════════════════════════
   10. PATCH previewTemplate to show font size
══════════════════════════════════════════════ */
(function patchPreviewTemplate() {
  const original = window.previewTemplate;
  if (!original) return;
  window.previewTemplate = function() {
    original();
    // Scale font size for mini preview
    const fsRange = document.getElementById('tmpl-font-size-range');
    if (!fsRange) return;
    const fs   = parseInt(fsRange.value) || 26;
    const text = document.getElementById('tmpl-mini-text');
    if (text) text.style.fontSize = Math.max(7, Math.round(fs * 0.38)) + 'px';
  };
})();

/* ══════════════════════════════════════════════
   11. PATCH openTemplateEditor to populate font size
══════════════════════════════════════════════ */
(function patchOpenTemplateEditor() {
  const original = window.openTemplateEditor;
  if (!original) return;
  window.openTemplateEditor = function(customIdx) {
    original(customIdx);

    // Inject font size control if needed
    injectTemplateFontSizeControl();
    injectTemplateApplyBar();

    // Set font size value from existing template
    const tmpl = customIdx >= 0 && typeof _customTemplates !== 'undefined'
      ? _customTemplates[customIdx]
      : null;
    const fs = tmpl?.fontSize || (typeof S !== 'undefined' ? S.fontSize : 26) || 26;
    _tmplFontSize = fs;
    const range = document.getElementById('tmpl-font-size-range');
    const val   = document.getElementById('tmpl-font-size-val');
    if (range) range.value       = fs;
    if (val)   val.textContent   = fs + 'px';
  };
})();

/* ══════════════════════════════════════════════
   12. PATCH openTemplates to inject controls
══════════════════════════════════════════════ */
(function patchOpenTemplates() {
  const original = window.openTemplates;
  if (!original) return;
  window.openTemplates = function() {
    original();
    // Give DOM a tick to render
    setTimeout(() => {
      patchTemplateGridCards();
      // Re-render grids with patched card builder
      if (typeof renderPresetGrid === 'function') renderPresetGrid();
      if (typeof renderCustomGrid === 'function') renderCustomGrid();
    }, 40);
  };
})();

/* ══════════════════════════════════════════════
   13. FIX — Templates modal nesting
   Moves #templates-modal to body level if it's
   nested inside #table-modal.
══════════════════════════════════════════════ */
function fixTemplatesModalNesting() {
  const tmplModal  = document.getElementById('templates-modal');
  const tableModal = document.getElementById('table-modal');
  if (!tmplModal || !tableModal) return;
  if (tableModal.contains(tmplModal)) {
    // Move to body root
    document.body.appendChild(tmplModal);
    console.info('[BrideWorship] templates-modal moved to body root (was nested inside table-modal)');
  }
}

/* ══════════════════════════════════════════════
   14. BOOT
══════════════════════════════════════════════ */
(function bootThemeEngine() {
  function doInit() {
    // 1. Fix modal nesting
    fixTemplatesModalNesting();

    // 2. Apply saved theme
    applyAppTheme(_activeThemeId, false);

    // 3. Inject theme button into topbar
    injectThemeButton();

    // 4. Build switcher panel (hidden by default)
    buildThemeSwitcherPanel();

    // 5. Patch template functions
    patchTemplateGridCards();

    console.info('[BrideWorship Theme Engine] Loaded. Active theme:', _activeThemeId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else {
    // Slight delay to ensure BrideWorship.js has run
    setTimeout(doInit, 50);
  }
})();

/* ══════════════════════════════════════════════
   15. KEYBOARD SHORTCUT  Alt+T  → theme switcher
══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.altKey && (e.key === 't' || e.key === 'T')) {
    e.preventDefault();
    toggleThemeSwitcher();
  }
});
