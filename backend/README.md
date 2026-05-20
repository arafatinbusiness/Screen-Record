# ScreenRecord Backend API

Express.js API for managing video metadata and analytics.

## Setup

1. Copy `.env.example` to `.env` and fill in your database credentials
2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   node db/init.js
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Videos (Admin)
- `GET /api/admin/videos` - List all videos (requires API key)
- `POST /api/admin/videos` - Create a new video (requires API key)
- `PUT /api/admin/videos/:id` - Update a video (requires API key)
- `DELETE /api/admin/videos/:id` - Delete a video (requires API key)

### Videos (Public)
- `GET /api/videos/:shareToken` - Get a published video by share token

### Analytics
- `POST /api/analytics/track` - Track a video view
- `GET /api/admin/analytics/:videoId` - Get video analytics (requires API key)

### Health
- `GET /health` - Server health check
- `GET /health/db` - Database connection check

## Authentication

Admin endpoints require an `X-API-Key` header with the value from `ADMIN_API_KEY` environment variable.

Example:
```bash
curl -H "X-API-Key: your-secret-key" http://localhost:3000/api/admin/videos
```
