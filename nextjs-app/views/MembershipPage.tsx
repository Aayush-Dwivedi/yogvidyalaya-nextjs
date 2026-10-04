import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const MembershipPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Continuous Sadhana"
      title="Institute Membership"
      description="Daily and monthly memberships offering regular batch attendance, library access, and community satsangs at Kalptaru Yog Vidyalaya."
      breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Membership' }]}
    />
  );
};

export default MembershipPage;
