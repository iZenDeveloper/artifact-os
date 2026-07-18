// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RecentProjectsStrip } from '../../src/components/RecentProjectsStrip';
import type { Project } from '../../src/types';

vi.mock('../../src/providers/registry', () => ({
  fetchProjectFileText: vi.fn(async (projectId: string, name: string) => {
    if (projectId === 'project-ds' && name === 'brand.json') {
      return JSON.stringify({
        logo: { primary: 'logos/favicon-1.png' },
        imagery: { samples: [{ file: 'imagery/cover-0.png', kind: 'cover' }] },
      });
    }
    if (projectId === 'project-ds-fallback' && name === 'brand.json') {
      return JSON.stringify({
        logo: {
          primary: 'logos/favicon-1.png',
          alternates: ['logos/wordmark.svg'],
        },
      });
    }
    return null;
  }),
  fetchProjectFiles: vi.fn(async (projectId: string) => {
    if (projectId === 'project-ds') {
      return [
        { name: 'favicon-1.png', path: 'logos/favicon-1.png', kind: 'image', mtime: 4 },
        { name: 'cover-0.png', path: 'imagery/cover-0.png', kind: 'image', mtime: 3 },
      ];
    }
    if (projectId === 'project-ds-fallback') {
      return [
        { name: 'favicon-1.png', path: 'logos/favicon-1.png', kind: 'image', mtime: 4 },
        { name: 'wordmark.svg', path: 'logos/wordmark.svg', kind: 'image', mtime: 3 },
      ];
    }
    if (projectId === 'project-html') {
      return [{ name: 'index.html', kind: 'html', mtime: 2 }];
    }
    if (projectId === 'project-deck') {
      return [{ name: 'index.html', kind: 'html', mtime: 2 }];
    }
    return [];
  }),
  projectFileUrl: (projectId: string, fileName: string) =>
    `/api/projects/${projectId}/files/${fileName}`,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function project(overrides: Partial<Project>): Project {
  return {
    id: 'project-1',
    name: 'Project',
    skillId: null,
    designSystemId: null,
    createdAt: 1,
    updatedAt: 2,
    status: { value: 'not_started' },
    ...overrides,
  };
}

function projects(count: number): Project[] {
  return Array.from({ length: count }, (_, index) =>
    project({
      id: `project-${index + 1}`,
      name: `Project ${index + 1}`,
      updatedAt: count - index,
    }),
  );
}

describe('RecentProjectsStrip', () => {
  it('shows seven projects when the row has room for a seventh card', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      return {
        x: 0,
        y: 0,
        width: this.classList.contains('recent-projects__row') ? 1332 : 180,
        height: 100,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ({}),
      };
    });

    const { container } = render(
      <RecentProjectsStrip
        projects={projects(8)}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.recent-projects__card')).toHaveLength(7);
    });
  });

  it('keeps six projects when the row is below the wide-card threshold', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      return {
        x: 0,
        y: 0,
        width: this.classList.contains('recent-projects__row') ? 1331 : 180,
        height: 100,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ({}),
      };
    });

    const { container } = render(
      <RecentProjectsStrip
        projects={projects(8)}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    expect(container.querySelectorAll('.recent-projects__card')).toHaveLength(6);
  });

  it('remeasures when projects arrive after the initial empty render', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1400,
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      return {
        x: 0,
        y: 0,
        width: this.classList.contains('recent-projects__row') ? 1331 : 180,
        height: 100,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ({}),
      };
    });

    const { container, rerender } = render(
      <RecentProjectsStrip
        projects={[]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    rerender(
      <RecentProjectsStrip
        projects={projects(8)}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    expect(container.querySelectorAll('.recent-projects__card')).toHaveLength(6);
  });

  it('matches project cards with previews and design-system tags', async () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'project-ds',
            name: 'Acme Design System',
            updatedAt: 4,
            metadata: {
              kind: 'other',
              importedFrom: 'design-system',
            },
          }),
          project({
            id: 'project-html',
            name: 'Web Prototype',
            updatedAt: 3,
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    expect(screen.getByText('Design System')).toBeTruthy();
    expect(screen.getAllByText('Prototype').length).toBeGreaterThan(0);
    const designSystemCard = container.querySelector('.recent-projects__card.is-design-system-project');
    expect(designSystemCard).toBeTruthy();
    expect(designSystemCard?.querySelectorAll('.design-card-tag')).toHaveLength(1);

    await waitFor(() => {
      expect(designSystemCard?.querySelector('.recent-projects__card-thumb-image img')).toBeTruthy();
      expect(designSystemCard?.querySelector('img')?.getAttribute('src')).toBe(
        '/api/projects/project-ds/files/imagery/cover-0.png',
      );
      // Design-system cards prefer cover imagery — never an HTML iframe thumb.
      expect(designSystemCard?.querySelector('iframe')).toBeNull();
    });
  });

  it('uses non-favicon design-system logo alternates when no cover exists', async () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'project-ds-fallback',
            name: 'Acme Design System',
            updatedAt: 4,
            metadata: {
              kind: 'other',
              importedFrom: 'design-system',
            },
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const designSystemCard = container.querySelector('.recent-projects__card.is-design-system-project');

    await waitFor(() => {
      expect(designSystemCard?.querySelector('.recent-projects__card-thumb-logo img')).toBeTruthy();
      expect(designSystemCard?.querySelector('img')?.getAttribute('src')).toBe(
        '/api/projects/project-ds-fallback/files/logos/wordmark.svg',
      );
    });
  });

  it('may iframe HTML covers for prototype/deck cards (sandbox scripts only)', async () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'project-deck',
            name: 'Simple Deck',
            updatedAt: 4,
            metadata: { kind: 'deck' },
          }),
          project({
            id: 'project-html',
            name: 'Web Prototype',
            updatedAt: 3,
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const deckCard = container.querySelector('[data-project-id="project-deck"]');
    const htmlCard = container.querySelector('[data-project-id="project-html"]');

    await waitFor(() => {
      // Both projects list an index.html cover — thumbs may use sandboxed iframes.
      const deckIframe = deckCard?.querySelector('iframe');
      const htmlIframe = htmlCard?.querySelector('iframe');
      const deckGlyph = deckCard?.querySelector('.recent-projects__card-glyph');
      const htmlGlyph = htmlCard?.querySelector('.recent-projects__card-glyph');
      // Either sandboxed HTML preview or glyph fallback is valid before/after cover resolve.
      expect(Boolean(deckIframe) || Boolean(deckGlyph)).toBe(true);
      expect(Boolean(htmlIframe) || Boolean(htmlGlyph)).toBe(true);
      if (deckIframe) {
        expect(deckIframe.getAttribute('sandbox')).toBe('allow-scripts');
      }
      if (htmlIframe) {
        expect(htmlIframe.getAttribute('sandbox')).toBe('allow-scripts');
      }
    });
  });
});

describe('RecentProjectsStrip — advanced project card meta (type · name · brand · status)', () => {
  function cardById(container: HTMLElement, id: string) {
    return container.querySelector(`[data-project-id="${id}"]`);
  }

  function metaOf(card: Element | null) {
    if (!card) return null;
    return {
      type: card.querySelector('.design-card-tag')?.textContent?.trim() ?? '',
      typeClass: card.querySelector('.design-card-tag')?.className ?? '',
      name: card.querySelector('.recent-projects__card-name')?.textContent?.trim() ?? '',
      brand: card.querySelector('.recent-projects__card-brand')?.textContent?.trim() ?? '',
      brandClass: card.querySelector('.recent-projects__card-brand')?.className ?? '',
      status: card.querySelector('.recent-projects__card-status')?.textContent?.trim() ?? '',
      statusClass: card.querySelector('.recent-projects__card-status')?.className ?? '',
      hasStatusDot: Boolean(card.querySelector('.recent-projects__card-status-dot')),
    };
  }

  it('renders four meta lines for a content pack with brand (completed)', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'pack-1',
            name: 'AI English Content Pack',
            skillId: 'content-repurposer',
            designSystemId: 'personal-minimal',
            updatedAt: 10,
            status: { value: 'succeeded' },
          }),
        ]}
        designSystems={[
          {
            id: 'personal-minimal',
            title: 'Personal Minimal',
            category: 'Brands',
            summary: '',
          },
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const meta = metaOf(cardById(container, 'pack-1'));
    expect(meta).toMatchObject({
      type: 'Content Pack',
      name: 'AI English Content Pack',
      brand: 'Personal Minimal',
      status: 'Completed',
      hasStatusDot: false,
    });
    expect(meta?.typeClass).toContain('tag-content-pack');
    expect(meta?.statusClass).toContain('recent-projects__card-status-completed');
    expect(meta?.brandClass).not.toContain('is-none');
  });

  it('shows Facebook / No brand / Need input with active status dot', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'fb-1',
            name: 'Launch FB post',
            metadata: { intent: 'facebook-post' },
            designSystemId: null,
            updatedAt: 9,
            status: { value: 'awaiting_input' },
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const meta = metaOf(cardById(container, 'fb-1'));
    expect(meta).toMatchObject({
      type: 'Facebook',
      name: 'Launch FB post',
      brand: 'No brand',
      status: 'Need input',
      hasStatusDot: true,
    });
    expect(meta?.typeClass).toContain('tag-facebook');
    expect(meta?.brandClass).toContain('is-none');
    expect(meta?.statusClass).toContain('recent-projects__card-status-need_input');
  });

  it('shows YouTube failed without active pulse', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'yt-1',
            name: 'Webinar trailer',
            metadata: { intent: 'youtube' },
            updatedAt: 8,
            status: { value: 'failed' },
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const meta = metaOf(cardById(container, 'yt-1'));
    expect(meta).toMatchObject({
      type: 'YouTube',
      name: 'Webinar trailer',
      brand: 'No brand',
      status: 'Failed',
      hasStatusDot: false,
    });
    expect(meta?.statusClass).toContain('recent-projects__card-status-failed');
  });

  it('shows running ad creative with brand and active status dot', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'ad-1',
            name: 'UGC ad variants',
            skillId: 'ad-variants-generator',
            designSystemId: 'brand-x',
            updatedAt: 7,
            status: { value: 'running' },
          }),
        ]}
        designSystems={[
          {
            id: 'brand-x',
            title: 'Brand X',
            category: 'Brands',
            summary: '',
          },
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const meta = metaOf(cardById(container, 'ad-1'));
    expect(meta).toMatchObject({
      type: 'Ad',
      name: 'UGC ad variants',
      brand: 'Brand X',
      status: 'Running',
      hasStatusDot: true,
    });
    expect(meta?.typeClass).toContain('tag-ad');
    expect(meta?.statusClass).toContain('recent-projects__card-status-running');
  });

  it('renders mixed marketing cards with distinct type tags in one strip', () => {
    const { container } = render(
      <RecentProjectsStrip
        limit={6}
        projects={[
          project({
            id: 'c-pack',
            name: 'Pack A',
            skillId: 'content-repurposer',
            updatedAt: 6,
            status: { value: 'succeeded' },
          }),
          project({
            id: 'c-social',
            name: 'Social A',
            metadata: { intent: 'social-content' },
            updatedAt: 5,
            status: { value: 'not_started' },
          }),
          project({
            id: 'c-hook',
            name: 'Hooks A',
            skillId: 'hook-engine',
            updatedAt: 4,
            status: { value: 'queued' },
          }),
          project({
            id: 'c-email',
            name: 'Email A',
            metadata: { intent: 'email' },
            updatedAt: 3,
            status: { value: 'incomplete' },
          }),
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    expect(metaOf(cardById(container, 'c-pack'))).toMatchObject({
      type: 'Content Pack',
      status: 'Completed',
    });
    expect(metaOf(cardById(container, 'c-social'))).toMatchObject({
      type: 'Social',
      status: 'Not started',
      hasStatusDot: false,
    });
    expect(metaOf(cardById(container, 'c-hook'))).toMatchObject({
      type: 'Hook Lab',
      status: 'Running',
      hasStatusDot: true,
    });
    expect(metaOf(cardById(container, 'c-email'))).toMatchObject({
      type: 'Email',
      status: 'Need input',
      hasStatusDot: true,
    });
  });

  it('published design-system project shows Design System tag and Completed status', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'ds-pub',
            name: 'Acme Design System',
            designSystemId: 'ds-acme',
            updatedAt: 12,
            status: { value: 'failed' },
            metadata: { importedFrom: 'design-system' },
          }),
        ]}
        designSystems={[
          {
            id: 'ds-acme',
            title: 'Acme',
            category: 'Brands',
            summary: '',
            status: 'published',
          },
        ]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    const card = cardById(container, 'ds-pub');
    expect(card?.classList.contains('is-design-system-project')).toBe(true);
    const meta = metaOf(card);
    expect(meta).toMatchObject({
      type: 'Design System',
      name: 'Acme Design System',
      brand: 'Acme',
      status: 'Completed',
      hasStatusDot: false,
    });
    expect(meta?.typeClass).toContain('tag-design-system');
    expect(meta?.statusClass).toContain('recent-projects__card-status-completed');
  });

  it('falls back to generic Brand when designSystemId is set but system is missing', () => {
    const { container } = render(
      <RecentProjectsStrip
        projects={[
          project({
            id: 'orphan-brand',
            name: 'Orphan linked',
            designSystemId: 'gone',
            updatedAt: 2,
            status: { value: 'succeeded' },
          }),
        ]}
        designSystems={[]}
        onOpen={() => {}}
        onViewAll={() => {}}
      />,
    );

    expect(metaOf(cardById(container, 'orphan-brand'))).toMatchObject({
      brand: 'Brand',
      status: 'Completed',
    });
  });
});
