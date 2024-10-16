import fs from 'fs/promises';
import path from 'path';
import { deleteFileFromStorage } from '../../../src/utils/delete-file.util';
import { UploadError } from '../../../src/utils/custom-errors.util';

jest.mock('fs/promises');
jest.mock('path');

describe('Delete File Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a file successfully', async () => {
    const mockFilePath = '/path/to/file.jpg';
    (path.join as jest.Mock).mockReturnValue('/full/path/to/file.jpg');
    (fs.unlink as jest.Mock).mockResolvedValue(undefined);

    await deleteFileFromStorage(mockFilePath);

    expect(path.join).toHaveBeenCalledWith(expect.any(String), 'public', mockFilePath);
    expect(fs.unlink).toHaveBeenCalledWith('/full/path/to/file.jpg');
  });

  it('should throw an UploadError if deletion fails', async () => {
    const mockFilePath = '/path/to/file.jpg';
    (path.join as jest.Mock).mockReturnValue('/full/path/to/file.jpg');
    (fs.unlink as jest.Mock).mockRejectedValue(new Error('File not found'));

    await expect(deleteFileFromStorage(mockFilePath)).rejects.toThrow(UploadError);
    await expect(deleteFileFromStorage(mockFilePath)).rejects.toThrow('Failed to delete file');
  });
});