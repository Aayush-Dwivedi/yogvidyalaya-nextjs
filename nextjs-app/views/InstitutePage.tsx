import React from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';

export const InstitutePage: React.FC = () => {
  return (
    <PagePlaceholder
      eyebrow="About Our Institute"
      title="Kalptaru Yog Vidyalaya"
      description="Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses. We combine traditional yoga practices with physiotherapy expertise, making our approach both effective and safe for everyone."
      breadcrumbs={[{ label: 'About', href: '/about' }, { label: 'Our Institute' }]}
      phaseNotice="Affiliated by Indian Yoga Association. Located at N114 Piyush Heights, Sector 89, Faridabad – 121002. Contact: 09818047984 | shuchimohan@kalptaruyogvidyalaya.com"
    />
  );
};

export default InstitutePage;
