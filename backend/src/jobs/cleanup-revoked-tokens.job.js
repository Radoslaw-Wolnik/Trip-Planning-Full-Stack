// utils/cleanupRevokedTokens.js
import RevokedToken from '../models/RevokedToken.js';

const cleanupRevokedTokens = async () => {
  try {
    await RevokedToken.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log('Cleaned up expired revoked tokens');
  } catch (error) {
    console.error('Error cleaning up revoked tokens:', error);
  }
};

export default cleanupRevokedTokens;

// Run this cleanup job periodically (e.g., daily) using a scheduler like node-cron.