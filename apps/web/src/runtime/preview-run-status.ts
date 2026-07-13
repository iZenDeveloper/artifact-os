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

export interface PreviewRunStatus {
  message: ChatMessage;
  phase: PreviewRunStatusPhase;
  elapsedMs: number;
}

function isActiveDesignRun(message: ChatMessage): boolean {
  return message.runStatus === 'queued' || message.runStatus === 'running';
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
    if (isActiveDesignRun(message)) {
      phase = 'generating';
    } else if (designDeliveryVerificationPending(message)) {
      phase = 'verifying';
    } else if (isRetryableAssistantTerminalFailure(message)) {
      phase = 'failed';
    } else if (message.runStatus === 'succeeded' && message.resultDeliveryState === 'delivered') {
      phase = 'succeeded';
    }

    // A later Design turn supersedes any prior failure. For example, a
    // clarification-only completion must not leave an earlier delivery error
    // floating over the preview while the user supplies the requested input.
    if (!phase) return null;
    const start = message.startedAt ?? message.createdAt;
    const end = isActiveDesignRun(message) ? now : (message.endedAt ?? now);
    return {
      message,
      phase,
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
