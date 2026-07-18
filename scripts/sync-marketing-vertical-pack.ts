/**
 * Sync canonical Marketing vertical skills + brands into the installable
 * community plugin pack. Nested copies are overwritten — edit sources only.
 *
 * Usage: pnpm exec tsx scripts/sync-marketing-vertical-pack.ts
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pack = join(root, 'plugins/community/marketing-vertical-pack');

const skills = [
  'content-repurposer',
  'hook-engine',
  'social-content-factory',
  'ad-variants-generator',
  'variants-comparison',
  'marketing-psychology',
] as const;

const brands = [
  'personal-minimal',
  'personal-bold',
  'professional-clean',
] as const;

function syncDir(from: string, to: string): void {
  if (!existsSync(from)) {
    throw new Error(`Missing source: ${from}`);
  }
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`synced ${from} → ${to}`);
}

mkdirSync(join(pack, 'skills'), { recursive: true });
mkdirSync(join(pack, 'design-systems'), { recursive: true });

for (const id of skills) {
  syncDir(join(root, 'skills', id), join(pack, 'skills', id));
}
for (const id of brands) {
  syncDir(join(root, 'design-systems', id), join(pack, 'design-systems', id));
}

console.log('marketing-vertical-pack sync complete');
