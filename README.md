# Kalptaru Yog Vidyalaya — Full-Stack Next.js Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com/)

A modern, high-performance, full-stack web platform built for **Kalptaru Yog Vidyalaya**. Features an interactive student booking portal, comprehensive course and workshop catalog, admin management dashboard, role-based authentication, and responsive design.

---

## Repository Structure

```text
kalptaru-yog-vidyalaya/
├── nextjs-app/                     # Core Next.js full-stack web application
│   ├── app/                        # App Router: public pages, portals, and REST API routes
│   │   ├── (public)/               # Marketing & informative pages (courses, workshops, etc.)
│   │   ├── admin/                  # Protected Admin dashboard & content management
│   │   ├── dashboard/              # Protected Student dashboard & booking history
│   │   └── api/                    # Serverless API routes (Auth, Content, Bookings, Media)
│   ├── components/                 # Reusable UI component library & layout wrappers
│   ├── context/                    # React Context providers (AuthContext)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Server-side business logic, DB, and utilities
│   │   ├── auth/                   # JWT creation, cookie session helpers
│   │   ├── db/                     # Mongoose connection manager with caching
│   │   ├── models/                 # Mongoose schemas (User, Course, Booking, Content, etc.)
│   │   ├── services/               # Domain business logic & Supabase storage services
│   │   ├── utils/                  # API responses, rate limiters, token helpers
│   │   └── validators/             # Zod validation schemas
│   ├── public/                     # Static assets, branding, and images
│   ├── sections/                   # Composed modular page sections
│   ├── services/                   # Client-side API service wrappers
│   ├── types/                      # TypeScript declarations & shared interfaces
│   ├── views/                      # Page view components
│   ├── .env.local.example          # Environment variables template
│   └── package.json                # App dependencies & scripts
├── .gitignore                      # Git exclusion rules
├── package.json                    # Root package with direct convenience scripts
└── README.md                       # Main platform documentation
```

---

## Quick Start

### 1. Prerequisites
- **Node.js**: v18.18.0 or newer
- **MongoDB**: Connection URI (MongoDB Atlas or local instance)
- **Supabase** (Optional/Recommended): For cloud storage of media files

### 2. Setup & Installation

You can run commands directly from the root directory or from inside `nextjs-app`:

```bash
# Clone the repository
git clone https://github.com/Aayush-Dwivedi/yogvidyalaya-nextjs.git
cd yogvidyalaya-nextjs

# Install dependencies for the Next.js app
npm run install:app
```

### 3. Environment Configuration

Copy the example environment template inside `nextjs-app`:

```bash
cp nextjs-app/.env.local.example nextjs-app/.env.local
```

Configure your variables in `nextjs-app/.env.local`:

| Variable | Description | Example / Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for access token encryption | Min 32 chars |
| `JWT_REFRESH_SECRET`| Secret key for refresh token encryption | Min 32 chars |
| `SUPABASE_URL` | Supabase project URL (media storage) | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Secret key |
| `NEXT_PUBLIC_APP_URL` | Application root URL | `http://localhost:3000` |

### 4. Running the Application

From the root repository:
```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Features & Highlights

- **Modern Architecture**: Next.js App Router with React 19 Server Components and Client Components where needed.
- **Role-Based Authentication**: Secure JWT cookies with role guards for Student, Instructor, and Admin roles.
- **Student Dashboard**: Real-time tracking of enrolled courses, workshops, booking statuses, and profile information.
- **Admin Management Portal**: Dynamic management of hero banners, institute information, testimonials, photo galleries, courses, and schedules.
- **Course & Workshop Enrollment**: Multi-step booking modal with instant confirmation, WhatsApp communication, and status tracking.
- **Enterprise Design System**: Clean typography, responsive layouts, Tailwind CSS styling, and accessible UI components.

---

## Available NPM Commands

| Command | Action |
|---|---|
| `npm run dev` | Runs the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint across all source files |
| `npm run install:app`| Installs dependencies in the `nextjs-app` subfolder |

---

## License

This project is proprietary and maintained for **Kalptaru Yog Vidyalaya**. All rights reserved.
