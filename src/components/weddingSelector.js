import { getState, setActiveWedding, deleteWedding, getActiveWedding } from '../state.js';
import { render } from '../router.js';
import { esc, toast } from '../utils.js';
import { emit } from '../events.js';

export function buildWeddingSelect() {
  const sel = document.getElementById('wedding-select');
  if (!sel) return;

  const { weddings, activeWeddingId } = getState();

  sel.innerHTML = weddings.length
    ? weddings.map(w =>
        `<option value="${w.id}" ${w.id === activeWeddingId ? 'selected' : ''}>
          ${esc(w.couple.partner1)} &amp; ${esc(w.couple.partner2)}
        </option>`
      ).join('')
    : '<option value="">— No weddings —</option>';

  // Hide delete button when there are no weddings
  const delBtn = document.getElementById('btn-delete-wedding');
  if (delBtn) delBtn.style.display = weddings.length ? '' : 'none';
}

export function initWeddingSelector() {
  buildWeddingSelect();

  document.getElementById('wedding-select')?.addEventListener('change', e => {
    setActiveWedding(e.target.value);
    render();
  });

  document.getElementById('btn-delete-wedding')?.addEventListener('click', () => {
    const w = getActiveWedding();
    if (!w) return;

    const name = `${w.couple.partner1} & ${w.couple.partner2}`;
    if (!confirm(
      `⚠ Delete the wedding "${name}"?\n\n` +
      `This will permanently delete all guests, seating, and budget data for this wedding.\n\n` +
      `Cannot be undone.`
    )) return;
    if (!confirm('Are you absolutely sure? Click OK to confirm deletion.')) return;

    deleteWedding(w.id);
    buildWeddingSelect();
    toast(`Deleted "${name}"`, 'success');
    emit('navigate', 'dashboard');
  });
}
