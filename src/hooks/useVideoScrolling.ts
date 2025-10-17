import { useState, useEffect, useRef } from 'react';

interface UseVideoScrollingProps {
  videosLength: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVideoScrolling({ videosLength, containerRef }: UseVideoScrollingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    let scrollAccumulator = 0;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[data-dropdown]')) {
        return;
      }
      if (isScrolling.current) return;
      
      e.preventDefault();
      
      scrollAccumulator += e.deltaY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0;
      }, 150);

      if (Math.abs(scrollAccumulator) < 100) return;

      isScrolling.current = true;
      scrollAccumulator = 0;

      if (e.deltaY > 0 && currentIndex < videosLength - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 400);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, videosLength, containerRef]);

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

    if (Math.abs(diff) < 50) return;

    isScrolling.current = true;

    if (diff > 0 && currentIndex < videosLength - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 400);
  };

  return {
    currentIndex,
    setCurrentIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

