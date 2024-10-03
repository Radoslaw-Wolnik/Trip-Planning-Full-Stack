// src/config/environment.ts

import { appConfig, AppConfig } from './app.config';
import { authConfig, AuthConfig } from './auth.config';
import { databaseConfig, DatabaseConfig } from './database.config';
import { emailConfig, EmailConfig } from './email.config';

export interface Environment {
  app: AppConfig
  database: DatabaseConfig
  auth: AuthConfig
  email: EmailConfig
  socket: {
    port: number;
  };
  redis: {
    url: string;
  };
}

export const environment: Environment = {
  auth: authConfig,
  app: appConfig,
  database: databaseConfig,
  email: emailConfig,
  socket: socketConfig,
  redis: redisConfig
};

export default environment;