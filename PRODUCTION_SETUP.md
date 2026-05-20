# ScreenRecord - Production Setup (5 Steps)

## Step 1: Create Render PostgreSQL Database (5 mins)

1. Go to https://render.com and log in
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `screenrecord-db`
   - **PostgreSQL Version**: Keep default
   - **Region**: Pick your region
4. Click **Create Database**
5. Once ready, copy the **External Database URL** (looks like `postgresql://user:pass@...`)
6. Save this URL - you'll need it in Step 2

## Step 2: Deploy Backend to Render (10 mins)

1. In Render, click **New +** → **Web Service**
2. Click **Connect Repository** and select your GitHub repo with ScreenRecord code
3. Fill in:
   - **Name**: `screenrecord-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Same as database (Step 1)

4. Click **Add Environment Variable** and add these:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste from Step 1 |
   | `ADMIN_API_KEY` | Generate random: `openssl rand -base64 32` |
   | `PORT` | `3000` |
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | Leave empty for now (we'll update in Step 5) |

5. Click **Create Web Service**
6. Wait for build to complete (watch the logs)
7. Copy your backend URL when ready (e.g., `https://screenrecord-backend.onrender.com`)

## Step 3: Initialize Database Schema (2 mins)

1. Go to your Render backend service dashboard
2. Click the **Shell** tab
3. Run this command:
   ```bash
   cd /app && node db/init.js
   ```
4. Wait for: `Database initialized successfully`
5. Your tables are now ready!

## Step 4: Deploy Frontend to Vercel (10 mins)

1. Go to https://vercel.com and log in
2. Click **Add New** → **Project**
3. Click **Import Git Repository** and select your ScreenRecord repo
4. Under "Root Directory", select `frontend`
5. Click **Add Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_BACKEND_URL` | Your Render backend URL from Step 2 |
   | `NEXT_PUBLIC_ADMIN_API_KEY` | Same key from Step 2 |

6. Click **Deploy**
7. Wait for deployment (watch the logs)
8. Copy your frontend URL when ready (e.g., `https://screenrecord.vercel.app`)

## Step 5: Enable CORS (2 mins)

1. Go back to your Render backend service
2. Go to **Environment** tab
3. Edit `CORS_ORIGIN` and set it to your Vercel URL from Step 4
4. Click **Save Changes** (this auto-redeploys)
5. Wait for redeploy to complete

## Test Your Production Setup (5 mins)

1. Visit your Vercel frontend URL
2. Click **Admin Dashboard**
3. Create a test video:
   - **Title**: "Test Video"
   - **YouTube URL**: `https://www.youtube.com/embed/dQw4w9WgXcQ`
   - **Description**: anything
4. Click **Create Video**
5. You should see it in the list
6. Copy the **Share Link**
7. Open the link in a **private/incognito window** (no admin access)
8. Video should play!

## Verification Checklist

- [ ] Backend is running: Visit `https://your-backend-url/health`
- [ ] Database connected: Visit `https://your-backend-url/health/db`
- [ ] Frontend loads
- [ ] Can access admin dashboard
- [ ] Can create a video
- [ ] Share link works (test in incognito)
- [ ] Video plays from YouTube

## Important Notes

- **ADMIN_API_KEY**: Keep this secret. Never commit to GitHub. It's in Render environment variables.
- **YouTube URLs**: Must be in embed format: `https://www.youtube.com/embed/VIDEO_ID`
- To find VIDEO_ID from a normal YouTube URL (`https://www.youtube.com/watch?v=VIDEO_ID`), just take the ID part
- **Database backups**: Render backs up automatically (check in database settings)

## If Something Goes Wrong

**Backend won't start?**
- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct
- Run `/health` endpoint to see error

**Can't access admin dashboard?**
- Check `NEXT_PUBLIC_ADMIN_API_KEY` matches backend `ADMIN_API_KEY` exactly
- Check `NEXT_PUBLIC_BACKEND_URL` is correct (no trailing slash)

**Videos not loading?**
- Use embed YouTube URLs only: `https://www.youtube.com/embed/VIDEO_ID`
- Make sure video is "Published" (not Draft)

**CORS errors in browser console?**
- Check `CORS_ORIGIN` on Render backend matches your Vercel URL exactly
- Redeploy backend after changing CORS_ORIGIN

## Domain Setup (Optional)

To use a custom domain instead of vercel.app/onrender.com:

**Vercel**: https://vercel.com/docs/projects/domains
**Render**: https://render.com/docs/custom-domains

## Next: Get Real

Your app is now live! Next steps:
- Create real videos
- Share with people
- Monitor analytics
- Consider upgrading Render database if needed

That's it! You have a production video sharing platform running.
