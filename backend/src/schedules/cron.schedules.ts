import { deleteDeactivatedUsers } from '../jobs/delete-deactivated-users.job';
import { cleanupRevokedTokens } from '../jobs/cleanup-revoked-tokens.job';
import { backupDatabase } from '../jobs/backup-database.job';
import { restoreDatabase } from '../jobs/restore-database.job';

export const cronSchedules = [
  {
    name: 'Delete Deactivated Users',
    schedule: '0 0 * * 0', // Run every Sunday at midnight
    job: deleteDeactivatedUsers
  },
  {
    name: 'Cleanup Revoked Tokens',
    schedule: '0 0 * * *', // Run daily at midnight
    job: cleanupRevokedTokens
  }

  /*
   * {
   *   name: 'Backup Database',
   *   schedule: '0 2 * * *', // Run daily at 2 AM
   *   job: backupDatabase
   * }
   */
  
];

export const manualJobs = {
  backupDatabase,
  restoreDatabase
};