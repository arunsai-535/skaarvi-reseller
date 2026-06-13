import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function authMiddleware(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Attach user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-email', decoded.email || '');

    return decoded;
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Helper to extract user from request
export function getUserFromRequest(request) {
  return {
    userId: request.headers.get('x-user-id'),
    role: request.headers.get('x-user-role'),
    email: request.headers.get('x-user-email'),
  };
}

// Middleware wrapper for protected routes
export function withAuth(handler, allowedRoles = []) {
  return async (request, context) => {
    const authResult = await authMiddleware(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(authResult.role)) {
      return NextResponse.json(
        { status: 'error', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Add user to context
    context.user = authResult;
    
    return handler(request, context);
  };
}
