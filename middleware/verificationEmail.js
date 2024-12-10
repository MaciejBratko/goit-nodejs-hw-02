const nodemailer = require('nodemailer');
require('dotenv').config();

const config = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;
  
  const emailOptions = {
    from: 'olaf4343@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  return transporter.sendMail(emailOptions);
};

module.exports = {
  sendVerificationEmail,
};
