// Curated “for creators” starter packs shown on Home. Each pack seeds a
// pre-filled outcome prompt and binds a create-rail chip — no agent jargon.

import type { Dict } from '../../i18n/types';
import type { IconName } from '../Icon';

export interface CreatorPopularPack {
  id: string;
  icon: IconName;
  // Soft brand accent for the pack tile (CSS color token or hex).
  accent: string;
  titleKey: keyof Dict;
  descKey: keyof Dict;
  chipId: string;
  promptKey: keyof Dict;
}

export const CREATOR_POPULAR_PACKS: ReadonlyArray<CreatorPopularPack> = [
  {
    id: 'pmf-fail',
    icon: 'lightbulb',
    accent: '#e07a5f',
    titleKey: 'homeHero.pack.pmfFailTitle',
    descKey: 'homeHero.pack.pmfFailDesc',
    chipId: 'content-pack',
    promptKey: 'homeHero.pack.pmfFailPrompt',
  },
  {
    id: 'myth-bust',
    icon: 'sparkles',
    accent: '#81b29a',
    titleKey: 'homeHero.pack.mythBustTitle',
    descKey: 'homeHero.pack.mythBustDesc',
    chipId: 'content-pack',
    promptKey: 'homeHero.pack.mythBustPrompt',
  },
  {
    id: 'personal-brand',
    icon: 'star',
    accent: '#f2cc8f',
    titleKey: 'homeHero.pack.personalBrandTitle',
    descKey: 'homeHero.pack.personalBrandDesc',
    chipId: 'social-content',
    promptKey: 'homeHero.pack.personalBrandPrompt',
  },
  {
    id: 'launch-week',
    icon: 'send',
    accent: '#3d405b',
    titleKey: 'homeHero.pack.launchWeekTitle',
    descKey: 'homeHero.pack.launchWeekDesc',
    chipId: 'content-pack',
    promptKey: 'homeHero.pack.launchWeekPrompt',
  },
  {
    id: 'xhs-hooks',
    icon: 'grid',
    accent: '#e63946',
    titleKey: 'homeHero.pack.xhsHooksTitle',
    descKey: 'homeHero.pack.xhsHooksDesc',
    chipId: 'carousel',
    promptKey: 'homeHero.pack.xhsHooksPrompt',
  },
  {
    id: 'hook-lab',
    icon: 'sparkles',
    accent: '#c1121f',
    titleKey: 'homeHero.pack.hookLabTitle',
    descKey: 'homeHero.pack.hookLabDesc',
    chipId: 'hook-engine',
    promptKey: 'homeHero.pack.hookLabPrompt',
  },
  {
    id: 'ad-test',
    icon: 'sliders',
    accent: '#457b9d',
    titleKey: 'homeHero.pack.adTestTitle',
    descKey: 'homeHero.pack.adTestDesc',
    chipId: 'ad-creative',
    promptKey: 'homeHero.pack.adTestPrompt',
  },
];
