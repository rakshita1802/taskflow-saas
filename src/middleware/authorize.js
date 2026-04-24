const ApiResponse = require('../utils/apiResponse');
const { ROLE_PERMISSIONS } = require('../constants/roles');

/**
 * Middleware to check if the user has the required permission(s).
 * @param {string | string[]} requiredPermissions - The permission(s) required to access the route.
 */
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json(new ApiResponse(401, null, 'Unauthorized'));
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const permsToCheck = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    // Check if user has ALL required permissions
    const hasPermission = permsToCheck.every(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json(new ApiResponse(403, null, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};

module.exports = authorize;
