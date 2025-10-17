'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoFeedItem, NeynarChannel } from '@/types/neynar';
import { useNeynarContext } from "@neynar/react";
import { useMuteState } from '@/hooks/useMuteState';
import { useVideoData } from '@/hooks/useVideoData';
import { useVideoScrolling } from '@/hooks/useVideoScrolling';
import ChannelSelector from './ChannelSelector';
import VideoList from './VideoList';
import Toast from './Toast';

interface VideoFeedProps {
  initialVideos: VideoFeedItem[];
  initialCursor: string | null;
}

const BUFFER_SIZE = 5;

export default function VideoFeed({ initialVideos, initialCursor }: VideoFeedProps) {
  const { user } = useNeynarContext();
  const [selectedChannel, setSelectedChannel] = useState<NeynarChannel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isMuted, setIsMuted, isHydrated } = useMuteState();
  
  const handleChannelReset = useCallback(() => {
    setSelectedChannel(null);
  }, []);
  
  const {
    videos,
    cursor,
    channels,
    showToast,
    toastMessage,
    loadMoreVideos,
  } = useVideoData({
    initialVideos,
    initialCursor,
    selectedChannel,
    isHydrated,
    fid: user?.fid,
    onChannelReset: handleChannelReset,
  });

  const {
    currentIndex,
    setCurrentIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useVideoScrolling({
    videosLength: videos.length,
    containerRef,
  });

  useEffect(() => {
    if (videos.length - currentIndex < 5 && cursor) {
      loadMoreVideos();
    }
  }, [currentIndex, videos.length, cursor, loadMoreVideos]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedChannel, setCurrentIndex]);

  return (
    <div className={`relative w-full h-full overflow-hidden transition-opacity duration-300 ${isHydrated ? 'opacity-100' : 'opacity-0'}`}>
      {user && (
        <ChannelSelector
          channels={channels}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
        />
      )}

      <VideoList
        videos={videos}
        currentIndex={currentIndex}
        isMuted={isMuted}
        bufferSize={BUFFER_SIZE}
        containerRef={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      <Toast message={toastMessage} show={showToast} />
    </div>
  );
}