import type { Metadata } from 'next';
import { DesignSystemShowcase } from '@/components/DesignSystemShowcase';

export const metadata: Metadata = {
  title: 'Design System Showcase',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <DesignSystemShowcase />;
}
