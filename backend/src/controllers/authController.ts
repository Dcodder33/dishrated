import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils';
import { asyncHandler, createError } from '../middleware';
import { ApiResponse } from '../types';

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
