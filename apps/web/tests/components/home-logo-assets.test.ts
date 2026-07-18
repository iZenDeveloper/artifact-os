import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) =>
  readFileSync(new URL(relative, import.meta.url), 'utf8');

const entryNavRailSource = read('../../src/components/EntryNavRail.tsx');
const entryShellSource = read('../../src/components/EntryShell.tsx');
const logoSvg = read('../../public/logo.svg');
const brandIconSvg = read('../../public/brand-icon.svg');

// Artifact OS mark (vectorized brand glyph from Downloads/Artifact OS logo.svg).
// Paths use absolute coordinates in the 1706×1394 artboard.
const ARTIFACT_GLYPH_MARKERS = ['viewBox="0 0 1706 1394"', 'M1440 1344', 'M260.3 1343.3'];
// Retired Open Design superellipse + cursor glyph.
const RETIRED_OD_GLYPH_MARKERS = [
  'M41 0.726562',
  '#202020',
  'M212.059',
  'width="444"',
];

describe('Home logo assets', () => {
  it('ships the Artifact OS brand glyph in the public logo assets', () => {
    for (const marker of ARTIFACT_GLYPH_MARKERS) {
      expect(logoSvg).toContain(marker);
      expect(brandIconSvg).toContain(marker);
    }
    for (const marker of RETIRED_OD_GLYPH_MARKERS) {
      expect(logoSvg).not.toContain(marker);
      expect(brandIconSvg).not.toContain(marker);
    }
    expect(logoSvg).toContain('Artifact OS');
    expect(brandIconSvg).toContain('Artifact OS');
  });

  it('keeps brand-icon.svg maskable (theme color comes from CSS)', () => {
    expect(brandIconSvg).toContain('currentColor');
  });

  it('renders the brand glyph on entry chrome surfaces', () => {
    // Nav rail + onboarding shell mask /brand-icon.svg via .od-brand-glyph.
    // HomeHero no longer mounts a separate logo mark (brand mode chips only).
    expect(entryNavRailSource).toContain('od-brand-glyph');
    expect(entryNavRailSource).not.toContain('src="/app-icon.svg"');

    expect(entryShellSource).toContain('od-brand-glyph');
    expect(entryShellSource).not.toContain('src="/app-icon.svg"');
  });
});
