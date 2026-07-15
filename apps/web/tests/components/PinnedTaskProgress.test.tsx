// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyFlowMarker, createFlowSnapshot } from '@open-design/contracts';
import { PinnedTaskProgress } from '../../src/components/PinnedTaskProgress';
import type { TaskRound } from '../../src/runtime/task-steps';

afterEach(cleanup);

function clarifyActiveDeck() {
  let flow = createFlowSnapshot('deck', { now: 1 });
  flow = applyFlowMarker(flow, { stage: 'clarify', state: 'active' }, 1);
  return flow;
}

function round(status: TaskRound['status'] = 'running'): TaskRound {
  return {
    assistantMessageId: 'a1',
    runId: 'run-1',
    events: [],
    steps: [{ id: 's1', kind: 'plan', status: status === 'running' ? 'running' : 'done', brief: 'Task plan', title: 'Task plan', ts: 1 }],
    status,
    live: status === 'running',
  };
}

describe('PinnedTaskProgress', () => {
  it('renders the current-round flow ladder with a Live pill while running', () => {
    render(<PinnedTaskProgress flow={clarifyActiveDeck()} round={round()} live />);

    const pinned = screen.getByTestId('pinned-task-progress');
    // The flow ladder lives inside the pinned card (headless FlowProgressCard).
    expect(pinned.contains(screen.getByTestId('flow-progress-card'))).toBe(true);
    // Expanded header shows the section title + a Live pill.
    expect(screen.getByText('Task progress')).toBeTruthy();
    expect(screen.getByTestId('pinned-task-live').textContent).toContain('Live');
    expect(screen.queryByTestId('pinned-task-status')).toBeNull();
  });

  it('shows a terminal status badge once the round has ended', () => {
    let flow = createFlowSnapshot('deck', { now: 1 });
    flow = applyFlowMarker(flow, { stage: 'deliver', state: 'active' }, 1);

    render(<PinnedTaskProgress flow={flow} round={round('succeeded')} live={false} status="succeeded" />);

    expect(screen.getByTestId('pinned-task-status').textContent).toContain('Task completed');
    expect(screen.queryByTestId('pinned-task-live')).toBeNull();
  });

  it('toggles between the expanded ladder and the collapsed single row', () => {
    render(<PinnedTaskProgress flow={clarifyActiveDeck()} round={round()} live />);
    const pinned = screen.getByTestId('pinned-task-progress');

    // Expanded: the accordion body is open.
    expect(pinned.querySelector('.accordion-collapsible.open')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }));

    // Collapsed: body closed, toggle now offers to expand.
    expect(pinned.querySelector('.accordion-collapsible.open')).toBeNull();
    expect(screen.getByRole('button', { name: 'Expand' })).toBeTruthy();
  });

  it('exposes a Computer entry only when a handler is provided', () => {
    const onOpenComputer = vi.fn();
    const { rerender } = render(<PinnedTaskProgress flow={clarifyActiveDeck()} round={round()} live />);
    expect(screen.queryByTestId('pinned-task-computer-entry')).toBeNull();

    rerender(
      <PinnedTaskProgress flow={clarifyActiveDeck()} round={round()} live onOpenComputer={onOpenComputer} />,
    );
    fireEvent.click(screen.getByTestId('pinned-task-computer-entry'));
    expect(onOpenComputer).toHaveBeenCalledTimes(1);
  });
});
