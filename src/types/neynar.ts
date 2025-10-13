export interface NeynarVideoMetadata {
  streams: Array<{
    height_px: number;
    width_px: number;
    codec_name: string;
  }>;
  duration_s: number;
}

export interface NeynarEmbed {
  url?: string;
  metadata?: {
    content_type?: string;
    content_length?: number;
    _status?: string;
    video?: NeynarVideoMetadata;
  };
}

export interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  active_status: string;
}

export interface NeynarCast {
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: {
    fid: number;
  } | null;
  author: NeynarUser;
  text: string;
  timestamp: string;
  embeds: NeynarEmbed[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Array<{
      fid: number;
      fname: string;
    }>;
    recasts: Array<{
      fid: number;
      fname: string;
    }>;
  };
  replies: {
    count: number;
  };
  mentioned_profiles: NeynarUser[];
}

export interface NeynarFeedResponse {
  casts: NeynarCast[];
  next: {
    cursor: string | null;
  };
}

export interface VideoFeedItem {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  author: {
    username: string;
    displayName: string;
    avatarUrl: string;
    fid: number;
  };
  text: string;
  stats: {
    likes: number;
    recasts: number;
    replies: number;
  };
  timestamp: string;
}

