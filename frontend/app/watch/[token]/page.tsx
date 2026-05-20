'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/video-player';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPublicVideo, Video } from '@/lib/api';

export default function WatchPage() {
  const params = useParams();
  const token = params.token as string;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicVideo(token);
        setVideo(data);
      } catch (err) {
        setError('Video not found or access denied');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadVideo();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Video not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <VideoPlayer video={video} />
      </div>
    </div>
  );
}
