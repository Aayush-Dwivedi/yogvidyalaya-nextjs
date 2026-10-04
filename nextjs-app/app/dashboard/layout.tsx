'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/layout/StudentLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <StudentLayout>{children}</StudentLayout>
    </ProtectedRoute>
  );
}
