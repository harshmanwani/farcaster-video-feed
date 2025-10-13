'use client';

import { useRef, useEffect, useState } from 'react';
import { VideoFeedItem } from '@/types/neynar';
import Hls from 'hls.js';

interface VideoPlayerProps {
  video: VideoFeedItem;
  isActive: boolean;
  isMuted: boolean;
  onTogglePlay?: () => void;
}

export default function VideoPlayer({ video, isActive, isMuted, onTogglePlay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [hlsInitialized, setHlsInitialized] = useState(false);
  const isHLSVideo = useRef(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) return;

    setHasError(false);
    setIsLoading(true);
    setHlsInitialized(false);

    const isHLS = video.videoUrl.includes('.m3u8');
    isHLSVideo.current = isHLS;

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(video.videoUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setHlsInitialized(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setHasError(true);
          setIsLoading(false);
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (isHLS && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = video.videoUrl;
      setHlsInitialized(true);
    } else {
      videoElement.src = video.videoUrl;
      setHlsInitialized(true);
    }
  }, [video.videoUrl, isActive]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !hlsInitialized) return;

    if (isActive) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            if (hlsInitialized) {
              setHasError(true);
              setIsLoading(false);
            }
          });
      }
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }

    return () => {
      if (!isActive && videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
  }, [isActive, hlsInitialized]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted;
    }
  }, [isMuted]);

  const handleClick = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      videoElement.play().catch(() => setHasError(true));
      setIsPlaying(true);
    }

    onTogglePlay?.();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    // For HLS videos, rely on HLS.js error handling, not video element errors
    if (isHLSVideo.current) {
      return;
    }

    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      const videoElement = videoRef.current;
      if (videoElement) {
        setTimeout(() => {
          videoElement.load();
        }, 1000);
      }
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
      videoElement.play().catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black" onClick={handleClick}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        loop
        playsInline
        preload="metadata"
        poster={video.posterUrl}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="mb-4">Unable to load video</p>
            <button
              onClick={handleRetry}
              className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

