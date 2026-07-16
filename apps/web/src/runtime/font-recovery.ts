// Chromium marks a FontFace whose network fetch failed as status "error"
// and NEVER retries it. One lost race at startup — e.g. the packaged od://
// proxy briefly starving while upstream connection slots are pinned — turns
// every icon glyph into a tofu square until the user reloads the window.
// CSS-declared FontFace objects don't expose their `src`, so recovery
// re-registers the family through the FontFace API instead: a successfully
// loaded JS FontFace joins font matching alongside the errored CSS one and
// the affected glyphs repaint immediately.
//
// Only families whose failure is user-visible enough to warrant recovery
// are listed; text families degrade to system fallbacks acceptably.
const RECOVERABLE_FONTS: Record<string, string> = {
  remixicon: 'url("/remixicon.ttf") format("truetype")',
};

// First check waits out the startup burst; later checks catch fonts whose
// fetch failed while the connection pool was still congested.
const RETRY_DELAYS_MS = [4_000, 15_000, 45_000];

function erroredFamilies(doc: Document): Set<string> {
  const errored = new Set<string>();
  doc.fonts.forEach((face) => {
    if (face.status === 'error') {
      errored.add(face.family.replace(/^["']|["']$/g, ''));
    }
  });
  return errored;
}

async function recoverFamily(doc: Document, family: string, src: string): Promise<boolean> {
  try {
    const face = new FontFace(family, src, { display: 'swap' });
    await face.load();
    doc.fonts.add(face);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schedules a few post-startup sweeps that re-load any recoverable font
 * family whose CSS-declared FontFace settled in the terminal `error` state.
 * Idempotent per document; returns a cancel function for tests.
 */
export function installFontRecovery(doc: Document = document): () => void {
  const recovered = new Set<string>();
  const timers: ReturnType<typeof setTimeout>[] = [];

  const sweep = async () => {
    const errored = erroredFamilies(doc);
    for (const [family, src] of Object.entries(RECOVERABLE_FONTS)) {
      if (recovered.has(family) || !errored.has(family)) continue;
      if (await recoverFamily(doc, family, src)) recovered.add(family);
    }
  };

  for (const delay of RETRY_DELAYS_MS) {
    timers.push(setTimeout(() => void sweep(), delay));
  }
  return () => {
    for (const timer of timers) clearTimeout(timer);
  };
}
