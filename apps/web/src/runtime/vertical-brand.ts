// Artifact OS brand classification for Personal ↔ Client switching.
// Pure helpers — safe to unit-test without React.

export type VerticalBrandMode = 'personal' | 'client' | 'other';
export type BrandSwitcherFilter = 'personal' | 'client' | 'all';

export type BrandClassifiable = {
  id: string;
  category?: string;
  title?: string;
};

/** Built-in Artifact OS design-system ids (pinned order for quick switch). */
export const VERTICAL_OS_PERSONAL_IDS = ['personal-minimal', 'personal-bold'] as const;
export const VERTICAL_OS_CLIENT_IDS = ['professional-clean'] as const;
export const VERTICAL_OS_QUICK_IDS = [
  ...VERTICAL_OS_PERSONAL_IDS,
  ...VERTICAL_OS_CLIENT_IDS,
] as const;

const PERSONAL_ID_SET = new Set<string>(VERTICAL_OS_PERSONAL_IDS);
const CLIENT_ID_SET = new Set<string>(VERTICAL_OS_CLIENT_IDS);

const BRAND_MODE_STORAGE_KEY = 'od.verticalBrandMode';

export function classifyVerticalBrand(ds: BrandClassifiable): VerticalBrandMode {
  const id = (ds.id ?? '').trim().toLowerCase();
  // Strip optional prefixes (user:, installed:, etc.)
  const bareId = id.includes(':') ? id.slice(id.lastIndexOf(':') + 1) : id;

  if (PERSONAL_ID_SET.has(bareId) || PERSONAL_ID_SET.has(id)) return 'personal';
  if (CLIENT_ID_SET.has(bareId) || CLIENT_ID_SET.has(id)) return 'client';

  const category = (ds.category ?? '').toLowerCase();
  const title = (ds.title ?? '').toLowerCase();
  const hay = `${category} ${title}`;

  if (
    hay.includes('personal brand') ||
    hay.includes('vertical os · personal') ||
    hay.includes('vertical os · personal brand') ||
    (hay.includes('vertical os') && hay.includes('personal'))
  ) {
    return 'personal';
  }

  if (
    hay.includes('client brand') ||
    hay.includes('vertical os · client') ||
    (hay.includes('vertical os') && hay.includes('client'))
  ) {
    return 'client';
  }

  return 'other';
}

export function isVerticalOsSystem(ds: BrandClassifiable): boolean {
  return classifyVerticalBrand(ds) !== 'other';
}

export function filterByBrandMode<T extends BrandClassifiable>(
  systems: readonly T[],
  mode: BrandSwitcherFilter,
): T[] {
  if (mode === 'all') return [...systems];
  return systems.filter((ds) => classifyVerticalBrand(ds) === mode);
}

/** Pin known Artifact OS systems first (stable order), preserve relative order of the rest. */
export function pinVerticalOsSystems<T extends BrandClassifiable>(systems: readonly T[]): T[] {
  const pinRank = new Map<string, number>();
  VERTICAL_OS_QUICK_IDS.forEach((id, index) => {
    pinRank.set(id, index);
  });

  const score = (ds: T): number => {
    const id = ds.id.toLowerCase();
    const bare = id.includes(':') ? id.slice(id.lastIndexOf(':') + 1) : id;
    if (pinRank.has(bare)) return pinRank.get(bare)!;
    if (pinRank.has(id)) return pinRank.get(id)!;
    if (isVerticalOsSystem(ds)) return 100;
    return 1000;
  };

  return [...systems].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return 0;
  });
}

/** Quick-switch chips: Artifact OS systems present in the catalog, pinned order. */
export function verticalOsQuickSwitchSystems<T extends BrandClassifiable>(
  systems: readonly T[],
): T[] {
  const byBare = new Map<string, T>();
  for (const ds of systems) {
    const id = ds.id.toLowerCase();
    const bare = id.includes(':') ? id.slice(id.lastIndexOf(':') + 1) : id;
    if (VERTICAL_OS_QUICK_IDS.includes(bare as (typeof VERTICAL_OS_QUICK_IDS)[number])) {
      if (!byBare.has(bare)) byBare.set(bare, ds);
    }
  }
  return VERTICAL_OS_QUICK_IDS.map((id) => byBare.get(id)).filter(
    (ds): ds is T => ds !== undefined,
  );
}

export function readStoredBrandFilter(): BrandSwitcherFilter | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(BRAND_MODE_STORAGE_KEY);
    if (raw === 'personal' || raw === 'client' || raw === 'all') return raw;
  } catch {
    // ignore
  }
  return null;
}

export function writeStoredBrandFilter(mode: BrandSwitcherFilter): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(BRAND_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

/** Seed filter when opening the picker. */
export function seedBrandFilter(selected: BrandClassifiable | null | undefined): BrandSwitcherFilter {
  if (selected) {
    const mode = classifyVerticalBrand(selected);
    if (mode === 'personal' || mode === 'client') return mode;
  }
  return readStoredBrandFilter() ?? 'all';
}
