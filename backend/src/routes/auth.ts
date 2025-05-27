import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controllers';
import {
  validate,
  registerSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  authenticate
} from '../middleware';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// @route   GET /api/auth/me
router.get('/me', authenticate, getMe);

// @route   PUT /api/auth/me
router.put('/me', authenticate, validate(updateUserSchema), updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', authenticate, changePassword);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

// @route   POST /api/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
