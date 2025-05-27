import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} from '../controllers';
import {
  validate,
  registerSchema,
  loginSchema,
  updateUserSchema,
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

export default router;
