const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'manager.tennisclub@gmail.com',
      pass: 'mstn tgmh xoxp kkfj',
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