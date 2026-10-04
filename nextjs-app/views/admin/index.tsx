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
import { AdminBookingsPage } from './AdminBookingsPage';

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
  AdminBookingsPage,
};

// Content Sub-Modules
export const AdminContentHomepage: React.FC = () => <AdminHomepageCMS />;
export const AdminContentInstitute: React.FC = () => <AdminInstituteCMS />;
export const AdminContentFounder: React.FC = () => <AdminFounderCMS />;
export const AdminContentBenefits: React.FC = () => <AdminBenefitsCMS />;

// Programs Sub-Modules
export const AdminProgramsCourses: React.FC = () => <AdminCoursesPage />;
export const AdminProgramsWorkshops: React.FC = () => <AdminWorkshopsPage />;

export const AdminProgramsCorporate: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Corporate Yogic Wellness"
    category="Programs"
    description="Manage corporate employee wellness packages, on-site shala retreats, and executive packages."
    sampleColumns={['Program Package', 'Target Audience', 'Format', 'Deliverables', 'Status']}
    sampleCount={3}
  />
);

export const AdminProgramsMembership: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Membership Plans & Shala Passes"
    category="Programs"
    description="Configure daily sadhana shala tiers, billing cycles, batch schedules, and member privileges."
    sampleColumns={['Plan Name', 'Billing Cycle', 'Price', 'Batch Timings', 'Active Members', 'Status']}
    sampleCount={3}
  />
);

// Media Sub-Modules
export const AdminMediaGallery: React.FC = () => <AdminGalleryCMS />;
export const AdminMediaVideos: React.FC = () => <AdminVideosCMS />;

// Core Modules
export const AdminUsersPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="User Accounts & Access Permissions"
    category="Access Control"
    description="Manage student registrations, active shala passes, acharya staff accounts, and role permissions."
    sampleColumns={['Full Name', 'Email Address', 'Phone', 'Role', 'Status', 'Last Active']}
    sampleCount={142}
  />
);

export const AdminOrdersPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Orders & Payment Transactions"
    category="Finance"
    description="Financial transaction ledger, course enrollment receipts, membership dues, and tax invoices."
    sampleColumns={['Invoice #', 'Student', 'Item Purchased', 'Payment Method', 'Amount', 'Status']}
    sampleCount={94}
  />
);

export const AdminEnquiriesPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="Prospective Sadhaka Enquiries"
    category="Communications"
    description="Review incoming student applications, course questions, corporate proposals, and general inquiries."
    sampleColumns={['Sender Name', 'Contact Info', 'Program of Interest', 'Received Date', 'Status']}
    sampleCount={12}
  />
);

export const AdminSettingsPage: React.FC = () => (
  <AdminModulePlaceholder
    moduleName="System & Platform Settings"
    category="Configuration"
    description="Configure administrative notifications, Supabase Storage bucket quotas, security policies, and backups."
    sampleColumns={['Config Key', 'Category', 'Current Setting', 'Last Modified By', 'Status']}
    sampleCount={9}
  />
);
