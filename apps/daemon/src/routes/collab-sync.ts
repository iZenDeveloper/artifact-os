import type { Express } from 'express';
import type { ProjectSyncIntentEvent } from '@open-design/contracts';
import type { CollabRuntime } from '../collab/runtime.js';
import { contextToResourceHubPrincipal } from '../collab/resource-hub-publish-adapter.js';
import type { ResourceHubPrincipal } from '../integrations/resource-hub.js';

export interface RegisterCollabSyncRoutesDeps {
  collab: Pick<
    CollabRuntime,
    | 'scheduler'
    | 'publishedVersion'
    | 'projectSyncState'
    | 'projectOwnerMemberId'
    | 'requestTeamShare'
    | 'pullLatest'
    | 'workspaceContext'
  >;
}

const SYNC_INTENT_EVENTS: ReadonlySet<ProjectSyncIntentEvent> = new Set([
  'project_visibility_changed',
  'project_team_share_requested',
]);

/**
 * Team collaboration sync trigger, exposed as a client-driven capability . The client is authoritative about whether it is in a shared context, so
 * it drives the trigger — the daemon does not need D's visibility fact to gate
 * this. Publishing content + advancing the published ref is the resource hub; here
 * we only coalesce and flush.
 */
export function registerCollabSyncRoutes(app: Express, deps: RegisterCollabSyncRoutesDeps): void {
  const {
    scheduler,
    publishedVersion,
    projectSyncState,
    projectOwnerMemberId,
    requestTeamShare,
    pullLatest,
    workspaceContext,
  } = deps.collab;
  function headerValue(req: { get(name: string): string | undefined }, name: string): string | null {
    const value = req.get(name);
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }
  function headerBool(req: { get(name: string): string | undefined }, name: string, fallback: boolean): boolean {
    const value = headerValue(req, name);
    if (value === null) return fallback;
    if (value === 'false') return false;
    if (value === 'true') return true;
    return fallback;
  }
  function headerPrincipalForRequest(req: { get(name: string): string | undefined }): ResourceHubPrincipal | null {
    const teamId = headerValue(req, 'x-od-workspace-id');
    const memberId = headerValue(req, 'x-od-workspace-member-id');
    if (!teamId || !memberId) return null;
    const role = headerValue(req, 'x-od-workspace-role') ?? 'member';
    const lifecycleState = headerValue(req, 'x-od-workspace-lifecycle-state') ?? 'active';
    return {
      teamId,
      memberId,
      role: role === 'owner' || role === 'admin' ? role : 'member',
      lifecycleState:
        lifecycleState === 'billing_past_due' ||
        lifecycleState === 'locked' ||
        lifecycleState === 'deleting' ||
        lifecycleState === 'deleted'
          ? lifecycleState
          : 'active',
    };
  }
  async function principalForRequest(req: {
    get(name: string): string | undefined;
    headers: { authorization?: string | string[] | undefined };
  }) {
    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    return headerPrincipalForRequest(req) ?? contextToResourceHubPrincipal(await workspaceContext.current({ authorization }));
  }
  async function canShareProjectsForRequest(req: {
    get(name: string): string | undefined;
    headers: { authorization?: string | string[] | undefined };
  }) {
    const headerPrincipal = headerPrincipalForRequest(req);
    if (headerPrincipal) {
      const legacyWriteEnabled = headerBool(req, 'x-od-workspace-write-enabled', true);
      const canWriteSyncedFiles = headerBool(req, 'x-od-workspace-can-write-synced-files', legacyWriteEnabled);
      return headerBool(req, 'x-od-workspace-can-share-projects', canWriteSyncedFiles);
    }
    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    return (await workspaceContext.current({ authorization }))?.permissions.canShareProjects ?? true;
  }

  // An author-side edit landed. The publish is coalesced within the scheduler's
  // window so a burst of edits collapses into one publish.
  app.post('/api/projects/:id/collab/changed', (req, res) => {
    scheduler.notifyChanged(req.params.id, 'change');
    res.json({ ok: true });
  });

  // Run boundary — flush any pending publish immediately (publish the stable
  // end-of-run state rather than waiting out the debounce).
  app.post('/api/projects/:id/collab/publish', (req, res) => {
    scheduler.notifyChanged(req.params.id, 'run');
    scheduler.runBoundary(req.params.id);
    res.json({ ok: true });
  });

  // visibility-to-sync orchestration seam. The visibility surface flips project visibility and emits a
  // ProjectSyncIntent here; the sync trigger owns the reaction. `project_team_share_requested`
  // marks the project pending and flushes a publish (which drives E's resource
  // mechanism behind the scheduler). `project_visibility_changed` is accepted as
  // a no-op signal for now (the share request is the actionable one).
  app.post('/api/projects/:id/collab/sync-intent', async (req, res) => {
    const event = (req.body as { event?: unknown } | undefined)?.event;
    if (typeof event !== 'string' || !SYNC_INTENT_EVENTS.has(event as ProjectSyncIntentEvent)) {
      return res.status(400).json({ error: 'invalid sync intent event' });
    }
    if (event === 'project_team_share_requested') {
      // The caller sharing the project is its single writer; record their id so
      // members can distinguish it from a project of their own.
      const context = await workspaceContext.current({
        authorization: req.headers.authorization,
      });
      // Server-side permission gate, mirroring team resource sharing: a team
      // member without `canShareProjects` is refused — the client hides the
      // affordance, but the daemon must not trust the client to enforce it.
      // Header-backed callers use the same workspace identity as project CRUD;
      // requests with no workspace principal still no-op through the adapter.
      if (!(await canShareProjectsForRequest(req))) {
        return res.status(403).json({ error: 'WORKSPACE_PROJECT_SHARE_DENIED' });
      }
      requestTeamShare(req.params.id, (await principalForRequest(req)) ?? context?.workspaceMemberId);
    }
    const principal = await principalForRequest(req);
    res.json({ ok: true, syncState: projectSyncState(req.params.id, principal) });
  });

  // Member pull trigger (the sync trigger owns *when*; the resource hub fetches + extracts the bytes behind the
  // adapter). Returns the head version that was pulled.
  app.post('/api/projects/:id/collab/pull', async (req, res) => {
    const result = await pullLatest(req.params.id, await principalForRequest(req));
    res.json({ ok: true, version: result.version });
  });

  // Members poll this to learn the published head version they should pull and
  // the current sync state (local_only / pending_upload / synced / sync_failed).
  app.get('/api/projects/:id/collab/status', async (req, res) => {
    const principal = await principalForRequest(req);
    res.json({
      publishedVersion: publishedVersion(req.params.id, principal),
      syncState: projectSyncState(req.params.id, principal),
      ownerMemberId: projectOwnerMemberId(req.params.id, principal),
    });
  });
}
