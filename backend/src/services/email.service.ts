// utils/sendEmail.js
import nodemailer from 'nodemailer';
import environment from '../config/environment';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: environment.email.host,
  port: environment.email.port,
  auth: {
    user: environment.email.user,
    pass: environment.email.password,
  }
});

const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<nodemailer.SentMessageInfo> => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: environment.email.from,
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
