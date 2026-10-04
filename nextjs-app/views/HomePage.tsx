import React from 'react';
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

export const HomePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Immersive Full-Viewport Hero Slideshow */}
      <HeroSection />

      {/* 2. Editorial Asymmetric About Section */}
      <AboutSection />

      {/* 3. Explore Our Programs (4 Quadrants) */}
      <ProgramsSection />

      {/* 4. Featured Upcoming Workshops */}
      <FeaturedWorkshopsSection />

      {/* 5. Featured Certified Courses */}
      <FeaturedCoursesSection />

      {/* 6. Why Yoga: Holistic Benefits & Scripture References */}
      <WhyYogaSection />

      {/* 7. Editorial Asymmetric Gallery Composition */}
      <GallerySection />

      {/* 8. YouTube Video Library & Masterclass Discourses */}
      <VideosSection />

      {/* 9. Final Institutional Call to Action */}
      <FinalCtaSection />
    </div>
  );
};

export default HomePage;
