import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const FounderPage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="Founder &amp; Lead Instructor"
      title="Mrs. Shuchi Mohan"
      description="Physiotherapist &amp; Therapeutic Yoga Consultant. Combining traditional yoga practices with clinical physiotherapy expertise for safe, effective, and sustainable wellness."
      breadcrumbs={[{ label: 'About', href: '/about/institute' }, { label: 'Our Founder' }]}
      phaseNotice="My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care. Over time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications. I further expanded my practice during my professional tenure at Morarji Desai National Institute of Yoga (MDNIY), where I gained institutional exposure through yoga therapy sessions and wellness programs conducted for uniformed personnel, along with engagements associated with various government ministries. My work has also included invited wellness sessions and live programs in association with NCERT, as well as participation in national and international conferences and institutional events. I now carry this integrated approach of Physiotherapy and Yoga forward through my independent institute, Kalptaru Yog Vidyalaya. The photographs featured here reflect my professional and institutional experience."
    />
  );
};

export default FounderPage;
