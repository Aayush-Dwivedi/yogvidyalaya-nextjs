import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const GalleryPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Visual Chronicles"
      title="Photo Gallery & Moments"
      description="Glimpses into student sadhana, serene campus grounds, traditional rituals, and celebrations at Kalptaru Yog Vidyalaya."
      breadcrumbs={[{ label: 'Gallery' }]}
    />
  );
};

export default GalleryPage;
