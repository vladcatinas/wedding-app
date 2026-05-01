import { esc, daysUntil, formatDate } from '../utils.js';
import { emit } from '../events.js';
import { ensureBudget } from '../state.js';
import { openGuestModal }  from '../components/guestModal.js';
import { openImportModal } from '../components/importModal.js';

export function renderDashboard(w) {
  const gs        = w.guests ?? [];
  const confirmed = gs.filter(g => g.rsvpStatus === 'confirmed').length;
  const declined  = gs.filter(g => g.rsvpStatus === 'declined').length;
  const pending   = gs.filter(g => g.rsvpStatus === 'pending').length;
  const maybe     = gs.filter(g => g.rsvpStatus === 'maybe').length;
  const total     = gs.length;

  const tables   = w.seating?.tables ?? [];
  const assigned = gs.filter(g => tables.some(t => t.guests.includes(g.id))).length;

  const days     = daysUntil(w.date);
  const cc       = days === null ? '' : days <= 30 ? 'red' : days <= 90 ? 'yellow' : 'green';
  const rsvpPct  = total ? Math.round((confirmed / total) * 100) : 0;
  const seatPct  = total ? Math.round((assigned  / total) * 100) : 0;

  // Budget summary (RO structure: vendors with avans + rest)
  ensureBudget(w);
  let totalRon = 0, paidRon = 0;
  for (const v of (w.budget.vendors || [])) {
    totalRon += (v.avansRon || 0) + (v.restRon || 0);
    if (v.avansPaid) paidRon += v.avansRon || 0;
    if (v.restPaid)  paidRon += v.restRon  || 0;
  }
  const unpaidRon = Math.max(0, totalRon - paidRon);
  const budgetPct = totalRon ? Math.min(100, Math.round((paidRon / totalRon) * 100)) : 0;

  document.getElementById('content').innerHTML = `
    <div class="countdown ${cc}">
      <div class="days">${days !== null ? days : '—'}</div>
      <div class="sub">days until ${esc(w.couple.partner1)} &amp; ${esc(w.couple.partner2)}'s wedding</div>
      <div class="meta">${formatDate(w.date)}${w.location ? ' · ' + esc(w.location) : ''}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="lbl">Total Guests</div><div class="val">${total}</div></div>
      <div class="stat-card"><div class="lbl">Confirmed</div><div class="val c-confirmed">${confirmed}</div></div>
      <div class="stat-card"><div class="lbl">Declined</div><div class="val c-declined">${declined}</div></div>
      <div class="stat-card"><div class="lbl">Pending</div><div class="val c-pending">${pending}</div></div>
      <div class="stat-card"><div class="lbl">Maybe</div><div class="val c-maybe">${maybe}</div></div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="prog-lbl"><span>RSVP Progress</span><span>${confirmed} / ${total} confirmed (${rsvpPct}%)</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${rsvpPct}%"></div></div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="prog-lbl"><span>Seating Progress</span><span>${assigned} / ${total} assigned (${seatPct}%)</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${seatPct}%;background:var(--primary)"></div></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="prog-lbl">
        <span>Buget — Plătit / Total</span>
        <span>${fmtRon(paidRon)} / ${fmtRon(totalRon)} ${totalRon ? `(${budgetPct}%)` : ''}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${budgetPct}%;background:var(--gold)"></div></div>
      ${unpaidRon > 0 ? `<div style="font-size:12px;color:var(--muted);margin-top:6px">De plătit: <strong>${fmtRon(unpaidRon)}</strong></div>` : ''}
    </div>

    <div class="card">
      <strong style="display:block;margin-bottom:12px">Quick Actions</strong>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary"   id="dash-add-guest">+ Add Guest</button>
        <button class="btn btn-secondary" id="dash-guests">View Guests</button>
        <button class="btn btn-secondary" id="dash-seating">Manage Seating</button>
        <button class="btn btn-secondary" id="dash-budget">💰 Bugetul Nunții</button>
        <button class="btn btn-sage"      id="dash-import">⬆ Import Guest List</button>
      </div>
    </div>`;

  document.getElementById('dash-add-guest')?.addEventListener('click', () => openGuestModal());
  document.getElementById('dash-guests')?.addEventListener('click',    () => emit('navigate', 'guests'));
  document.getElementById('dash-seating')?.addEventListener('click',   () => emit('navigate', 'seating'));
  document.getElementById('dash-budget')?.addEventListener('click',    () => emit('navigate', 'budget'));
  document.getElementById('dash-import')?.addEventListener('click',    () => openImportModal());
}

function fmtRon(n) {
  const v = Number(n) || 0;
  return `${v.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei`;
}
