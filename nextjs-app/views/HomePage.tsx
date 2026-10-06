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

export const HomePage: React.FC = () => {
  const [homeData, setHomeData] = useState<any>(null);

  const loadHomeContent = async () => {
    try {
      const data = await CmsService.getHomeContent();
      if (data) {
        setHomeData(data);
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
    <div className="w-full flex flex-col">
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
