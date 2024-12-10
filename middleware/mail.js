const nodemailer = require('nodemailer');

require('dotenv').config();

const config = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.TEST_SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(config);
const emailOptions = {
  from: 'olaf4343@gmail.com',
  to: 'olaf4343@proton.me',
  subject: 'Nodemailer test',
  text: 'Cześć. Testujemy wysyłanie wiadomości!',
};

transporter
  .sendMail(emailOptions)
  .then(info => console.log(info))
  .catch(err => console.log(err));
