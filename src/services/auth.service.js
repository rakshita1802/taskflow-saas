const bcrypt = require('bcryptjs');
const { User, RefreshToken, Organisation } = require('../models');
const tokenService = require('./token.service');

const register = async (userData) => {
  // Check if organisation exists
  const org = await Organisation.findByPk(userData.organisation_id);
  if (!org) {
    throw new Error('Organisation not found');
  }

  // Check if email already registered
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const password_hash = await bcrypt.hash(userData.password, 10);

  // Create user
  const user = await User.create({
    organisation_id: userData.organisation_id,
    name: userData.name,
    email: userData.email,
    password_hash,
    role: userData.role
  });

  // Generate tokens
  const tokens = tokenService.generateAuthTokens(user);

  // Store refresh token
  const decodedRefresh = require('jsonwebtoken').decode(tokens.refreshToken);
  await RefreshToken.create({
    user_id: user.id,
    token: tokens.refreshToken,
    expires_at: new Date(decodedRefresh.exp * 1000)
  });

  return { user, tokens };
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.is_active) {
    throw new Error('Invalid credentials or inactive user');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const tokens = tokenService.generateAuthTokens(user);

  const decodedRefresh = require('jsonwebtoken').decode(tokens.refreshToken);
  await RefreshToken.create({
    user_id: user.id,
    token: tokens.refreshToken,
    expires_at: new Date(decodedRefresh.exp * 1000)
  });

  return { user, tokens };
};

const logout = async (accessToken, refreshTokenString) => {
  // 1. Blacklist the access token
  if (accessToken) {
    await tokenService.blacklistToken(accessToken);
  }

  // 2. Remove refresh token from DB
  if (refreshTokenString) {
    await RefreshToken.destroy({ where: { token: refreshTokenString } });
  }
};

const refreshAuth = async (refreshTokenString) => {
  try {
    const payload = tokenService.verifyRefreshToken(refreshTokenString);
    
    // Check if token exists in DB
    const storedToken = await RefreshToken.findOne({ 
      where: { token: refreshTokenString, user_id: payload.sub } 
    });

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    const user = await User.findByPk(payload.sub);
    if (!user || !user.is_active) {
      throw new Error('User not found or inactive');
    }

    // Delete old refresh token
    await storedToken.destroy();

    // Generate new tokens
    const tokens = tokenService.generateAuthTokens(user);

    // Store new refresh token
    const decodedRefresh = require('jsonwebtoken').decode(tokens.refreshToken);
    await RefreshToken.create({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: new Date(decodedRefresh.exp * 1000)
    });

    return tokens;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAuth
};
