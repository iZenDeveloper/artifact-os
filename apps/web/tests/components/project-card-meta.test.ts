import { describe, expect, it } from 'vitest';

import {
  projectCardBrandLabel,
  projectCardCategory,
  projectCardStatusBucket,
  projectCardStatusIsActive,
  projectCardStatusLabel,
  projectCardTypeLabel,
  type ProjectCardCategory,
  type ProjectCardStatusBucket,
} from '../../src/components/project-card-meta';
import { en } from '../../src/i18n/locales/en';
import { vi as viDict } from '../../src/i18n/locales/vi';
import type { DesignSystemSummary, Project, ProjectDisplayStatus } from '../../src/types';
import type { Dict } from '../../src/i18n/types';

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Demo',
    skillId: null,
    designSystemId: null,
    createdAt: 1,
    updatedAt: 2,
    status: { value: 'not_started' },
    ...overrides,
  };
}

function tFrom(dict: Dict) {
  return (key: keyof Dict) => dict[key] ?? String(key);
}

const tEn = tFrom(en);
const tVi = tFrom(viDict);

const ALL_STATUSES: ProjectDisplayStatus[] = [
  'not_started',
  'queued',
  'running',
  'awaiting_input',
  'incomplete',
  'succeeded',
  'failed',
  'canceled',
];

describe('projectCardCategory — marketing intents & skills', () => {
  it.each([
    [{ metadata: { intent: 'content-pack' } }, 'content-pack'],
    [{ skillId: 'content-repurposer' }, 'content-pack'],
    [{ metadata: { intent: 'social-content' } }, 'social'],
    [{ skillId: 'social-content-factory' }, 'social'],
    [{ metadata: { intent: 'carousel' } }, 'carousel'],
    [{ skillId: 'card-xiaohongshu' }, 'carousel'],
    [{ metadata: { intent: 'short-video' } }, 'short-video'],
    [{ metadata: { intent: 'linkedin-post' } }, 'linkedin'],
    [{ metadata: { intent: 'facebook-post' } }, 'facebook'],
    [{ metadata: { intent: 'youtube' } }, 'youtube'],
    [{ metadata: { intent: 'email' } }, 'email'],
    [{ metadata: { intent: 'ad-creative' } }, 'ad'],
    [{ skillId: 'ad-variants-generator' }, 'ad'],
    [{ skillId: 'ad-creative' }, 'ad'],
    [{ metadata: { intent: 'hook-engine' } }, 'hook-engine'],
    [{ skillId: 'hook-engine' }, 'hook-engine'],
    [{ metadata: { intent: 'live-artifact' } }, 'live-artifact'],
    [{ skillId: 'live-artifact' }, 'live-artifact'],
    [{ metadata: { kind: 'deck' } }, 'slide'],
    [{ metadata: { kind: 'brand' } }, 'brand'],
    [{ metadata: { kind: 'image' } }, 'media'],
    [{ metadata: { kind: 'video' } }, 'media'],
    [{ metadata: { kind: 'audio' } }, 'media'],
    [{}, 'prototype'],
  ] as const)('maps %j → %s', (overrides, expected) => {
    expect(projectCardCategory(project(overrides as Partial<Project>))).toBe(expected);
  });

  it('prefers marketing intent over generic kind when both are present', () => {
    // Intent is the product path; kind is the storage shape.
    expect(
      projectCardCategory(
        project({
          metadata: { intent: 'content-pack', kind: 'prototype' },
        }),
      ),
    ).toBe('content-pack');
  });

  it('does not treat unknown skillId as marketing type', () => {
    expect(projectCardCategory(project({ skillId: 'random-skill' }))).toBe('prototype');
  });
});

describe('projectCardTypeLabel — i18n coverage', () => {
  const categories: ProjectCardCategory[] = [
    'prototype',
    'live-artifact',
    'slide',
    'media',
    'brand',
    'content-pack',
    'social',
    'carousel',
    'short-video',
    'linkedin',
    'facebook',
    'youtube',
    'email',
    'ad',
    'hook-engine',
    'design-system',
  ];

  it('returns non-empty English labels for every category', () => {
    for (const category of categories) {
      const label = projectCardTypeLabel(category, tEn);
      expect(label.trim().length, category).toBeGreaterThan(0);
      expect(label).not.toMatch(/^designs\./);
    }
  });

  it('returns Vietnamese marketing labels when locale is vi', () => {
    // Vietnamese dict keeps English product nouns for type tags (Content Pack, etc.)
    // but No-brand / status may differ — assert keys resolve and content-pack is present.
    expect(projectCardTypeLabel('content-pack', tVi)).toBe(viDict['designs.tagContentPack']);
    expect(projectCardTypeLabel('facebook', tVi)).toBe(viDict['designs.tagFacebook']);
    expect(projectCardTypeLabel('youtube', tVi)).toBe(viDict['designs.tagYoutube']);
  });

  it('matches product copy for marketing types in English', () => {
    expect(projectCardTypeLabel('content-pack', tEn)).toBe('Content Pack');
    expect(projectCardTypeLabel('social', tEn)).toBe('Social');
    expect(projectCardTypeLabel('facebook', tEn)).toBe('Facebook');
    expect(projectCardTypeLabel('youtube', tEn)).toBe('YouTube');
    expect(projectCardTypeLabel('hook-engine', tEn)).toBe('Hook Lab');
    expect(projectCardTypeLabel('design-system', tEn)).toBe('Design System');
  });
});

describe('projectCardStatusBucket — primary 3 states + running/idle', () => {
  it.each([
    ['succeeded', false, 'completed'],
    ['succeeded', true, 'completed'],
    ['failed', false, 'failed'],
    ['failed', true, 'completed'], // published DS overrides run failure
    ['awaiting_input', false, 'need_input'],
    ['incomplete', false, 'need_input'],
    ['running', false, 'running'],
    ['queued', false, 'running'],
    ['not_started', false, 'idle'],
    ['canceled', false, 'idle'],
  ] as const)('status=%s published=%s → %s', (status, published, expected) => {
    expect(projectCardStatusBucket(status, { published })).toBe(expected);
  });

  it('covers every ProjectDisplayStatus without falling through to unexpected values', () => {
    const allowed: ProjectCardStatusBucket[] = [
      'completed',
      'need_input',
      'failed',
      'running',
      'idle',
    ];
    for (const status of ALL_STATUSES) {
      const bucket = projectCardStatusBucket(status);
      expect(allowed).toContain(bucket);
    }
  });

  it('published design-system always buckets to completed regardless of raw status', () => {
    for (const status of ALL_STATUSES) {
      expect(projectCardStatusBucket(status, { published: true })).toBe('completed');
    }
  });
});

describe('projectCardStatusLabel', () => {
  it('maps buckets to user-facing English copy', () => {
    expect(projectCardStatusLabel('completed', tEn)).toBe('Completed');
    expect(projectCardStatusLabel('need_input', tEn)).toBe('Need input');
    expect(projectCardStatusLabel('failed', tEn)).toBe('Failed');
    expect(projectCardStatusLabel('running', tEn)).toBe('Running');
    expect(projectCardStatusLabel('idle', tEn)).toBe('Not started');
  });

  it('uses Vietnamese status strings for need_input / completed', () => {
    expect(projectCardStatusLabel('need_input', tVi)).toBe(viDict['designs.status.awaitingInput']);
    expect(projectCardStatusLabel('completed', tVi)).toBe(viDict['designs.status.succeeded']);
    expect(projectCardStatusLabel('failed', tVi)).toBe(viDict['designs.status.failed']);
  });
});

describe('projectCardStatusIsActive', () => {
  it('flags only running and need_input as active (attention / in-flight)', () => {
    expect(projectCardStatusIsActive('running')).toBe(true);
    expect(projectCardStatusIsActive('need_input')).toBe(true);
    expect(projectCardStatusIsActive('completed')).toBe(false);
    expect(projectCardStatusIsActive('failed')).toBe(false);
    expect(projectCardStatusIsActive('idle')).toBe(false);
  });
});

describe('projectCardBrandLabel', () => {
  const systems: DesignSystemSummary[] = [
    {
      id: 'personal-minimal',
      title: 'Personal Minimal',
      published: true,
    } as DesignSystemSummary,
    {
      id: 'orphan-brand',
      title: '   ',
      published: false,
    } as DesignSystemSummary,
  ];

  it('returns No brand when designSystemId is null', () => {
    expect(projectCardBrandLabel(project({ designSystemId: null }), systems, tEn)).toBe(
      'No brand',
    );
  });

  it('returns linked brand title when design system exists', () => {
    expect(
      projectCardBrandLabel(project({ designSystemId: 'personal-minimal' }), systems, tEn),
    ).toBe('Personal Minimal');
  });

  it('falls back to generic Brand when id is set but title missing/blank', () => {
    expect(
      projectCardBrandLabel(project({ designSystemId: 'orphan-brand' }), systems, tEn),
    ).toBe('Brand');
    expect(
      projectCardBrandLabel(project({ designSystemId: 'missing-id' }), systems, tEn),
    ).toBe('Brand');
  });

  it('uses Vietnamese no-brand copy', () => {
    expect(projectCardBrandLabel(project(), systems, tVi)).toBe(viDict['designs.cardNoBrand']);
  });

  it('ignores design systems list when project has no brand link', () => {
    expect(projectCardBrandLabel(project({ designSystemId: null }), systems, tEn)).toBe(
      'No brand',
    );
    expect(projectCardBrandLabel(project({ designSystemId: '' as unknown as null }), [], tEn)).toBe(
      'No brand',
    );
  });
});

describe('card meta matrix — type × brand × status combinations', () => {
  const matrix: Array<{
    name: string;
    project: Partial<Project>;
    systems?: DesignSystemSummary[];
    published?: boolean;
    expectType: ProjectCardCategory;
    expectBrand: string;
    expectStatus: ProjectCardStatusBucket;
  }> = [
    {
      name: 'content pack with brand completed',
      project: {
        skillId: 'content-repurposer',
        designSystemId: 'personal-minimal',
        status: { value: 'succeeded' },
      },
      systems: [{ id: 'personal-minimal', title: 'Personal Minimal' } as DesignSystemSummary],
      expectType: 'content-pack',
      expectBrand: 'Personal Minimal',
      expectStatus: 'completed',
    },
    {
      name: 'facebook post no brand need input',
      project: {
        metadata: { intent: 'facebook-post' },
        designSystemId: null,
        status: { value: 'awaiting_input' },
      },
      expectType: 'facebook',
      expectBrand: 'No brand',
      expectStatus: 'need_input',
    },
    {
      name: 'youtube failed',
      project: {
        metadata: { intent: 'youtube' },
        status: { value: 'failed' },
      },
      expectType: 'youtube',
      expectBrand: 'No brand',
      expectStatus: 'failed',
    },
    {
      name: 'ad running with brand',
      project: {
        skillId: 'ad-variants-generator',
        designSystemId: 'personal-minimal',
        status: { value: 'running' },
      },
      systems: [{ id: 'personal-minimal', title: 'Personal Minimal' } as DesignSystemSummary],
      expectType: 'ad',
      expectBrand: 'Personal Minimal',
      expectStatus: 'running',
    },
    {
      name: 'published DS project failed run still completed',
      project: {
        metadata: { importedFrom: 'design-system' },
        designSystemId: 'ds-1',
        status: { value: 'failed' },
      },
      systems: [{ id: 'ds-1', title: 'Client Brand' } as DesignSystemSummary],
      published: true,
      expectType: 'prototype', // category from metadata is not design-system; caller overrides
      expectBrand: 'Client Brand',
      expectStatus: 'completed',
    },
  ];

  it.each(matrix)('$name', (row) => {
    const p = project(row.project);
    expect(projectCardCategory(p)).toBe(row.expectType);
    expect(projectCardBrandLabel(p, row.systems ?? [], tEn)).toBe(row.expectBrand);
    expect(
      projectCardStatusBucket(p.status?.value ?? 'not_started', {
        published: row.published,
      }),
    ).toBe(row.expectStatus);
  });
});

describe('projectCardCategory — intent vs skill priority & edge cases', () => {
  it('prefers intent over a conflicting marketing skillId', () => {
    // Product intent is the source of truth when both are stamped.
    expect(
      projectCardCategory(
        project({
          skillId: 'content-repurposer',
          metadata: { intent: 'youtube' },
        }),
      ),
    ).toBe('content-pack'); // content-pack check runs first
    expect(
      projectCardCategory(
        project({
          skillId: 'hook-engine',
          metadata: { intent: 'facebook-post' },
        }),
      ),
    ).toBe('facebook');
  });

  it('ignores empty / non-string intent and falls through to skillId', () => {
    expect(
      projectCardCategory(
        project({
          skillId: 'social-content-factory',
          metadata: { intent: '' },
        }),
      ),
    ).toBe('social');
    expect(
      projectCardCategory(
        project({
          skillId: 'ad-variants-generator',
          metadata: { intent: 42 as unknown as string },
        }),
      ),
    ).toBe('ad');
  });

  it('does not map deck kind when marketing intent already matched', () => {
    expect(
      projectCardCategory(
        project({
          metadata: { intent: 'carousel', kind: 'deck' },
        }),
      ),
    ).toBe('carousel');
  });

  it('treats short-video intent without a dedicated skill', () => {
    expect(
      projectCardCategory(project({ metadata: { intent: 'short-video' } })),
    ).toBe('short-video');
  });
});

describe('projectCardStatusBucket — exhaustive status × published matrix', () => {
  const buckets: ProjectCardStatusBucket[] = [
    'completed',
    'need_input',
    'failed',
    'running',
    'idle',
  ];

  it('is total: every status maps when unpublished', () => {
    const seen = new Set<ProjectCardStatusBucket>();
    for (const status of ALL_STATUSES) {
      seen.add(projectCardStatusBucket(status, { published: false }));
    }
    // At least the three primary product states appear from the enum.
    expect(seen.has('completed')).toBe(true);
    expect(seen.has('need_input')).toBe(true);
    expect(seen.has('failed')).toBe(true);
    for (const b of seen) expect(buckets).toContain(b);
  });

  it('published=true forces completed even for in-flight statuses', () => {
    expect(projectCardStatusBucket('running', { published: true })).toBe('completed');
    expect(projectCardStatusBucket('awaiting_input', { published: true })).toBe(
      'completed',
    );
  });

  it('unknown status falls to idle (defensive default)', () => {
    expect(
      projectCardStatusBucket('mystery' as ProjectDisplayStatus),
    ).toBe('idle');
  });
});

describe('projectCardBrandLabel — edge cases', () => {
  it('trims brand titles with surrounding whitespace', () => {
    const systems = [
      { id: 'b1', title: '  Spaced Brand  ' } as DesignSystemSummary,
    ];
    expect(
      projectCardBrandLabel(project({ designSystemId: 'b1' }), systems, tEn),
    ).toBe('Spaced Brand');
  });

  it('does not pick the wrong brand when multiple systems exist', () => {
    const systems = [
      { id: 'a', title: 'Brand A' } as DesignSystemSummary,
      { id: 'b', title: 'Brand B' } as DesignSystemSummary,
    ];
    expect(
      projectCardBrandLabel(project({ designSystemId: 'b' }), systems, tEn),
    ).toBe('Brand B');
  });
});

describe('end-to-end card presentation contract', () => {
  /**
   * Mirrors what RecentProjectsStrip / DesignsTab compose for one card:
   * type label · name · brand · status label (+ active flag).
   */
  function present(
    p: Project,
    systems: DesignSystemSummary[],
    opts?: { published?: boolean; designSystemCategory?: boolean },
  ) {
    const category = opts?.designSystemCategory
      ? ('design-system' as ProjectCardCategory)
      : projectCardCategory(p);
    const status = p.status?.value ?? 'not_started';
    const bucket = projectCardStatusBucket(status, { published: opts?.published });
    return {
      type: projectCardTypeLabel(category, tEn),
      name: p.name,
      brand: projectCardBrandLabel(p, systems, tEn),
      status: projectCardStatusLabel(bucket, tEn),
      statusBucket: bucket,
      active: projectCardStatusIsActive(bucket),
      typeCategory: category,
    };
  }

  it('renders marketing facebook card with all four fields', () => {
    const card = present(
      project({
        name: 'FB launch post',
        metadata: { intent: 'facebook-post' },
        designSystemId: null,
        status: { value: 'awaiting_input' },
      }),
      [],
    );
    expect(card).toEqual({
      type: 'Facebook',
      name: 'FB launch post',
      brand: 'No brand',
      status: 'Need input',
      statusBucket: 'need_input',
      active: true,
      typeCategory: 'facebook',
    });
  });

  it('renders youtube + branded + failed without active pulse', () => {
    const systems = [
      { id: 'pm', title: 'Personal Minimal' } as DesignSystemSummary,
    ];
    const card = present(
      project({
        name: 'Webinar cutdown',
        metadata: { intent: 'youtube' },
        designSystemId: 'pm',
        status: { value: 'failed' },
      }),
      systems,
    );
    expect(card.type).toBe('YouTube');
    expect(card.brand).toBe('Personal Minimal');
    expect(card.status).toBe('Failed');
    expect(card.active).toBe(false);
  });

  it('renders content pack completed with brand', () => {
    const systems = [{ id: 'acme', title: 'Acme' } as DesignSystemSummary];
    const card = present(
      project({
        name: 'AI English pack',
        skillId: 'content-repurposer',
        designSystemId: 'acme',
        status: { value: 'succeeded' },
      }),
      systems,
    );
    expect(card).toMatchObject({
      type: 'Content Pack',
      name: 'AI English pack',
      brand: 'Acme',
      status: 'Completed',
      active: false,
      typeCategory: 'content-pack',
    });
  });

  it('renders published design-system as Design System / Completed', () => {
    const card = present(
      project({
        name: 'Acme Design System',
        designSystemId: 'ds-1',
        status: { value: 'failed' },
        metadata: { importedFrom: 'design-system' },
      }),
      [{ id: 'ds-1', title: 'Acme' } as DesignSystemSummary],
      { published: true, designSystemCategory: true },
    );
    expect(card.type).toBe('Design System');
    expect(card.status).toBe('Completed');
    expect(card.statusBucket).toBe('completed');
    expect(card.active).toBe(false);
  });

  it('keeps Vietnamese copy for brand + status while type tags stay product nouns', () => {
    const p = project({
      name: 'Pack VI',
      skillId: 'content-repurposer',
      status: { value: 'awaiting_input' },
    });
    const typeVi = projectCardTypeLabel(projectCardCategory(p), tVi);
    const brandVi = projectCardBrandLabel(p, [], tVi);
    const statusVi = projectCardStatusLabel(
      projectCardStatusBucket('awaiting_input'),
      tVi,
    );
    expect(typeVi).toBe(viDict['designs.tagContentPack']);
    expect(brandVi).toBe(viDict['designs.cardNoBrand']);
    expect(statusVi).toBe(viDict['designs.status.awaitingInput']);
    expect(brandVi).not.toBe('No brand'); // vi differs from en for no-brand
  });
});
