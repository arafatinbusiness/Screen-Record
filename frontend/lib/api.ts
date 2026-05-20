// When using Vercel experimental services, backend is at /_/backend prefix on same domain
// When using standalone backend (Render/local), use NEXT_PUBLIC_BACKEND_URL
const isVercelServices = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = isVercelServices ? '' : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000');
const API_PREFIX = isVercelServices ? '/_/backend' : '';
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';


export interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  share_token: string;
  created_at: string;
  is_published: boolean;
}

export interface Analytics {
  stats: {
    total_views: number;
    avg_watch_duration: number;
  };
  recentViews: Array<{
    viewer_ip: string;
    watch_duration_seconds: number;
    watched_at: string;
  }>;
}

function apiUrl(path: string): string {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}

// Admin API calls (require authentication)
export async function getAdminVideos(): Promise<Video[]> {
  const res = await fetch(apiUrl('/api/admin/videos'), {
    headers: {
      'X-API-Key': ADMIN_API_KEY,
    },
  });
  
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function createVideo(data: {
  title: string;
  description?: string;
  youtubeUrl: string;
  isPublished?: boolean;
}): Promise<Video> {
  const res = await fetch(apiUrl('/api/admin/videos'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': ADMIN_API_KEY,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to create video');
  return res.json();
}

export async function updateVideo(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    youtubeUrl: string;
    isPublished: boolean;
  }>
): Promise<Video> {
  const res = await fetch(apiUrl(`/api/admin/videos/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': ADMIN_API_KEY,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to update video');
  return res.json();
}

export async function deleteVideo(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/admin/videos/${id}`), {
    method: 'DELETE',
    headers: {
      'X-API-Key': ADMIN_API_KEY,
    },
  });
  
  if (!res.ok) throw new Error('Failed to delete video');
}

export async function getVideoAnalytics(videoId: string): Promise<Analytics> {
  const res = await fetch(apiUrl(`/api/admin/analytics/${videoId}`), {
    headers: {
      'X-API-Key': ADMIN_API_KEY,
    },
  });
  
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

// Public API calls
export async function getPublicVideo(shareToken: string): Promise<Video> {
  const res = await fetch(apiUrl(`/api/videos/${shareToken}`));
  
  if (!res.ok) throw new Error('Video not found');
  return res.json();
}

export async function trackVideoView(
  videoId: string,
  watchDuration: number
): Promise<void> {
  await fetch(apiUrl('/api/analytics/track'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId,
      watchDuration,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }),
  });
}
