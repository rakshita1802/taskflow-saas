const jwt = require('jsonwebtoken');
const config = require('../config/env');
const redisClient = require('../config/redis');

/**
 * Generate a pair of tokens (Access and Refresh)
 */
const generateAuthTokens = (user) => {
  const payload = {
    sub: user.id,
    org: user.organisation_id,
    role: user.role
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });

  return { accessToken, refreshToken };
};

/**
 * Verify an Access Token
 */
const verifyToken = async (token) => {
  // Check if token is blacklisted in Redis
  const isBlacklisted = await redisClient.get(`bl_${token}`);
  if (isBlacklisted) {
    throw new Error('Token is blacklisted');
  }
  
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Verify a Refresh Token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

/**
 * Blacklist an Access Token (for logout)
 */
const blacklistToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return;

    // Calculate time to live (ttl) for Redis in seconds
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redisClient.setEx(`bl_${token}`, ttl, 'true');
    }
  } catch (error) {
    console.error('Error blacklisting token:', error);
  }
};

module.exports = {
  generateAuthTokens,
  verifyToken,
  verifyRefreshToken,
  blacklistToken
};
