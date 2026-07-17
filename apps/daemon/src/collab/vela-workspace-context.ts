import {
  buildWorkspacePermissions,
  buildWorkspaceSeatSummary,
} from '@open-design/contracts';
import type {
  CollabMemberRole,
  WorkspaceBillingState,
  WorkspaceCollabContext,
  WorkspaceDirectoryItem,
  WorkspaceLifecycleState,
  WorkspaceMemberStatus,
  WorkspacePermissions,
  WorkspaceProviderMode,
  WorkspaceSeatSummary,
  WorkspaceType,
} from '@open-design/contracts';
import { readVelaControlApiContext, type VelaUser } from '../integrations/vela.js';
import {
  createDevWorkspaceContextProvider,
  resolveWorkspaceSettingsUrl,
  type WorkspaceContextProvider,
  type WorkspaceContextRequest,
} from './workspace-context.js';

// Real B-integration provider (T2). The daemon reuses the SAME vela login session
// that AMR / the vela CLI use — `readVelaControlApiContext` reads the control key
// + api url from ~/.amr/config.json (or env) — and calls B's authoritative
// `GET /api/v1/workspaces/current`, which authenticates that session and returns
// the CurrentWorkspaceContext. No second identity: one vela session drives AMR,
// resource sharing, and the workspace context. Any failure (no session, signed
// out, B unreachable) degrades to null → collab stays single-player, never throws.

const WORKSPACE_CURRENT_PATH = '/api/v1/workspaces/current';
const DEFAULT_TIMEOUT_MS = 8_000;
// After a FAILED default-workspace bootstrap (empty directory, PUT rejected),
// don't re-list on every poller tick — B is asked again after this window.
const BOOTSTRAP_FAILURE_COOLDOWN_MS = 60_000;

const WORKSPACE_TYPES = new Set<WorkspaceType>(['personal', 'team']);
const ROLES = new Set<CollabMemberRole>(['owner', 'admin', 'member']);
const MEMBER_STATUSES = new Set<WorkspaceMemberStatus>(['active', 'removed']);
const LIFECYCLE_STATES = new Set<WorkspaceLifecycleState>([
  'active',
  'billing_past_due',
  'locked',
  'deleting',
  'deleted',
]);
const BILLING_STATES = new Set<WorkspaceBillingState>([
  'free',
  'active',
  'past_due',
  'canceled',
  'inactive',
  'locked',
]);
const PROVIDER_MODES = new Set<WorkspaceProviderMode>(['platform_credits', 'personal_byok']);

interface VelaWorkspaceContextOptions {
  /** Injectable for tests. */
  fetch?: typeof fetch;
  /** Injectable for tests; defaults to reading ~/.amr/config.json + env. */
  readSession?: typeof readVelaControlApiContext;
  /** OD-local active workspace selection. Vela Web does not own this. */
  getActiveWorkspaceId?: () => string | null | undefined;
  timeoutMs?: number;
}

/**
 * Map B's `GET /api/v1/workspaces/current` body onto our WorkspaceCollabContext.
 * The shape is a faithful mirror of B's CurrentWorkspaceContext, so this is a
 * near pass-through with two adjustments:
 *  - `teamId` is derived as `workspaceId` for a team workspace: B has no separate
 *    team id — the workspace IS the team scope the resource hub keys resources by.
 *  - `permissions` / `seatSummary` are trusted from B when well-formed, and
 *    defensively re-derived (so read-only gating never breaks) if B omits them.
 * Returns null when a required field is missing or an enum is out of range —
 * collab then stays dormant rather than acting on a malformed context.
 */
export function mapVelaWorkspaceContext(input: unknown): WorkspaceCollabContext | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const workspaceId = str(raw.workspaceId);
  const workspaceMemberId = str(raw.workspaceMemberId);
  if (!workspaceId || !workspaceMemberId) return null;
  if (!WORKSPACE_TYPES.has(raw.workspaceType as WorkspaceType)) return null;
  if (!ROLES.has(raw.role as CollabMemberRole)) return null;
  if (!MEMBER_STATUSES.has(raw.memberStatus as WorkspaceMemberStatus)) return null;
  if (!LIFECYCLE_STATES.has(raw.lifecycleState as WorkspaceLifecycleState)) return null;
  if (!PROVIDER_MODES.has(raw.providerMode as WorkspaceProviderMode)) return null;

  const workspaceType = raw.workspaceType as WorkspaceType;
  const role = raw.role as CollabMemberRole;
  const memberStatus = raw.memberStatus as WorkspaceMemberStatus;
  const lifecycleState = raw.lifecycleState as WorkspaceLifecycleState;
  const billingState = BILLING_STATES.has(raw.billingState as WorkspaceBillingState)
    ? raw.billingState as WorkspaceBillingState
    : billingStateFromLifecycle(lifecycleState);

  const context: WorkspaceCollabContext = {
    workspaceId,
    workspaceType,
    workspaceMemberId,
    role,
    memberStatus,
    lifecycleState,
    billingState,
    planId: str(raw.planId) || null,
    providerMode: raw.providerMode as WorkspaceProviderMode,
    seatSummary: parseSeatSummary(raw.seatSummary),
    permissions:
      parsePermissions(raw.permissions) ??
      buildWorkspacePermissions({ role, lifecycleState, memberStatus }),
  };
  const billingRecovery = parseBillingRecovery(raw.billingRecovery);
  if (billingRecovery) context.billingRecovery = billingRecovery;
  const lastActive = str(raw.lastActiveWorkspaceId);
  if (lastActive) context.lastActiveWorkspaceId = lastActive;
  // The team workspace IS the team scope; carry its id as teamId so the resource
  // hub principal derives from this one context.
  const settingsUrl = resolveWorkspaceSettingsUrl(
    workspaceId,
    (raw as { workspaceSettingsUrl?: unknown }).workspaceSettingsUrl,
  );
  if (settingsUrl) context.workspaceSettingsUrl = settingsUrl;

  if (workspaceType === 'team') {
    context.teamId = workspaceId;
  }
  const workspaceName = str((raw as { workspaceName?: unknown }).workspaceName);
  if (workspaceName && workspaceType === 'team') context.teamName = workspaceName;
  const displayName = str((raw as { displayName?: unknown }).displayName);
  if (displayName) context.displayName = displayName;
  return context;
}

export function mapVelaWorkspaceDirectory(input: unknown): WorkspaceDirectoryItem[] {
  if (!input || typeof input !== 'object') return [];
  const raw = input as { items?: unknown };
  if (!Array.isArray(raw.items)) return [];
  const items: WorkspaceDirectoryItem[] = [];
  for (const entry of raw.items) {
    const mapped = mapVelaWorkspaceDirectoryItem(entry);
    if (mapped) items.push(mapped);
  }
  return items;
}

function mapVelaWorkspaceDirectoryItem(input: unknown): WorkspaceDirectoryItem | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const workspaceId = str(raw.workspaceId);
  const workspaceName = str(raw.workspaceName);
  const workspaceMemberId = str(raw.workspaceMemberId);
  if (!workspaceId || !workspaceName || !workspaceMemberId) return null;
  if (!WORKSPACE_TYPES.has(raw.workspaceType as WorkspaceType)) return null;
  if (!ROLES.has(raw.role as CollabMemberRole)) return null;
  if (!MEMBER_STATUSES.has(raw.memberStatus as WorkspaceMemberStatus)) return null;
  if (!LIFECYCLE_STATES.has(raw.lifecycleState as WorkspaceLifecycleState)) return null;
  const item: WorkspaceDirectoryItem = {
    workspaceId,
    workspaceName,
    workspaceType: raw.workspaceType as WorkspaceType,
    workspaceMemberId,
    role: raw.role as CollabMemberRole,
    memberStatus: raw.memberStatus as WorkspaceMemberStatus,
    lifecycleState: raw.lifecycleState as WorkspaceLifecycleState,
  };
  const workspaceIconKey = str(raw.workspaceIconKey);
  if (workspaceIconKey) item.workspaceIconKey = workspaceIconKey;
  return item;
}

/**
 * Provider that fetches the workspace context from B using the local vela
 * session. Swap this in for the dev stub once a B-backed vela is reachable.
 */
export function createVelaWorkspaceContextProvider(
  options: VelaWorkspaceContextOptions = {},
): WorkspaceContextProvider {
  const fetchImpl = options.fetch ?? fetch;
  const readSession = options.readSession ?? readVelaControlApiContext;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  type VelaSession = NonNullable<ReturnType<typeof readVelaControlApiContext>>;
  let lastBootstrapFailureAt = 0;

  async function putCurrentWorkspace(
    session: VelaSession,
    workspaceId: string,
  ): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(new URL(WORKSPACE_CURRENT_PATH, session.apiUrl), {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${session.controlKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ workspaceId }),
        signal: controller.signal,
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchCurrent(
    session: VelaSession,
    activeWorkspaceId: string | undefined,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const url = new URL(WORKSPACE_CURRENT_PATH, session.apiUrl);
      if (activeWorkspaceId) url.searchParams.set('workspaceId', activeWorkspaceId);
      return await fetchImpl(url, {
        method: 'GET',
        headers: { authorization: `Bearer ${session.controlKey}` },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * New-user self-heal. B's workspace selection is server-side state: a fresh
   * account has NO current workspace until something PUTs one, and until then
   * every workspace-scoped call fails `403 missing_principal` — the client
   * would be dead on arrival. When the current-context read reports exactly
   * that, list the account's workspaces and select a default (the OD-active
   * selection when it exists in the directory, else the personal workspace,
   * else the first active membership), then let the caller re-read once.
   */
  async function bootstrapDefaultWorkspace(session: VelaSession): Promise<boolean> {
    if (Date.now() - lastBootstrapFailureAt < BOOTSTRAP_FAILURE_COOLDOWN_MS) return false;
    const items = await listVelaWorkspaceDirectory({
      fetch: fetchImpl,
      readSession: () => session,
      timeoutMs,
    });
    const candidates = items.filter(
      (item) => item.memberStatus === 'active' && item.lifecycleState === 'active',
    );
    const preferredId = options.getActiveWorkspaceId?.()?.trim();
    const pick =
      (preferredId ? candidates.find((item) => item.workspaceId === preferredId) : undefined) ??
      candidates.find((item) => item.workspaceType === 'personal') ??
      candidates[0];
    if (!pick) {
      lastBootstrapFailureAt = Date.now();
      return false;
    }
    const ok = await putCurrentWorkspace(session, pick.workspaceId);
    if (!ok) lastBootstrapFailureAt = Date.now();
    return ok;
  }

  return {
    async selectWorkspace(workspaceId: string): Promise<boolean> {
      const session = readSession();
      if (!session || !session.controlKey || !session.apiUrl) return false;
      return putCurrentWorkspace(session, workspaceId);
    },
    async current(_req: WorkspaceContextRequest): Promise<WorkspaceCollabContext | null> {
      const session = readSession();
      if (!session || !session.controlKey || !session.apiUrl) return null;
      try {
        const activeWorkspaceId = options.getActiveWorkspaceId?.()?.trim() || undefined;
        let response = await fetchCurrent(session, activeWorkspaceId);
        if (!response.ok) {
          // 401 = signed out at the vela layer → single-player, never bootstrap.
          // 403 missing_principal = authenticated but no current workspace on
          // B (fresh account) → self-heal once, then re-read.
          if (response.status === 403 && (await responseIsMissingPrincipal(response))) {
            if (await bootstrapDefaultWorkspace(session)) {
              response = await fetchCurrent(session, activeWorkspaceId);
            }
          }
          if (!response.ok) return null;
        }
        const body: unknown = await response.json();
        const context = mapVelaWorkspaceContext(body);
        if (context && !context.displayName) {
          const displayName = velaUserDisplayName(session.user);
          if (displayName) context.displayName = displayName;
        }
        return context;
      } catch {
        // Never let a workspace-context failure throw into collab — degrade to
        // single-player. A transient B outage must not break the local editor.
        return null;
      }
    },
  };
}

async function responseIsMissingPrincipal(response: Response): Promise<boolean> {
  try {
    const body: unknown = await response.json();
    return JSON.stringify(body).includes('missing_principal');
  } catch {
    return false;
  }
}

function velaUserDisplayName(user: VelaUser | null): string {
  const name = str(user?.name);
  if (name) return name;
  const email = str(user?.email);
  if (email) return email;
  return str(user?.id);
}

export async function listVelaWorkspaceDirectory(
  options: VelaWorkspaceContextOptions = {},
): Promise<WorkspaceDirectoryItem[]> {
  const fetchImpl = options.fetch ?? fetch;
  const readSession = options.readSession ?? readVelaControlApiContext;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const session = readSession();
  if (!session || !session.controlKey || !session.apiUrl) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(new URL('/api/v1/workspaces', session.apiUrl), {
      method: 'GET',
      headers: { authorization: `Bearer ${session.controlKey}` },
      signal: controller.signal,
    });
    if (!response.ok) return [];
    return mapVelaWorkspaceDirectory(await response.json());
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Select the workspace-context provider for this run. `OD_WORKSPACE_CONTEXT_SOURCE
 * =vela` opts into the real B-backed provider (production / e2e against a live
 * vela); every other value keeps the dev stub, so demo and tools-dev runs — which
 * have no B and drive the context via the dev PUT — are unaffected.
 */
export function createWorkspaceContextProviderFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  options: Pick<VelaWorkspaceContextOptions, 'getActiveWorkspaceId'> = {},
): WorkspaceContextProvider {
  if (env.OD_WORKSPACE_CONTEXT_SOURCE?.trim() === 'vela') {
    return createVelaWorkspaceContextProvider(options);
  }
  return createDevWorkspaceContextProvider();
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function billingStateFromLifecycle(
  lifecycleState: WorkspaceLifecycleState,
): WorkspaceBillingState {
  if (lifecycleState === 'billing_past_due') return 'past_due';
  if (lifecycleState === 'locked') return 'locked';
  if (lifecycleState === 'deleting' || lifecycleState === 'deleted') {
    return 'inactive';
  }
  return 'active';
}

function parseSeatSummary(value: unknown): WorkspaceSeatSummary {
  if (value && typeof value === 'object') {
    const raw = value as Record<string, unknown>;
    if (typeof raw.seatLimit === 'number' && typeof raw.usedSeats === 'number') {
      // Re-derive availableSeats/isSeatFull from the authoritative counts so a
      // stale or inconsistent summary can never disagree with itself.
      return buildWorkspaceSeatSummary({ seatLimit: raw.seatLimit, usedSeats: raw.usedSeats });
    }
  }
  return buildWorkspaceSeatSummary({ seatLimit: 0, usedSeats: 0 });
}

function parsePermissions(value: unknown): WorkspacePermissions | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const keys: (keyof WorkspacePermissions)[] = [
    'canManageMembers',
    'canManageBilling',
    'canInviteMembers',
    'canManageAutoRecharge',
    'canShareProjects',
    'canWriteSyncedFiles',
    'canViewWorkspaceSettings',
    'canManageSharedResources',
  ];
  const permissions = {} as WorkspacePermissions;
  for (const key of keys) {
    if (typeof raw[key] !== 'boolean') return null;
    permissions[key] = raw[key] as boolean;
  }
  return permissions;
}

function parseBillingRecovery(
  value: unknown,
): { canEnterBillingRecovery: boolean; recoveryUrl: string | null } | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.canEnterBillingRecovery !== 'boolean') return null;
  return {
    canEnterBillingRecovery: raw.canEnterBillingRecovery,
    recoveryUrl: typeof raw.recoveryUrl === 'string' ? raw.recoveryUrl : null,
  };
}
