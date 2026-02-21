const { status: httpStatus } = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !authHeader.startsWith('Bearer')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide a token');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const { sub: user, type } = payload;

  if (type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }
  req.user = user;
  next();
};

module.exports = auth;
