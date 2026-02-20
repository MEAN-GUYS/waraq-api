const nodemailer = require('nodemailer');
const ApiError = require('./ApiError');
const { status: httpStatus } = require('http-status');
const config = require('../config/config');

if (!config.email.user || !config.email.pass) {
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email service is not configured properly');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (email, subject, html) => {
  await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
