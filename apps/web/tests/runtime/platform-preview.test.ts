import { describe, expect, it } from 'vitest';

/**
 * Platform Preview canvas ratios must match Content Pro export targets.
 * Dimensions are scaled for the preview stage; ratios must stay exact.
 */
const PLATFORM_PRESETS = {
  xhs: { width: 390, height: 520, ratio: 3 / 4 },
  tiktok: { width: 360, height: 640, ratio: 9 / 16 },
  linkedin: { width: 420, height: 420, ratio: 1 },
} as const;

describe('platform preview ratios', () => {
  it('XHS is 3:4', () => {
    const { width, height, ratio } = PLATFORM_PRESETS.xhs;
    expect(width / height).toBeCloseTo(ratio, 5);
  });

  it('TikTok is 9:16', () => {
    const { width, height, ratio } = PLATFORM_PRESETS.tiktok;
    expect(width / height).toBeCloseTo(ratio, 5);
  });

  it('LinkedIn is 1:1', () => {
    const { width, height, ratio } = PLATFORM_PRESETS.linkedin;
    expect(width / height).toBeCloseTo(ratio, 5);
  });
});
