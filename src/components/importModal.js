import Papa from 'papaparse';
import { uuid, toast, openModal, closeModal, esc } from '../utils.js';
import { getActiveWedding, updateWedding, ensureSeating } from '../state.js';
import { emit } from '../events.js';

// ── Field definitions ─────────────────────────────────────────────────────────
const FIELDS = [
  { key: 'name',               label: 'Nume',                       required: true },
  { key: 'side',               label: 'Side (bride / groom / common)' },
  { key: 'rsvpStatus',         label: 'RSVP Status' },
  { key: 'dietaryRestrictions',label: 'Dieta' },
  { key: 'attended',           label: 'Am fost la nuntă?' },
  { key: 'giftAmount',         label: 'Sumă cadou' },
  { key: 'notes',              label: 'Notes' },
];

// ── Module state ──────────────────────────────────────────────────────────────
let _parsedRows    = [];   // raw CSV rows (array of objects)
let _headers       = [];   // CSV column headers
let _columnMap     = {};   // { fieldKey: csvHeader }
let _step          = 1;

// ── CSV Template ──────────────────────────────────────────────────────────────
const TEMPLATE_HEADERS = 'Nume,Side,RSVP Status,Dieta,Am fost la nuntă?,Sumă cadou,Notes\n';
const TEMPLATE_ROWS    =
  'Maria Popescu,bride,confirmed,vegetarian,yes,500 RON,Alergie la nuci\n' +
  'Andrei Ionescu,groom,pending,,pending,,\n' +
  'Familia Georgescu,common,confirmed,gluten-free,yes,800 RON,Masa lângă fereastră\n';

// ── Open / Close ──────────────────────────────────────────────────────────────
export function openImportModal() {
  resetState();
  showStep(1);
  openModal('import-modal');
}

function resetState() {
  _parsedRows = []; _headers = []; _columnMap = {}; _step = 1;

  document.getElementById('import-step-1').style.display = '';
  document.getElementById('import-step-2').style.display = 'none';
  document.getElementById('import-step-3').style.display = 'none';

  const csvInput = document.getElementById('csv-file-input');
  if (csvInput) csvInput.value = '';

  updateFooter();
}

// ── Step management ───────────────────────────────────────────────────────────
function showStep(n) {
  _step = n;
  [1, 2, 3].forEach(i => {
    const el = document.getElementById(`import-step-${i}`);
    if (el) el.style.display = i === n ? '' : 'none';
  });
  updateFooter();
}

function updateFooter() {
  const backBtn = document.getElementById('btn-import-back');
  const nextBtn = document.getElementById('btn-import-next');
  if (!backBtn || !nextBtn) return;

  backBtn.style.display = _step > 1 ? 'inline-flex' : 'none';
  nextBtn.textContent = _step === 3 ? '✓ Import Guests' : 'Next →';
}

// ── Init event listeners (called once from main.js) ───────────────────────────
export function initImportModal() {
  // File input
  document.getElementById('csv-file-input')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  });

  // Drag & drop zone
  const zone = document.getElementById('csv-drop-zone');
  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-active'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-active'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-active');
      const file = e.dataTransfer.files?.[0];
      if (file) parseFile(file);
    });
  }

  // Download template
  document.getElementById('btn-download-template')?.addEventListener('click', downloadTemplate);

  // Back / Next
  document.getElementById('btn-import-back')?.addEventListener('click', () => {
    if (_step > 1) showStep(_step - 1);
  });

  document.getElementById('btn-import-next')?.addEventListener('click', () => {
    if (_step === 1) return; // can't manually advance past step 1 without a file
    if (_step === 2) {
      collectColumnMap();
      if (!validateMapping()) return;
      buildStep3();
      showStep(3);
    } else if (_step === 3) {
      doImport();
    }
  });
}

// ── Parse CSV ─────────────────────────────────────────────────────────────────
function parseFile(file) {
  const validTypes = ['text/csv', 'text/tab-separated-values', 'application/vnd.ms-excel', ''];
  const ext = file.name.split('.').pop().toLowerCase();

  if (!['csv', 'tsv', 'txt'].includes(ext) && !validTypes.includes(file.type)) {
    toast('Please upload a .csv or .tsv file', 'error');
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
    complete: result => {
      if (result.errors.length && result.data.length === 0) {
        toast('Could not parse file: ' + result.errors[0].message, 'error');
        return;
      }

      _parsedRows = result.data;
      _headers    = result.meta.fields ?? [];

      if (_parsedRows.length === 0) {
        toast('The file appears to be empty', 'error');
        return;
      }

      toast(`Parsed ${_parsedRows.length} rows`, 'success');
      buildStep2();
      showStep(2);
    },
    error: err => toast('Parse error: ' + err.message, 'error'),
  });
}

// ── Step 2: Column mapping ─────────────────────────────────────────────────────
function buildStep2() {
  const grid = document.getElementById('mapping-grid');
  if (!grid) return;

  // Auto-detect mappings (fuzzy match)
  const auto = autoDetect(_headers);

  grid.innerHTML = FIELDS.map(f => {
    const matched = auto[f.key] ?? '';
    return `
      <div class="mapping-row">
        <label>${f.label}${f.required ? ' *' : ''}</label>
        <select data-field="${f.key}">
          <option value="">— Skip —</option>
          ${_headers.map(h =>
            `<option value="${esc(h)}" ${h === matched ? 'selected' : ''}>${esc(h)}</option>`
          ).join('')}
        </select>
      </div>`;
  }).join('');

  renderPreview();
}

function autoDetect(headers) {
  // Map field keys to common CSV header aliases (EN + RO)
  const aliases = {
    name:                ['nume', 'name', 'full name', 'guest name', 'guest', 'nume complet', 'invitat'],
    side:                ['side', 'guest side', 'party side', 'parte', 'tabara'],
    rsvpStatus:          ['rsvp', 'rsvp status', 'status', 'response', 'raspuns'],
    dietaryRestrictions: ['dieta', 'dietary', 'dietary restrictions', 'diet', 'food restrictions', 'restrictii alimentare'],
    attended:            ['am fost la nuntă?', 'am fost la nunta?', 'am fost', 'attended', 'came', 'a venit', 'prezent', 'attendance'],
    giftAmount:          ['sumă cadou', 'suma cadou', 'cadou', 'gift', 'gift amount', 'gift value', 'sumă', 'suma'],
    notes:               ['notes', 'note', 'notițe', 'notite', 'observatii', 'observații', 'comments', 'special requests'],
  };

  const result = {};
  const lowerHeaders = headers.map(h => h.toLowerCase());

  Object.entries(aliases).forEach(([key, aliasList]) => {
    for (const alias of aliasList) {
      const idx = lowerHeaders.indexOf(alias);
      if (idx >= 0) { result[key] = headers[idx]; break; }
    }
  });

  return result;
}

function renderPreview() {
  const table = document.getElementById('preview-table');
  if (!table) return;

  const preview = _parsedRows.slice(0, 5);

  table.querySelector('thead').innerHTML =
    `<tr>${_headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>`;

  table.querySelector('tbody').innerHTML = preview.map(row =>
    `<tr>${_headers.map(h => `<td>${esc(row[h] ?? '')}</td>`).join('')}</tr>`
  ).join('');

  const countEl = document.getElementById('preview-count');
  if (countEl) countEl.textContent = `(first 5 of ${_parsedRows.length} rows)`;
}

function collectColumnMap() {
  _columnMap = {};
  document.querySelectorAll('#mapping-grid [data-field]').forEach(sel => {
    if (sel.value) _columnMap[sel.dataset.field] = sel.value;
  });
}

function validateMapping() {
  if (!_columnMap.name) {
    toast('"Name" column must be mapped', 'error');
    return false;
  }
  return true;
}

// ── Step 3: Summary + mode ────────────────────────────────────────────────────
function buildStep3() {
  const summary = document.getElementById('import-summary');
  if (!summary) return;

  const mapped   = Object.keys(_columnMap).length;
  const rows     = _parsedRows.length;
  const withName = _parsedRows.filter(r => r[_columnMap.name]?.trim()).length;
  const skipped  = rows - withName;

  summary.innerHTML = `
    <div class="summary-row">
      <span>Total rows in file</span>
      <span class="summary-val">${rows}</span>
    </div>
    <div class="summary-row">
      <span>Rows with a name (will import)</span>
      <span class="summary-val">${withName}</span>
    </div>
    ${skipped ? `<div class="summary-row" style="color:var(--yellow)">
      <span>Rows skipped (empty name)</span>
      <span class="summary-val">${skipped}</span>
    </div>` : ''}
    <div class="summary-row">
      <span>Columns mapped</span>
      <span class="summary-val">${mapped} / ${FIELDS.length}</span>
    </div>`;
}

// ── Do import ─────────────────────────────────────────────────────────────────
function doImport() {
  const w = getActiveWedding();
  if (!w) { toast('No active wedding selected', 'error'); return; }

  const mode       = document.getElementById('import-mode')?.value ?? 'merge';
  const nameCol    = _columnMap.name;
  const newGuests  = [];
  let   skipped    = 0;

  for (const row of _parsedRows) {
    const name = row[nameCol]?.trim();
    if (!name) { skipped++; continue; }

    newGuests.push(buildGuest(row, name));
  }

  if (newGuests.length === 0) {
    toast('No valid guests found in file', 'error');
    return;
  }

  updateWedding(w.id, draft => {
    if (!draft.guests) draft.guests = [];
    ensureSeating(draft);

    if (mode === 'replace') {
      // Remove old guests from seating first
      const oldIds = new Set(draft.guests.map(g => g.id));
      draft.seating.tables.forEach(t => { t.guests = t.guests.filter(id => !oldIds.has(id)); });
      draft.seating.unassigned = draft.seating.unassigned.filter(id => !oldIds.has(id));
      draft.guests = newGuests;
    } else if (mode === 'merge') {
      const existingNames = new Set(draft.guests.map(g => g.name.toLowerCase()));
      const toAdd = newGuests.filter(g => !existingNames.has(g.name.toLowerCase()));
      draft.guests.push(...toAdd);
      const merged = newGuests.length - toAdd.length;
      if (merged) toast(`Skipped ${merged} duplicate name(s)`, 'warning');
    } else {
      // append
      draft.guests.push(...newGuests);
    }

    // Add new guests to unassigned
    const assignedIds = new Set(draft.seating.tables.flatMap(t => t.guests));
    draft.guests.forEach(g => {
      if (!assignedIds.has(g.id) && !draft.seating.unassigned.includes(g.id)) {
        draft.seating.unassigned.push(g.id);
      }
    });
  });

  closeModal('import-modal');
  const msg = `Imported ${newGuests.length} guests${skipped ? ` (${skipped} skipped)` : ''}!`;
  toast(msg, 'success');
  emit('render');
}

function buildGuest(row, name) {
  const get = key => {
    const col = _columnMap[key];
    return col ? (row[col] ?? '').toString().trim() : '';
  };

  const rawSide      = get('side').toLowerCase();
  const rawRsvp      = get('rsvpStatus').toLowerCase();
  const rawAttended  = get('attended').toLowerCase();

  const SIDES = ['common', 'bride', 'groom'];
  const RSVPS = ['confirmed', 'declined', 'pending', 'maybe'];

  // Attendance: yes / no / pending
  let attended = 'pending';
  if (/^(yes|y|da|true|1|came|prezent)/.test(rawAttended)) attended = 'yes';
  else if (/^(no|n|nu|false|0|absent|missed)/.test(rawAttended)) attended = 'no';

  return {
    id:                  uuid(),
    name,
    side:                SIDES.find(s => rawSide.includes(s)) ?? 'common',
    rsvpStatus:          RSVPS.find(r => rawRsvp.includes(r)) ?? 'pending',
    partySize:           1,
    dietaryRestrictions: get('dietaryRestrictions'),
    attended,
    giftAmount:          get('giftAmount'),
    notes:               get('notes'),
  };
}

// ── Template download ─────────────────────────────────────────────────────────
function downloadTemplate() {
  const content = TEMPLATE_HEADERS + TEMPLATE_ROWS;
  // BOM so Excel auto-detects UTF-8 (păstrează diacriticele)
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'wedding-guest-template.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Template downloaded!', 'success');
}
