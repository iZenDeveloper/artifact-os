/**
 * Structural lint for a Content Repurposer index.html pack.
 * Does not score drama quality — only required sections / MVP markers.
 *
 * Usage:
 *   pnpm exec tsx scripts/lint-content-repurposer-pack.ts path/to/index.html
 *   pnpm exec tsx scripts/lint-content-repurposer-pack.ts path/to/dir   # finds index.html
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REQUIRED_PATTERNS: Array<{ id: string; re: RegExp; hint: string }> = [
  { id: 'strategy', re: /strategy|objective|funnel|persona/i, hint: 'Strategy block (objective/funnel/persona)' },
  { id: 'hook-lab', re: /hook\s*lab|weak\s*→\s*strong|weak\s*vs\s*strong/i, hint: 'Hook lab weak→strong' },
  { id: 'xhs-or-carousel', re: /xhs|xiaohongshu|carousel|1080\s*[×x]\s*1440/i, hint: 'XHS / carousel section' },
  { id: 'tiktok-script', re: /tiktok|short.?video|visual.?direction|shot\s*list|peak\s*frame/i, hint: 'TikTok script + visual direction' },
  { id: 'no-render-claim', re: /not a rendered video|production-ready script|không render|rendered_video:\s*false|mvp:\s*text/i, hint: 'MVP no-render marker' },
  { id: 'linkedin', re: /linkedin/i, hint: 'LinkedIn section' },
  { id: 'ready-to-post', re: /ready-?to-?post|hashtag|best\s*time/i, hint: 'Ready-to-post fields' },
  { id: 'score', re: /9\.|score|calibrated|craft/i, hint: 'Score / calibrated craft' },
  { id: 'cta-offer', re: /cta|offer|keyword/i, hint: 'CTA / offer' },
];

// Soft: warn if file claims finished video
const WARN_PATTERNS: Array<{ id: string; re: RegExp; hint: string }> = [
  { id: 'mp4-claim', re: /\.mp4\b|video\s+rendered|render(?:ed)?\s+complete/i, hint: 'Possible video-render claim (MVP out of scope)' },
];

function resolveHtmlPath(input: string): string {
  const abs = resolve(input);
  if (!existsSync(abs)) {
    throw new Error(`Path not found: ${abs}`);
  }
  if (statSync(abs).isDirectory()) {
    const direct = join(abs, 'index.html');
    if (existsSync(direct)) return direct;
    const htmls = readdirSync(abs).filter((f) => f.endsWith('.html'));
    if (htmls.length === 1) return join(abs, htmls[0]!);
    throw new Error(`No index.html in directory: ${abs}`);
  }
  return abs;
}

function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: pnpm exec tsx scripts/lint-content-repurposer-pack.ts <index.html|dir>');
    process.exit(2);
  }

  const htmlPath = resolveHtmlPath(arg);
  const html = readFileSync(htmlPath, 'utf8');
  const fails: string[] = [];
  const warns: string[] = [];

  for (const p of REQUIRED_PATTERNS) {
    if (!p.re.test(html)) fails.push(`[FAIL] ${p.id}: missing — ${p.hint}`);
  }
  for (const p of WARN_PATTERNS) {
    if (p.re.test(html)) warns.push(`[WARN] ${p.id}: ${p.hint}`);
  }

  console.log(`lint: ${htmlPath}`);
  console.log(`bytes: ${html.length}`);
  for (const w of warns) console.warn(w);
  if (fails.length) {
    for (const f of fails) console.error(f);
    console.error(`\nStructural lint FAILED (${fails.length} missing). Drama quality still needs human/agent score ≥9.0.`);
    process.exit(1);
  }
  console.log('Structural lint OK — required sections present.');
  console.log('Next: pre-ship-qa.md + calibrated craft ≥9.0 + regression-suite if skill changed.');
}

main();
