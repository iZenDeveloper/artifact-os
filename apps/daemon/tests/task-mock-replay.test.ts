import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { deriveTaskSteps, type PersistedAgentEvent } from '@open-design/contracts';
import { createClaudeStreamHandler } from '../src/runtimes/claude-stream.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '../../..');
const TRACE = '48ea64c1-7056-41e2-8618-e88e4a01130a';
const RECORDING = join(REPO, 'mocks/recordings', `${TRACE}.jsonl`);

describe.skipIf(!existsSync(RECORDING))('task replay through a recorded generate + edit run', () => {
  it('preserves ordered, paired steps from mock CLI through the real Claude parser', () => {
    const processResult = spawnSync(
      process.execPath,
      [join(REPO, 'mocks/mock-agent.mjs'), '--as', 'claude', '--no-delay'],
      {
        env: { ...process.env, OD_MOCKS_TRACE: TRACE, OD_MOCKS_NO_DELAY: '1' },
        input: 'Generate a variant and edit the index.',
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024,
        timeout: 30_000,
      },
    );
    expect(processResult.status, processResult.stderr).toBe(0);

    const runtimeEvents: Array<Record<string, unknown>> = [];
    const handler = createClaudeStreamHandler((event) => {
      runtimeEvents.push(event as Record<string, unknown>);
    });
    handler.feed(processResult.stdout);
    handler.flush();

    const events = runtimeEvents
      .filter((event) => event.type === 'tool_use' || event.type === 'tool_result')
      .map(({ type, ...event }) => ({ ...event, kind: type }) as PersistedAgentEvent);

    const steps = deriveTaskSteps({ events, startedAt: 1_000 });
    expect(steps.map((step) => step.kind)).toEqual([
      'read',
      'generate',
      'list',
      'read',
      'generate',
    ]);
    expect(steps.every((step) => step.toolUse && step.toolResult)).toBe(true);
    expect(steps.map((step) => step.ts)).toEqual([...steps.map((step) => step.ts)].sort((a, b) => a - b));
  });
});
