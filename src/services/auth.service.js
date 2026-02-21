const { status: httpStatus } = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const dayjs = require('dayjs');
const { tokenTypes } = require('../config/tokens');
const User=require('../models/user.model');
const config = require('../config/config');

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

const forgetPassword =async(email)=>{
  const user= await User.findOne({email});
  if(!user) return ;

  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minute');
   const resetToken= await tokenService.generateToken(user,accessTokenExpires,tokenTypes.FORGET_PASSWORD,config.jwt.password);
  await user.save();
const resetUrl = `${config.client.url}/reset-password?token=${resetToken}`;


return resetUrl;
}

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  forgetPassword
};
