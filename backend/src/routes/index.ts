import { Router } from 'express';
import authRoutes from './auth';
import foodTruckRoutes from './foodTrucks';
import eventRoutes from './events';
import reviewRoutes from './reviews';
import menuRoutes from './menu';
import ownerRoutes from './owner';
import adminRoutes from './admin';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DishRated API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/trucks', foodTruckRoutes);
router.use('/events', eventRoutes);
router.use('/reviews', reviewRoutes);
router.use('/trucks', menuRoutes); // Menu routes are nested under trucks
router.use('/owner', ownerRoutes);
router.use('/admin', adminRoutes);

export default router;
