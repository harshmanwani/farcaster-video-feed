import { fetchVideoFeed } from '@/lib/neynar';
import VideoFeed from '@/components/VideoFeed';
import StaticVideoCard from '@/components/StaticVideoCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const { videos, nextCursor } = await fetchVideoFeed();

    if (videos.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <div className="text-center">
            <p className="text-xl mb-2">No videos available</p>
            <p className="text-sm text-gray-400">Check back later</p>
          </div>
        </div>
      );
    }

    return (
      <main className="h-screen w-screen overflow-hidden bg-white">
        <div suppressHydrationWarning className="absolute inset-0">
          <StaticVideoCard video={videos[0]} />
        </div>
        <VideoFeed initialVideos={videos} initialCursor={nextCursor} />
      </main>
    );
  } catch {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center px-4">
          <h1 className="text-2xl mb-4">Configuration Required</h1>
          <p className="text-gray-400 mb-2">Please add your Neynar API key to .env.local:</p>
          <code className="bg-gray-800 px-4 py-2 rounded block text-sm">
            NEYNAR_API_KEY=your_api_key_here
          </code>
          <p className="text-sm text-gray-500 mt-4">
            Get your API key from{' '}
            <a 
              href="https://neynar.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              neynar.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}
