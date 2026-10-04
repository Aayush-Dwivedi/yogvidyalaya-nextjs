import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const EventsPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Celebrations & Gatherings"
      title="Institute Events & Retreats"
      description="Documentation of International Day of Yoga commemorations, residential retreats, guru purnima celebrations, and symposiums."
      breadcrumbs={[{ label: 'Gallery', href: '/gallery' }, { label: 'Events' }]}
    />
  );
};

export default EventsPage;
