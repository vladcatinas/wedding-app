import { renderDashboard } from './modules/dashboard.js';
import { renderGuests }    from './modules/guests.js';
import { renderSeating }   from './modules/seating.js';
import { renderBudget }    from './modules/budget.js';
import { getActiveWedding } from './state.js';
import { on } from './events.js';
import { openWeddingModal } from './components/weddingModal.js';

const TITLES = {
  dashboard: 'Dashboard',
  guests:    'Guest List',
  seating:   'Seating Chart',
  budget:    'Bugetul Nunții',
};

let _currentTab = 'dashboard';

export function getCurrentTab() { return _currentTab; }

// Allow other modules to trigger navigation/render without importing router directly
on('navigate', tab => navigate(tab));
on('render',   ()  => render());

export function navigate(tab) {
  _currentTab = tab;

  // Update nav items (sidebar + bottom bar)
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });

  const titleEl = document.getElementById('header-title');
  if (titleEl) titleEl.textContent = TITLES[tab] ?? '';

  render();
}

export function render() {
  const w = getActiveWedding();
  const content = document.getElementById('content');
  if (!content) return;

  if (!w) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💍</div>
        <h2>No weddings yet</h2>
        <p>Create your first wedding to get started.</p>
        <button class="btn btn-primary" id="empty-new-wedding">+ Create Wedding</button>
      </div>`;

    document.getElementById('empty-new-wedding')?.addEventListener('click', () => openWeddingModal());
    return;
  }

  switch (_currentTab) {
    case 'dashboard': renderDashboard(w); break;
    case 'guests':    renderGuests(w);    break;
    case 'seating':   renderSeating(w);   break;
    case 'budget':    renderBudget(w);    break;
  }
}
