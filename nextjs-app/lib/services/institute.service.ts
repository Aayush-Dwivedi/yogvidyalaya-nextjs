import { Institute, IInstitute } from '../models/Institute';

export class InstituteService {
  /**
   * Get the primary Institute profile (or create a default one if none exists)
   */
  static async getInstitute(): Promise<IInstitute> {
    let institute = await Institute.findOne();
    if (!institute) {
      institute = await Institute.create({
        name: 'Kalptaru Yog Vidyalaya',
        tagline: 'Ancient Wisdom for Modern Transformation',
        mission:
          'To preserve, practice, and disseminate the authentic, sacred disciplines of classical yoga, bringing radiant health, inner equanimity, and spiritual elevation to sincere seekers worldwide.',
        vision:
          'To stand as a globally revered sanctuary of traditional yogic learning and sadhana, bridging Vedic heritage with contemporary wellbeing.',
        philosophy:
          'Rooted in the Ashtanga and Hatha traditions of Patanjali and the ancient Natha lineage, we honor yoga not merely as physical postures, but as a comprehensive spiritual science of self-realization.',
        history:
          'Founded to bring authentic yoga practices and therapeutic physiotherapy care to practitioners of all levels.',
        establishedYear: 2011,
        contact: {
          email: 'shuchimohan@kalptaruyogvidyalaya.com',
          phone: '09818047984',
          alternatePhone: '',
          address: {
            street: 'N114 Piyush Heights, Sector 89',
            city: 'Faridabad',
            state: 'Haryana',
            postalCode: '121002',
            country: 'India',
            mapUrl: '',
          },
          hours: 'Mon – Sat: 06:00 AM – 08:00 PM',
        },
        socialLinks: {
          instagram: '',
          youtube: '',
          facebook: '',
        },
        stats: [
          { label: 'Happy Students', value: '5000+', detail: 'Happy Students', order: 1 },
          { label: 'Years Experience', value: '15+', detail: 'Years Experience', order: 2 },
          { label: 'Programs Offered', value: 'Multiple', detail: 'Programs Offered', order: 3 },
        ],
      });
    }
    return institute;
  }

  /**
   * Update or upsert Institute profile
   */
  static async updateInstitute(data: Partial<IInstitute>): Promise<IInstitute> {
    let institute = await Institute.findOne();
    if (!institute) {
      institute = await Institute.create(data);
    } else {
      Object.assign(institute, data);
      await institute.save();
    }
    return institute;
  }
}
