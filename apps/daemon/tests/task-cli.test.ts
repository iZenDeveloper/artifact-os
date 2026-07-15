import { execFile } from 'node:child_process';
import http from 'node:http';
import { dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';

const execFileP = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DAEMON_ROOT = pathResolve(__dirname, '..');
const REPO_ROOT = pathResolve(__dirname, '../../..');
const CLI_SRC = pathResolve(__dirname, '../src/cli.ts');
const TSX_CLI = pathResolve(REPO_ROOT, 'node_modules/tsx/dist/cli.mjs');

let server: http.Server | null = null;

afterEach(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server?.close((error) => (error ? reject(error) : resolve()));
  });
  server = null;
});

async function startTaskServer(payload: unknown): Promise<string> {
  server = http.createServer((request, response) => {
    expect(request.method).toBe('GET');
    expect(request.url).toBe('/api/conversations/conversation-1/tasks');
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(payload));
  });
  await new Promise<void>((resolve) => server?.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('task stub server has no address');
  return `http://127.0.0.1:${address.port}`;
}

async function runTaskCli(baseUrl: string, extraArgs: string[] = []) {
  const env = { ...process.env };
  delete env.NODE_OPTIONS;
  return execFileP(
    process.execPath,
    [
      TSX_CLI,
      CLI_SRC,
      'task',
      'steps',
      'conversation-1',
      '--daemon-url',
      baseUrl,
      '--json',
      ...extraArgs,
    ],
    { cwd: DAEMON_ROOT, env, timeout: 15_000, maxBuffer: 8 * 1024 * 1024 },
  );
}

describe('od task CLI', () => {
  it('emits a complete large replay timeline as parseable JSON', async () => {
    const steps = Array.from({ length: 600 }, (_, index) => ({
      id: `step-${index}`,
      kind: 'read',
      status: 'done',
      brief: `Read ${index} ${'x'.repeat(400)}`,
    }));
    const payload = {
      conversationId: 'conversation-1',
      rounds: [{ index: 0, status: 'succeeded', steps }],
    };
    const baseUrl = await startTaskServer(payload);

    const result = await runTaskCli(baseUrl);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual(payload);
    expect(result.stdout.length).toBeGreaterThan(250_000);
  });

  it('filters one round without changing the shared endpoint', async () => {
    const payload = {
      conversationId: 'conversation-1',
      rounds: [
        { index: 0, status: 'succeeded', steps: [] },
        { index: 1, status: 'running', steps: [] },
      ],
    };
    const baseUrl = await startTaskServer(payload);

    const result = await runTaskCli(baseUrl, ['--round', '1']);
    expect(JSON.parse(result.stdout)).toEqual({
      ...payload,
      rounds: [payload.rounds[1]],
    });
  });
});
