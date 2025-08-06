const e = require('cors');
const nodemailer = require('nodemailer');

exports = {
  async sendEmail(emailPayload) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: `<p>${emailPayload.text}</p>`
    };

    await transporter.sendMail(mailOptions);
  },
};