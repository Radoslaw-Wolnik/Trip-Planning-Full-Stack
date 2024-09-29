// src/config/environment.js
import dotenv from 'dotenv';

import { appConfig } from './app.config';
import { authConfig } from './auth.config';
import { databaseConfig } from './database.config';
import { emailConfig } from './email.config';

dotenv.config();

export default {
  auth: authConfig,
  app: appConfig,
  database: databaseConfig,
  email: emailConfig,
};
