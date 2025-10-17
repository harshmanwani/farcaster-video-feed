import { VideoFeedItem } from '@/types/neynar';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface StaticVideoCardProps {
  video: VideoFeedItem;
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

export default function StaticVideoCard({ video }: StaticVideoCardProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-black">
      <div className="relative w-full h-full lg:max-w-[min(100vw,calc(100vh*9/16))] mx-auto overflow-hidden lg:rounded-3xl bg-white dark:bg-black" style={{ aspectRatio: '9/16', maxHeight: '100vh' }}>
        <div className="absolute inset-0 bg-white dark:bg-black">
          <video
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="metadata"
            poster={video.posterUrl}
            muted
          >
            <source src={video.videoUrl} type="video/mp4" />
          </video>
          {video.posterUrl && (
            <Image
              src={video.posterUrl}
              alt="Video poster"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 600px"
              quality={85}
            />
          )}
        </div>

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

        <div className="absolute right-4 bottom-24 lg:bottom-20 flex flex-col gap-5 items-center pointer-events-auto">
          <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-gray-700 shadow-lg">
              {video.author.avatarUrl ? (
                <Image
                  src={video.author.avatarUrl}
                  alt={video.author.username}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  sizes="48px"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                  {video.author.username[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </button>

          <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
            <div className="relative">
              <Heart className="w-9 h-9 drop-shadow-lg" fill="currentColor" />
            </div>
            <span className="text-xs font-semibold drop-shadow-md">{formatCount(video.stats.likes)}</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
            <MessageCircle className="w-9 h-9 drop-shadow-lg" />
            <span className="text-xs font-semibold drop-shadow-md">{formatCount(video.stats.replies)}</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
            <Share2 className="w-9 h-9 drop-shadow-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

