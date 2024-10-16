import { Response, NextFunction, Request } from 'express';
// import { AuthRequest } from '../types/global';
import User from '../models/user.model';
import { NotFoundError, UnauthorizedError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const userWithoutPassword = req.user.toObject();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { username, email } = req.body;

    req.user.username = username || req.user.username;
    req.user.email = email || req.user.email;

    await req.user.save();

    const userWithoutPassword = req.user.toObject();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const deactivateAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    req.user.deactivated = new Date();
    req.user.deactivationToken = crypto.randomBytes(20).toString('hex');
    req.user.deactivationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await req.user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const reactivateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      deactivationToken: token,
      deactivationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new NotFoundError('Invalid or expired reactivation token');
    }

    user.deactivated = undefined;
    user.deactivationToken = undefined;
    user.deactivationExpires = undefined;

    await user.save();

    res.json({ message: 'Account reactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLastActiveTime = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    req.user.lastTimeActive = new Date();
    await req.user.save();

    res.json({ message: 'Last active time updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req: AuthRequestWithFile, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store the relative path in the database
    const relativePath = `/uploads/users/${req.user.id}/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    res.json({ 
      message: 'Profile picture updated successfully', 
      profilePicture: relativePath 
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};