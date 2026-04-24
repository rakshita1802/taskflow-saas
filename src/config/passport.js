const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const oauthService = require('../services/oauth.service');

// We use process.env values, or dummy fallbacks if not configured in .env yet
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy_client_id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Pass the Google profile to our oauth service
      const { user, tokens } = await oauthService.handleGoogleOAuth(profile);
      
      // We pass our system's user and tokens down the middleware chain
      return done(null, { user, tokens });
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
