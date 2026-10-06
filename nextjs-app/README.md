# Kalptaru Yog Vidyalaya — Application Documentation

This directory contains the production full-stack application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## Architecture Overview

```
nextjs-app/
├── app/                  # Next.js App Router (Pages, Layouts & Route Handlers)
│   ├── (public)/         # Public marketing pages (courses, workshops, trainers, gallery)
│   ├── admin/            # Role-protected Admin management dashboard
│   ├── dashboard/        # Role-protected Student portal (profile, bookings)
│   ├── api/              # Serverless REST API endpoints
│   ├── layout.tsx        # Root application layout & global providers
│   ├── page.tsx          # Homepage
│   └── globals.css       # Core typography, design tokens, and Tailwind configuration
├── components/           # Reusable UI component library
│   ├── booking/          # Interactive booking modal & workflow components
│   ├── common/           # Shared UI buttons, inputs, loaders, badges
│   ├── layout/           # AdminLayout, StudentLayout, Header & Navigation
│   └── ...
├── context/              # Client-side React context (AuthContext, etc.)
├── hooks/                # Custom React hooks (auth, media queries, async state)
├── lib/                  # Server-side core utilities & domain layer
│   ├── auth/             # JWT creation, verification & session handling
│   ├── db/               # Cached Mongoose database connection
│   ├── models/           # Mongoose schemas (User, Course, Workshop, Booking, Content, etc.)
│   ├── services/         # Business logic layer & external service integrations
│   ├── utils/            # Shared formatting, rate-limiting, and response builders
│   └── validators/       # Zod validation schemas for requests
├── public/               # Static assets, branding, and images
├── sections/             # Modular section components used on public landing pages
├── services/             # Client-side API client modules (Axios client, API calls)
├── types/                # TypeScript interface and type declarations
└── views/                # Full-page view containers separating logic from routing
```

---

## Core Application Modules

### 1. Public Portal
- **Home (`/`)**: Hero carousel, courses preview, why yoga, videos, gallery highlight, testimonials.
- **Courses (`/programs/courses`)**: Full curriculum catalog, eligibility, timing, fees, syllabus modal.
- **Workshops (`/programs/workshops`)**: Upcoming specialized sessions and masterclasses.
- **Trainers & Founders (`/programs/trainers`, `/founder`)**: Institute leadership, teacher credentials, and lineage.
- **Gallery & Media (`/gallery`)**: Categorized photo and video gallery.
- **Contact & Enquiry (`/contact`, `/enquiry`)**: Direct enquiry submission with WhatsApp routing.

### 2. Student Portal (`/dashboard`)
- **Overview**: Active courses, scheduled sessions, notifications.
- **My Bookings (`/dashboard/bookings`)**: Enrollment history, payment verification status, course schedules.
- **Profile (`/dashboard/profile`)**: Personal details, health info, emergency contacts.

### 3. Admin Portal (`/admin`)
- **Dashboard (`/admin`)**: Analytics, recent bookings, quick stats.
- **Bookings Management (`/admin/bookings`)**: Approve, verify payments, cancel, or filter student bookings.
- **Courses & Workshops Management (`/admin/courses`, `/admin/workshops`)**: Manage course offerings, schedules, and pricing.
- **Website Content Management (`/admin/content/...`)**: Dynamic content editing for hero slides, benefits, founders, gallery, and institute details.

---

## API Endpoints Reference

| Route | Methods | Description | Access |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register a new student account | Public |
| `/api/auth/login` | `POST` | Authenticate user & issue JWT cookies | Public |
| `/api/auth/me` | `GET` | Retrieve authenticated user session | Authenticated |
| `/api/auth/logout` | `POST` | Clear auth cookies & terminate session | Authenticated |
| `/api/courses` | `GET`, `POST` | List courses or create new course | Public / Admin |
| `/api/courses/[id]` | `GET`, `PUT`, `DELETE` | Course details and updates | Public / Admin |
| `/api/workshops` | `GET`, `POST` | List workshops or create workshop | Public / Admin |
| `/api/bookings` | `GET`, `POST` | User enrollment and creation | Authenticated |
| `/api/admin/bookings` | `GET` | Filter, search and paginate all bookings | Admin |
| `/api/admin/bookings/[id]/status` | `PATCH` | Update booking status (confirmed/rejected) | Admin |
| `/api/student/dashboard` | `GET` | Student dashboard statistics & enrollments | Student |
| `/api/media/upload` | `POST` | Upload media asset to cloud storage | Admin |
| `/api/hero-slides` | `GET`, `POST` | Hero section slide content | Public / Admin |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` using `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Required environment variables:
- `MONGODB_URI` — Connection URI for MongoDB
- `JWT_SECRET` — Secret string (min 32 characters) for signing access tokens
- `JWT_REFRESH_SECRET` — Secret string for refresh tokens
- `SUPABASE_URL` — Supabase project API URL (for media asset uploads)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role secret key
- `NEXT_PUBLIC_APP_URL` — Base client application URL (e.g., `http://localhost:3000`)

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
