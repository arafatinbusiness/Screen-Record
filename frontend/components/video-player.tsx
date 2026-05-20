'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { trackVideoView } from '@/lib/api';
import type { Video } from '@/lib/api';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
}

// YouTube IFrame API types
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          height?: string;
          width?: string;
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => void;
      PlayerState: {
        PLAYING: number;
        BUFFERING: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [watchDuration, setWatchDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Extract YouTube video ID
  const getVideoId = useCallback(() => {
    const url = video.youtube_url;

    if (url.includes('youtube.com/watch')) {
      return new URLSearchParams(new URL(url).search).get('v') || '';
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }

    return '';
  }, [video.youtube_url]);

  const videoId = getVideoId();

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (!videoId || !playerContainerRef.current) return;

    let mounted = true;

    const initPlayer = () => {
      if (!window.YT?.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          controls: 0,
          fs: 0,
          cc_load_policy: 0,
          playsinline: 1,
          disablekb: 1,
          loop: 0,
          mute: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event) => {
            if (!mounted) return;
            playerRef.current = event.target;
            setIsLoaded(true);
          },
          onStateChange: (event) => {
            if (!mounted) return;
            if (event.data === window.YT!.PlayerState.PLAYING) {
              setIsPlaying(true);
              setShowOverlay(false);
            } else if (event.data === window.YT!.PlayerState.ENDED) {
              setIsPlaying(false);
              setShowOverlay(true);
            }
          },
        },
      });
    };

    const timer = setTimeout(initPlayer, 100);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [videoId]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setWatchDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (watchDuration > 0) {
        trackVideoView(video.id, watchDuration).catch(console.error);
      }
    };
  }, [video.id, watchDuration]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

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

          <div ref={playerContainerRef} className="aspect-video relative">
            <div id="youtube-player" className="w-full h-full" />

            {/* Custom play overlay */}
            {showOverlay && isLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity hover:bg-black/50 z-10"
                onClick={handlePlay}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                  <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
                </div>
              </div>
            )}
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
          Shared privately via ScreenRecord <span className="mx-2 opacity-30">&bull;</span>{' '}
          {formattedDate}
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
