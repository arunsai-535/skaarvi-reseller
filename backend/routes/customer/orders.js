const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const { calculateCommission, creditPendingCommission } = require('../services/commissionService');

// @route   POST /api/customer/orders
// @desc    Create a new order (guest or authenticated)
// @access  Public
router.post('/orders', async (req, res) => {
  const sequelize = require('../config/database');
  const transaction = await sequelize.transaction();

  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      referralCode,
      totalAmount,
    } = req.body;

    console.log('[Customer Order] Creating order:', { items: items.length, totalAmount, referralCode });

    // Validate required fields
    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.mobile || !shippingAddress.email) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Complete shipping information is required',
      });
    }

    // Get user ID from token (if authenticated) or create guest user
    let userId = null;
    let customerId = null;
    let isGuestOrder = true;

    // Try to get user from authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { verifyToken } = require('../utils/jwt');
        const decoded = verifyToken(token);
        userId = decoded.id;
        isGuestOrder = false;
      } catch (error) {
        console.log('[Customer Order] No valid auth token, proceeding as guest');
      }
    }

    // Find or create customer record
    if (userId) {
      // Authenticated user - get customer ID
      const [customer] = await sequelize.query(
        'SELECT id FROM customers WHERE user_id = ?',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction
        }
      );
      customerId = customer?.id;
    } else {
      // Guest user - check if email/mobile already exists
      const [existingUser] = await sequelize.query(
        'SELECT id FROM users WHERE email = ? OR mobile = ?',
        {
          replacements: [shippingAddress.email, shippingAddress.mobile],
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (existingUser) {
        // User exists, link to them
        userId = existingUser.id;
        
        const [customer] = await sequelize.query(
          'SELECT id FROM customers WHERE user_id = ?',
          {
            replacements: [userId],
            type: QueryTypes.SELECT,
            transaction
          }
        );
        customerId = customer?.id;
      } else {
        // Create new user for guest checkout
        const randomPassword = require('crypto').randomBytes(16).toString('hex');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        await sequelize.query(
          `INSERT INTO users 
           (full_name, email, mobile, password, role, city, state, address, pincode, status, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?, 'approved', 1, NOW(), NOW())`,
          {
            replacements: [
              shippingAddress.fullName,
              shippingAddress.email,
              shippingAddress.mobile,
              hashedPassword,
              shippingAddress.city || null,
              shippingAddress.state || null,
              shippingAddress.address || null,
              shippingAddress.pincode || null
            ],
            type: QueryTypes.INSERT,
            transaction
          }
        );

        // Get created user ID
        const [newUser] = await sequelize.query(
          'SELECT id FROM users WHERE email = ? AND mobile = ?',
          {
            replacements: [shippingAddress.email, shippingAddress.mobile],
            type: QueryTypes.SELECT,
            transaction
          }
        );
        userId = newUser.id;
      }
    }

    // Find reseller from referral code
    let resellerId = null;
    if (referralCode) {
      const [reseller] = await sequelize.query(
        'SELECT id FROM resellers WHERE reseller_code = ?',
        {
          replacements: [referralCode],
          type: QueryTypes.SELECT,
          transaction
        }
      );
      
      if (reseller) {
        resellerId = reseller.id;
        console.log('[Customer Order] Referral code valid, reseller:', resellerId);
      } else {
        console.warn('[Customer Order] Invalid referral code:', referralCode);
      }
    }

    // Create or update customer record with referral
    if (!customerId) {
      await sequelize.query(
        `INSERT INTO customers 
         (user_id, full_name, address, city, state, pincode, referred_by_reseller, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        {
          replacements: [
            userId,
            shippingAddress.fullName,
            shippingAddress.address || null,
            shippingAddress.city || null,
            shippingAddress.state || null,
            shippingAddress.pincode || null,
            resellerId || null
          ],
          type: QueryTypes.INSERT,
          transaction
        }
      );

      const [newCustomer] = await sequelize.query(
        'SELECT id FROM customers WHERE user_id = ?',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction
        }
      );
      customerId = newCustomer.id;
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Calculate commission
    const { totalCommission, itemCommissions } = await calculateCommission(items, resellerId, sequelize);
    
    console.log('[Customer Order] Commission calculated:', { totalCommission, resellerId });

    // Create order
    await sequelize.query(
      `INSERT INTO orders 
       (order_number, customer_id, reseller_id, total_amount, final_amount, 
        shipping_address, payment_method, payment_status, order_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', NOW(), NOW())`,
      {
        replacements: [
          orderNumber,
          customerId,
          resellerId || null,
          totalAmount,
          totalAmount,
          JSON.stringify(shippingAddress),
          paymentMethod
        ],
        type: QueryTypes.INSERT,
        transaction
      }
    );

    // Get created order ID
    const [order] = await sequelize.query(
      'SELECT id FROM orders WHERE order_number = ?',
      {
        replacements: [orderNumber],
        type: QueryTypes.SELECT,
        transaction
      }
    );
    const orderId = order.id;

    // Create order items with commission
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const commission = itemCommissions[i]?.totalCommission || 0;

      await sequelize.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price, subtotal, reseller_commission, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        {
          replacements: [
            orderId,
            item.productId,
            item.quantity,
            item.price,
            item.price * item.quantity,
            commission
          ],
          type: QueryTypes.INSERT,
          transaction
        }
      );

      // Update product stock
      await sequelize.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - ?
         WHERE id = ? AND stock_quantity >= ?`,
        {
          replacements: [item.quantity, item.productId, item.quantity],
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    }

    // Credit pending commission to reseller wallet
    if (resellerId && totalCommission > 0) {
      await creditPendingCommission(orderId, orderNumber, resellerId, totalCommission, sequelize, transaction);
    }

    // Update customer total orders and spent
    await sequelize.query(
      `UPDATE customers 
       SET total_orders = total_orders + 1,
           total_spent = total_spent + ?,
           updated_at = NOW()
       WHERE id = ?`,
      {
        replacements: [totalAmount, customerId],
        type: QueryTypes.UPDATE,
        transaction
      }
    );

    await transaction.commit();

    console.log('[Customer Order] Order created successfully:', orderNumber);

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully!',
      data: {
        orderId,
        orderNumber,
        totalAmount,
        isGuestOrder,
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('[Customer Order] Error creating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to place order',
      error: error.message
    });
  }
});

// @route   GET /api/customer/orders
// @desc    Get customer orders (requires authentication)
// @access  Private (Customer)
router.get('/orders', async (req, res) => {
  const sequelize = require('../config/database');

  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Get customer ID
    const [customer] = await sequelize.query(
      'SELECT id FROM customers WHERE user_id = ?',
      {
        replacements: [userId],
        type: QueryTypes.SELECT
      }
    );

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found',
      });
    }

    // Get orders
    const orders = await sequelize.query(
      `SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.final_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at,
        COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      {
        replacements: [customer.id],
        type: QueryTypes.SELECT
      }
    );

    res.json({
      status: 'success',
      data: {
        orders,
      }
    });

  } catch (error) {
    console.error('[Customer Orders] Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// @route   GET /api/customer/orders/:id
// @desc    Get order details
// @access  Private (Customer)
router.get('/orders/:id', async (req, res) => {
  const sequelize = require('../config/database');

  try {
    const { id } = req.params;

    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Get customer ID
    const [customer] = await sequelize.query(
      'SELECT id FROM customers WHERE user_id = ?',
      {
        replacements: [userId],
        type: QueryTypes.SELECT
      }
    );

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found',
      });
    }

    // Get order details
    const [order] = await sequelize.query(
      `SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.final_amount,
        o.shipping_address,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at,
        o.updated_at
       FROM orders o
       WHERE o.id = ? AND o.customer_id = ?`,
      {
        replacements: [id, customer.id],
        type: QueryTypes.SELECT
      }
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Get order items
    const items = await sequelize.query(
      `SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.subtotal,
        p.name as product_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );

    res.json({
      status: 'success',
      data: {
        order: {
          ...order,
          shipping_address: JSON.parse(order.shipping_address),
        },
        items,
      }
    });

  } catch (error) {
    console.error('[Customer Order Details] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

module.exports = router;
