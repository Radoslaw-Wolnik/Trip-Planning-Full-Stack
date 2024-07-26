// utils/sendEmail.js
import nodemailer from 'nodemailer';
import env from '../config/environment.js';

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

export default sendEmail;