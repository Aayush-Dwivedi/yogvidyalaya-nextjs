/**
 * Shared Content Domain Types & Interfaces
 */

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ProgramType = 'course' | 'workshop' | 'corporate' | 'membership';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export type DeliveryMode = 'residential' | 'in-person' | 'online' | 'hybrid';

export type CorporateFormat = 'on-site' | 'virtual' | 'retreat' | 'hybrid';

export type CorporatePricingModel = 'custom-quote' | 'fixed-package' | 'per-seat';

export type BillingCycle = 'monthly' | 'quarterly' | 'half-yearly' | 'annual';

export type BenefitCategory = 'physical' | 'mental' | 'spiritual' | 'general';

/**
 * Supabase Storage asset metadata
 */
export interface IStorageImage {
  url: string;
  path: string;
  bucket?: string;
  size?: number;
  mimeType?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Standard SEO Metadata for CMS-driven pages and entities
 */
export interface ISEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

/**
 * Price structure with currency support
 */
export interface IPrice {
  amount: number;
  currency: string;
  isFree?: boolean;
  displayPrice?: string;
}

/**
 * Common pagination and filter query params
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: ContentStatus | 'all';
  featured?: boolean;
}

/**
 * Standard Paginated Response Meta
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
