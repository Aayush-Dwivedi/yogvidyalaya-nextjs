import { apiClient } from '@/lib/api/axios';
import { ApiResponse } from '../types';
import {
  CmsHeroSlide,
  CmsInstitute,
  CmsFounder,
  CmsBenefit,
  CmsGalleryCategory,
  CmsGalleryImage,
  CmsVideo,
  CmsHomepageCta,
  CmsCourse,
  CmsWorkshop,
} from '../types/cms';

export class CmsService {
  // ==========================================
  // HERO SLIDES
  // ==========================================

  static async getHeroSlides(activeOnly: boolean = false): Promise<CmsHeroSlide[]> {
    const res = (await apiClient.get('/hero-slides', {
      params: { activeOnly: activeOnly ? 'true' : 'false' },
    })) as unknown as ApiResponse<CmsHeroSlide[]>;
    return res.data;
  }

  static async createHeroSlide(data: Partial<CmsHeroSlide>): Promise<CmsHeroSlide> {
    const res = (await apiClient.post('/hero-slides', data)) as unknown as ApiResponse<CmsHeroSlide>;
    return res.data;
  }

  static async updateHeroSlide(id: string, data: Partial<CmsHeroSlide>): Promise<CmsHeroSlide> {
    const res = (await apiClient.patch(`/hero-slides/${id}`, data)) as unknown as ApiResponse<CmsHeroSlide>;
    return res.data;
  }

  static async reorderHeroSlides(slides: { id: string; order: number }[]): Promise<void> {
    await apiClient.patch('/hero-slides/reorder', { slides });
  }

  static async deleteHeroSlide(id: string): Promise<void> {
    await apiClient.delete(`/hero-slides/${id}`);
  }

  // ==========================================
  // HOMEPAGE CTA & AGGREGATE
  // ==========================================

  static async getHomeContent(): Promise<any> {
    const res = (await apiClient.get('/home')) as unknown as ApiResponse<any>;
    return res.data;
  }

  static async getHomepageCta(): Promise<CmsHomepageCta> {
    const res = (await apiClient.get('/home')) as unknown as ApiResponse<any>;
    return res.data?.homepageCta || res.data?.institute?.homepageCta || {};
  }

  static async updateHomepageCta(cta: CmsHomepageCta): Promise<CmsHomepageCta> {
    const res = (await apiClient.put('/home/cta', cta)) as unknown as ApiResponse<CmsHomepageCta>;
    return res.data;
  }

  static async confirmAllChanges(): Promise<any> {
    const res = (await apiClient.post('/admin/revalidate')) as unknown as ApiResponse<any>;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalptaru_last_sync', Date.now().toString());
      window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
    }
    return res.data;
  }

  // ==========================================
  // COURSES (CRUD, PUBLISH, FEATURE, REORDER)
  // ==========================================

  static async getCourses(status: string = 'all', query?: Record<string, any>): Promise<CmsCourse[]> {
    const res = (await apiClient.get('/courses', {
      params: { status, limit: 50, ...query },
    })) as unknown as ApiResponse<CmsCourse[]>;
    return res.data;
  }

  static async getCourseByIdOrSlug(idOrSlug: string): Promise<CmsCourse> {
    const res = (await apiClient.get(`/courses/${idOrSlug}`)) as unknown as ApiResponse<CmsCourse>;
    return res.data;
  }

  static async createCourse(data: Partial<CmsCourse>): Promise<CmsCourse> {
    const res = (await apiClient.post('/courses', data)) as unknown as ApiResponse<CmsCourse>;
    return res.data;
  }

  static async updateCourse(id: string, data: Partial<CmsCourse>): Promise<CmsCourse> {
    const res = (await apiClient.patch(`/courses/${id}`, data)) as unknown as ApiResponse<CmsCourse>;
    return res.data;
  }

  static async toggleCourseFeatured(id: string, featured: boolean): Promise<CmsCourse> {
    const res = (await apiClient.patch(`/courses/${id}`, { featured })) as unknown as ApiResponse<CmsCourse>;
    return res.data;
  }

  static async toggleCourseStatus(id: string, status: 'published' | 'draft' | 'archived'): Promise<CmsCourse> {
    const res = (await apiClient.patch(`/courses/${id}`, { status })) as unknown as ApiResponse<CmsCourse>;
    return res.data;
  }

  static async reorderCourses(courseIds: string[]): Promise<void> {
    await apiClient.patch('/courses/reorder', { courseIds });
  }

  static async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  }

  // ==========================================
  // WORKSHOPS (CRUD, PUBLISH, FEATURE)
  // ==========================================

  static async getWorkshops(status: string = 'all', query?: Record<string, any>): Promise<CmsWorkshop[]> {
    const res = (await apiClient.get('/workshops', {
      params: { status, limit: 50, ...query },
    })) as unknown as ApiResponse<CmsWorkshop[]>;
    return res.data;
  }

  static async getWorkshopByIdOrSlug(idOrSlug: string): Promise<CmsWorkshop> {
    const res = (await apiClient.get(`/workshops/${idOrSlug}`)) as unknown as ApiResponse<CmsWorkshop>;
    return res.data;
  }

  static async createWorkshop(data: Partial<CmsWorkshop>): Promise<CmsWorkshop> {
    const res = (await apiClient.post('/workshops', data)) as unknown as ApiResponse<CmsWorkshop>;
    return res.data;
  }

  static async updateWorkshop(id: string, data: Partial<CmsWorkshop>): Promise<CmsWorkshop> {
    const res = (await apiClient.patch(`/workshops/${id}`, data)) as unknown as ApiResponse<CmsWorkshop>;
    return res.data;
  }

  static async toggleWorkshopFeatured(id: string, featured: boolean): Promise<CmsWorkshop> {
    const res = (await apiClient.patch(`/workshops/${id}`, { featured })) as unknown as ApiResponse<CmsWorkshop>;
    return res.data;
  }

  static async toggleWorkshopStatus(id: string, status: 'published' | 'draft' | 'archived'): Promise<CmsWorkshop> {
    const res = (await apiClient.patch(`/workshops/${id}`, { status })) as unknown as ApiResponse<CmsWorkshop>;
    return res.data;
  }

  static async deleteWorkshop(id: string): Promise<void> {
    await apiClient.delete(`/workshops/${id}`);
  }

  // ==========================================
  // INSTITUTE
  // ==========================================

  static async getInstitute(): Promise<CmsInstitute> {
    const res = (await apiClient.get('/institute')) as unknown as ApiResponse<CmsInstitute>;
    return res.data;
  }

  static async updateInstitute(data: Partial<CmsInstitute>): Promise<CmsInstitute> {
    const res = (await apiClient.put('/institute', data)) as unknown as ApiResponse<CmsInstitute>;
    return res.data;
  }

  // ==========================================
  // FOUNDER
  // ==========================================

  static async getFounders(status: string = 'all'): Promise<CmsFounder[]> {
    const res = (await apiClient.get('/founders', {
      params: { limit: 100, status },
    })) as unknown as ApiResponse<CmsFounder[]>;
    return res.data;
  }

  static async getFounderById(id: string): Promise<CmsFounder> {
    const res = (await apiClient.get(`/founders/${id}`)) as unknown as ApiResponse<CmsFounder>;
    return res.data;
  }

  static async createFounder(data: Partial<CmsFounder>): Promise<CmsFounder> {
    const res = (await apiClient.post('/founders', data)) as unknown as ApiResponse<CmsFounder>;
    return res.data;
  }

  static async updateFounder(id: string, data: Partial<CmsFounder>): Promise<CmsFounder> {
    const res = (await apiClient.patch(`/founders/${id}`, data)) as unknown as ApiResponse<CmsFounder>;
    return res.data;
  }

  static async deleteFounder(id: string): Promise<void> {
    await apiClient.delete(`/founders/${id}`);
  }

  // ==========================================
  // BENEFITS
  // ==========================================

  static async getBenefits(status: string = 'all'): Promise<CmsBenefit[]> {
    const res = (await apiClient.get('/benefits', {
      params: { status, limit: 50 },
    })) as unknown as ApiResponse<CmsBenefit[]>;
    return res.data;
  }

  static async createBenefit(data: Partial<CmsBenefit>): Promise<CmsBenefit> {
    const res = (await apiClient.post('/benefits', data)) as unknown as ApiResponse<CmsBenefit>;
    return res.data;
  }

  static async updateBenefit(id: string, data: Partial<CmsBenefit>): Promise<CmsBenefit> {
    const res = (await apiClient.patch(`/benefits/${id}`, data)) as unknown as ApiResponse<CmsBenefit>;
    return res.data;
  }

  static async deleteBenefit(id: string): Promise<void> {
    await apiClient.delete(`/benefits/${id}`);
  }

  // ==========================================
  // MEDIA: GALLERY
  // ==========================================

  static async getGalleryCategories(): Promise<CmsGalleryCategory[]> {
    const res = (await apiClient.get('/gallery/categories')) as unknown as ApiResponse<CmsGalleryCategory[]>;
    return res.data;
  }

  static async createGalleryCategory(data: Partial<CmsGalleryCategory>): Promise<CmsGalleryCategory> {
    const res = (await apiClient.post('/gallery/categories', data)) as unknown as ApiResponse<CmsGalleryCategory>;
    return res.data;
  }

  static async getGalleryImages(status: string = 'all'): Promise<CmsGalleryImage[]> {
    const res = (await apiClient.get('/gallery', {
      params: { status, limit: 100 },
    })) as unknown as ApiResponse<CmsGalleryImage[]>;
    return res.data;
  }

  static async createGalleryImage(data: Partial<CmsGalleryImage>): Promise<CmsGalleryImage> {
    const res = (await apiClient.post('/gallery', data)) as unknown as ApiResponse<CmsGalleryImage>;
    return res.data;
  }

  static async updateGalleryImage(id: string, data: Partial<CmsGalleryImage>): Promise<CmsGalleryImage> {
    const res = (await apiClient.patch(`/gallery/${id}`, data)) as unknown as ApiResponse<CmsGalleryImage>;
    return res.data;
  }

  static async deleteGalleryImage(id: string): Promise<void> {
    await apiClient.delete(`/gallery/${id}`);
  }

  // ==========================================
  // MEDIA: VIDEOS
  // ==========================================

  static async getVideos(status: string = 'all'): Promise<CmsVideo[]> {
    const res = (await apiClient.get('/videos', {
      params: { status, limit: 50 },
    })) as unknown as ApiResponse<CmsVideo[]>;
    return res.data;
  }

  static async createVideo(data: Partial<CmsVideo>): Promise<CmsVideo> {
    const res = (await apiClient.post('/videos', data)) as unknown as ApiResponse<CmsVideo>;
    return res.data;
  }

  static async updateVideo(id: string, data: Partial<CmsVideo>): Promise<CmsVideo> {
    const res = (await apiClient.patch(`/videos/${id}`, data)) as unknown as ApiResponse<CmsVideo>;
    return res.data;
  }

  static async deleteVideo(id: string): Promise<void> {
    await apiClient.delete(`/videos/${id}`);
  }
}
