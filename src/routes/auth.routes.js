const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate'); // Needed for protected logout
const passport = require('passport');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh', authController.refreshToken);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  (req, res) => {
    // Redirect to the frontend with tokens in the URL query parameters
    const { user, tokens } = req.user;
    
    // In production, this should point to your actual frontend domain
    const frontendUrl = 'http://localhost:5173/oauth-callback';
    
    res.redirect(`${frontendUrl}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  }
);

// Protected routes
router.post('/logout', authenticate, authController.logoutUser);

module.exports = router;
