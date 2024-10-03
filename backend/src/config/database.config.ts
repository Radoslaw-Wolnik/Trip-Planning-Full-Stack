export interface DatabaseConfig {
    host: string;
    name: string;
    user: string;
    password: string;
    uri: string;
  };

export const databaseConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'mongo:27017',
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    get uri() {
        return `mongodb://${this.user}:${this.password}@${this.host}/${this.name}`;
    },
}