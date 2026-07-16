// Insufficient-credits upgrade flow.
//
// Triggered when credits run out mid-use. Branches on the current plan:
//  - below 团队版: offer the upgrade tiers reachable from here, priced as a
//    pro-rated top-up ("按当前已使用天数补差价"); 确认支付 → upgrade takes effect.
//  - Max / 团队版: no credit packs — configure auto recharge instead.
// Demo-only: no real billing.

import { useState } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';
import type { DemoPlan } from './DemoControlBar';

type BillingCycle = 'annual' | 'monthly';
type AutoRechargeLimit = '30' | '50' | '100' | '200' | 'custom' | 'unlimited';

interface TierOption {
  plan: DemoPlan;
  labelKey: keyof Dict;
  descKey: keyof Dict;
  /** Per-month price (¥), billed monthly. */
  monthly: number;
  /** Per-month price (¥) when billed annually. */
  annual: number;
}

const PLUS: TierOption = { plan: 'plus', labelKey: 'demo.InsufficientCreditsDialog.tsx.tier.plus.label', descKey: 'demo.InsufficientCreditsDialog.tsx.tier.plus.desc', monthly: 39, annual: 29 };
const PRO: TierOption = { plan: 'pro', labelKey: 'demo.InsufficientCreditsDialog.tsx.tier.pro.label', descKey: 'demo.InsufficientCreditsDialog.tsx.tier.pro.desc', monthly: 99, annual: 79 };
const MAX: TierOption = { plan: 'max', labelKey: 'demo.InsufficientCreditsDialog.tsx.tier.max.label', descKey: 'demo.InsufficientCreditsDialog.tsx.tier.max.desc', monthly: 199, annual: 159 };
const TEAM: TierOption = { plan: 'team', labelKey: 'demo.InsufficientCreditsDialog.tsx.tier.team.label', descKey: 'demo.InsufficientCreditsDialog.tsx.tier.team.desc', monthly: 119, annual: 99 };

// Tiers reachable from each plan, in order. Max / 团队版 use auto recharge.
const UPGRADE_TARGETS: Record<DemoPlan, TierOption[]> = {
  free: [PLUS, PRO, MAX, TEAM],
  plus: [PRO, MAX, TEAM],
  pro: [MAX, TEAM],
  max: [],
  team: [],
};

const AUTO_RECHARGE_LIMITS: Array<{ id: AutoRechargeLimit; labelKey: keyof Dict }> = [
  { id: '30', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.30' },
  { id: '50', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.50' },
  { id: '100', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.100' },
  { id: '200', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.200' },
  { id: 'custom', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.custom' },
  { id: 'unlimited', labelKey: 'demo.InsufficientCreditsDialog.tsx.limit.unlimited' },
];

interface Props {
  open: boolean;
  plan: DemoPlan;
  onClose: () => void;
  /** Confirmed an upgrade to a higher tier. */
  onUpgrade: (target: DemoPlan) => void;
  /** Saved an auto-recharge setting for top tiers. */
  onBuyPack: (packLabel: string) => void;
  autoRechargeScope?: 'team' | 'member';
  autoRechargeMemberName?: string;
}

export function InsufficientCreditsDialog({
  open,
  plan,
  onClose,
  onUpgrade,
  onBuyPack,
  autoRechargeScope = 'team',
  autoRechargeMemberName,
}: Props) {
  const t = useT();
  const memberName = autoRechargeMemberName ?? t('demo.InsufficientCreditsDialog.tsx.defaultMemberName');
  const targets = UPGRADE_TARGETS[plan];
  const isTopTier = targets.length === 0;
  const isMemberRecharge = autoRechargeScope === 'member';

  const [selectedTier, setSelectedTier] = useState<DemoPlan>(targets[0]?.plan ?? 'team');
  const [selectedLimit, setSelectedLimit] = useState<AutoRechargeLimit>('50');
  // Billing cycle for tier upgrades — defaults to annual (年付).
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  if (!open) return null;

  return (
    <div className="entry-invite" role="dialog" aria-modal="true" aria-label={t('demo.InsufficientCreditsDialog.tsx.dialogLabel')}>
      <div className="entry-invite__backdrop" onClick={onClose} />
      <div className="credit-upgrade">
        <button type="button" className="entry-invite__close" onClick={onClose} aria-label={t('demo.InsufficientCreditsDialog.tsx.close')}>
          <Icon name="close" size={16} />
        </button>

        <div className="credit-upgrade__badge" aria-hidden>
          <Icon name="sparkles" size={20} />
        </div>
        <h2 className="credit-upgrade__title">{isTopTier ? t('demo.InsufficientCreditsDialog.tsx.autoRechargeTitle') : t('demo.InsufficientCreditsDialog.tsx.creditsExhaustedTitle')}</h2>
        <p className="credit-upgrade__subtitle">
          {isTopTier
            ? isMemberRecharge
              ? t('demo.InsufficientCreditsDialog.tsx.subtitleMember').replace('{name}', memberName)
              : t('demo.InsufficientCreditsDialog.tsx.subtitleTeam')
            : t('demo.InsufficientCreditsDialog.tsx.subtitleUpgrade')}
        </p>

        {isTopTier ? (
          <div className="credit-upgrade__auto">
            <div className="credit-upgrade__payment">
              <span>{t('demo.InsufficientCreditsDialog.tsx.scopeLabel')}</span>
              <strong>{isMemberRecharge ? t('demo.InsufficientCreditsDialog.tsx.scopeMember').replace('{name}', memberName) : t('demo.InsufficientCreditsDialog.tsx.scopeTeam')}</strong>
            </div>
            <div className="credit-upgrade__payment">
              <span>{t('demo.InsufficientCreditsDialog.tsx.paymentHint')}</span>
              <button
                type="button"
                className="credit-upgrade__payment-button"
              >
                <Icon name="external-link" size={14} /> {t('demo.InsufficientCreditsDialog.tsx.managePayment')}
              </button>
            </div>
            <div className="credit-upgrade__auto-card">
              <h3 className="credit-upgrade__section-title">{t('demo.InsufficientCreditsDialog.tsx.monthlyLimit')}</h3>
              <div className="credit-upgrade__limit-grid">
                {AUTO_RECHARGE_LIMITS.map((limit) => (
                  <button
                    key={limit.id}
                    type="button"
                    className={`credit-upgrade__limit${selectedLimit === limit.id ? ' is-active' : ''}${limit.id === 'unlimited' ? ' credit-upgrade__limit--wide' : ''}`}
                    onClick={() => setSelectedLimit(limit.id)}
                  >
                    {t(limit.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="credit-upgrade__options">
            <div className="credit-upgrade__cycle" role="tablist" aria-label={t('demo.InsufficientCreditsDialog.tsx.billingCycle')}>
              <button
                type="button"
                role="tab"
                aria-selected={cycle === 'annual'}
                className={`credit-upgrade__cycle-tab${cycle === 'annual' ? ' is-active' : ''}`}
                onClick={() => setCycle('annual')}
              >
                {t('demo.InsufficientCreditsDialog.tsx.annual')} <span className="credit-upgrade__cycle-save">{t('demo.InsufficientCreditsDialog.tsx.save20')}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cycle === 'monthly'}
                className={`credit-upgrade__cycle-tab${cycle === 'monthly' ? ' is-active' : ''}`}
                onClick={() => setCycle('monthly')}
              >
                {t('demo.InsufficientCreditsDialog.tsx.monthly')}
              </button>
            </div>
            {targets.map((tier) => {
              const price = cycle === 'annual' ? tier.annual : tier.monthly;
              const perSeat = tier.plan === 'team' ? t('demo.InsufficientCreditsDialog.tsx.perSeat') : '';
              return (
                <button
                  key={tier.plan}
                  type="button"
                  className={`credit-upgrade__option${selectedTier === tier.plan ? ' is-active' : ''}`}
                  onClick={() => setSelectedTier(tier.plan)}
                >
                  <span className="credit-upgrade__option-radio" aria-hidden />
                  <span className="credit-upgrade__option-text">
                    <span className="credit-upgrade__option-label">{t(tier.labelKey)}</span>
                    <span className="credit-upgrade__option-desc">{t(tier.descKey)}</span>
                  </span>
                  <span className="credit-upgrade__option-price">
                    ¥{price}
                    <span className="credit-upgrade__option-unit">{t('demo.InsufficientCreditsDialog.tsx.perMonth')}{perSeat}</span>
                  </span>
                </button>
              );
            })}
            <p className="credit-upgrade__prorate">
              <Icon name="info" size={14} />
              {cycle === 'annual' ? t('demo.InsufficientCreditsDialog.tsx.prorateAnnual') : t('demo.InsufficientCreditsDialog.tsx.prorateMonthly')}
              {t('demo.InsufficientCreditsDialog.tsx.prorateSuffix')}
            </p>
          </div>
        )}

        <div className="credit-upgrade__foot">
          <button type="button" className="entry-invite__btn" onClick={onClose}>
            {isTopTier ? t('demo.InsufficientCreditsDialog.tsx.back') : t('demo.InsufficientCreditsDialog.tsx.cancel')}
          </button>
          {isTopTier ? (
            <button
              type="button"
              className="entry-invite__btn is-primary"
              onClick={() => onBuyPack(t('demo.InsufficientCreditsDialog.tsx.autoRechargeSaved'))}
            >
              {t('demo.InsufficientCreditsDialog.tsx.save')}
            </button>
          ) : (
            <button
              type="button"
              className="entry-invite__btn is-primary"
              onClick={() => onUpgrade(selectedTier)}
            >
              <Icon name="sparkles" size={14} /> {t('demo.InsufficientCreditsDialog.tsx.confirmUpgrade')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
