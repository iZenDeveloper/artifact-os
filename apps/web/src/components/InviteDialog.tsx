// Reusable "invite teammates" dialog for the team workspace.
//
// Opened from the team dropdown in the left rail and the "全部项目" team
// header. Demo-only: all data is hard-coded Chinese mock content, no backend.
// Split invite dialog — form on the left, decorative art on the right.

import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';

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
  /** Owner / Manager can choose roles; Editor / Viewer invite as members. */
  canAssignRoles?: boolean;
}

const TEAM_SIZE = 3;
const DEFAULT_ROLE = '团队成员';
const ROLE_OPTIONS = ['管理员', DEFAULT_ROLE, '查看者'];

export function InviteDialog({ open, onClose, freePlan = false, onSubmit, canAssignRoles = true }: Props) {
  const [rows, setRows] = useState<InviteRow[]>([{ email: '', role: DEFAULT_ROLE }]);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [openRoleIndex, setOpenRoleIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const roleListboxId = useId();

  useEffect(() => {
    if (!open || canAssignRoles) return;
    setRows((prev) => prev.map((row) => ({ ...row, role: DEFAULT_ROLE })));
  }, [canAssignRoles, open]);

  useEffect(() => {
    if (!open) {
      setOpenRoleIndex(null);
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (panelRef.current?.contains(event.target as Node)) return;
      setOpenRoleIndex(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenRoleIndex(null);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  function updateRow(index: number, patch: Partial<InviteRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { email: '', role: DEFAULT_ROLE }]);
  }
  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    setOpenRoleIndex(null);
  }

  function handleConfirm() {
    const valid = rows.filter((r) => r.email.trim().length > 0);
    onClose();
    onSubmit?.(valid);
    setRows([{ email: '', role: DEFAULT_ROLE }]);
    setOpenRoleIndex(null);
  }

  return (
    <div className="entry-invite" role="dialog" aria-modal="true" aria-label="邀请成员">
      <div className="entry-invite__backdrop" onClick={onClose} />
      <div className="entry-invite__panel entry-invite__panel--split" ref={panelRef}>
        <button
          type="button"
          className="entry-invite__close"
          onClick={onClose}
          aria-label="关闭"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="entry-invite__form">
          <h2 className="entry-invite__title">邀请成员加入你的团队</h2>
          <p className="entry-invite__teamsize">
            你的团队有 <span className="entry-invite__teamsize-link">{freePlan ? 1 : TEAM_SIZE}人</span>。
          </p>

          <div className="entry-invite__divider">
            <span>或者</span>
          </div>

          <div className="entry-invite__field-labels">
            <span className="entry-invite__label">通过电子邮件邀请成员</span>
            <span className="entry-invite__label entry-invite__label--role">
              {canAssignRoles ? '分配角色' : '默认身份'}
            </span>
          </div>
          {rows.map((row, i) => (
            <div className="entry-invite__fields" key={i}>
              <input
                className="entry-invite__input"
                placeholder="输入电子邮件地址……"
                value={row.email}
                onChange={(e) => updateRow(i, { email: e.target.value })}
              />
              <div className="entry-invite__role-picker">
                <button
                  type="button"
                  className="entry-invite__role"
                  onClick={() => {
                    if (!canAssignRoles) return;
                    setOpenRoleIndex((current) => (current === i ? null : i));
                  }}
                  disabled={!canAssignRoles}
                  aria-label={canAssignRoles ? '分配角色' : '默认身份'}
                  aria-haspopup="listbox"
                  aria-expanded={openRoleIndex === i}
                  aria-controls={`${roleListboxId}-${i}`}
                >
                  <span>{canAssignRoles ? row.role : DEFAULT_ROLE}</span>
                  <Icon name="chevron-down" size={16} />
                </button>
                {openRoleIndex === i ? (
                  <div className="entry-invite__role-menu" id={`${roleListboxId}-${i}`} role="listbox">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        type="button"
                        key={role}
                        className={`entry-invite__role-option${(canAssignRoles ? row.role : DEFAULT_ROLE) === role ? ' is-selected' : ''}`}
                        role="option"
                        aria-selected={(canAssignRoles ? row.role : DEFAULT_ROLE) === role}
                        onClick={() => {
                          updateRow(i, { role });
                          setOpenRoleIndex(null);
                        }}
                      >
                        <span>{role}</span>
                        {(canAssignRoles ? row.role : DEFAULT_ROLE) === role ? <Icon name="check" size={16} /> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {rows.length > 1 ? (
                <button
                  type="button"
                  className="entry-invite__row-remove"
                  onClick={() => removeRow(i)}
                  aria-label="移除"
                >
                  <Icon name="close" size={15} />
                </button>
              ) : null}
            </div>
          ))}
          <button type="button" className="entry-invite__add-row" onClick={addRow}>
            <Icon name="plus" size={14} /> 添加成员
          </button>

          <button
            type="button"
            className="entry-invite__collapse"
            onClick={() => setVisibilityOpen((v) => !v)}
            aria-expanded={visibilityOpen}
          >
            团队成员会看到我的设计吗?
            <Icon
              name="chevron-down"
              size={16}
              style={visibilityOpen ? { transform: 'rotate(180deg)' } : undefined}
            />
          </button>
          {visibilityOpen ? (
            <p className="entry-invite__collapse-body">
              团队成员可以看到你共享到团队空间的设计；保存在「草稿」中的私人设计不会对其他人可见。
            </p>
          ) : null}

          <button type="button" className="entry-invite__submit" onClick={handleConfirm}>
            确认并邀请
          </button>
        </div>

        <div className="entry-invite__art" aria-hidden>
          <span className="entry-invite__art-blob entry-invite__art-blob--a" />
          <span className="entry-invite__art-blob entry-invite__art-blob--b" />
          <span className="entry-invite__art-card entry-invite__art-card--1" />
          <span className="entry-invite__art-card entry-invite__art-card--2" />
          <span className="entry-invite__art-card entry-invite__art-card--3" />
        </div>
      </div>
    </div>
  );
}
