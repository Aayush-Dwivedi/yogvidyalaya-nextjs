import type { Metadata } from 'next';
import './globals.css';
import { getMetadataBase } from '@/lib/seo/site-url';

export const metadata: Metadata = {
  title: {
    default: 'Kalptaruu Yoga Vidhyalaya — Ancient Wisdom, Modern Journey',
    template: '%s | Kalptaruu Yoga Vidhyalaya',
  },
  description:
    'Kalptaruu Yoga Vidhyalaya offers authentic yoga courses, workshops, and residential programs rooted in ancient Indian tradition. Enroll today and begin your sadhana.',
  metadataBase: getMetadataBase(),
  openGraph: {
    siteName: 'Kalptaruu Yoga Vidhyalaya',
    type: 'website',
    locale: 'en_IN',
  },
  icons: {
    icon: [
      { url: '/logo.webp', type: 'image/webp' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.webp',
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

import { Providers } from '@/components/Providers';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-canvas text-ink-charcoal min-h-screen flex flex-col">
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
