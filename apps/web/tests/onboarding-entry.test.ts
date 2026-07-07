import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  consumeOnboardingEntryForProject,
  stashOnboardingEntryForProject,
} from '../src/onboarding/onboarding-entry';

function createStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
}

describe('onboarding entry (id-keyed session hand-off)', () => {
  beforeEach(() => {
    (globalThis as unknown as { window: unknown }).window = {
      sessionStorage: createStorageStub(),
    };
  });
  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  it('round-trips a stashed entry for its project id', () => {
    stashOnboardingEntryForProject('proj-1', {
      source: 'home_recommendation',
      productType: 'product_ui',
      recommendationId: 'product_ui_prototype',
    });
    expect(consumeOnboardingEntryForProject('proj-1')).toEqual({
      source: 'home_recommendation',
      productType: 'product_ui',
      recommendationId: 'product_ui_prototype',
    });
  });

  it('carries the survey answers when present', () => {
    stashOnboardingEntryForProject('proj-1', {
      source: 'home_recommendation',
      productType: 'marketing',
      recommendationId: 'marketing_landing',
      role: 'growth',
      useCases: ['landing', 'ads'],
    });
    expect(consumeOnboardingEntryForProject('proj-1')).toEqual({
      source: 'home_recommendation',
      productType: 'marketing',
      recommendationId: 'marketing_landing',
      role: 'growth',
      useCases: ['landing', 'ads'],
    });
  });

  it('is read-once — a second consume returns null', () => {
    stashOnboardingEntryForProject('proj-1', {
      source: 'home_recommendation',
      productType: 'marketing',
      recommendationId: 'marketing_landing',
    });
    expect(consumeOnboardingEntryForProject('proj-1')).not.toBeNull();
    expect(consumeOnboardingEntryForProject('proj-1')).toBeNull();
  });

  it('returns null when nothing was stashed for that id', () => {
    expect(consumeOnboardingEntryForProject('proj-1')).toBeNull();
  });

  // The race the id-keyed slot fixes (PR #5111 review): clicking "进入 Studio"
  // and then opening an UNRELATED project before the recommended one finished
  // creating must not let that unrelated project steal the personalized context.
  // The entry is keyed by the created project id, so a concurrent mount for a
  // different id consumes nothing, and the intended project still gets it.
  it('is isolated per project id — a concurrent unrelated project cannot steal it', () => {
    stashOnboardingEntryForProject('recommended-proj', {
      source: 'home_recommendation',
      productType: 'product_ui',
      recommendationId: 'product_ui_prototype',
    });
    // An unrelated project mounts first (mid-create navigation) and reads its
    // own key — nothing there.
    expect(consumeOnboardingEntryForProject('other-proj')).toBeNull();
    // The recommendation-started project still finds its context intact.
    expect(consumeOnboardingEntryForProject('recommended-proj')).toMatchObject({
      source: 'home_recommendation',
      recommendationId: 'product_ui_prototype',
    });
  });

  it('ignores a malformed stored value', () => {
    window.sessionStorage.setItem(
      'open-design:onboarding-entry:proj-1',
      '{"source":"nope"}',
    );
    expect(consumeOnboardingEntryForProject('proj-1')).toBeNull();
  });

  it('treats a missing project id as a no-op', () => {
    expect(() =>
      stashOnboardingEntryForProject('', {
        source: 'home_recommendation',
        productType: 'general',
        recommendationId: 'general_menu',
      }),
    ).not.toThrow();
    expect(consumeOnboardingEntryForProject('')).toBeNull();
  });
});
