import { HeroSlide } from '../models/HeroSlide';
import { Course } from '../models/Course';
import { Workshop } from '../models/Workshop';
import { Benefit } from '../models/Benefit';
import { GalleryImage } from '../models/GalleryImage';
import { Video } from '../models/Video';
import { Testimonial } from '../models/Testimonial';
import { InstituteService } from './institute.service';

export class HomeService {
  /**
   * Aggregates all public homepage content in a single high-performance payload
   */
  static async getHomeContent() {
    const [
      institute,
      heroSlides,
      featuredCourses,
      featuredWorkshops,
      benefits,
      galleryHighlights,
      featuredVideos,
      testimonials,
    ] = await Promise.all([
      InstituteService.getInstitute(),
      HeroSlide.find({ active: true }).sort({ order: 1 }),
      Course.find({ status: 'published', featured: true })
        .populate('instructor.founderRef')
        .sort({ order: 1, createdAt: -1 })
        .limit(6),
      Workshop.find({ status: 'published', featured: true })
        .populate('instructor.founderRef')
        .sort('date')
        .limit(6),
      Benefit.find({ status: 'published' }).sort({ order: 1 }).limit(8),
      GalleryImage.find({ status: 'published', featured: true })
        .populate('category', 'name slug')
        .sort({ order: 1 })
        .limit(8),
      Video.find({ status: 'published', featured: true })
        .sort({ order: 1 })
        .limit(4),
      Testimonial.find({ status: 'published' })
        .sort({ order: 1, createdAt: -1 })
        .limit(10),
    ]);

    // Fallbacks if none marked featured yet
    let finalCourses = featuredCourses;
    if (finalCourses.length === 0) {
      finalCourses = await Course.find({ status: 'published' })
        .populate('instructor.founderRef')
        .sort({ order: 1, createdAt: -1 })
        .limit(4);
    }

    let finalWorkshops = featuredWorkshops;
    if (finalWorkshops.length === 0) {
      finalWorkshops = await Workshop.find({ status: 'published' })
        .populate('instructor.founderRef')
        .sort('date')
        .limit(3);
    }

    return {
      institute: {
        name: institute.name,
        tagline: institute.tagline,
        description: institute.description || institute.tagline,
        mission: institute.mission,
        vision: institute.vision,
        philosophy: institute.philosophy,
        stats: institute.stats,
        contact: institute.contact,
        socialLinks: institute.socialLinks,
        branding: institute.branding,
        images: institute.images,
        homepageCta: institute.homepageCta,
      },
      heroSlides,
      featuredCourses: finalCourses,
      featuredWorkshops: finalWorkshops,
      benefits,
      galleryHighlights,
      featuredVideos,
      testimonials,
      homepageCta: institute.homepageCta,
    };
  }
}
