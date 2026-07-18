// Outcome-first quick starts for the Home composer.
//
// The create rail is still useful for format selection, but new content
// creators often know the *result* they want ("repurpose one post into five
// formats") before they know which chip/skill name to pick. These pills seed
// a concrete outcome prompt and bind the matching content chip so Send is
// one click away — reducing the "Agent-first" feel of an empty prompt.

import type { Dict } from '../../i18n/types';

export interface OutcomeQuickStart {
  id: string;
  // i18n key for the pill label.
  labelKey: keyof Dict;
  // Create-rail chip id to bind (must exist in HOME_HERO_CHIPS).
  chipId: string;
  // i18n key for the prompt text seeded into the composer.
  promptKey: keyof Dict;
}

export const OUTCOME_QUICK_STARTS: ReadonlyArray<OutcomeQuickStart> = [
  {
    id: 'multi-platform-pack',
    labelKey: 'homeHero.outcome.multiPlatformPack',
    chipId: 'content-pack',
    promptKey: 'homeHero.outcome.multiPlatformPackPrompt',
  },
  {
    id: 'repurpose-five',
    labelKey: 'homeHero.outcome.repurposeFive',
    chipId: 'content-pack',
    promptKey: 'homeHero.outcome.repurposeFivePrompt',
  },
  {
    id: 'social-batch',
    labelKey: 'homeHero.outcome.socialBatch',
    chipId: 'social-content',
    promptKey: 'homeHero.outcome.socialBatchPrompt',
  },
  {
    id: 'xhs-carousel',
    labelKey: 'homeHero.outcome.xhsCarousel',
    chipId: 'carousel',
    promptKey: 'homeHero.outcome.xhsCarouselPrompt',
  },
  {
    id: 'short-video-script',
    labelKey: 'homeHero.outcome.shortVideo',
    chipId: 'short-video',
    promptKey: 'homeHero.outcome.shortVideoPrompt',
  },
  {
    id: 'facebook-post',
    labelKey: 'homeHero.outcome.facebookPost',
    chipId: 'facebook-post',
    promptKey: 'homeHero.outcome.facebookPostPrompt',
  },
  {
    id: 'youtube',
    labelKey: 'homeHero.outcome.youtube',
    chipId: 'youtube',
    promptKey: 'homeHero.outcome.youtubePrompt',
  },
  {
    id: 'ad-variants',
    labelKey: 'homeHero.outcome.adVariants',
    chipId: 'ad-creative',
    promptKey: 'homeHero.outcome.adVariantsPrompt',
  },
  {
    id: 'hook-lab',
    labelKey: 'homeHero.outcome.hookLab',
    chipId: 'hook-engine',
    promptKey: 'homeHero.outcome.hookLabPrompt',
  },
];
