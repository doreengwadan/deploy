import { NextRequest, NextResponse } from 'next/server';

// Your Supabase credentials
const SUPABASE_URL = 'https://ajjrbrkcidmnhcwpfdzs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqanJicmtjaWRtbmhjd3BmZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjY2NTIsImV4cCI6MjA3NjYwMjY1Mn0.nDrI-fny4iXBfRXpjtQJMMl2BSdOpqjOCS3ruqSnQKc';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Authenticate with Supabase
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      let errorMessage = 'Login failed';
      
      if (authData.error?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (authData.error?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in';
      } else if (authData.error) {
        errorMessage = authData.error;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: authResponse.status }
      );
    }

    if (!authData.access_token) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }

    // 2. Get user profile
    const userResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    const userProfile = userData[0] || {
      id: authData.user?.id,
      name: email.split('@')[0],
      email: email,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=8b5cf6&color=fff`
    };

    // 3. Return success response with user data
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        avatar: userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=8b5cf6&color=fff`,
      },
      session: {
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
        expires_at: Date.now() + (authData.expires_in * 1000),
        expires_in: authData.expires_in,
      }
    });

  } catch (error: any) {
    console.error('Login API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Login failed. Please try again.',
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