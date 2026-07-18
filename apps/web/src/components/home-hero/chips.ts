// Stage B of plugin-driven-flow-plan — Home intent rail.
//
// The Home input card sits naked above an unstructured prompt. New
// users frequently type a request without knowing which scenario
// plugin to apply, which lands them in the generic agent path and
// stretches the convergence loop. This chip rail exposes high-signal
// NewProjectModal categories plus a small set of lower-row shortcuts
// (plugin authoring / Figma / template), so the same Enter
// keystroke can hit a scenario-bound run. The generic "other" path stays
// in the free-form prompt instead of becoming a redundant chip.
//
// The catalog stays a pure data table:
//   - `id` — stable React key + test selector.
//   - `label` — English copy. Localisation can layer on later by
//     swapping this for a Dict lookup; keeping it inline lets the
//     rail ship without burning through 17 locale files for two
//     new strings (see plan §B / open questions).
//   - `icon` — name from the shared Icon registry.
//   - `action` — discriminated union the HomeView dispatcher matches
//     on. The rail component itself stays presentational.

import type { ProjectKind, ProjectMetadata } from '@open-design/contracts';
import type { DefaultScenarioPluginId } from '@open-design/contracts';
import type { IconName } from '../Icon';

// Plugin ids the chip rail can dispatch to. Most chips route to a
// `DefaultScenarioPluginId` so the same fallback table the daemon
// uses for naked Home queries stays the source of truth. Specialised
// chips (HyperFrames lives under `plugins/_official/examples/hyperframes/`
// and surfaces as the `example-hyperframes` bundled plugin id) bypass
// the default table by carrying their own plugin id directly. The
// curated union keeps typo safety while letting the rail evolve
// independently of the default-binding mapping.
export type ChipScenarioPluginId =
  | DefaultScenarioPluginId
  | 'example-hyperframes'
  // Powered-preview scenarios: real-time GPU / off-main-thread artifacts that
  // render in the cross-origin-isolated "powered preview" iframe. They ship
  // their own bundled example plugins under plugins/_official/examples/, so —
  // like example-hyperframes — they carry their plugin id directly rather than
  // routing through the default kind→plugin table.
  | 'example-webgl-experience';

export type ChipAction =
  | {
      kind: 'apply-scenario';
      pluginId: ChipScenarioPluginId;
      projectKind: ProjectKind;
      inputs?: Record<string, unknown>;
      projectMetadata?: ProjectMetadata;
    }
  | {
      kind: 'apply-figma-migration';
      pluginId: 'od-figma-migration';
      projectKind: ProjectKind;
      inputs?: Record<string, unknown>;
      projectMetadata?: ProjectMetadata;
    }
  // Content-creator outcomes bind a Artifact OS skill (content-repurposer,
  // social-content-factory, ad-creative, card-xiaohongshu, …) rather than a
  // scenario plugin. `promptSeed` is the empty-composer scaffold; when the
  // skill is missing the chip still arms projectKind + metadata so submit
  // produces a content-shaped project.
  | {
      kind: 'apply-skill';
      skillId: string;
      projectKind: ProjectKind;
      promptSeed?: string;
      projectMetadata?: ProjectMetadata;
    }
  | { kind: 'create-plugin' }
  | { kind: 'open-template-picker' }
  // Routes the user into the Brand Kit tab and opens its New Brand Kit modal,
  // reusing the same extraction flow as the tab's own "New Brand Kit" button.
  | { kind: 'create-brand-kit' };

// Two intent groups: "create" = produce a design artifact, "migrate" =
// lower-row starter shortcuts such as plugin authoring, imports, and
// templates. The grouping is structural only — HomeHero renders the two
// groups in separate flex containers so they wrap onto separate rows on
// narrow viewports without horizontal scrolling.
export type ChipGroup = 'create' | 'migrate';

export interface HomeHeroChip {
  id: string;
  label: string;
  icon: IconName;
  group: ChipGroup;
  hint?: string;
  // Scenario subtitle shown under the title on the illustrated card rail
  // (e.g. "Interactive app mockups"). English inline fallback only — the
  // rendered copy is localized through the `homeHero.chip.<id>Desc` Dict key
  // (see `homeHeroChipDescription` in HomeHero.tsx). Kept on the data table so
  // the catalog reads as a self-contained scenario taxonomy.
  description?: string;
  action: ChipAction;
}

export const HOME_HERO_CHIPS: ReadonlyArray<HomeHeroChip> = [
  // ── Content Creator outcomes (Artifact OS primary rail) ─────────
  {
    id: 'content-pack',
    label: 'Content Pack',
    icon: 'layers-filled',
    group: 'create',
    description: 'XHS · TikTok · LinkedIn · Facebook · YouTube · Email',
    hint: 'Turn one source into a multi-platform Content Pro pack.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Create a Content Pro multi-platform pack (XHS · TikTok · LinkedIn · Facebook · YouTube · Threads · Email) with strategy + ready-to-post.\nMVP scope: text + visual direction + scripts only (no rendered video / MP4).\n\nStrategy (fill or I will assume):\n- objective: awareness | engagement | leads | conversion | retention | authority\n- funnel_stage: awareness | consideration | decision | retention\n- persona + 1–2 pains:\n- offer (keyword → deliverable):\n- platform_priority (optional):\n- language:\n\nRequirements: paradox hooks, personal stakes, TikTok script + shot list + peak frame description, XHS carousel slides, Facebook caption (hook in first 125 chars), YouTube title+description+thumb direction, ready-to-post, scores ≥9.0.\n\nSource:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'content-pack',
      },
    },
  },
  {
    id: 'social-content',
    label: 'Social Content',
    icon: 'share',
    group: 'create',
    description: 'Batch posts across platforms',
    hint: 'Batch original social posts under Content Pro standards.',
    action: {
      kind: 'apply-skill',
      skillId: 'social-content-factory',
      projectKind: 'prototype',
      promptSeed:
        'Create a Content Pro v2.2 social batch (5–7 pieces) with strategy + ready-to-post.\n\nStrategy: objective / funnel_stage / persona+pains / offer / platforms / language:\nPillars (≤3):\n\nRequirements: paradox hooks, personal stakes, TikTok peak 10/10 where video, per-piece ready-to-post, calibrated scores ≥9.0. No flat fact titles.\n\nTopic / brief:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'social-content',
      },
    },
  },
  {
    id: 'carousel',
    label: 'Carousel',
    icon: 'grid',
    group: 'create',
    description: 'XHS / IG multi-card posts',
    hint: 'Design a 5–7 card vertical carousel (1080×1440).',
    action: {
      kind: 'apply-skill',
      skillId: 'card-xiaohongshu',
      projectKind: 'prototype',
      promptSeed:
        'Design a 5–7 card XHS-style carousel (1080×1440). Strong cover hook, no soft middle cards, twist + offer CTA on the last card. Topic:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'carousel',
      },
    },
  },
  {
    id: 'short-video',
    label: 'Short Video',
    icon: 'play',
    group: 'create',
    description: 'TikTok / Reels / Shorts',
    hint: 'Script + shot list for a 15–25s short-form video.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'video',
      promptSeed:
        'Create a TikTok / Reels short (15–25s): 0–3s kill hook, uneven energy map, peak 10/10 cinematic frame, spoken + on-screen text + shot list, offer CTA. Topic:\n',
      projectMetadata: {
        kind: 'video',
        intent: 'short-video',
      },
    },
  },
  {
    id: 'linkedin-post',
    label: 'LinkedIn Post',
    icon: 'file-text',
    group: 'create',
    description: 'Authority posts that convert',
    hint: 'Tight LinkedIn post: paradox open, sharp question, soft offer.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Write a tight LinkedIn post (900–1600 chars): paradox first line, short scene, 2–3 proofs, insight, sharp question, soft offer CTA. Topic:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'linkedin-post',
      },
    },
  },
  {
    id: 'facebook-post',
    label: 'Facebook Post',
    icon: 'share',
    group: 'create',
    description: 'Feed caption + 4:5 visual',
    hint: 'Peer-tone Facebook feed post: hook before See more, offer CTA.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Write a Facebook feed post (prefer 4:5 visual direction 1080×1350).\nHook in the first 125 characters (before “See more”). Peer/conversational tone — not a LinkedIn clone.\nInclude caption + image direction + optional first comment + hashtags (0–3) + best time + offer CTA.\n\nTopic / brief:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'facebook-post',
      },
    },
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'play',
    group: 'create',
    description: 'Title · thumb · description',
    hint: 'YouTube package: titles, description, thumbnail direction (+ Shorts script optional).',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Create a YouTube package (MVP: text + visual direction + script — no rendered video).\nDeliver: 2–3 title options (≤70 chars prefer), description (hook in first 2 lines + bullets + offer + links), thumbnail direction (16:9 · ≤5 words on-image).\nIf short-form: Shorts script 15–60s with 0–3s kill hook, peak frame, shot list (same energy bar as TikTok, YT-native title).\n\nTopic / brief:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'youtube',
      },
    },
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'send',
    group: 'create',
    description: 'Subjects + body with one offer',
    hint: 'Email with paradox subjects and a single clear offer CTA.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Write an email pack: 3–4 subject lines (one paradox-led), 120–250 word body, one offer CTA. Topic / list segment:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'email',
      },
    },
  },
  {
    id: 'ad-creative',
    label: 'Ad Creative',
    icon: 'sparkles',
    group: 'create',
    description: 'Paid ad variants at scale',
    hint: 'Generate paid ad creative variants from one brief.',
    action: {
      kind: 'apply-skill',
      skillId: 'ad-variants-generator',
      projectKind: 'prototype',
      promptSeed:
        'Create a Content Pro v2.2 paid ad variant matrix (ready-to-paste headlines, primary text, CTAs).\n\nStrategy: objective / funnel / persona:\nPlatform(s): Meta | TikTok | LinkedIn | Google\nOffer + proof (only real):\nConstraints:\n\nTopic / brief:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'ad-creative',
      },
    },
  },
  {
    id: 'threads',
    label: 'Threads / X',
    icon: 'orbit',
    group: 'create',
    description: 'Short-form text chains',
    hint: 'Write a punchy Threads / X chain with personal stakes.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Write a Threads / X chain (4–8 posts). P1 is the strongest hook with personal stakes; last post = offer CTA. Topic:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'social-content',
      },
    },
  },
  {
    id: 'repurpose',
    label: 'Repurpose',
    icon: 'refresh',
    group: 'create',
    description: '1 source → many formats',
    hint: 'Turn one piece into a multi-platform pack.',
    action: {
      kind: 'apply-skill',
      skillId: 'content-repurposer',
      projectKind: 'prototype',
      promptSeed:
        'Repurpose into multi-platform formats (XHS · TikTok · LinkedIn · Facebook · YouTube · Threads · Email) with strategy block + ready-to-post each platform.\n\nStrategy: objective / funnel_stage / persona+pains / offer:\n\nSource:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'content-pack',
      },
    },
  },
  {
    id: 'hook-engine',
    label: 'Hook Lab',
    icon: 'sparkles',
    group: 'create',
    description: 'Stop-scroll lines only',
    hint: 'Weak→strong hooks for cover, 0–3s, LinkedIn L1, subjects, ads.',
    action: {
      kind: 'apply-skill',
      skillId: 'hook-engine',
      projectKind: 'prototype',
      promptSeed:
        'Hook Engine lab (hooks only — not a full pack).\n\nStrategy: objective / funnel_stage / persona+pains / language:\nSurfaces: XHS cover · TikTok 0–3s · LinkedIn L1 · Threads P1 · Email subjects · Ad headlines\n\nDeliver: weak→strong pairs, framework tags, one primary per surface, calibrated hook scores ≥9.0.\n\nSource / weak draft / topic:\n',
      projectMetadata: {
        kind: 'prototype',
        intent: 'hook-engine',
      },
    },
  },
  {
    id: 'create-brand-kit',
    // Inline English fallback only — the rendered label is localized through
    // the `homeHero.chip.createBrandKit` Dict key (see `homeHeroChipLabel` in
    // HomeHero.tsx / `homeHeroChipLabelForId` in HomeView.tsx) so the Chinese
    // UI shows "创建品牌套件".
    label: 'Create Brand Kit',
    icon: 'swatchbook',
    group: 'create',
    description: 'Extract a brand design system',
    hint: 'Extract a brand kit from a website, then apply it in any chat.',
    // Distinct from the plugin-bound create chips: this dispatches straight
    // into the Brand Kit tab's extraction flow instead of binding a scenario
    // plugin to the composer.
    action: { kind: 'create-brand-kit' },
  },
  {
    id: 'prototype',
    label: 'Prototype',
    icon: 'palette',
    group: 'create',
    description: 'Interactive app mockups',
    // Prototype now binds to the bundled `example-web-prototype` plugin,
    // which ships `assets/template.html` (single-file HTML prototype
    // seed), `references/layouts.md` (paste-ready section layouts), and
    // a P0 checklist. The previous routing to the generic
    // od-new-generation router left the agent to invent every section's
    // CSS, producing inconsistent type scales and density between turns.
    // Web-prototype's manifest owns the editable `{{fidelity}}`,
    // `{{artifactKind}}`, `{{audience}}`, `{{designSystem}}`, and
    // `{{template}}` slots; Home renders those placeholders inline.
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-web-prototype',
      projectKind: 'prototype',
    },
  },
  {
    id: 'web-clone',
    label: 'Website clone',
    icon: 'globe',
    group: 'create',
    description: 'Recreate an existing website',
    hint: 'Paste a site URL and recreate its structure, visuals, and interactions from real source evidence.',
    // Website reproduction is its own creation workflow (start from a target
    // URL, source-first recon, preserve real structure/assets), so it binds
    // the bundled `example-web-clone` skill instead of the blank prototype
    // seed. The project still stores `kind: 'prototype'` for preview
    // behavior; `intent: 'web-clone'` routes the scenario plugin and splits
    // the analytics `project_kind` (see contracts scenario-defaults/events).
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-web-clone',
      projectKind: 'prototype',
      projectMetadata: {
        kind: 'prototype',
        intent: 'web-clone',
      },
    },
  },
  {
    id: 'wireframe',
    label: 'Wireframe',
    icon: 'layout',
    group: 'create',
    description: 'Lo-fi screens & flows',
    hint: 'Sketch lo-fi screens and flows to validate structure before visual design.',
    // Wireframe reuses the battle-tested web-prototype seed but stamps a
    // lo-fi fidelity so the agent stays in structural/greybox territory
    // instead of jumping to high-fidelity styling.
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-web-prototype',
      projectKind: 'prototype',
      projectMetadata: {
        kind: 'prototype',
        fidelity: 'wireframe',
      },
    },
  },
  {
    id: 'mobile',
    label: 'Mobile app',
    icon: 'smartphone',
    group: 'create',
    description: 'iOS & Android screens',
    hint: 'Lay out mobile screens for iOS and Android.',
    // Mobile reuses the web-prototype seed but records mobile platform
    // targets so the agent frames screens for handheld viewports.
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-web-prototype',
      projectKind: 'prototype',
      projectMetadata: {
        kind: 'prototype',
        platform: 'auto',
        platformTargets: ['mobile-ios', 'mobile-android'],
      },
    },
  },
  {
    id: 'deck',
    label: 'Slide deck',
    icon: 'present',
    group: 'create',
    description: 'Presentations & pitch decks',
    // Slide deck binds to `example-simple-deck`, which ships a 353-line
    // `assets/template.html` (the 1920×1080 + scale-to-fit + nav + print
    // framework paired with proven slide CSS), 8 paste-ready layouts in
    // `references/layouts.md` (cover, body, big-stat, three-point,
    // pipeline, dark quote, before/after, closing), and a P0/P1/P2
    // checklist that catches overflow at 1280×800 / 1440×900. The
    // previous routing to od-new-generation gave the agent only the
    // generic deck-framework directive — which fixed nav but not slide
    // layout — so density bugs (168px headline + absolute footer
    // collision) shipped on default decks.
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-simple-deck',
      projectKind: 'deck',
    },
  },
  {
    id: 'document',
    label: 'Document',
    icon: 'file-text',
    group: 'create',
    description: 'Resumes, reports & PDFs',
    hint: 'Draft a polished document — resume, report, or PDF — you can export.',
    // Documents (resumes / reports / PDFs) route through the generic
    // od-new-generation scenario under the `other` kind; there is no
    // dedicated bundled document seed yet, so the agent composes the
    // document layout from the brief.
    action: {
      kind: 'apply-scenario',
      pluginId: 'od-new-generation',
      projectKind: 'other',
      inputs: {
        artifactKind: 'document',
        audience: 'readers',
        topic: 'the user brief',
      },
      projectMetadata: {
        kind: 'other',
        // Analytics-only tag: splits this card's projects out of generic
        // `other` so `project_kind` reports `document` (matches the task_chip).
        // No product behavior keys off `intent: 'document'`.
        intent: 'document',
      },
    },
  },
  {
    id: 'hyperframes',
    label: 'HyperFrames',
    icon: 'orbit',
    group: 'create',
    description: 'Motion graphics & loops',
    hint: 'Author HTML-based motion: captions, audio-reactive visuals, scene transitions.',
    // HyperFrames is its own bundled scenario (motion-graphics
    // specialisation of Video). It surfaces in PluginsHomeSection's
    // primary category list, so the rail picks it up too rather than
    // hiding the specialised bucket behind the generic Video chip.
    action: { kind: 'apply-scenario', pluginId: 'example-hyperframes', projectKind: 'video' },
  },
  {
    id: 'webgl',
    label: 'WebGL experience',
    icon: 'sparkles',
    group: 'create',
    description: 'Shaders, 3D & generative GPU visuals',
    hint: 'Build a full-screen real-time WebGL2 shader / 3D scene that runs live on the GPU.',
    // Powered-preview scenario: binds the bundled `example-webgl-experience`
    // plugin (shader/3D seed + P0 checklist). The artifact auto-detects into
    // powered preview via its `getContext('webgl2')` call.
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-webgl-experience',
      projectKind: 'prototype',
      projectMetadata: {
        kind: 'prototype',
        intent: 'webgl-experience',
        fidelity: 'high-fidelity',
      },
    },
  },
  {
    id: 'live-artifact',
    label: 'Live artifact',
    icon: 'refresh',
    group: 'create',
    description: 'Data-backed live dashboards',
    hint: 'Build a refreshable artifact backed by connector or local data.',
    action: {
      kind: 'apply-scenario',
      pluginId: 'example-live-artifact',
      projectKind: 'prototype',
      projectMetadata: {
        kind: 'prototype',
        intent: 'live-artifact',
        fidelity: 'high-fidelity',
      },
    },
  },
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    group: 'create',
    description: 'Posters, graphics & art',
    action: {
      kind: 'apply-scenario',
      pluginId: 'od-media-generation',
      projectKind: 'image',
      inputs: {
        mediaKind: 'image',
        subject: 'a polished product concept',
        style: 'cinematic, high-quality, on-brand',
        aspect: '16:9',
      },
    },
  },
  {
    id: 'video',
    label: 'Video',
    icon: 'play',
    group: 'create',
    description: 'Clips, reels & promos',
    action: {
      kind: 'apply-scenario',
      pluginId: 'od-media-generation',
      projectKind: 'video',
      inputs: {
        mediaKind: 'video',
        subject: 'a short product reveal',
        style: 'cinematic, high-quality, on-brand',
        aspect: '16:9',
      },
    },
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: 'mic',
    group: 'create',
    description: 'Voiceovers, music & SFX',
    action: {
      kind: 'apply-scenario',
      pluginId: 'od-media-generation',
      projectKind: 'audio',
      inputs: {
        mediaKind: 'audio',
        subject: 'a concise audio identity for a product',
        style: 'clear, polished, modern',
        aspect: '16:9',
      },
    },
  },
  {
    id: 'create-plugin',
    label: 'Create plugin',
    icon: 'edit',
    group: 'migrate',
    hint: 'Author a reusable Artifact OS plugin and add it to My plugins.',
    action: { kind: 'create-plugin' },
  },
  {
    id: 'figma',
    label: 'From Figma',
    icon: 'import',
    group: 'migrate',
    hint: 'Migrate a Figma frame into the active design system.',
    action: {
      kind: 'apply-figma-migration',
      pluginId: 'od-figma-migration',
      projectKind: 'prototype',
      inputs: {
        figmaUrl: 'the Figma file URL you provide',
        targetStack: 'React 18 + Tailwind',
      },
    },
  },
  {
    id: 'template',
    label: 'From template',
    icon: 'file-code',
    group: 'migrate',
    hint: 'Start from a bundled template.',
    action: { kind: 'open-template-picker' },
  },
];

export function chipsForGroup(group: ChipGroup): HomeHeroChip[] {
  return HOME_HERO_CHIPS.filter((c) => c.group === group);
}

// Display order for the inline `create` scenario rail. Artifact OS
// leads with creator outcomes (Content Pack / Social / Carousel / …), then
// keeps the classic design surfaces (deck / prototype / …) so Website / Slide
// are no longer the only visible path. Brand Kit is intentionally omitted
// here so it trails — it dispatches into the Brand Kit tab rather than
// seeding a scenario. Any create chip not listed keeps catalog order after
// the explicit entries (see `orderedCreateChips`).
// Creator-facing Quick Start order (large tiles). Design surfaces trail.
export const CREATOR_QUICK_START_IDS = [
  'content-pack',
  'hook-engine',
  'carousel',
  'short-video',
  'linkedin-post',
  'facebook-post',
  'youtube',
  'threads',
  'email',
  'ad-creative',
  'repurpose',
] as const;

export type CreatorQuickStartId = (typeof CREATOR_QUICK_START_IDS)[number];

/** Hierarchical workflow launcher groups (mockup 6). Featured is always content-pack. */
export const CREATOR_WORKFLOW_FEATURED_ID = 'content-pack' as const satisfies CreatorQuickStartId;

export const CREATOR_WORKFLOW_QUICK_IDS = [
  'hook-engine',
  'carousel',
  'short-video',
  'linkedin-post',
  'email',
  'threads',
] as const satisfies ReadonlyArray<CreatorQuickStartId>;

export const CREATOR_WORKFLOW_PUBLISH_IDS = [
  'youtube',
  'facebook-post',
  'ad-creative',
  'repurpose',
] as const satisfies ReadonlyArray<CreatorQuickStartId>;

/** Badge overlay on workflow cards (meta chip). */
export type CreatorWorkflowBadge = 'featured' | 'popular' | 'aiRecommended' | 'new';

export const CREATOR_WORKFLOW_BADGE: Partial<Record<CreatorQuickStartId, CreatorWorkflowBadge>> = {
  'content-pack': 'featured',
  'hook-engine': 'popular',
  'linkedin-post': 'aiRecommended',
  email: 'new',
};

export const CREATE_RAIL_ORDER = [
  ...CREATOR_QUICK_START_IDS,
  'social-content',
  'deck',
  'prototype',
  'web-clone',
  'wireframe',
  'mobile',
  'document',
  'hyperframes',
  'webgl',
  'live-artifact',
  'image',
  'video',
  'audio',
] as const;

export function isCreatorQuickStartId(id: string): id is CreatorQuickStartId {
  return (CREATOR_QUICK_START_IDS as readonly string[]).includes(id);
}

export function orderedCreatorQuickStarts(): HomeHeroChip[] {
  return CREATOR_QUICK_START_IDS
    .map((id) => findChip(id))
    .filter((chip): chip is HomeHeroChip => Boolean(chip));
}

// Chip ids the onboarding "build a design system" teaser intentionally omits.
// Video and Audio are the trailing pure-media outputs in CREATE_RAIL_ORDER and
// the least central to the design-system story, so they are the first to drop
// when keeping the teaser chips to a single tidy row. Website clone starts
// from someone else's site rather than the user's design system, so it stays
// off the design-system teaser too.
const ONBOARDING_ARTIFACT_OMIT = new Set<string>(['web-clone', 'video', 'audio']);

// The artifact chips shown on the onboarding "build a design system" step — a
// curated single-row subset of the create rail. Derived from CREATE_RAIL_ORDER
// (not a separately maintained list) so it stays in the same priority order as
// the Home rail and never drifts from the real template catalog.
export const ONBOARDING_ARTIFACT_CHIP_IDS = CREATE_RAIL_ORDER.filter(
  (id) => !ONBOARDING_ARTIFACT_OMIT.has(id),
);

// The `create` chips in rail-display order. Listed ids come first in
// `CREATE_RAIL_ORDER`; any unlisted create chip (e.g. `create-brand-kit`)
// trails in catalog order. Reordering through this helper keeps the catalog
// data table stable while letting the rail lead with the slide deck.
export function orderedCreateChips(): HomeHeroChip[] {
  const create = chipsForGroup('create');
  const listed = CREATE_RAIL_ORDER
    .map((id) => create.find((c) => c.id === id))
    .filter((c): c is HomeHeroChip => Boolean(c));
  const listedIds = new Set<string>(CREATE_RAIL_ORDER);
  const rest = create.filter((c) => !listedIds.has(c.id));
  return [...listed, ...rest];
}

// Helper used by tests + the rail component to pull the chip metadata
// off a click target without round-tripping through React state.
export function findChip(id: string): HomeHeroChip | undefined {
  return HOME_HERO_CHIPS.find((c) => c.id === id);
}
