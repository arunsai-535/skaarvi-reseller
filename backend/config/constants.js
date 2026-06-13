module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    MANUFACTURER: 'manufacturer',
    RESELLER: 'reseller',
    CUSTOMER: 'customer'
  },

  // Manufacturer Status
  MANUFACTURER_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },

  // Product Status
  PRODUCT_STATUS: {
    DRAFT: 'draft',
    PENDING_APPROVAL: 'pending_approval',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    INACTIVE: 'inactive'
  },

  // Order Status
  ORDER_STATUS: {
    NEW: 'new',
    ACCEPTED: 'accepted',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Settlement Status
  SETTLEMENT_STATUS: {
    PENDING: 'pending',
    PROCESSED: 'processed',
    PAID: 'paid'
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    ACCOUNT_APPROVED: 'account_approved',
    ACCOUNT_REJECTED: 'account_rejected',
    PRODUCT_APPROVED: 'product_approved',
    PRODUCT_REJECTED: 'product_rejected',
    NEW_ORDER: 'new_order',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    SETTLEMENT_PROCESSED: 'settlement_processed',
    LOW_STOCK_ALERT: 'low_stock_alert'
  },

  // File Upload Limits
  UPLOAD_LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_IMAGES_PER_PRODUCT: 10,
    MAX_VIDEOS_PER_PRODUCT: 3
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // Platform Settings
  PLATFORM: {
    DEFAULT_FEE_PERCENTAGE: 5,
    DEFAULT_RESELLER_COMMISSION: 10,
    LOW_STOCK_THRESHOLD: 10,
    SETTLEMENT_HOLD_DAYS: 7
  }
};
