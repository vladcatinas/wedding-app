// ── Styles ────────────────────────────────────────────────────────────────────
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/modules.css';

// ── Core ──────────────────────────────────────────────────────────────────────
import { loadState, getState, saveState, replaceState } from './state.js';
import { navigate, render }                             from './router.js';
import { uuid, toast, buildDemoWedding }                from './utils.js';
import { on }                                           from './events.js';

// ── Components ────────────────────────────────────────────────────────────────
import { initWeddingSelector, buildWeddingSelect } from './components/weddingSelector.js';
import { openGuestModal }                          from './components/guestModal.js';
import { openWeddingModal }                        from './components/weddingModal.js';
import { openImportModal, initImportModal }        from './components/importModal.js';

// ── Bootstrap ─────────────────────────────────────────────────────────────────
function init() {
  // Check localStorage availability
  try {
    localStorage.setItem('_wp_test', '1');
    localStorage.removeItem('_wp_test');
  } catch (_) {
    alert('localStorage is disabled. The app cannot save data in this browser.');
  }

  loadState();

  const state = getState();
  if (!state.weddings.length) {
    const demoId = uuid();
    state.weddings.push(buildDemoWedding(demoId));
    state.activeWeddingId = demoId;
    saveState();
  }

  if (!state.activeWeddingId && state.weddings.length) {
    state.activeWeddingId = state.weddings[0].id;
  }

  initWeddingSelector();
  initImportModal();
  bindGlobalEvents();

   // Rebuild selector whenever a new wedding is created
  on('wedding-created', () => buildWeddingSelect());

  navigate('dashboard');
}

// ── Global event wiring ───────────────────────────────────────────────────────
function bindGlobalEvents() {
  // Sidebar nav items
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.tab));
  });

  // Header + sidebar buttons
  document.getElementById('btn-add-guest')?.addEventListener('click', () => openGuestModal());
  document.getElementById('btn-new-wedding')?.addEventListener('click', () => openWeddingModal());

  // Export
  document.getElementById('btn-export')?.addEventListener('click', exportData);

  // Import JSON
  document.getElementById('import-json-input')?.addEventListener('change', importJSON);

  // Modal close buttons (data-close attribute)
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close)?.classList.remove('open');
    });
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    }
  });
}

// ── Export / Import JSON ──────────────────────────────────────────────────────
function exportData() {
  const state = getState();
  if (!state.weddings.length) { toast('Nothing to export', 'error'); return; }

  const active = state.weddings.find(w => w.id === state.activeWeddingId);
  const name   = active ? `${active.couple.partner1}-${active.couple.partner2}` : 'all';

  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `wedding-planner-${name}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Exported successfully!', 'success');
}

function importJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);

      if (!Array.isArray(data.weddings)) {
        throw new Error('Invalid format: missing "weddings" array');
      }

      const action = confirm(
        `Import found ${data.weddings.length} wedding(s).\n\n` +
        'OK = Merge with existing data\nCancel = Replace all data'
      );

      if (action) {
        // Merge: add weddings not already present (by id)
        const state = getState();
        data.weddings.forEach(w => {
          if (!state.weddings.find(x => x.id === w.id)) state.weddings.push(w);
        });
        saveState();
      } else {
        replaceState(data);
      }

      buildWeddingSelect();
      render();
      toast('Imported successfully!', 'success');
    } catch (err) {
      toast('Import failed: ' + err.message, 'error');
    }
    e.target.value = '';
  };

  reader.readAsText(file);
}

// ── Run ───────────────────────────────────────────────────────────────────────
init();
