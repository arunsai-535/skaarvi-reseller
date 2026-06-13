import { NextResponse } from 'next/server';
import { User, Manufacturer } from '@/models';
import { authMiddleware } from '@/middleware/auth';

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
export async function GET(request) {
  try {
    const authResult = await authMiddleware(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Fetch user with manufacturer details
    const user = await User.findOne({
      where: { id: authResult.userId },
      include: [{
        model: Manufacturer,
        as: 'manufacturer',
      }],
    });

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        id: user.id,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        manufacturer: user.manufacturer,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
