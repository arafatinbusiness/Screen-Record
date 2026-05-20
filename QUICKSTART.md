# ScreenRecord Quick Start

Get up and running locally in 5 minutes.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local or Docker)
- pnpm (or npm/yarn)

## Local Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd screenrecord

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && pnpm install && cd ..
```

### 2. Setup Database

Start PostgreSQL (if using Docker):
```bash
docker run --name screenrecord-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=screenrecord -p 5432:5432 -d postgres:15
```

### 3. Configure Backend

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/screenrecord
ADMIN_API_KEY=dev-api-key-12345
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

Initialize database:
```bash
cd backend
node db/init.js
npm start
```

Backend should be running at `http://localhost:3000`

### 4. Configure Frontend

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_API_KEY=dev-api-key-12345
```

Start frontend:
```bash
cd frontend
pnpm dev
```

Frontend should be running at `http://localhost:3000` (or next available port)

## First Steps

1. Open `http://localhost:3001` (frontend)
2. Click "Admin Dashboard"
3. Create a test video:
   - Title: "My First Video"
   - YouTube URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`
   - Check "Publish"
   - Click "Create Video"
4. Copy the share link and test it
5. Go to admin dashboard and check analytics

## API Endpoints

### Public
- `GET /api/videos/:shareToken` - Get published video
- `POST /api/analytics/track` - Track view

### Admin (requires X-API-Key header)
- `GET /api/admin/videos` - List all videos
- `POST /api/admin/videos` - Create video
- `PUT /api/admin/videos/:id` - Update video
- `DELETE /api/admin/videos/:id` - Delete video
- `GET /api/admin/analytics/:videoId` - Get video stats

### Health
- `GET /health` - Server health
- `GET /health/db` - Database health

## YouTube URL Formats

The app accepts these YouTube URL formats:
- Embed URL: `https://www.youtube.com/embed/VIDEO_ID`
- Watch URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`

The app automatically converts them to embed format.

## Troubleshooting

### Port already in use
- Change `PORT` in backend `.env`
- Change port in `frontend/package.json` dev script

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres

# If using Docker:
docker ps  # Check if container is running
```

### API Key errors
Make sure both frontend and backend use the **exact same** `ADMIN_API_KEY` value.

## Next Steps

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
2. Check out the [backend README](./backend/README.md) for API details
3. Check out the [frontend README](./frontend/README.md) for UI details
