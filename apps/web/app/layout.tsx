import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { I18nProvider } from '../src/i18n';
import { AnalyticsProvider } from '../src/analytics/provider';
import '@excalidraw/excalidraw/index.css';
import '../src/index.css';
import '../src/styles/home/index.css';

export const metadata: Metadata = {
  title: 'Artifact OS',
  icons: {
    // Theme-aware favicon:
    // - SVG uses prefers-color-scheme (ink / white)
    // - PNG+ICO pairs use media queries for browsers that ignore SVG color
    // - /favicon.ico remains the default light probe fallback
    icon: [
      { url: '/app-icon.svg?v=artifact-os-4', type: 'image/svg+xml' },
      {
        url: '/favicon-32x32.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-16x16.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/app-icon.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '512x512',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-32x32-dark.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-16x16-dark.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/app-icon-dark.png?v=artifact-os-4',
        type: 'image/png',
        sizes: '512x512',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/favicon.ico?v=artifact-os-4', sizes: 'any' },
      {
        url: '/favicon-dark.ico?v=artifact-os-4',
        sizes: 'any',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  // Light default; browsers with dark preference often ignore theme-color anyway.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4EFE6' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1915' },
  ],
};

/**
 * Inline script that runs before React hydrates to apply the saved theme
 * preference without a flash of unstyled content. It reads the same
 * localStorage key used by `state/config.ts` and sets `data-theme` on
 * `<html>` immediately — before any CSS or React paint.
 * Keep the accent variable mix ratios in sync with `accentVars()` in
 * `src/state/appearance.ts`; this script cannot import application modules.
 */
const themeInitScript = `(function(){try{var c=JSON.parse(localStorage.getItem('open-design:config')||'{}');var t=c.theme;if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);var a=typeof c.accentColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(c.accentColor.trim())?c.accentColor.trim().toLowerCase():'#c96442';var s=document.documentElement.style;s.setProperty('--accent',a);s.setProperty('--accent-strong','color-mix(in srgb, '+a+' 86%, var(--text-strong))');s.setProperty('--accent-soft','color-mix(in srgb, '+a+' 22%, var(--bg-panel))');s.setProperty('--accent-tint','color-mix(in srgb, '+a+' 12%, var(--bg-panel))');s.setProperty('--accent-hover','color-mix(in srgb, '+a+' 90%, var(--text-strong))');}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional theme-init inline script to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
