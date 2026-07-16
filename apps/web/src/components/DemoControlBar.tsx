// Demo-only floating control bar.
// Renders globally (portal to document.body) so it's visible on every route,
// including the onboarding flow.

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { isVisualStabilityMode } from '../utils/visualStability';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

export type DemoScenario =
  | 'home'
  | 'owner'
  | 'manager'
  | 'editor'
  | 'viewer'
  | 'onboarding-new'
  | 'invite-editor'
  | 'invite-editor-existing'
  | 'invite-editor-new'
  | 'invite-admin'
  | 'invite-viewer';

export function isInviteScenario(
  s: DemoScenario,
): s is Extract<DemoScenario, 'invite-editor' | 'invite-editor-existing' | 'invite-editor-new'> {
  return s === 'invite-editor' || s === 'invite-editor-existing' || s === 'invite-editor-new';
}

export function isViewerScenario(s: DemoScenario): boolean {
  // Legacy read-only demo ids kept only for backwards-compatible state/links.
  return s === 'viewer' || s === 'invite-viewer';
}

export function canManageWorkspaceScenario(s: DemoScenario): boolean {
  return s === 'home' || s === 'owner' || s === 'manager' || s === 'invite-admin';
}

// Membership tier — an axis independent of the scenario. Free + the three
// personal tiers (Plus / Pro / Max) are single-seat (solo); team unlocks
// multi-seat collaboration. Upgrade paths: Plus → Pro/Max/Team, Pro → Max/Team,
// Max → Team (and Free → any paid tier).
export type DemoPlan = 'free' | 'plus' | 'pro' | 'max' | 'team';
export type DemoUseMode = 'cloud' | 'local';
export type DemoPage = 'home' | 'onboarding';

export function isSoloPlan(p: DemoPlan): boolean {
  return p !== 'team';
}

export type InviteRole = 'editor' | 'admin';

interface Props {
  page: DemoPage;
  onPage: (page: DemoPage) => void;
  scenario: DemoScenario;
  onScenario: (s: DemoScenario) => void;
  plan: DemoPlan;
  onPlan: (p: DemoPlan) => void;
  useMode: DemoUseMode;
  onUseMode: (mode: DemoUseMode) => void;
  /** Fires the "积分不足" upgrade/top-up flow. */
  onLowCredits: () => void;
  /** Opens the top-tier auto-recharge demo flow. */
  onAutoRecharge?: (scope: 'team' | 'member') => void;
  /** Launches the invitee acceptance flow (email link → join workspace). */
  onAcceptInvite: (role: InviteRole) => void;
}

type T = ReturnType<typeof useT>;

// Chip labels/descs that carry translatable copy hold an i18n key; plain
// brand/role tokens (Onboarding, Owner, free, …) stay as literals. `chipText`
// resolves a value: a known key goes through t(), anything else renders as-is.
function chipText(t: T, value: string): string {
  return value.startsWith('demo.DemoControlBar.tsx.') ? t(value as keyof Dict) : value;
}

const PAGE_CHIPS: Array<{ id: DemoPage; label: string }> = [
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'home', label: 'demo.DemoControlBar.tsx.page-home' },
];

const SCENARIO_CHIPS: Array<{ id: DemoScenario; label: string }> = [
  { id: 'onboarding-new', label: 'demo.DemoControlBar.tsx.scenario-onboarding-new' },
];

const ROLE_CHIPS: Array<{ id: DemoScenario; label: string; invite?: boolean }> = [
  { id: 'invite-editor-existing', label: 'demo.DemoControlBar.tsx.role-invite-web', invite: true },
  { id: 'invite-editor-new', label: 'demo.DemoControlBar.tsx.role-invite-client-unregistered', invite: true },
];

const VIEW_CHIPS: Array<{ id: DemoScenario; label: string }> = [
  { id: 'owner', label: 'Owner' },
  // Scenario ids stay stable for the demo harness; labels follow the
  // current role model: Owner / Admin / Member.
  { id: 'manager', label: 'Admin' },
  { id: 'editor', label: 'Member' },
];

const PLAN_CHIPS: Array<{ id: DemoPlan; label: string }> = [
  { id: 'free', label: 'free' },
  { id: 'plus', label: 'Plus' },
  { id: 'pro',  label: 'Pro' },
  { id: 'max',  label: 'Max' },
  { id: 'team', label: 'team' },
];

const USE_MODE_CHIPS: Array<{ id: DemoUseMode; label: string; desc: string }> = [
  { id: 'cloud', label: 'Cloud', desc: 'demo.DemoControlBar.tsx.usemode-cloud-desc' },
  { id: 'local', label: 'CLI / BYOK', desc: 'demo.DemoControlBar.tsx.usemode-local-desc' },
];

const DEMO_BAR_COLLAPSED_KEY = 'od.demoBar.collapsed';

function readCollapsedState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(DEMO_BAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeCollapsedState(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEMO_BAR_COLLAPSED_KEY, collapsed ? 'true' : 'false');
  } catch {
    /* ignore disabled storage */
  }
}

function labelForScenario(t: T, scenario: DemoScenario): string {
  const chip = [...SCENARIO_CHIPS, ...ROLE_CHIPS, ...VIEW_CHIPS].find((c) => c.id === scenario);
  return chip ? chipText(t, chip.label) : t('demo.DemoControlBar.tsx.page-home');
}

function labelForPage(t: T, page: DemoPage): string {
  const chip = PAGE_CHIPS.find((c) => c.id === page);
  return chip ? chipText(t, chip.label) : t('demo.DemoControlBar.tsx.page-home');
}

function labelForPlan(plan: DemoPlan): string {
  return PLAN_CHIPS.find((chip) => chip.id === plan)?.label ?? 'free';
}

function labelForUseMode(useMode: DemoUseMode): string {
  return USE_MODE_CHIPS.find((chip) => chip.id === useMode)?.label ?? 'Cloud';
}

function Bar({ page, onPage, scenario, onScenario, plan, onPlan, useMode, onUseMode, onLowCredits, onAutoRecharge, onAcceptInvite }: Props) {
  const t = useT();
  const [collapsed, setCollapsed] = useState(readCollapsedState);
  const availablePlans = useMode === 'local'
    ? PLAN_CHIPS.filter((chip) => chip.id !== 'team')
    : PLAN_CHIPS;

  useEffect(() => {
    writeCollapsedState(collapsed);
  }, [collapsed]);

  if (collapsed) {
    return (
      <div className="demo-bar demo-bar--collapsed">
        <button
          type="button"
          className="demo-bar__summary"
          onClick={() => setCollapsed(false)}
          aria-label={t('demo.DemoControlBar.tsx.aria-expand')}
          aria-expanded="false"
        >
          <span className="demo-bar__summary-dot" aria-hidden />
          <span className="demo-bar__summary-title">Control</span>
          <span className="demo-bar__summary-meta">{labelForPage(t, page)} · {labelForUseMode(useMode)} · {labelForPlan(plan)}</span>
          <span className="demo-bar__summary-caret" aria-hidden>⌃</span>
        </button>
      </div>
    );
  }
  return (
    <div className="demo-bar">
      <div className="demo-bar__handle">
        <span className="demo-bar__handle-title">Control</span>
        <button
          type="button"
          className="demo-bar__collapse"
          onClick={() => setCollapsed(true)}
          aria-label={t('demo.DemoControlBar.tsx.aria-collapse')}
          aria-expanded="true"
        >
          {t('demo.DemoControlBar.tsx.collapse')}
        </button>
      </div>

      <div className="demo-bar__body">
        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-use-mode')}</span>
          <div className="demo-bar__chips">
            {USE_MODE_CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${useMode === c.id ? ' is-active' : ''}`}
                onClick={() => onUseMode(c.id)}
                title={chipText(t, c.desc)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-page')}</span>
          <div className="demo-bar__chips">
            {PAGE_CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${page === c.id ? ' is-active' : ''}`}
                onClick={() => onPage(c.id)}
              >
                {chipText(t, c.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-view')}</span>
          <div className="demo-bar__chips">
            {VIEW_CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${
                  (scenario === 'home' && c.id === 'owner') || scenario === c.id
                    ? ' is-active'
                    : ''
                }`}
                onClick={() => onScenario(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-bar__group demo-bar__group--scenario">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-path')}</span>
          <div className="demo-bar__chips">
            {SCENARIO_CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${scenario === c.id ? ' is-active' : ''}`}
                onClick={() => onScenario(c.id)}
              >
                {chipText(t, c.label)}
              </button>
            ))}
            {ROLE_CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${scenario === c.id ? ' is-active' : ''}`}
                onClick={() => onScenario(c.id)}
              >
                {chipText(t, c.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-bar__divider" />

        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-plan')}</span>
          <div className="demo-bar__chips">
            {availablePlans.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`demo-bar__chip${plan === c.id ? ' is-active' : ''}`}
                onClick={() => onPlan(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-bar__divider" />

        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-auto-recharge')}</span>
          <div className="demo-bar__chips">
            <button type="button" className="demo-bar__chip" onClick={() => onAutoRecharge?.('team')}>
              {t('demo.DemoControlBar.tsx.auto-recharge-all')}
            </button>
            <button type="button" className="demo-bar__chip" onClick={() => onAutoRecharge?.('member')}>
              {t('demo.DemoControlBar.tsx.auto-recharge-single')}
            </button>
          </div>
        </div>

        <div className="demo-bar__divider" />

        <div className="demo-bar__group">
          <span className="demo-bar__label">{t('demo.DemoControlBar.tsx.group-demo')}</span>
          <div className="demo-bar__chips">
            <button type="button" className="demo-bar__chip demo-bar__chip--warning" onClick={onLowCredits}>
              {t('demo.DemoControlBar.tsx.low-credits')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export function DemoControlBar(props: Props) {
  // The demo scenario switcher is scaffolding, not a captured product surface.
  // In visual-stability mode its fixed portal overlaps and intercepts pointer
  // events on menu/dialog affordances (e.g. entry-settings), so keep it out of
  // the DOM entirely there. Hooks stay unconditional to satisfy the rules of
  // hooks; only the body-append and the portal render are gated.
  const visualStability = isVisualStabilityMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  if (!containerRef.current) {
    const div = document.createElement('div');
    div.className = 'demo-bar-portal';
    containerRef.current = div;
  }

  useEffect(() => {
    if (visualStability) return;
    const el = containerRef.current!;
    document.body.appendChild(el);
    return () => { document.body.removeChild(el); };
  }, [visualStability]);

  if (visualStability) return null;
  return createPortal(<Bar {...props} />, containerRef.current);
}
