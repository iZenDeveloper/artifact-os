import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequest } from '../functions/api/attribution/mint.ts';
import { onRequest as mintBridge } from '../functions/api/attribution/bridge/mint.ts';
import { onRequest as consumeBridge } from '../functions/api/attribution/bridge/consume.ts';

test('download attribution mint only accepts Open Design GitHub release assets', async () => {
  const records = new Map<string, string>();
  const request = new Request('https://download.open-design.ai/api/attribution/mint', {
    method: 'POST',
    body: JSON.stringify({
      webDistinctId: 'web-anon-1',
      assetUrl: 'https://github.com/nexu-io/open-design/releases/download/v1/Open-Design.dmg',
      platform: 'macos',
    }),
  });

  const response = await onRequest({
    request,
    env: { ATTRIBUTION_KV: { get: async () => null, put: async (key, value) => { records.set(key, value); } } },
    params: {},
  });

  assert.equal(response.status, 200);
  const payload = await response.json() as { downloadUrl?: string };
  assert.match(payload.downloadUrl ?? '', /^https:\/\/download\.open-design\.ai\/macos\/auto\/oddl_/);
  assert.equal(records.size, 1);
});

test('download attribution mint rejects arbitrary proxy targets', async () => {
  const response = await onRequest({
    request: new Request('https://download.open-design.ai/api/attribution/mint', {
      method: 'POST',
      body: JSON.stringify({ webDistinctId: 'web-anon-1', assetUrl: 'https://example.com/private.zip' }),
    }),
    env: { ATTRIBUTION_KV: { get: async () => null, put: async () => undefined } },
    params: {},
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'unsupported_release_asset' });
});

test('first-party bridge is short-lived, single-use, and origin scoped', async () => {
  const records = new Map<string, string>();
  const env = {
    ATTRIBUTION_CONSUME_TOKEN: 'secret',
    ATTRIBUTION_KV: {
      get: async (key: string) => records.get(key) ?? null,
      put: async (key: string, value: string) => { records.set(key, value); },
    },
  };
  const minted = await mintBridge({
    request: new Request('https://open-design.ai/api/attribution/bridge/mint', {
      method: 'POST', headers: { Authorization: 'Bearer secret' },
      body: JSON.stringify({ installationId: 'install-123', url: 'https://open-design.ai/clipper' }),
    }), env, params: {},
  });
  const url = (await minted.json() as { url: string }).url;
  const token = new URL(url).searchParams.get('od_bridge');
  assert.ok(token);
  const consume = () => consumeBridge({
    request: new Request('https://open-design.ai/api/attribution/bridge/consume', {
      method: 'POST', body: JSON.stringify({ token }),
    }), env, params: {},
  });
  assert.deepEqual(await (await consume()).json(), { installationId: 'install-123' });
  assert.equal((await consume()).status, 404);
});
