import type http from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { DesktopRenderSlidesInput, DesktopRenderSlidesResult } from '@open-design/sidecar-proto';
import { startServer } from '../src/server.js';

// ---------------------------------------------------------------------------
// Editable PPTX export (`/export/pptx` with `editable: true`).
//
// The desktop renderer produces a finished .pptx (native shapes/text via the
// vendored dom-to-pptx engine) and writes it to the scratch dir; the daemon
// confines the path to that dir and streams the bytes back. Exercised with a
// stub renderer standing in for the desktop runtime.
// ---------------------------------------------------------------------------

// "PK\x03\x04" — a .pptx is a zip; the daemon streams bytes verbatim.
const FAKE_PPTX = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x65, 0x64, 0x69, 0x74]);

describe('editable PPTX export', () => {
  let server: http.Server;
  let baseUrl: string;
  const projectId = 'proj-editable-pptx';
  let lastInput: DesktopRenderSlidesInput | null = null;

  const stubRenderer = async (input: DesktopRenderSlidesInput): Promise<DesktopRenderSlidesResult> => {
    lastInput = input;
    if (!input.outputDir) return { ok: false, error: 'expected an outputDir' };
    await mkdir(input.outputDir, { recursive: true });
    const file = path.join(input.outputDir, 'deck.pptx');
    await writeFile(file, FAKE_PPTX);
    return { ok: true, pptxFile: file, width: 1920, height: 1080, mode: 'deck' };
  };

  const exportPptx = (body: Record<string, unknown>) =>
    fetch(`${baseUrl}/api/projects/${projectId}/export/pptx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'index.html', ...body }),
    });

  beforeAll(async () => {
    const started = (await startServer({
      port: 0,
      returnServer: true,
      desktopSlideRenderer: stubRenderer,
    })) as { url: string; server: http.Server };
    baseUrl = started.url;
    server = started.server;
    const dir = path.join(process.env.OD_DATA_DIR!, 'projects', projectId);
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, 'index.html'),
      '<html><body><section class="slide">A</section><section class="slide">B</section></body></html>',
    );
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  it('requests editable rendering and streams the returned .pptx', async () => {
    const res = await exportPptx({ editable: true });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    );
    const bytes = Buffer.from(await res.arrayBuffer());
    expect(bytes.subarray(0, 4).toString('hex')).toBe('504b0304'); // PK zip magic
    // The renderer was told to render a deck, editable.
    expect(lastInput?.editable).toBe(true);
    expect(lastInput?.deck).toBe(true);
  });

  it('still does screenshot PPTX when editable is not set (no pptxFile path taken)', async () => {
    // Default (no editable) must NOT hit the pptxFile branch — the stub only
    // returns pptxFile, so the screenshot path would 502 without slideFiles.
    const res = await exportPptx({});
    expect(lastInput?.editable).toBeUndefined();
    // Stub returns no slideFiles/slides for the screenshot path → 502, proving
    // the editable branch is gated on the flag (not always taken).
    expect(res.status).toBe(502);
  });

  it('rejects an editable pptx path outside the scratch dir', async () => {
    const dataDir = process.env.OD_DATA_DIR!;
    const secret = path.join(dataDir, 'SECRET-editable.pptx');
    await writeFile(secret, 'TOP SECRET PPTX');
    const evil = async (input: DesktopRenderSlidesInput): Promise<DesktopRenderSlidesResult> => {
      if (input.outputDir) await mkdir(input.outputDir, { recursive: true });
      return { ok: true, pptxFile: secret, width: 1920, height: 1080, mode: 'deck' };
    };
    const srv = (await startServer({
      port: 0,
      returnServer: true,
      desktopSlideRenderer: evil,
    })) as { url: string; server: http.Server };
    try {
      const res = await fetch(`${srv.url}/api/projects/${projectId}/export/pptx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'index.html', editable: true }),
      });
      expect(res.status).toBe(502);
      expect(await res.text()).not.toContain('TOP SECRET');
    } finally {
      await new Promise<void>((resolve) => srv.server.close(() => resolve()));
    }
  });
});
