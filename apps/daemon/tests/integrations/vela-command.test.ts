import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('node:child_process', () => ({ execFile: execFileMock }));

import { runVelaCommand } from '../../src/integrations/vela-command.js';

describe('runVelaCommand', () => {
  beforeEach(() => {
    execFileMock.mockReset();
    execFileMock.mockImplementation(
      (
        _command: string,
        _args: string[],
        _options: unknown,
        callback: (error: Error | null, stdout: string) => void,
      ) => callback(null, '{"ok":true}\n'),
    );
  });

  it('uses the configured AMR binary and feature-test login profile', async () => {
    const stdout = await runVelaCommand(['resource', 'head', 'project-1'], {
      env: {
        ...process.env,
        VELA_BIN: process.execPath,
        OPEN_DESIGN_AMR_PROFILE: 'feature-test',
        OD_DATA_DIR: '',
      },
    });

    expect(stdout).toBe('{"ok":true}\n');
    const [command, args, options] = execFileMock.mock.calls[0] as [
      string,
      string[],
      { env: NodeJS.ProcessEnv },
    ];
    expect(command).toBe(process.execPath);
    expect(args).toEqual(['resource', 'head', 'project-1']);
    expect(options.env.VELA_PROFILE).toBe('feature-test');
    expect(options.env.AMR_CLIENT_SOURCE).toBe('open_design');
  });

  it('lets explicit stored CLI configuration override inherited resolution', async () => {
    await runVelaCommand(['billing', 'summary'], {
      env: {
        ...process.env,
        VELA_BIN: '/missing/inherited/vela',
        OD_DATA_DIR: '',
      },
      configuredEnv: { VELA_BIN: process.execPath },
    });

    expect(execFileMock.mock.calls[0]?.[0]).toBe(process.execPath);
  });
});
