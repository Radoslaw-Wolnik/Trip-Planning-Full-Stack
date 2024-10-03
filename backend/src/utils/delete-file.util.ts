import fs from 'fs/promises';
import path from 'path';
import { UploadError } from './custom-errors.util';

export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  try {
    // not sure if i should have full pathe here or not
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new UploadError('Failed to delete file');
  }
};