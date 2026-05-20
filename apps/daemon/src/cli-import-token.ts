import {
  APP_KEYS,
  OPEN_DESIGN_SIDECAR_CONTRACT,
  SIDECAR_DEFAULTS,
  SIDECAR_ENV,
  SIDECAR_MESSAGES,
  type MintImportTokenResult,
} from '@open-design/sidecar-proto';
import { requestJsonIpc, resolveAppIpcPath } from '@open-design/sidecar';

/**
 * Best-effort mint of a desktop-import token over the daemon's sidecar
 * IPC. Used by the `od project working-dir --dir` CLI path (and any
 * future CLI surface that hits a trust-gated `/api/*` endpoint) so a
 * gate-active daemon does not 403 same-user CLI invocations.
 *
 * Resolution order for the IPC socket:
 *   1. `OD_SIDECAR_IPC_PATH` — set by tools-dev and packaged launchers
 *      when they spawn the CLI as a child.
 *   2. `OD_SIDECAR_NAMESPACE` + the standard ipcBase convention
 *      (`/tmp/open-design/ipc/<namespace>/daemon.sock`) — covers standalone
 *      `od` invocations where the user wants to talk to a daemon that
 *      tools-dev or packaged desktop already started.
 *   3. The hard-coded `default` namespace under the standard ipcBase —
 *      the daemon's default namespace when no env override is in play.
 *
 * Returns `null` when no socket is reachable or when the daemon answers
 * "gate not active" (in which case the caller can POST without a
 * token). Returns a structured error reason on other failures so the
 * caller can surface it to the user.
 */
export async function mintImportTokenViaSidecar(
  baseDir: string,
  options: {
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
  } = {},
): Promise<{ ok: true; token: string } | { ok: false; reason: string } | null> {
  const env = options.env ?? process.env;
  const timeoutMs = options.timeoutMs ?? 800;
  const candidates: string[] = [];
  const envPath = env[SIDECAR_ENV.IPC_PATH];
  if (typeof envPath === 'string' && envPath.length > 0) {
    candidates.push(envPath);
  }
  const namespaces = new Set<string>();
  const envNamespace = env[SIDECAR_ENV.NAMESPACE];
  if (typeof envNamespace === 'string' && envNamespace.length > 0) {
    namespaces.add(envNamespace);
  }
  namespaces.add(SIDECAR_DEFAULTS.namespace);
  for (const ns of namespaces) {
    try {
      const ipc = resolveAppIpcPath({
        app: APP_KEYS.DAEMON,
        contract: OPEN_DESIGN_SIDECAR_CONTRACT,
        env,
        namespace: ns,
      });
      if (!candidates.includes(ipc)) candidates.push(ipc);
    } catch {
      // namespace validation failed — skip
    }
  }

  for (const socketPath of candidates) {
    try {
      const result = await requestJsonIpc<MintImportTokenResult>(
        socketPath,
        {
          input: { baseDir },
          type: SIDECAR_MESSAGES.MINT_IMPORT_TOKEN,
        },
        { timeoutMs },
      );
      if (result == null) continue;
      if (result.ok === true) return { ok: true, token: result.token };
      // Gate-dormant signal — daemon told us no token is needed.
      if (result.reason === 'desktop auth gate not active') return null;
      return { ok: false, reason: result.reason };
    } catch {
      // Socket not reachable or message rejected — try the next candidate.
      continue;
    }
  }
  return null;
}
