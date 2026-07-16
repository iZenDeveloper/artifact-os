import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';

type WorkspaceSettingsViewProps = {
  hasActiveSubscription?: boolean;
};

export function WorkspaceSettingsView({ hasActiveSubscription = false }: WorkspaceSettingsViewProps) {
  const t = useT();
  const [workspaceName, setWorkspaceName] = useState(t('demo.WorkspaceSettingsView.tsx.defaultWorkspaceName'));
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [subscriptionActive, setSubscriptionActive] = useState(hasActiveSubscription);
  const canDelete = deleteText.trim() === workspaceName.trim();

  useEffect(() => {
    setSubscriptionActive(hasActiveSubscription);
  }, [hasActiveSubscription]);

  function handleDelete() {
    if (subscriptionActive) return;
    if (!canDelete) return;
    setConfirmingDelete(false);
    setDeleteText('');
    setToast(t('demo.WorkspaceSettingsView.tsx.toastDeleteTriggered'));
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="entry-section workspace-settings">
      <header className="entry-section__head workspace-settings__head">
        <div>
          <h1 className="entry-section__title">{t('demo.WorkspaceSettingsView.tsx.title')}</h1>
          <p className="workspace-settings__subtitle">{t('demo.WorkspaceSettingsView.tsx.subtitle')}</p>
        </div>
      </header>

      {toast ? <div className="workspace-settings__toast">{toast}</div> : null}

      <section className="workspace-settings__panel" aria-label={t('demo.WorkspaceSettingsView.tsx.basicInfoAria')}>
        <div className="workspace-settings__row">
          <div className="workspace-settings__label">
            <strong>{t('demo.WorkspaceSettingsView.tsx.nameLabel')}</strong>
            <span>{t('demo.WorkspaceSettingsView.tsx.nameHint')}</span>
          </div>
          <input
            className="workspace-settings__input"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            aria-label={t('demo.WorkspaceSettingsView.tsx.nameLabel')}
          />
        </div>

        <div className="workspace-settings__row">
          <div className="workspace-settings__label">
            <strong>{t('demo.WorkspaceSettingsView.tsx.iconLabel')}</strong>
            <span>{t('demo.WorkspaceSettingsView.tsx.iconHint')}</span>
          </div>
          <div className="workspace-settings__icon-editor">
            <span className="workspace-settings__icon-preview" aria-hidden>
              N
            </span>
            <button type="button" className="workspace-settings__secondary-btn">
              {t('demo.WorkspaceSettingsView.tsx.changeIcon')}
            </button>
          </div>
        </div>
      </section>

      <section className="workspace-settings__danger" aria-label={t('demo.WorkspaceSettingsView.tsx.dangerZone')}>
        <div className="workspace-settings__danger-copy">
          <span className="workspace-settings__danger-icon" aria-hidden>
            <Icon name="alert-triangle" size={18} />
          </span>
          <div>
            <h2>{t('demo.WorkspaceSettingsView.tsx.dangerZone')}</h2>
            <p>{t('demo.WorkspaceSettingsView.tsx.dangerDesc')}</p>
          </div>
        </div>
        <button
          type="button"
          className="workspace-settings__danger-btn"
          onClick={() => setConfirmingDelete(true)}
        >
          {t('demo.WorkspaceSettingsView.tsx.deleteWorkspace')}
        </button>
      </section>

      {confirmingDelete ? (
        <div className="workspace-settings__modal-backdrop" role="presentation">
          <section
            className={`workspace-settings__modal${subscriptionActive ? ' workspace-settings__modal--subscription' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={t('demo.WorkspaceSettingsView.tsx.deleteWorkspace')}
          >
            <header>
              <h2>{t('demo.WorkspaceSettingsView.tsx.deleteModalTitle')}</h2>
              <button
                type="button"
                className="workspace-settings__modal-close"
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteText('');
                }}
                aria-label={t('demo.WorkspaceSettingsView.tsx.close')}
              >
                <Icon name="close" size={14} />
              </button>
            </header>
            {subscriptionActive ? (
              <>
                <div className="workspace-settings__subscription-block">
                  <span className="workspace-settings__danger-icon" aria-hidden>
                    <Icon name="alert-triangle" size={18} />
                  </span>
                  <div>
                    <strong>{t('demo.WorkspaceSettingsView.tsx.subscriptionActiveTitle')}</strong>
                    <p>{t('demo.WorkspaceSettingsView.tsx.subscriptionActiveDesc')}</p>
                  </div>
                </div>
                <div className="workspace-settings__modal-actions">
                  <button
                    type="button"
                    className="workspace-settings__secondary-btn"
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteText('');
                    }}
                  >
                    {t('demo.WorkspaceSettingsView.tsx.notNow')}
                  </button>
                  <button
                    type="button"
                    className="workspace-settings__danger-btn"
                    onClick={() => {
                      setSubscriptionActive(false);
                      setToast(t('demo.WorkspaceSettingsView.tsx.toastSubscriptionCancelled'));
                      window.setTimeout(() => setToast(null), 2600);
                    }}
                  >
                    {t('demo.WorkspaceSettingsView.tsx.cancelSubscriptionFirst')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{t('demo.WorkspaceSettingsView.tsx.confirmPromptBefore')}<strong>{workspaceName}</strong>{t('demo.WorkspaceSettingsView.tsx.confirmPromptAfter')}</p>
                <input
                  className="workspace-settings__input"
                  value={deleteText}
                  onChange={(event) => setDeleteText(event.target.value)}
                  placeholder={workspaceName}
                  aria-label={t('demo.WorkspaceSettingsView.tsx.confirmNameAria')}
                  autoFocus
                />
                <div className="workspace-settings__modal-actions">
                  <button
                    type="button"
                    className="workspace-settings__secondary-btn"
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteText('');
                    }}
                  >
                    {t('demo.WorkspaceSettingsView.tsx.cancel')}
                  </button>
                  <button
                    type="button"
                    className="workspace-settings__danger-btn"
                    disabled={!canDelete}
                    onClick={handleDelete}
                  >
                    {t('demo.WorkspaceSettingsView.tsx.confirmDelete')}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
