import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const NotFoundPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="404 &bull; Page Not Found"
      title="Path Unfound"
      description="The page or path you sought does not exist within our digital sanctuary."
      breadcrumbs={[{ label: 'Not Found' }]}
      phaseNotice="Please verify the URL or return to the institute homepage."
    />
  );
};

export default NotFoundPage;
