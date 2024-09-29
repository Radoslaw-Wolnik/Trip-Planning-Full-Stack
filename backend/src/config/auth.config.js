
export const authConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    OLD_KEY: process.env.OLD_KEY || '',
}