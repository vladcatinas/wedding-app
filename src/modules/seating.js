import { esc, toast, uuid } from '../utils.js';
import { getActiveWedding, updateWedding, ensureSeating, syncUnassigned } from '../state.js';

// Guest HTML5 drag state
let dragId   = null;
let dragFrom = null; // tableId or null (unassigned)

// Canvas zoom/pan state — preserved across re-renders
let canvasZoom = 1;
let canvasPanX = 0;
let canvasPanY = 0;

// Canvas pan via mouse drag
let isPanning      = false;
let lastPanX       = 0;
let lastPanY       = 0;

// Table drag (move table around canvas)
let draggingTableId  = null;
let tblDragOffsetX   = 0;
let tblDragOffsetY   = 0;

export function renderSeating(w) {
  ensureSeating(w);
  syncUnassigned(w);

  const gs = w.guests ?? [];
  const ua = w.seating.unassigned.map(id => gs.find(g => g.id === id)).filter(Boolean);

  document.getElementById('content').innerHTML = `
    <div class="section-hdr">
      <span class="section-title">Plan Mese</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-add-table">+ Adaugă Masă</button>
        <button class="btn btn-ghost btn-sm" id="btn-auto-assign">⚡ Alocare Automată</button>
        <button class="btn btn-ghost btn-sm" id="btn-rearrange" title="Re-așază toate mesele într-un grid">↕ Aranjează</button>
      </div>
    </div>

    <div class="seating-layout">
      <div id="seating-canvas"
           style="position:relative;overflow:hidden;height:600px;
                  background:#f0ede8;border-radius:14px;cursor:grab;
                  border:1px solid var(--border)">
        <div id="seating-inner"
             style="position:absolute;transform-origin:0 0;width:3200px;height:2400px;
                    transform:translate(${canvasPanX}px,${canvasPanY}px) scale(${canvasZoom})">
          ${w.seating.tables.map(t => isPrezidiu(t) ? rectTableCard(t, gs) : roundTableCard(t, gs)).join('')}
          ${!w.seating.tables.length ? `
            <div style="position:absolute;top:100px;left:80px;color:#bbb;font-size:14px">
              Nicio masă — apasă "+ Adaugă Masă" pentru a începe.
            </div>` : ''}
        </div>
        <div style="position:absolute;bottom:12px;right:12px;display:flex;gap:4px;
                    background:rgba(255,255,255,0.92);border-radius:8px;padding:4px;
                    box-shadow:0 1px 6px rgba(0,0,0,.12)">
          <button id="zoom-in"    title="Zoom in"  style="${zoomBtnStyle}">+</button>
          <button id="zoom-out"   title="Zoom out" style="${zoomBtnStyle}">−</button>
          <button id="zoom-reset" title="Reset"    style="${zoomBtnStyle};font-size:12px">↺</button>
        </div>
        <div id="zoom-label" style="position:absolute;bottom:12px;left:12px;font-size:11px;
             color:var(--muted);background:rgba(255,255,255,0.8);border-radius:5px;padding:2px 7px">
          ${Math.round(canvasZoom * 100)}%
        </div>
      </div>

      <div class="unassigned-panel" id="unassigned-panel">
        <h3>Neasignați <span style="color:var(--muted);font-weight:400">(${ua.length})</span></h3>
        <input class="search-input" type="search" placeholder="Caută…"
               style="width:100%;margin-bottom:8px" id="ua-search" />
        <div class="unassigned-list" id="ua-list">
          ${ua.map(uaGuest).join('')}
          ${!ua.length
            ? '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">Toți invitații sunt alocați 🎉</div>'
            : ''}
        </div>
      </div>
    </div>`;

  bindSeatingEvents(w);
}

const zoomBtnStyle = 'width:30px;height:30px;border:none;background:transparent;font-size:18px;cursor:pointer;border-radius:5px;line-height:1';

// ── Table type ────────────────────────────────────────────────────────────────
function isPrezidiu(t) {
  return t.name.toLowerCase().includes('prezidiu');
}

// ── Round table ───────────────────────────────────────────────────────────────
function roundTableCard(t, gs) {
  const assigned = t.guests.map(id => gs.find(g => g.id === id)).filter(Boolean);
  const over     = assigned.length > t.capacity;

  const seatH  = 36;
  const seatR  = 130;
  const tableR = 52;
  const W      = (seatR + 56) * 2;
  const cx = W / 2, cy = W / 2;

  const maxByGeom = (W / 2 - seatR - 4) * 2;
  const maxByArc  = Math.floor(2 * Math.PI * seatR / Math.max(t.capacity, 4)) - 8;
  const seatW     = Math.min(100, maxByGeom, maxByArc);

  const seatsHtml = Array.from({ length: t.capacity }, (_, i) => {
    const angle = (i / t.capacity) * 2 * Math.PI - Math.PI / 2;
    const x = (cx + seatR * Math.cos(angle) - seatW / 2).toFixed(1);
    const y = (cy + seatR * Math.sin(angle) - seatH / 2).toFixed(1);
    const g = assigned[i] ?? null;
    return seatDiv(g, t.id, i, seatW, seatH, x, y, true);
  }).join('');

  return tableWrapper(t, over, `
    <div style="position:relative;width:${W}px;height:${W}px">
      <div style="position:absolute;left:${cx - tableR}px;top:${cy - tableR}px;
                  width:${tableR * 2}px;height:${tableR * 2}px;border-radius:50%;
                  background:var(--sage-lt);border:2px solid var(--sage-dk);pointer-events:none"></div>
      ${seatsHtml}
    </div>`);
}

// ── Rectangular table (Prezidiu) ──────────────────────────────────────────────
function rectTableCard(t, gs) {
  const assigned = t.guests.map(id => gs.find(g => g.id === id)).filter(Boolean);
  const over     = assigned.length > t.capacity;

  const seatW = 108, seatH = 34, gap = 6;
  const seats = Array.from({ length: t.capacity }, (_, i) => assigned[i] ?? null);
  const tableW = Math.max(seats.length * (seatW + gap) - gap, 200);

  const seatsRow = seats.map((g, i) =>
    seatDiv(g, t.id, i, seatW, seatH, null, null, false)
  ).join('');

  return tableWrapper(t, over, `
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px">
      <div style="display:flex;gap:${gap}px">${seatsRow}</div>
      <div style="width:${tableW}px;background:var(--sage-lt);border:2px solid var(--sage-dk);
                  border-radius:8px;padding:10px 16px;display:flex;align-items:center;
                  justify-content:space-between">
        <span style="font-weight:700;font-size:13px">${esc(t.name)}</span>
        <span class="tbl-count ${over ? 'over' : ''}">${assigned.length}/${t.capacity}</span>
      </div>
    </div>`);
}

// ── Shared seat div ───────────────────────────────────────────────────────────
function seatDiv(g, tableId, idx, seatW, seatH, x, y, absolute) {
  const pos = absolute
    ? `position:absolute;left:${x}px;top:${y}px;`
    : `flex-shrink:0;`;

  const base = `${pos}width:${seatW}px;height:${seatH}px;border-radius:5px;` +
               `box-sizing:border-box;overflow:hidden;`;

  if (g) {
    const parts = g.name.trim().split(' ');
    const first = esc(parts[0] ?? '');
    const rest  = esc(parts.slice(1).join(' '));
    return `
      <div style="${base}background:#fff;border:1.5px solid var(--sage-dk);cursor:grab;
                  display:flex;align-items:center;gap:3px;padding:0 4px;"
           draggable="true"
           data-guest-id="${g.id}" data-from-table="${tableId}"
           data-seat-index="${idx}" data-seat-table="${tableId}"
           title="${esc(g.name)}">
        <span class="side-dot dot-${g.side ?? 'bride'}" style="flex-shrink:0"></span>
        <span style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;line-height:1.2">
          <span style="font-size:9px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${first}</span>
          ${rest ? `<span style="font-size:8px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rest}</span>` : ''}
        </span>
        <button data-rmv-guest="${g.id}" data-rmv-table="${tableId}"
                style="flex-shrink:0;background:none;border:none;cursor:pointer;
                       padding:0;font-size:8px;color:var(--muted);line-height:1">✕</button>
      </div>`;
  }

  return `
    <div style="${base}background:transparent;border:1.5px dashed #ccc;"
         data-seat-index="${idx}" data-seat-table="${tableId}"></div>`;
}

// ── Table wrapper (canvas-positioned card with draggable header) ───────────────
function tableWrapper(t, over, bodyHtml) {
  return `
    <div class="tbl-card" id="tc-${t.id}" data-table-id="${t.id}"
         style="position:absolute;left:${t.x}px;top:${t.y}px;
                background:none;border:none;box-shadow:none;padding:4px;user-select:none">
      <div data-table-header="${t.id}"
           style="display:flex;align-items:center;gap:6px;margin-bottom:6px;
                  cursor:move;padding:2px 4px;border-radius:5px;
                  background:rgba(255,255,255,0.7)">
        <span style="font-weight:600;font-size:13px">${esc(t.name)}</span>
        <span class="tbl-count ${over ? 'over' : ''}" style="font-size:11px">${t.guests.filter(Boolean).length}/${t.capacity}</span>
        <button class="btn btn-ghost btn-icon" data-edit-table="${t.id}" title="Editează" style="padding:2px 4px">✏️</button>
        <button class="btn btn-danger btn-icon" data-delete-table="${t.id}" title="Șterge" style="padding:2px 4px">🗑</button>
      </div>
      ${bodyHtml}
    </div>`;
}

// ── Unassigned guest chip ─────────────────────────────────────────────────────
function uaGuest(g) {
  return `
    <div class="ua-guest" draggable="true" data-guest-id="${g.id}" data-from-table="">
      <span>
        <span class="side-dot dot-${g.side ?? 'bride'}"></span>
        ${esc(g.name)}
        ${g.partySize > 1 ? `<small style="color:var(--muted)"> +${g.partySize - 1}</small>` : ''}
      </span>
      ${g.dietaryRestrictions ? '<span title="Restricții alimentare" style="font-size:11px">⚠️</span>' : ''}
    </div>`;
}

// ── Bind all events ───────────────────────────────────────────────────────────
function bindSeatingEvents(w) {
  document.getElementById('btn-add-table')?.addEventListener('click', () => addTable(w));
  document.getElementById('btn-auto-assign')?.addEventListener('click', () => autoAssign(w));
  document.getElementById('btn-rearrange')?.addEventListener('click', () => rearrangeTables(w));
  document.getElementById('ua-search')?.addEventListener('input', e => filterUA(w, e.target.value));

  // Delegated clicks (edit, delete, remove-guest)
  document.getElementById('content')?.addEventListener('click', e => {
    const editBtn   = e.target.closest('[data-edit-table]');
    const deleteBtn = e.target.closest('[data-delete-table]');
    const rmvBtn    = e.target.closest('[data-rmv-guest]');
    if (editBtn)   { e.stopPropagation(); editTable(w, editBtn.dataset.editTable); }
    if (deleteBtn) { e.stopPropagation(); deleteTable(w, deleteBtn.dataset.deleteTable); }
    if (rmvBtn)    { e.stopPropagation(); removeFromTable(w, rmvBtn.dataset.rmvGuest, rmvBtn.dataset.rmvTable); }
  });

  // Tap-to-assign (mobile)
  document.getElementById('ua-list')?.addEventListener('click', e => {
    const guest = e.target.closest('[data-guest-id]');
    if (guest && !e.target.closest('button')) tapAssign(w, guest.dataset.guestId);
  });

  bindCanvasEvents(w);
  setupDragAndDrop(w);
}

// ── Canvas zoom / pan / table move ────────────────────────────────────────────
function bindCanvasEvents(w) {
  const canvas = document.getElementById('seating-canvas');
  if (!canvas) return;

  // Wheel zoom
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    canvasZoom = Math.min(3, Math.max(0.2, canvasZoom * factor));
    applyCanvasTransform();
  }, { passive: false });

  // Mousedown: decide table drag vs canvas pan
  canvas.addEventListener('mousedown', e => {
    if (e.target.closest('button, input, [data-guest-id]')) return;

    const header = e.target.closest('[data-table-header]');
    if (header) {
      // Start table drag
      const tableId = header.dataset.tableHeader;
      const tableEl = document.getElementById(`tc-${tableId}`);
      if (!tableEl) return;
      draggingTableId = tableId;
      const canvasRect = canvas.getBoundingClientRect();
      const mouseWorldX = (e.clientX - canvasRect.left - canvasPanX) / canvasZoom;
      const mouseWorldY = (e.clientY - canvasRect.top  - canvasPanY) / canvasZoom;
      tblDragOffsetX = mouseWorldX - parseFloat(tableEl.style.left || 0);
      tblDragOffsetY = mouseWorldY - parseFloat(tableEl.style.top  || 0);
      canvas.style.cursor = 'move';
      e.preventDefault();
      return;
    }

    // Start canvas pan
    isPanning = true;
    lastPanX = e.clientX;
    lastPanY = e.clientY;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (draggingTableId) {
      const canvasEl = document.getElementById('seating-canvas');
      const canvasRect = canvasEl?.getBoundingClientRect();
      if (!canvasRect) return;
      const mouseWorldX = (e.clientX - canvasRect.left - canvasPanX) / canvasZoom;
      const mouseWorldY = (e.clientY - canvasRect.top  - canvasPanY) / canvasZoom;
      const newX = Math.max(0, mouseWorldX - tblDragOffsetX);
      const newY = Math.max(0, mouseWorldY - tblDragOffsetY);
      const el = document.getElementById(`tc-${draggingTableId}`);
      if (el) { el.style.left = newX + 'px'; el.style.top = newY + 'px'; }
      return;
    }
    if (!isPanning) return;
    canvasPanX += e.clientX - lastPanX;
    canvasPanY += e.clientY - lastPanY;
    lastPanX = e.clientX;
    lastPanY = e.clientY;
    applyCanvasTransform();
  });

  window.addEventListener('mouseup', e => {
    if (draggingTableId) {
      // Save final position to state
      const el = document.getElementById(`tc-${draggingTableId}`);
      const x  = parseFloat(el?.style.left) || 0;
      const y  = parseFloat(el?.style.top)  || 0;
      const id = draggingTableId;
      draggingTableId = null;
      updateWedding(getActiveWedding().id, draft => {
        ensureSeating(draft);
        const t = draft.seating.tables.find(t => t.id === id);
        if (t) { t.x = x; t.y = y; }
      });
      document.getElementById('seating-canvas').style.cursor = 'grab';
      return;
    }
    if (isPanning) {
      isPanning = false;
      document.getElementById('seating-canvas').style.cursor = 'grab';
    }
  });

  // Zoom buttons
  document.getElementById('zoom-in')?.addEventListener('click', e => {
    e.stopPropagation();
    canvasZoom = Math.min(3, canvasZoom * 1.2);
    applyCanvasTransform();
  });
  document.getElementById('zoom-out')?.addEventListener('click', e => {
    e.stopPropagation();
    canvasZoom = Math.max(0.2, canvasZoom / 1.2);
    applyCanvasTransform();
  });
  document.getElementById('zoom-reset')?.addEventListener('click', e => {
    e.stopPropagation();
    canvasZoom = 1; canvasPanX = 0; canvasPanY = 0;
    applyCanvasTransform();
  });
}

function applyCanvasTransform() {
  const inner = document.getElementById('seating-inner');
  if (inner) inner.style.transform = `translate(${canvasPanX}px,${canvasPanY}px) scale(${canvasZoom})`;
  const label = document.getElementById('zoom-label');
  if (label) label.textContent = `${Math.round(canvasZoom * 100)}%`;
}

// ── Drag & Drop (guests) ──────────────────────────────────────────────────────
function setupDragAndDrop(w) {
  const content = document.getElementById('content');
  if (!content) return;

  content.addEventListener('dragstart', e => {
    const el = e.target.closest('[data-guest-id]');
    if (!el) return;
    dragId   = el.dataset.guestId;
    dragFrom = el.dataset.fromTable || null;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId);
    requestAnimationFrame(() => el.classList.add('dragging'));
  });

  content.addEventListener('dragend', e => {
    e.target.closest('[data-guest-id]')?.classList.remove('dragging');
  });

  content.addEventListener('dragover', e => {
    const card  = e.target.closest('.tbl-card');
    const panel = e.target.closest('#unassigned-panel');
    if (card)  { e.preventDefault(); card.classList.add('drag-over'); }
    if (panel) e.preventDefault();
  });

  content.addEventListener('dragleave', e => {
    e.target.closest('.tbl-card')?.classList.remove('drag-over');
  });

  content.addEventListener('drop', e => {
    const gid   = dragId ?? e.dataTransfer.getData('text/plain');
    const card  = e.target.closest('.tbl-card');
    const panel = e.target.closest('#unassigned-panel');

    // Check if dropped on a specific seat slot (for reordering)
    const seatSlot = e.target.closest('[data-seat-index]');

    if (card) {
      card.classList.remove('drag-over');
      e.preventDefault();
      const targetTableId = card.dataset.tableId;

      if (seatSlot && seatSlot.dataset.seatTable === dragFrom && dragFrom === targetTableId) {
        // Intra-table reorder
        const srcIdx = parseInt(e.dataTransfer.getData('text/plain') !== gid
          ? 0
          : [...card.querySelectorAll('[data-guest-id]')]
              .findIndex(el => el.dataset.guestId === gid));
        const tgtIdx = parseInt(seatSlot.dataset.seatIndex);
        handleReorder(w, targetTableId, gid, tgtIdx);
      } else {
        handleDropOnTable(w, targetTableId, gid);
      }
    } else if (panel) {
      e.preventDefault();
      handleDropOnUnassigned(w, gid);
    }

    dragId = null; dragFrom = null;
  });
}

// ── Drop handlers ─────────────────────────────────────────────────────────────
function handleDropOnTable(w, tableId, gid) {
  if (!gid) return;
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const table = draft.seating.tables.find(t => t.id === tableId);
    if (!table || table.guests.includes(gid)) return;
    const ps = (draft.guests ?? []).find(g => g.id === gid)?.partySize ?? 1;
    if (table.guests.length + ps > table.capacity) {
      if (!confirm(`"${table.name}" va depăși capacitatea (${table.capacity} locuri). Continui?`)) return;
    }
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

function handleReorder(w, tableId, gid, targetIdx) {
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const table = draft.seating.tables.find(t => t.id === tableId);
    if (!table) return;
    const srcIdx = table.guests.indexOf(gid);
    if (srcIdx === -1) return;
    const clampedTarget = Math.min(targetIdx, table.guests.length - 1);
    table.guests.splice(srcIdx, 1);
    table.guests.splice(clampedTarget, 0, gid);
  });
  renderSeating(getActiveWedding());
}

function handleDropOnUnassigned(w, gid) {
  if (!gid || !dragFrom) return;
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const src = draft.seating.tables.find(t => t.id === dragFrom);
    if (src) src.guests = src.guests.filter(id => id !== gid);
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
  const name = prompt('Numele mesei:', `Masa ${(w.seating?.tables?.length ?? 0) + 1}`);
  if (!name) return;
  const cap = parseInt(prompt('Capacitate (nr. locuri):', '8'));
  if (isNaN(cap) || cap < 1) { toast('Capacitate invalidă', 'error'); return; }
  const newName = name.trim();
  const newIsPrezidiu = newName.toLowerCase().includes('prezidiu');

  updateWedding(w.id, draft => {
    ensureSeating(draft);
    // Find next free slot below existing tables
    const others = draft.seating.tables.filter(t => !isPrezidiu(t));
    let x, y;
    if (newIsPrezidiu) {
      // Stack new prezidiu(s) on top
      const existingPrezidius = draft.seating.tables.filter(isPrezidiu);
      x = 40;
      y = 40 + existingPrezidius.length * 200;
    } else {
      const i = others.length;
      const yStart = 40 + draft.seating.tables.filter(isPrezidiu).length * 200 + (draft.seating.tables.some(isPrezidiu) ? 30 : 0);
      x = 40 + (i % 3) * 480;
      y = yStart + Math.floor(i / 3) * 480;
    }
    draft.seating.tables.push({
      id: uuid(), name: newName, capacity: cap, guests: [], x, y,
    });
  });
  renderSeating(getActiveWedding());
}

function editTable(w, tableId) {
  const t = w.seating?.tables?.find(t => t.id === tableId);
  if (!t) return;
  const name = prompt('Numele mesei:', t.name);
  if (name === null) return;
  const cap = parseInt(prompt('Capacitate (nr. locuri):', t.capacity));
  if (isNaN(cap) || cap < 1) { toast('Capacitate invalidă', 'error'); return; }
  updateWedding(w.id, draft => {
    const tbl = draft.seating.tables.find(t => t.id === tableId);
    if (tbl) { tbl.name = name.trim() || tbl.name; tbl.capacity = cap; }
  });
  renderSeating(getActiveWedding());
}

function deleteTable(w, tableId) {
  const t = w.seating?.tables?.find(t => t.id === tableId);
  if (!t) return;
  if (!confirm(`Ștergi masa "${t.name}"? Invitații revin în lista neasignați.`)) return;
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

function rearrangeTables(w) {
  updateWedding(w.id, draft => {
    ensureSeating(draft);
    const tables = draft.seating.tables;
    const prezidius = tables.filter(isPrezidiu);
    const others    = tables.filter(t => !isPrezidiu(t));

    let yCursor = 40;
    // Prezidiu(s) on top, each on its own row (very wide)
    prezidius.forEach(t => {
      t.x = 40;
      t.y = yCursor;
      // approximate height: header(~30) + seat row(~40) + rect(~50) + gaps
      yCursor += 200;
    });
    if (prezidius.length) yCursor += 30;

    // Round tables in 3-column grid (each ~400×460 with margin)
    const COL_W = 480;
    const ROW_H = 480;
    others.forEach((t, i) => {
      t.x = 40 + (i % 3) * COL_W;
      t.y = yCursor + Math.floor(i / 3) * ROW_H;
    });
  });
  // reset zoom/pan so user sees the new layout
  canvasZoom = 1; canvasPanX = 0; canvasPanY = 0;
  renderSeating(getActiveWedding());
  toast('Mesele au fost re-așezate', 'success');
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
  toast(n ? `${n} invitați alocați automat!` : 'Nu există locuri disponibile.', n ? 'success' : 'error');
}

function tapAssign(w, gid) {
  const tables = w.seating?.tables ?? [];
  if (!tables.length) { toast('Adaugă mai întâi o masă', 'error'); return; }
  const choice = prompt(
    'Alocă la masa:\n' +
    tables.map((t, i) => `${i + 1}. ${t.name} (${t.guests.length}/${t.capacity})`).join('\n') +
    '\n\nIntrodu numărul:'
  );
  if (!choice) return;
  const idx = parseInt(choice) - 1;
  if (isNaN(idx) || idx < 0 || idx >= tables.length) { toast('Selecție invalidă', 'error'); return; }
  dragFrom = null;
  handleDropOnTable(w, tables[idx].id, gid);
}

function filterUA(w, query) {
  const gs = w.guests ?? [];
  ensureSeating(w);
  const ua = w.seating.unassigned
    .map(id => gs.find(g => g.id === id))
    .filter(Boolean)
    .filter(g => !query || g.name.toLowerCase().includes(query.toLowerCase()));
  const list = document.getElementById('ua-list');
  if (!list) return;
  list.innerHTML = ua.map(uaGuest).join('') ||
    '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">Niciun rezultat</div>';
}
