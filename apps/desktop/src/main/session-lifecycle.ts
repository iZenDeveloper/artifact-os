import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * A prior run's abnormal exit, carried across launches until its telemetry has
 * actually been acked. Persisting it (rather than holding it only in memory)
 * means a failed report — e.g. the daemon isn't reachable yet — retries on the
 * next launch instead of losing the signal this whole mechanism exists to catch.
 */
export interface DesktopCrashSummary {
  sessionId: string;
  version: string | null;
  startedAt: string;
}

/**
 * Persisted marker for one desktop run.
 *
 *  - `reachedRunning` flips true once the window is actually revealed, so a
 *    bootstrap failure BEFORE that (already covered by `packaged_runtime_failed`)
 *    isn't mistaken for a runtime crash.
 *  - `clean` flips true on a graceful quit.
 *  - `unreportedCrash` holds a prior abnormal exit until its report is acked.
 *
 * A run counts as an abnormal "runtime 闪退" when it `reachedRunning` but never
 * went `clean` — the app was up, then the process died without a graceful
 * shutdown. That class reaches no other telemetry.
 */
export interface DesktopSessionState {
  sessionId: string;
  version: string | null;
  startedAt: string;
  reachedRunning: boolean;
  clean: boolean;
  unreportedCrash?: DesktopCrashSummary | null;
}

function defaultRead(path: string): string {
  return readFileSync(path, "utf8");
}

function defaultWrite(path: string, data: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data, "utf8");
}

function parseState(raw: string): DesktopSessionState | null {
  const parsed = JSON.parse(raw) as Partial<DesktopSessionState>;
  if (parsed == null || typeof parsed.sessionId !== "string") return null;
  const uc = parsed.unreportedCrash;
  return {
    sessionId: parsed.sessionId,
    version: typeof parsed.version === "string" ? parsed.version : null,
    startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
    reachedRunning: parsed.reachedRunning === true,
    clean: parsed.clean === true,
    unreportedCrash:
      uc != null && typeof uc.sessionId === "string"
        ? { sessionId: uc.sessionId, version: typeof uc.version === "string" ? uc.version : null, startedAt: typeof uc.startedAt === "string" ? uc.startedAt : "" }
        : null,
  };
}

export interface BeginDesktopSessionDeps {
  stateFilePath: string;
  sessionId: string;
  version: string | null;
  now: () => Date;
  /** Injectable for tests; defaults to fs. */
  readFile?: (path: string) => string;
  writeFile?: (path: string, data: string) => void;
}

/**
 * Read the previous run's marker, carry forward any not-yet-reported abnormal
 * exit, then write a fresh marker for this run. Returns the crash to report
 * (this launch's newly-detected one, or an earlier one whose report never
 * acked). The returned summary is ALSO persisted in the new marker's
 * `unreportedCrash`, so it survives a failed report and is retried next launch;
 * `clearReportedCrash` removes it once the report succeeds. Best-effort — never
 * throws.
 */
export function beginDesktopSession(
  deps: BeginDesktopSessionDeps,
): { previousUncleanSession: DesktopCrashSummary | null } {
  const read = deps.readFile ?? defaultRead;
  const write = deps.writeFile ?? defaultWrite;

  let crashToReport: DesktopCrashSummary | null = null;
  try {
    const prev = parseState(read(deps.stateFilePath));
    if (prev != null) {
      if (prev.reachedRunning && !prev.clean) {
        crashToReport = { sessionId: prev.sessionId, version: prev.version, startedAt: prev.startedAt };
      } else if (prev.unreportedCrash != null) {
        crashToReport = prev.unreportedCrash;
      }
    }
  } catch {
    // No marker (first run), unreadable, or a run that never reached running.
  }

  const state: DesktopSessionState = {
    sessionId: deps.sessionId,
    version: deps.version,
    startedAt: deps.now().toISOString(),
    reachedRunning: false,
    clean: false,
    unreportedCrash: crashToReport,
  };
  try {
    write(deps.stateFilePath, JSON.stringify(state));
  } catch {
    // Best-effort.
  }
  return { previousUncleanSession: crashToReport };
}

function updateState(
  stateFilePath: string,
  patch: Partial<DesktopSessionState>,
  readFile: (path: string) => string,
  writeFile: (path: string, data: string) => void,
): void {
  try {
    const state = parseState(readFile(stateFilePath));
    if (state == null) return;
    writeFile(stateFilePath, JSON.stringify({ ...state, ...patch }));
  } catch {
    // Best-effort.
  }
}

/**
 * Flip this run's marker to `reachedRunning: true` once the window is revealed.
 * Only after this does a subsequent dirty marker count as a runtime crash.
 */
export function markDesktopSessionRunning(deps: {
  stateFilePath: string;
  readFile?: (path: string) => string;
  writeFile?: (path: string, data: string) => void;
}): void {
  updateState(deps.stateFilePath, { reachedRunning: true }, deps.readFile ?? defaultRead, deps.writeFile ?? defaultWrite);
}

/**
 * Flip this run's marker to `clean: true` on a graceful quit, so the next launch
 * doesn't misreport it as an abnormal exit. Best-effort and idempotent.
 */
export function endDesktopSessionCleanly(deps: {
  stateFilePath: string;
  readFile?: (path: string) => string;
  writeFile?: (path: string, data: string) => void;
}): void {
  updateState(deps.stateFilePath, { clean: true }, deps.readFile ?? defaultRead, deps.writeFile ?? defaultWrite);
}

/**
 * Clear the carried-forward `unreportedCrash` once its telemetry has been acked,
 * so it isn't reported again next launch.
 */
export function clearReportedCrash(deps: {
  stateFilePath: string;
  readFile?: (path: string) => string;
  writeFile?: (path: string, data: string) => void;
}): void {
  updateState(deps.stateFilePath, { unreportedCrash: null }, deps.readFile ?? defaultRead, deps.writeFile ?? defaultWrite);
}
