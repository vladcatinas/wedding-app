import { v4 as uuidv4 } from 'uuid';

export const uuid = () => uuidv4();

export const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');

export function toast(msg, type = '') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

/** Format a date string as readable text */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Days until a date (can be negative for past dates) */
export function daysUntil(isoDate) {
  if (!isoDate) return null;
  return Math.ceil((new Date(isoDate) - new Date()) / 86_400_000);
}

/** Seed 30 demo guests for a new wedding */
export function buildDemoWedding(id) {
  const NAMES = [
    'Alice Johnson','Bob Smith','Carol Williams','David Brown','Eva Martinez',
    'Frank Davis','Grace Wilson','Henry Taylor','Isabella Anderson','James Thomas',
    'Karen Jackson','Liam White','Mia Harris','Noah Martin','Olivia Thompson',
    'Peter Garcia','Quinn Robinson','Rachel Clark','Samuel Lewis','Tara Walker',
    'Uma Hall','Victor Allen','Wendy Young','Xavier King','Yara Scott','Zach Green',
    'Amy Adams','Brian Baker','Christine Carter','Derek Collins',
  ];

  const RSVPS  = ['confirmed','confirmed','confirmed','pending','declined','maybe'];
  const DIETS  = ['','vegetarian','vegan','gluten-free','','nut allergy'];
  const SIDES  = ['bride','groom'];

  const guests = NAMES.map((name, i) => ({
    id: uuid(),
    name,
    email: `${name.toLowerCase().replace(' ', '.')}${i}@example.com`,
    phone: `+1-555-${String(1000 + i).slice(-4)}`,
    side: SIDES[i % 2],
    rsvpStatus: RSVPS[i % 6],
    partySize: i % 5 === 0 ? 2 : 1,
    dietaryRestrictions: DIETS[i % 6],
    notes: '',
  }));

  const TABLE_NAMES = ['Magnolia','Jasmine','Rose','Lavender','Peony'];
  const allIds = guests.map(g => g.id);

  const tables = TABLE_NAMES.map((name, i) => ({
    id: uuid(),
    name: `${name} Table`,
    capacity: 8,
    guests: allIds.slice(i * 5, i * 5 + 5),
  }));

  const assigned = new Set(tables.flatMap(t => t.guests));
  const unassigned = allIds.filter(id => !assigned.has(id));

  return {
    id,
    couple: { partner1: 'Alex', partner2: 'Jordan' },
    date: '2027-06-15',
    location: 'Paris, France',
    createdAt: new Date().toISOString().slice(0, 10),
    guests,
    seating: { tables, unassigned },
  };
}
