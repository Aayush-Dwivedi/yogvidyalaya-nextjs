/**
 * Structured types for Homepage Entities
 * Matches backend Mongoose model schemas for future API integration.
 */

export interface HeroSlide {
  id: string;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  quote?: string;
}

export interface FeaturedWorkshop {
  id: string;
  title: string;
  slug: string;
  image: string;
  date: string;
  duration: string;
  mode: string;
  level: string;
  price: string;
  shortDescription: string;
  instructor: string;
}

export interface FeaturedCourse {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  mode: string;
  price: string;
  level: string;
  shortDescription: string;
  curriculumHighlights: string[];
  certification: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  sanskritTerm: string;
  description: string;
  scriptureRef: string;
}

export interface GalleryHighlight {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
}

export interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
}
