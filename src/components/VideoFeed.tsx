'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoFeedItem } from '@/types/neynar';
import VideoCard from './VideoCard';
import { Volume2, VolumeX } from 'lucide-react';

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
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        return;
      }
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
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    if (currentIndex > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
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
      <div className="hidden lg:block absolute top-8 left-8 z-50">
        <h1 className="text-black text-2xl font-bold">Farcaster</h1>
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

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 lg:right-[calc(50%-300px+1rem)] z-[99999] w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

    </div>
  );
}

