import { useState, useEffect, useCallback } from 'react';
import { VideoFeedItem, NeynarChannel } from '@/types/neynar';

interface UseVideoDataProps {
  initialVideos: VideoFeedItem[];
  initialCursor: string | null;
  selectedChannel: NeynarChannel | null;
  isHydrated: boolean;
  fid: number | undefined;
  onChannelReset: () => void;
}

export function useVideoData({ 
  initialVideos, 
  initialCursor, 
  selectedChannel,
  isHydrated,
  fid,
  onChannelReset
}: UseVideoDataProps) {
  const [videos, setVideos] = useState<VideoFeedItem[]>(initialVideos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState<NeynarChannel[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      if (!fid) {
        setChannels([]);
        return;
      }

      try {
        const response = await fetch(`/api/channels?fid=${fid}`);
        const data = await response.json();
        setChannels(data.channels || []);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, [fid]);

  const loadMoreVideos = useCallback(async () => {
    if (!cursor || isLoading) return;

    setIsLoading(true);
    try {
      const channelParam = selectedChannel ? `&parentUrl=${encodeURIComponent(selectedChannel.parent_url)}` : '';
      const response = await fetch(`/api/videos?cursor=${cursor}${channelParam}`);
      const data = await response.json();
      setVideos(prev => [...prev, ...data.videos]);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading, selectedChannel]);

  useEffect(() => {
    const fetchNewFeed = async () => {
      setIsLoading(true);
      try {
        const channelParam = selectedChannel ? `&parentUrl=${encodeURIComponent(selectedChannel.parent_url)}` : '';
        const url = `/api/videos?feedType=trending${channelParam}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.videos.length === 0 && selectedChannel) {
          setToastMessage(`No videos in ${selectedChannel.name}`);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            onChannelReset();
          }, 1500);
          return;
        }
        
        setVideos(data.videos);
        setCursor(data.nextCursor);
      } catch (error) {
        console.error('Error loading feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isHydrated) {
      fetchNewFeed();
    }
  }, [selectedChannel, isHydrated, onChannelReset]);

  return {
    videos,
    cursor,
    isLoading,
    channels,
    showToast,
    toastMessage,
    loadMoreVideos,
  };
}

