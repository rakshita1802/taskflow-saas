const tokenService = require('../services/token.service');
const ApiResponse = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = await tokenService.verifyToken(token);
    
    // Attach user payload to request
    req.user = {
      id: decoded.sub,
      organisation_id: decoded.org,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.message === 'Token is blacklisted') {
      return res.status(401).json(new ApiResponse(401, null, 'Token is blacklisted (logged out)'));
    }
    return res.status(401).json(new ApiResponse(401, null, 'Invalid or expired token'));
  }
};

module.exports = authenticate;
