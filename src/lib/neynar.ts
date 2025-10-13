import { NeynarFeedResponse, VideoFeedItem, NeynarCast } from '@/types/neynar';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export async function fetchVideoFeed(cursor?: string | null): Promise<{
  videos: VideoFeedItem[];
  nextCursor: string | null;
}> {
  // Build URL with array parameter for embed_types
  const params = new URLSearchParams({
    feed_type: 'filter',
    filter_type: 'embed_types',
    limit: '100',
    with_recasts: 'true',
  });
  
  // Add embed_types as array parameter
  params.append('embed_types', 'video');

  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/feed?${params}`, {
    headers: {
      'x-api-key': NEYNAR_API_KEY,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neynar API error: ${response.status} - ${errorText}`);
  }

  const data: NeynarFeedResponse = await response.json();

  const videos = data.casts
    .filter(cast => hasVideoEmbed(cast))
    .map(cast => transformCastToVideo(cast))
    .filter(video => video.videoUrl); // Only include videos with valid URLs

  return {
    videos,
    nextCursor: data.next.cursor,
  };
}

function hasVideoEmbed(cast: NeynarCast): boolean {
  return cast.embeds.some(embed => 
    embed.url && embed.metadata?.content_type?.startsWith('video/')
  );
}

function getVideoUrl(cast: NeynarCast): string | null {
  for (const embed of cast.embeds) {
    if (embed.url && embed.metadata?.content_type?.startsWith('video/')) {
      return embed.url;
    }
  }
  return null;
}

function getVideoPoster(cast: NeynarCast): string {
  // No thumbnails in Neynar API, use author avatar as fallback
  return cast.author.pfp_url;
}

function transformCastToVideo(cast: NeynarCast): VideoFeedItem {
  return {
    id: cast.hash,
    videoUrl: getVideoUrl(cast) || '',
    posterUrl: getVideoPoster(cast),
    author: {
      username: cast.author.username,
      displayName: cast.author.display_name,
      avatarUrl: cast.author.pfp_url,
      fid: cast.author.fid,
    },
    text: cast.text,
    stats: {
      likes: cast.reactions.likes_count,
      recasts: cast.reactions.recasts_count,
      replies: cast.replies.count,
    },
    timestamp: cast.timestamp,
  };
}

