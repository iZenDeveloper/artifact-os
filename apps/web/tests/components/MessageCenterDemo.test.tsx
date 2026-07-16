// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MessageCenterDemo } from '../../src/components/MessageCenterDemo';
import { I18nProvider } from '../../src/i18n';

const messages = [
  { id: 'release', audienceType: 'global', typeName: 'Product update', title: 'Open Design 0.14 is available', body: 'The new release is ready.', ctaLabel: 'View update', ctaUrl: 'https://open-design.ai/update', publishedAt: '2026-07-16T12:00:00.000Z', readAt: null },
  { id: 'benefit', audienceType: 'targeted', typeName: 'Benefit', title: 'Credits added', body: 'Your credits are ready.', ctaLabel: null, ctaUrl: null, publishedAt: '2026-07-15T12:00:00.000Z', readAt: '2026-07-16T01:00:00.000Z' },
];

function mockFetch(loggedIn = false) {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/status')) return Response.json({ loggedIn });
    if (url.includes('/messages?')) return Response.json({ messages, nextCursor: null, unreadCount: 1 });
    if (url.includes('/read')) return Response.json({ read: true, markedCount: 1 });
    return new Response(null, { status: 404 });
  }));
}

function renderMessageCenter() {
  const onOpenNotificationSettings = vi.fn();
  const result = render(<I18nProvider initial="en"><MessageCenterDemo onOpenNotificationSettings={onOpenNotificationSettings}/></I18nProvider>);
  return { ...result, onOpenNotificationSettings };
}

async function openCenter() {
  await waitFor(() => expect(screen.getByLabelText(/Open message center \(1 unread\)/)).toBeTruthy());
  fireEvent.click(screen.getByTestId('message-center-trigger'));
  return screen.getByTestId('message-center-dialog');
}

beforeEach(() => {
  localStorage.clear();
  mockFetch();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('MessageCenterDemo', () => {
  it('starts a durable anonymous window and renders API messages', async () => {
    renderMessageCenter();
    const dialog = await openCenter();
    expect(within(dialog).getByText('Open Design 0.14 is available')).toBeTruthy();
    expect(localStorage.getItem('open-design.message-center.anonymous-started-at.v1')).toBeTruthy();
  });

  it('keeps anonymous read state locally and restores it', async () => {
    renderMessageCenter();
    await openCenter();
    fireEvent.click(screen.getByRole('button', { name: /Open Design 0\.14 is available/ }));
    await waitFor(() => expect(screen.queryByLabelText(/unread/)).toBeNull());
    expect(localStorage.getItem('open-design.message-center.anonymous-read-ids.v1')).toContain('release');
  });

  it('uses account read endpoints when logged in', async () => {
    mockFetch(true);
    renderMessageCenter();
    await openCenter();
    fireEvent.click(screen.getByRole('button', { name: /Open Design 0\.14 is available/ }));
    await waitFor(() => expect(vi.mocked(fetch).mock.calls.some(([url, init]) => String(url).includes('/release/read') && init?.method === 'POST')).toBe(true));
  });

  it('filters messages and marks all read', async () => {
    renderMessageCenter();
    await openCenter();
    fireEvent.click(screen.getByRole('button', { name: 'Unread' }));
    expect(screen.getByText('Open Design 0.14 is available')).toBeTruthy();
    expect(screen.queryByText('Credits added')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Mark all read' }));
    await waitFor(() => expect(screen.getByText('All caught up')).toBeTruthy());
  });

  it('opens CTA URLs with the existing external-link behavior', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderMessageCenter();
    await openCenter();
    fireEvent.click(screen.getByRole('button', { name: /Open Design 0\.14 is available/ }));
    fireEvent.click(screen.getByRole('button', { name: 'View update' }));
    expect(open).toHaveBeenCalledWith('https://open-design.ai/update', '_blank', 'noopener,noreferrer');
  });

  it('closes with Escape and restores trigger focus', async () => {
    renderMessageCenter();
    const trigger = screen.getByTestId('message-center-trigger');
    await openCenter();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('message-center-dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
