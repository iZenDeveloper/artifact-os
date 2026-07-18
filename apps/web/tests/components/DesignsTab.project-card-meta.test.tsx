// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { DesignsTab } from '../../src/components/DesignsTab';
import type { DesignSystemSummary, Project } from '../../src/types';

vi.mock('../../src/providers/registry', () => ({
  deleteLiveArtifact: vi.fn(),
  fetchLiveArtifacts: vi.fn(async () => []),
  fetchProjectFiles: vi.fn(async () => []),
  liveArtifactPreviewUrl: (projectId: string, artifactId: string) =>
    `/api/projects/${projectId}/live-artifacts/${artifactId}/preview`,
  projectFileUrl: (projectId: string, fileName: string) =>
    `/api/projects/${projectId}/files/${fileName}`,
}));

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

function renderTab(
  projects: Project[],
  designSystems: DesignSystemSummary[] = [],
) {
  return render(
    <DesignsTab
      projects={projects}
      skills={[]}
      designSystems={designSystems}
      onOpen={vi.fn()}
      onOpenLiveArtifact={vi.fn()}
      onDelete={vi.fn()}
      onRename={vi.fn()}
      isActive={false}
    />,
  );
}

function gridCardByName(name: string) {
  const nameEl = screen.getByText(name);
  const card = nameEl.closest('.design-card');
  if (!card) throw new Error(`No design-card for "${name}"`);
  return card as HTMLElement;
}

function cardMeta(card: HTMLElement) {
  return {
    type: card.querySelector('.design-card-tag')?.textContent?.trim() ?? '',
    typeClass: card.querySelector('.design-card-tag')?.className ?? '',
    name: card.querySelector('.design-card-name')?.textContent?.trim() ?? '',
    brand: card.querySelector('.design-card-brand')?.textContent?.trim() ?? '',
    brandClass: card.querySelector('.design-card-brand')?.className ?? '',
    status: card.querySelector('.design-card-status')?.textContent?.trim() ?? '',
    statusClass: card.querySelector('.design-card-status')?.className ?? '',
    hasStatusDot: Boolean(card.querySelector('.design-card-status-dot')),
  };
}

describe('DesignsTab — advanced project card meta (grid)', () => {
  beforeAll(() => {
    if (window.localStorage) return;
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear: () => store.clear(),
        getItem: (key: string) => store.get(key) ?? null,
        removeItem: (key: string) => store.delete(key),
        setItem: (key: string, value: string) => store.set(key, value),
      },
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
    // Prefer grid view for meta assertions (kanban has a different layout).
    window.localStorage.setItem('od:designs:view', 'grid');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders type · name · brand · status for content pack with brand', () => {
    renderTab(
      [
        project({
          id: 'pack-1',
          name: 'AI English pack',
          skillId: 'content-repurposer',
          designSystemId: 'pm',
          status: { value: 'succeeded' },
          updatedAt: 10,
        }),
      ],
      [
        {
          id: 'pm',
          title: 'Personal Minimal',
          category: 'Brands',
          summary: '',
        },
      ],
    );

    const meta = cardMeta(gridCardByName('AI English pack'));
    expect(meta).toMatchObject({
      type: 'Content Pack',
      name: 'AI English pack',
      brand: 'Personal Minimal',
      status: 'Completed',
      hasStatusDot: false,
    });
    expect(meta.typeClass).toContain('tag-content-pack');
    expect(meta.statusClass).toContain('design-card-status-completed');
    expect(meta.brandClass).not.toContain('is-none');
  });

  it('shows Facebook / No brand / Need input with status pulse', () => {
    renderTab([
      project({
        id: 'fb-1',
        name: 'FB product teaser',
        metadata: { intent: 'facebook-post' },
        designSystemId: null,
        status: { value: 'awaiting_input' },
        updatedAt: 9,
      }),
    ]);

    const meta = cardMeta(gridCardByName('FB product teaser'));
    expect(meta).toMatchObject({
      type: 'Facebook',
      brand: 'No brand',
      status: 'Need input',
      hasStatusDot: true,
    });
    expect(meta.typeClass).toContain('tag-facebook');
    expect(meta.brandClass).toContain('is-none');
    expect(meta.statusClass).toContain('design-card-status-need_input');
  });

  it('shows YouTube failed without pulse', () => {
    renderTab([
      project({
        id: 'yt-1',
        name: 'YouTube cutdown',
        metadata: { intent: 'youtube' },
        status: { value: 'failed' },
        updatedAt: 8,
      }),
    ]);

    const meta = cardMeta(gridCardByName('YouTube cutdown'));
    expect(meta).toMatchObject({
      type: 'YouTube',
      brand: 'No brand',
      status: 'Failed',
      hasStatusDot: false,
    });
    expect(meta.statusClass).toContain('design-card-status-failed');
  });

  it('shows running ad with brand and pulse', () => {
    renderTab(
      [
        project({
          id: 'ad-1',
          name: 'Meta ads batch',
          skillId: 'ad-variants-generator',
          designSystemId: 'bx',
          status: { value: 'running' },
          updatedAt: 7,
        }),
      ],
      [{ id: 'bx', title: 'Brand X', category: 'Brands', summary: '' }],
    );

    const meta = cardMeta(gridCardByName('Meta ads batch'));
    expect(meta).toMatchObject({
      type: 'Ad',
      brand: 'Brand X',
      status: 'Running',
      hasStatusDot: true,
    });
    expect(meta.typeClass).toContain('tag-ad');
    expect(meta.statusClass).toContain('design-card-status-running');
  });

  it('maps a marketing intent matrix across multiple grid cards', () => {
    renderTab([
      project({
        id: 'm-social',
        name: 'Social kit',
        metadata: { intent: 'social-content' },
        status: { value: 'succeeded' },
        updatedAt: 6,
      }),
      project({
        id: 'm-carousel',
        name: 'XHS carousel',
        metadata: { intent: 'carousel' },
        status: { value: 'queued' },
        updatedAt: 5,
      }),
      project({
        id: 'm-hook',
        name: 'Hook lab run',
        skillId: 'hook-engine',
        status: { value: 'incomplete' },
        updatedAt: 4,
      }),
      project({
        id: 'm-li',
        name: 'LinkedIn post',
        metadata: { intent: 'linkedin-post' },
        status: { value: 'not_started' },
        updatedAt: 3,
      }),
    ]);

    expect(cardMeta(gridCardByName('Social kit'))).toMatchObject({
      type: 'Social',
      status: 'Completed',
    });
    expect(cardMeta(gridCardByName('XHS carousel'))).toMatchObject({
      type: 'Carousel',
      status: 'Running',
      hasStatusDot: true,
    });
    expect(cardMeta(gridCardByName('Hook lab run'))).toMatchObject({
      type: 'Hook Lab',
      status: 'Need input',
      hasStatusDot: true,
    });
    expect(cardMeta(gridCardByName('LinkedIn post'))).toMatchObject({
      type: 'LinkedIn',
      status: 'Not started',
      hasStatusDot: false,
    });
  });

  it('published design-system project overrides failed run → Completed', () => {
    renderTab(
      [
        project({
          id: 'ds-1',
          name: 'Acme Design System',
          designSystemId: 'ds-acme',
          status: { value: 'failed' },
          metadata: { importedFrom: 'design-system' },
          updatedAt: 20,
        }),
      ],
      [
        {
          id: 'ds-acme',
          title: 'Acme',
          category: 'Brands',
          summary: '',
          status: 'published',
        },
      ],
    );

    const card = gridCardByName('Acme Design System');
    expect(card.classList.contains('is-design-system-project')).toBe(true);
    const meta = cardMeta(card);
    expect(meta).toMatchObject({
      type: 'Design System',
      brand: 'Acme',
      status: 'Completed',
      hasStatusDot: false,
    });
    expect(meta.typeClass).toContain('tag-design-system');
  });

  it('uses Brand fallback when linked system is missing from the list', () => {
    renderTab([
      project({
        id: 'orphan',
        name: 'Orphan brand link',
        designSystemId: 'missing',
        status: { value: 'succeeded' },
        updatedAt: 2,
      }),
    ]);

    expect(cardMeta(gridCardByName('Orphan brand link'))).toMatchObject({
      brand: 'Brand',
      status: 'Completed',
    });
  });

  it('keeps single type tag row (no legacy multi-tag chips)', () => {
    renderTab([
      project({
        id: 'single-tag',
        name: 'Single tag card',
        metadata: { intent: 'content-pack' },
        status: { value: 'succeeded' },
        updatedAt: 1,
      }),
    ]);

    const card = gridCardByName('Single tag card');
    expect(within(card).getAllByText('Content Pack')).toHaveLength(1);
    expect(card.querySelectorAll('.design-card-tag')).toHaveLength(1);
  });
});
