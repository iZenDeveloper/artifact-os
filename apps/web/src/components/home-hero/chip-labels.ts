// Single source of truth for localizing a HOME_HERO_CHIPS chip id to its
// display label. Shared by the Home hero rail (HomeHero/HomeView) and the
// onboarding "build a design system" step (EntryShell), so the onboarding
// artifact chips stay in lockstep with the real template picker instead of a
// separate hand-maintained string that silently drifts out of sync.
//
// Kept out of `chips.ts` so that module stays a pure data table with no i18n
// dependency; this file owns the chip-id → Dict-key mapping.

import type { Dict } from '../../i18n/types';

// Narrow translate signature — any `useT()` result satisfies it.
type Translate = (key: keyof Dict) => string;

export function homeHeroChipLabel(chipId: string, t: Translate): string {
  switch (chipId) {
    case 'content-pack': return t('homeHero.chip.contentPack');
    case 'social-content': return t('homeHero.chip.socialContent');
    case 'carousel': return t('homeHero.chip.carousel');
    case 'short-video': return t('homeHero.chip.shortVideo');
    case 'linkedin-post': return t('homeHero.chip.linkedinPost');
    case 'facebook-post': return t('homeHero.chip.facebookPost');
    case 'youtube': return t('homeHero.chip.youtube');
    case 'threads': return t('homeHero.chip.threads');
    case 'email': return t('homeHero.chip.email');
    case 'ad-creative': return t('homeHero.chip.adCreative');
    case 'repurpose': return t('homeHero.chip.repurpose');
    case 'hook-engine': return t('homeHero.chip.hookEngine');
    case 'prototype': return t('homeHero.chip.prototype');
    case 'web-clone': return t('homeHero.chip.webClone');
    case 'wireframe': return t('homeHero.chip.wireframe');
    case 'mobile': return t('homeHero.chip.mobile');
    case 'live-artifact': return t('homeHero.chip.liveArtifact');
    case 'deck': return t('homeHero.chip.deck');
    case 'document': return t('homeHero.chip.document');
    case 'image': return t('homeHero.chip.image');
    case 'video': return t('homeHero.chip.video');
    case 'hyperframes': return t('homeHero.chip.hyperframes');
    case 'webgl': return t('homeHero.chip.webgl');
    case 'audio': return t('homeHero.chip.audio');
    case 'create-brand-kit': return t('homeHero.chip.createBrandKit');
    case 'create-plugin': return t('homeHero.chip.createPlugin');
    case 'figma': return t('homeHero.chip.figma');
    case 'template': return t('homeHero.chip.template');
    default: return chipId;
  }
}
