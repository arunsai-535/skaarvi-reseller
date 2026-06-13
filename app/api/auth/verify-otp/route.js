import { NextResponse } from 'next/server';
import { User, Manufacturer, OTP } from '@/models';
import { generateToken, generateRefreshToken } from '@/lib/jwt';
import { sequelize } from '@/lib/database';
import { Op } from 'sequelize';

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login
// @access  Public
export async function POST(request) {
  try {
    const { mobile, otp } = await request.json();

    // Validate input
    if (!mobile || !otp) {
      return NextResponse.json(
        { status: 'error', message: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // Initialize database if needed
    await sequelize.sync();

    // Find OTP record
    const otpRecord = await OTP.findOne({
      where: {
        mobile,
        otp,
        verified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['created_at', 'DESC']],
    });

    if (!otpRecord) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await otpRecord.update({ verified: true });

    // Find or create user
    let user = await User.findOne({
      where: { mobile },
      include: [{
        model: Manufacturer,
        as: 'manufacturer',
      }],
    });

    let isNewUser = false;

    if (!user) {
      // Create new user with manufacturer role
      user = await User.create({
        mobile,
        role: 'manufacturer',
        isActive: true,
        isVerified: true,
        lastLogin: new Date(),
      });
      isNewUser = true;
    } else {
      // Update last login
      await user.update({ lastLogin: new Date() });
    }

    // Get fresh user data with manufacturer details
    user = await User.findOne({
      where: { id: user.id },
      include: [{
        model: Manufacturer,
        as: 'manufacturer',
      }],
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
