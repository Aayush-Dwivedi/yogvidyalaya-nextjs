import type { Metadata } from 'next';
import { LoginPage } from '@/views/LoginPage';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Kalptaruu Yoga Vidhyalaya account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginPage />;
}
