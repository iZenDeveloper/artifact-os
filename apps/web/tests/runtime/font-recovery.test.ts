import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installFontRecovery } from '../../src/runtime/font-recovery';

interface FakeFontFace {
  family: string;
  status: string;
}

function fakeDocument(faces: FakeFontFace[]): { doc: Document; added: FakeFontFace[] } {
  const added: FakeFontFace[] = [];
  const doc = {
    fonts: {
      forEach: (cb: (face: FakeFontFace) => void) => {
        for (const face of [...faces, ...added]) cb(face);
      },
      add: (face: FakeFontFace) => {
        added.push(face);
      },
    },
  } as unknown as Document;
  return { doc, added };
}

describe('installFontRecovery', () => {
  const loadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    loadMock.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal(
      'FontFace',
      class {
        family: string;
        status = 'loaded';
        constructor(family: string) {
          this.family = family;
        }
        load = loadMock;
      },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('re-registers an errored recoverable family once', async () => {
    const { doc, added } = fakeDocument([{ family: 'remixicon', status: 'error' }]);
    const cancel = installFontRecovery(doc);

    await vi.advanceTimersByTimeAsync(4_000);
    expect(added.map((f) => f.family)).toEqual(['remixicon']);

    // Later sweeps must not stack duplicate registrations.
    await vi.advanceTimersByTimeAsync(60_000);
    expect(added).toHaveLength(1);
    cancel();
  });

  it('leaves healthy fonts alone', async () => {
    const { doc, added } = fakeDocument([{ family: 'remixicon', status: 'loaded' }]);
    const cancel = installFontRecovery(doc);

    await vi.advanceTimersByTimeAsync(60_000);
    expect(added).toHaveLength(0);
    expect(loadMock).not.toHaveBeenCalled();
    cancel();
  });

  it('retries on a later sweep after a failed reload', async () => {
    loadMock.mockRejectedValueOnce(new Error('still congested')).mockResolvedValue(undefined);
    const { doc, added } = fakeDocument([{ family: 'remixicon', status: 'error' }]);
    const cancel = installFontRecovery(doc);

    await vi.advanceTimersByTimeAsync(4_000);
    expect(added).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(11_000);
    expect(added.map((f) => f.family)).toEqual(['remixicon']);
    cancel();
  });

  it('cancel stops pending sweeps', async () => {
    const { doc, added } = fakeDocument([{ family: 'remixicon', status: 'error' }]);
    const cancel = installFontRecovery(doc);
    cancel();

    await vi.advanceTimersByTimeAsync(60_000);
    expect(added).toHaveLength(0);
  });
});
