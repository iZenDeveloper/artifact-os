import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { coalescedGet } from '../lib/coalesced-get';
import type {
  CollabCloudMemberDirectoryEntry,
  CollabCloudMembersResponse,
} from '@open-design/contracts';
import { useWorkspaceInvalidation } from './workspace-events';

// Poll cadence for the collab-cloud member directory. ~15s is light enough to
// keep a comment author's name / role fresh (a member registers on join) without
// a heavy loop; it mirrors `useTeamProjects`'s cadence. The read is daemon-local
// (the daemon caches the directory) so the poll just refetches the whole list.
const TEAM_MEMBERS_POLL_MS = 15_000;
// Poll-as-floor cadence while the workspace SSE is connected.
const TEAM_MEMBERS_SSE_FLOOR_MS = 60_000;

export interface TeamMembersState {
  members: CollabCloudMemberDirectoryEntry[];
  /** memberId → directory entry, for O(1) author/owner resolution. */
  byId: Map<string, CollabCloudMemberDirectoryEntry>;
  /**
   * Turn an opaque `authorMemberId` / `ownerMemberId` into a `{displayName,
   * role}` entry, or null when the id is missing / not in the directory (off
   * team, or a member the daemon has not seen register yet). Callers fall back
   * to their existing id-only rendering on null.
   */
  resolve: (memberId: string | null | undefined) => CollabCloudMemberDirectoryEntry | null;
}

/**
 * Collab-cloud member directory read (`GET /api/workspace/members`). Returns the
 * team roster the client uses to render "琼羽 · Owner" on a comment card and the
 * owner name on the shared-project banner. Off-team / 404 degrades to an empty
 * map (never throws), so this is safe to mount unconditionally. Lightly polled so
 * a member who joins mid-session resolves without a refresh.
 */
export function useTeamMembers(): TeamMembersState {
  const [members, setMembers] = useState<CollabCloudMemberDirectoryEntry[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const members = await coalescedGet('workspace-members', async () => {
        const res = await fetch('/api/workspace/members');
        if (!res.ok) throw new Error(`members ${res.status}`);
        const body = (await res.json()) as CollabCloudMembersResponse;
        return body.members ?? [];
      });
      if (mountedRef.current) setMembers(members);
    } catch {
      // Personal / offline / daemon without the collab cloud: no directory.
      if (mountedRef.current) setMembers([]);
    }
  }, []);

  // Collab realtime hop-2: subscribe to the workspace SSE and re-fetch on a
  // pushed `members-changed` (someone joined/left/changed role). The daemon's
  // workspace-invalidation poller diffs the roster and pushes only on an actual
  // change. `connected` drives poll-as-floor below.
  const { connected: sseConnected } = useWorkspaceInvalidation(
    { 'members-changed': () => void load() },
    { onActive: () => void load() },
  );

  useEffect(() => {
    void load();
    // Poll-as-floor: slow the poll while the SSE is delivering, full cadence when
    // the stream is unavailable so a non-SSE client has zero regression.
    const intervalMs = sseConnected ? TEAM_MEMBERS_SSE_FLOOR_MS : TEAM_MEMBERS_POLL_MS;
    const interval = setInterval(() => {
      // Skip the poll while the tab is hidden — no point refreshing the member
      // directory for a backgrounded window.
      if (document.visibilityState === 'visible') void load();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [load, sseConnected]);

  const byId = useMemo(() => {
    const map = new Map<string, CollabCloudMemberDirectoryEntry>();
    for (const entry of members) map.set(entry.memberId, entry);
    return map;
  }, [members]);

  const resolve = useCallback(
    (memberId: string | null | undefined): CollabCloudMemberDirectoryEntry | null =>
      memberId ? byId.get(memberId) ?? null : null,
    [byId],
  );

  return { members, byId, resolve };
}
