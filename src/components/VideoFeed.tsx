'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoFeedItem } from '@/types/neynar';
import VideoCard from './VideoCard';

interface VideoFeedProps {
  initialVideos: VideoFeedItem[];
  initialCursor: string | null;
}

const BUFFER_SIZE = 5;

export default function VideoFeed({ initialVideos, initialCursor }: VideoFeedProps) {
  const [videos, setVideos] = useState<VideoFeedItem[]>(initialVideos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (!cursor || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos?cursor=${cursor}`);
      const data = await response.json();
      setVideos(prev => [...prev, ...data.videos]);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading]);

  useEffect(() => {
    if (videos.length - currentIndex < 5 && cursor) {
      loadMoreVideos();
    }
  }, [currentIndex, videos.length, cursor, loadMoreVideos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    let scrollAccumulator = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;
      
      e.preventDefault();
      
      scrollAccumulator += e.deltaY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0;
      }, 150);

      if (Math.abs(scrollAccumulator) < 80) return;

      isScrolling.current = true;
      scrollAccumulator = 0;

      if (e.deltaY > 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, videos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (currentIndex > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) < 60) return;

    isScrolling.current = true;

    if (diff > 0 && currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  const visibleIndices = Array.from(
    { length: BUFFER_SIZE },
    (_, i) => currentIndex - Math.floor(BUFFER_SIZE / 2) + i
  ).filter(i => i >= 0 && i < videos.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoElements = container.querySelectorAll('video');
    videoElements.forEach((video, index) => {
      const videoIndex = visibleIndices[index];
      if (videoIndex !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const links: HTMLLinkElement[] = [];
    
    for (let i = 1; i <= 2; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < videos.length) {
        const nextVideo = videos[nextIndex];
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'video';
        link.href = nextVideo.videoUrl;
        document.head.appendChild(link);
        links.push(link);
      }
    }

    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [currentIndex, visibleIndices, videos]);

  return (
    <div className={`relative w-full h-full overflow-hidden transition-opacity duration-300 ${isHydrated ? 'opacity-100' : 'opacity-0'}`}>
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors lg:top-8 lg:right-8"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>

      <div className="hidden lg:block absolute top-8 left-8 z-50">
        <h1 className="text-white text-2xl font-bold">Farcaster</h1>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-full lg:max-w-[600px] lg:mx-auto"
        style={{ touchAction: currentIndex === 0 ? 'auto' : 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {visibleIndices.map((index) => {
          const video = videos[index];
          const offset = index - currentIndex;
          
          return (
            <div
              key={video.id}
              className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateY(${offset * 100}%)`,
              }}
            >
              <VideoCard
                video={video}
                isActive={index === currentIndex}
                isMuted={isMuted}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
}

