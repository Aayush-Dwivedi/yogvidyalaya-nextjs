import React from 'react';
import { InstitutePage } from './InstitutePage';

export interface AboutPageProps {
  initialData?: any;
}

export const AboutPage: React.FC<AboutPageProps> = ({ initialData }) => {
  return <InstitutePage initialData={initialData} />;
};

export default AboutPage;
