'use client';

import { useEffect, useState, useRef } from 'react';
import { trackVideoView } from '@/lib/api';
import type { Video } from '@/lib/api';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [watchDuration, setWatchDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

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

  const embedUrl = getEmbedUrl();
  const formattedDate = new Date(video.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Cinematic video container */}
      <div className="relative group">
        {/* Glow effect behind the player */}
        <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
        
        {/* Dark background behind the embed */}
        <div className="relative bg-black rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          {!isLoaded && (
            <div className="aspect-video flex items-center justify-center bg-zinc-900 animate-pulse">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800" />
                <div className="w-32 h-3 rounded-full bg-zinc-800" />
              </div>
            </div>
          )}
          
          {/* Video wrapper for overlay positioning */}
          <div className="relative w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`w-full h-full absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
            />
            
            {/* Loom-style bottom gradient overlay - heavier to hide YouTube controls */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            
            {/* Bottom bar to cover YouTube logo (left) and "Watch on YouTube" button (right) */}
            <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-20 z-10 flex items-end justify-between px-4 sm:px-6 pb-4 sm:pb-4">
              {/* Left side - covers YouTube logo */}
              <div className="flex items-center gap-2">
                <a
                  href="https://shopifyheroesagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-xs md:text-sm font-bold text-white bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-md rounded-lg border border-white/20 shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <span>Shopify Heroes</span>
                </a>
              </div>
              
              {/* Right side - covers "Watch on YouTube" button */}
              <a
                href="https://shopifyheroesagency.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-xs md:text-sm font-bold text-white bg-gradient-to-r from-orange-500/90 to-pink-600/90 backdrop-blur-md rounded-lg border border-white/20 shadow-lg hover:from-orange-400 hover:to-pink-500 transition-all duration-200"
              >
                <svg className="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Shopify Heroes</span>
                <svg className="w-3 h-3 sm:w-3 sm:h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Title - large and prominent */}
      <div className="space-y-2 px-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {video.title}
        </h1>
        
        {/* Minimal metadata */}
        <p className="text-sm text-muted-foreground/70 font-light tracking-wide">
          Shared privately via ScreenRecord <span className="mx-2 opacity-30">•</span> {formattedDate}
        </p>
      </div>

      {/* Optional description */}
      {video.description && (
        <p className="text-base text-muted-foreground/80 leading-relaxed max-w-3xl px-1">
          {video.description}
        </p>
      )}
    </div>
  );
}
