import { esc, uuid, toast } from '../utils.js';
import { emit } from '../events.js';
import {
  getActiveWedding, updateWedding, ensureBudget,
  getDefaultVendors, getPerPersonKeys,
} from '../state.js';

export function renderBudget(w) {
  ensureBudget(w);
  // Persist defaults if just initialized
  updateWedding(w.id, () => {});

  const b      = w.budget;
  const rate   = Number(b.exchangeRate) || 5;
  const guestCount = b.guestCount != null ? b.guestCount : (w.guests?.length ?? 0);

  // ── Totals (uses effective rest values for linked vendors) ─────────────────
  const t = computeTotals(b, guestCount);
  const ppKeys = getPerPersonKeys();

  // Cost / invitat = total nuntă ÷ număr invitați
  const costPerGuestRon = guestCount > 0 ? t.totalRon / guestCount : 0;
  const costPerGuestEur = guestCount > 0 ? t.totalEur / guestCount : 0;

  document.getElementById('content').innerHTML = `
    <div class="section-hdr">
      <span class="section-title">💰 Bugetul Nunții</span>
      <div class="bud-globals">
        <label>Curs: 1 EUR =
          <input type="number" id="bud-rate" value="${rate}" step="0.01" min="0.01" style="width:80px" />
          RON
        </label>
        <label>Invitați:
          <input type="number" id="bud-guests" value="${guestCount}" min="0" style="width:90px"
                 placeholder="auto" title="Lasă gol pentru a folosi numărul real din lista de invitați" />
        </label>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="bud-summary">
      <div class="bud-card bud-card-total">
        <div class="bud-card-lbl">Cost Total Nuntă</div>
        <div class="bud-card-val">${fmtRon(t.totalRon)}</div>
        <div class="bud-card-sub">≈ ${fmtEur(t.totalEur)}</div>
      </div>
      <div class="bud-card bud-card-perguest">
        <div class="bud-card-lbl">💵 Cost / Invitat</div>
        <div class="bud-card-val">${fmtRon(costPerGuestRon)}</div>
        <div class="bud-card-sub">≈ ${fmtEur(costPerGuestEur)} · ${guestCount} invitați</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">Plătit</div>
        <div class="bud-card-val c-confirmed">${fmtRon(t.paidRon)}</div>
        <div class="bud-card-sub">${fmtEur(t.paidEur)}</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">Rămas de Plătit</div>
        <div class="bud-card-val ${t.unpaidRon>0?'c-pending':''}">${fmtRon(t.unpaidRon)}</div>
        <div class="bud-card-sub">${fmtEur(t.unpaidEur)}</div>
      </div>
    </div>

    ${guestCount === 0 ? `
      <div class="card" style="background:var(--yellow);background:#fef3e2;border-color:var(--yellow);padding:10px 14px;font-size:13px;color:#a07030;margin-bottom:14px">
        ⚠ <strong>Setează numărul de invitați</strong> (sus dreapta) pentru ca furnizorii legați (Restaurant, Invitații, Monoporții, Candy Bar, Mărturii) să își calculeze automat Rest plată.
      </div>
    ` : ''}

    <!-- Vendors table -->
    <div class="card" style="padding:0;margin-bottom:20px;overflow:hidden">
      <div style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);background:var(--sage-lt)">
        <strong style="font-size:15px">Furnizori &amp; Costuri <span style="color:var(--muted);font-weight:400">(${b.vendors.length})</span></strong>
        <button class="btn btn-primary btn-sm" id="bud-add-vendor">+ Adaugă Furnizor Personalizat</button>
      </div>
      <div style="overflow-x:auto">
        <table class="bud-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Furnizor</th>
              <th colspan="2" class="bud-th-grp avans">Avans (până la nuntă)</th>
              <th colspan="2" class="bud-th-grp rest">Rest plată (după nuntă)</th>
              <th>Plătit</th>
              <th></th>
            </tr>
            <tr>
              <th></th><th></th>
              <th class="bud-sub avans">RON</th><th class="bud-sub avans">EUR</th>
              <th class="bud-sub rest">RON</th><th class="bud-sub rest">EUR</th>
              <th></th><th></th>
            </tr>
          </thead>
          <tbody>
            ${b.vendors.map((v, i) => vendorRow(v, i, b, guestCount, ppKeys)).join('')}
            <tr class="bud-totals-row">
              <td></td>
              <td><strong>TOTAL</strong></td>
              <td class="bud-cell avans"><strong>${fmtNum(t.avansRon)}</strong></td>
              <td class="bud-cell avans"><strong>${fmtNum(t.avansEur)}</strong></td>
              <td class="bud-cell rest"><strong>${fmtNum(t.restRon)}</strong></td>
              <td class="bud-cell rest"><strong>${fmtNum(t.restEur)}</strong></td>
              <td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Per-person + Gift -->
    <div class="bud-bottom-grid">
      <!-- Per-person prices -->
      <div class="card">
        <strong style="display:block;margin-bottom:14px;font-size:15px">📊 Prețuri / Persoană</strong>
        <table class="bud-pp-table">
          <thead><tr><th></th><th>RON</th><th>EUR</th><th>× ${guestCount} pers.</th></tr></thead>
          <tbody>
            ${ppKeys.map(({key, label}) => perPersonRow(b, key, label, guestCount)).join('')}
            <tr class="bud-totals-row">
              <td><strong>Total / persoană</strong></td>
              <td class="bud-cell"><strong>${fmtNum(t.perPersonRon)}</strong></td>
              <td class="bud-cell"><strong>${fmtNum(t.perPersonEur)}</strong></td>
              <td class="bud-cell"><strong>${fmtRon(t.perPersonRon * guestCount)}</strong></td>
            </tr>
          </tbody>
        </table>
        <p style="font-size:11px;color:var(--muted);margin-top:8px">🔗 Modificările se propagă automat la furnizorii legați (Restaurant, Invitații, Monoporții, Candy Bar, Mărturii) — Rest plată al lor se recalculează: <code>preț × ${guestCount} invitați</code>.</p>
      </div>

      <!-- Gift income -->
      <div class="card">
        <strong style="display:block;margin-bottom:14px;font-size:15px">🎁 "Dar" (cadou) per persoană</strong>
        <table class="bud-pp-table">
          <thead><tr><th></th><th>EUR</th><th>× ${guestCount} pers.</th></tr></thead>
          <tbody>
            <tr>
              <td>Dar așteptat / persoană</td>
              <td class="bud-cell"><input type="number" data-gift-cur="eur" value="${b.giftPerPerson.eur || ''}" step="10" min="0" placeholder="0" /></td>
              <td class="bud-cell" style="color:var(--muted)">${fmtEur((b.giftPerPerson.eur || 0) * guestCount)}</td>
            </tr>
            <tr>
              <td>Dar minim / persoană</td>
              <td class="bud-cell"><input type="number" data-gift-min-cur="eur" value="${b.giftMinPerPerson.eur || ''}" step="10" min="0" placeholder="0" /></td>
              <td class="bud-cell" style="color:var(--muted)">${fmtEur((b.giftMinPerPerson.eur || 0) * guestCount)}</td>
            </tr>
            <tr>
              <td>Medie dar / persoană</td>
              <td class="bud-cell"><input type="number" data-gift-avg-cur="eur" value="${b.giftAvgPerPerson.eur || ''}" step="10" min="0" placeholder="0" /></td>
              <td class="bud-cell" style="color:var(--muted)">${fmtEur((b.giftAvgPerPerson.eur || 0) * guestCount)}</td>
            </tr>
          </tbody>
        </table>

        ${(() => {
          const avgTotal  = (b.giftAvgPerPerson.eur || 0) * guestCount;
          const minTotal  = (b.giftMinPerPerson.eur || 0) * guestCount;
          const expTotal  = (b.giftPerPerson.eur || 0) * guestCount;
          const profitAvg = avgTotal - t.totalEur;
          const profitMin = minTotal - t.totalEur;
          const profitExp = expTotal - t.totalEur;
          const hasAvg    = b.giftAvgPerPerson.eur > 0;
          const hasMin    = b.giftMinPerPerson.eur > 0;

          const row = (label, profit) => {
            const positive = profit >= 0;
            return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
              <span style="color:var(--muted);font-size:12px">${label}</span>
              <strong class="${positive ? 'c-confirmed' : 'c-declined'}">${positive ? '+' : ''}${fmtEur(profit)}</strong>
            </div>`;
          };

          return `
          <div style="margin-top:14px;padding:12px;background:var(--sage-lt);border-radius:8px;font-size:13px">
            <strong style="display:block;margin-bottom:8px">📊 Profit estimat</strong>
            ${row('Scenariu așteptat', profitExp)}
            ${hasMin ? row('Scenariu minim', profitMin) : ''}
            ${hasAvg ? row('Scenariu medie', profitAvg) : ''}
          </div>`;
        })()}
      </div>
    </div>
  `;

  wireEvents(w, b);
}

// ── Wire all input/button events ──────────────────────────────────────────────
function wireEvents(w, b) {
  document.getElementById('bud-rate')?.addEventListener('change', e => {
    const v = Math.max(0.01, parseFloat(e.target.value) || 5);
    updateWedding(w.id, draft => { ensureBudget(draft); draft.budget.exchangeRate = v; });
    emit('render');
  });

  document.getElementById('bud-guests')?.addEventListener('change', e => {
    const raw = e.target.value.trim();
    const v   = raw === '' ? null : Math.max(0, parseInt(raw) || 0);
    updateWedding(w.id, draft => { ensureBudget(draft); draft.budget.guestCount = v; });
    emit('render');
  });

  // Add custom vendor
  document.getElementById('bud-add-vendor')?.addEventListener('click', () => addVendor(w));

  // Vendor cell editing — auto-convert RON ↔ EUR
  document.querySelectorAll('[data-vendor-cell]').forEach(inp => {
    inp.addEventListener('change', e => {
      const { vendorCell, vendorId, vendorField } = e.target.dataset;
      const value = Math.max(0, parseFloat(e.target.value) || 0);

      updateWedding(w.id, draft => {
        ensureBudget(draft);
        const v = draft.budget.vendors.find(x => x.id === vendorId);
        if (!v) return;
        const r = draft.budget.exchangeRate || 5;

        v[vendorField] = value;
        if (vendorCell === 'ron') {
          const eurField = vendorField.replace('Ron', 'Eur');
          v[eurField] = +(value / r).toFixed(2);
        } else {
          const ronField = vendorField.replace('Eur', 'Ron');
          v[ronField] = +(value * r).toFixed(2);
        }
      });
      emit('render');
    });
  });

  // Vendor label rename
  document.querySelectorAll('[data-vendor-label]').forEach(el => {
    el.addEventListener('change', e => {
      const id = e.target.dataset.vendorLabel;
      updateWedding(w.id, draft => {
        const v = draft.budget.vendors.find(x => x.id === id);
        if (v) v.label = e.target.value.trim() || v.label;
      });
    });
  });

  // Per-person link selector
  document.querySelectorAll('[data-vendor-pp-link]').forEach(sel => {
    sel.addEventListener('change', e => {
      const id = e.target.dataset.vendorPpLink;
      const newKey = e.target.value || null;
      updateWedding(w.id, draft => {
        const v = draft.budget.vendors.find(x => x.id === id);
        if (v) v.perPersonKey = newKey;
      });
      emit('render');
    });
  });

  // Paid toggles
  document.querySelectorAll('[data-paid-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const { paidToggle, vendorId } = btn.dataset;
      updateWedding(w.id, draft => {
        const v = draft.budget.vendors.find(x => x.id === vendorId);
        if (!v) return;
        if (paidToggle === 'avans') v.avansPaid = !v.avansPaid;
        else if (paidToggle === 'rest') v.restPaid = !v.restPaid;
      });
      emit('render');
    });
  });

  // Delete vendor
  document.querySelectorAll('[data-vendor-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.vendorDelete;
      const v = b.vendors.find(x => x.id === id);
      if (!v) return;
      if (!confirm(`Ștergi furnizorul "${v.label}"?`)) return;
      updateWedding(w.id, draft => {
        draft.budget.vendors = draft.budget.vendors.filter(x => x.id !== id);
      });
      toast('Furnizor șters', 'success');
      emit('render');
    });
  });

  // Per-person editing
  document.querySelectorAll('[data-pp-cell]').forEach(inp => {
    inp.addEventListener('change', e => {
      const { ppCell, ppKey } = e.target.dataset;
      const value = Math.max(0, parseFloat(e.target.value) || 0);
      updateWedding(w.id, draft => {
        ensureBudget(draft);
        const r = draft.budget.exchangeRate || 5;
        draft.budget.perPerson[ppKey][ppCell] = value;
        const other = ppCell === 'ron' ? 'eur' : 'ron';
        draft.budget.perPerson[ppKey][other] = ppCell === 'ron'
          ? +(value / r).toFixed(2)
          : +(value * r).toFixed(2);
      });
      emit('render');
    });
  });

  // Gift per person (expected / min / avg)
  const wireGiftField = (attr, datasetKey, budgetKey) => {
    document.querySelectorAll(`[${attr}]`).forEach(inp => {
      inp.addEventListener('change', e => {
        const cur   = e.target.dataset[datasetKey];
        const value = Math.max(0, parseFloat(e.target.value) || 0);
        updateWedding(w.id, draft => {
          ensureBudget(draft);
          const r = draft.budget.exchangeRate || 5;
          draft.budget[budgetKey][cur] = value;
          const other = cur === 'ron' ? 'eur' : 'ron';
          draft.budget[budgetKey][other] = cur === 'ron'
            ? +(value / r).toFixed(2)
            : +(value * r).toFixed(2);
        });
        emit('render');
      });
    });
  };

  wireGiftField('data-gift-cur',     'giftCur',    'giftPerPerson');
  wireGiftField('data-gift-min-cur', 'giftMinCur', 'giftMinPerPerson');
  wireGiftField('data-gift-avg-cur', 'giftAvgCur', 'giftAvgPerPerson');
}

// ── Add custom vendor (with optional per-person link) ─────────────────────────
function addVendor(w) {
  const label = prompt('Nume furnizor (ex: Foc Artificii, Transport, Cofetărie):');
  if (!label?.trim()) return;

  const ppKeys = getPerPersonKeys();
  const linkChoice = prompt(
    `Vrei să legi acest furnizor de un preț per persoană? Rest plată se va calcula automat.\n\n` +
    `0. Nu, fără legătură\n` +
    ppKeys.map((p, i) => `${i + 1}. ${p.short}`).join('\n') +
    `\n\nIntrodu numărul (sau Enter pentru "Nu"):`
  );

  let perPersonKey = null;
  if (linkChoice && /^[1-5]$/.test(linkChoice.trim())) {
    perPersonKey = ppKeys[parseInt(linkChoice) - 1].key;
  }

  updateWedding(w.id, draft => {
    ensureBudget(draft);
    draft.budget.vendors.push({
      id: uuid(),
      label: label.trim(),
      perPersonKey,
      avansRon: 0, avansEur: 0,
      restRon: 0,  restEur: 0,
      avansPaid: true, restPaid: false,
      notes: '',
    });
  });
  toast(`Furnizor "${label.trim()}" adăugat${perPersonKey?` (legat de ${ppKeys.find(p=>p.key===perPersonKey).short})`:''}`, 'success');
  emit('render');
}

// ── Effective rest values (linked vendors derive Rest from per-person × guests)
function effectiveRest(v, b, guestCount) {
  if (v.perPersonKey && b.perPerson[v.perPersonKey]) {
    const pp = b.perPerson[v.perPersonKey];
    return {
      ron: (pp.ron || 0) * guestCount,
      eur: (pp.eur || 0) * guestCount,
      linked: true,
    };
  }
  return { ron: v.restRon || 0, eur: v.restEur || 0, linked: false };
}

// ── Vendor row ────────────────────────────────────────────────────────────────
function vendorRow(v, i, b, guestCount, ppKeys) {
  const rest = effectiveRest(v, b, guestCount);
  const totalRon = (v.avansRon || 0) + rest.ron;
  const totalEur = (v.avansEur || 0) + rest.eur;

  // Per-person link select
  const linkSelect = `
    <select class="bud-pp-link" data-vendor-pp-link="${v.id}" title="Leagă Rest plată de un preț per persoană">
      <option value="">— Fără —</option>
      ${ppKeys.map(p => `<option value="${p.key}" ${v.perPersonKey===p.key?'selected':''}>🔗 ${esc(p.short)}/pers</option>`).join('')}
    </select>`;

  // Rest cells: linked = read-only calculated; otherwise editable input
  const restRonCell = rest.linked
    ? `<span class="bud-cell-calc" title="Calculat: ${esc(ppKeys.find(p=>p.key===v.perPersonKey)?.short ?? '')} × ${guestCount}">${fmtNum(rest.ron)}</span>`
    : `<input type="number" data-vendor-cell="ron" data-vendor-id="${v.id}" data-vendor-field="restRon" value="${v.restRon || ''}" step="10" min="0" placeholder="0" />`;

  const restEurCell = rest.linked
    ? `<span class="bud-cell-calc">${fmtNum(rest.eur)}</span>`
    : `<input type="number" data-vendor-cell="eur" data-vendor-id="${v.id}" data-vendor-field="restEur" value="${v.restEur || ''}" step="10" min="0" placeholder="0" />`;

  return `
    <tr>
      <td style="color:var(--muted);text-align:center;width:32px">${i + 1}</td>
      <td>
        <input type="text" class="bud-label-inp" data-vendor-label="${v.id}" value="${esc(v.label)}" />
        ${linkSelect}
      </td>
      <td class="bud-cell avans"><input type="number" data-vendor-cell="ron" data-vendor-id="${v.id}" data-vendor-field="avansRon" value="${v.avansRon || ''}" step="10" min="0" placeholder="0" /></td>
      <td class="bud-cell avans"><input type="number" data-vendor-cell="eur" data-vendor-id="${v.id}" data-vendor-field="avansEur" value="${v.avansEur || ''}" step="10" min="0" placeholder="0" /></td>
      <td class="bud-cell rest ${rest.linked?'is-linked':''}">${restRonCell}</td>
      <td class="bud-cell rest ${rest.linked?'is-linked':''}">${restEurCell}</td>
      <td style="white-space:nowrap;text-align:center">
        <button class="paid-toggle ${v.avansPaid?'is-paid':''}" data-paid-toggle="avans" data-vendor-id="${v.id}" title="Avans plătit?">A</button>
        <button class="paid-toggle ${v.restPaid?'is-paid':''}"  data-paid-toggle="rest"  data-vendor-id="${v.id}" title="Rest plătit?">R</button>
      </td>
      <td><button class="btn btn-danger btn-sm" data-vendor-delete="${v.id}" title="Șterge furnizor">🗑</button></td>
    </tr>`;
}

// ── Per-person row ────────────────────────────────────────────────────────────
function perPersonRow(b, key, label, guestCount) {
  const pp = b.perPerson[key];
  const totalRon = (pp.ron || 0) * guestCount;
  return `
    <tr>
      <td>${esc(label)}</td>
      <td class="bud-cell"><input type="number" data-pp-cell="ron" data-pp-key="${key}" value="${pp.ron || ''}" step="1" min="0" placeholder="0" /></td>
      <td class="bud-cell"><input type="number" data-pp-cell="eur" data-pp-key="${key}" value="${pp.eur || ''}" step="1" min="0" placeholder="0" /></td>
      <td class="bud-cell" style="color:var(--muted)">${fmtRon(totalRon)}</td>
    </tr>`;
}

// ── Compute totals (uses effective rest values for linked vendors) ────────────
function computeTotals(b, guestCount) {
  let avansRon = 0, avansEur = 0, restRon = 0, restEur = 0;
  let paidRon = 0, paidEur = 0;

  for (const v of b.vendors) {
    const rest = effectiveRest(v, b, guestCount);
    avansRon += v.avansRon || 0;
    avansEur += v.avansEur || 0;
    restRon  += rest.ron;
    restEur  += rest.eur;
    if (v.avansPaid) { paidRon += v.avansRon || 0; paidEur += v.avansEur || 0; }
    if (v.restPaid)  { paidRon += rest.ron;        paidEur += rest.eur; }
  }

  const totalRon  = avansRon + restRon;
  const totalEur  = avansEur + restEur;
  const unpaidRon = totalRon - paidRon;
  const unpaidEur = totalEur - paidEur;

  let perPersonRon = 0, perPersonEur = 0;
  for (const { key } of getPerPersonKeys()) {
    perPersonRon += b.perPerson[key]?.ron || 0;
    perPersonEur += b.perPerson[key]?.eur || 0;
  }

  return { avansRon, avansEur, restRon, restEur, totalRon, totalEur, paidRon, paidEur, unpaidRon, unpaidEur, perPersonRon, perPersonEur };
}

// ── Format helpers ────────────────────────────────────────────────────────────
function fmtRon(n) { return `${fmtNum(n)} lei`; }
function fmtEur(n) { return `€${fmtNum(n)}`; }
function fmtNum(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('ro-RO', { maximumFractionDigits: 2 });
}
