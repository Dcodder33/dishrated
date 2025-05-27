import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models';
import { generateToken } from '../utils';
import { asyncHandler, createError } from '../middleware';
import { ApiResponse } from '../types';
import { emailService } from '../services/emailService';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone
  });

  // Generate token
  const token = generateToken(user);

  const response: ApiResponse = {
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  };

  res.status(201).json(response);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken(user);

  // Remove password from response
  user.password = undefined as any;

  const response: ApiResponse = {
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  };

  res.json(response);
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: req.user
    }
  };

  res.json(response);
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user!._id,
    {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(preferences && { preferences })
    },
    {
      new: true,
      runValidators: true
    }
  );

  const response: ApiResponse = {
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  };

  res.json(response);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user!._id).select('+password');
  if (!user) {
    throw createError('User not found', 404);
  }

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw createError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully'
  };

  res.json(response);
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    const response: ApiResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };
    return res.json(response);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set expiry (1 hour)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.save({ validateBeforeSave: false });

  try {
    // Send email
    await emailService.sendPasswordResetEmail(user, resetToken);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset email sent successfully',
      // Include reset URL in development for testing
      ...(process.env.NODE_ENV === 'development' && {
        data: {
          resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`,
          note: 'This URL is only shown in development mode for testing purposes'
        }
      })
    };

    res.json(response);
  } catch (error) {
    // Clear reset token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw createError('Email could not be sent. Please try again later.', 500);
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw createError('Token and password are required', 400);
  }

  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw createError('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // Generate new JWT token
  const jwtToken = generateToken(user);

  const response: ApiResponse = {
    success: true,
    message: 'Password reset successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: jwtToken
    }
  };

  res.json(response);
});