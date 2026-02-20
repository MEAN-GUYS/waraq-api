const { status: httpStatus } = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { roleRights } = require('../config/roles');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const authenticateJwt = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide a token');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const { sub: userId, type } = payload;

  if (type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  return user;
};

const checkPermissions = (user, requiredRights, requestedUserId) => {
  if (!requiredRights.length) return;

  const userRights = roleRights.get(user.role);
  const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
  if (!hasRequiredRights && requestedUserId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
};

const auth = (...requiredRights) => {
  return async (req, res, next) => {
    const user = await authenticateJwt(req);
    checkPermissions(user, requiredRights, req.params.userId);
    req.user = user;
    next();
  };
};

module.exports = auth;
