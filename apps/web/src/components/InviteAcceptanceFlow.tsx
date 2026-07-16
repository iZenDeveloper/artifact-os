// Invite-acceptance flow (demo-only).
//
// Models the invitee journey from the email link to collaborating:
//   收到邀请邮件 → 点击链接 → Web 落地页 → 账号校验(登录/注册)
//     → 确认加入 Workspace? → 角色=邀请时设定 → 加入成功占 1 席 → 开始协作
//   (拒绝/忽略 → 邀请保持待定 pending)
//
// Rendered as a full-viewport portal overlay above the whole app so it reads
// as a standalone landing page reached from an external email link, not an
// in-app modal. Demo-only: no real auth / backend writes.

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { Confetti } from './Confetti';
import type { DemoScenario } from './DemoControlBar';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

export type InviteRole = 'editor' | 'admin';

interface RoleMeta {
  labelKey: keyof Dict;
  enKey: keyof Dict;
  permKey: keyof Dict;
  scenario: DemoScenario;
}

const ROLE_META: Record<InviteRole, RoleMeta> = {
  editor: {
    labelKey: 'demo.InviteAcceptanceFlow.tsx.role.editor.label',
    enKey: 'demo.InviteAcceptanceFlow.tsx.role.editor.en',
    permKey: 'demo.InviteAcceptanceFlow.tsx.role.editor.perm',
    scenario: 'invite-editor',
  },
  admin: {
    labelKey: 'demo.InviteAcceptanceFlow.tsx.role.admin.label',
    enKey: 'demo.InviteAcceptanceFlow.tsx.role.admin.en',
    permKey: 'demo.InviteAcceptanceFlow.tsx.role.admin.perm',
    scenario: 'invite-admin',
  },
};

// Demo workspace the invite points at.
const WORKSPACE: {
  nameKey: keyof Dict;
  logo: string;
  inviterKey: keyof Dict;
  inviterInitialKey: keyof Dict;
  members: number;
  projects: number;
  invitedEmail: string;
} = {
  nameKey: 'demo.InviteAcceptanceFlow.tsx.workspace.name',
  logo: 'N',
  inviterKey: 'demo.InviteAcceptanceFlow.tsx.workspace.inviter',
  inviterInitialKey: 'demo.InviteAcceptanceFlow.tsx.workspace.inviterInitial',
  members: 12,
  projects: 8,
  invitedEmail: 'you@company.com',
};

type Step = 'landing' | 'auth' | 'confirm' | 'joined' | 'declined';

interface Props {
  open: boolean;
  role: InviteRole;
  onClose: () => void;
  /** Confirmed join → enter the workspace as the invited role. */
  onJoined: (scenario: DemoScenario) => void;
  /** Declined / ignored → invite stays pending. */
  onDeclined: () => void;
}

const STEP_ORDER: Step[] = ['landing', 'auth', 'confirm', 'joined'];
const STEP_LABEL_KEYS: Record<Step, keyof Dict> = {
  landing: 'demo.InviteAcceptanceFlow.tsx.step.landing',
  auth: 'demo.InviteAcceptanceFlow.tsx.step.auth',
  confirm: 'demo.InviteAcceptanceFlow.tsx.step.confirm',
  joined: 'demo.InviteAcceptanceFlow.tsx.step.joined',
  declined: 'demo.InviteAcceptanceFlow.tsx.step.declined',
};

export function InviteAcceptanceFlow({ open, role, onClose, onJoined, onDeclined }: Props) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement | null>(null);
  if (!containerRef.current && typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.className = 'invite-accept-portal';
    containerRef.current = div;
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    document.body.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  const [step, setStep] = useState<Step>('landing');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Reset to the landing page each time the flow is (re)opened.
  useEffect(() => {
    if (open) {
      setStep('landing');
      setAuthTab('login');
    }
  }, [open, role]);

  if (!open || !containerRef.current) return null;

  const meta = ROLE_META[role];
  const activeIndex = STEP_ORDER.indexOf(step);

  function renderStepper() {
    if (step === 'declined') return null;
    return (
      <ol className="invite-accept__steps" aria-label={t('demo.InviteAcceptanceFlow.tsx.stepper.ariaLabel')}>
        {STEP_ORDER.map((s, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'todo';
          return (
            <li key={s} className={`invite-accept__step is-${state}`}>
              <span className="invite-accept__step-dot">
                {state === 'done' ? <Icon name="check" size={12} /> : i + 1}
              </span>
              <span className="invite-accept__step-label">{t(STEP_LABEL_KEYS[s])}</span>
            </li>
          );
        })}
      </ol>
    );
  }

  return createPortal(
    <div className="invite-accept" role="dialog" aria-modal="true" aria-label={t('demo.InviteAcceptanceFlow.tsx.dialog.ariaLabel')}>
      <div className="invite-accept__bg" aria-hidden />
      <button type="button" className="invite-accept__dismiss" onClick={onClose} aria-label={t('demo.InviteAcceptanceFlow.tsx.dismiss.ariaLabel')}>
        <Icon name="close" size={18} />
      </button>

      <div className="invite-accept__stage">
        {renderStepper()}

        {/* ── 1. 邮件落地页 ── */}
        {step === 'landing' ? (
          <div className="invite-accept__card invite-accept__card--landing">
            <p className="invite-accept__from-mail">
              <Icon name="info" size={13} /> {t('demo.InviteAcceptanceFlow.tsx.landing.fromMail')}
            </p>
            <div className="invite-accept__hero">
              <span className="invite-accept__ws-logo">{WORKSPACE.logo}</span>
              <div className="invite-accept__inviter">
                <span className="invite-accept__inviter-avatar">{t(WORKSPACE.inviterInitialKey)}</span>
                <span>
                  <strong>{t(WORKSPACE.inviterKey)}</strong> {t('demo.InviteAcceptanceFlow.tsx.landing.invitesYou')}
                </span>
              </div>
              <h1 className="invite-accept__ws-name">{t(WORKSPACE.nameKey)}</h1>
              <div className="invite-accept__role-badge">
                {t('demo.InviteAcceptanceFlow.tsx.landing.joinAsPrefix')} <strong>{t(meta.labelKey)}</strong>（{t(meta.enKey)}）{t('demo.InviteAcceptanceFlow.tsx.landing.joinAsSuffix')}
              </div>
              <p className="invite-accept__role-perm">{t(meta.permKey)}</p>
            </div>
            <div className="invite-accept__ws-meta">
              <span>{WORKSPACE.members} {t('demo.InviteAcceptanceFlow.tsx.landing.membersUnit')}</span>
              <span className="invite-accept__meta-sep" aria-hidden>·</span>
              <span><Icon name="folder" size={13} /> {WORKSPACE.projects} {t('demo.InviteAcceptanceFlow.tsx.landing.projectsUnit')}</span>
            </div>
            <div className="invite-accept__actions">
              <button type="button" className="invite-accept__btn is-primary" onClick={() => setStep('auth')}>
                {t('demo.InviteAcceptanceFlow.tsx.landing.accept')}
              </button>
              <button type="button" className="invite-accept__btn is-ghost" onClick={() => setStep('declined')}>
                {t('demo.InviteAcceptanceFlow.tsx.landing.decline')}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── 2. 账号校验：登录 / 注册 ── */}
        {step === 'auth' ? (
          <div className="invite-accept__card">
            <h2 className="invite-accept__title">{t('demo.InviteAcceptanceFlow.tsx.auth.title')}</h2>
            <p className="invite-accept__subtitle">
              {t('demo.InviteAcceptanceFlow.tsx.auth.subtitlePrefix')} <strong>{WORKSPACE.invitedEmail}</strong>{t('demo.InviteAcceptanceFlow.tsx.auth.subtitleSuffix')}
            </p>
            <div className="invite-accept__tabs" role="tablist" aria-label={t('demo.InviteAcceptanceFlow.tsx.auth.tabsAriaLabel')}>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                className={`invite-accept__tab${authTab === 'login' ? ' is-active' : ''}`}
                onClick={() => setAuthTab('login')}
              >
                {t('demo.InviteAcceptanceFlow.tsx.auth.tabLogin')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                className={`invite-accept__tab${authTab === 'register' ? ' is-active' : ''}`}
                onClick={() => setAuthTab('register')}
              >
                {t('demo.InviteAcceptanceFlow.tsx.auth.tabRegister')}
              </button>
            </div>
            <div className="invite-accept__form">
              {authTab === 'register' ? (
                <label className="invite-accept__field">
                  <span>{t('demo.InviteAcceptanceFlow.tsx.auth.nicknameLabel')}</span>
                  <input type="text" placeholder={t('demo.InviteAcceptanceFlow.tsx.auth.nicknamePlaceholder')} defaultValue="" />
                </label>
              ) : null}
              <label className="invite-accept__field">
                <span>{t('demo.InviteAcceptanceFlow.tsx.auth.emailLabel')}</span>
                <input type="email" value={WORKSPACE.invitedEmail} readOnly />
              </label>
              <label className="invite-accept__field">
                <span>{t('demo.InviteAcceptanceFlow.tsx.auth.passwordLabel')}</span>
                <input type="password" placeholder={authTab === 'register' ? t('demo.InviteAcceptanceFlow.tsx.auth.passwordPlaceholderRegister') : t('demo.InviteAcceptanceFlow.tsx.auth.passwordPlaceholderLogin')} defaultValue="" />
              </label>
            </div>
            <div className="invite-accept__actions">
              <button type="button" className="invite-accept__btn is-primary" onClick={() => setStep('confirm')}>
                {authTab === 'register' ? t('demo.InviteAcceptanceFlow.tsx.auth.submitRegister') : t('demo.InviteAcceptanceFlow.tsx.auth.submitLogin')}
              </button>
              <button type="button" className="invite-accept__btn is-text" onClick={() => setStep('landing')}>
                {t('demo.InviteAcceptanceFlow.tsx.auth.back')}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── 3. 确认是否加入该 Workspace ── */}
        {step === 'confirm' ? (
          <div className="invite-accept__card">
            <h2 className="invite-accept__title">{t('demo.InviteAcceptanceFlow.tsx.confirm.title')}</h2>
            <div className="invite-accept__confirm-row">
              <span className="invite-accept__ws-logo invite-accept__ws-logo--sm">{WORKSPACE.logo}</span>
              <div>
                <div className="invite-accept__confirm-ws">{t(WORKSPACE.nameKey)}</div>
                <div className="invite-accept__confirm-role">
                  {t('demo.InviteAcceptanceFlow.tsx.confirm.rolePrefix')}<strong>{t(meta.labelKey)}</strong>{t('demo.InviteAcceptanceFlow.tsx.confirm.roleSuffix')}
                </div>
              </div>
            </div>
            <p className="invite-accept__confirm-perm">{t(meta.permKey)}</p>
            <p className="invite-accept__seat-note">
              <Icon name="info" size={13} /> {t('demo.InviteAcceptanceFlow.tsx.confirm.seatNote')}
            </p>
            <div className="invite-accept__actions">
              <button type="button" className="invite-accept__btn is-primary" onClick={() => setStep('joined')}>
                {t('demo.InviteAcceptanceFlow.tsx.confirm.join')}
              </button>
              <button type="button" className="invite-accept__btn is-ghost" onClick={() => setStep('declined')}>
                {t('demo.InviteAcceptanceFlow.tsx.confirm.decline')}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── 4. 加入成功 → 开始协作 ── */}
        {step === 'joined' ? (
          <div className="invite-accept__card invite-accept__card--success">
            <div className="invite-accept__success-badge" aria-hidden>
              <Icon name="check" size={26} />
            </div>
            <h2 className="invite-accept__title">{t('demo.InviteAcceptanceFlow.tsx.joined.titlePrefix')}{t(WORKSPACE.nameKey)}{t('demo.InviteAcceptanceFlow.tsx.joined.titleSuffix')}</h2>
            <p className="invite-accept__subtitle">
              {t('demo.InviteAcceptanceFlow.tsx.joined.subtitlePrefix')}<strong>{t(meta.labelKey)}</strong>（{t(meta.enKey)}）
            </p>
            <div className="invite-accept__actions">
              <button
                type="button"
                className="invite-accept__btn is-primary"
                onClick={() => onJoined(meta.scenario)}
              >
                {t('demo.InviteAcceptanceFlow.tsx.joined.start')}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── 拒绝 / 忽略 → 待定 pending ── */}
        {step === 'declined' ? (
          <div className="invite-accept__card invite-accept__card--declined">
            <div className="invite-accept__declined-badge" aria-hidden>
              <Icon name="info" size={24} />
            </div>
            <h2 className="invite-accept__title">{t('demo.InviteAcceptanceFlow.tsx.declined.title')}</h2>
            <p className="invite-accept__subtitle">
              {t('demo.InviteAcceptanceFlow.tsx.declined.subtitlePrefix')}<strong>{t('demo.InviteAcceptanceFlow.tsx.declined.pending')}</strong>{t('demo.InviteAcceptanceFlow.tsx.declined.subtitleSuffix')}
            </p>
            <div className="invite-accept__actions">
              <button type="button" className="invite-accept__btn is-ghost" onClick={() => setStep('landing')}>
                {t('demo.InviteAcceptanceFlow.tsx.declined.reconsider')}
              </button>
              <button
                type="button"
                className="invite-accept__btn is-text"
                onClick={() => {
                  onDeclined();
                  onClose();
                }}
              >
                {t('demo.InviteAcceptanceFlow.tsx.declined.close')}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {step === 'joined' ? <Confetti /> : null}
    </div>,
    containerRef.current,
  );
}
