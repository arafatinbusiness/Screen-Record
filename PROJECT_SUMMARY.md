# ScreenRecord - Project Summary

ScreenRecord is a premium video sharing platform for YouTube unlisted videos, similar to Loom. Users can upload videos, generate secure share links, and track detailed analytics about who watched their content.

## Project Architecture

```
screenrecord/
├── backend/                    # Express.js API on Render
│   ├── db/
│   │   ├── schema.sql         # PostgreSQL schema with videos and analytics tables
│   │   └── init.js            # Database initialization script
│   ├── routes/
│   │   ├── videos.js          # CRUD endpoints for videos
│   │   └── analytics.js       # Analytics tracking and reporting
│   ├── utils/
│   │   └── auth.js            # API key authentication middleware
│   ├── server.js              # Express server setup
│   └── package.json
│
├── frontend/                   # Next.js 16 on Vercel
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── admin/page.tsx     # Admin dashboard
│   │   └── watch/[token]/page.tsx  # Public video player
│   ├── components/
│   │   ├── admin/
│   │   │   ├── video-form.tsx # Form to create/edit videos
│   │   │   └── video-list.tsx # List and manage videos
│   │   └── video-player.tsx   # YouTube embed player
│   ├── lib/
│   │   └── api.ts             # API client functions
│   ├── hooks/
│   │   └── use-admin-auth.ts # Admin auth hook
│   └── package.json
│
├── README.md                   # Project overview
├── QUICKSTART.md              # Local development guide
├── DEPLOYMENT.md              # Production deployment guide
└── PROJECT_SUMMARY.md         # This file
```

## Key Features

### Admin Dashboard
- Create, read, update, delete (CRUD) videos
- Publish/unpublish videos
- Copy public share links
- View analytics (total views, average watch duration)
- Draft mode for work-in-progress videos

### Public Video Sharing
- Share videos via unique tokens (UUID)
- No authentication required for viewers
- YouTube video embedding
- Automatic watch time tracking
- Clean, minimal player UI

### Analytics
- Track views per video
- Measure watch duration
- Store viewer IP and user agent
- View recent viewer activity
- Admin-only access to analytics

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Database**: PostgreSQL (managed by Render)
- **Authentication**: Simple API key (environment variable)
- **Deployment**: Render Web Service

### Frontend
- **Framework**: Next.js 16
- **React**: Version 19.2
- **Styling**: Tailwind CSS 4.2
- **Components**: shadcn/ui
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API
- **Toasts**: Sonner
- **Deployment**: Vercel

### DevOps
- **Version Control**: GitHub
- **Backend Hosting**: Render (Web Service + PostgreSQL)
- **Frontend Hosting**: Vercel

## Database Schema

### videos table
- `id` (UUID, primary key)
- `title` (VARCHAR 255, required)
- `description` (TEXT, optional)
- `youtube_url` (VARCHAR 255, required)
- `share_token` (UUID, unique)
- `is_published` (BOOLEAN, default false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### video_analytics table
- `id` (UUID, primary key)
- `video_id` (UUID, foreign key to videos)
- `viewer_ip` (VARCHAR 45)
- `watch_duration_seconds` (INTEGER)
- `watched_at` (TIMESTAMP)
- `user_agent` (TEXT)

## API Endpoints

### Admin Endpoints (require X-API-Key header)
```
GET    /api/admin/videos                 # List all videos
POST   /api/admin/videos                 # Create video
PUT    /api/admin/videos/:id             # Update video
DELETE /api/admin/videos/:id             # Delete video
GET    /api/admin/analytics/:videoId     # Get video stats
```

### Public Endpoints (no auth required)
```
GET    /api/videos/:shareToken           # Get published video
POST   /api/analytics/track              # Track view
```

### Health Endpoints
```
GET    /health                           # Server status
GET    /health/db                        # Database status
```

## Getting Started

### Local Development
1. Follow [QUICKSTART.md](./QUICKSTART.md)
2. Backend runs on `http://localhost:3000`
3. Frontend runs on `http://localhost:3001` (or next available)
4. Admin dashboard at `/admin`

### Production Deployment
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Deploy backend to Render
3. Deploy PostgreSQL to Render
4. Deploy frontend to Vercel
5. Configure environment variables

## Security Considerations

- **API Key**: Simple string-based authentication (suitable for single admin)
- **HTTPS**: Enforced on Vercel and Render
- **CORS**: Configurable, set to frontend domain in production
- **Database**: Isolated in private Render network
- **Draft Mode**: Unpublished videos inaccessible via share token
- **No User Signup**: Single admin via API key (can be extended)

## Performance Optimizations

- **Caching**: Analytics data cached in memory (can add Redis)
- **Database Indexes**: Optimized for share_token and video_id lookups
- **CDN**: Vercel provides global CDN for frontend
- **Database**: PostgreSQL connection pooling via pg library

## Future Enhancement Ideas

- User authentication and multi-user support
- Password-protected videos
- Comments and reactions
- Video view heatmaps
- Custom branding
- Webhook notifications
- Video storage (instead of YouTube embed only)
- Advanced analytics (geographic, device, browser)
- Download transcript
- Email sharing integration

## File Structure Rationale

**Monorepo Approach**:
- Single GitHub repository for both frontend and backend
- Easier to manage versions and dependencies together
- Shared documentation and deployment guides
- Separate `/backend` and `/frontend` folders for independent deployment

**API-First Design**:
- Frontend completely separated from backend
- Backend can serve multiple frontends (web, mobile, etc.)
- Easy to scale independently
- Clear contract between frontend/backend

## Development Workflow

1. Create feature branch
2. Make changes to backend and/or frontend
3. Test locally with npm/pnpm dev scripts
4. Commit and push to GitHub
5. Render/Vercel auto-deploy on push to main
6. Monitor logs and analytics

## Maintenance

- Monitor Render and Vercel dashboards
- Check application logs for errors
- Backup database regularly (Render provides automated backups)
- Keep dependencies updated
- Monitor database size and query performance
- Scale resources as needed

## Support & Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get started locally
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production setup
- [backend/README.md](./backend/README.md) - Backend API docs
- [frontend/README.md](./frontend/README.md) - Frontend setup
- GitHub Issues for bug reports
- Pull requests for features

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Production Ready
