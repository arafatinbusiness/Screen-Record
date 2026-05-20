'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/video-player';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPublicVideo, Video } from '@/lib/api';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Video skeleton */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl blur-2xl opacity-40" />
          <div className="relative bg-zinc-900/50 rounded-2xl overflow-hidden ring-1 ring-white/5 animate-pulse">
            <div className="aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800" />
                <div className="w-40 h-3 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-3 px-1">
          <div className="h-10 sm:h-12 md:h-14 w-3/4 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

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
    return <LoadingSkeleton />;
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
      <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <VideoPlayer video={video} />
      </div>
    </div>
  );
}
