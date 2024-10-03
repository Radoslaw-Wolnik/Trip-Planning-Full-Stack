// import sth to get process.env

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production';
  frontend: string;
  backend: string;
};

export const appConfig: AppConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontend: process.env.FRONTEND || 'http://localhost:5173',
  backend: process.env.BACKEND,
}
