// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Your Supabase credentials
const SUPABASE_URL = 'https://ajjrbrkcidmnhcwpfdzs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqanJicmtjaWRtbmhjd3BmZHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjY1MiwiZXhwIjoyMDc2NjAyNjUyfQ.8VSsu0e_SujhMPiLjwQqQOGkS08fRz6fD3UTj6HxbhY';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    
    // Get form fields
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const album = formData.get('album') as string;
    const genre = formData.get('genre') as string;
    const releaseDate = formData.get('releaseDate') as string;
    const description = formData.get('description') as string;
    const isExplicit = formData.get('isExplicit') as string;
    const isPublic = formData.get('isPublic') as string;
    
    // Get files - handle case where files might be null
    const audioFile = formData.get('audioFile') as File;
    const coverFile = formData.get('coverFile') as File | null;
    const lyricsFile = formData.get('lyricsFile') as File | null;

    console.log('Form data received:', {
      title,
      artist,
      audioFileExists: !!audioFile,
      audioFileName: audioFile?.name,
      audioFileSize: audioFile?.size,
      audioFileType: audioFile?.type,
    });

    // Validate required fields
    if (!title || !artist || !audioFile) {
      console.error('Validation failed:', { title, artist, audioFile: !!audioFile });
      return NextResponse.json(
        { error: 'Title, artist, and audio file are required' },
        { status: 400 }
      );
    }

    // Validate file types
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'Please upload a valid audio file (MP3, WAV, etc.)' },
        { status: 400 }
      );
    }

    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    // Generate unique file names
    const timestamp = Date.now();
    const audioFileName = `${timestamp}_${audioFile.name.replace(/\s+/g, '_')}`;
    
    console.log('Attempting to upload audio file:', audioFileName);
    
    // 1. Upload audio file to Supabase Storage - FIXED API ENDPOINT
    const audioUploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/songs/${audioFileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': audioFile.type,
          'x-upsert': 'true',
        },
        body: await audioFile.arrayBuffer(),
      }
    );

    const audioUploadResult = await audioUploadResponse.text();
    console.log('Audio upload response:', {
      status: audioUploadResponse.status,
      statusText: audioUploadResponse.statusText,
      result: audioUploadResult,
    });

    if (!audioUploadResponse.ok) {
      console.error('Audio upload failed:', audioUploadResult);
      return NextResponse.json(
        { error: `Audio file upload failed: ${audioUploadResult}` },
        { status: 500 }
      );
    }

    // 2. Upload cover file if exists
    let coverUrl = null;
    if (coverFile && coverFile.size > 0) {
      const coverFileName = `${timestamp}_${coverFile.name.replace(/\s+/g, '_')}`;
      
      const coverUploadResponse = await fetch(
        `${SUPABASE_URL}/storage/v1/object/songs/${coverFileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': coverFile.type,
            'x-upsert': 'true',
          },
          body: await coverFile.arrayBuffer(),
        }
      );

      if (coverUploadResponse.ok) {
        coverUrl = `${SUPABASE_URL}/storage/v1/object/public/songs/${coverFileName}`;
      } else {
        console.warn('Cover upload warning:', await coverUploadResponse.text());
      }
    }

    // 3. Upload lyrics file if exists
    let lyricsUrl = null;
    if (lyricsFile && lyricsFile.size > 0) {
      const lyricsFileName = `${timestamp}_${lyricsFile.name.replace(/\s+/g, '_')}`;
      
      const lyricsUploadResponse = await fetch(
        `${SUPABASE_URL}/storage/v1/object/songs/${lyricsFileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': lyricsFile.type || 'text/plain',
            'x-upsert': 'true',
          },
          body: await lyricsFile.arrayBuffer(),
        }
      );

      if (lyricsUploadResponse.ok) {
        lyricsUrl = `${SUPABASE_URL}/storage/v1/object/public/songs/${lyricsFileName}`;
      } else {
        console.warn('Lyrics upload warning:', await lyricsUploadResponse.text());
      }
    }

    // 4. Insert song metadata into database
    const songData = {
      title,
      artist,
      album: album || null,
      genre: genre || null,
      release_date: releaseDate || null,
      description: description || null,
      is_explicit: isExplicit === 'true',
      is_public: isPublic === 'true',
      audio_url: `${SUPABASE_URL}/storage/v1/object/public/songs/${audioFileName}`,
      cover_url: coverUrl,
      lyrics_url: lyricsUrl,
      file_name: audioFile.name,
      file_size: audioFile.size,
      file_type: audioFile.type,
      uploaded_at: new Date().toISOString(),
    };

    console.log('Inserting song data:', songData);

    const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(songData),
    });

    const dbResult = await dbResponse.text();
    console.log('Database response:', {
      status: dbResponse.status,
      result: dbResult,
    });

    if (!dbResponse.ok) {
      console.error('Database error:', dbResult);
      
      // Return success even if DB fails (files are uploaded)
      return NextResponse.json({
        success: true,
        message: 'Audio file uploaded, but metadata save failed',
        warning: 'Song uploaded but database save failed',
        audio_url: `${SUPABASE_URL}/storage/v1/object/public/songs/${audioFileName}`,
      });
    }

    const songResult = JSON.parse(dbResult);
    
    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Song uploaded successfully!',
      song: songResult[0] || songData,
      audio_url: `${SUPABASE_URL}/storage/v1/object/public/songs/${audioFileName}`,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Upload failed. Please try again.',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}