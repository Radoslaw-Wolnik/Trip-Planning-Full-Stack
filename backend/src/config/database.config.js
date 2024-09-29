
export const databaseConfig = {
    DB_HOST: process.env.DB_HOST || 'mongo:27017',
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    get uri() {
        return `mongodb://${this.user}:${this.password}@${this.host}/${this.name}`;
    },
}