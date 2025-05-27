import { Request, Response } from 'express';
import { FoodTruck } from '../models';
import { asyncHandler, createError } from '../middleware';
import { ApiResponse } from '../types';

// @desc    Get food truck menu
// @route   GET /api/trucks/:truckId/menu
// @access  Public
export const getMenu = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.truckId).select('menu name');

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Menu retrieved successfully',
    data: {
      menu: truck.menu,
      truckName: truck.name
    }
  };

  res.json(response);
});

// @desc    Add menu item
// @route   POST /api/trucks/:truckId/menu
// @access  Private (Owner)
export const addMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.truckId);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to modify this menu', 403);
  }

  const { menuItem } = req.body;
  truck.menu.push(menuItem);
  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Menu item added successfully',
    data: {
      menu: truck.menu
    }
  };

  res.status(201).json(response);
});

// @desc    Update menu item
// @route   PUT /api/trucks/:truckId/menu/:itemId
// @access  Private (Owner)
export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.truckId);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to modify this menu', 403);
  }

  const menuItem = (truck.menu as any).id(req.params.itemId);
  if (!menuItem) {
    throw createError('Menu item not found', 404);
  }

  // Update menu item
  Object.assign(menuItem, req.body.menuItem);
  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Menu item updated successfully',
    data: {
      menu: truck.menu
    }
  };

  res.json(response);
});

// @desc    Delete menu item
// @route   DELETE /api/trucks/:truckId/menu/:itemId
// @access  Private (Owner)
export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.truckId);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to modify this menu', 403);
  }

  const menuItem = (truck.menu as any).id(req.params.itemId);
  if (!menuItem) {
    throw createError('Menu item not found', 404);
  }

  (truck.menu as any).pull(req.params.itemId);
  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Menu item deleted successfully',
    data: {
      menu: truck.menu
    }
  };

  res.json(response);
});

// @desc    Toggle menu item availability
// @route   PATCH /api/trucks/:truckId/menu/:itemId/toggle
// @access  Private (Owner)
export const toggleMenuItemAvailability = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.truckId);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to modify this menu', 403);
  }

  const menuItem = (truck.menu as any).id(req.params.itemId);
  if (!menuItem) {
    throw createError('Menu item not found', 404);
  }

  menuItem.isAvailable = !menuItem.isAvailable;
  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
    data: {
      menuItem
    }
  };

  res.json(response);
});
