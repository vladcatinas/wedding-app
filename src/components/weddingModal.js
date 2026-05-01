import { uuid, toast, openModal, closeModal } from '../utils.js';
import { addWedding } from '../state.js';
import { emit } from '../events.js';

export function openWeddingModal() {
  ['wm-p1','wm-p2','wm-date','wm-location'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('wm-save').onclick = saveWedding;
  openModal('wedding-modal');
  document.getElementById('wm-p1').focus();
}

function saveWedding() {
  const p1 = document.getElementById('wm-p1').value.trim();
  const p2 = document.getElementById('wm-p2').value.trim();

  if (!p1 || !p2) {
    toast('Both partner names are required', 'error');
    return;
  }

  addWedding({
    id:       uuid(),
    couple:   { partner1: p1, partner2: p2 },
    date:     document.getElementById('wm-date').value || '',
    location: document.getElementById('wm-location').value.trim(),
    createdAt: new Date().toISOString().slice(0, 10),
    guests:  [],
    seating: { tables: [], unassigned: [] },
  });



  closeModal('wedding-modal');
  toast('Wedding created! 🎉', 'success');
  emit('wedding-created');
  emit('render');
}
