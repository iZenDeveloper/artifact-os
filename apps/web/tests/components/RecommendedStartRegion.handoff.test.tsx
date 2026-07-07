// @vitest-environment jsdom
//
// Regression test for the recommendation handoff race (PR #5111 review). The
// Home→Studio onboarding entry used to be stashed in a single global
// sessionStorage slot BEFORE the project was created, which let an unrelated
// project opened mid-create steal the personalized context. The fix keys the
// handoff by the created project id and moves the stash into the create success
// path — so `RecommendedStartRegion` must NOT touch sessionStorage itself and
// must instead hand the entry to `onStart`, letting the create pipeline stash
// it once the target id is known.

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { I18nProvider } from '../../src/i18n';
import { RecommendedStartRegion } from '../../src/components/RecommendedStartRegion';
import { buildRecommendation } from '../../src/onboarding/recommendation';

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

type OnStart = (input: {
  name: string;
  prompt: string;
  metadata: unknown;
  onboardingEntry: unknown;
}) => unknown;

function renderRegion(onStart: OnStart) {
  const recommendation = buildRecommendation({ role: 'designer', useCases: ['prototype'] });
  return render(
    <I18nProvider initial="en">
      <RecommendedStartRegion
        recommendation={recommendation}
        onStart={onStart as never}
        onDismiss={() => undefined}
      />
    </I18nProvider>,
  );
}

describe('RecommendedStartRegion — Start in Studio handoff', () => {
  it('hands the onboarding entry to onStart (create pipeline keys it by project id)', async () => {
    let received: Parameters<OnStart>[0] | null = null;
    const onStart = vi.fn((input: Parameters<OnStart>[0]) => {
      received = input;
      return Promise.resolve(true);
    });
    renderRegion(onStart);
    fireEvent.click(screen.getByTestId('home-recommendation-start'));
    await waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
    expect(received).toMatchObject({
      onboardingEntry: {
        source: 'home_recommendation',
        recommendationId: 'product_ui_prototype',
      },
    });
  });

  it('never writes the handoff to sessionStorage itself', async () => {
    const setItem = vi.spyOn(window.sessionStorage, 'setItem');
    const onStart = vi.fn(async () => true);
    renderRegion(onStart);
    fireEvent.click(screen.getByTestId('home-recommendation-start'));
    await waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
    await Promise.resolve();
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });

  it('does not swallow the click when onStart rejects', async () => {
    const onStart = vi.fn(async () => {
      throw new Error('create failed');
    });
    renderRegion(onStart);
    fireEvent.click(screen.getByTestId('home-recommendation-start'));
    await waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
    // Nothing was persisted, so there is no stale slot to leak on failure.
    expect(window.sessionStorage.length).toBe(0);
  });
});
