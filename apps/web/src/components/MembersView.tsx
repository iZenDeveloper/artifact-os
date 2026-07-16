// Team members management view (demo).
//
// UC-2 entry point 4 (team members) + role management. Demo-only:
// all data is hard-coded Chinese mock content, no backend. The
// "邀请同事" button opens the shared <InviteDialog> (self-owned open
// state), and each member's role is a controlled <select> so the
// dropdowns stay interactive for the review.

import { useState } from 'react';
import { Icon } from './Icon';
import { Toast } from './Toast';
import { InviteDialog } from './InviteDialog';
import { UpgradeTeamDialog } from './UpgradeTeamDialog';
import { Confetti } from './Confetti';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

type Role = 'owner' | 'admin' | 'member';

interface Member {
  id: string;
  /** i18n key for the member's display name (demo data localized per locale). */
  nameKey: keyof Dict;
  email: string;
  img: string;
  role: Role;
  joinedAt: string;
  /** The current user ("你") — owner row, role select is disabled,
   *  and there is no "移除" action. */
  isYou?: boolean;
}

// Unified mock team (kept in sync with RecentProjectsStrip MOCK_MEMBERS).
const MOCK_MEMBERS: Member[] = [
  { id: 'qy', nameKey: 'demo.MembersView.tsx.member.qy', email: 'qiongyu@nexu.io', img: '/team-avatars/a2.png', role: 'owner', joinedAt: '2026-06-01', isYou: true },
  { id: 'zw', nameKey: 'demo.MembersView.tsx.member.zw', email: 'zhangwei@nexu.io', img: '/team-avatars/a1.png', role: 'admin', joinedAt: '2026-06-24' },
  { id: 'ln', nameKey: 'demo.MembersView.tsx.member.ln', email: 'lina@nexu.io', img: '/team-avatars/a3.png', role: 'member', joinedAt: '2026-06-25' },
  { id: 'wf', nameKey: 'demo.MembersView.tsx.member.wf', email: 'wangfang@nexu.io', img: '/team-avatars/a4.png', role: 'member', joinedAt: '2026-06-20' },
  { id: 'cm', nameKey: 'demo.MembersView.tsx.member.cm', email: 'chenming@nexu.io', img: '/team-avatars/a6.png', role: 'member', joinedAt: '2026-06-18' },
  { id: 'ly', nameKey: 'demo.MembersView.tsx.member.ly', email: 'liuyang@nexu.io', img: '/team-avatars/a7.png', role: 'member', joinedAt: '2026-06-12' },
];

// Assignable roles per the PRD matrix. owner is deliberately NOT here:
// the workspace Owner is a singleton (the creator) and cannot be assigned
// to other members — the owner row renders it read-only instead.
const ASSIGNABLE_ROLE_OPTIONS: Role[] = ['admin', 'member'];
const MIN_TEAM_SEATS = 3;
const TEAM_PLAN_COPY_KEYS: (keyof Dict)[] = [
  'demo.MembersView.tsx.plan.baseFee',
  'demo.MembersView.tsx.plan.creditPack',
  'demo.MembersView.tsx.plan.assets',
  'demo.MembersView.tsx.plan.collab',
];

interface PendingInvite {
  email: string;
  role: string;
}

export function MembersView({ solo = false }: { solo?: boolean }) {
  const t = useT();
  const ROLE_LABELS: Record<Role, string> = {
    owner: t('demo.MembersView.tsx.role.owner'),
    admin: t('demo.MembersView.tsx.role.admin'),
    member: t('demo.MembersView.tsx.role.member'),
  };
  const [inviteOpen, setInviteOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  // Locally upgraded to team via the in-flow CTA (overrides the solo prop).
  const [upgraded, setUpgraded] = useState(false);
  const [confettiOn, setConfettiOn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Emails showing a transient "已发送" confirmation after a resend click.
  const [resentEmails, setResentEmails] = useState<Set<string>>(() => new Set());
  // Invites entered before an upgrade was required — sent once upgraded.
  const [queuedInvites, setQueuedInvites] = useState<PendingInvite[]>([]);
  // Per-member role state so the dropdowns are interactive in the demo.
  const [roles, setRoles] = useState<Record<string, Role>>(() =>
    Object.fromEntries(MOCK_MEMBERS.map((m) => [m.id, m.role])),
  );
  const [removedMemberIds, setRemovedMemberIds] = useState<Set<string>>(() => new Set());
  const [teamSeats, setTeamSeats] = useState(MIN_TEAM_SEATS);
  const [teamTier, setTeamTier] = useState({ name: 'Team Pro', pricePerSeat: 80, creditPack: t('demo.MembersView.tsx.creditPack.pro') });

  // A solo plan that hasn't locally upgraded behaves single-seat.
  const isSolo = solo && !upgraded;
  // Demo team state: solo shows only "you"; team shows you + one active member.
  const TEAM_ACTIVE_IDS = ['qy', 'zw'];
  const activeMemberIds = isSolo ? new Set(['qy']) : new Set(TEAM_ACTIVE_IDS);
  const members = MOCK_MEMBERS.filter((m) => activeMemberIds.has(m.id) && !removedMemberIds.has(m.id));
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const seatsUsed = members.length + pendingInvites.length;
  const seatsTotal = isSolo ? 1 : teamSeats;
  const teamMonthlyTotal = teamTier.pricePerSeat * teamSeats;
  // When buying seats (stepper "+" or an over-capacity invite), the floor must
  // cover already-used seats plus any queued invites, and add at least one.
  const seatPurchaseMin = Math.max(teamSeats + 1, seatsUsed + queuedInvites.length);
  // Solo → team upgrade floor: after the flip the team roster activates
  // (owner + seeded member) and every queued invite lands as pending, so the
  // purchased seats must cover both — otherwise a free user queuing 2+ invites
  // could accept the default 3 seats and end up over capacity (4/3, 5/3…).
  const postUpgradeMemberCount = MOCK_MEMBERS.filter(
    (m) => TEAM_ACTIVE_IDS.includes(m.id) && !removedMemberIds.has(m.id),
  ).length;
  const soloUpgradeMin = Math.max(MIN_TEAM_SEATS, postUpgradeMemberCount + queuedInvites.length);

  function setRole(id: string, role: Role) {
    setRoles((prev) => ({ ...prev, [id]: role }));
  }

  // "确认并邀请" from the InviteDialog. Free/solo users must upgrade first;
  // team users send invites immediately.
  function handleInviteSubmit(rows: PendingInvite[]) {
    if (rows.length === 0) return;
    if (isSolo) {
      setQueuedInvites(rows);
      setUpgradeOpen(true);
      return;
    }
    // Team: every invite needs a seat. If the invites would exceed the
    // purchased seats, buy more first — so "used > total" (4/3) can't happen;
    // the queued invites are sent once the purchase confirms.
    const wouldUse = members.length + pendingInvites.length + rows.length;
    if (wouldUse > teamSeats) {
      setQueuedInvites(rows);
      setUpgradeOpen(true);
    } else {
      sendInvites(rows);
    }
  }

  function sendInvites(rows: PendingInvite[]) {
    setPendingInvites((prev) => [...prev, ...rows]);
    setToast(t('demo.MembersView.tsx.toast.invitesSent').replace('{count}', String(rows.length)));
  }

  function resendInvite(email: string) {
    setToast(t('demo.MembersView.tsx.toast.inviteResent').replace('{email}', email));
    setResentEmails((prev) => new Set(prev).add(email));
    window.setTimeout(() => {
      setResentEmails((prev) => {
        const next = new Set(prev);
        next.delete(email);
        return next;
      });
    }, 2000);
  }

  function removeMember(member: Member) {
    if (member.isYou) return;
    setRemovedMemberIds((current) => {
      const next = new Set(current);
      next.add(member.id);
      return next;
    });
    setToast(t('demo.MembersView.tsx.toast.memberRemoved').replace('{name}', t(member.nameKey)));
  }

  function adjustTeamSeats(delta: number) {
    const floor = Math.max(MIN_TEAM_SEATS, seatsUsed);
    setTeamSeats((current) => Math.max(floor, current + delta));
  }

  function openSeatPurchase() {
    setUpgradeOpen(true);
  }

  // "升级到团队版" confirmed → confetti, flip to team, then auto-send the
  // queued invites so they land in the member list as pending.
  function handleUpgradeConfirm(config?: { seatCount: number; tierName: string; pricePerSeat: number; creditPack: string }) {
    setUpgradeOpen(false);
    setUpgraded(true);
    if (config) {
      setTeamSeats(config.seatCount);
      setTeamTier({ name: config.tierName, pricePerSeat: config.pricePerSeat, creditPack: config.creditPack });
    }
    setConfettiOn(true);
    window.setTimeout(() => setConfettiOn(false), 2600);
    if (queuedInvites.length > 0) {
      sendInvites(queuedInvites);
      setQueuedInvites([]);
    } else {
      setToast(t('demo.MembersView.tsx.toast.upgraded').replace('{tier}', config?.tierName ?? teamTier.name));
    }
  }

  return (
    <div className="entry-section members">
      <header className="entry-section__head members__head">
        <div className="members__head-text">
          <h1 className="entry-section__title">{t('demo.MembersView.tsx.title')}</h1>
        </div>
        <button
          type="button"
          className="members__invite-btn"
          onClick={() => setInviteOpen(true)}
        >
          <Icon name="share" size={15} /> {t('demo.MembersView.tsx.inviteBtn')}
        </button>
      </header>

      {toast ? (
        <Toast message={toast} tone="success" ttlMs={3200} onDismiss={() => setToast(null)} />
      ) : null}

      <div className="members__seats">
        <div className="members__seats-main">
          <span className="members__seats-icon" aria-hidden>
            <Icon name="info" size={14} />
          </span>
          <div className="members__seats-copy">
            <span>
              {t('demo.MembersView.tsx.seats.label')} <strong>{seatsUsed}/{seatsTotal}</strong> {t('demo.MembersView.tsx.seats.used')} ·{' '}
              {isSolo
                ? t('demo.MembersView.tsx.seats.soloHint')
                : `${teamTier.name} · $${teamTier.pricePerSeat} ${t('demo.MembersView.tsx.seats.perSeatMonth')} · $${teamMonthlyTotal} ${t('demo.MembersView.tsx.seats.perMonth')}`}
            </span>
            <small>
              {isSolo
                ? t('demo.MembersView.tsx.seats.soloSmall')
                : t('demo.MembersView.tsx.seats.teamSmall').replace('{creditPack}', teamTier.creditPack)}
            </small>
          </div>
          {!isSolo ? (
            <div className="members__seat-stepper" aria-label={t('demo.MembersView.tsx.stepper.ariaLabel')}>
              <button
                type="button"
                onClick={() => adjustTeamSeats(-1)}
                disabled={teamSeats <= Math.max(MIN_TEAM_SEATS, seatsUsed)}
                aria-label={t('demo.MembersView.tsx.stepper.decrease')}
              >
                -
              </button>
              <strong>{t('demo.MembersView.tsx.stepper.seatCount').replace('{count}', String(teamSeats))}</strong>
              <button type="button" onClick={openSeatPurchase} aria-label={t('demo.MembersView.tsx.stepper.increase')}>
                +
              </button>
            </div>
          ) : null}
        </div>
        <div className="members__seats-benefits">
          {TEAM_PLAN_COPY_KEYS.map((key) => (
            <span key={key}>
              <Icon name="check" size={14} /> {t(key)}
            </span>
          ))}
        </div>
        {!isSolo ? (
          <div className="members__auto-recharge">
            <span className="members__auto-recharge-icon" aria-hidden>
              <Icon name="refresh" size={14} />
            </span>
            <div>
              <strong>{t('demo.MembersView.tsx.autoRecharge.title')}</strong>
              <p>{t('demo.MembersView.tsx.autoRecharge.desc')}</p>
            </div>
            <button type="button">{t('demo.MembersView.tsx.autoRecharge.btn')}</button>
          </div>
        ) : null}
      </div>

      <div className="members__panel">
        <div className="members__list-head" aria-hidden>
          <span className="members__col members__col--person">{t('demo.MembersView.tsx.col.person')}</span>
          <span className="members__col members__col--joined">{t('demo.MembersView.tsx.col.joined')}</span>
          <span className="members__col members__col--role">{t('demo.MembersView.tsx.col.role')}</span>
          <span className="members__col members__col--action" />
        </div>

        {members.map((member) => {
          const role = roles[member.id] ?? member.role;
          return (
            <div className="members__row" key={member.id}>
              <div className="members__col members__col--person">
                <img className="members__avatar" src={member.img} alt="" aria-hidden />
                <div className="members__person-text">
                  <span className="members__name">
                    {t(member.nameKey)}
                    {member.isYou ? <span className="members__you-tag">{t('demo.MembersView.tsx.youTag')}</span> : null}
                  </span>
                  <span className="members__email">{member.email}</span>
                </div>
              </div>

              <div className="members__col members__col--joined">
                <time dateTime={member.joinedAt}>{member.joinedAt}</time>
              </div>

              <div className="members__col members__col--role">
                <select
                  className="members__role-select"
                  value={role}
                  disabled={member.isYou}
                  aria-label={t('demo.MembersView.tsx.roleSelect.ariaLabel').replace('{name}', t(member.nameKey))}
                  onChange={(e) => setRole(member.id, e.target.value as Role)}
                >
                  {(member.isYou ? ['owner' as Role] : ASSIGNABLE_ROLE_OPTIONS).map((opt) => (
                    <option key={opt} value={opt}>
                      {ROLE_LABELS[opt]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="members__col members__col--action">
                {member.isYou ? null : (
                  <button
                    type="button"
                    className="members__remove"
                    aria-label={t('demo.MembersView.tsx.remove.ariaLabel').replace('{name}', t(member.nameKey))}
                    title={t('demo.MembersView.tsx.remove.title')}
                    onClick={() => removeMember(member)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pendingInvites.length > 0 ? (
        <div className="members__pending">
          <h2 className="members__pending-title">{t('demo.MembersView.tsx.pending.title')} · {pendingInvites.length}</h2>
          <div className="members__panel">
            {pendingInvites.map((invite, i) => (
              <div className="members__row members__row--pending" key={`${invite.email}-${i}`}>
                <div className="members__col members__col--person">
                  <span className="members__avatar members__avatar--placeholder" aria-hidden>
                    <Icon name="send" size={14} />
                  </span>
                  <div className="members__person-text">
                    <span className="members__name">{invite.email}</span>
                    <span className="members__email">{t('demo.MembersView.tsx.pending.roleLabel')}{invite.role}</span>
                  </div>
                </div>
                <div className="members__col members__col--role">
                  <span className="members__badge">{t('demo.MembersView.tsx.pending.waiting')}</span>
                </div>
                <div className="members__col members__col--action">
                  <button
                    type="button"
                    className="members__resend"
                    onClick={() => resendInvite(invite.email)}
                    disabled={resentEmails.has(invite.email)}
                  >
                    {resentEmails.has(invite.email) ? (
                      <>
                        <Icon name="check" size={14} /> {t('demo.MembersView.tsx.pending.sent')}
                      </>
                    ) : (
                      <>
                        <Icon name="refresh" size={14} /> {t('demo.MembersView.tsx.pending.resend')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        freePlan={isSolo}
        onSubmit={handleInviteSubmit}
      />
      <UpgradeTeamDialog
        open={upgradeOpen}
        onClose={() => {
          setUpgradeOpen(false);
          // Dismissing the purchase abandons the invites that required it —
          // otherwise a later unrelated seat purchase would silently send
          // rows the user already canceled.
          setQueuedInvites([]);
        }}
        onConfirm={handleUpgradeConfirm}
        initialSeatCount={isSolo ? soloUpgradeMin : seatPurchaseMin}
        minSeatCount={isSolo ? soloUpgradeMin : seatPurchaseMin}
        mode={isSolo ? 'upgrade' : 'seats'}
      />
      {confettiOn ? <Confetti /> : null}
    </div>
  );
}
