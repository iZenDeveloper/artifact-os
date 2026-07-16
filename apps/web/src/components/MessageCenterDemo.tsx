import { Button } from '@open-design/components';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useI18n } from '../i18n';
import {
  anonymousStartedAt,
  isAmrLoggedIn,
  markAccountMessageRead,
  markAllAccountMessagesRead,
  pullMessageCenter,
  readAnonymousMessages,
  readAnonymousReadIds,
  type MessageCenterFilter,
  type MessageCenterMessage,
  writeAnonymousState,
} from '../message-center-client';
import { Icon } from './Icon';
import styles from './MessageCenterDemo.module.css';

const FILTERS: Array<{ id: MessageCenterFilter; label: 'messageCenter.filterAll' | 'messageCenter.filterUnread' | 'messageCenter.filterRead' }> = [
  { id: 'all', label: 'messageCenter.filterAll' },
  { id: 'unread', label: 'messageCenter.filterUnread' },
  { id: 'read', label: 'messageCenter.filterRead' },
];

function unreadBadgeLabel(count: number): string {
  return count > 9 ? '9+' : String(count);
}

interface Props {
  onOpenNotificationSettings?: () => void;
}

export function MessageCenterDemo({ onOpenNotificationSettings }: Props) {
  const { locale, t } = useI18n();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<MessageCenterFilter>('all');
  const [messages, setMessages] = useState<MessageCenterMessage[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loggedIn, setLoggedIn] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const sync = useCallback(async () => {
    const account = await isAmrLoggedIn();
    const startedAt = anonymousStartedAt(window.localStorage);
    const pulled = await pullMessageCenter({ locale, loggedIn: account, startedAt });
    const localReadIds = account ? new Set<string>() : readAnonymousReadIds(window.localStorage);
    const merged = pulled.map((message) => ({
      ...message,
      readAt: message.readAt ?? (localReadIds.has(message.id) ? new Date().toISOString() : null),
    }));
    setLoggedIn(account);
    setReadIds(localReadIds);
    setMessages(merged);
    if (!account) writeAnonymousState(window.localStorage, merged, localReadIds);
    setSyncError(false);
  }, [locale]);

  useEffect(() => {
    const startedAt = anonymousStartedAt(window.localStorage);
    void startedAt;
    setMessages(readAnonymousMessages(window.localStorage));
    setReadIds(readAnonymousReadIds(window.localStorage));
    void sync().catch(() => setSyncError(true));
    const interval = window.setInterval(() => void sync().catch(() => setSyncError(true)), 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void sync().catch(() => setSyncError(true));
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [sync]);

  useEffect(() => {
    if (open) void sync().catch(() => setSyncError(true));
  }, [open, sync]);

  const unreadCount = messages.filter((message) => !message.readAt).length;
  const visibleMessages = useMemo(
    () => messages.filter((message) => filter === 'all' || (filter === 'read' ? Boolean(message.readAt) : !message.readAt)),
    [filter, messages],
  );

  const closePanel = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) closePanel();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const markRead = async (messageId: string) => {
    const message = messages.find((item) => item.id === messageId);
    if (!message || message.readAt) return;
    const readAt = new Date().toISOString();
    if (loggedIn) await markAccountMessageRead(messageId);
    const nextIds = new Set(readIds).add(messageId);
    const nextMessages = messages.map((item) => (item.id === messageId ? { ...item, readAt } : item));
    setReadIds(nextIds);
    setMessages(nextMessages);
    if (!loggedIn) writeAnonymousState(window.localStorage, nextMessages, nextIds);
  };

  const markAllRead = async () => {
    if (loggedIn) await markAllAccountMessagesRead();
    const readAt = new Date().toISOString();
    const nextIds = new Set(messages.map((message) => message.id));
    const nextMessages = messages.map((message) => ({ ...message, readAt: message.readAt ?? readAt }));
    setReadIds(nextIds);
    setMessages(nextMessages);
    if (!loggedIn) writeAnonymousState(window.localStorage, nextMessages, nextIds);
  };

  const openLabel = unreadCount > 0 ? `${t('messageCenter.openAria')} (${t('messageCenter.unreadCount', { count: unreadCount })})` : t('messageCenter.openAria');
  const emptyTitle = filter === 'unread' ? t('messageCenter.emptyUnreadTitle') : filter === 'read' ? t('messageCenter.emptyReadTitle') : t('messageCenter.emptyAllTitle');

  return <div className={styles.root}>
    <button ref={triggerRef} type="button" className={`settings-icon-btn od-tooltip ${styles.trigger}`} onClick={() => setOpen((value) => !value)} title={t('messageCenter.openAria')} data-tooltip={t('messageCenter.openAria')} data-tooltip-placement="bottom" aria-label={openLabel} aria-haspopup="dialog" aria-expanded={open} data-testid="message-center-trigger">
      <Icon name="bell" size={17} />{unreadCount > 0 ? <span className={styles.badge} aria-hidden>{unreadBadgeLabel(unreadCount)}</span> : null}
    </button>
    {open ? createPortal(<div className={styles.backdrop} data-testid="message-center-backdrop"><aside ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} data-testid="message-center-dialog">
      <header className={styles.header}><div className={styles.headerCopy}><h2 id={titleId}>{t('messageCenter.title')}</h2><p>{t('messageCenter.subtitle')}</p></div><button type="button" className={styles.close} onClick={closePanel} aria-label={t('messageCenter.close')}><Icon name="close" size={15}/></button></header>
      <div className={styles.controls}><div className={styles.filters} role="group" aria-label={t('messageCenter.title')}>{FILTERS.map((item) => <button key={item.id} type="button" className={`${styles.filter}${filter === item.id ? ` ${styles.filterActive}` : ''}`} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{t(item.label)}{item.id === 'unread' && unreadCount > 0 ? <span className={styles.filterBadge} aria-hidden>{unreadBadgeLabel(unreadCount)}</span> : null}</button>)}</div><button type="button" className={styles.markAll} onClick={() => void markAllRead().catch(() => setSyncError(true))} disabled={unreadCount === 0}>{t('messageCenter.markAllRead')}</button></div>
      <div className={styles.list} aria-live="polite">{syncError && messages.length === 0 ? <div className={styles.empty}><Icon name="bell" size={20}/><strong>{t('messageCenter.emptyAllTitle')}</strong><p>{t('messageCenter.emptyBody')}</p></div> : visibleMessages.length === 0 ? <div className={styles.empty}><Icon name="bell" size={20}/><strong>{emptyTitle}</strong><p>{t('messageCenter.emptyBody')}</p></div> : visibleMessages.map((message) => <MessageItem key={message.id} message={message} onRead={markRead}/>)}</div>
      <footer className={styles.footer}><p>{t('messageCenter.desktopSettingsHint')}</p>{onOpenNotificationSettings ? <Button variant="ghost" onClick={() => { closePanel(); onOpenNotificationSettings(); }}>{t('messageCenter.desktopSettings')}</Button> : null}</footer>
    </aside></div>, document.body) : null}
  </div>;
}

function MessageItem({ message, onRead }: { message: MessageCenterMessage; onRead: (id: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false);
  const formatted = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(message.publishedAt));
  return <article className={`${styles.item}${message.readAt ? '' : ` ${styles.itemUnread}`}${expanded ? ` ${styles.itemExpanded}` : ''}`}>
    <button type="button" className={styles.itemSummary} aria-expanded={expanded} onClick={() => { setExpanded((value) => !value); void onRead(message.id); }}><span className={styles.itemMeta}><span>{message.typeName}</span><time dateTime={message.publishedAt}>{formatted}</time></span><strong>{message.title}</strong><span className={styles.bodyPreview}>{message.body}</span></button>
    {expanded && message.ctaLabel && message.ctaUrl ? <div className={styles.itemActions}><button type="button" className={styles.primaryAction} onClick={() => window.open(message.ctaUrl!, '_blank', 'noopener,noreferrer')}>{message.ctaLabel}</button></div> : null}
  </article>;
}
