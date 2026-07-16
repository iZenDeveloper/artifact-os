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
const TEAM_TIERS = [
  { id: 'plus', name: 'Team Plus', pricePerSeat: 40 },
  { id: 'pro', name: 'Team Pro', pricePerSeat: 80, recommended: true },
  { id: 'max', name: 'Team Max', pricePerSeat: 220 },
];
const TEAM_BENEFIT_KEYS = ['assets', 'collab', 'roles', 'usage'];

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
  const creditPackFor = (tierId: string) =>
    t(`demo.UpgradeTeamDialog.tsx.creditPack.${tierId}` as keyof Dict);
  const selectedCreditPack = creditPackFor(selectedTier?.id ?? 'pro');
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
    <div className="entry-invite" role="dialog" aria-modal="true" aria-label={purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.aria.dialog.seats') : t('demo.UpgradeTeamDialog.tsx.aria.dialog.upgrade')}>
      <div className="entry-invite__backdrop" onClick={onClose} />
      <div className="upgrade-team">
        <button
          type="button"
          className="entry-invite__close"
          onClick={onClose}
          aria-label={t('demo.UpgradeTeamDialog.tsx.aria.close')}
        >
          <Icon name="close" size={16} />
        </button>

        <div className="upgrade-team__head">
          <h2 className="upgrade-team__title">{purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.title.seats') : t('demo.UpgradeTeamDialog.tsx.title.upgrade')}</h2>
          <p className="upgrade-team__subtitle">
            {purchaseSeatsMode
              ? t('demo.UpgradeTeamDialog.tsx.subtitle.seats').replace('{count}', String(minSeatCount))
              : t('demo.UpgradeTeamDialog.tsx.subtitle.upgrade').replace('{count}', String(minSeatCount))}
          </p>
        </div>

        <div className="upgrade-team__pricing-rule" aria-label={t('demo.UpgradeTeamDialog.tsx.aria.pricingRule')}>
          <strong>{t('demo.UpgradeTeamDialog.tsx.pricingRule.title')}</strong>
          <span>{t('demo.UpgradeTeamDialog.tsx.pricingRule.baseFee').replace('{fee}', String(WORKSPACE_BASE_FEE))}</span>
          <span>{t('demo.UpgradeTeamDialog.tsx.pricingRule.tokenPack')}</span>
        </div>

        <div className="upgrade-team__seat-summary">
          <span>{t('demo.UpgradeTeamDialog.tsx.seatCount')}</span>
          <span className="upgrade-team__seat-stepper" aria-label={t('demo.UpgradeTeamDialog.tsx.aria.seatStepper')}>
            <button
              type="button"
              onClick={() => adjustSeatCount(-1)}
              disabled={seatCount <= minSeatCount}
              aria-label={t('demo.UpgradeTeamDialog.tsx.aria.seatMinus')}
            >
              -
            </button>
            <strong>{seatCount}</strong>
            <button type="button" onClick={() => adjustSeatCount(1)} aria-label={t('demo.UpgradeTeamDialog.tsx.aria.seatPlus')}>
              +
            </button>
          </span>
        </div>

        <div className="upgrade-team__plans" role="radiogroup" aria-label={t('demo.UpgradeTeamDialog.tsx.aria.plans')}>
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
                  ${tier.pricePerSeat * seatCount} {t('demo.UpgradeTeamDialog.tsx.planTotalSuffix').replace('{count}', String(seatCount))}
                </span>
                <span className="upgrade-team__plan-composition">
                  ${WORKSPACE_BASE_FEE} {t('demo.UpgradeTeamDialog.tsx.baseFeeLabel')} + {creditPackFor(tier.id)}
                </span>
                <span className="upgrade-team__plan-hint">{t(`demo.UpgradeTeamDialog.tsx.hint.${tier.id}` as keyof Dict)}</span>
              </button>
            );
          })}
        </div>

        {/* The benefits are a first-time value-prop; skip them when an
            existing team is just buying more seats — they already know. */}
        {purchaseSeatsMode ? null : (
          <ul className="upgrade-team__benefits" aria-label={t('demo.UpgradeTeamDialog.tsx.aria.benefits')}>
            {TEAM_BENEFIT_KEYS.map((benefitKey) => (
              <li key={benefitKey}>
                <Icon name="check" size={13} />
                <span>{t(`demo.UpgradeTeamDialog.tsx.benefit.${benefitKey}` as keyof Dict)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="upgrade-team__foot">
          <button type="button" className="entry-invite__btn" onClick={onClose}>
            {purchaseSeatsMode ? t('demo.UpgradeTeamDialog.tsx.cancel.seats') : t('demo.UpgradeTeamDialog.tsx.cancel.upgrade')}
          </button>
          <button type="button" className="entry-invite__btn is-primary" onClick={handleConfirm}>
            <Icon name="sparkles" size={14} />{' '}
            {purchaseSeatsMode
              ? t('demo.UpgradeTeamDialog.tsx.confirm.seats').replace('{total}', String(monthlyTotal))
              : t('demo.UpgradeTeamDialog.tsx.confirm.upgrade').replace('{total}', String(monthlyTotal))}
          </button>
        </div>
      </div>
    </div>
  );
}
