import { Router } from 'express';
import {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
} from '../controllers';
import {
  validate,
  addMenuItemSchema,
  updateMenuItemSchema,
  authenticate,
  authorize
} from '../middleware';

const router = Router();

// @route   GET /api/trucks/:truckId/menu
router.get('/:truckId/menu', getMenu);

// @route   POST /api/trucks/:truckId/menu
router.post(
  '/:truckId/menu',
  authenticate,
  authorize('owner', 'admin'),
  validate(addMenuItemSchema),
  addMenuItem
);

// @route   PUT /api/trucks/:truckId/menu/:itemId
router.put(
  '/:truckId/menu/:itemId',
  authenticate,
  authorize('owner', 'admin'),
  validate(updateMenuItemSchema),
  updateMenuItem
);

// @route   DELETE /api/trucks/:truckId/menu/:itemId
router.delete(
  '/:truckId/menu/:itemId',
  authenticate,
  authorize('owner', 'admin'),
  deleteMenuItem
);

// @route   PATCH /api/trucks/:truckId/menu/:itemId/toggle
router.patch(
  '/:truckId/menu/:itemId/toggle',
  authenticate,
  authorize('owner', 'admin'),
  toggleMenuItemAvailability
);

export default router;
