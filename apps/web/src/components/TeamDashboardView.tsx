// Team analytics dashboard (demo).
//
// UC-10: owner/admin-visible workspace data overview. Demo-only data for
// product review; no backend calls yet.

import type { CSSProperties } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

const DASHBOARD_STATS = [
  { labelKey: 'demo.TeamDashboardView.tsx.stat-designs', value: '128', deltaEnKey: 'demo.TeamDashboardView.tsx.stat-designs-delta', deltaKind: 'change', icon: 'grid' },
  { labelKey: 'demo.TeamDashboardView.tsx.stat-design-systems', value: '12', deltaEnKey: 'demo.TeamDashboardView.tsx.stat-design-systems-delta', deltaKind: 'change', icon: 'palette' },
  { labelKey: 'demo.TeamDashboardView.tsx.stat-active-members', value: '5', deltaEnKey: 'demo.TeamDashboardView.tsx.stat-active-members-delta', deltaKind: 'period', icon: 'users' },
] as const;

const TOKEN_RANKING = [
  { nameKey: 'demo.TeamDashboardView.tsx.member-qiongyu', role: 'Owner', tokens: '1.42M', share: 100, color: '#c65b3a' },
  { nameKey: 'demo.TeamDashboardView.tsx.member-zhangwei', role: 'Admin', tokens: '980K', share: 69, color: '#f97316' },
  { nameKey: 'demo.TeamDashboardView.tsx.member-lina', role: 'Member', tokens: '640K', share: 45, color: '#6366f1' },
  { nameKey: 'demo.TeamDashboardView.tsx.member-wangfang', role: 'Member', tokens: '420K', share: 30, color: '#10b981' },
] as const;

type CreditStatus = 'ample' | 'normal' | 'low' | 'needs-recharge';

const MEMBER_CREDITS = [
  { nameKey: 'demo.TeamDashboardView.tsx.member-qiongyu', role: 'Owner', remaining: '18,400', used: '41,600', status: 'ample' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.member-zhangwei', role: 'Admin', remaining: '9,800', used: '24,200', status: 'normal' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.member-lina', role: 'Member', remaining: '1,200', used: '18,900', status: 'low' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.member-wangfang', role: 'Member', remaining: '320', used: '6,700', status: 'needs-recharge' as CreditStatus },
] as const;

const CREDIT_STATUS_KEY: Record<CreditStatus, keyof Dict> = {
  ample: 'demo.TeamDashboardView.tsx.credit-status-ample',
  normal: 'demo.TeamDashboardView.tsx.credit-status-normal',
  low: 'demo.TeamDashboardView.tsx.credit-status-low',
  'needs-recharge': 'demo.TeamDashboardView.tsx.credit-status-needs-recharge',
};

export type TeamDashboardAutoRechargeTarget =
  | { kind: 'team' }
  | { kind: 'member'; name: string; role: string };

type TeamDashboardViewProps = {
  isAdmin?: boolean;
  isTeamPlan?: boolean;
  onAutoRecharge?: (target: TeamDashboardAutoRechargeTarget) => void;
};

export function TeamDashboardView({ isAdmin = true, isTeamPlan = false, onAutoRecharge }: TeamDashboardViewProps) {
  const t = useT();
  return (
    <div className="entry-section team-dashboard">
      <header className="entry-section__head team-dashboard__head">
        <div>
          <h1 className="entry-section__title">{t('demo.TeamDashboardView.tsx.title')}</h1>
          <p className="team-dashboard__subtitle">
            {isAdmin ? t('demo.TeamDashboardView.tsx.subtitle-admin') : t('demo.TeamDashboardView.tsx.subtitle-member')}
          </p>
        </div>
      </header>

      {isTeamPlan && isAdmin ? (
        <section className="team-dashboard__recharge-callout" aria-label={t('demo.TeamDashboardView.tsx.recharge-callout-aria')}>
          <span className="team-dashboard__recharge-icon" aria-hidden>
            <Icon name="refresh" size={17} />
          </span>
          <div>
            <h2>{t('demo.TeamDashboardView.tsx.recharge-callout-title')}</h2>
            <p>{t('demo.TeamDashboardView.tsx.recharge-callout-desc')}</p>
          </div>
          <button type="button" onClick={() => onAutoRecharge?.({ kind: 'team' })}>{t('demo.TeamDashboardView.tsx.recharge-callout-button')}</button>
        </section>
      ) : null}

      <section className="team-dashboard__hero" aria-label={t('demo.TeamDashboardView.tsx.hero-aria')}>
        <div className="team-dashboard__hero-copy">
          <h2>{t('demo.TeamDashboardView.tsx.hero-team-name')}</h2>
          <p>{t('demo.TeamDashboardView.tsx.hero-desc')}</p>
        </div>
        <div className="team-dashboard__hero-meta" aria-label={t('demo.TeamDashboardView.tsx.hero-meta-aria')}>
          <span>Owner / Admin</span>
          <span>{t('demo.TeamDashboardView.tsx.hero-meta-range')}</span>
          <span>Demo data</span>
        </div>
      </section>

      <section className="team-dashboard__credit-card" aria-label={t('demo.TeamDashboardView.tsx.credit-card-aria')}>
        <div className="team-dashboard__token-head">
          <div>
            <h2>{isAdmin ? t('demo.TeamDashboardView.tsx.credit-title-admin') : t('demo.TeamDashboardView.tsx.credit-title-member')}</h2>
            <p>
              {isAdmin
                ? t('demo.TeamDashboardView.tsx.credit-desc-admin')
                : t('demo.TeamDashboardView.tsx.credit-desc-member')}
            </p>
          </div>
          <span>{isAdmin ? 'Admin' : 'Member'}</span>
        </div>
        {isAdmin ? (
          <div className="team-dashboard__credit-table">
            {MEMBER_CREDITS.map((member) => (
              <div className="team-dashboard__credit-row" key={member.nameKey}>
                <div>
                  <strong>{t(member.nameKey)}</strong>
                  <span>{member.role}</span>
                </div>
                <div>
                  <span>{t('demo.TeamDashboardView.tsx.credit-remaining')}</span>
                  <strong>{member.remaining}</strong>
                </div>
                <div>
                  <span>{t('demo.TeamDashboardView.tsx.credit-used-period')}</span>
                  <strong>{member.used}</strong>
                </div>
                <em className={member.status === 'needs-recharge' ? 'is-low' : undefined}>{t(CREDIT_STATUS_KEY[member.status])}</em>
                <button
                  type="button"
                  className={member.status === 'needs-recharge' ? 'is-urgent' : undefined}
                  onClick={() => onAutoRecharge?.({ kind: 'member', name: t(member.nameKey), role: member.role })}
                >
                  {t('demo.TeamDashboardView.tsx.credit-recharge-button')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="team-dashboard__member-credit">
            <strong>{t('demo.TeamDashboardView.tsx.member-credit-remaining')}</strong>
            <p>{t('demo.TeamDashboardView.tsx.member-credit-desc')}</p>
            <button type="button">{t('demo.TeamDashboardView.tsx.member-credit-remind-button')}</button>
          </div>
        )}
      </section>

      <div className="team-dashboard__metric-grid">
        {DASHBOARD_STATS.map((stat) => (
          <article className="team-dashboard__metric-card" key={stat.labelKey}>
            <span className="team-dashboard__metric-icon" aria-hidden>
              <Icon name={stat.icon} size={16} />
            </span>
            <span className="team-dashboard__metric-label">{t(stat.labelKey)}</span>
            <strong className="team-dashboard__metric-value">{stat.value}</strong>
            <span className={`team-dashboard__metric-delta${stat.deltaKind === 'period' ? ' is-period' : ''}`}>{t(stat.deltaEnKey)}</span>
          </article>
        ))}
      </div>

      <section className="team-dashboard__token-card" aria-label={t('demo.TeamDashboardView.tsx.token-card-aria')}>
        <div className="team-dashboard__token-head">
          <div>
            <h2>{t('demo.TeamDashboardView.tsx.token-title')}</h2>
            <p>{t('demo.TeamDashboardView.tsx.token-desc')}</p>
          </div>
          <span>Top 4</span>
        </div>

        <div className="team-dashboard__token-list">
          {TOKEN_RANKING.map((person, index) => (
            <div
              className="team-dashboard__token-row"
              key={person.nameKey}
              // Only #1 gets its member colour; the rest share one neutral so the
              // list doesn't read as a rainbow. Must be a token that exists in
              // tokens.css — an undefined var() kills the bar fill and rank tint.
              style={{ '--member-rank-color': index === 0 ? person.color : 'var(--text-soft)' } as CSSProperties}
            >
              <span className="team-dashboard__token-rank">{index + 1}</span>
              <div className="team-dashboard__token-person">
                <strong>{t(person.nameKey)}</strong>
                <span>{person.role}</span>
              </div>
              <span className="team-dashboard__token-value">{person.tokens}</span>
              <span className="team-dashboard__token-bar" aria-hidden>
                <span style={{ width: `${person.share}%` }} />
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
