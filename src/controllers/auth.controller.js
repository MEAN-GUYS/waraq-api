const { status: httpStatus } = require('http-status');
const { authService, userService, tokenService } = require('../services');

const register = async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens = async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
};
const forgetPassword = async (req, res) => {
  await authService.forgetPassword(req.body.email);
  res.send({ message: 'If this email exists, you will receive a reset link shortly.' });
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgetPassword,
};
