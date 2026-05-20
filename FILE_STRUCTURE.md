# ScreenRecord - File Structure

Complete project organization and file descriptions.

## Root Directory

```
screenrecord/
├── backend/                      # Express.js backend (Render)
├── frontend/                     # Next.js frontend (Vercel)
├── .git/                        # Git repository
├── .gitignore                   # Git ignore rules
├── README.md                    # Main project documentation
├── QUICKSTART.md               # Local development guide
├── DEPLOYMENT.md               # Production deployment guide
├── PROJECT_SUMMARY.md          # Project overview
└── FILE_STRUCTURE.md           # This file
```

## Backend Directory

```
backend/
├── db/
│   ├── schema.sql              # PostgreSQL schema definition
│   │                           # - videos table
│   │                           # - video_analytics table
│   │                           # - indexes and triggers
│   └── init.js                 # Database initialization script
│
├── routes/
│   ├── videos.js               # Video CRUD endpoints
│   │                           # GET    /api/admin/videos
│   │                           # POST   /api/admin/videos
│   │                           # PUT    /api/admin/videos/:id
│   │                           # DELETE /api/admin/videos/:id
│   │                           # GET    /api/videos/:shareToken
│   └── analytics.js            # Analytics endpoints
│                               # POST   /api/analytics/track
│                               # GET    /api/admin/analytics/:videoId
│
├── utils/
│   └── auth.js                 # API key verification middleware
│
├── server.js                   # Main Express server setup
├── .env.example               # Environment variables template
├── .gitignore                 # Backend-specific ignores
├── package.json               # Dependencies and scripts
├── package-lock.json          # Dependency lock file
├── render.yaml                # Render deployment config
└── README.md                  # Backend API documentation
```

## Frontend Directory

```
frontend/
├── app/
│   ├── page.tsx                # Landing page (/)
│   │                           # - Hero section
│   │                           # - Features overview
│   │                           # - CTA buttons
│   │
│   ├── layout.tsx              # Root layout component
│   │                           # - Fonts setup (Geist)
│   │                           # - Metadata
│   │                           # - Analytics
│   │
│   ├── globals.css             # Global styles and Tailwind
│   │
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard (/admin)
│   │                           # - Video form
│   │                           # - Video list with actions
│   │                           # - Authentication check
│   │
│   └── watch/
│       └── [token]/
│           └── page.tsx        # Public video player (/watch/:token)
│                               # - Video player component
│                               # - Error handling
│                               # - View tracking
│
├── components/
│   ├── admin/
│   │   ├── video-form.tsx      # Create/edit video form
│   │   │                       # - Title, description inputs
│   │   │                       # - YouTube URL input
│   │   │                       # - Publish toggle
│   │   │                       # - Submit handling
│   │   │
│   │   └── video-list.tsx      # Video list component
│   │                           # - Display all videos
│   │                           # - Copy share link
│   │                           # - Edit button
│   │                           # - Delete with confirmation
│   │
│   ├── video-player.tsx        # YouTube video player
│   │                           # - Embed video
│   │                           # - Track watch time
│   │                           # - Handle URL formats
│   │
│   ├── theme-provider.tsx      # Dark/light mode provider
│   │
│   └── ui/                     # shadcn/ui components (75+ files)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── checkbox.tsx
│       ├── badge.tsx
│       ├── alert.tsx
│       ├── dialog.tsx
│       ├── alert-dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── label.tsx
│       └── [... many more ...]
│
├── lib/
│   ├── api.ts                  # API client functions
│   │                           # - Video CRUD helpers
│   │                           # - Analytics tracking
│   │                           # - Type definitions
│   │
│   └── utils.ts                # Utility functions (cn helper)
│
├── hooks/
│   ├── use-admin-auth.ts       # Admin authentication hook
│   ├── use-toast.ts            # Toast notifications hook
│   └── use-mobile.ts           # Mobile detection hook
│
├── public/                     # Static assets
│   ├── icon-light-32x32.png
│   ├── icon-dark-32x32.png
│   ├── icon.svg
│   └── apple-icon.png
│
├── .env.example               # Frontend env variables template
├── .gitignore                 # Frontend-specific ignores
├── package.json               # Dependencies and scripts
├── pnpm-lock.yaml             # PNPM lock file
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── next.config.mjs            # Next.js configuration
├── components.json            # shadcn/ui configuration
├── README.md                  # Frontend documentation
└── [other generated files]
```

## Key Files Explained

### Backend Key Files

**server.js**
- Express app initialization
- CORS and JSON middleware setup
- Route mounting
- Error handling
- Health check endpoints

**db/schema.sql**
- PostgreSQL table definitions
- Indexes for performance
- Triggers for updated_at timestamps
- Foreign key relationships

**db/init.js**
- Reads schema.sql
- Executes all schema statements
- Called during deployment

**routes/videos.js**
- CRUD operations for videos
- API key verification
- Input validation
- Error handling

**routes/analytics.js**
- View tracking endpoint
- Analytics retrieval
- Aggregation queries

**utils/auth.js**
- Middleware to check X-API-Key header
- Compares against ADMIN_API_KEY env var

### Frontend Key Files

**app/page.tsx**
- Landing page with marketing content
- Navigation to admin dashboard
- Feature showcase

**app/admin/page.tsx**
- Main admin interface
- Integrates video form and list
- Handles editing state
- Refresh management

**components/admin/video-form.tsx**
- Reusable form for create/edit
- Input validation
- API calls
- Success/error handling

**components/admin/video-list.tsx**
- Displays all videos
- Delete confirmation
- Copy share link
- Status badges

**components/video-player.tsx**
- Embeds YouTube videos
- Tracks watch time
- Handles URL variations
- Client-side timer

**lib/api.ts**
- Typed API client
- Authentication headers
- Error handling
- Type definitions for backend responses

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
ADMIN_API_KEY=secret-key
PORT=3000
NODE_ENV=development|production
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_API_KEY=secret-key
```

## Build Artifacts

### Backend
- No build step required (Node.js runs directly)
- Dependencies installed in `node_modules/`

### Frontend
- `.next/` directory (generated by `next build`)
- Compiled and optimized for production
- Static exports where possible

## Dependencies Summary

### Backend
- express (5.2.1) - Web framework
- pg (8.20.0) - PostgreSQL driver
- uuid (14.0.0) - UUID generation
- cors (2.8.6) - CORS middleware
- dotenv (17.4.2) - Environment variables

### Frontend
- next (16.2.6) - React framework
- react (19.2.4) - UI library
- tailwindcss (4.2.0) - Styling
- shadcn/ui - Component library
- lucide-react - Icons
- react-hook-form - Form handling
- sonner - Toast notifications
- zod - Schema validation

## Deployment Artifacts

### Render Backend
- Source code deployed to `/app`
- Node modules installed
- Database migrations run
- Server starts with `npm start`

### Vercel Frontend
- Source code deployed
- Dependencies installed with pnpm
- Built with `next build`
- Deployed to global CDN
- Auto-preview for pull requests
