// Team analytics dashboard (demo).
//
// UC-10: owner/admin-visible workspace data overview. Demo-only data for
// product review; no backend calls yet.

import { Icon } from './Icon';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

const DASHBOARD_STATS = [
  { labelKey: 'demo.TeamDashboardView.tsx.stat.designs', value: '128', deltaKey: 'demo.TeamDashboardView.tsx.stat.designs.delta', icon: 'grid' },
  { labelKey: 'demo.TeamDashboardView.tsx.stat.designSystems', value: '12', deltaKey: 'demo.TeamDashboardView.tsx.stat.designSystems.delta', icon: 'palette' },
  { labelKey: 'demo.TeamDashboardView.tsx.stat.activeMembers', value: '5', deltaKey: 'demo.TeamDashboardView.tsx.stat.activeMembers.delta', icon: 'share' },
] as const;

const TOKEN_RANKING = [
  { nameKey: 'demo.TeamDashboardView.tsx.person.qiongyu', role: 'Owner', tokens: '1.42M' },
  { nameKey: 'demo.TeamDashboardView.tsx.person.zhangwei', role: 'Manager', tokens: '980K' },
  { nameKey: 'demo.TeamDashboardView.tsx.person.lina', role: 'Editor', tokens: '640K' },
  { nameKey: 'demo.TeamDashboardView.tsx.person.wangfang', role: 'Reviewer', tokens: '420K' },
] as const;

type CreditStatus = 'sufficient' | 'normal' | 'low' | 'needRecharge';

const MEMBER_CREDITS = [
  { nameKey: 'demo.TeamDashboardView.tsx.person.qiongyu', role: 'Owner', remaining: '18,400', used: '41,600', status: 'sufficient' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.person.zhangwei', role: 'Manager', remaining: '9,800', used: '24,200', status: 'normal' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.person.lina', role: 'Editor', remaining: '1,200', used: '18,900', status: 'low' as CreditStatus },
  { nameKey: 'demo.TeamDashboardView.tsx.person.wangfang', role: 'Viewer', remaining: '320', used: '6,700', status: 'needRecharge' as CreditStatus },
] as const;

export type TeamDashboardAutoRechargeTarget =
  | { kind: 'team' }
  | { kind: 'member'; name: string; role: string };

type TeamDashboardViewProps = {
  isAdmin?: boolean;
  isTeamPlan?: boolean;
  onAutoRecharge?: (target: TeamDashboardAutoRechargeTarget) => void;
};

const CREDIT_STATUS_LABEL_KEY: Record<CreditStatus, keyof Dict> = {
  sufficient: 'demo.TeamDashboardView.tsx.creditStatus.sufficient',
  normal: 'demo.TeamDashboardView.tsx.creditStatus.normal',
  low: 'demo.TeamDashboardView.tsx.creditStatus.low',
  needRecharge: 'demo.TeamDashboardView.tsx.creditStatus.needRecharge',
};

export function TeamDashboardView({ isAdmin = true, isTeamPlan = false, onAutoRecharge }: TeamDashboardViewProps) {
  const t = useT();

  function creditStatusClass(status: CreditStatus) {
    if (status === 'needRecharge') return 'is-critical';
    if (status === 'low') return 'is-muted';
    return 'is-brand';
  }

  return (
    <div className="entry-section team-dashboard">
      <header className="entry-section__head team-dashboard__head">
        <div>
          <h1 className="entry-section__title">{t('demo.TeamDashboardView.tsx.title')}</h1>
        </div>
      </header>

      {isTeamPlan && isAdmin ? (
        <section className="team-dashboard__recharge-callout" aria-label={t('demo.TeamDashboardView.tsx.autoRecharge.ariaLabel')}>
          <span className="team-dashboard__recharge-icon" aria-hidden>
            <Icon name="refresh" size={17} />
          </span>
          <div>
            <h2>{t('demo.TeamDashboardView.tsx.autoRecharge.heading')}</h2>
            <p>{t('demo.TeamDashboardView.tsx.autoRecharge.body')}</p>
          </div>
          <button type="button" onClick={() => onAutoRecharge?.({ kind: 'team' })}>{t('demo.TeamDashboardView.tsx.autoRecharge.cta')}</button>
        </section>
      ) : null}

      <section className="team-dashboard__hero" aria-label={t('demo.TeamDashboardView.tsx.hero.ariaLabel')}>
        <div className="team-dashboard__hero-copy">
          <h2>{t('demo.TeamDashboardView.tsx.hero.team')}</h2>
          <p>{t('demo.TeamDashboardView.tsx.hero.subtitle')}</p>
        </div>
        <div className="team-dashboard__hero-meta" aria-label={t('demo.TeamDashboardView.tsx.hero.rangeAriaLabel')}>
          <span>Owner / Manager</span>
          <span>{t('demo.TeamDashboardView.tsx.hero.range')}</span>
          <span>Demo data</span>
        </div>
      </section>

      <section className="team-dashboard__credit-card" aria-label={t('demo.TeamDashboardView.tsx.credit.ariaLabel')}>
        <div className="team-dashboard__token-head">
          <div>
            <h2>{isAdmin ? t('demo.TeamDashboardView.tsx.credit.headingAdmin') : t('demo.TeamDashboardView.tsx.credit.headingMember')}</h2>
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
                  <span>{t('demo.TeamDashboardView.tsx.credit.remaining')}</span>
                  <strong>{member.remaining}</strong>
                </div>
                <div>
                  <span>{t('demo.TeamDashboardView.tsx.credit.usedThisCycle')}</span>
                  <strong>{member.used}</strong>
                </div>
                <em className={creditStatusClass(member.status)}>{t(CREDIT_STATUS_LABEL_KEY[member.status])}</em>
                <button
                  type="button"
                  onClick={() => onAutoRecharge?.({ kind: 'member', name: t(member.nameKey), role: member.role })}
                >
                  {t('demo.TeamDashboardView.tsx.credit.recharge')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="team-dashboard__member-credit">
            <strong>{t('demo.TeamDashboardView.tsx.credit.remainingBalance')}</strong>
            <p>{t('demo.TeamDashboardView.tsx.credit.memberNote')}</p>
            <button type="button">{t('demo.TeamDashboardView.tsx.credit.remindAdmin')}</button>
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
            <span className="team-dashboard__metric-delta">{t(stat.deltaKey)}</span>
          </article>
        ))}
      </div>

      <section className="team-dashboard__token-card" aria-label={t('demo.TeamDashboardView.tsx.token.ariaLabel')}>
        <div className="team-dashboard__token-head">
          <div>
            <h2>{t('demo.TeamDashboardView.tsx.token.heading')}</h2>
          </div>
          <span>Top 4</span>
        </div>

        <div className="team-dashboard__token-list">
          {TOKEN_RANKING.map((person, index) => (
            <div className="team-dashboard__token-row" key={person.nameKey}>
              <span className="team-dashboard__token-rank">{index + 1}</span>
              <div className="team-dashboard__token-person">
                <strong>{t(person.nameKey)}</strong>
                <span>{person.role}</span>
              </div>
              <span className="team-dashboard__token-value">{person.tokens}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
