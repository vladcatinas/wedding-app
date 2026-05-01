import { esc, toast, uuid } from '../utils.js';
import { getActiveWedding, updateWedding, ensureSeating, syncUnassigned, saveState } from '../state.js';

let dragId   = null;
let dragFrom = null; // null = from unassigned panel, otherwise tableId

export function renderSeating(w) {
  ensureSeating(w);
  syncUnassigned(w);

  const gs = w.guests ?? [];
  const ua = w.seating.unassigned.map(id => gs.find(g => g.id === id)).filter(Boolean);

  document.getElementById('content').innerHTML = `
    <div class="section-hdr">
      <span class="section-title">Seating Chart</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-add-table">+ Add Table</button>
        <button class="btn btn-ghost btn-sm" id="btn-auto-assign">⚡ Auto-Assign</button>
      </div>
    </div>

    <div class="seating-layout">
      <div class="tables-grid" id="tables-grid">
        ${w.seating.tables.map(t => tableCard(t, gs)).join('')}
        ${!w.seating.tables.length
          ? `<div class="card" style="text-align:center;padding:40px;color:var(--muted);grid-column:1/-1">
               No tables yet — click "+ Add Table" to start.
             </div>`
          : ''}
      </div>

      <div class="unassigned-panel" id="unassigned-panel">
        <h3>Unassigned <span style="color:var(--muted);font-weight:400">(${ua.length})</span></h3>
        <input class="search-input" type="search" placeholder="Search…"
               style="width:100%;margin-bottom:8px" id="ua-search" />
        <div class="unassigned-list" id="ua-list">
          ${ua.map(uaGuest).join('')}
          ${!ua.length
            ? '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">All guests assigned 🎉</div>'
            : ''}
        </div>
      </div>
    </div>`;

  bindSeatingEvents(w);
}

// ── Sub-renderers ─────────────────────────────────────────────────────────────
function tableCard(t, gs) {
  const assigned = t.guests.map(id => gs.find(g => g.id === id)).filter(Boolean);
  const over     = assigned.length > t.capacity;

  return `
    <div class="tbl-card" id="tc-${t.id}"
         data-table-id="${t.id}">
      <div class="tbl-hdr">
        <span class="tbl-name">${esc(t.name)}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="tbl-count ${over ? 'over' : ''}">${assigned.length}/${t.capacity}</span>
          <button class="btn btn-ghost btn-icon" data-edit-table="${t.id}" title="Edit">✏️</button>
          <button class="btn btn-danger btn-icon" data-delete-table="${t.id}" title="Delete">🗑</button>
        </div>
      </div>
      <div class="tbl-guests" id="tg-${t.id}">
        ${assigned.map(g => `
          <div class="seat-guest" draggable="true" data-guest-id="${g.id}" data-from-table="${t.id}">
            <span>
              <span class="side-dot dot-${g.side ?? 'bride'}"></span>
              ${esc(g.name)}
              ${g.partySize > 1 ? `<small style="color:var(--muted)"> +${g.partySize - 1}</small>` : ''}
            </span>
            <button class="seat-rmv" data-rmv-guest="${g.id}" data-rmv-table="${t.id}">✕</button>
          </div>`).join('')}
        ${!assigned.length ? '<div class="seat-drop-hint">Drop guests here</div>' : ''}
      </div>
    </div>`;
}

function uaGuest(g) {
  return `
    <div class="ua-guest" draggable="true" data-guest-id="${g.id}" data-from-table="">
      <span>
        <span class="side-dot dot-${g.side ?? 'bride'}"></span>
        ${esc(g.name)}
        ${g.partySize > 1 ? `<small style="color:var(--muted)"> +${g.partySize - 1}</small>` : ''}
      </span>
      ${g.dietaryRestrictions ? '<span title="Dietary restrictions" style="font-size:11px">⚠️</span>' : ''}
    </div>`;
}

// ── Event binding ─────────────────────────────────────────────────────────────
function bindSeatingEvents(w) {
  // Button actions
  document.getElementById('btn-add-table')?.addEventListener('click', () => addTable(w));
  document.getElementById('btn-auto-assign')?.addEventListener('click', () => autoAssign(w));

  // UA search
  document.getElementById('ua-search')?.addEventListener('input', e => {
    filterUA(w, e.target.value);
  });

  // Delegated clicks on table grid
  const grid = document.getElementById('tables-grid');
  grid?.addEventListener('click', e => {
    const editBtn   = e.target.closest('[data-edit-table]');
    const deleteBtn = e.target.closest('[data-delete-table]');
    const rmvBtn    = e.target.closest('[data-rmv-guest]');

    if (editBtn)   editTable(w, editBtn.dataset.editTable);
    if (deleteBtn) deleteTable(w, deleteBtn.dataset.deleteTable);
    if (rmvBtn)    removeFromTable(w, rmvBtn.dataset.rmvGuest, rmvBtn.dataset.rmvTable);
  });

  // Tap-to-assign on mobile (UA list click)
  document.getElementById('ua-list')?.addEventListener('click', e => {
    const guest = e.target.closest('[data-guest-id]');
    if (guest && !e.target.closest('button')) tapAssign(w, guest.dataset.guestId);
  });

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  setupDragAndDrop(w);
}

function setupDragAndDrop(w) {
  const content = document.getElementById('content');
  if (!content) return;

  // dragstart (bubbled from any draggable)
  content.addEventListener('dragstart', e => {
    const el = e.target.closest('[data-guest-id]');
    if (!el) return;
    dragId   = el.dataset.guestId;
    dragFrom = el.dataset.fromTable || null; // '' = unassigned
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId);
    requestAnimationFrame(() => el.classList.add('dragging'));
  });

  content.addEventListener('dragend', e => {
    e.target.closest('[data-guest-id]')?.classList.remove('dragging');
  });

  // Table cards: dragover / dragleave / drop
  content.addEventListener('dragover', e => {
    const card = e.target.closest('.tbl-card');
    if (card) { e.preventDefault(); card.classList.add('drag-over'); }
    const panel = e.target.closest('#unassigned-panel');
    if (panel) e.preventDefault();
  });

  content.addEventListener('dragleave', e => {
    e.target.closest('.tbl-card')?.classList.remove('drag-over');
  });

  content.addEventListener('drop', e => {
    const card  = e.target.closest('.tbl-card');
    const panel = e.target.closest('#unassigned-panel');

    if (card) {
      card.classList.remove('drag-over');
      e.preventDefault();
      handleDropOnTable(w, card.dataset.tableId, dragId ?? e.dataTransfer.getData('text/plain'));
    } else if (panel) {
      e.preventDefault();
      handleDropOnUnassigned(w, dragId ?? e.dataTransfer.getData('text/plain'));
    }

    dragId = null; dragFrom = null;
  });
}

// ── Drop logic ────────────────────────────────────────────────────────────────
function handleDropOnTable(w, tableId, gid) {
  if (!gid) return;
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const table = draft.seating.tables.find(t => t.id === tableId);
    if (!table || table.guests.includes(gid)) return;

    const guest = (draft.guests ?? []).find(g => g.id === gid);
    const ps    = guest?.partySize ?? 1;

    if (table.guests.length + ps > table.capacity) {
      if (!confirm(`"${table.name}" will exceed capacity (${table.capacity}). Continue?`)) return;
    }

    // Remove from source
    if (dragFrom) {
      const src = draft.seating.tables.find(t => t.id === dragFrom);
      if (src) src.guests = src.guests.filter(id => id !== gid);
    } else {
      draft.seating.unassigned = draft.seating.unassigned.filter(id => id !== gid);
    }

    table.guests.push(gid);
  });

  renderSeating(getActiveWedding());
}

function handleDropOnUnassigned(w, gid) {
  if (!gid || !dragFrom) return; // already unassigned
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    if (dragFrom) {
      const src = draft.seating.tables.find(t => t.id === dragFrom);
      if (src) src.guests = src.guests.filter(id => id !== gid);
    }
    if (!draft.seating.unassigned.includes(gid)) draft.seating.unassigned.push(gid);
  });
  renderSeating(getActiveWedding());
}

function removeFromTable(w, gid, tableId) {
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const t = draft.seating.tables.find(t => t.id === tableId);
    if (t) t.guests = t.guests.filter(id => id !== gid);
    if (!draft.seating.unassigned.includes(gid)) draft.seating.unassigned.push(gid);
  });
  renderSeating(getActiveWedding());
}

// ── Table management ──────────────────────────────────────────────────────────
function addTable(w) {
  const name = prompt('Table name:', `Table ${(w.seating?.tables?.length ?? 0) + 1}`);
  if (!name) return;
  const cap = parseInt(prompt('Capacity:', '8'));
  if (isNaN(cap) || cap < 1) { toast('Invalid capacity', 'error'); return; }
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    draft.seating.tables.push({ id: uuid(), name: name.trim(), capacity: cap, guests: [] });
  });
  renderSeating(getActiveWedding());
}

function editTable(w, tableId) {
  const t = w.seating?.tables?.find(t => t.id === tableId);
  if (!t) return;
  const name = prompt('Table name:', t.name);
  if (name === null) return;
  const cap = parseInt(prompt('Capacity:', t.capacity));
  if (isNaN(cap) || cap < 1) { toast('Invalid capacity', 'error'); return; }
  updateWedding(w.id, draft => {
    const tbl = draft.seating.tables.find(t => t.id === tableId);
    if (tbl) { tbl.name = name.trim() || tbl.name; tbl.capacity = cap; }
  });
  renderSeating(getActiveWedding());
}

function deleteTable(w, tableId) {
  const t = w.seating?.tables?.find(t => t.id === tableId);
  if (!t) return;
  if (!confirm(`Delete "${t.name}"? Guests will return to Unassigned.`)) return;
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const tbl = draft.seating.tables.find(t => t.id === tableId);
    if (tbl) {
      tbl.guests.forEach(gid => {
        if (!draft.seating.unassigned.includes(gid)) draft.seating.unassigned.push(gid);
      });
      draft.seating.tables = draft.seating.tables.filter(t => t.id !== tableId);
    }
  });
  renderSeating(getActiveWedding());
}

function autoAssign(w) {
  let n = 0;
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    [...draft.seating.unassigned].forEach(gid => {
      const t = draft.seating.tables.find(t => t.guests.length < t.capacity);
      if (t) { t.guests.push(gid); draft.seating.unassigned = draft.seating.unassigned.filter(id => id !== gid); n++; }
    });
  });
  renderSeating(getActiveWedding());
  toast(n ? `Auto-assigned ${n} guests!` : 'No space available in tables.', n ? 'success' : 'error');
}

function tapAssign(w, gid) {
  const tables = w.seating?.tables ?? [];
  if (!tables.length) { toast('Add a table first', 'error'); return; }
  const choice = prompt(
    'Assign to table:\n' +
    tables.map((t, i) => `${i + 1}. ${t.name} (${t.guests.length}/${t.capacity})`).join('\n') +
    '\n\nEnter number:'
  );
  if (!choice) return;
  const idx = parseInt(choice) - 1;
  if (isNaN(idx) || idx < 0 || idx >= tables.length) { toast('Invalid selection', 'error'); return; }
  dragFrom = null;
  handleDropOnTable(w, tables[idx].id, gid);
}

function filterUA(w, query) {
  ensureSeating(w);
  const gs = w.guests ?? [];
  const ua = w.seating.unassigned
    .map(id => gs.find(g => g.id === id))
    .filter(Boolean)
    .filter(g => !query || g.name.toLowerCase().includes(query.toLowerCase()));

  const list = document.getElementById('ua-list');
  if (!list) return;
  list.innerHTML = ua.map(uaGuest).join('') ||
    '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">No matches</div>';

  // Re-bind drag on new elements (events bubble to content, already bound)
}
