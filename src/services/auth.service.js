const { status: httpStatus } = require('http-status');
const jwt = require('jsonwebtoken');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const dayjs = require('dayjs');
const { tokenTypes } = require('../config/tokens');
const User = require('../models/user.model');
const config = require('../config/config');
const { resetPasswordEmail } = require('../utils/templateEmail');
const sendEmail = require('../utils/sendEmail');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const forgetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;
  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minute');
  const resetToken = tokenService.generateToken(user, accessTokenExpires, tokenTypes.FORGET_PASSWORD);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, 'Reset Your Password', resetPasswordEmail(resetUrl));

  return resetUrl;
};

const resetPassword = async (token, newPassword) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload.type !== tokenTypes.FORGET_PASSWORD) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reset token');
  }
  const user = await User.findById(payload.sub.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  forgetPassword,
  resetPassword,
};
