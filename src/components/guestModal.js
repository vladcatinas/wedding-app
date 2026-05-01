import { uuid, esc, toast, openModal, closeModal } from '../utils.js';
import { getActiveWedding, updateWedding, ensureSeating } from '../state.js';
import { emit } from '../events.js';

export function openGuestModal(guestId = null) {
  const w = getActiveWedding();
  if (!w) { toast('No active wedding', 'error'); return; }

  const isEdit = !!guestId;
  document.getElementById('gm-title').textContent = isEdit ? 'Edit Guest' : 'Add Guest';

  const deleteBtn = document.getElementById('gm-delete');
  deleteBtn.style.display = isEdit ? 'block' : 'none';
  deleteBtn.onclick = () => deleteGuest(guestId);

  document.getElementById('err-name').textContent  = '';
  document.getElementById('err-email').textContent = '';

  // Populate table dropdown
  const tableSelect = document.getElementById('gm-table');
  tableSelect.innerHTML =
    '<option value="">— Unassigned —</option>' +
    (w.seating?.tables ?? []).map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('');

  if (isEdit) {
    const g = (w.guests ?? []).find(g => g.id === guestId);
    if (!g) return;
    document.getElementById('gm-id').value       = g.id;
    document.getElementById('gm-name').value     = g.name ?? '';
    document.getElementById('gm-email').value    = g.email ?? '';
    document.getElementById('gm-phone').value    = g.phone ?? '';
    document.getElementById('gm-side').value     = g.side ?? 'bride';
    document.getElementById('gm-rsvp').value     = g.rsvpStatus ?? 'pending';
    document.getElementById('gm-party').value    = g.partySize ?? 1;
    document.getElementById('gm-dietary').value  = g.dietaryRestrictions ?? '';
    document.getElementById('gm-attended').value = g.attended ?? 'pending';
    document.getElementById('gm-gift').value     = g.giftAmount ?? '';
    document.getElementById('gm-notes').value    = g.notes ?? '';
    const currentTable = (w.seating?.tables ?? []).find(t => t.guests.includes(g.id));
    tableSelect.value = currentTable?.id ?? '';
  } else {
    document.getElementById('gm-id').value = '';
    ['gm-name','gm-email','gm-phone','gm-dietary','gm-gift','gm-notes'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('gm-side').value     = 'bride';
    document.getElementById('gm-rsvp').value     = 'pending';
    document.getElementById('gm-party').value    = 1;
    document.getElementById('gm-attended').value = 'pending';
    tableSelect.value = '';
  }

  document.getElementById('gm-save').onclick = saveGuest;
  openModal('guest-modal');
  document.getElementById('gm-name').focus();
}

function saveGuest() {
  const w = getActiveWedding();
  if (!w) return;

  const name  = document.getElementById('gm-name').value.trim();
  const email = document.getElementById('gm-email').value.trim();
  let valid   = true;

  if (!name) {
    document.getElementById('err-name').textContent = 'Name is required';
    valid = false;
  } else {
    document.getElementById('err-name').textContent = '';
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('err-email').textContent = 'Invalid email format';
    valid = false;
  } else {
    document.getElementById('err-email').textContent = '';
  }

  if (!valid) return;

  const existingId = document.getElementById('gm-id').value;
  const gid        = existingId || uuid();
  const isNew      = !existingId;
  const tableId    = document.getElementById('gm-table').value;

  const guestData = {
    id:    gid,
    name,
    email,
    phone:               document.getElementById('gm-phone').value.trim(),
    side:                document.getElementById('gm-side').value,
    rsvpStatus:          document.getElementById('gm-rsvp').value,
    partySize:           Math.max(1, parseInt(document.getElementById('gm-party').value) || 1),
    dietaryRestrictions: document.getElementById('gm-dietary').value.trim(),
    attended:            document.getElementById('gm-attended').value,
    giftAmount:          document.getElementById('gm-gift').value.trim(),
    notes:               document.getElementById('gm-notes').value.trim(),
  };

  updateWedding(w.id, draft => {
    if (!draft.guests) draft.guests = [];

    if (isNew) {
      draft.guests.push(guestData);
    } else {
      const idx = draft.guests.findIndex(g => g.id === gid);
      if (idx >= 0) draft.guests[idx] = guestData;
    }

    ensureSeating(draft);
    // Clear old seat assignment
    draft.seating.tables.forEach(t => { t.guests = t.guests.filter(id => id !== gid); });
    draft.seating.unassigned = draft.seating.unassigned.filter(id => id !== gid);

    if (tableId) {
      const t = draft.seating.tables.find(t => t.id === tableId);
      if (t) {
        if (t.guests.length + guestData.partySize > t.capacity) {
          toast(`⚠ "${t.name}" is now over capacity`, 'warning');
        }
        t.guests.push(gid);
      }
    } else {
      draft.seating.unassigned.push(gid);
    }
  });

  closeModal('guest-modal');
  toast(isNew ? 'Guest added!' : 'Guest updated!', 'success');
  emit('render');
}

function deleteGuest(guestId) {
  if (!guestId) return;
  if (!confirm('Delete this guest? This cannot be undone.')) return;

  const w = getActiveWedding();
  if (!w) return;

  updateWedding(w.id, draft => {
    draft.guests = (draft.guests ?? []).filter(g => g.id !== guestId);
    ensureSeating(draft);
    draft.seating.tables.forEach(t => { t.guests = t.guests.filter(id => id !== guestId); });
    draft.seating.unassigned = draft.seating.unassigned.filter(id => id !== guestId);
  });

  closeModal('guest-modal');
  toast('Guest deleted', 'success');
  emit('render');
}
