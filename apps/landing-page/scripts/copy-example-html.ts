/**
 * Post-build copier — `skills/<slug>/example.html` and
 * `design-templates/<slug>/example.html` get copied next to the
 * static detail-page output (`out/skills/<slug>/example.html`,
 * `out/templates/<slug>/template.html` for live-artifacts) so the
 * detail-page iframe and "Open in new tab" links resolve.
 *
 * Without this step the build artifact only contains the per-skill
 * `index.html` Astro generates from `[slug].astro`. Cloudflare Pages
 * then SPA-fallbacks `/skills/<slug>/example.html` to the homepage,
 * which the browser displays as "404 / wrong page" inside the iframe.
 *
 * Runs after `astro build`. Read source from the repo-root content
 * directories (`skills/`, `design-templates/`, `templates/`) — same
 * convention `generate-previews.ts` already uses.
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..', '..');
const OUT_DIR = path.join(APP_ROOT, 'out');
const SKILLS_SRC = path.join(REPO_ROOT, 'skills');
const DESIGN_TEMPLATES_SRC = path.join(REPO_ROOT, 'design-templates');
const LIVE_ARTIFACTS_SRC = path.join(REPO_ROOT, 'templates', 'live-artifacts');

let copied = 0;
let skipped = 0;

function copyIfExists(srcFile: string, destFile: string): boolean {
  if (!existsSync(srcFile)) return false;
  mkdirSync(path.dirname(destFile), { recursive: true });
  copyFileSync(srcFile, destFile);
  return true;
}

function listDirs(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root).filter((name) => {
    const full = path.join(root, name);
    return statSync(full).isDirectory() && !name.startsWith('_') && !name.startsWith('.');
  });
}

// 1. Skills — copy `skills/<slug>/example.html` to
//    `out/skills/<slug>/example.html`.
for (const slug of listDirs(SKILLS_SRC)) {
  const ok = copyIfExists(
    path.join(SKILLS_SRC, slug, 'example.html'),
    path.join(OUT_DIR, 'skills', slug, 'example.html'),
  );
  if (ok) copied++;
  else skipped++;
}

// 2. Design templates — `design-templates/<slug>/example.html` →
//    `out/skills/<slug>/example.html`. The landing-page detail layer
//    treats design templates as a flavor of skill template (see
//    `_lib/catalog.ts` and `pages/templates/[slug].astro` which routes
//    skill-template-origin records to `/skills/<slug>/example.html`).
for (const slug of listDirs(DESIGN_TEMPLATES_SRC)) {
  const ok = copyIfExists(
    path.join(DESIGN_TEMPLATES_SRC, slug, 'example.html'),
    path.join(OUT_DIR, 'skills', slug, 'example.html'),
  );
  if (ok) copied++;
}

// 3. Live-artifact templates — `templates/live-artifacts/<slug>/template.html`
//    → `out/templates/<slug>/template.html`. The pages/templates/[slug].astro
//    iframe targets that exact path for live-artifact origins.
for (const slug of listDirs(LIVE_ARTIFACTS_SRC)) {
  const ok = copyIfExists(
    path.join(LIVE_ARTIFACTS_SRC, slug, 'template.html'),
    path.join(OUT_DIR, 'templates', slug, 'template.html'),
  );
  if (ok) copied++;
}

console.log(`[copy-example-html] copied ${copied} files, skipped ${skipped} (no example.html in source)`);
