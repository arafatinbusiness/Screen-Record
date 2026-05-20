'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trackVideoView } from '@/lib/api';
import type { Video } from '@/lib/api';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [watchDuration, setWatchDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start tracking watch time
    intervalRef.current = setInterval(() => {
      setWatchDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Track view when component unmounts or video changes
    return () => {
      if (watchDuration > 0) {
        trackVideoView(video.id, watchDuration).catch(console.error);
      }
    };
  }, [video.id, watchDuration]);

  // Extract YouTube embed URL
  const getEmbedUrl = () => {
    let url = video.youtube_url;
    
    // Handle various YouTube URL formats
    if (url.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(new URL(url).search).get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('/embed/')) {
      return url;
    }
    
    return url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{video.title}</CardTitle>
        {video.description && (
          <CardDescription>{video.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={getEmbedUrl()}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Shared on {new Date(video.created_at).toLocaleDateString()}</p>
          <p>Watch time tracked: {Math.floor(watchDuration / 60)}m {watchDuration % 60}s</p>
        </div>
      </CardContent>
    </Card>
  );
}
