import {
  HeroSlide,
  FeaturedWorkshop,
  FeaturedCourse,
  BenefitItem,
  GalleryHighlight,
  VideoItem,
} from '../types/home';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920&q=85',
    subtitle: 'Traditional Yoga & Wellness',
    title: 'Kalptaru Yog Vidyalaya',
    description:
      'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
    quote: 'Affiliated by Indian Yoga Association',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=85',
    subtitle: 'Traditional Yoga & Wellness',
    title: 'Kalptaru Yog Vidyalaya',
    description:
      'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
    quote: 'Affiliated by Indian Yoga Association',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=85',
    subtitle: 'Traditional Yoga & Wellness',
    title: 'Kalptaru Yog Vidyalaya',
    description:
      'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
    quote: 'Affiliated by Indian Yoga Association',
  },
];

export const HERO_METRICS = [
  { label: 'Happy Students', value: '5000+', detail: '' },
  { label: 'Years Experience', value: '15+', detail: '' },
  { label: 'Programs Offered', value: 'Multiple', detail: '' },
];

export const FEATURED_WORKSHOPS: FeaturedWorkshop[] = [
  {
    id: 'ws-1',
    title: 'THYROID SPECIAL WORKSHOP',
    slug: 'thyroid-special-workshop',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    date: 'Upcoming',
    duration: '1 Hr',
    mode: 'Special Workshop',
    level: 'All Levels',
    price: '',
    shortDescription: 'Thyroid care',
    instructor: 'Mrs. Shuchi Mohan',
  },
  {
    id: 'ws-2',
    title: 'BACK PAIN SPECIAL WORKSHOP',
    slug: 'back-pain-special-workshop',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    date: 'Upcoming',
    duration: '1 Hr',
    mode: 'Special Workshop',
    level: 'All Levels',
    price: '',
    shortDescription: 'Free workshop for all age group',
    instructor: 'Mrs. Shuchi Mohan',
  },
  {
    id: 'ws-3',
    title: 'PRE NATAL & POST NATAL YOGA CARE',
    slug: 'pre-natal-post-natal-yoga-care',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    date: 'Upcoming',
    duration: '1 Hr',
    mode: 'Special Workshop',
    level: 'All Levels',
    price: '',
    shortDescription: 'Safe yoga poses for pregnancy (pre and post natal)',
    instructor: 'Mrs. Shuchi Mohan',
  },
];

export const FEATURED_COURSES: FeaturedCourse[] = [
  {
    id: 'crs-1',
    title: 'Yoga for Wellness: Foundation Course',
    slug: 'yoga-for-wellness-foundation-course',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    duration: '50 Hours',
    mode: 'Foundation Program',
    price: '',
    level: 'All Levels',
    shortDescription:
      'A carefully designed program that makes the profound benefits of authentic yoga accessible.',
    curriculumHighlights: ['Authentic Yogic Practices', 'Physiotherapy & Alignment', 'Breath & Mind Awareness'],
    certification: 'Kalptaru Yog Vidyalaya Certification',
  },
  {
    id: 'crs-2',
    title: 'Yogasana Certification',
    slug: 'yogasana-certification',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    duration: '120 Hours',
    mode: 'Certification Course',
    price: '₹14,500',
    level: 'Certificate Level',
    shortDescription:
      'Certificate course providing a strong foundation in traditional yogasanas with correct alignment.',
    curriculumHighlights: ['Traditional Yogasanas', 'Correct Alignment', 'Safe Methodology'],
    certification: 'Kalptaru Yog Vidyalaya Certification',
  },
  {
    id: 'crs-3',
    title: 'Yoga After Breast Cancer: A Healing Journey',
    slug: 'yoga-after-breast-cancer-healing-journey',
    image: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80',
    duration: '2 Days',
    mode: 'Specialized Workshop',
    price: '₹3,500',
    level: 'Therapeutic Recovery',
    shortDescription:
      '2-Day Specialized Yoga Therapy Workshop for post-cancer recovery with scientific and...',
    curriculumHighlights: ['2-Day Specialized Yoga Therapy Workshop by Dr Shuchi Mohan', 'Post-Cancer Recovery', 'Safe & Gentle Therapy'],
    certification: 'Certificate of Participation',
  },
];

export const WHY_YOGA_BENEFITS: BenefitItem[] = [
  {
    id: 'b-1',
    title: 'Physical Resilience & Vitality',
    sanskritTerm: 'Sharirik Swasthya & Urja',
    description:
      'Builds natural strength, flexibility, and stability. Improves posture, balance, and joint health. Increases energy levels and supports deep, restful sleep. Supports pain management (back pain, fatigue, stiffness). Strengthens the mind-body-consciousness connection.',
    scriptureRef: 'Asana & Biomechanics',
  },
  {
    id: 'b-2',
    title: 'Mental Clarity & Emotional Balance',
    sanskritTerm: 'Manas Shanti & Samatvam',
    description:
      'Stability in movement, stillness in chaos, and balance in life. Nurtures resilience without rigidity, strength without aggression, and discipline without pressure — creating sustainable wellness that flows into daily life.',
    scriptureRef: 'Sadhana & Mind',
  },
  {
    id: 'b-3',
    title: 'Therapeutic Yoga Process',
    sanskritTerm: 'Chikitsa & Sharir',
    description:
      'Through conscious movement and steady postures (asanas), yoga strengthens muscles, releases stored tension, improves circulation, and awakens body awareness. It harmonizes the nervous system and restores the natural rhythm of rest and activity.',
    scriptureRef: 'Therapeutic Yoga',
  },
  {
    id: 'b-4',
    title: 'Holistic Mind, Body & Spirit',
    sanskritTerm: 'Sharir, Prana, Chitta',
    description:
      'Rooted in ancient Indian wisdom and supported by modern science, yoga weaves together body (sharir), breath (prana), mind, and consciousness. A disciplined routine becomes the foundation for a calm mind and strong body.',
    scriptureRef: 'Holistic Science',
  },
  {
    id: 'b-5',
    title: 'A Conscious Way of Living',
    sanskritTerm: 'Sadhana',
    description:
      'For students, professionals, homemakers, elders, and seekers alike, yoga offers more than fitness — it offers a way of living. Not a workout. Not a trend. Not a hobby. Yoga is a way of life.',
    scriptureRef: 'Way of Living',
  },
  {
    id: 'b-6',
    title: 'In Essence: Path of Balance',
    sanskritTerm: 'Inner Union',
    description:
      'A path that builds: Strength in the body - Stillness in the mind - Balance in emotions - Clarity in decisions - Peace in the soul.',
    scriptureRef: 'Vidyalaya Essence',
  },
];

export const GALLERY_HIGHLIGHTS: GalleryHighlight[] = [
  {
    id: 'gal-1',
    title: 'Classroom Sessions & Instruction',
    category: 'Classes',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
    caption: 'Photos from our classes and events',
  },
  {
    id: 'gal-2',
    title: 'Therapeutic Alignment & Guidance',
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    caption: 'Photos from our classes and events',
  },
  {
    id: 'gal-3',
    title: 'Interactive Wellness & Events',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    caption: 'Photos from our classes and events',
  },
];

export const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Yoga for Sinusitis',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
  {
    id: 'vid-2',
    title: 'Yoga for Sciatica',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
  {
    id: 'vid-3',
    title: 'Yoga for Obesity',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
  {
    id: 'vid-4',
    title: 'Yoga for Adolescence',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
  {
    id: 'vid-5',
    title: 'Yoga for Improving Thyroid',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
  {
    id: 'vid-6',
    title: 'Yoga for Exam Worrier',
    speaker: 'Mrs. Shuchi Mohan',
    duration: 'Expert Session',
    thumbnail: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'NCERT Platform',
  },
];
