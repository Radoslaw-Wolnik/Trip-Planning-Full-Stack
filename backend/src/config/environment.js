// src/config/environment.js
import dotenv from 'dotenv';

dotenv.config();

export default {
  DB_HOST: process.env.DB_HOST || 'mongo:27017',
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND: process.env.FRONTEND || 'http://localhost:5173',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '795ccf001@smtp-brevo.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'HPtac1DbV8wvsWZk',
  EMAIL_FROM: process.env.EMAIL_FROM || 'radoslaw.m.wolnik@gmail.com' // changed to radoslaw.m.wolnik@7953615.brevosend.com

  //EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  //EMAIL_PORT: process.env.EMAIL_PORT || 2525,
  //EMAIL_USER: process.env.EMAIL_USER || 'your_mailtrap_username',
  //EMAIL_PASS: process.env.EMAIL_PASS || 'your_mailtrap_password',
  //EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@yourapp.com'
};
