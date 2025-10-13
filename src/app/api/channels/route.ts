import { NextRequest, NextResponse } from 'next/server';
import { fetchUserChannels } from '@/lib/neynar';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fidParam = searchParams.get('fid');

  if (!fidParam) {
    return NextResponse.json(
      { error: 'FID is required' },
      { status: 400 }
    );
  }

  const fid = parseInt(fidParam, 10);

  try {
    const channels = await fetchUserChannels(fid);
    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching user channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}