'use client';

import { VideoFeedItem } from '@/types/neynar';
import VideoPlayer from './VideoPlayer';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface VideoCardProps {
  video: VideoFeedItem;
  isActive: boolean;
  isMuted: boolean;
  onTogglePlay?: () => void;
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default function VideoCard({ video, isActive, isMuted, onTogglePlay }: VideoCardProps) {
  return (
    <div className="relative w-full h-full bg-black">
      <VideoPlayer
        video={video}
        isActive={isActive}
        isMuted={isMuted}
        onTogglePlay={onTogglePlay}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 lg:pb-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold">@{video.author.username}</span>
            </div>
            {video.text && (
              <p className="text-white text-sm line-clamp-2">{video.text}</p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute right-4 bottom-24 lg:bottom-20 flex flex-col gap-4 items-center pointer-events-auto">
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-gray-700">
            {video.author.avatarUrl ? (
              <Image
                src={video.author.avatarUrl}
                alt={video.author.username}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                sizes="48px"
                loading="lazy"
                quality={85}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {video.author.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 text-white">
          <Heart className="w-8 h-8" fill="currentColor" />
          <span className="text-xs">{formatCount(video.stats.likes)}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white">
          <MessageCircle className="w-8 h-8" />
          <span className="text-xs">{formatCount(video.stats.replies)}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white">
          <Share2 className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

