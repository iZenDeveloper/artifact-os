import { describe, expect, it } from 'vitest';
import {
  buildClientPackageEntries,
  extractCaptionsFromHtml,
  extractNotesFromHtml,
  inferPlatformFromHeading,
} from '../../src/runtime/client-package';

const sampleHtml = `<!doctype html>
<html><body>
  <h2>1. Strategy</h2>
  <div class="card"><p><strong>Objective:</strong> authority · Persona creator</p></div>
  <h2>4. XHS · carousel</h2>
  <div class="card">
    <div class="copy">Feed “đủ hay” vẫn chết — vì không ai nhớ 1 câu của bạn.

Comment SON1TUAN — khung 1 tuần.

#PersonalBrand #Hook</div>
    <p class="muted">Best time: T2–T5 20:00–22:00 · guidance.</p>
  </div>
  <h2>5. TikTok · short_video_script</h2>
  <div class="card">
    <div class="copy">0–3s: Feed đủ hay vẫn chết.
3–8s: Đổi aesthetic mỗi tuần.
15–18s: Nhất quán là hạ tầng.</div>
  </div>
  <h2>6. LinkedIn</h2>
  <div class="card">
    <pre>Your feed is good enough — and still invisible.

Comment FRAME for the checklist.

#PersonalBrand</pre>
  </div>
  <section id="ready-to-post">
    <h2>Ready-to-post</h2>
    <h3>Email</h3>
    <pre>Subject: One sentence they remember

Body: …
CTA: Reply SON1TUAN</pre>
  </section>
</body></html>`;

describe('inferPlatformFromHeading', () => {
  it('maps common platform labels', () => {
    expect(inferPlatformFromHeading('4. XHS · carousel')).toBe('xhs');
    expect(inferPlatformFromHeading('TikTok · short_video_script')).toBe('tiktok');
    expect(inferPlatformFromHeading('LinkedIn post')).toBe('linkedin');
    expect(inferPlatformFromHeading('Email sequence')).toBe('email');
  });
});

describe('extractCaptionsFromHtml', () => {
  it('pulls .copy / pre blocks under platform headings', () => {
    const caps = extractCaptionsFromHtml(sampleHtml);
    const platforms = caps.map((c) => c.platform);
    expect(platforms).toContain('xhs');
    expect(platforms).toContain('tiktok');
    expect(platforms).toContain('linkedin');
    expect(platforms).toContain('email');
    const xhs = caps.find((c) => c.platform === 'xhs');
    expect(xhs?.body).toContain('SON1TUAN');
    expect(xhs?.meta).toMatch(/20:00/);
  });

  it('returns empty for empty input', () => {
    expect(extractCaptionsFromHtml('')).toEqual([]);
  });
});

describe('extractNotesFromHtml', () => {
  it('reads strategy card when present', () => {
    const notes = extractNotesFromHtml(sampleHtml);
    expect(notes).toMatch(/authority|Persona/i);
  });
});

describe('buildClientPackageEntries', () => {
  it('builds package tree with brand, notes, captions, source', () => {
    const captions = extractCaptionsFromHtml(sampleHtml);
    const { packageSlug, entries } = buildClientPackageEntries({
      title: 'Personal Brand Pack',
      brandSlug: 'personal-minimal',
      projectId: 'proj-1',
      captions,
      sourceHtml: sampleHtml,
      notes: 'Ship LinkedIn first.',
      deliveredAt: '2026-07-18',
    });

    expect(packageSlug).toBe('Personal-Brand-Pack');
    const paths = entries.map((e) => e.path);
    expect(paths).toContain('Personal-Brand-Pack/PACKAGE.md');
    expect(paths).toContain('Personal-Brand-Pack/brand.json');
    expect(paths).toContain('Personal-Brand-Pack/notes/delivery.md');
    expect(paths).toContain('Personal-Brand-Pack/source/index.html');
    expect(paths.some((p) => p.startsWith('Personal-Brand-Pack/captions/') && p.endsWith('.txt'))).toBe(
      true,
    );

    const brand = JSON.parse(entries.find((e) => e.path.endsWith('brand.json'))!.content);
    expect(brand.schema).toBe('artifact-os.client-package.v1');
    expect(brand.brandSlug).toBe('personal-minimal');
    expect(brand.platforms.length).toBeGreaterThanOrEqual(3);

    const pkg = entries.find((e) => e.path.endsWith('PACKAGE.md'))!.content;
    expect(pkg).toContain('personal-minimal');
    expect(pkg).toContain('captions/');
  });

  it('writes captions README when no captions', () => {
    const { entries } = buildClientPackageEntries({
      title: 'Empty',
      sourceHtml: '<html><body><p>hi</p></body></html>',
    });
    expect(entries.some((e) => e.path.endsWith('captions/README.md'))).toBe(true);
  });
});
