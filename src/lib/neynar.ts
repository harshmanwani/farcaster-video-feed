import { NeynarFeedResponse, VideoFeedItem, NeynarCast, NeynarChannel } from '@/types/neynar';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

// Optimize Cloudflare imagedelivery URLs with proper sizing
function optimizeImageUrl(url: string, width = 828): string {
  if (!url) return url;
  
  if (url.includes('imagedelivery.net')) {
    return url.replace(/\/[^/]+$/, `/width=${width},quality=85,format=auto`);
  }
  
  return url;
}

export async function fetchVideoFeed(
  cursor?: string | null
): Promise<{
  videos: VideoFeedItem[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({
    feed_type: 'filter',
    filter_type: 'embed_types',
    embed_types: 'video',
    limit: '100',
    with_recasts: 'true',
  });

  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/feed?${params}`, {
    headers: {
      'x-api-key': NEYNAR_API_KEY,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neynar API error: ${response.status} - ${errorText}`);
  }

  const data: NeynarFeedResponse = await response.json();

  const videos = data.casts
    .filter(cast => hasVideoEmbed(cast))
    .map(cast => transformCastToVideo(cast))
    .filter(video => video.videoUrl);

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
  return optimizeImageUrl(cast.author.pfp_url, 828);
}

function transformCastToVideo(cast: NeynarCast): VideoFeedItem {
  return {
    id: cast.hash,
    videoUrl: getVideoUrl(cast) || '',
    posterUrl: getVideoPoster(cast),
    author: {
      username: cast.author.username,
      displayName: cast.author.display_name,
      avatarUrl: optimizeImageUrl(cast.author.pfp_url, 96),
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

export async function fetchUserChannels(fid: number): Promise<NeynarChannel[]> {
  const params = new URLSearchParams({
    fid: fid.toString(),
    limit: '100',
  });

  const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/channels?${params}`, {
    headers: {
      'x-api-key': NEYNAR_API_KEY,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neynar API error: ${response.status} - ${errorText}`);
  }

  const data: { channels: NeynarChannel[] } = await response.json();
  return data.channels;
}

export async function fetchChannelVideoFeed(
  parentUrl: string,
  cursor?: string | null
): Promise<{
  videos: VideoFeedItem[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({
    parent_urls: parentUrl,
    with_recasts: 'true',
    with_replies: 'false',
    limit: '100',
  });

  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/feed/parent_urls?${params}`, {
    headers: {
      'x-api-key': NEYNAR_API_KEY,
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neynar API error: ${response.status} - ${errorText}`);
  }

  const data: NeynarFeedResponse = await response.json();

  const videos = data.casts
    .filter(cast => hasVideoEmbed(cast))
    .map(cast => transformCastToVideo(cast))
    .filter(video => video.videoUrl);

  return {
    videos,
    nextCursor: data.next.cursor,
  };
}