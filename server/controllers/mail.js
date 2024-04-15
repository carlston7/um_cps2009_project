const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    }
  });

exports.send_booking_confirmation = async (mailOptions) => {
    try {
        const mail = await transporter.sendMail(mailOptions);
        return mail;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while sending the booking confirmation.')
    }
};