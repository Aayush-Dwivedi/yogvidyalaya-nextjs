export interface StorageImage {
  url: string;
  path: string;
  bucket?: string;
  size?: number;
  mimeType?: string;
  alt?: string;
}

export interface CmsHeroSlide {
  _id?: string;
  id?: string;
  image: StorageImage;
  heading: string;
  subheading?: string;
  description: string;
  quote?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsHomepageCta {
  badge?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface CmsInstitute {
  _id?: string;
  id?: string;
  name: string;
  tagline: string;
  description?: string;
  eyebrow?: string;
  affiliationText?: string;
  mission: string;
  vision: string;
  philosophy: string;
  history?: string;
  establishedYear?: number;
  pillars?: Array<{
    title: string;
    subtitle?: string;
    description: string;
  }>;
  branding?: {
    logo?: StorageImage;
    favicon?: string;
    coverImage?: StorageImage;
  };
  images?: StorageImage[];
  contact: {
    email: string;
    phone: string;
    alternatePhone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      mapUrl?: string;
    };
    hours?: string;
  };
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  homepageCta?: CmsHomepageCta;
  stats?: Array<{
    label: string;
    value: string;
    detail?: string;
    order?: number;
  }>;
}

export interface CmsFounder {
  _id?: string;
  id?: string;
  name: string;
  title: string;
  designation?: string;
  slug?: string;
  bio: string;
  biography?: string;
  shortBio?: string;
  quote?: string;
  message?: string;
  image: StorageImage;
  qualifications: string[];
  achievements?: string[];
  specializations: string[];
  lineage?: string;
  experienceYears?: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  order: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

export interface CmsBenefit {
  _id?: string;
  id?: string;
  title: string;
  sanskritTerm?: string;
  description: string;
  scriptureRef?: string;
  icon?: string;
  category: 'physical' | 'mental' | 'spiritual' | 'general';
  order: number;
  status: 'draft' | 'published' | 'archived';
  active: boolean;
}

export interface CmsGalleryCategory {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CmsGalleryImage {
  _id?: string;
  id?: string;
  image: StorageImage;
  title: string;
  description?: string;
  category?: string | { _id: string; name: string; slug: string };
  categorySlug?: string;
  event?: string;
  featured: boolean;
  order: number;
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
}

export interface CmsVideo {
  _id?: string;
  id?: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  title: string;
  description?: string;
  thumbnail?: StorageImage;
  category: string;
  speaker?: string;
  duration?: string;
  featured: boolean;
  order: number;
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
}

export interface CmsCurriculumModule {
  moduleNumber: number;
  title: string;
  description?: string;
  topics: string[];
}

export interface CmsCourse {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: StorageImage;
  image?: StorageImage;
  gallery?: StorageImage[];
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels' | string;
  mode: 'residential' | 'in-person' | 'online' | 'hybrid' | string;
  price?: {
    amount: number;
    currency: string;
    isFree?: boolean;
    displayPrice?: string;
  };
  features?: string[];
  benefits?: string[];
  curriculum?: CmsCurriculumModule[];
  instructor?: {
    name: string;
    title?: string;
    bio?: string;
    image?: StorageImage;
    founderRef?: string;
  };
  certification?: string;
  eligibility?: string;
  schedule?: string;
  capacity?: {
    total: number;
    enrolled?: number;
  };
  order?: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsWorkshop {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: StorageImage;
  image?: StorageImage;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  duration: string;
  instructor?: {
    name: string;
    title?: string;
    bio?: string;
    image?: StorageImage;
    founderRef?: string;
  };
  location?: {
    venue: string;
    address?: string;
    city?: string;
    mapUrl?: string;
    onlineLink?: string;
  };
  mode: 'in-person' | 'residential' | 'online' | 'hybrid' | string;
  capacity?: {
    total: number;
    booked?: number;
  };
  price?: {
    amount: number;
    currency: string;
    isFree?: boolean;
    displayPrice?: string;
  };
  registrationDeadline?: string;
  prerequisites?: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsMembershipBatch {
  name: string;
  timing: string;
  days: string;
}

export interface CmsMembershipPrice {
  amount: number;
  currency: string;
  discountPercentage?: number;
  originalAmount?: number;
}

export interface CmsMembershipPlan {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  billingCycle: 'monthly' | 'quarterly' | 'half-yearly' | 'annual';
  price: CmsMembershipPrice;
  description: string;
  batches: CmsMembershipBatch[];
  features: string[];
  popular?: boolean;
  order?: number;
  status: 'draft' | 'published' | 'archived';
  termsAndConditions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

