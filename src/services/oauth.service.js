const { User, Organisation, RefreshToken } = require('../models');
const tokenService = require('./token.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const handleGoogleOAuth = async (profile) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  
  if (!email) {
    throw new Error('No email found in Google profile');
  }

  let user = await User.findOne({ where: { email } });

  // If user doesn't exist, we auto-provision a new tenant for them
  if (!user) {
    const org = await Organisation.create({
      name: `${profile.displayName}'s Organisation`
    });

    // Generate a random password since they use OAuth
    const randomPassword = crypto.randomUUID();
    const password_hash = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      organisation_id: org.id,
      name: profile.displayName,
      email: email,
      password_hash: password_hash,
      role: 'admin', // First user in auto-provisioned org is admin
      is_active: true
    });
  } else if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  // Generate our system's JWT tokens
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

module.exports = {
  handleGoogleOAuth
};
