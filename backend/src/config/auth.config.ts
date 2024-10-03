
export interface AuthConfig {
    jwtSecret: string;
    encryptionKey: string;
    oldKey: string | null;
};

export const authConfig: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    oldKey: process.env.OLD_KEY || '',
}