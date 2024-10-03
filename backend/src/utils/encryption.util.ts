import crypto from 'crypto';
import environment from '../config/environment';

const ENCRYPTION_KEY = environment.auth.encryptionKey // Must be 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16


export async function encrypt(text: string): Promise<string> {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    throw new Error('Encryption failed');
  }
}
  
export async function decrypt(text: string, key: string = environment.auth.encryptionKey!): Promise<string> {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    throw new Error('Decryption failed');
  }
}


export async function hashEmail(email: string): Promise<string> {
  return crypto.createHash('sha256').update(email).digest('hex');
}