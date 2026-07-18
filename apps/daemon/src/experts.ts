// Experts registry — persona + methodology packs under experts/<id>/EXPERT.md.
// Orthogonal to skills (workflow) and design systems (brand). Injected into
// the system prompt as `## Active expert — {title}`.

import type { Dirent } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontmatter } from './design-systems/frontmatter.js';

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export interface ExpertInfo {
  id: string;
  title: string;
  summary: string;
  vertical: string | null;
  tags: string[];
  body: string;
  dir: string;
}

type ExpertFrontmatter = {
  id?: unknown;
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  vertical?: unknown;
  tags?: unknown;
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * List experts from one or more roots. First root wins on id collisions
 * (user experts can shadow built-ins later).
 */
export async function listExperts(
  expertsRoots: string | readonly string[],
): Promise<ExpertInfo[]> {
  const roots = Array.isArray(expertsRoots) ? expertsRoots : [expertsRoots];
  const out: ExpertInfo[] = [];
  const seen = new Set<string>();

  for (const root of roots) {
    if (!root) continue;
    let entries: Dirent[] = [];
    try {
      entries = await readdir(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
      if (entry.name.startsWith('.')) continue;
      const dir = path.join(root, entry.name);
      const expertPath = path.join(dir, 'EXPERT.md');
      try {
        const stats = await stat(expertPath);
        if (!stats.isFile()) continue;
        const raw = await readFile(expertPath, 'utf8');
        const { data, body } = parseFrontmatter(raw);
        const fm = (data ?? {}) as ExpertFrontmatter;
        const id =
          asString(fm.id) ??
          (SLUG_RE.test(entry.name) ? entry.name : null);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const title = asString(fm.title) ?? id;
        const summary =
          asString(fm.summary) ?? asString(fm.description) ?? '';
        out.push({
          id,
          title,
          summary,
          vertical: asString(fm.vertical),
          tags: asTags(fm.tags),
          body: body.trim(),
          dir,
        });
      } catch {
        // Unreadable or invalid expert folder — skip.
      }
    }
  }

  out.sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

export function findExpertById(
  experts: readonly ExpertInfo[],
  expertId: string | null | undefined,
): ExpertInfo | null {
  if (typeof expertId !== 'string' || expertId.trim().length === 0) return null;
  const needle = expertId.trim();
  return experts.find((expert) => expert.id === needle) ?? null;
}

/** Catalog payload for GET /api/experts (no full body). */
export function toExpertCatalogEntry(expert: ExpertInfo) {
  return {
    id: expert.id,
    title: expert.title,
    summary: expert.summary,
    vertical: expert.vertical,
    tags: expert.tags,
  };
}
