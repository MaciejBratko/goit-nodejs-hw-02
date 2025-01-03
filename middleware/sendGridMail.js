const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.TEST_SENDGRID_API_KEY);

const msg = {
  from: 'olaf4343@gmail.com',
  to: 'olaf4343@proton.me',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch(error => {
    console.error(error);
  });
