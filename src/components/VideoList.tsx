'use client';

import { useEffect } from 'react';
import { VideoFeedItem } from '@/types/neynar';
import VideoCard from './VideoCard';

interface VideoListProps {
  videos: VideoFeedItem[];
  currentIndex: number;
  isMuted: boolean;
  bufferSize: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function VideoList({
  videos,
  currentIndex,
  isMuted,
  bufferSize,
  containerRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: VideoListProps) {

  const visibleIndices = Array.from(
    { length: bufferSize },
    (_, i) => currentIndex - Math.floor(bufferSize / 2) + i
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
  }, [currentIndex, visibleIndices, videos, containerRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full lg:max-w-[600px] lg:mx-auto"
      style={{ touchAction: currentIndex === 0 ? 'auto' : 'none' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
  );
}

