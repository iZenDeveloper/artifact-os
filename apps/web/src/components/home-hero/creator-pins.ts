// Pin 3–4 favorite creator categories to the front of the Home Quick Start row.
// Stored locally so power users keep their layout without a backend account.

const STORAGE_KEY = 'od:home-pinned-creator-chips';
const MAX_PINS = 4;

export function readPinnedCreatorChips(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, MAX_PINS);
  } catch {
    return [];
  }
}

export function writePinnedCreatorChips(ids: string[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_PINS)));
  } catch {
    // quota / private mode — ignore
  }
}

export function togglePinnedCreatorChip(id: string, current: string[]): string[] {
  if (current.includes(id)) {
    return current.filter((item) => item !== id);
  }
  if (current.length >= MAX_PINS) {
    // Drop oldest pin to make room (FIFO).
    return [...current.slice(1), id];
  }
  return [...current, id];
}

export function orderWithPins<T extends { id: string }>(
  items: readonly T[],
  pinnedIds: readonly string[],
): T[] {
  const pinSet = new Set(pinnedIds);
  const pinned = pinnedIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is T => Boolean(item));
  const rest = items.filter((item) => !pinSet.has(item.id));
  return [...pinned, ...rest];
}

export const CREATOR_PIN_MAX = MAX_PINS;
