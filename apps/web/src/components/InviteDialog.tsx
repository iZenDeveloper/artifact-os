// Reusable "invite teammates" dialog for the team workspace.
//
// Opened from the team dropdown in the left rail and the "全部项目" team
// header. Demo-only: all data is hard-coded Chinese mock content, no backend.
// Canva-style two-column layout — form on the left, decorative art on the right.

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';

export interface InviteRow {
  email: string;
  role: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Shows "你的团队有 1人" for single-seat plans (vs the team default). */
  freePlan?: boolean;
  /** Called with the entered rows when "确认并邀请" is pressed. The host
   *  decides whether to send invites directly or route through upgrade. */
  onSubmit?: (rows: InviteRow[]) => void;
  /** Owner / Admin can choose roles; Member invites with the default role. */
  canAssignRoles?: boolean;
}

// Default invited role, aligned to the PRD matrix (管理员/成员 are assignable;
// 所有者 is the workspace creator only and never assignable).
const DEFAULT_ROLE = 'member';

export function InviteDialog({ open, onClose, freePlan = false, onSubmit, canAssignRoles = true }: Props) {
  const t = useT();
  const [rows, setRows] = useState<InviteRow[]>([{ email: '', role: DEFAULT_ROLE }]);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  useEffect(() => {
    if (!open || canAssignRoles) return;
    setRows((prev) => prev.map((row) => ({ ...row, role: DEFAULT_ROLE })));
  }, [canAssignRoles, open]);

  if (!open) return null;

  function updateRow(index: number, patch: Partial<InviteRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { email: '', role: DEFAULT_ROLE }]);
  }
  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  // Demo-grade email shape check (something@something.tld) — keeps obvious
  // non-emails from enabling submit; both the button state and the rows
  // passed to onSubmit use the same predicate.
  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const hasValidEmail = rows.some((r) => isEmail(r.email));

  function handleConfirm() {
    const valid = rows.filter((r) => isEmail(r.email));
    if (valid.length === 0) return;
    onClose();
    onSubmit?.(valid);
    setRows([{ email: '', role: DEFAULT_ROLE }]);
  }

  return (
    <div className="entry-invite" role="dialog" aria-modal="true" aria-label={t('demo.InviteDialog.tsx.dialog-aria')}>
      <div className="entry-invite__backdrop" onClick={onClose} />
      <div className="entry-invite__panel entry-invite__panel--split">
        <button
          type="button"
          className="entry-invite__close"
          onClick={onClose}
          aria-label={t('demo.InviteDialog.tsx.close-aria')}
        >
          <Icon name="close" size={16} />
        </button>

        <div className="entry-invite__form">
          <h2 className="entry-invite__title">{t('demo.InviteDialog.tsx.title')}</h2>
          <p className="entry-invite__teamsize">
            {freePlan
              ? t('demo.InviteDialog.tsx.teamsize-free')
              : t('demo.InviteDialog.tsx.teamsize-team')}
          </p>

          <div className="entry-invite__field-labels">
            <span className="entry-invite__label">{t('demo.InviteDialog.tsx.label-email')}</span>
            <span className="entry-invite__label entry-invite__label--role">
              {canAssignRoles ? t('demo.InviteDialog.tsx.label-assign-role') : t('demo.InviteDialog.tsx.label-default-role')}
            </span>
          </div>
          <div className="entry-invite__rows">
            {rows.map((row, i) => (
              <div className="entry-invite__fields" key={i}>
                <input
                  className="entry-invite__input"
                  type="email"
                  placeholder={t('demo.InviteDialog.tsx.email-placeholder')}
                  value={row.email}
                  onChange={(e) => updateRow(i, { email: e.target.value })}
                />
                <select
                  className="entry-invite__role"
                  value={canAssignRoles ? row.role : DEFAULT_ROLE}
                  onChange={(e) => updateRow(i, { role: e.target.value })}
                  disabled={!canAssignRoles}
                  aria-label={canAssignRoles ? t('demo.InviteDialog.tsx.label-assign-role') : t('demo.InviteDialog.tsx.label-default-role')}
                >
                  <option value="admin">{t('demo.InviteDialog.tsx.role-admin')}</option>
                  <option value="member">{t('demo.InviteDialog.tsx.role-member')}</option>
                </select>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    className="entry-invite__row-remove"
                    onClick={() => removeRow(i)}
                    aria-label={t('demo.InviteDialog.tsx.remove-aria')}
                  >
                    <Icon name="close" size={15} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <button type="button" className="entry-invite__add-row" onClick={addRow}>
            <Icon name="plus" size={14} /> {t('demo.InviteDialog.tsx.add-member')}
          </button>

          <button
            type="button"
            className="entry-invite__collapse"
            onClick={() => setVisibilityOpen((v) => !v)}
            aria-expanded={visibilityOpen}
          >
            {t('demo.InviteDialog.tsx.visibility-toggle')}
            <Icon
              name="chevron-down"
              size={16}
              style={visibilityOpen ? { transform: 'rotate(180deg)' } : undefined}
            />
          </button>
          {visibilityOpen ? (
            <p className="entry-invite__collapse-body">
              {t('demo.InviteDialog.tsx.visibility-body')}
            </p>
          ) : null}

          <button
            type="button"
            className="entry-invite__submit"
            onClick={handleConfirm}
            disabled={!hasValidEmail}
          >
            {t('demo.InviteDialog.tsx.submit')}
          </button>
        </div>

        <div className="entry-invite__art" aria-hidden>
          <span className="entry-invite__art-glow" />
          <div className="entry-invite__art-cluster">
            <span className="entry-invite__art-avatar">
              <img src="/team-avatars/a2.png" alt="" />
            </span>
            <span className="entry-invite__art-avatar">
              <img src="/team-avatars/a1.png" alt="" />
            </span>
            <span className="entry-invite__art-avatar">
              <img src="/team-avatars/a4.png" alt="" />
            </span>
            <span className="entry-invite__art-avatar">
              <img src="/team-avatars/a6.png" alt="" />
            </span>
            <span className="entry-invite__art-avatar entry-invite__art-avatar--invite">
              <Icon name="plus" size={26} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
