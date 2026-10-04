import { HeroSlide, IHeroSlide } from '../models/HeroSlide';
import { AppError } from '../utils/appError';

export class HeroService {
  static async getHeroSlides(activeOnly = true): Promise<IHeroSlide[]> {
    const filter = activeOnly ? { active: true } : {};
    return await HeroSlide.find(filter).sort({ order: 1, createdAt: -1 });
  }

  static async getHeroSlideById(id: string): Promise<IHeroSlide> {
    const slide = await HeroSlide.findById(id);
    if (!slide) {
      throw AppError.notFound(`Hero slide not found with ID: ${id}`);
    }
    return slide;
  }

  static async createHeroSlide(data: Partial<IHeroSlide>): Promise<IHeroSlide> {
    if (data.order === undefined) {
      const count = await HeroSlide.countDocuments();
      data.order = count;
    }
    return await HeroSlide.create(data);
  }

  static async updateHeroSlide(id: string, data: Partial<IHeroSlide>): Promise<IHeroSlide> {
    const updated = await HeroSlide.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw AppError.notFound(`Hero slide not found with ID: ${id}`);
    }
    return updated;
  }

  static async reorderHeroSlides(items: { id: string; order: number }[]): Promise<void> {
    const operations = items.map((item) =>
      HeroSlide.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(operations);
  }

  static async deleteHeroSlide(id: string): Promise<void> {
    const deleted = await HeroSlide.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Hero slide not found with ID: ${id}`);
    }
  }
}
