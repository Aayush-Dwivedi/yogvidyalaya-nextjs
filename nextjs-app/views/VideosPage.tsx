import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const VideosPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Wisdom & Discourses"
      title="Video Library & Lectures"
      description="Curated recordings of scriptural explanations, guided meditations, and teacher discussions for at-home inspiration."
      breadcrumbs={[{ label: 'Videos' }]}
    />
  );
};

export default VideosPage;
