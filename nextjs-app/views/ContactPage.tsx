import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const ContactPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Direct Communion"
      title="Get in Touch"
      description="Connect directly with our administration team for visit appointments, guidance on courses, or general enquiries."
      breadcrumbs={[{ label: 'Contact' }]}
    />
  );
};

export default ContactPage;
