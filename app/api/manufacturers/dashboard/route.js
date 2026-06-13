import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { User, Manufacturer } from '@/models';
import { sequelize } from '@/lib/database';

// @route   GET /api/manufacturers/dashboard
// @desc    Get manufacturer dashboard summary
// @access  Private (Manufacturer)
export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Verify user is a manufacturer
    if (authResult.role !== 'manufacturer') {
      return NextResponse.json(
        { status: 'error', message: 'Access denied. Manufacturer account required.' },
        { status: 403 }
      );
    }

    // Initialize database
    await sequelize.sync();

    // Fetch manufacturer data
    const manufacturer = await Manufacturer.findOne({
      where: { userId: authResult.userId },
      include: [{ model: User, as: 'user' }],
    });

    if (!manufacturer) {
      return NextResponse.json(
        { status: 'error', message: 'Manufacturer profile not found' },
        { status: 404 }
      );
    }

    // TODO: Fetch actual data from database
    // For now, return mock data
    const dashboardData = {
      totalProducts: 45,
      activeProducts: 38,
      pendingProducts: 7,
      totalOrders: 234,
      totalSales: 458900,
      totalEarnings: 234500,
      pendingSettlements: 45600,
      manufacturer: {
        companyName: manufacturer.companyName,
        status: manufacturer.status,
      },
    };

    return NextResponse.json({
      status: 'success',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
