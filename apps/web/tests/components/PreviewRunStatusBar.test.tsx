// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { analyticsTrack } = vi.hoisted(() => ({ analyticsTrack: vi.fn() }));

vi.mock('../../src/analytics/provider', () => ({
  useAnalytics: () => ({ track: analyticsTrack }),
}));

import { PreviewRunStatusBar } from '../../src/components/PreviewRunStatusBar';
import { I18nProvider } from '../../src/i18n';
import { en } from '../../src/i18n/locales/en';
import type { ChatMessage } from '../../src/types';

const STARTED_AT = 1_700_000_000_000;

function deliveredMessage(): ChatMessage {
  return {
    id: 'delivered-message',
    role: 'assistant',
    content: '',
    sessionMode: 'design',
    runStatus: 'succeeded',
    resultDeliveryState: 'delivered',
    createdAt: STARTED_AT,
    startedAt: STARTED_AT,
    endedAt: STARTED_AT,
  };
}

function runningMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'running-message',
    role: 'assistant',
    content: '',
    sessionMode: 'design',
    runStatus: 'running',
    createdAt: STARTED_AT,
    startedAt: STARTED_AT,
    events: [],
    ...overrides,
  };
}

function renderStatus(messages: ChatMessage[]) {
  return render(
    <I18nProvider initial="en">
      <PreviewRunStatusBar
        projectId="project-1"
        conversationId="conversation-1"
        messages={messages}
      />
    </I18nProvider>,
  );
}

describe('PreviewRunStatusBar', () => {
  afterEach(() => {
    cleanup();
    analyticsTrack.mockReset();
    vi.useRealTimers();
  });

  it('does not flash or track an already-expired delivered turn after an idle rerender', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT);
    const { rerender } = renderStatus([]);

    vi.advanceTimersByTime(6_000);
    rerender(
      <I18nProvider initial="en">
        <PreviewRunStatusBar
          projectId="project-1"
          conversationId="conversation-2"
          messages={[deliveredMessage()]}
        />
      </I18nProvider>,
    );

    expect(screen.queryByTestId('preview-run-status')).toBeNull();
    expect(analyticsTrack).not.toHaveBeenCalled();
  });

  it('shows spinner, stage rail, elapsed, and short hint while analyzing', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT + 12_000);

    renderStatus([runningMessage()]);

    expect(screen.getByTestId('preview-run-status')).toBeTruthy();
    expect(screen.getByTestId('preview-run-status-spinner')).toBeTruthy();
    expect(screen.getByText(en['previewRunStatus.analyzing'])).toBeTruthy();
    expect(screen.getByTestId('preview-run-status-stage-analyze').className).toMatch(
      /stageCurrent/,
    );
    expect(screen.getByTestId('preview-run-status-elapsed').textContent).toContain(
      'Elapsed 0:12',
    );
    expect(screen.getByTestId('preview-run-status-hint').textContent).toBe(
      en['previewRunStatus.hintShort'],
    );
  });

  it('advances stage rail to Build when agent starts producing output', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT + 20_000);

    renderStatus([
      runningMessage({
        events: [
          { id: 'e1', kind: 'tool_use', name: 'Write', input: {}, status: 'running' } as never,
        ],
      }),
    ]);

    expect(screen.getByText(en['previewRunStatus.generating'])).toBeTruthy();
    expect(screen.getByTestId('preview-run-status-stage-analyze').className).toMatch(
      /stageDone/,
    );
    expect(screen.getByTestId('preview-run-status-stage-build').className).toMatch(
      /stageCurrent/,
    );
  });

  it('shows stronger long-run reassurance after 90 seconds', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT + 95_000);

    renderStatus([runningMessage()]);

    expect(screen.getByTestId('preview-run-status-hint').textContent).toBe(
      en['previewRunStatus.hintLong'],
    );
    expect(screen.getByTestId('preview-run-status-elapsed').textContent).toContain(
      'Elapsed 1:35',
    );
  });

  it('shows success mark and completed stage rail briefly after delivery', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT);

    renderStatus([deliveredMessage()]);

    expect(screen.getByText(en['previewRunStatus.succeeded'])).toBeTruthy();
    expect(screen.getByTestId('preview-run-status-stage-verify').className).toMatch(
      /stageDone|stageCurrent/,
    );
    // All three stages should be marked done on success.
    expect(screen.getByTestId('preview-run-status-stage-analyze').className).toMatch(
      /stageDone/,
    );
    expect(screen.getByTestId('preview-run-status-stage-build').className).toMatch(
      /stageDone/,
    );
  });

  it('ticks elapsed while the run stays active and upgrades the soft hint', () => {
    vi.useFakeTimers();
    vi.setSystemTime(STARTED_AT + 5_000);
    renderStatus([runningMessage()]);

    expect(screen.getByTestId('preview-run-status-elapsed').textContent).toContain(
      'Elapsed 0:05',
    );
    expect(screen.getByTestId('preview-run-status-hint').textContent).toBe(
      en['previewRunStatus.hintShort'],
    );

    act(() => {
      // setInterval callback reads Date.now(); jump past the soft-hint threshold.
      vi.setSystemTime(STARTED_AT + 40_000);
      vi.advanceTimersByTime(1_000);
    });

    const elapsedText =
      screen.getByTestId('preview-run-status-elapsed').textContent ?? '';
    // Interval may also advance the fake clock by 1s — accept either 0:40 or 0:41.
    expect(elapsedText).toMatch(/Elapsed 0:4[01]/);
    expect(screen.getByTestId('preview-run-status-hint').textContent).toBe(
      en['previewRunStatus.hint'],
    );
  });
});
