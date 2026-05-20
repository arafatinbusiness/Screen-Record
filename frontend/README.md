# ScreenRecord Frontend

Next.js 16 application for managing and sharing videos.

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: URL of your backend API (e.g., `http://localhost:3000` for local dev)
   - `NEXT_PUBLIC_ADMIN_API_KEY`: Same API key as your backend

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3001`.

## Pages

- `/` - Landing page with feature overview
- `/admin` - Admin dashboard for managing videos (requires API key)
- `/watch/[token]` - Public video player page

## Features

- Admin dashboard with CRUD operations for videos
- Public video sharing with unique tokens
- YouTube video embedding
- View count and watch duration analytics
- Draft and publish modes for videos
