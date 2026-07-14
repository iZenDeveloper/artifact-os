import type { ChatMessage } from '../types';
import {
  designDeliveryVerificationPending,
  isRetryableAssistantTerminalFailure,
} from './design-delivery';

export const PREVIEW_RUN_SUCCESS_VISIBLE_MS = 5_000;

export type PreviewRunStatusPhase =
  | 'generating'
  | 'verifying'
  | 'succeeded'
  | 'failed';

export type PreviewRunStatusStage = 'analyzing' | PreviewRunStatusPhase;

export interface PreviewRunStatus {
  message: ChatMessage;
  phase: PreviewRunStatusPhase;
  /** A real stream-derived label for the active generation phase. */
  stage: PreviewRunStatusStage;
  elapsedMs: number;
}

function isActiveDesignRun(message: ChatMessage): boolean {
  return message.runStatus === 'queued' || message.runStatus === 'running';
}

const ANALYZING_STATUS_LABELS = new Set(['requesting', 'starting', 'initializing', 'thinking']);

function activeDesignRunStage(message: ChatMessage): Extract<PreviewRunStatusStage, 'analyzing' | 'generating'> {
  const events = message.events ?? [];
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (!event) continue;
    if (event.kind === 'thinking') return 'analyzing';
    if (event.kind === 'status') {
      return ANALYZING_STATUS_LABELS.has(event.label) ? 'analyzing' : 'generating';
    }
    if (
      event.kind === 'text'
      || event.kind === 'tool_use'
      || event.kind === 'tool_result'
      || event.kind === 'live_artifact'
      || event.kind === 'live_artifact_refresh'
    ) {
      return 'generating';
    }
  }

  // A queued run has no agent event yet. Label it as analysis rather than
  // pretending design output is already being produced.
  return 'analyzing';
}

/**
 * Finds the latest Design-mode turn that deserves an explicit status in the
 * preview workspace. The source is the persisted conversation message, not
 * component state, so an in-flight or failed run survives route changes.
 */
export function latestPreviewRunStatus(
  messages: readonly ChatMessage[],
  now: number,
): PreviewRunStatus | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) continue;
    if (message.role !== 'assistant' || message.sessionMode !== 'design') continue;

    let phase: PreviewRunStatusPhase | null = null;
    let stage: PreviewRunStatusStage | null = null;
    if (isActiveDesignRun(message)) {
      phase = 'generating';
      stage = activeDesignRunStage(message);
    } else if (designDeliveryVerificationPending(message)) {
      phase = 'verifying';
      stage = 'verifying';
    } else if (isRetryableAssistantTerminalFailure(message)) {
      phase = 'failed';
      stage = 'failed';
    } else if (message.runStatus === 'succeeded' && message.resultDeliveryState === 'delivered') {
      phase = 'succeeded';
      stage = 'succeeded';
    }

    // A later Design turn supersedes any prior failure. For example, a
    // clarification-only completion must not leave an earlier delivery error
    // floating over the preview while the user supplies the requested input.
    if (!phase || !stage) return null;
    const start = message.startedAt ?? message.createdAt;
    const end = isActiveDesignRun(message) ? now : (message.endedAt ?? now);
    return {
      message,
      phase,
      stage,
      elapsedMs: start === undefined ? 0 : Math.max(0, end - start),
    };
  }
  return null;
}

export function previewRunStatusVisibleAt(
  status: PreviewRunStatus,
  now: number,
): boolean {
  if (status.phase !== 'succeeded') return true;
  // A missing end timestamp is an old/partially persisted message. Show the
  // confirmation while this page instance is alive rather than inventing a
  // completion time that could make it linger after a later return.
  if (status.message.endedAt === undefined) return true;
  return now < status.message.endedAt + PREVIEW_RUN_SUCCESS_VISIBLE_MS;
}

export function formatPreviewRunElapsed(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
