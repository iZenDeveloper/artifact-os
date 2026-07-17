import { describe, expect, it, vi } from 'vitest';
import {
  createVelaWorkspaceContextProvider,
  mapVelaWorkspaceContext,
} from '../src/collab/vela-workspace-context.js';

// A well-formed body as B's GET /api/v1/workspaces/current returns it — a team
// member on a BYOK provider (workspace features stay on regardless of provider).
const B_TEAM_CONTEXT = {
  userId: 'auth-user-1',
  appUserId: 'app-user-1',
  workspaceId: 'ws-team-1',
  workspaceType: 'team',
  workspaceMemberId: 'wm-1',
  role: 'member',
  memberStatus: 'active',
  lifecycleState: 'active',
  billingState: 'active',
  planId: 'team-pro',
  providerMode: 'personal_byok',
  seatSummary: { seatLimit: 5, usedSeats: 2, availableSeats: 3, isSeatFull: false },
  permissions: {
    canManageMembers: false,
    canManageBilling: false,
    canInviteMembers: false,
    canManageAutoRecharge: false,
    canShareProjects: true,
    canWriteSyncedFiles: true,
    canViewWorkspaceSettings: true,
    canManageSharedResources: false,
  },
  lastActiveWorkspaceId: 'ws-team-1',
};

const SESSION = { profile: 'prod', apiUrl: 'https://vela.example', controlKey: 'ck-1', user: null, configMtimeMs: null };

function jsonResponse(status: number, body: unknown): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as unknown as Response;
}

describe('mapVelaWorkspaceContext', () => {
  it('maps a team context, deriving teamId from workspaceId and preserving BYOK', () => {
    const mapped = mapVelaWorkspaceContext(B_TEAM_CONTEXT);
    expect(mapped).not.toBeNull();
    // The team workspace IS the team scope → teamId mirrors workspaceId.
    expect(mapped?.teamId).toBe('ws-team-1');
    // BYOK provider must not disable team features — provider is carried verbatim.
    expect(mapped?.providerMode).toBe('personal_byok');
    // B's permissions are trusted (passed through), not re-derived.
    expect(mapped?.permissions.canWriteSyncedFiles).toBe(true);
    expect(mapped?.seatSummary).toEqual({ seatLimit: 5, usedSeats: 2, availableSeats: 3, isSeatFull: false });
    // B-only identity fields are dropped from the collab context.
    expect(mapped).not.toHaveProperty('userId');
    expect(mapped).not.toHaveProperty('appUserId');
  });

  it('does not attach teamId for a personal workspace', () => {
    const mapped = mapVelaWorkspaceContext({ ...B_TEAM_CONTEXT, workspaceType: 'personal' });
    expect(mapped?.workspaceType).toBe('personal');
    expect(mapped?.teamId).toBeUndefined();
  });

  it('re-derives an inconsistent seat summary from the authoritative counts', () => {
    const mapped = mapVelaWorkspaceContext({
      ...B_TEAM_CONTEXT,
      seatSummary: { seatLimit: 5, usedSeats: 5, availableSeats: 99, isSeatFull: false },
    });
    expect(mapped?.seatSummary).toEqual({ seatLimit: 5, usedSeats: 5, availableSeats: 0, isSeatFull: true });
  });

  it('accepts member contexts that hide billing-only fields', () => {
    const mapped = mapVelaWorkspaceContext({
      ...B_TEAM_CONTEXT,
      billingState: undefined,
      planId: undefined,
      seatSummary: undefined,
    });
    expect(mapped).not.toBeNull();
    expect(mapped?.billingState).toBe('active');
    expect(mapped?.planId).toBeNull();
    expect(mapped?.seatSummary).toEqual({ seatLimit: 0, usedSeats: 0, availableSeats: 0, isSeatFull: true });
    expect(mapped?.permissions.canShareProjects).toBe(true);
  });

  it('returns null on a bad enum or a missing id', () => {
    expect(mapVelaWorkspaceContext({ ...B_TEAM_CONTEXT, role: 'viewer' })).toBeNull();
    expect(mapVelaWorkspaceContext({ ...B_TEAM_CONTEXT, lifecycleState: 'frozen' })).toBeNull();
    expect(mapVelaWorkspaceContext({ ...B_TEAM_CONTEXT, workspaceMemberId: '' })).toBeNull();
    expect(mapVelaWorkspaceContext(null)).toBeNull();
  });
});

describe('createVelaWorkspaceContextProvider', () => {
  it('fetches B with the vela session bearer token and maps the result', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, B_TEAM_CONTEXT)) as unknown as typeof fetch;
    const provider = createVelaWorkspaceContextProvider({
      fetch: fetchImpl,
      readSession: () => SESSION,
    });
    const context = await provider.current({});
    expect(context?.workspaceMemberId).toBe('wm-1');
    expect(context?.teamId).toBe('ws-team-1');
    const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(String(url)).toBe('https://vela.example/api/v1/workspaces/current');
    expect((init as RequestInit).headers).toMatchObject({ authorization: 'Bearer ck-1' });
  });

  it('returns null without calling B when there is no vela session', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, B_TEAM_CONTEXT)) as unknown as typeof fetch;
    const provider = createVelaWorkspaceContextProvider({ fetch: fetchImpl, readSession: () => null });
    expect(await provider.current({})).toBeNull();
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(0);
  });

  it('degrades to null on a 401 (signed out) or a network error', async () => {
    const unauthorized = createVelaWorkspaceContextProvider({
      fetch: (async () => jsonResponse(401, { error: 'unauthenticated' })) as unknown as typeof fetch,
      readSession: () => SESSION,
    });
    expect(await unauthorized.current({})).toBeNull();

    const broken = createVelaWorkspaceContextProvider({
      fetch: (async () => {
        throw new Error('network down');
      }) as unknown as typeof fetch,
      readSession: () => SESSION,
    });
    expect(await broken.current({})).toBeNull();
  });
});

// New-user red line: B's server-side workspace selection means a fresh account
// has NO current workspace until something PUTs one — every workspace-scoped
// call then 403s with `missing_principal` and the client is dead on arrival.
// The provider must self-heal: list the directory, select a default (personal
// first), and re-read.
describe('createVelaWorkspaceContextProvider missing_principal bootstrap', () => {
  const B_PERSONAL_CONTEXT = {
    ...B_TEAM_CONTEXT,
    workspaceId: 'ws-personal-1',
    workspaceType: 'personal',
    workspaceMemberId: 'wm-p1',
    role: 'owner',
  };
  const DIRECTORY = {
    items: [
      {
        workspaceId: 'ws-team-1',
        workspaceName: 'Team',
        workspaceType: 'team',
        workspaceMemberId: 'wm-1',
        role: 'member',
        memberStatus: 'active',
        lifecycleState: 'active',
      },
      {
        workspaceId: 'ws-personal-1',
        workspaceName: 'Personal',
        workspaceType: 'personal',
        workspaceMemberId: 'wm-p1',
        role: 'owner',
        memberStatus: 'active',
        lifecycleState: 'active',
      },
    ],
  };

  it('selects a default workspace (personal first) and retries when B has no current workspace', async () => {
    const calls: Array<{ url: string; method: string; body?: unknown }> = [];
    const fetchImpl = vi.fn(async (url: URL | string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      calls.push({ url: String(url), method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      const u = String(url);
      if (u.includes('/workspaces/current') && method === 'GET') {
        // First read: no principal yet; after the PUT the retry succeeds.
        const putHappened = calls.some((c) => c.method === 'PUT');
        return putHappened
          ? jsonResponse(200, B_PERSONAL_CONTEXT)
          : jsonResponse(403, { error: 'missing_principal' });
      }
      if (u.endsWith('/api/v1/workspaces') && method === 'GET') {
        return jsonResponse(200, DIRECTORY);
      }
      if (u.includes('/workspaces/current') && method === 'PUT') {
        return jsonResponse(200, {});
      }
      throw new Error(`unexpected fetch ${method} ${u}`);
    }) as unknown as typeof fetch;

    const provider = createVelaWorkspaceContextProvider({
      fetch: fetchImpl,
      readSession: () => SESSION,
    });
    const context = await provider.current({});
    expect(context?.workspaceId).toBe('ws-personal-1');
    // Personal wins over the team entry even though the team is listed first.
    const put = calls.find((c) => c.method === 'PUT');
    expect(put?.body).toEqual({ workspaceId: 'ws-personal-1' });
  });

  it('does not bootstrap on 401 (signed out is not a missing principal)', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(401, { error: 'unauthenticated' })) as unknown as typeof fetch;
    const provider = createVelaWorkspaceContextProvider({ fetch: fetchImpl, readSession: () => SESSION });
    expect(await provider.current({})).toBeNull();
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });

  it('cools down after a failed bootstrap instead of hammering the directory', async () => {
    const fetchImpl = vi.fn(async (url: URL | string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      const u = String(url);
      if (u.includes('/workspaces/current') && method === 'GET') {
        return jsonResponse(403, { error: 'missing_principal' });
      }
      // Empty directory → bootstrap cannot pick anything.
      if (u.endsWith('/api/v1/workspaces')) return jsonResponse(200, { items: [] });
      throw new Error(`unexpected fetch ${method} ${u}`);
    }) as unknown as typeof fetch;
    const provider = createVelaWorkspaceContextProvider({
      fetch: fetchImpl,
      readSession: () => SESSION,
    });
    expect(await provider.current({})).toBeNull();
    expect(await provider.current({})).toBeNull();
    const mock = fetchImpl as unknown as ReturnType<typeof vi.fn>;
    const directoryCalls = mock.mock.calls.filter(([u]) => String(u).endsWith('/api/v1/workspaces'));
    // Second current() within the cooldown must not re-list.
    expect(directoryCalls.length).toBe(1);
  });
});
