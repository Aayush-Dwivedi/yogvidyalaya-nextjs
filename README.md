# Kalptaru Yog Vidyalaya — Next.js Platform

A modern, full-stack web platform for **Kalptaru Yog Vidyalaya** built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, MongoDB (Mongoose), and Supabase Storage.

---

## 1. Repository Structure

```text
yogvidyalaya-nextjs/
├── nextjs-app/                  # Next.js App Router full-stack application
│   ├── app/                     # App Router pages, layouts, and API routes
│   │   ├── dashboard/           # Student portal dashboard views
│   │   ├── admin/               # Admin CMS and management views
│   │   └── api/                 # Serverless API routes (Auth, CMS, Courses, etc.)
│   ├── components/              # Reusable UI component library & layouts
│   ├── context/                 # Client React context providers (AuthContext)
│   ├── lib/                     # Server-side DB models, auth, services & utilities
│   │   ├── db/                  # Mongoose connection
│   │   ├── models/              # Mongoose data schemas & models
│   │   ├── services/            # Backend business logic & Supabase storage
│   │   └── validators/          # Zod validation schemas
│   ├── public/                  # Static assets & brand media
│   ├── sections/                # Composed page sections
│   ├── services/                # API client services
│   ├── types/                   # TypeScript interfaces & types
│   ├── views/                   # Full-page views & dashboards
│   ├── .env.local.example       # Environment variables template
│   └── package.json             # App dependencies & scripts
├── .gitignore                   # Git ignore rules
└── README.md                    # Platform documentation
```

---

## 2. Getting Started

### Prerequisites
- Node.js 18.18.0 or later
- MongoDB Database (Atlas or local)
- Supabase account (for object storage)

### Installation

1. **Navigate to the Next.js application:**
   ```bash
   cd nextjs-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your configuration:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT signing (minimum 32 characters)
   - `JWT_REFRESH_SECRET`: Secret key for refresh tokens
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
   - `NEXT_PUBLIC_APP_URL`: Base application URL (e.g. `http://localhost:3000`)

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 3. Scripts

Inside `/nextjs-app`:
- `npm run dev`: Starts Next.js development server
- `npm run build`: Compiles production build
- `npm run start`: Starts production server
- `npm run lint`: Runs ESLint
