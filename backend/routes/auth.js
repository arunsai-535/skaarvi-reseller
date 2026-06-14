const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, manufacturerOnly } = require('../middleware/auth');
const { uploadToS3, uploadLocally } = require('../middleware/upload');
const { User, Manufacturer, OTP } = require('../models/user');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/email');

// ========================================
// OTP BYPASSED - Direct login endpoint
// ========================================
// @route   POST /api/auth/login-bypass
// @desc    Direct login without OTP (for development)
// @access  Public
router.post('/login-bypass', [
  body('email').isEmail().withMessage('Invalid email address'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { email, userType } = req.body; // userType is optional (admin, manufacturer, customer)

    // Find user with email
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Manufacturer,
        as: 'manufacturer',
      }],
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Email not registered. Please register first.',
        code: 'EMAIL_NOT_FOUND',
      });
    }

    // Validate role if userType is specified
    if (userType && user.role !== userType) {
      return res.status(403).json({
        status: 'error',
        message: `This login is for ${userType}s only. Please use the correct login page.`,
        code: 'ROLE_MISMATCH',
        expectedRole: userType,
        actualRole: user.role,
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      manufacturerId: user.manufacturer?.id || null,
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      status: 'success',
      message: 'Login successful (OTP bypassed)',
      data: {
        user: {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          isVerified: user.isVerified,
          manufacturer: user.manufacturer ? {
            id: user.manufacturer.id,
            companyName: user.manufacturer.companyName,
            brandName: user.manufacturer.brandName,
            approvalStatus: user.manufacturer.approvalStatus,
          } : null,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login bypass error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
});

// ========================================
// OTP LOGIC - COMMENTED OUT (can be re-enabled later)
// OTP endpoints: send-otp, send-registration-otp, verify-otp
// ========================================

// Setup multer for file uploads (still needed for registration)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /api/auth/register
// @desc    Complete manufacturer registration
// @access  Public (OTP bypassed for now)
router.post('/register', 
  upload.fields([
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'cancelledCheque', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('=== Registration Request Started ===');
    console.log('Body fields:', Object.keys(req.body));
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
    
    try {
      const {
        mobile,
        email,
        companyName,
        brandName,
        contactPersonName,
        businessType,
        gstNumber,
        panNumber,
        address,
        city,
        state,
        pincode,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        upiId,
      } = req.body;

      console.log('Email:', email);
      console.log('Company Name:', companyName);

      // Validate required fields
      if (!email || !companyName || !contactPersonName) {
        return res.status(400).json({
          status: 'error',
          message: 'Required fields missing: email, companyName, contactPersonName',
        });
      }

      // Find or create user based on email
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        console.log('Creating new user for email:', email);
        // Create new user without OTP verification (bypassed)
        user = await User.create({
          email,
          mobile,
          role: 'manufacturer',
          isVerified: true, // Auto-verified since OTP is bypassed
          lastLogin: new Date(),
        });
        console.log('User created with ID:', user.id);
      } else {
        console.log('Found existing user with ID:', user.id);
      }

      // Check if manufacturer already exists
      const existingManufacturer = await Manufacturer.findOne({
        where: { userId: user.id }
      });

      if (existingManufacturer) {
        return res.status(400).json({
          status: 'error',
          message: 'Manufacturer profile already exists for this email',
        });
      }

      // Check GST uniqueness only if GST is provided
      if (gstNumber) {
        const gstExists = await Manufacturer.findOne({ where: { gstNumber } });
        if (gstExists) {
          return res.status(400).json({
            status: 'error',
            message: 'GST number already registered',
          });
        }
      }

      // Upload documents locally with userId and email folder structure
      console.log('Starting file uploads...');
      let gstCertificateUrl = null;
      let panCardUrl = null;
      let cancelledChequeUrl = null;
      let companyLogoUrl = null;

      const userId = user.id;
      const userEmail = user.email || email;

      if (req.files?.gstCertificate?.[0]) {
        console.log('Uploading GST certificate...');
        gstCertificateUrl = await uploadLocally(req.files.gstCertificate[0], userId, userEmail, 'gst');
      }
      if (req.files?.panCard?.[0]) {
        console.log('Uploading PAN card...');
        panCardUrl = await uploadLocally(req.files.panCard[0], userId, userEmail, 'pan');
      }
      if (req.files?.cancelledCheque?.[0]) {
        console.log('Uploading cancelled cheque...');
        cancelledChequeUrl = await uploadLocally(req.files.cancelledCheque[0], userId, userEmail, 'cheque');
      }
      if (req.files?.companyLogo?.[0]) {
        console.log('Uploading company logo...');
        companyLogoUrl = await uploadLocally(req.files.companyLogo[0], userId, userEmail, 'logo');
      }
      console.log('File uploads completed');

      // Create manufacturer profile
      console.log('Creating manufacturer profile...');
      const manufacturer = await Manufacturer.create({
        userId: user.id,
        companyName,
        brandName,
        contactPerson: contactPersonName,
        businessType,
        gstNumber: gstNumber || null, // Convert empty string to null
        panNumber: panNumber || null, // Convert empty string to null
        address,
        city,
        state,
        pincode,
        bankAccountNumber: accountNumber,
        bankIfscCode: ifscCode,
        bankAccountHolder: accountHolderName,
        bankName,
        upiId,
        companyLogoUrl,
        gstCertificateUrl,
        panCardUrl,
        cancelledChequeUrl,
        approvalStatus: 'pending',
      });
      console.log('Manufacturer created with ID:', manufacturer.id);

      // Update user mobile if provided
      if (mobile && mobile !== user.mobile) {
        await User.update({ mobile }, { where: { id: user.id } });
      }

      console.log('=== Registration Successful ===');
      res.status(201).json({
        status: 'success',
        message: 'Manufacturer registration submitted successfully. Pending admin approval.',
        data: { manufacturer },
      });
    } catch (error) {
      console.error('=== Registration Error ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        status: 'error',
        message: 'Registration failed',
        error: error.message
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Manufacturer,
        as: 'manufacturer',
      }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Public
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg,
      });
    }

    const { refreshToken } = req.body;
    const { verifyToken } = require('../utils/jwt');
    
    const decoded = verifyToken(refreshToken);
    
    // Generate new tokens
    const tokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      manufacturerId: decoded.manufacturerId,
    };

    const newToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token',
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In a production app, you'd add the token to a blacklist
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
});

module.exports = router;
