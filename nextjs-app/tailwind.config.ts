import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kalptaruu Yoga Vidhyalaya Brand Palette
        plum: {
          50: '#FBF5FB',
          100: '#F4E7F4',
          200: '#E6CFE6',
          300: '#D1ACD1',
          400: '#B07DB0',
          500: '#895089',
          600: '#673567',
          700: '#4D244D',
          800: '#3B1838',
          900: '#2A1128', // Royal Plum (Primary brand)
          950: '#1A0719',
        },
        gold: {
          50: '#FBF8F0',
          100: '#F6EEDB',
          200: '#EDDCB6',
          300: '#E1C48C',
          400: '#D8B26E',
          500: '#C5A059', // Antique Gold (Primary Accent)
          600: '#A98344',
          700: '#886634',
          800: '#6E522E',
          900: '#5A4328',
          950: '#342514',
        },
        canvas: {
          DEFAULT: '#FDFBF7',
          warm: '#FAF7F0',
        },
        ivory: {
          DEFAULT: '#FDFBF7',
          warm: '#FAF7F0',
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FAF6EE',
          300: '#F5EFE0',
          400: '#EFE5CE',
          500: '#E5D6B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F6F3EC',
          muted: '#F0ECE4',
        },
        earth: {
          50: '#F9F6F4',
          100: '#F0ECE8',
          200: '#DFD5CE',
          300: '#C5B5AA',
          400: '#A79083',
          500: '#8C7164',
          600: '#7B4E3D',
          700: '#5C382B',
          800: '#4E3831',
          900: '#3A2A25',
        },
        ink: {
          DEFAULT: '#1A1718',
          muted: '#5A5355',
          faint: '#8E8588',
          earth: '#7B4E3D',
        },
        border: {
          DEFAULT: '#E8E2D8',
          subtle: '#E8E2D8',
          gold: 'rgba(197, 160, 89, 0.4)',
          plum: 'rgba(42, 17, 40, 0.15)',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        editorial: ['Cormorant Garamond', 'serif'],
      },
      letterSpacing: {
        'widest-editorial': '0.18em',
        'wide-editorial': '0.12em',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(42, 17, 40, 0.04), 0 1px 4px -1px rgba(42, 17, 40, 0.02)',
        card: '0 4px 16px -2px rgba(42, 17, 40, 0.05), 0 2px 6px -1px rgba(42, 17, 40, 0.02)',
        modal: '0 20px 40px -8px rgba(42, 17, 40, 0.18), 0 8px 16px -4px rgba(42, 17, 40, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
