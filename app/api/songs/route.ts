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

// Define types
interface InteractionBody {
  action: 'like' | 'dislike' | 'play' | 'download';
  value?: boolean;
}

interface UserInteraction {
  song_id: number;
  liked: boolean;
  disliked: boolean;
  downloaded: boolean;
  played: boolean;
}

// GET: Get current interaction state for a specific song
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;
    const userId = getOrCreateUserId(request);
    
    console.log(`Fetching interaction for song ${songId}, user ${userId}`);
    
    // Fetch the song first to check if it exists
    const songResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=id`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );
    
    if (!songResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }
    
    const songData = await songResponse.json();
    if (!songData || songData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }
    
    // Fetch user interaction for this song
    const interactionResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}&select=liked,disliked,downloaded,played`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );
    
    let interactionData = {
      liked: false,
      disliked: false,
      downloaded: false,
      played: false
    };
    
    if (interactionResponse.ok) {
      const interactions = await interactionResponse.json();
      if (interactions.length > 0) {
        interactionData = interactions[0];
      }
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      songId: parseInt(songId),
      interactions: interactionData
    });
    
    // Set user ID cookie if not already set
    if (!request.cookies.has('user_id')) {
      response.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Error fetching interaction:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Update interaction for a specific song
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;
    const userId = getOrCreateUserId(request);
    
    // Parse request body
    const body: InteractionBody = await request.json();
    const { action, value = true } = body;
    
    console.log(`Updating interaction for song ${songId}, user ${userId}, action: ${action}, value: ${value}`);
    
    // Validate action
    const validActions = ['like', 'dislike', 'play', 'download'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be one of: like, dislike, play, download' },
        { status: 400 }
      );
    }
    
    // Validate song exists
    const songResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=id`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );
    
    if (!songResponse.ok || !(await songResponse.json()).length) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }
    
    // Check if interaction record exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );
    
    const existingInteractions = await checkResponse.json();
    const interactionExists = existingInteractions.length > 0;
    
    let responseData;
    
    if (interactionExists) {
      // Update existing interaction
      const updateData: any = {};
      
      // Handle special cases for like/dislike (they're mutually exclusive)
      if (action === 'like') {
        updateData.liked = value;
        updateData.disliked = value ? false : existingInteractions[0].disliked;
      } else if (action === 'dislike') {
        updateData.disliked = value;
        updateData.liked = value ? false : existingInteractions[0].liked;
      } else if (action === 'download') {
        updateData.downloaded = value;
        if (value) {
          // Increment download count on song
          await fetch(
            `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                downloads: (existingInteractions[0].song_downloads || 0) + 1
              })
            }
          );
        }
      } else if (action === 'play') {
        updateData.played = value;
        if (value) {
          // Increment play count on song
          await fetch(
            `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                plays: (existingInteractions[0].song_plays || 0) + 1
              })
            }
          );
        }
      }
      
      const updateResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(updateData)
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update interaction');
      }
      
      responseData = {
        success: true,
        message: 'Interaction updated',
        songId: parseInt(songId),
        action,
        value
      };
      
    } else {
      // Create new interaction
      const newInteraction: any = {
        user_id: userId,
        song_id: parseInt(songId),
        liked: action === 'like' ? value : false,
        disliked: action === 'dislike' ? value : false,
        downloaded: action === 'download' ? value : false,
        played: action === 'play' ? value : false
      };
      
      // Update song counts if needed
      if (action === 'download' && value) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              downloads: 1
            })
          }
        );
      } else if (action === 'play' && value) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              plays: 1
            })
          }
        );
      }
      
      const createResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_song_interactions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(newInteraction)
        }
      );
      
      if (!createResponse.ok) {
        throw new Error('Failed to create interaction');
      }
      
      responseData = {
        success: true,
        message: 'Interaction created',
        songId: parseInt(songId),
        action,
        value
      };
    }
    
    // Create response
    const response = NextResponse.json(responseData);
    
    // Set user ID cookie if not already set
    if (!request.cookies.has('user_id')) {
      response.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Error updating interaction:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Alternative to POST
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}

// DELETE: Remove all interactions for this song/user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;
    const userId = getOrCreateUserId(request);
    
    console.log(`Removing interactions for song ${songId}, user ${userId}`);
    
    const deleteResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Prefer': 'return=minimal'
        },
      }
    );
    
    if (!deleteResponse.ok) {
      throw new Error('Failed to delete interactions');
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'All interactions removed for this song',
      songId: parseInt(songId)
    });
    
    // Set user ID cookie if not already set
    if (!request.cookies.has('user_id')) {
      response.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Error deleting interactions:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}