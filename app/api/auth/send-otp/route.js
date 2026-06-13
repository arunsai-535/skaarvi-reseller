import { NextResponse } from 'next/server';
import { OTP } from '@/models';
import { sequelize } from '@/lib/database';

// @route   POST /api/auth/send-otp
// @desc    Send OTP to mobile number
// @access  Public
export async function POST(request) {
  try {
    const { mobile } = await request.json();

    // Validate mobile number
    if (!mobile || !/^\+91[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid mobile number format. Use +91XXXXXXXXXX' },
        { status: 400 }
      );
    }

    // Initialize database if needed
    await sequelize.sync();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing OTPs for this mobile
    await OTP.destroy({ where: { mobile } });

    // Store OTP in database
    await OTP.create({
      mobile,
      otp,
      expiresAt,
      verified: false,
    });

    // TODO: Send OTP via SMS (Twilio/MSG91)
    // For now, we'll log it (in production, send via SMS)
    console.log(`OTP for ${mobile}: ${otp}`);

    // In development, return OTP in response (REMOVE IN PRODUCTION)
    const isDevelopment = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      status: 'success',
      message: 'OTP sent successfully',
      ...(isDevelopment && { otp }), // Only in development
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
