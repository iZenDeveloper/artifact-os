import { describe, expect, it } from 'vitest';

import {
  classifyVelaLoginFailure,
  resolveVelaLoginExitFailure,
} from '../../src/integrations/vela-errors.js';

describe('AMR sign-in failure classification (issue #426)', () => {
  it('classifies a missing vela binary as reinstall guidance', () => {
    expect(
      classifyVelaLoginFailure({
        message: 'vela binary not found; install vela or configure VELA_BIN',
      }),
    ).toMatchObject({
      code: 'AMR_LOGIN_BINARY_MISSING',
      recovery: 'reinstall',
    });
  });

  it('classifies the browser-open warning as a manual-link recovery', () => {
    expect(classifyVelaLoginFailure({ browserOpenFailed: true })).toMatchObject({
      code: 'AMR_LOGIN_BROWSER_OPEN_FAILED',
      recovery: 'manual-link',
    });
    expect(
      classifyVelaLoginFailure({
        stderr:
          'Warning: could not open browser automatically: exec: "open": not found',
      }),
    ).toMatchObject({ code: 'AMR_LOGIN_BROWSER_OPEN_FAILED' });
  });

  it('classifies the corporate-proxy 502 shape as proxy-blocked before generic network', () => {
    expect(
      classifyVelaLoginFailure({
        message:
          'vela login exited before device authorization started (code 1)',
        stderr: '502: Invalid IP address: undefined',
      }),
    ).toMatchObject({
      code: 'AMR_LOGIN_PROXY_BLOCKED',
      recovery: 'retry',
    });
  });

  it('classifies DNS/connection/TLS/5xx failures as network errors', () => {
    for (const text of [
      'getaddrinfo ENOTFOUND amr-api.open-design.ai',
      'connect ECONNREFUSED 127.0.0.1:443',
      'socket hang up',
      'request failed with status 503',
      'TLS handshake failed: certificate has expired',
    ]) {
      expect(classifyVelaLoginFailure({ message: text })).toMatchObject({
        code: 'AMR_LOGIN_NETWORK',
        recovery: 'retry',
      });
    }
  });

  it('classifies local spawn failures as retryable spawn errors', () => {
    for (const text of [
      'failed to spawn vela login',
      'vela login failed to start: spawn EACCES',
      'vela login failed to start: permission denied',
    ]) {
      expect(classifyVelaLoginFailure({ message: text })).toMatchObject({
        code: 'AMR_LOGIN_SPAWN_FAILED',
        recovery: 'retry',
      });
    }
  });

  it('prefers a network cause over the generic spawn wrapper', () => {
    expect(
      classifyVelaLoginFailure({
        message: 'vela login failed to start: getaddrinfo ENOTFOUND host',
      }),
    ).toMatchObject({ code: 'AMR_LOGIN_NETWORK' });
  });

  it('maps a frontend-driven timeout to a fresh re-login', () => {
    expect(classifyVelaLoginFailure({ timedOut: true })).toMatchObject({
      code: 'AMR_LOGIN_TIMEOUT',
      recovery: 'reauth',
    });
  });

  it('classifies an unexplained non-zero exit as interrupted', () => {
    expect(classifyVelaLoginFailure({ exitCode: 1 })).toMatchObject({
      code: 'AMR_LOGIN_INTERRUPTED',
      recovery: 'reauth',
    });
    expect(classifyVelaLoginFailure({ exitCode: null, signal: 'SIGSEGV' })).toMatchObject(
      { code: 'AMR_LOGIN_INTERRUPTED' },
    );
  });

  it('falls back to a retryable unknown failure', () => {
    expect(
      classifyVelaLoginFailure({ message: 'something entirely unexpected' }),
    ).toMatchObject({ code: 'AMR_LOGIN_UNKNOWN', recovery: 'retry' });
  });

  it('echoes the most informative raw text as detail', () => {
    expect(
      classifyVelaLoginFailure({ stderr: '502: Invalid IP address: undefined' })
        .detail,
    ).toBe('502: Invalid IP address: undefined');
  });
});

describe('resolveVelaLoginExitFailure surfacing guard', () => {
  it('does not surface a canceled attempt', () => {
    expect(
      resolveVelaLoginExitFailure({
        canceled: true,
        exitCode: null,
        signal: 'SIGTERM',
      }),
    ).toBeNull();
  });

  it('does not surface a clean (successful) exit', () => {
    expect(
      resolveVelaLoginExitFailure({ exitCode: 0, signal: null }),
    ).toBeNull();
  });

  it('surfaces a network exit as a classified failure', () => {
    expect(
      resolveVelaLoginExitFailure({
        exitCode: 1,
        stderr: '502: Invalid IP address: undefined',
      }),
    ).toMatchObject({ code: 'AMR_LOGIN_PROXY_BLOCKED' });
  });

  it('surfaces an unexplained crash as interrupted', () => {
    expect(
      resolveVelaLoginExitFailure({ exitCode: 1, signal: null }),
    ).toMatchObject({ code: 'AMR_LOGIN_INTERRUPTED' });
  });
});
