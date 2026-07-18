// Locale-aware prompt seeds for Artifact OS apply-skill chips.
// Prefer Dict keys so Vietnamese (and other locales) get native scaffolds;
// chips.ts keeps English `promptSeed` as fallback when a key is missing.

import type { Dict } from '../../i18n/types';

/** Chip id → Dict key for the empty-composer scaffold. */
export const APPLY_SKILL_SEED_KEYS: Readonly<Partial<Record<string, keyof Dict>>> = {
  'content-pack': 'homeHero.outcome.multiPlatformPackPrompt',
  repurpose: 'homeHero.outcome.repurposeFivePrompt',
  'social-content': 'homeHero.outcome.socialBatchPrompt',
  carousel: 'homeHero.outcome.xhsCarouselPrompt',
  'short-video': 'homeHero.outcome.shortVideoPrompt',
  'ad-creative': 'homeHero.outcome.adVariantsPrompt',
  'hook-engine': 'homeHero.outcome.hookLabPrompt',
  'linkedin-post': 'homeHero.chipSeed.linkedinPost',
  'facebook-post': 'homeHero.chipSeed.facebookPost',
  youtube: 'homeHero.chipSeed.youtube',
  email: 'homeHero.chipSeed.email',
  threads: 'homeHero.chipSeed.threads',
};

type Translate = (key: keyof Dict) => string;

/**
 * Resolve the composer seed for an apply-skill chip.
 * Localized Dict wins when present; otherwise falls back to the chip table seed.
 */
export function resolveApplySkillPromptSeed(
  chipId: string,
  fallbackPromptSeed: string | undefined,
  t: Translate,
): string {
  const key = APPLY_SKILL_SEED_KEYS[chipId];
  if (key) {
    const localized = t(key);
    if (typeof localized === 'string' && localized.trim().length > 0) {
      return localized;
    }
  }
  return fallbackPromptSeed ?? '';
}
