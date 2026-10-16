import React from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminModulePlaceholder } from './AdminModulePlaceholder';
import { AdminHomepageCMS } from './AdminHomepageCMS';
import { AdminInstituteCMS } from './AdminInstituteCMS';
import { AdminFounderCMS } from './AdminFounderCMS';
import { AdminBenefitsCMS } from './AdminBenefitsCMS';
import { AdminGalleryCMS } from './AdminGalleryCMS';
import { AdminVideosCMS } from './AdminVideosCMS';
import { AdminCoursesPage } from './AdminCoursesPage';
import { AdminWorkshopsPage } from './AdminWorkshopsPage';
import { AdminTrainersPage } from './AdminTrainersPage';
import { AdminBookingsPage } from './AdminBookingsPage';
import { AdminMembershipPage } from './AdminMembershipPage';
import { AdminCorporatePage } from './AdminCorporatePage';
import { AdminTestimonialsCMS } from './AdminTestimonialsCMS';
import { AdminContactCMS } from './AdminContactCMS';
import { AdminEnquiriesPage } from './AdminEnquiriesPage';

export {
  AdminDashboardPage,
  AdminModulePlaceholder,
  AdminHomepageCMS,
  AdminInstituteCMS,
  AdminFounderCMS,
  AdminBenefitsCMS,
  AdminGalleryCMS,
  AdminVideosCMS,
  AdminCoursesPage,
  AdminWorkshopsPage,
  AdminTrainersPage,
  AdminBookingsPage,
  AdminMembershipPage,
  AdminCorporatePage,
  AdminTestimonialsCMS,
  AdminContactCMS,
  AdminEnquiriesPage,
};

// Content Sub-Modules
export const AdminContentHomepage: React.FC = () => <AdminHomepageCMS />;
export const AdminContentInstitute: React.FC = () => <AdminInstituteCMS />;
export const AdminContentContact: React.FC = () => <AdminContactCMS />;
export const AdminContentFounder: React.FC = () => <AdminFounderCMS />;
export const AdminContentBenefits: React.FC = () => <AdminBenefitsCMS />;
export const AdminContentTestimonials: React.FC = () => <AdminTestimonialsCMS />;

// Programs Sub-Modules
export const AdminProgramsCourses: React.FC = () => <AdminCoursesPage />;
export const AdminProgramsWorkshops: React.FC = () => <AdminWorkshopsPage />;
export const AdminProgramsTrainers: React.FC = () => <AdminTrainersPage />;
export const AdminProgramsCorporate: React.FC = () => <AdminCorporatePage />;
export const AdminProgramsMembership: React.FC = () => <AdminMembershipPage />;

// Media Sub-Modules
export const AdminMediaGallery: React.FC = () => <AdminGalleryCMS />;
export const AdminMediaVideos: React.FC = () => <AdminVideosCMS />;

// Core Modules
export const AdminUsersPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Students"
    category="Students"
    description="View and manage enrolled students and student profiles."
    sampleColumns={['Full Name', 'Email Address', 'Phone', 'Status', 'Joined']}
    sampleCount={9}
  />
);

export const AdminOrdersPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Orders & Receipts"
    category="Finance"
    description="Receipts, course enrollments, and transactions."
    sampleColumns={['Receipt #', 'Student', 'Item', 'Amount', 'Status']}
    sampleCount={4}
  />
);


export const AdminSettingsPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Settings"
    category="Configuration"
    description="Configure administrative notifications, preferences, and security policies."
    sampleColumns={['Setting', 'Category', 'Current Value', 'Last Updated', 'Status']}
    sampleCount={5}
  />
);
