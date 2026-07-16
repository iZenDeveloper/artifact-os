// Upgrade-to-team guidance dialog.
//
// Demo-only billing picker shown when a free-plan user tries to invite
// collaborators. Team prices are monthly seat fees: workspace base fee +
// the per-seat token allowance package.

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

interface Props {
  open: boolean;
  onClose: () => void;
  initialSeatCount?: number;
  minSeatCount?: number;
  mode?: 'upgrade' | 'seats';
  /** "升级到团队版" — defaults to onClose when omitted. */
  onConfirm?: (config: {
    seatCount: number;
    tierId: string;
    tierName: string;
    pricePerSeat: number;
    creditPack: string;
  }) => void;
}

const DEFAULT_SEAT_COUNT = 3;
const WORKSPACE_BASE_FEE = 20;
const TEAM_TIERS: Array<{
  id: string;
  name: string;
  pricePerSeat: number;
  creditPackKey: keyof Dict;
  hintKey: keyof Dict;
  recommended?: boolean;
}> = [
  { id: 'plus', name: 'Team Plus', pricePerSeat: 40, creditPackKey: 'demo.UpgradeTeamDialog.tsx.creditPackPlus', hintKey: 'demo.UpgradeTeamDialog.tsx.hintPlus' },
  { id: 'pro', name: 'Team Pro', pricePerSeat: 80, creditPackKey: 'demo.UpgradeTeamDialog.tsx.creditPackPro', hintKey: 'demo.UpgradeTeamDialog.tsx.hintPro', recommended: true },
  { id: 'max', name: 'Team Max', pricePerSeat: 220, creditPackKey: 'demo.UpgradeTeamDialog.tsx.creditPackMax', hintKey: 'demo.UpgradeTeamDialog.tsx.hintMax' },
];
const TEAM_BENEFIT_KEYS: (keyof Dict)[] = [
  'demo.UpgradeTeamDialog.tsx.benefit1',
  'demo.UpgradeTeamDialog.tsx.benefit2',
  'demo.UpgradeTeamDialog.tsx.benefit3',
  'demo.UpgradeTeamDialog.tsx.benefit4',
];

export function UpgradeTeamDialog({
  open,
  onClose,
  onConfirm,
  initialSeatCount = DEFAULT_SEAT_COUNT,
  minSeatCount = DEFAULT_SEAT_COUNT,
  mode = 'upgrade',
}: Props) {
  const t = useT();
  const [selectedTierId, setSelectedTierId] = useState('pro');
  const [seatCount, setSeatCount] = useState(Math.max(initialSeatCount, minSeatCount));

  useEffect(() => {
    if (!open) return;
    setSeatCount(Math.max(initialSeatCount, minSeatCount));
  }, [initialSeatCount, minSeatCount, open]);

  if (!open) return null;

  const selectedTier = TEAM_TIERS.find((tier) => tier.id === selectedTierId) ?? TEAM_TIERS[1];
  const selectedTierName = selectedTier?.name ?? 'Team Pro';
  const selectedPrice = selectedTier?.pricePerSeat ?? 80;
  const selectedCreditPack = t(selectedTier?.creditPackKey ?? 'demo.UpgradeTeamDialog.tsx.creditPackPro');
  const purchaseSeatsMode = mode === 'seats';
  // Total the user will actually be charged — shown on the CTA so a payment
  // action never hides its amount.
  const monthlyTotal = selectedPrice * seatCount;

  function adjustSeatCount(delta: number) {
    setSeatCount((current) => Math.max(minSeatCount, current + delta));
  }

  function handleConfirm() {
    onConfirm?.({
      seatCount,
      tierId: selectedTier?.id ?? 'pro',
      tierName: selectedTierName,
      pricePerSeat: selectedPrice,
      creditPack: selectedCreditPack,
    });
    if (!onConfirm) onClose();
  }

  return (
    <div className="entry-invite" role="dialog" aria-modal="true" aria-label={purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.ariaPurchaseSeats') : t('demo.UpgradeTeamDialog.tsx.ariaUpgradeTeam')}>
      <div className="entry-invite__backdrop" onClick={onClose} />
      <div className="upgrade-team">
        <button
          type="button"
          className="entry-invite__close"
          onClick={onClose}
          aria-label={t('demo.UpgradeTeamDialog.tsx.close')}
        >
          <Icon name="close" size={16} />
        </button>

        <div className="upgrade-team__head">
          <h2 className="upgrade-team__title">{purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.titlePurchaseSeats') : t('demo.UpgradeTeamDialog.tsx.titleUpgrade')}</h2>
          <p className="upgrade-team__subtitle">
            {purchaseSeatsMode
              ? t('demo.UpgradeTeamDialog.tsx.subtitlePurchaseSeats', { count: minSeatCount })
              : t('demo.UpgradeTeamDialog.tsx.subtitleUpgrade', { count: minSeatCount })}
          </p>
        </div>

        <div className="upgrade-team__pricing-rule" aria-label={t('demo.UpgradeTeamDialog.tsx.ariaPricingRule')}>
          <strong>{t('demo.UpgradeTeamDialog.tsx.pricingRuleTitle')}</strong>
          <span>{t('demo.UpgradeTeamDialog.tsx.pricingRuleBase', { fee: WORKSPACE_BASE_FEE })}</span>
          <span>{t('demo.UpgradeTeamDialog.tsx.pricingRuleToken')}</span>
        </div>

        <div className="upgrade-team__seat-summary">
          <span>{t('demo.UpgradeTeamDialog.tsx.seatCount')}</span>
          <span className="upgrade-team__seat-stepper" aria-label={t('demo.UpgradeTeamDialog.tsx.ariaSeatStepper')}>
            <button
              type="button"
              onClick={() => adjustSeatCount(-1)}
              disabled={seatCount <= minSeatCount}
              aria-label={t('demo.UpgradeTeamDialog.tsx.decreaseSeats')}
            >
              -
            </button>
            <strong>{seatCount}</strong>
            <button type="button" onClick={() => adjustSeatCount(1)} aria-label={t('demo.UpgradeTeamDialog.tsx.increaseSeats')}>
              +
            </button>
          </span>
        </div>

        <div className="upgrade-team__plans" role="radiogroup" aria-label={t('demo.UpgradeTeamDialog.tsx.ariaPlans')}>
          {TEAM_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTierId;

            return (
              <button
                key={tier.id}
                type="button"
                className={`upgrade-team__plan${tier.recommended ? ' is-recommended' : ''}${isSelected ? ' is-selected' : ''}`}
                role="radio"
                aria-checked={isSelected ? 'true' : 'false'}
                onClick={() => setSelectedTierId(tier.id)}
              >
                <span className="upgrade-team__plan-top">
                  <strong>{tier.name}</strong>
                  {tier.recommended ? <small>{t('demo.UpgradeTeamDialog.tsx.recommended')}</small> : null}
                </span>
                <span className="upgrade-team__plan-token">
                  ${tier.pricePerSeat}
                  <small> {t('demo.UpgradeTeamDialog.tsx.perSeatPerMonth')}</small>
                </span>
                <span className="upgrade-team__plan-total">
                  ${tier.pricePerSeat * seatCount} {t('demo.UpgradeTeamDialog.tsx.planTotalSuffix', { count: seatCount })}
                </span>
                <span className="upgrade-team__plan-composition">
                  ${WORKSPACE_BASE_FEE} {t('demo.UpgradeTeamDialog.tsx.baseFeePlus')} {t(tier.creditPackKey)}
                </span>
                <span className="upgrade-team__plan-hint">{t(tier.hintKey)}</span>
              </button>
            );
          })}
        </div>

        {/* The benefits are a first-time value-prop; skip them when an
            existing team is just buying more seats — they already know. */}
        {purchaseSeatsMode ? null : (
          <ul className="upgrade-team__benefits" aria-label={t('demo.UpgradeTeamDialog.tsx.ariaBenefits')}>
            {TEAM_BENEFIT_KEYS.map((benefitKey) => (
              <li key={benefitKey}>
                <Icon name="check" size={14} />
                <span>{t(benefitKey)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="upgrade-team__foot">
          <button type="button" className="entry-invite__btn" onClick={onClose}>
            {purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.dismissPurchase') : t('demo.UpgradeTeamDialog.tsx.dismissUpgrade')}
          </button>
          <button type="button" className="entry-invite__btn is-primary" onClick={handleConfirm}>
            <Icon name="sparkles" size={14} />{' '}
            {purchaseSeatsMode
              ? t('demo.UpgradeTeamDialog.tsx.confirmPay', { total: monthlyTotal })
              : t('demo.UpgradeTeamDialog.tsx.confirmUpgrade', { total: monthlyTotal })}
          </button>
        </div>
      </div>
    </div>
  );
}
