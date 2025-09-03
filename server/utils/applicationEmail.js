// utils/mailer.js
const nodemailer = require('nodemailer');
const { EMAIL, EMAIL_PASS } = require('./config');

// Use secure config/env values in production!
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
   user: EMAIL,
    pass: EMAIL_PASS  
  }
});

async function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: `"Company Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = { sendEmail };
