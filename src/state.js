import { uuid } from './utils.js';

const STORAGE_KEY = 'weddingPlanner_v1';

const defaultState = () => ({
  weddings: [],
  activeWeddingId: null,
});

let _state = defaultState();
let _saveTimer = null;
const _listeners = new Set();

// ── Load ─────────────────────────────────────────────────────────────────────
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) _state = JSON.parse(raw);
  } catch (_) {
    _state = defaultState();
  }
  if (!Array.isArray(_state.weddings)) _state.weddings = [];
}

// ── Save (debounced) ─────────────────────────────────────────────────────────
export function saveState() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      const json = JSON.stringify(_state);
      // Warn at ~4.5 MB (typical limit is 5-10 MB)
      if (json.length > 4_500_000) {
        console.warn('localStorage nearing limit');
      }
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
      console.error('Save failed', e);
    }
    _listeners.forEach(fn => fn());
  }, 300);
}

// ── Reactive subscriptions ───────────────────────────────────────────────────
export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

// ── Getters ──────────────────────────────────────────────────────────────────
export function getState() { return _state; }

export function getActiveWedding() {
  return _state.weddings.find(w => w.id === _state.activeWeddingId) ?? null;
}

// ── Mutations ─────────────────────────────────────────────────────────────────
export function setActiveWedding(id) {
  _state.activeWeddingId = id;
  saveState();
}

export function addWedding(wedding) {
  _state.weddings.push(wedding);
  _state.activeWeddingId = wedding.id;
  saveState();
}

export function updateWedding(id, updater) {
  const idx = _state.weddings.findIndex(w => w.id === id);
  if (idx >= 0) {
    updater(_state.weddings[idx]);
    saveState();
  }
}

export function deleteWedding(id) {
  _state.weddings = _state.weddings.filter(w => w.id !== id);
  if (_state.activeWeddingId === id) {
    _state.activeWeddingId = _state.weddings[0]?.id ?? null;
  }
  saveState();
}

export function clearAllGuests(id) {
  updateWedding(id, draft => {
    draft.guests = [];
    ensureSeating(draft);
    draft.seating.tables.forEach(t => { t.guests = []; });
    draft.seating.unassigned = [];
  });
}

// ── Budget helpers ────────────────────────────────────────────────────────────
const DEFAULT_VENDORS = [
  'Restaurant', 'Formație', 'Monoporții', 'Candy Bar', 'Mărturii',
  'Video', 'Foto', 'MC', 'DJ', 'Verighete', 'Decorațiuni',
  'Invitații', 'Costum', 'Rochie',
];

// Maps default vendor labels → per-person price key (so Rest auto-calculates)
const PP_VENDOR_MAP = {
  'Restaurant': 'meniu',
  'Invitații':  'invitatie',
  'Monoporții': 'monoportie',
  'Candy Bar':  'candyBar',
  'Mărturii':   'marturii',
};

const PER_PERSON_KEYS = [
  { key: 'meniu',      label: 'Preț meniu / persoană',      short: 'Meniu' },
  { key: 'invitatie',  label: 'Preț invitație / persoană',  short: 'Invitație' },
  { key: 'monoportie', label: 'Preț monoporție / persoană', short: 'Monoporție' },
  { key: 'candyBar',   label: 'Preț candy bar / persoană',  short: 'Candy Bar' },
  { key: 'marturii',   label: 'Preț mărturii / persoană',   short: 'Mărturii' },
];

export function ensureBudget(wedding) {
  // Migrate old format (had .total / .categories) → reset to new structure
  if (wedding.budget && (wedding.budget.categories || 'total' in wedding.budget)) {
    wedding.budget = null;
  }

  if (!wedding.budget) {
    wedding.budget = {
      exchangeRate: 5,
      guestCount: null,
      giftPerPerson: { ron: 0, eur: 0 },
      perPerson: {},
      vendors: [],
    };
  }

  wedding.budget.exchangeRate ??= 5;
  if (typeof wedding.budget.guestCount === 'undefined') wedding.budget.guestCount = null;
  wedding.budget.giftPerPerson ??= { ron: 0, eur: 0 };
  wedding.budget.giftPerPerson.ron ??= 0;
  wedding.budget.giftPerPerson.eur ??= 0;

  wedding.budget.perPerson ??= {};
  for (const { key } of PER_PERSON_KEYS) {
    wedding.budget.perPerson[key] ??= { ron: 0, eur: 0 };
    wedding.budget.perPerson[key].ron ??= 0;
    wedding.budget.perPerson[key].eur ??= 0;
  }

  wedding.budget.vendors ??= [];

  // Seed default Romanian vendor list on first init
  if (wedding.budget.vendors.length === 0) {
    wedding.budget.vendors = DEFAULT_VENDORS.map(label => ({
      id: uuid(),
      label,
      perPersonKey: PP_VENDOR_MAP[label] ?? null,
      avansRon: 0, avansEur: 0,
      restRon: 0,  restEur: 0,
      avansPaid: true,    // avans = avans plătit (default true)
      restPaid: false,
      notes: '',
    }));
  }

  // Backfill missing fields on existing vendors
  wedding.budget.vendors.forEach(v => {
    v.id ??= uuid();
    if (!('perPersonKey' in v)) v.perPersonKey = PP_VENDOR_MAP[v.label] ?? null;
    v.avansRon ??= 0; v.avansEur ??= 0;
    v.restRon  ??= 0; v.restEur  ??= 0;
    v.avansPaid ??= true;
    v.restPaid  ??= false;
    v.notes ??= '';
  });
}

export function getDefaultVendors() { return DEFAULT_VENDORS; }
export function getPerPersonKeys()  { return PER_PERSON_KEYS; }
export function getPpVendorMap()    { return PP_VENDOR_MAP; }

// ── Guest helpers ─────────────────────────────────────────────────────────────
export function ensureSeating(wedding) {
  wedding.seating ??= { tables: [], unassigned: [] };
  wedding.seating.tables ??= [];
  wedding.seating.unassigned ??= [];
}

export function syncUnassigned(wedding) {
  ensureSeating(wedding);
  const assigned = new Set(wedding.seating.tables.flatMap(t => t.guests));
  wedding.seating.unassigned = wedding.seating.unassigned.filter(id => !assigned.has(id));
  (wedding.guests ?? []).forEach(g => {
    if (!assigned.has(g.id) && !wedding.seating.unassigned.includes(g.id)) {
      wedding.seating.unassigned.push(g.id);
    }
  });
}

export function replaceState(newState) {
  _state = newState;
  if (!Array.isArray(_state.weddings)) _state.weddings = [];
  if (!_state.activeWeddingId && _state.weddings.length) {
    _state.activeWeddingId = _state.weddings[0].id;
  }
  saveState();
}
