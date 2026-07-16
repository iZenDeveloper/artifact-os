import { useState } from 'react';
import { Button, Input } from '@open-design/components';
import { Icon } from './Icon';
import { useT } from '../i18n';
import type { DemoScenario } from './DemoControlBar';

type InviteStage = 'auth' | 'confirm' | 'joining' | 'success';
type LocalLaunchState = 'idle' | 'opening' | 'download' | 'downloaded';

function getInviteRole(
  scenario: Extract<DemoScenario, 'invite-editor'>,
  t: ReturnType<typeof useT>,
): { label: string; description: string } {
  const roles: Record<
    Extract<DemoScenario, 'invite-editor'>,
    { label: string; description: string }
  > = {
    'invite-editor': {
      label: t('demo.WorkspaceInviteFlow.tsx.role.member.label'),
      description: t('demo.WorkspaceInviteFlow.tsx.role.member.description'),
    },
  };
  return roles[scenario];
}

const styles = {
  activeStatus: 'workspace-invite-activeStatus',
  ambient: 'workspace-invite-ambient',
  back: 'workspace-invite-back',
  brand: 'workspace-invite-brand',
  brandMark: 'workspace-invite-brandMark',
  card: 'workspace-invite-card',
  cardHeader: 'workspace-invite-cardHeader',
  divider: 'workspace-invite-divider',
  downloadButton: 'workspace-invite-downloadButton',
  downloadIcon: 'workspace-invite-downloadIcon',
  downloadPrompt: 'workspace-invite-downloadPrompt',
  emailAction: 'workspace-invite-emailAction',
  eyebrow: 'workspace-invite-eyebrow',
  form: 'workspace-invite-form',
  googleMark: 'workspace-invite-googleMark',
  heading: 'workspace-invite-heading',
  inviterAvatar: 'workspace-invite-inviterAvatar',
  inviterBadge: 'workspace-invite-inviterBadge',
  joining: 'workspace-invite-joining',
  joiningSpinner: 'workspace-invite-joiningSpinner',
  joiningTrack: 'workspace-invite-joiningTrack',
  launching: 'workspace-invite-launching',
  page: 'workspace-invite-page',
  pendingHint: 'workspace-invite-pendingHint',
  primaryAction: 'workspace-invite-primaryAction',
  result: 'workspace-invite-result',
  resultIcon: 'workspace-invite-resultIcon',
  resultIconSuccess: 'workspace-invite-resultIconSuccess',
  retryButton: 'workspace-invite-retryButton',
  seatReceipt: 'workspace-invite-seatReceipt',
  securityNote: 'workspace-invite-securityNote',
  shell: 'workspace-invite-shell',
  socialAuth: 'workspace-invite-socialAuth',
  socialButton: 'workspace-invite-socialButton',
  workspaceCopy: 'workspace-invite-workspaceCopy',
  workspaceIdentity: 'workspace-invite-workspaceIdentity',
  workspaceMark: 'workspace-invite-workspaceMark',
} as const;

interface Props {
  scenario: Extract<DemoScenario, 'invite-editor'>;
  initiallySignedIn?: boolean;
}

export function WorkspaceInviteFlow({ scenario, initiallySignedIn = false }: Props) {
  const t = useT();
  const [stage, setStage] = useState<InviteStage>(initiallySignedIn ? 'confirm' : 'auth');
  const [emailLoginOpen, setEmailLoginOpen] = useState(false);
  const [email, setEmail] = useState('you@example.com');
  const [password, setPassword] = useState('');
  const [localLaunchState, setLocalLaunchState] = useState<LocalLaunchState>('idle');
  const role = getInviteRole(scenario, t);

  function completeWebSignIn() {
    setStage('confirm');
  }

  function confirmJoinTeam() {
    setStage('joining');
    window.setTimeout(() => {
      setStage('success');
      tryOpenLocalWorkspace();
    }, 720);
  }

  function tryOpenLocalWorkspace() {
    setLocalLaunchState('opening');
    window.setTimeout(() => setLocalLaunchState('download'), 1100);
  }

  return (
    <section className={styles.page} aria-label={t('demo.WorkspaceInviteFlow.tsx.page.ariaLabel')}>
      <div className={styles.ambient} aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className={styles.shell}>
        <header className={styles.brand}>
          <span>
            <span className={styles.brandMark} role="img" aria-label="Open Design" />
            <span>Open Design Web</span>
          </span>
        </header>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.workspaceIdentity}>
              <div className={styles.workspaceMark}>N</div>
              <div className={styles.inviterAvatar}>
                <img src="/team-avatars/a1.png" alt="" aria-hidden />
                <span className={styles.inviterBadge}>
                  <Icon name="send" size={11} />
                </span>
              </div>
            </div>
            <div className={styles.workspaceCopy}>
              <span>{t('demo.WorkspaceInviteFlow.tsx.inviteBadge')}</span>
              <strong>{t('demo.WorkspaceInviteFlow.tsx.inviteTitle')}</strong>
              <p>{t('demo.WorkspaceInviteFlow.tsx.roleLabel')}{role.label}</p>
            </div>
          </div>

          {stage === 'auth' ? (
            <>
              <div className={styles.heading}>
                <h1>{t('demo.WorkspaceInviteFlow.tsx.auth.heading')}</h1>
                <p>{t('demo.WorkspaceInviteFlow.tsx.auth.subheading')}</p>
              </div>

              <div className={styles.socialAuth}>
                <button type="button" className={styles.socialButton} onClick={completeWebSignIn}>
                  <span className={styles.googleMark}>G</span>
                  {t('demo.WorkspaceInviteFlow.tsx.auth.continueGoogle')}
                </button>
                <button type="button" className={styles.socialButton} onClick={completeWebSignIn}>
                  <Icon name="github-filled" size={19} />
                  {t('demo.WorkspaceInviteFlow.tsx.auth.continueGithub')}
                </button>
              </div>

              <div className={styles.divider}>
                <span>{t('demo.WorkspaceInviteFlow.tsx.auth.orEmail')}</span>
              </div>

              {emailLoginOpen ? (
                <form
                  className={styles.form}
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!email.trim() || !password.trim()) return;
                    completeWebSignIn();
                  }}
                >
                  <label>
                    <span>{t('demo.WorkspaceInviteFlow.tsx.form.emailLabel')}</span>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      autoFocus
                    />
                  </label>
                  <label>
                    <span>{t('demo.WorkspaceInviteFlow.tsx.form.passwordLabel')}</span>
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={t('demo.WorkspaceInviteFlow.tsx.form.passwordPlaceholder')}
                      autoComplete="current-password"
                    />
                  </label>
                  <Button
                    type="submit"
                    variant="primary"
                    className={styles.primaryAction}
                    disabled={!email.trim() || !password.trim()}
                  >
                    {t('demo.WorkspaceInviteFlow.tsx.form.continue')}
                    <Icon name="chevron-right" size={15} />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  className={styles.emailAction}
                  onClick={() => setEmailLoginOpen(true)}
                >
                  <Icon name="link" size={15} />
                  {t('demo.WorkspaceInviteFlow.tsx.form.useEmail')}
                </Button>
              )}
            </>
          ) : null}

          {stage === 'confirm' ? (
            <div className={styles.result}>
              <h1>{t('demo.WorkspaceInviteFlow.tsx.confirm.heading')}</h1>
              <p>{t('demo.WorkspaceInviteFlow.tsx.confirm.subheading')}</p>

              <Button
                variant="primary"
                className={styles.primaryAction}
                onClick={confirmJoinTeam}
              >
                {t('demo.WorkspaceInviteFlow.tsx.confirm.action')}
                <Icon name="external-link" size={15} />
              </Button>
            </div>
          ) : null}

          {stage === 'joining' ? (
            <div className={styles.joining} role="status" aria-live="polite">
              <span className={styles.joiningSpinner}>
                <Icon name="spinner" size={25} />
              </span>
              <h1>{t('demo.WorkspaceInviteFlow.tsx.joining.heading')}</h1>
              <p>{t('demo.WorkspaceInviteFlow.tsx.joining.subheading')}</p>
              <div className={styles.joiningTrack}>
                <span />
              </div>
            </div>
          ) : null}

          {stage === 'success' ? (
            <div className={styles.result}>
              <h1>{t('demo.WorkspaceInviteFlow.tsx.success.heading')}</h1>
              <p>{t('demo.WorkspaceInviteFlow.tsx.success.subheading')}</p>

              {localLaunchState === 'idle' ? (
                <Button
                  variant="primary"
                  className={styles.primaryAction}
                  onClick={tryOpenLocalWorkspace}
                >
                  {t('demo.WorkspaceInviteFlow.tsx.success.action')}
                  <Icon name="external-link" size={15} />
                </Button>
              ) : null}

              {localLaunchState === 'opening' ? (
                <div className={styles.launching} role="status">
                  <Icon name="spinner" size={17} />
                  {t('demo.WorkspaceInviteFlow.tsx.launching.opening')}
                </div>
              ) : null}

              {localLaunchState === 'download' || localLaunchState === 'downloaded' ? (
                <div className={styles.downloadPrompt}>
                  <span className={styles.downloadIcon}>
                    <Icon name="download" size={21} />
                  </span>
                  <div>
                    <strong>{t('demo.WorkspaceInviteFlow.tsx.download.title')}</strong>
                    <p>{t('demo.WorkspaceInviteFlow.tsx.download.description')}</p>
                  </div>
                  <Button
                    variant="primary"
                    className={styles.downloadButton}
                    onClick={() => setLocalLaunchState('downloaded')}
                  >
                    {localLaunchState === 'downloaded'
                      ? t('demo.WorkspaceInviteFlow.tsx.download.started')
                      : t('demo.WorkspaceInviteFlow.tsx.download.action')}
                  </Button>
                  <button
                    type="button"
                    className={styles.retryButton}
                    onClick={() => {
                      tryOpenLocalWorkspace();
                    }}
                  >
                    {t('demo.WorkspaceInviteFlow.tsx.download.retry')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
