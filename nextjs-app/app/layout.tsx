import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Kalptaruu Yoga Vidhyalaya — Ancient Wisdom, Modern Journey',
    template: '%s | Kalptaruu Yoga Vidhyalaya',
  },
  description:
    'Kalptaruu Yoga Vidhyalaya offers authentic yoga courses, workshops, and residential programs rooted in ancient Indian tradition. Enroll today and begin your sadhana.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    siteName: 'Kalptaruu Yoga Vidhyalaya',
    type: 'website',
    locale: 'en_IN',
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
