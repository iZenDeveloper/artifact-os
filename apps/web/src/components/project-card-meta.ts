// Shared project-card presentation: type · name · brand · status.
// Used by RecentProjectsStrip (Home) and DesignsTab (Projects).

import type { Dict } from '../i18n/types';
import type { DesignSystemSummary, Project, ProjectDisplayStatus } from '../types';

export type ProjectCardCategory =
  | 'prototype'
  | 'live-artifact'
  | 'slide'
  | 'media'
  | 'brand'
  | 'content-pack'
  | 'social'
  | 'carousel'
  | 'short-video'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'email'
  | 'ad'
  | 'hook-engine'
  | 'design-system';

/** User-facing status buckets for project cards. */
export type ProjectCardStatusBucket =
  | 'completed'
  | 'need_input'
  | 'failed'
  | 'running'
  | 'idle';

type Translate = (key: keyof Dict) => string;

export function projectCardCategory(project: Project): ProjectCardCategory {
  const meta = project.metadata;
  const intent = typeof meta?.intent === 'string' ? meta.intent : '';
  if (intent === 'content-pack' || project.skillId === 'content-repurposer') return 'content-pack';
  if (intent === 'social-content' || project.skillId === 'social-content-factory') return 'social';
  if (intent === 'carousel' || project.skillId === 'card-xiaohongshu') return 'carousel';
  if (intent === 'short-video') return 'short-video';
  if (intent === 'linkedin-post') return 'linkedin';
  if (intent === 'facebook-post') return 'facebook';
  if (intent === 'youtube') return 'youtube';
  if (intent === 'email') return 'email';
  if (intent === 'ad-creative' || project.skillId === 'ad-creative' || project.skillId === 'ad-variants-generator') {
    return 'ad';
  }
  if (intent === 'hook-engine' || project.skillId === 'hook-engine') return 'hook-engine';
  if (meta?.intent === 'live-artifact' || project.skillId === 'live-artifact') return 'live-artifact';
  if (meta?.kind === 'deck') return 'slide';
  if (meta?.kind === 'brand') return 'brand';
  if (meta?.kind === 'image' || meta?.kind === 'video' || meta?.kind === 'audio') return 'media';
  return 'prototype';
}

export function projectCardTypeLabel(
  category: ProjectCardCategory,
  t: Translate,
): string {
  switch (category) {
    case 'live-artifact':
      return t('designs.tagLiveArtifact');
    case 'slide':
      return t('designs.tagSlide');
    case 'brand':
      return t('designs.tagBrand');
    case 'media':
      return t('designs.tagMedia');
    case 'content-pack':
      return t('designs.tagContentPack');
    case 'social':
      return t('designs.tagSocial');
    case 'carousel':
      return t('designs.tagCarousel');
    case 'short-video':
      return t('designs.tagShortVideo');
    case 'linkedin':
      return t('designs.tagLinkedin');
    case 'facebook':
      return t('designs.tagFacebook');
    case 'youtube':
      return t('designs.tagYoutube');
    case 'email':
      return t('designs.tagEmail');
    case 'ad':
      return t('designs.tagAd');
    case 'hook-engine':
      return t('designs.tagHookEngine');
    case 'design-system':
      return t('designs.tagDesignSystem');
    default:
      return t('designs.tagPrototype');
  }
}

/**
 * Collapse run/project status into the 3 primary card states (+ running/idle).
 * Published design-system projects count as completed.
 */
export function projectCardStatusBucket(
  status: ProjectDisplayStatus,
  options?: { published?: boolean },
): ProjectCardStatusBucket {
  if (options?.published) return 'completed';
  switch (status) {
    case 'succeeded':
      return 'completed';
    case 'awaiting_input':
    case 'incomplete':
      return 'need_input';
    case 'failed':
      return 'failed';
    case 'running':
    case 'queued':
      return 'running';
    case 'not_started':
    case 'canceled':
    default:
      return 'idle';
  }
}

export function projectCardStatusLabel(
  bucket: ProjectCardStatusBucket,
  t: Translate,
): string {
  switch (bucket) {
    case 'completed':
      return t('designs.status.succeeded');
    case 'need_input':
      return t('designs.status.awaitingInput');
    case 'failed':
      return t('designs.status.failed');
    case 'running':
      return t('designs.status.running');
    case 'idle':
      return t('designs.status.notStarted');
  }
}

/** Brand title when linked; otherwise "No brand". */
export function projectCardBrandLabel(
  project: Project,
  designSystems: readonly DesignSystemSummary[],
  t: Translate,
): string {
  const id = project.designSystemId;
  if (!id) return t('designs.cardNoBrand');
  const title = designSystems.find((system) => system.id === id)?.title;
  return title?.trim() || t('designs.cardBrandLinked');
}

export function projectCardStatusIsActive(bucket: ProjectCardStatusBucket): boolean {
  return bucket === 'running' || bucket === 'need_input';
}
