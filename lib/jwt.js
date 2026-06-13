import jwt from 'jsonwebtoken';

export function generateToken(payload, expiresIn = process.env.JWT_EXPIRE) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
}
