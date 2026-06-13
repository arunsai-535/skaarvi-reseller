const { verifyToken } = require('../utils/jwt');
const { ROLES } = require('../config/constants');

// Verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

// Check if user is a manufacturer
const manufacturerOnly = (req, res, next) => {
  if (req.user.role !== ROLES.MANUFACTURER) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Manufacturers only'
    });
  }
  next();
};

// Check if user is an admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admins only'
    });
  }
  next();
};

// Check if user is admin or manufacturer
const adminOrManufacturer = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.MANUFACTURER) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  manufacturerOnly,
  adminOnly,
  adminOrManufacturer
};
