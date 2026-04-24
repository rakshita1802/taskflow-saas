const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { register, login, refresh } = require('../validators/auth.validator');

const registerUser = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = register.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  const { user, tokens } = await authService.register(value);
  
  // Omit password hash from response
  const userResponse = user.toJSON();
  delete userResponse.password_hash;

  res.status(201).json(new ApiResponse(201, { user: userResponse, tokens }, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error, value } = login.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  try {
    const { user, tokens } = await authService.login(value.email, value.password);
    
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.status(200).json(new ApiResponse(200, { user: userResponse, tokens }, 'Login successful'));
  } catch (err) {
    res.status(401).json(new ApiResponse(401, null, err.message));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  // Access token comes from authenticate middleware usually, but we extract from header here
  const authHeader = req.headers.authorization;
  const accessToken = authHeader ? authHeader.split(' ')[1] : null;
  const { refreshToken } = req.body; // Can also be in cookies depending on impl

  await authService.logout(accessToken, refreshToken);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { error, value } = refresh.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  try {
    const tokens = await authService.refreshAuth(value.refreshToken);
    res.status(200).json(new ApiResponse(200, { tokens }, 'Tokens refreshed'));
  } catch (err) {
    res.status(401).json(new ApiResponse(401, null, err.message));
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
};
