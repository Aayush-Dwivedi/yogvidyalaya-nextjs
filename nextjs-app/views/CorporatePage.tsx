import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const CorporatePage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Executive Well-Being"
      title="Corporate Yogic Wellness"
      description="Tailored workplace wellness programs, ergonomic posture alignment, and stress mitigation sessions for modern organizations."
      breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Corporate' }]}
    />
  );
};

export default CorporatePage;
