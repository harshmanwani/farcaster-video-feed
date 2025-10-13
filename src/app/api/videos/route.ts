import { NextRequest, NextResponse } from 'next/server';
import { fetchVideoFeed, fetchChannelVideoFeed } from '@/lib/neynar';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor') || null;
  const feedType = (searchParams.get('feedType') || 'trending') as 'trending' | 'following';
  const parentUrl = searchParams.get('parentUrl');
  const fidParam = searchParams.get('fid');
  const fid = fidParam ? parseInt(fidParam, 10) : undefined;

  try {
    const data = parentUrl 
      ? await fetchChannelVideoFeed(parentUrl, cursor)
      : await fetchVideoFeed(cursor, feedType, fid);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching video feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}