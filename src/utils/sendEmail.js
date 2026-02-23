const nodemailer = require('nodemailer');
const ApiError = require('./ApiError');
const { status: httpStatus } = require('http-status');

let transporter;
const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email service is not configured properly');
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (email, subject, html) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
