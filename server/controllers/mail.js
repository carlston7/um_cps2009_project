const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    }
  });

exports.send_booking_confirmation = async (mailOptions) => { // rename to send_email
    try {
        const mail = await transporter.sendMail(mailOptions);
        return mail;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while sending the booking confirmation.');
    }
};

exports.send_booking_invites = async (inviter_email, court_name, date, time, booking_id, invite_list) => {
  try {

    if (invite_list !== 0) {

      await Promise.all(invite_list.map(async (email) => {
        const mailInviteOptions = {
          from: 'manager.tennisclub@gmail.com',
          to: `${email}`,
          subject: 'Tennis Match Invitation',
          html: `
                  <h4>You have received an invitation from ${inviter_email} for the following tennis match:</h4>
                  <p>Court Name: ${court_name}</p>
                  <p>Date: ${date}</p>
                  <p>Time: ${time}</p>
                  <p>Click on the following link to accept or reject the invite:</p>
                  <a href="https://cps2009project.azurewebsites.net/accept-bill?_id=${booking_id}&email_address=${email}">Confirm Invitation</a>
                `
        };

        await transporter.sendMail(mailInviteOptions);

      }));
    }else {
      return;
    }
  } catch (e) {
      console.error(e);
      throw new Error('A problem was encountered while sending the invites.');
  }
};