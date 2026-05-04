import { esc, cap, toast } from '../utils.js';
import { emit } from '../events.js';
import { clearAllGuests } from '../state.js';
import { openGuestModal }  from '../components/guestModal.js';
import { openImportModal } from '../components/importModal.js';

const PER_PAGE = 25;

// module-level filter state
let search = '';
let rsvpFilter = '';
let sideFilter = '';
let page = 1;

export function resetGuestFilters() {
  search = ''; rsvpFilter = ''; sideFilter = ''; page = 1;
}

export function renderGuests(w) {
  const gs = w.guests ?? [];

  const filtered = gs.filter(g => {
    const q = search.toLowerCase();
    return (
      (!q || g.name.toLowerCase().includes(q) || (g.email ?? '').toLowerCase().includes(q) || (g.phone ?? '').includes(q))
      && (!rsvpFilter || g.rsvpStatus === rsvpFilter)
      && (!sideFilter || g.side === sideFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (page > totalPages) page = 1;
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  document.getElementById('content').innerHTML = `
    <div class="section-hdr">
      <span class="section-title">
        Guest List <span class="count">(${gs.length})</span>
      </span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sage btn-sm" id="btn-import-guests">⬆ Import CSV</button>
        <button class="btn btn-primary" id="btn-add-guest-list">+ Add Guest</button>
        ${gs.length ? `<button class="btn btn-danger btn-sm" id="btn-delete-all-guests">🗑 Delete All Guests</button>` : ''}
      </div>
    </div>

    <div class="toolbar">
      <input class="search-input" type="search" placeholder="Search by name, email, phone…"
             value="${esc(search)}" id="guest-search" />
      <select class="filter-sel" id="guest-rsvp-filter">
        <option value="">All RSVP</option>
        <option value="confirmed" ${rsvpFilter === 'confirmed' ? 'selected' : ''}>Confirmed</option>
        <option value="declined"  ${rsvpFilter === 'declined'  ? 'selected' : ''}>Declined</option>
        <option value="pending"   ${rsvpFilter === 'pending'   ? 'selected' : ''}>Pending</option>
        <option value="maybe"     ${rsvpFilter === 'maybe'     ? 'selected' : ''}>Maybe</option>
      </select>
      <select class="filter-sel" id="guest-side-filter">
        <option value="">All Sides</option>
        <option value="bride"  ${sideFilter === 'bride'  ? 'selected' : ''}>Bride's</option>
        <option value="groom"  ${sideFilter === 'groom'  ? 'selected' : ''}>Groom's</option>
        <option value="common" ${sideFilter === 'common' ? 'selected' : ''}>Common</option>
      </select>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Side</th><th>RSVP</th>
            <th>Party</th><th>Dietary</th><th>Table</th>
            <th>Came?</th><th>Gift</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${slice.length
            ? slice.map(g => guestRow(g, w)).join('')
            : '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--muted)">No guests found</td></tr>'
          }
        </tbody>
      </table>
    </div>

    ${totalPages > 1 ? `
      <div class="pagination">
        <button class="pg-btn" id="pg-prev" ${page <= 1 ? 'disabled' : ''}>← Prev</button>
        <span class="pg-info">Page ${page} of ${totalPages} · ${filtered.length} guests</span>
        <button class="pg-btn" id="pg-next" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
      </div>` : ''}`;

  // ── Wire events ────────────────────────────────────────────────────────────
  document.getElementById('guest-search')?.addEventListener('input', e => {
    search = e.target.value; page = 1;
    renderGuests(w);
    document.getElementById('guest-search')?.focus();
  });

  document.getElementById('guest-rsvp-filter')?.addEventListener('change', e => {
    rsvpFilter = e.target.value; page = 1;
    renderGuests(w);
  });

  document.getElementById('guest-side-filter')?.addEventListener('change', e => {
    sideFilter = e.target.value; page = 1;
    renderGuests(w);
  });

  document.getElementById('pg-prev')?.addEventListener('click', () => { page--; renderGuests(w); });
  document.getElementById('pg-next')?.addEventListener('click', () => { page++; renderGuests(w); });

  document.getElementById('btn-add-guest-list')?.addEventListener('click', () => openGuestModal());
  document.getElementById('btn-import-guests')?.addEventListener('click',  () => openImportModal());

  document.getElementById('btn-delete-all-guests')?.addEventListener('click', () => {
    const count = gs.length;
    if (!confirm(
      `⚠ Delete ALL ${count} guests from this wedding?\n\n` +
      `This will also clear seating assignments. Cannot be undone.`
    )) return;
    if (!confirm('Are you absolutely sure? Type-OK by clicking OK once more.')) return;
    clearAllGuests(w.id);
    toast(`Deleted ${count} guests`, 'success');
    emit('render');
  });

  // Edit buttons (event delegation on tbody)
  document.querySelector('tbody')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-edit-guest]');
    if (btn) openGuestModal(btn.dataset.editGuest);
  });
}

function sideLabel(side) {
  if (side === 'groom')  return "Groom's";
  if (side === 'common') return 'Common';
  return "Bride's";
}

function attendedBadge(a) {
  if (a === 'yes') return '<span class="badge b-confirmed">✓ Yes</span>';
  if (a === 'no')  return '<span class="badge b-declined">✗ No</span>';
  return '<span style="color:var(--muted);font-size:12px">—</span>';
}

function guestRow(g, w) {
  const tbl = (w.seating?.tables ?? []).find(t => t.guests.includes(g.id));
  return `
    <tr>
      <td>
        <strong>${esc(g.name)}</strong>
        ${g.email ? `<br><span style="font-size:11px;color:var(--muted)">${esc(g.email)}</span>` : ''}
      </td>
      <td><span class="badge b-${g.side ?? 'bride'}">${sideLabel(g.side)}</span></td>
      <td><span class="badge b-${g.rsvpStatus ?? 'pending'}">${cap(g.rsvpStatus ?? 'pending')}</span></td>
      <td style="text-align:center">${g.partySize ?? 1}</td>
      <td style="font-size:12px;color:var(--muted)">${esc(g.dietaryRestrictions) || '—'}</td>
      <td style="font-size:13px">${tbl ? esc(tbl.name) : '<span style="color:var(--muted)">Unassigned</span>'}</td>
      <td>${attendedBadge(g.attended)}</td>
      <td style="font-size:13px;font-weight:600">${esc(g.giftAmount) || '<span style="color:var(--muted);font-weight:400">—</span>'}</td>
      <td><button class="btn btn-ghost btn-sm" data-edit-guest="${g.id}">Edit</button></td>
    </tr>`;
}
