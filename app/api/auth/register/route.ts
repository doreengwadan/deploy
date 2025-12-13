import { NextRequest, NextResponse } from 'next/server';

// Your Supabase credentials
const SUPABASE_URL = 'https://ajjrbrkcidmnhcwpfdzs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqanJicmtjaWRtbmhjd3BmZHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAyNjY1MiwiZXhwIjoyMDc2NjAyNjUyfQ.8VSsu0e_SujhMPiLjwQqQOGkS08fRz6fD3UTj6HxbhY';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // 1. Create user in Supabase Auth using REST API
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`
        }
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      // Handle specific error messages
      const errorMessage = authData.msg || authData.message || authData.error?.message || 'Registration failed';
      
      if (errorMessage.toLowerCase().includes('already registered') || 
          errorMessage.toLowerCase().includes('already exists') ||
          authData.status === 422) {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: authResponse.status }
      );
    }

    // 2. Create profile in database (only if auth succeeded)
    if (authData.id) {
      try {
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            id: authData.id,
            name: name,
            email: email,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }),
        });

        if (!profileResponse.ok) {
          // If profile creation fails, log it but don't fail the registration
          const errorText = await profileResponse.text();
          console.warn('Profile creation warning (user still created):', errorText);
        }
      } catch (profileError) {
        // Log but continue - user auth was successful
        console.warn('Profile creation error (user still created):', profileError);
      }
    }

    // 3. Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.',
      user: {
        id: authData.id,
        email: authData.email,
        name: name
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
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