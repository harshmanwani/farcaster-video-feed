import { useState, useEffect } from 'react';

export function useMuteState() {
  const [isMuted, setIsMuted] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('videoMuted');
    if (saved) {
      setIsMuted(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('videoMuted', JSON.stringify(isMuted));
    }
  }, [isMuted, isHydrated]);

  return { isMuted, setIsMuted, isHydrated };
}

