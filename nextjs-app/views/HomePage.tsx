'use client';

import React, { useEffect, useState } from 'react';
import {
  HeroSection,
  AboutSection,
  ProgramsSection,
  FeaturedWorkshopsSection,
  FeaturedCoursesSection,
  WhyYogaSection,
  GallerySection,
  VideosSection,
  FinalCtaSection,
} from '../sections';
import { CmsService } from '../services/cmsService';

export interface HomePageProps {
  initialHeroSlides?: any[];
}

export const HomePage: React.FC<HomePageProps> = ({ initialHeroSlides }) => {
  const [homeData, setHomeData] = useState<any>(() => {
    if (initialHeroSlides && initialHeroSlides.length > 0) {
      return { heroSlides: initialHeroSlides };
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kalptaru_cached_home_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.heroSlides && parsed.heroSlides.length > 0) {
            return parsed;
          }
        }
        const cachedSlides = localStorage.getItem('kalptaru_cached_hero_slides');
        if (cachedSlides) {
          const parsedSlides = JSON.parse(cachedSlides);
          if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
            return { heroSlides: parsedSlides };
          }
        }
      } catch {}
    }
    return null;
  });

  const loadHomeContent = async () => {
    try {
      const data = await CmsService.getHomeContent();
      if (data) {
        setHomeData(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kalptaru_cached_home_data', JSON.stringify(data));
          if (data.heroSlides) {
            localStorage.setItem('kalptaru_cached_hero_slides', JSON.stringify(data.heroSlides));
          }
        }
      }
    } catch (err) {
      console.warn('Could not load aggregated home data from CMS:', err);
    }
  };

  useEffect(() => {
    loadHomeContent();

    // Listen for live updates when admin clicks "Confirm Changes"
    const handleCmsUpdate = () => {
      loadHomeContent();
    };

    window.addEventListener('kalptaru-cms-updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#1A0719]">
      {/* 1. Immersive Full-Viewport Hero Slideshow */}
      <HeroSection slides={homeData?.heroSlides} />

      {/* 2. Editorial Asymmetric About Section */}
      <AboutSection />

      {/* 3. Explore Our Programs (4 Quadrants) */}
      <ProgramsSection />

      {/* 4. Featured Upcoming Workshops */}
      <FeaturedWorkshopsSection workshops={homeData?.featuredWorkshops} />

      {/* 5. Featured Certified Courses */}
      <FeaturedCoursesSection courses={homeData?.featuredCourses} />

      {/* 6. Why Yoga: Holistic Benefits & Scripture References */}
      <WhyYogaSection benefits={homeData?.benefits} />

      {/* 7. Editorial Asymmetric Gallery Composition */}
      <GallerySection highlights={homeData?.galleryHighlights} />

      {/* 8. YouTube Video Library & Masterclass Discourses */}
      <VideosSection videos={homeData?.featuredVideos} />

      {/* 9. Final Institutional Call to Action */}
      <FinalCtaSection cta={homeData?.homepageCta} />
    </div>
  );
};

export default HomePage;
