import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const EnquiryPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Admissions Guidance"
      title="Course & Program Enquiry"
      description="Detailed consultation regarding curriculum eligibility, batch timings, residential accommodations, and fee structures."
      breadcrumbs={[{ label: 'Contact', href: '/contact' }, { label: 'Course Enquiry' }]}
    />
  );
};

export default EnquiryPage;
