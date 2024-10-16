import { encrypt, decrypt, hashEmail } from '../../../src/utils/encryption.util';

describe('Encryption Utility', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'password123';

  it('should encrypt and decrypt a string', async () => {
    const encrypted = await encrypt(testPassword);
    expect(encrypted).not.toBe(testPassword);

    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(testPassword);
  });

  it('should throw an error when decrypting with wrong key', async () => {
    const encrypted = await encrypt(testPassword);
    await expect(decrypt(encrypted, 'wrong_key')).rejects.toThrow('Decryption failed');
  });

  it('should hash an email consistently', async () => {
    const hash1 = await hashEmail(testEmail);
    const hash2 = await hashEmail(testEmail);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different emails', async () => {
    const hash1 = await hashEmail(testEmail);
    const hash2 = await hashEmail('another@example.com');
    expect(hash1).not.toBe(hash2);
  });
});