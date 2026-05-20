# ScreenRecord Deployment Guide

This guide walks you through deploying ScreenRecord to production using Render (backend + database) and Vercel (frontend).

## Prerequisites

- GitHub account with the ScreenRecord repository
- Render account (https://render.com)
- Vercel account (https://vercel.com)

## Step 1: Deploy Render PostgreSQL Database

1. Log in to Render (https://render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `screenrecord-db`
   - **PostgreSQL Version**: Latest
   - **Region**: Choose closest to you
   - **Datadog API Key**: Leave blank
4. Click **Create Database**
5. Once created, copy the **External Database URL** (you'll need this for the backend)

## Step 2: Deploy Backend to Render

1. In Render, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select the repository and choose main branch
4. Configure:
   - **Name**: `screenrecord-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Same as database

5. Add Environment Variables:
   - `DATABASE_URL`: Paste the PostgreSQL URL from Step 1
   - `ADMIN_API_KEY`: Generate a secure random key (e.g., using `openssl rand -base64 32`)
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your Vercel frontend URL (we'll set this after deploying frontend)

6. Click **Create Web Service**
7. Wait for deployment to complete, then copy the service URL (e.g., `https://screenrecord-backend.onrender.com`)

## Step 3: Initialize Database Schema

1. Once backend is deployed on Render:
   - Go to the Render service dashboard
   - Click **Shell** tab
   - Run:
     ```bash
     cd /app && node db/init.js
     ```
   - Wait for confirmation: "Database initialized successfully"

## Step 4: Deploy Frontend to Vercel

1. Log in to Vercel (https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: Leave default

5. Add Environment Variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL from Step 2 (e.g., `https://screenrecord-backend.onrender.com`)
   - `NEXT_PUBLIC_ADMIN_API_KEY`: Same key from Step 2

6. Click **Deploy**
7. Once deployed, copy your Vercel URL (e.g., `https://screenrecord.vercel.app`)

## Step 5: Update CORS Origin

1. Go back to Render backend settings
2. Update the `CORS_ORIGIN` environment variable to your Vercel URL from Step 4
3. Trigger a redeploy

## Verification

1. Visit your Vercel frontend URL
2. Click "Admin Dashboard"
3. You should see the admin interface
4. Try creating a test video:
   - Title: "Test Video"
   - YouTube URL: `https://www.youtube.com/embed/dQw4w9WgXcQ` (Rick Roll embed)
   - Click "Create Video"
5. Copy the share link and visit it in a private window
6. The video should play without admin access

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend-url/health/db`
- [ ] Test creating a video in admin dashboard
- [ ] Test viewing video via public share link
- [ ] Check analytics are being recorded
- [ ] Verify error handling works

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct in Render environment
- Check database is still running in Render dashboard
- Try running `node db/init.js` again from Render shell

### 401 Unauthorized on Admin Dashboard
- Verify `NEXT_PUBLIC_ADMIN_API_KEY` matches backend `ADMIN_API_KEY`
- Both should use same value

### CORS Errors
- Update `CORS_ORIGIN` in Render to match your Vercel URL exactly
- Trigger a backend redeploy after updating

### Videos Not Loading
- Verify YouTube URLs use embed format: `https://www.youtube.com/embed/VIDEO_ID`
- Check video is published (Draft status = not visible)

## Production Best Practices

1. **Use strong API key**: Generate with `openssl rand -base64 32`
2. **Monitor logs**: Check Render/Vercel logs for errors
3. **Backup database**: Render has automated backups, verify they're enabled
4. **Use custom domain**: Update Vercel to use your custom domain
5. **Enable HTTPS**: Both Render and Vercel provide free HTTPS
6. **Set up monitoring**: Consider adding error tracking with Sentry

## Scaling

- **Database**: Upgrade Render PostgreSQL plan if needed
- **Backend**: Upgrade Render instance type
- **Frontend**: Vercel automatically scales
