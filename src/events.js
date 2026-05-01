/**
 * Minimal typed event bus to break circular imports between
 * router ↔ modules ↔ components.
 */
const _handlers = {};

export function on(event, fn) {
  (_handlers[event] ??= new Set()).add(fn);
  return () => _handlers[event]?.delete(fn);
}

export function emit(event, payload) {
  _handlers[event]?.forEach(fn => fn(payload));
}
