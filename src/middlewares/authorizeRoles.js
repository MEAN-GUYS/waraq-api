const ApiError = require('../utils/ApiError');
const { status: httpStatus } = require('http-status');

const authorizeRoles =
  (allowedRoles, options = {}) =>
  (req, res, next) => {
    const user = req.user;

    const hasRole = allowedRoles.includes(user.role);
    let isOwner = false;
    if (options.allowOwner) {
      const reqUserId = req.params.userId;
      if (reqUserId === user.id) {
        isOwner = true;
      }
    }
    if (!hasRole && !isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
    next();
  };

module.exports = authorizeRoles;
