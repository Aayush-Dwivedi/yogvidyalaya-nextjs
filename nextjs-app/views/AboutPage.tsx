import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const AboutPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="About Our Institute"
      title="Welcome to Kalptaru Yog Vidyalaya"
      description="Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses. We combine traditional yoga practices with physiotherapy expertise, making our approach both effective and safe for everyone."
      breadcrumbs={[{ label: 'About' }]}
      phaseNotice="Affiliated by Indian Yoga Association. Featuring authentic traditional yogic practices, expert qualified instructors, and a holistic focus on mind, body & spirit."
    />
  );
};

export default AboutPage;
