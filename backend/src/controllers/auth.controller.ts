// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/user.model';
import RevokedToken from '../models/revoked-token.model';
import AuthRequest from '../types/global';
import { generateToken, setTokenCookie, refreshToken as refreshAuthToken, generateShortLivedToken, setShortLivedTokenCookie } from '../middleware/auth.middleware';
import environment from '../config/environment';

import { ValidationError, UnauthorizedError, NotFoundError, ConflictError, InternalServerError, AuthenticationError, CustomError, BadRequestError, ResourceExistsError, GoneError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { env } from 'process';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface PostRegLoginRequest extends Request {
  user?: IUserDocument; // Set by handlePostRegistrationAuth middleware
}

export const login = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    // Find user by email hash and compare at the same time
    const user = await User.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Failed login attempt', { email: req.body.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if email is verified 
    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your email before logging in');
    }

    // Update lastTimeActive
    user.lastTimeActive = new Date();
    await user.save();

    // Create and return JWT token
    const token = generateToken(user);
    setTokenCookie(res, token);

    logger.info('User logged in successfully', { userId: user._id });
    res.json({ message: 'Login successful', user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const postRegistrationLogin = async (req: PostRegLoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    // User is already authenticated via short-lived token
    res.json({ 
      message: 'Login successful', 
      user: { id: req.user._id, role: req.user.role, isVerified: req.user.isVerified }
    });

  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error in post-registration login'));
  }
};


export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    //const token = req.headers.authorization.split(' ')[1];
    //const token = extractToken(req);
    const token = req.cookies.token;
    if (!token) {
      throw new ValidationError('No token provided');
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      throw new ValidationError('Invalid token');
    }

    // Add the token to the revoked tokens list
    await RevokedToken.create({
      token: token,
      expiresAt: new Date((decodedToken as jwt.JwtPayload).exp! * 1000)
    });
    //console.log("Succes at revoking the token");

    //res.clearCookie('token');
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    logger.info('User logged out', { userId: req.user?.id });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    if (error instanceof Error && (error as any).code === 11000) {
      next(new ConflictError('Token already revoked'));
    } else {
      next(error instanceof CustomError ? error : new InternalServerError('Error during logout'));
    }
  }
};

interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

export const register = async (req: RegisterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new BadRequestError('Username, email, and password are required');
    }

    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      if (user.isAnonymous) {
        // Update anonymous user
        user.username = username;
        user.password = password;
        user.isAnonymous = false;
        user.isVerified = false; // Require or not require the email-verification? verification 
      } else {
        throw new BadRequestError('User already exists');
      }
    } else {
      // Create new user
      user = new User({ username, email, password });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(verificationTokenExpires);

    await user.save();
    logger.info('New user registered', { userId: user._id, username: user.username });

    // Generate a short-lived token and set it as a cookie
    const shortLivedToken = generateShortLivedToken(user);
    setShortLivedTokenCookie(res, shortLivedToken);

    // console.log('Attempting to send email to:', user.email);
    //console.log('Verification URL:', verificationUrl);

    // Send verification email
    // await sendVerificationEmail(user.email, verificationToken);
    await environment.email.service?.sendTemplatedEmail(
      email,
      'verifyEmail',
      { verificationUrl: `${environment.app.frontend}/verify-email/${verificationToken}` }
    );

    console.log('Email sent successfully');

    res.status(201).json({ 
      message: 'User registered. Please check your email to verify your account.'
    });
  } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // Use the existing refreshToken function from the auth module
  try {
    await refreshAuthToken(req, res);
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Failed to refresh token'));
  }
};

export const sendVerificationEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new InternalServerError('User not attached to request');
    }

    if (req.user.isVerified) {
      throw new ConflictError('Email already verified');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    req.user.verificationToken = verificationToken;
    req.user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await req.user.save();

    const decryptedEmail = await req.user.getDecryptedEmail();

    await environment.email.service?.sendTemplatedEmail(
      decryptedEmail,
      'verifyEmail',
      { verificationUrl: `${environment.app.frontend}/verify-email/${verificationToken}` }
    );

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error sending verification email'));
  }
};

interface VerifyEmailRequest extends Request {
  params: {
    token: string;
  };
}

export const verifyEmail = async (req: VerifyEmailRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new GoneError('Verification token has expired or is invalid');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    logger.info('User email verified', { userId: user._id });

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error verifying email'));
  }
};

interface ChangePasswordRequest extends AuthRequest {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

export const changePassword = async (req: ChangePasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new InternalServerError('User not attached to request');
    }

    const { currentPassword, newPassword } = req.body;
    // im not sure about bcrypt.compare becouse the current password wont be salted

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect');
    }

    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error changing password'));
  }
};

interface RequestPasswordResetRequest extends Request {
  body: {
    email: string;
  };
}

export const requestPasswordReset = async (req: RequestPasswordResetRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    const { email } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      throw new NotFoundError('User');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    
    await environment.email.service?.sendTemplatedEmail(
      email,
      'passwordReset',
      { verificationUrl: `${environment.app.frontend}/reset-password/${resetToken}` }
    );

    logger.info('Requested password reset for', { email: email });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error requesting password reset'));
  }
};

interface ResetPasswordRequest extends Request {
  params: {
    token: string;
  };
  body: {
    password: string;
  };
}

export const resetPassword = async (req: ResetPasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Password reset successful', { userId: user._id });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error resetting password'));
  }
};


interface CreateOwnerRequest extends AuthRequest {
  body: {
    username: string;
    email: string;
    password: string;
  }
}

export const createOwner = async (req: CreateOwnerRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new BadRequestError('Username, email, and password are required');
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ResourceExistsError('User already exists');
    }

    const newOwner = new User({
      username,
      email,
      password,
      role: 'owner',
      isVerified: true // Owners are automatically verified
    });

    await newOwner.save();
    logger.info('New owner account created', { createdBy: req.user?.id, newOwnerId: newOwner._id });

    res.status(201).json({ message: 'Owner account created successfully', ownerId: newOwner._id });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error creating owner account'));
  }
};

// one Time Log-in loginc
export const createMagicLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    let user = await User.findByEmail(email);

    if (!user) {
      // Create a new anonymous user
      user = new User({ email, isAnonymous: true });
      await user.save();
    }

    const magicToken = crypto.randomBytes(20).toString('hex');
    user.oneTimeLoginToken = magicToken;
    user.oneTimeLoginExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    await environment.email.service?.sendTemplatedEmail(
      email,
      'magicLink',
      { verificationUrl: `${environment.app.frontend}/magic-login/${magicToken}` }
    );


    logger.info('Magic link created for', { email });
    res.json({ message: 'Magic link sent to your email' });
  } catch (error) {
    next(error);
  }
};



export const loginWithMagicLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired magic link');
    }

    user.oneTimeLoginToken = undefined;
    user.oneTimeLoginExpires = undefined;
    user.lastTimeActive = new Date();
    await user.save();

    const authToken = generateToken(user);
    setTokenCookie(res, authToken);

    logger.info('User logged in with magic link', { userId: user._id });
    res.json({ message: 'Login successful', user: { id: user._id, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const requestAccountDeactivation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new BadRequestError('User not authenticated');
    }

    const deactivationToken = crypto.randomBytes(20).toString('hex');
    req.user.deactivationToken = deactivationToken;
    req.user.deactivationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await req.user.save();

    const decryptedEmail = await req.user.getDecryptedEmail();

    await environment.email.service?.sendTemplatedEmail(
      decryptedEmail,
      'accountDeactivation',
      { deactivationUrl: `${environment.app.frontend}/deactivate-account/${deactivationToken}` }
    );

    logger.info('Account deactivation requested', { userId: req.user._id });
    res.json({ message: 'Account deactivation email sent' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error requesting account deactivation'));
  }
};

export const deactivateAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      deactivationToken: token,
      deactivationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired deactivation token');
    }

    user.deactivated = new Date();
    user.deactivationToken = undefined;
    user.deactivationExpires = undefined;
    await user.save();

    logger.info('Account deactivated', { userId: user._id });
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error deactivating account'));
  }
};