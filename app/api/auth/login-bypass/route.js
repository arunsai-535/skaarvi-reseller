import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend
    const backendResponse = await fetch('http://localhost:5000/api/auth/login-bypass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // If login successful, set cookies
    if (backendResponse.ok && data.data?.token) {
      const response = NextResponse.json(data, { 
        status: backendResponse.status,
      });

      // Set HTTP-only cookies for authentication
      response.cookies.set('token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      if (data.data.refreshToken) {
        response.cookies.set('refreshToken', data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });
      }

      return response;
    }

    // Return the backend response with the same status
    return NextResponse.json(data, { 
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Login bypass proxy error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to login', code: 'PROXY_ERROR' },
      { status: 500 }
    );
  }
}
