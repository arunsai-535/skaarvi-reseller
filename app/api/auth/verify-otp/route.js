import { NextResponse } from 'next/server';

// @route   POST /api/auth/verify-otp
// @desc    Proxy to backend verify-otp endpoint
// @access  Public
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Forward request to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Verify OTP proxy error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
    });

    // Generate JWT tokens with claims
    const tokenPayload = {
      userId: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Prepare user data for response
    const userData = {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      manufacturer: user.manufacturer ? {
        id: user.manufacturer.id,
        companyName: user.manufacturer.companyName,
        ownerName: user.manufacturer.ownerName,
        status: user.manufacturer.status,
      } : null,
    };

    return NextResponse.json({
      status: 'success',
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: userData,
        token,
        refreshToken,
        isNewUser,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
