import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://ajjrbrkcidmnhcwpfdzs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqanJicmtjaWRtbmhjd3BmZHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjY1MiwiZXhwIjoyMDc2NjAyNjUyfQ.8VSsu0e_SujhMPiLjwQqQOGkS08fRz6fD3UTj6HxbhY';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = parseInt(params.id);
    if (isNaN(songId)) {
      return NextResponse.json(
        { error: 'Invalid song ID' },
        { status: 400 }
      );
    }

    const { action } = await request.json();
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not identified' },
        { status: 401 }
      );
    }

    if (!['like', 'dislike', 'download', 'play'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    console.log(`Recording ${action} for song ${songId} by user ${userId}`);

    // Update the songs table counter
    const updateUrl = `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`;
    
    // For Supabase REST API, we need to get current value first
    // Get current song data
    const getSongResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    if (!getSongResponse.ok) {
      throw new Error('Failed to fetch song data');
    }

    const songs = await getSongResponse.json();
    if (songs.length === 0) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }

    const currentSong = songs[0];
    let updateData: any = {};

    switch (action) {
      case 'like':
        updateData = { likes: (currentSong.likes || 0) + 1 };
        break;
      case 'dislike':
        updateData = { dislikes: (currentSong.dislikes || 0) + 1 };
        break;
      case 'download':
        updateData = { downloads: (currentSong.downloads || 0) + 1 };
        break;
      case 'play':
        updateData = { plays: (currentSong.plays || 0) + 1 };
        break;
    }

    // Update song counter
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      console.error('Failed to update song counter:', await updateResponse.text());
      return NextResponse.json(
        { error: 'Failed to update song' },
        { status: 500 }
      );
    }

    // For like/dislike/download, update user_song_interactions
    if (action === 'like' || action === 'dislike' || action === 'download') {
      const interactionUrl = `${SUPABASE_URL}/rest/v1/user_song_interactions`;
      
      let interactionData: any = {
        user_id: userId,
        song_id: songId,
      };
      
      if (action === 'like') {
        interactionData.liked = true;
        interactionData.disliked = false;
      } else if (action === 'dislike') {
        interactionData.liked = false;
        interactionData.disliked = true;
      } else if (action === 'download') {
        interactionData.downloaded = true;
      }

      // Check if interaction already exists
      const checkResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );

      if (checkResponse.ok) {
        const existing = await checkResponse.json();
        if (existing.length > 0) {
          // Update existing interaction
          const updateInteractionResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Prefer': 'return=representation',
              },
              body: JSON.stringify(interactionData),
            }
          );
          
          if (!updateInteractionResponse.ok) {
            console.error('Failed to update interaction:', await updateInteractionResponse.text());
          }
        } else {
          // Create new interaction
          const createResponse = await fetch(interactionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(interactionData),
          });
          
          if (!createResponse.ok) {
            console.error('Failed to create interaction:', await createResponse.text());
          }
        }
      }
    }

    // Log play event
    if (action === 'play') {
      const playUrl = `${SUPABASE_URL}/rest/v1/song_plays`;
      const playData = {
        song_id: songId,
        user_id: userId,
        played_at: new Date().toISOString(),
      };

      const playResponse = await fetch(playUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(playData),
      });

      if (!playResponse.ok) {
        console.error('Failed to log play:', await playResponse.text());
      }
    }

    // Get updated song data
    const updatedSongResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    let updatedSong = null;
    if (updatedSongResponse.ok) {
      const updatedSongs = await updatedSongResponse.json();
      if (updatedSongs.length > 0) {
        updatedSong = updatedSongs[0];
      }
    }

    return NextResponse.json({
      success: true,
      message: `${action} recorded successfully`,
      song: updatedSong,
      action
    });

  } catch (error: any) {
    console.error('Error recording interaction:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to record interaction',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle toggle like/dislike (for toggling between like and dislike)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = parseInt(params.id);
    if (isNaN(songId)) {
      return NextResponse.json(
        { error: 'Invalid song ID' },
        { status: 400 }
      );
    }

    const { action, previousAction } = await request.json();
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not identified' },
        { status: 401 }
      );
    }

    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    console.log(`Toggling ${action} for song ${songId} by user ${userId}, previous: ${previousAction}`);

    // Get current song data first
    const getSongResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    if (!getSongResponse.ok) {
      throw new Error('Failed to fetch song data');
    }

    const songs = await getSongResponse.json();
    if (songs.length === 0) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }

    const currentSong = songs[0];
    const updateUrl = `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}`;

    // Prepare update data
    let updateData: any = {
      likes: currentSong.likes || 0,
      dislikes: currentSong.dislikes || 0,
    };

    // Adjust counters based on previous action and new action
    if (previousAction === 'like') {
      updateData.likes = Math.max(0, updateData.likes - 1);
    } else if (previousAction === 'dislike') {
      updateData.dislikes = Math.max(0, updateData.dislikes - 1);
    }

    if (action === 'like') {
      updateData.likes += 1;
    } else if (action === 'dislike') {
      updateData.dislikes += 1;
    }

    // Update song counters
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      console.error('Failed to update song counters:', await updateResponse.text());
      return NextResponse.json(
        { error: 'Failed to update song' },
        { status: 500 }
      );
    }

    // Update user interaction
    const interactionData = {
      user_id: userId,
      song_id: songId,
      liked: action === 'like',
      disliked: action === 'dislike',
      updated_at: new Date().toISOString(),
    };

    // Check if interaction exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    if (checkResponse.ok) {
      const existing = await checkResponse.json();
      if (existing.length > 0) {
        // Update existing interaction
        await fetch(
          `${SUPABASE_URL}/rest/v1/user_song_interactions?user_id=eq.${userId}&song_id=eq.${songId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(interactionData),
          }
        );
      } else {
        // Create new interaction
        await fetch(`${SUPABASE_URL}/rest/v1/user_song_interactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(interactionData),
        });
      }
    }

    // Get updated song data
    const updatedSongResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/songs?id=eq.${songId}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    let updatedSong = null;
    if (updatedSongResponse.ok) {
      const updatedSongs = await updatedSongResponse.json();
      if (updatedSongs.length > 0) {
        updatedSong = updatedSongs[0];
      }
    }

    return NextResponse.json({
      success: true,
      message: `${action} updated successfully`,
      song: updatedSong,
      action
    });

  } catch (error: any) {
    console.error('Error updating interaction:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update interaction',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}