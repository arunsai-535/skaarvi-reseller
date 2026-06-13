import { NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/jwt';
import { User } from '@/models';

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { status: 'error', message: 'Refresh token required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    if (!decoded) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Fetch user to ensure they still exist and are active
    const user = await User.findOne({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { status: 'error', message: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newToken = generateToken({
      userId: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    return NextResponse.json({
      status: 'success',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Invalid or expired refresh token',
      },
      { status: 401 }
    );
  }
}
