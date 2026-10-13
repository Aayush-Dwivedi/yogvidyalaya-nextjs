import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/layout/StudentLayout';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <StudentLayout>{children}</StudentLayout>
    </ProtectedRoute>
  );
}
