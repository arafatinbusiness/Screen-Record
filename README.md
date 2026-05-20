# ScreenRecord - Video Sharing Platform

A premium video sharing platform for unlisted YouTube videos with analytics, similar to Loom.

## Project Structure

```
screenrecord/
├── frontend/          # Next.js 16 application (Vercel)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── package.json
├── backend/           # Express.js API (Render)
│   ├── routes/
│   ├── db/
│   ├── utils/
│   └── server.js
└── README.md
```

## Setup Instructions

### Backend (Render PostgreSQL + Express.js)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy `.env.example` to `.env` and update with your credentials:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Initialize the database (when you have PostgreSQL running):
   ```bash
   node db/init.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend (Next.js on Vercel)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create `.env.local`:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
   NEXT_PUBLIC_ADMIN_API_KEY=your-secret-api-key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Deployment

### Backend on Render
1. Push code to GitHub
2. Connect GitHub repository to Render
3. Create Web Service
4. Set environment variables (DATABASE_URL, ADMIN_API_KEY)
5. Deploy

### Frontend on Vercel
1. Connect GitHub repository to Vercel
2. Set NEXT_PUBLIC_BACKEND_URL environment variable
3. Deploy

## Features (MVP)

- Admin dashboard for managing videos
- Public video sharing with unique share tokens
- View count and watch duration analytics
- YouTube unlisted video embedding
- Simple API key authentication
