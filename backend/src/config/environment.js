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
  FRONTEND: process.env.FORNTEND || 'http://localhost:5173',

  EMAIL_HOST: 'smtp-relay.brevo.com',
  EMAIL_PORT: 587,
  EMAIL_USER: '795ccf001@smtp-brevo.com',
  EMAIL_PASS: 'HPtac1DbV8wvsWZk',
  EMAIL_FROM: 'noreply@devdomain.com'
};
