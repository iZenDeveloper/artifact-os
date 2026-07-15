// Pinned per-round task-progress card (specs/current/task-progress-and-computer-
// replay.zh-CN.md §3.1). Lives ABOVE the composer (sibling of QueuedSendStrip),
// always visible, and shows only the CURRENT round's top-level steps. It is a
// thin wrapper around FlowProgressCard: it owns the collapsible header (Computer
// entry · current step · N/M · Live) and lets the card body render headless.
//
// The card is a pure renderer — all advancement lives in the daemon flow tracker
// and reaches here via the conversation FlowSnapshot.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FlowSnapshot, FlowStageId } from '@open-design/contracts';
import { useT } from '../i18n';
import type { FlowStageArtifactPaths } from '../runtime/flow-artifacts';
import { parseTodoWriteInput, type TodoItem } from '../runtime/todos';
import {
  taskStepBrief,
  taskStepGlyph,
  type TaskRound,
  type TaskStep,
} from '../runtime/task-steps';
import { FlowProgressCard, flowProgressSummary } from './FlowProgressCard';
import styles from './PinnedTaskProgress.module.css';

export type PinnedTaskRunStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | null;

export function PinnedTaskProgress({
  flow,
  round,
  todoInput,
  live,
  status = null,
  stageArtifactPaths,
  stageActions,
  onOpenArtifact,
  onOpenComputer,
}: {
  flow?: FlowSnapshot | null;
  round: TaskRound;
  /** Latest TodoWrite snapshot for lightweight edit rounds. */
  todoInput?: unknown | null;
  /** True while this round's run is still active (drives the green Live pill). */
  live: boolean;
  /** Terminal run status for this round; drives the ended-state badge once the
   * Live pill goes away, giving an unmistakable completion cue (spec §3.3). */
  status?: PinnedTaskRunStatus;
  stageArtifactPaths?: FlowStageArtifactPaths;
  stageActions?: Partial<Record<FlowStageId, () => void>>;
  onOpenArtifact?: (path: string) => void;
  /** Opens the replayable Computer panel. Rendered as a thumbnail entry when
   * provided; omitted (static glyph) until the Computer panel ships (M2). */
  onOpenComputer?: (stepId?: string) => void;
}) {
  const t = useT();
  const terminal = round.status === 'succeeded' || round.status === 'failed' || round.status === 'canceled';
  const [collapsed, setCollapsed] = useState(terminal);
  const previousTerminalRef = useRef(terminal);
  useEffect(() => {
    if (!previousTerminalRef.current && terminal) setCollapsed(true);
    previousTerminalRef.current = terminal;
  }, [terminal]);
  const todos = useMemo(() => parseTodoWriteInput(todoInput), [todoInput]);
  const flowSummary = flow ? flowProgressSummary(flow) : null;
  const stepSummary = taskRoundSummary(round.steps);
  const todoSummary = todoProgressSummary(todos);
  const summary = flowSummary
    ? {
        current: flowSummary.current,
        total: flowSummary.total,
        currentLabel: flowSummary.activeStage
          ? t(flowSummary.activeStage.labelKey)
          : t('flow.state.complete'),
        currentGlyph: flowSummary.activeStage ? '◔' : '✓',
      }
    : todos.length > 0
      ? todoSummary
      : stepSummary;

  return (
    <div className={styles.root} data-testid="pinned-task-progress" data-live={live}>
      <div className={styles.head}>
        {onOpenComputer ? (
          <button
            type="button"
            className={styles.computer}
            onClick={() => onOpenComputer()}
            aria-label={t('task.computer.open')}
            data-testid="pinned-task-computer-entry"
          >
            <ComputerGlyph />
          </button>
        ) : (
          <span className={styles.computer} aria-hidden>
            <ComputerGlyph />
          </span>
        )}
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? t('designFiles.expandGroup') : t('designFiles.collapseGroup')}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className={styles.title}>
            {collapsed ? (
              <>
                <span className={styles.currentGlyph} aria-hidden>
                  {summary.currentGlyph}
                </span>
                <span className={styles.currentLabel}>{summary.currentLabel}</span>
              </>
            ) : (
              t('flow.title')
            )}
          </span>
          <span className={styles.spacer} />
          {live ? (
            <span className={styles.live} data-testid="pinned-task-live">
              <span className={styles.liveDot} aria-hidden />
              {t('designs.badgeLive')}
            </span>
          ) : status === 'succeeded' ? (
            <span
              className={`${styles.terminal} ${styles.done}`}
              data-testid="pinned-task-status"
            >
              <span aria-hidden>✓</span>
              {t('task.status.completed')}
            </span>
          ) : status === 'failed' ? (
            <span
              className={`${styles.terminal} ${styles.failed}`}
              data-testid="pinned-task-status"
            >
              <span aria-hidden>✕</span>
              {t('task.status.failed')}
            </span>
          ) : status === 'canceled' ? (
            <span
              className={`${styles.terminal} ${styles.stopped}`}
              data-testid="pinned-task-status"
            >
              <span aria-hidden>⊘</span>
              {t('task.status.stopped')}
            </span>
          ) : null}
          <span className={styles.stepOf}>
            {t('flow.stepOf', { current: summary.current, total: summary.total })}
          </span>
          <span
            className={styles.chevron}
            data-collapsed={collapsed}
            aria-hidden
          >
            ⌄
          </span>
        </button>
      </div>
      <div
        className={`accordion-collapsible ${styles.body}${collapsed ? '' : ' open'}`}
      >
        <div className="accordion-collapsible-inner">
          <div className={styles.bodyInner}>
            {flow ? (
              <FlowProgressCard
                flow={flow}
                hideHead
                stageArtifactPaths={stageArtifactPaths}
                stageActions={stageActions}
                onOpenArtifact={onOpenArtifact}
              />
            ) : todos.length > 0 ? (
              <CompactTodoProgress todos={todos} />
            ) : (
              <CompactStepProgress steps={round.steps} onOpenComputer={onOpenComputer} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function taskRoundSummary(steps: TaskStep[]) {
  const total = Math.max(steps.length, 1);
  const activeIndex = steps.findIndex((step) => step.status === 'running');
  const lastIndex = activeIndex >= 0 ? activeIndex : Math.max(0, steps.length - 1);
  const active = steps[lastIndex];
  return {
    current: Math.min(lastIndex + 1, total),
    total,
    currentLabel: active?.brief ?? 'Task',
    currentGlyph: active ? taskStepGlyph(active.kind) : '◔',
  };
}

function todoProgressSummary(todos: TodoItem[]) {
  const total = Math.max(todos.length, 1);
  const activeIndex = todos.findIndex((todo) => todo.status === 'in_progress');
  const done = todos.filter((todo) => todo.status === 'completed').length;
  const index = activeIndex >= 0 ? activeIndex : Math.min(done, total - 1);
  const active = todos[index];
  return {
    current: Math.min(index + 1, total),
    total,
    currentLabel: active?.activeForm ?? active?.content ?? 'Task',
    currentGlyph: active?.status === 'completed' ? '✓' : active?.status === 'stopped' ? '⊘' : '◔',
  };
}

function CompactTodoProgress({ todos }: { todos: TodoItem[] }) {
  return (
    <ol className={styles.compactList} data-testid="pinned-task-todos">
      {todos.map((todo, index) => (
        <li key={`${todo.content}:${index}`} data-status={todo.status}>
          <span aria-hidden>{todo.status === 'completed' ? '✓' : todo.status === 'stopped' ? '⊘' : todo.status === 'in_progress' ? '◔' : '○'}</span>
          <span>{todo.status === 'in_progress' && todo.activeForm ? todo.activeForm : todo.content}</span>
        </li>
      ))}
    </ol>
  );
}

function CompactStepProgress({
  steps,
  onOpenComputer,
}: {
  steps: TaskStep[];
  onOpenComputer?: (stepId?: string) => void;
}) {
  const t = useT();
  return (
    <ol className={styles.compactList} data-testid="pinned-task-steps">
      {steps.length > 0 ? steps.map((step) => (
        <li key={step.id} data-status={step.status}>
          <button type="button" onClick={() => onOpenComputer?.(step.id)} disabled={!onOpenComputer}>
            <span aria-hidden>{step.status === 'done' ? '✓' : step.status === 'error' ? '✕' : '◔'}</span>
            <span>{taskStepBrief(step, t)}</span>
          </button>
        </li>
      )) : (
        <li data-status="running"><span aria-hidden>◔</span><span>{t('task.computer.empty')}</span></li>
      )}
    </ol>
  );
}

function ComputerGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="1.5" y="2.5" width="13" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 14h5M8 11.5V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
