const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.fastmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'tennisclub_admin@fastmail.com',
      pass: 'cps2009admin',
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