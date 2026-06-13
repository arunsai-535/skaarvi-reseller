const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};
