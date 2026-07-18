import { useEffect, useMemo, useRef, useState } from 'react';

import { trackPreviewRunStatusSurfaceView } from '../analytics/events';
import { useAnalytics } from '../analytics/provider';
import { useI18n } from '../i18n';
import type { Dict } from '../i18n/types';
import {
  formatPreviewRunElapsed,
  latestPreviewRunStatus,
  PREVIEW_RUN_SUCCESS_VISIBLE_MS,
  previewRunStatusCompletedAt,
  previewRunStatusVisibleAt,
  type PreviewRunStatus,
  type PreviewRunStatusStage,
} from '../runtime/preview-run-status';
import type { ChatMessage } from '../types';
import styles from './PreviewRunStatusBar.module.css';

const SUCCESS_EXIT_MS = 140;
/** After this, surface a soft reassurance that long runs are normal. */
const HINT_SOFT_MS = 30_000;
/** After this, surface a stronger "still working" reassurance. */
const HINT_LONG_MS = 90_000;

interface Props {
  projectId: string;
  conversationId?: string | null;
  messages: readonly ChatMessage[];
}

type StageStepId = 'analyze' | 'build' | 'verify';

const STAGE_STEPS: StageStepId[] = ['analyze', 'build', 'verify'];

function statusLabelKey(status: PreviewRunStatus):
  | 'previewRunStatus.analyzing'
  | 'previewRunStatus.generating'
  | 'previewRunStatus.verifying'
  | 'previewRunStatus.succeeded'
  | 'previewRunStatus.failed' {
  switch (status.phase) {
    case 'generating':
      return status.stage === 'analyzing'
        ? 'previewRunStatus.analyzing'
        : 'previewRunStatus.generating';
    case 'verifying':
      return 'previewRunStatus.verifying';
    case 'succeeded':
      return 'previewRunStatus.succeeded';
    case 'failed':
      return 'previewRunStatus.failed';
  }
}

function activeStepIndex(stage: PreviewRunStatusStage, phase: PreviewRunStatus['phase']): number {
  if (phase === 'succeeded') return STAGE_STEPS.length;
  if (phase === 'failed') {
    // Keep the last meaningful step so failure does not reset the pipeline.
    if (stage === 'verifying') return 2;
    if (stage === 'generating') return 1;
    return 0;
  }
  if (stage === 'analyzing') return 0;
  if (stage === 'generating') return 1;
  if (stage === 'verifying') return 2;
  return 0;
}

function stepLabelKey(step: StageStepId): keyof Dict {
  switch (step) {
    case 'analyze':
      return 'previewRunStatus.stageAnalyze';
    case 'build':
      return 'previewRunStatus.stageBuild';
    case 'verify':
      return 'previewRunStatus.stageVerify';
  }
}

function hintKeyForElapsed(elapsedMs: number, active: boolean): keyof Dict | null {
  if (!active) return null;
  if (elapsedMs >= HINT_LONG_MS) return 'previewRunStatus.hintLong';
  if (elapsedMs >= HINT_SOFT_MS) return 'previewRunStatus.hint';
  return 'previewRunStatus.hintShort';
}

/** Lightweight run feedback embedded directly in the preview canvas. */
export function PreviewRunStatusBar({
  projectId,
  conversationId,
  messages,
}: Props) {
  const { t } = useI18n();
  const analytics = useAnalytics();
  const [now, setNow] = useState(() => Date.now());
  const current = useMemo(
    () => {
      // `now` is only a render tick for active/success timers. Evaluate the
      // message set against the wall clock so switching to an old conversation
      // cannot briefly revive an already-expired success state.
      const evaluatedAt = Date.now();
      const status = latestPreviewRunStatus(messages, evaluatedAt);
      return status && previewRunStatusVisibleAt(status, evaluatedAt) ? status : null;
    },
    [conversationId, messages, now],
  );
  const [lastVisible, setLastVisible] = useState<PreviewRunStatus | null>(current);
  const [leaving, setLeaving] = useState(false);
  const exposureRef = useRef<string | null>(null);

  const currentKey = current
    ? `${current.message.id}:${current.phase}:${current.message.resultDeliveryState ?? ''}`
    : null;

  useEffect(() => {
    if (!current) {
      if (lastVisible?.phase === 'succeeded') {
        setLeaving(true);
        const clear = window.setTimeout(() => setLastVisible(null), SUCCESS_EXIT_MS);
        return () => window.clearTimeout(clear);
      }
      setLastVisible(null);
      return;
    }
    setLastVisible(current);
    setLeaving(false);
  }, [currentKey, current, lastVisible?.phase]);

  useEffect(() => {
    if (!current) return;
    if (current.phase === 'generating' || current.phase === 'verifying') {
      const interval = window.setInterval(() => setNow(Date.now()), 1_000);
      return () => window.clearInterval(interval);
    }
    if (current.phase !== 'succeeded') return;

    const completedAt = previewRunStatusCompletedAt(current);
    if (completedAt === undefined) return;
    const remaining = Math.max(0, completedAt + PREVIEW_RUN_SUCCESS_VISIBLE_MS - Date.now());
    const fade = window.setTimeout(
      () => setLeaving(true),
      Math.max(0, remaining - SUCCESS_EXIT_MS),
    );
    const expire = window.setTimeout(() => setNow(Date.now()), remaining);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(expire);
    };
  }, [currentKey, current]);

  useEffect(() => {
    if (!current || leaving || exposureRef.current === currentKey) return;
    exposureRef.current = currentKey;
    trackPreviewRunStatusSurfaceView(analytics.track, {
      page_name: 'file_manager',
      area: 'preview_run_status',
      element: 'run_status_bar',
      status: current.phase,
      ...(current.message.resultDeliveryState
        ? { delivery_state: current.message.resultDeliveryState }
        : {}),
      project_id: projectId,
      conversation_id: conversationId ?? null,
      assistant_message_id: current.message.id,
      ...(current.message.runId ? { run_id: current.message.runId } : {}),
    });
  }, [analytics.track, conversationId, current, currentKey, leaving, projectId]);

  const displayed = current ?? lastVisible;
  if (!displayed) return null;

  const elapsed = formatPreviewRunElapsed(displayed.elapsedMs);
  const isFailure = displayed.phase === 'failed';
  const isSuccess = displayed.phase === 'succeeded';
  const isActive = displayed.phase === 'generating' || displayed.phase === 'verifying';
  const label = t(statusLabelKey(displayed));
  const stepIndex = activeStepIndex(displayed.stage, displayed.phase);
  const hintKey = hintKeyForElapsed(displayed.elapsedMs, isActive);
  const hint = hintKey ? t(hintKey) : null;

  return (
    <div
      className={`${styles.root}${leaving ? ` ${styles.leaving}` : ''}`}
      data-testid="preview-run-status"
      data-phase={displayed.phase}
      data-stage={displayed.stage}
    >
      <div
        className={[
          styles.card,
          isFailure ? styles.failed : '',
          isSuccess ? styles.succeeded : '',
          isActive ? styles.active : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-busy={isActive || undefined}
      >
        <div className={styles.headline}>
          {isActive ? (
            <span className={styles.spinner} aria-hidden data-testid="preview-run-status-spinner" />
          ) : isSuccess ? (
            <span className={styles.doneMark} aria-hidden>
              ✓
            </span>
          ) : isFailure ? (
            <span className={styles.failMark} aria-hidden>
              !
            </span>
          ) : null}
          <span
            key={`${displayed.message.id}:${displayed.stage}`}
            className={styles.label}
          >
            {label}
          </span>
        </div>

        <ol className={styles.stages} aria-label={t('previewRunStatus.stagesAria')}>
          {STAGE_STEPS.map((step, index) => {
            const done = stepIndex > index || isSuccess;
            const currentStep = !isSuccess && stepIndex === index;
            return (
              <li
                key={step}
                className={[
                  styles.stage,
                  done ? styles.stageDone : '',
                  currentStep ? styles.stageCurrent : '',
                  isFailure && currentStep ? styles.stageFailed : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`preview-run-status-stage-${step}`}
                aria-current={currentStep ? 'step' : undefined}
              >
                <span className={styles.stageDot} aria-hidden />
                <span className={styles.stageLabel}>{t(stepLabelKey(step))}</span>
              </li>
            );
          })}
        </ol>

        {isFailure ? null : (
          <div className={styles.meta}>
            <span className={styles.elapsed} data-testid="preview-run-status-elapsed">
              {t('previewRunStatus.elapsed', { time: elapsed })}
            </span>
            {hint ? (
              <span className={styles.hint} data-testid="preview-run-status-hint">
                {hint}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
