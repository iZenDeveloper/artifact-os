import { afterEach, describe, expect, it } from 'vitest';
import express from 'express';
import http from 'node:http';
import { registerTeamResourceShareRoutes } from '../src/routes/team-resource-share.js';
import type { TeamResourceShareRecord, TeamResourceShareService } from '../src/collab/team-resource-share.js';

let server: http.Server | null = null;

afterEach(async () => {
  if (server) {
    const toClose = server;
    server = null;
    await new Promise<void>((resolve) => toClose.close(() => resolve()));
  }
});

function fakeShare(records: TeamResourceShareRecord[]): {
  service: TeamResourceShareService;
  calls: () => number;
} {
  let calls = 0;
  const service = {
    async sharedResources() {
      calls += 1;
      return records;
    },
    async share() {
      return null;
    },
    async unshare() {
      return false;
    },
  } as unknown as TeamResourceShareService;
  return { service, calls: () => calls };
}

async function startServer(deps: Parameters<typeof registerTeamResourceShareRoutes>[1]) {
  const app = express();
  app.use(express.json());
  registerTeamResourceShareRoutes(app, deps);
  server = http.createServer(app);
  await new Promise<void>((resolve) => server!.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server did not bind to a TCP port');
  const base = `http://127.0.0.1:${address.port}`;
  return async (route: string) => {
    const response = await fetch(`${base}${route}`);
    return { status: response.status, body: (await response.json()) as Record<string, unknown> };
  };
}

const record = (id: string): TeamResourceShareRecord =>
  ({ id, localId: id, version: 1 }) as unknown as TeamResourceShareRecord;

describe('team resource share /team listing', () => {
  it('serves the cached listTeam provider instead of hitting the hub', async () => {
    const { service, calls } = fakeShare([record('a'), record('b')]);
    let listTeamCalls = 0;
    const req = await startServer({
      basePath: 'skills',
      share: service,
      listTeam: async () => {
        listTeamCalls += 1;
        return { ids: ['a', 'b'], resources: [record('a'), record('b')] };
      },
    });
    const res = await req('/api/workspace/skills/team');
    expect(res.status).toBe(200);
    expect(res.body.ids).toEqual(['a', 'b']);
    // The cache provider was consulted; the raw hub read was NOT hit on the path.
    expect(listTeamCalls).toBe(1);
    expect(calls()).toBe(0);
  });

  it('falls back to the direct hub read when no listTeam provider is given', async () => {
    const { service, calls } = fakeShare([record('x')]);
    const req = await startServer({ basePath: 'plugins', share: service });
    const res = await req('/api/workspace/plugins/team');
    expect(res.status).toBe(200);
    expect(res.body.ids).toEqual(['x']);
    expect(calls()).toBe(1);
  });
});
