// Order utility functions for status validation and helpers

export const ORDER_STATUS = {
  NEW: 'new',
  ACCEPTED: 'accepted',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Status color mappings
export const getStatusColor = (status) => {
  const colors = {
    [ORDER_STATUS.NEW]: 'gray',
    [ORDER_STATUS.ACCEPTED]: 'blue',
    [ORDER_STATUS.PROCESSING]: 'yellow',
    [ORDER_STATUS.SHIPPED]: 'purple',
    [ORDER_STATUS.DELIVERED]: 'green',
    [ORDER_STATUS.CANCELLED]: 'red',
    [ORDER_STATUS.RETURNED]: 'orange'
  };
  return colors[status] || 'gray';
};

// Get available actions based on current status
export const getAvailableActions = (currentStatus) => {
  const actions = {
    [ORDER_STATUS.NEW]: ['accept', 'cancel'],
    [ORDER_STATUS.ACCEPTED]: ['updateToProcessing', 'cancel'],
    [ORDER_STATUS.PROCESSING]: ['ship', 'cancel'],
    [ORDER_STATUS.SHIPPED]: ['deliver'],
    [ORDER_STATUS.DELIVERED]: ['return'],
    [ORDER_STATUS.CANCELLED]: [],
    [ORDER_STATUS.RETURNED]: []
  };
  return actions[currentStatus] || [];
};

// Check if status transition is valid
export const canTransitionTo = (currentStatus, newStatus) => {
  const validTransitions = {
    [ORDER_STATUS.NEW]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURNED],
    [ORDER_STATUS.CANCELLED]: [],
    [ORDER_STATUS.RETURNED]: []
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

// Format order date
export const formatOrderDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  if (typeof address === 'string') return address;
  
  const { line1, line2, city, state, pincode, country } = address;
  const parts = [line1, line2, city, state, pincode, country].filter(Boolean);
  return parts.join(', ');
};

// Format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${Number.parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Get status label
export const getStatusLabel = (status) => {
  const labels = {
    [ORDER_STATUS.NEW]: 'New Order',
    [ORDER_STATUS.ACCEPTED]: 'Accepted',
    [ORDER_STATUS.PROCESSING]: 'Processing',
    [ORDER_STATUS.SHIPPED]: 'Shipped',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
    [ORDER_STATUS.RETURNED]: 'Returned'
  };
  return labels[status] || status;
};

// Courier partner options
export const COURIER_PARTNERS = [
  { value: 'Blue Dart', label: 'Blue Dart' },
  { value: 'Delhivery', label: 'Delhivery' },
  { value: 'DTDC', label: 'DTDC' },
  { value: 'India Post', label: 'India Post' },
  { value: 'FedEx', label: 'FedEx' },
  { value: 'Ekart', label: 'Ekart' },
  { value: 'Professional Couriers', label: 'Professional Couriers' },
  { value: 'Aramex', label: 'Aramex' },
  { value: 'Other', label: 'Other' }
];
