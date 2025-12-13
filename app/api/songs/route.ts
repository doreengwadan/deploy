import { NextRequest, NextResponse } from 'next/server';

// Your Supabase credentials
const SUPABASE_URL = 'https://ajjrbrkcidmnhcwpfdzs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqanJicmtjaWRtbmhjd3BmZHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjY1MiwiZXhwIjoyMDc2NjAyNjUyfQ.8VSsu0e_SujhMPiLjwQqQOGkS08fRz6fD3UTj6HxbhY';

// Helper to generate or get user ID from cookies
function getOrCreateUserId(request: NextRequest): string {
  const cookies = request.cookies;
  let userId = cookies.get('user_id')?.value;
  
  if (!userId) {
    // Generate a new user ID
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  return userId;
}

// Define types for better TypeScript support
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  genre: string | null;
  duration: string | null;
  cover_url: string | null;
  audio_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  release_date: string | null;
  description: string | null;
  is_explicit: boolean;
  is_public: boolean;
  uploaded_at: string;
  likes?: number;
  dislikes?: number;
  downloads?: number;
  plays?: number;
}

interface UserInteraction {
  song_id: number;
  liked: boolean;
  disliked: boolean;
  downloaded: boolean;
}

interface SongsResponse {
  success: boolean;
  songs: Song[];
  total: number;
  limit: number;
  offset: number;
}

// GET handler with params
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'desc';
    const orderBy = searchParams.get('orderBy') || 'uploaded_at';
    
    console.log(`Fetching songs: limit=${limit}, offset=${offset}, sort=${sort}, orderBy=${orderBy}`);

    // Get or create user ID
    const userId = getOrCreateUserId(request);
    
    // Build the query URL with parameters
    let url = `${SUPABASE_URL}/rest/v1/songs?select=*`;
    
    // Add sorting
    url += `&order=${orderBy}.${sort}`;
    
    // Add pagination
    url += `&limit=${limit}&offset=${offset}`;
    
    console.log('Supabase URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      cache: 'no-store',
    });

    console.log('Supabase response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      throw new Error(`Failed to fetch songs: ${response.status} ${response.statusText}`);
    }

    const songs: Song[] = await response.json();
    console.log(`Fetched ${songs?.length || 0} songs`);
    
    // If we have songs, fetch user interactions for them
    const userInteractions: Record<number, UserInteraction> = {};
    if (songs.length > 0) {
      const songIds = songs.map((song: Song) => song.id);
      const interactionsUrl = `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=in.(${songIds.join(',')})&select=song_id,liked,disliked,downloaded`;
      
      console.log('Fetching interactions from:', interactionsUrl);
      
      const interactionsResponse = await fetch(interactionsUrl, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      });

      if (interactionsResponse.ok) {
        const interactions: UserInteraction[] = await interactionsResponse.json();
        console.log(`Fetched ${interactions.length} user interactions`);
        
        interactions.forEach((interaction: UserInteraction) => {
          userInteractions[interaction.song_id] = interaction;
        });
      } else {
        console.warn('Failed to fetch user interactions:', await interactionsResponse.text());
      }
    }
    
    // Merge interaction data with songs
    const songsWithInteractions = songs.map((song: Song) => ({
      ...song,
      likes: song.likes || 0,
      dislikes: song.dislikes || 0,
      downloads: song.downloads || 0,
      plays: song.plays || 0,
      userLiked: userInteractions[song.id]?.liked || false,
      userDisliked: userInteractions[song.id]?.disliked || false,
      userDownloaded: userInteractions[song.id]?.downloaded || false,
    }));

    // Get total count
    const countResponse = await fetch(`${SUPABASE_URL}/rest/v1/songs?select=id`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    let total = 0;
    if (countResponse.ok) {
      const countData = await countResponse.json();
      total = countData.length || 0;
    }

    // Create response
    const responseBody: SongsResponse = {
      success: true,
      songs: songsWithInteractions || [],
      total,
      limit,
      offset
    };

    // Create NextResponse with cookie if needed
    const nextResponse = NextResponse.json(responseBody);
    
    // Set user ID cookie if not already set
    if (!request.cookies.has('user_id')) {
      nextResponse.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return nextResponse;

  } catch (error: any) {
    console.error('Error fetching songs:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch songs',
        details: error?.message || 'Unknown error',
        songs: []
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods with params
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  );
}