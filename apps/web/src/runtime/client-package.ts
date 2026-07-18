/**
 * Client Package export — agency-ready zip of marketing deliverables.
 *
 * Layout (under `{package-slug}/`):
 *   PACKAGE.md           — manifest + brand + how to use
 *   brand.json           — brandSlug, title, platforms, dates
 *   notes/delivery.md    — strategy / notes for the client
 *   captions/{platform}.txt
 *   source/index.html    — original artifact (optional)
 *
 * Agents produce full packages via skill `client-package`; this module
 * assembles a zip from HTML ready-to-post sections or explicit caption maps.
 */

import { buildZip, type ZipEntry } from './zip';

export type ClientPackagePlatform =
  | 'xhs'
  | 'tiktok'
  | 'linkedin'
  | 'threads'
  | 'email'
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'other';

export type ClientPackageCaption = {
  platform: ClientPackagePlatform | string;
  /** Human label (e.g. "LinkedIn", "TikTok") */
  label: string;
  /** Ready-to-paste body */
  body: string;
  /** Optional best-time / notes line */
  meta?: string;
};

export type ClientPackageInput = {
  title: string;
  /** design-systems slug when known */
  brandSlug?: string | null;
  /** Freeform delivery notes / strategy */
  notes?: string;
  captions?: ClientPackageCaption[];
  /** Original HTML artifact */
  sourceHtml?: string;
  /** Project id for traceability */
  projectId?: string;
  /** ISO date override */
  deliveredAt?: string;
};

function safeSlug(name: string, fallback = 'client-package'): string {
  const slug = (name || fallback)
    .replace(/[^\w.\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

function platformFileStem(platform: string): string {
  return safeSlug(platform, 'platform').toLowerCase();
}

/** Map common heading text → platform id */
export function inferPlatformFromHeading(heading: string): ClientPackagePlatform | string {
  const h = heading.toLowerCase();
  if (/\bxhs\b|xiaohongshu|小红书|xhs ·/.test(h)) return 'xhs';
  if (/\btiktok\b|抖音|short_video/.test(h)) return 'tiktok';
  if (/\blinkedin\b/.test(h)) return 'linkedin';
  if (/\bthreads\b/.test(h)) return 'threads';
  if (/\bemail\b|e-mail|newsletter/.test(h)) return 'email';
  if (/\bfacebook\b|\bfb\b/.test(h)) return 'facebook';
  if (/\byoutube\b|\bshorts\b/.test(h)) return 'youtube';
  if (/\binstagram\b|\big\b/.test(h)) return 'instagram';
  return 'other';
}

/**
 * Extract ready-to-post captions from Content Pro style HTML.
 * Looks for:
 *   1) `#ready-to-post` section with platform cards
 *   2) `h2` sections that look like platforms + following `.copy` / `<pre>` blocks
 */
export function extractCaptionsFromHtml(html: string): ClientPackageCaption[] {
  if (!html || typeof html !== 'string') return [];

  // Scan full document (platform craft sections) AND optional #ready-to-post
  // so we do not drop XHS/TikTok/etc. when a smaller RTP section also exists.
  const rtp = /<section[^>]*\bid\s*=\s*["']ready-to-post["'][^>]*>([\s\S]*?)<\/section>/i.exec(html);
  const scopes = [html];
  if (rtp?.[1]) scopes.push(rtp[1]);

  const captions: ClientPackageCaption[] = [];
  const seenPlatform = new Set<string>();

  for (const scope of scopes) {
    // Pattern: h2/h3 heading then nearest .copy or pre block
    const headingRe = /<h([23])[^>]*>\s*([\s\S]*?)\s*<\/h\1>/gi;
    let m: RegExpExecArray | null;
    const headings: Array<{ index: number; label: string }> = [];
    while ((m = headingRe.exec(scope)) !== null) {
      const label = stripTags(m[2] || '').replace(/\s+/g, ' ').trim();
      if (!label) continue;
      // Skip pure strategy/score headings that are not platforms
      if (
        /^(strategy|spine|hook lab|qa|handoff|score|personal stakes|cover|ready-to-post)/i.test(
          label,
        )
      ) {
        continue;
      }
      headings.push({ index: m.index, label });
    }

    for (let i = 0; i < headings.length; i++) {
      const start = headings[i]!.index;
      const end = i + 1 < headings.length ? headings[i + 1]!.index : scope.length;
      const chunk = scope.slice(start, end);
      const copy =
        extractFirstBlock(chunk, /<div[^>]*class=["'][^"']*\bcopy\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
        extractFirstBlock(chunk, /<pre[^>]*>([\s\S]*?)<\/pre>/i) ||
        extractFirstBlock(chunk, /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
      if (!copy || copy.length < 8) continue;

      const label = headings[i]!.label;
      const platform = inferPlatformFromHeading(label);
      // Prefer first occurrence per platform id (usually the craft section).
      if (seenPlatform.has(String(platform))) continue;
      // Only keep headings that look like a real platform (or ready-to-post card).
      if (platform === 'other' && !/ready|caption|post|email|subject/i.test(label)) continue;
      seenPlatform.add(String(platform));

      const metaMatch = /best time[^:]*:\s*([^\n<]+)/i.exec(chunk);
      captions.push({
        platform,
        label,
        body: decodeEntities(copy).trim(),
        ...(metaMatch?.[1] ? { meta: stripTags(metaMatch[1]).trim() } : {}),
      });
    }
  }

  return captions;
}

function extractFirstBlock(chunk: string, re: RegExp): string | null {
  const m = re.exec(chunk);
  if (!m?.[1]) return null;
  return stripTags(m[1]).replace(/\r\n/g, '\n').trim();
}

function stripTags(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** Extract a short strategy / notes blurb from pack HTML when present. */
export function extractNotesFromHtml(html: string): string {
  if (!html) return '';
  const strategy =
    /<h2[^>]*>\s*(?:1\.\s*)?Strategy[\s\S]*?<\/h2>\s*<div[^>]*class=["'][^"']*card[^"']*["'][^>]*>([\s\S]*?)<\/div>/i.exec(
      html,
    ) ||
    /<section[^>]*\bid\s*=\s*["'][^"']*strategy[^"']*["'][^>]*>([\s\S]*?)<\/section>/i.exec(html);
  if (strategy?.[1]) {
    return decodeEntities(stripTags(strategy[1])).replace(/\n{3,}/g, '\n\n').trim().slice(0, 4000);
  }
  return '';
}

export function buildClientPackageReadme(input: ClientPackageInput & { packageSlug: string }): string {
  const brand = input.brandSlug?.trim() || '(not set)';
  const platforms =
    (input.captions?.length
      ? input.captions.map((c) => `- **${c.label}** → \`captions/${platformFileStem(String(c.platform))}.txt\``)
      : ['- _(no captions extracted — paste from source/index.html)_']
    ).join('\n');

  return `# Client Package — ${input.title}

| | |
|--|--|
| **Brand** | \`${brand}\` |
| **Package** | \`${input.packageSlug}\` |
| **Delivered** | ${input.deliveredAt || new Date().toISOString().slice(0, 10)} |
| **Project** | ${input.projectId || '—'} |

## Contents

\`\`\`
${input.packageSlug}/
  PACKAGE.md                 ← this file
  brand.json                 ← machine-readable brand + platforms
  notes/delivery.md          ← strategy / delivery notes
  captions/                  ← one ready-to-paste file per platform
  source/index.html          ← original artifact (if included)
\`\`\`

## Captions

${platforms}

## How to use

1. Open \`captions/\` and copy the file for each network into the scheduler.  
2. Keep brand voice consistent with active Brand DESIGN.md **§8 Voice & Tone**.  
3. Review \`notes/delivery.md\` before client send.  
4. Optional: open \`source/index.html\` for full visual pack / hooks.

## Built with

Artifact OS · Content Pro v2.2 marketing vertical · skill \`client-package\`
`;
}

export function buildClientPackageBrandJson(input: ClientPackageInput): string {
  return `${JSON.stringify(
    {
      title: input.title,
      brandSlug: input.brandSlug || null,
      projectId: input.projectId || null,
      deliveredAt: input.deliveredAt || new Date().toISOString().slice(0, 10),
      platforms: (input.captions || []).map((c) => ({
        id: c.platform,
        label: c.label,
        file: `captions/${platformFileStem(String(c.platform))}.txt`,
      })),
      schema: 'artifact-os.client-package.v1',
    },
    null,
    2,
  )}\n`;
}

export function buildClientPackageNotes(input: ClientPackageInput): string {
  const brand = input.brandSlug?.trim() || '(not set)';
  const body =
    (input.notes && input.notes.trim()) ||
    '_No strategy notes extracted. Add delivery notes before sending to the client._';

  return `# Delivery notes — ${input.title}

**Brand:** \`${brand}\`  
**Date:** ${input.deliveredAt || new Date().toISOString().slice(0, 10)}

---

${body}

---

## QA before client send

- [ ] Captions platform-native (not copy-pasted across networks)  
- [ ] Offer / CTA present where needed  
- [ ] Brand voice matches DESIGN.md §8  
- [ ] No invented stats or fake social proof  
- [ ] Files named clearly under \`captions/\`
`;
}

/**
 * Pure builder — returns zip entries under `{packageSlug}/…`.
 * Safe to unit test without DOM download.
 */
export function buildClientPackageEntries(input: ClientPackageInput): {
  packageSlug: string;
  entries: ZipEntry[];
} {
  const packageSlug = safeSlug(input.title, 'client-package');
  const root = packageSlug;
  const captions = input.captions ?? [];
  const entries: ZipEntry[] = [
    {
      path: `${root}/PACKAGE.md`,
      content: buildClientPackageReadme({ ...input, packageSlug }),
    },
    {
      path: `${root}/brand.json`,
      content: buildClientPackageBrandJson(input),
    },
    {
      path: `${root}/notes/delivery.md`,
      content: buildClientPackageNotes(input),
    },
  ];

  if (captions.length === 0) {
    entries.push({
      path: `${root}/captions/README.md`,
      content:
        '# Captions\n\nNo ready-to-post captions were found in the artifact HTML.\n' +
        'Open `../source/index.html` and copy from the Ready-to-post section, ' +
        'or re-run skill `client-package` / `content-repurposer`.\n',
    });
  } else {
    // Avoid collisions when multiple captions map to the same platform stem.
    const used = new Map<string, number>();
    for (const cap of captions) {
      let stem = platformFileStem(String(cap.platform));
      const n = (used.get(stem) || 0) + 1;
      used.set(stem, n);
      if (n > 1) stem = `${stem}-${n}`;
      const header = [
        `# ${cap.label}`,
        cap.meta ? `# ${cap.meta}` : null,
        '',
        cap.body,
        '',
      ]
        .filter((line) => line !== null)
        .join('\n');
      entries.push({ path: `${root}/captions/${stem}.txt`, content: header });
    }
  }

  if (input.sourceHtml && input.sourceHtml.trim()) {
    entries.push({
      path: `${root}/source/index.html`,
      content: input.sourceHtml,
    });
  }

  return { packageSlug, entries };
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Build + download a Client Package zip from HTML source and optional brand.
 * Returns false when neither captions nor source HTML can be packaged.
 */
export function exportClientPackageZip(input: ClientPackageInput): boolean {
  const captions =
    input.captions && input.captions.length > 0
      ? input.captions
      : input.sourceHtml
        ? extractCaptionsFromHtml(input.sourceHtml)
        : [];
  const notes =
    input.notes?.trim() ||
    (input.sourceHtml ? extractNotesFromHtml(input.sourceHtml) : '') ||
    undefined;

  if (!captions.length && !(input.sourceHtml && input.sourceHtml.trim())) {
    return false;
  }

  const { packageSlug, entries } = buildClientPackageEntries({
    ...input,
    captions,
    notes,
  });
  const blob = buildZip(entries);
  triggerDownload(blob, `${packageSlug}-client-package.zip`);
  return true;
}
