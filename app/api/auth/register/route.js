import { NextResponse } from 'next/server';
import { User, Manufacturer } from '@/models';
import { sequelize } from '@/lib/database';
import { uploadToS3 } from '@/lib/aws';

// @route   POST /api/auth/register
// @desc    Register new manufacturer
// @access  Public
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const mobile = formData.get('mobile');
    const email = formData.get('email');
    const companyName = formData.get('companyName');
    const ownerName = formData.get('ownerName');
    const businessType = formData.get('businessType');
    const gstNumber = formData.get('gstNumber');
    const panNumber = formData.get('panNumber');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const pincode = formData.get('pincode');

    // Extract files
    const gstCertificate = formData.get('gstCertificate');
    const panCard = formData.get('panCard');
    const addressProof = formData.get('addressProof');

    // Validate required fields
    if (!mobile || !companyName || !ownerName) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize database
    await sequelize.sync();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser) {
      const existingManufacturer = await Manufacturer.findOne({
        where: { userId: existingUser.id },
      });

      if (existingManufacturer) {
        return NextResponse.json(
          { status: 'error', message: 'Manufacturer account already exists' },
          { status: 400 }
        );
      }
    }

    // Upload documents to S3 (if provided)
    const documents = {};
    
    if (gstCertificate) {
      const gstUrl = await uploadToS3(gstCertificate, 'documents/gst');
      documents.gstCertificate = gstUrl;
    }
    
    if (panCard) {
      const panUrl = await uploadToS3(panCard, 'documents/pan');
      documents.panCard = panUrl;
    }
    
    if (addressProof) {
      const addressUrl = await uploadToS3(addressProof, 'documents/address');
      documents.addressProof = addressUrl;
    }

    // Create or update user
    let user = existingUser;
    if (!user) {
      user = await User.create({
        mobile,
        email: email || null,
        role: 'manufacturer',
        isActive: false, // Inactive until admin approval
        isVerified: false,
      });
    } else {
      await user.update({ email: email || user.email });
    }

    // Create manufacturer profile
    const manufacturer = await Manufacturer.create({
      userId: user.id,
      companyName,
      ownerName,
      businessType,
      gstNumber,
      panNumber,
      address,
      city,
      state,
      pincode,
      status: 'pending', // Pending admin approval
      documents,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Registration submitted successfully. Your account is pending approval.',
      data: {
        userId: user.id,
        manufacturerId: manufacturer.id,
        status: manufacturer.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { status: 'error', message: 'GST or PAN number already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
