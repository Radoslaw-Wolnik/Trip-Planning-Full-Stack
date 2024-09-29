import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import environment from '../config/environment';

export const restoreDatabase = async () => {
  const backupDir = path.join(__dirname, '..', '..', 'database_backups');

  try {
    // Get list of backup files
    const files = await fs.readdir(backupDir);
    const backupFiles = files.filter(file => file.startsWith('backup_') && file.endsWith('.gz'));

    if (backupFiles.length === 0) {
      logger.info('No backup files found.');
      return;
    }

    // Sort backup files by date (newest first)
    backupFiles.sort((a, b) => b.localeCompare(a));

    // Use the most recent backup file
    const latestBackup = backupFiles[0];
    const backupPath = path.join(backupDir, latestBackup);

    // Construct mongorestore command
    const command = `mongorestore --host=${environment.database.host} --db=${environment.database.name} --username=${environment.database.user} --password=${environment.database.password} --gzip --archive=${backupPath} --drop`;

    // Execute mongorestore
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error restoring database: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr during database restore: ${stderr}`);
        return;
      }
      console.log(`Database restored successfully from ${backupPath}`);
    });
  } catch (error) {
    console.log('Error restoring database:', error.message);
  }
};