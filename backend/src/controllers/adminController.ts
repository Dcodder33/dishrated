import { Request, Response } from 'express';
import { OwnerApplication, User, Blog, Event } from '../models';
import { asyncHandler, createError } from '../middleware';
import { ApiResponse } from '../types';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
  // Get pending applications count
  const pendingApplications = await OwnerApplication.countDocuments({ status: 'pending' });

  // Get total applications this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyApplications = await OwnerApplication.countDocuments({
    submittedAt: { $gte: startOfMonth }
  });

  // Get recent applications
  const recentApplications = await OwnerApplication.find()
    .sort({ submittedAt: -1 })
    .limit(5)
    .select('businessName ownerName email status submittedAt');

  // Get application statistics
  const applicationStats = await OwnerApplication.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  };

  applicationStats.forEach(stat => {
    stats[stat._id as keyof typeof stats] = stat.count;
    stats.total += stat.count;
  });

  const dashboardData = {
    stats: {
      pendingApplications,
      monthlyApplications,
      totalApplications: stats.total,
      approvalRate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
    },
    recentApplications,
    applicationBreakdown: stats
  };

  const response: ApiResponse = {
    success: true,
    message: 'Admin dashboard data retrieved successfully',
    data: dashboardData
  };

  res.json(response);
});

// @desc    Get all owner applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
export const getOwnerApplications = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10, search } = req.query;

  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { businessName: { $regex: search, $options: 'i' } },
      { ownerName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const applications = await OwnerApplication.find(query)
    .populate('reviewedBy', 'name email')
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await OwnerApplication.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'Owner applications retrieved successfully',
    data: {
      applications,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Get single owner application
// @route   GET /api/admin/applications/:id
// @access  Private (Admin)
export const getOwnerApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await OwnerApplication.findById(req.params.id)
    .populate('reviewedBy', 'name email');

  if (!application) {
    throw createError('Application not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Application retrieved successfully',
    data: { application }
  };

  res.json(response);
});

// @desc    Approve owner application
// @route   PUT /api/admin/applications/:id/approve
// @access  Private (Admin)
export const approveOwnerApplication = asyncHandler(async (req: Request, res: Response) => {
  const { notes } = req.body;
  const adminId = req.user!._id;

  const application = await OwnerApplication.findById(req.params.id);

  if (!application) {
    throw createError('Application not found', 404);
  }

  if (application.status !== 'pending') {
    throw createError('Application has already been reviewed', 400);
  }

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email: application.email });
  if (existingUser) {
    throw createError('User with this email already exists', 400);
  }

  // Create user account for the approved vendor
  const tempPassword = Math.random().toString(36).slice(-8);

  const newUser = await User.create({
    name: application.ownerName,
    email: application.email,
    password: tempPassword,
    role: 'owner',
    phone: application.phone
  });

  // Update application status
  application.status = 'approved';
  application.reviewedAt = new Date();
  application.reviewedBy = new Schema.Types.ObjectId(adminId);
  application.notes = notes;
  await application.save();

  const response: ApiResponse = {
    success: true,
    message: 'Application approved successfully',
    data: {
      application,
      user: newUser,
      tempPassword // In production, this should be sent via email
    }
  };

  res.json(response);
});

// @desc    Reject owner application
// @route   PUT /api/admin/applications/:id/reject
// @access  Private (Admin)
export const rejectOwnerApplication = asyncHandler(async (req: Request, res: Response) => {
  const { rejectionReason, notes } = req.body;
  const adminId = req.user!._id;

  const application = await OwnerApplication.findById(req.params.id);

  if (!application) {
    throw createError('Application not found', 404);
  }

  if (application.status !== 'pending') {
    throw createError('Application has already been reviewed', 400);
  }

  // Update application status
  application.status = 'rejected';
  application.reviewedAt = new Date();
  application.reviewedBy = new Schema.Types.ObjectId(adminId);
  application.rejectionReason = rejectionReason;
  application.notes = notes;
  await application.save();

  const response: ApiResponse = {
    success: true,
    message: 'Application rejected successfully',
    data: { application }
  };

  res.json(response);
});

// @desc    Submit owner application
// @route   POST /api/admin/applications
// @access  Public
export const submitOwnerApplication = asyncHandler(async (req: Request, res: Response) => {
  const { businessName, ownerName, email, phone, cuisineType, description } = req.body;

  // Check if application with this email already exists
  const existingApplication = await OwnerApplication.findOne({ email });
  if (existingApplication) {
    throw createError('Application with this email already exists', 400);
  }

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('User with this email already exists', 400);
  }

  const application = await OwnerApplication.create({
    businessName,
    ownerName,
    email,
    phone,
    cuisineType,
    description
  });

  const response: ApiResponse = {
    success: true,
    message: 'Application submitted successfully',
    data: { application }
  };

  res.status(201).json(response);
});

// @desc    Get all users (for ban management)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, status, page = 1, limit = 50, search } = req.query;

  // Require search term for performance with large databases
  if (!search || (search as string).trim().length < 2) {
    const response: ApiResponse = {
      success: false,
      message: 'Search term is required (minimum 2 characters)',
      data: { users: [], pagination: { current: 1, pages: 0, total: 0, limit: 0 } }
    };
    return res.status(400).json(response);
  }

  const query: any = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (status && status !== 'all') {
    query.isActive = status === 'active';
  }

  // Search in name and email
  query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } }
  ];

  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 100); // Max 100 results
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Ban/Unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin)
export const toggleUserBan = asyncHandler(async (req: Request, res: Response) => {
  const { reason } = req.body;
  const adminId = req.user!._id;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw createError('User not found', 404);
  }

  if (user.role === 'admin') {
    throw createError('Cannot ban admin users', 400);
  }

  const isBanning = user.isActive;

  user.isActive = !user.isActive;
  user.banReason = isBanning ? reason : undefined;
  user.bannedAt = isBanning ? new Date() : undefined;
  user.bannedBy = isBanning ? new Schema.Types.ObjectId(adminId) : undefined;

  await user.save();

  const response: ApiResponse = {
    success: true,
    message: `User ${isBanning ? 'banned' : 'unbanned'} successfully`,
    data: { user: { ...user.toObject(), password: undefined } }
  };

  res.json(response);
});

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('bannedBy', 'name email');

  if (!user) {
    throw createError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'User details retrieved successfully',
    data: { user }
  };

  res.json(response);
});

// @desc    Get all blogs
// @route   GET /api/admin/blogs
// @access  Private (Admin)
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, page = 1, limit = 10, search } = req.query;

  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const blogs = await Blog.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Blog.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'Blogs retrieved successfully',
    data: {
      blogs,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Get single blog
// @route   GET /api/admin/blogs/:id
// @access  Private (Admin)
export const getBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name email');

  if (!blog) {
    throw createError('Blog not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Blog retrieved successfully',
    data: { blog }
  };

  res.json(response);
});

// @desc    Create blog
// @route   POST /api/admin/blogs
// @access  Private (Admin)
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, excerpt, featuredImage, category, tags, status, featured } = req.body;
  const adminId = req.user!._id;

  const blog = await Blog.create({
    title,
    content,
    excerpt,
    featuredImage,
    author: adminId,
    category,
    tags: tags || [],
    status: status || 'draft',
    featured: featured || false
  });

  const response: ApiResponse = {
    success: true,
    message: 'Blog created successfully',
    data: { blog }
  };

  res.status(201).json(response);
});

// @desc    Update blog
// @route   PUT /api/admin/blogs/:id
// @access  Private (Admin)
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, excerpt, featuredImage, category, tags, status, featured } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw createError('Blog not found', 404);
  }

  // Update fields
  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (featuredImage !== undefined) blog.featuredImage = featuredImage;
  if (category !== undefined) blog.category = category;
  if (tags !== undefined) blog.tags = tags;
  if (status !== undefined) blog.status = status;
  if (featured !== undefined) blog.featured = featured;

  await blog.save();

  const response: ApiResponse = {
    success: true,
    message: 'Blog updated successfully',
    data: { blog }
  };

  res.json(response);
});

// @desc    Delete blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private (Admin)
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw createError('Blog not found', 404);
  }

  await Blog.findByIdAndDelete(req.params.id);

  const response: ApiResponse = {
    success: true,
    message: 'Blog deleted successfully'
  };

  res.json(response);
});

// @desc    Get all events (admin view)
// @route   GET /api/admin/events
// @access  Private (Admin)
export const getAdminEvents = asyncHandler(async (req: Request, res: Response) => {
  const { status, eventType, approvalStatus, page = 1, limit = 10, search } = req.query;

  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (eventType && eventType !== 'all') {
    query.eventType = eventType;
  }

  if (approvalStatus && approvalStatus !== 'all') {
    query.approvalStatus = approvalStatus;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.address': { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .populate('participatingTrucks.truck', 'name')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Event.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'Events retrieved successfully',
    data: {
      events,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Get single event (admin view)
// @route   GET /api/admin/events/:id
// @access  Private (Admin)
export const getAdminEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email')
    .populate('participatingTrucks.truck', 'name email phone');

  if (!event) {
    throw createError('Event not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Event retrieved successfully',
    data: { event }
  };

  res.json(response);
});

// @desc    Create city event
// @route   POST /api/admin/events
// @access  Private (Admin)
export const createAdminEvent = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    image,
    date,
    endDate,
    location,
    eventType,
    maxParticipants,
    registrationDeadline,
    tags,
    featured,
    requirements,
    contactInfo,
    pricing
  } = req.body;

  const adminId = req.user!._id;

  const event = await Event.create({
    title,
    description,
    image,
    date,
    endDate,
    location,
    eventType: eventType || 'city_event',
    organizer: adminId,
    organizerType: 'admin',
    maxParticipants,
    registrationDeadline,
    tags: tags || [],
    featured: featured || false,
    requirements,
    contactInfo,
    pricing,
    status: 'published'
  });

  const response: ApiResponse = {
    success: true,
    message: 'Event created successfully',
    data: { event }
  };

  res.status(201).json(response);
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (Admin)
export const updateAdminEvent = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    image,
    date,
    endDate,
    location,
    eventType,
    maxParticipants,
    registrationDeadline,
    tags,
    featured,
    requirements,
    contactInfo,
    pricing,
    status
  } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  // Update fields
  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (image !== undefined) event.image = image;
  if (date !== undefined) event.date = date;
  if (endDate !== undefined) event.endDate = endDate;
  if (location !== undefined) event.location = location;
  if (eventType !== undefined) event.eventType = eventType;
  if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
  if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline;
  if (tags !== undefined) event.tags = tags;
  if (featured !== undefined) event.featured = featured;
  if (requirements !== undefined) event.requirements = requirements;
  if (contactInfo !== undefined) event.contactInfo = contactInfo;
  if (pricing !== undefined) event.pricing = pricing;
  if (status !== undefined) event.status = status;

  await event.save();

  const response: ApiResponse = {
    success: true,
    message: 'Event updated successfully',
    data: { event }
  };

  res.json(response);
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
export const deleteAdminEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  await Event.findByIdAndDelete(req.params.id);

  const response: ApiResponse = {
    success: true,
    message: 'Event deleted successfully'
  };

  res.json(response);
});

// @desc    Approve event (for owner-created city events)
// @route   PUT /api/admin/events/:id/approve
// @access  Private (Admin)
export const approveEvent = asyncHandler(async (req: Request, res: Response) => {
  const { notes } = req.body;
  const adminId = req.user!._id;

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  if (event.approvalStatus !== 'pending') {
    throw createError('Event is not pending approval', 400);
  }

  event.approvalStatus = 'approved';
  event.approvedBy = adminId;
  event.approvedAt = new Date();
  event.status = 'published'; // Auto-publish approved events

  await event.save();

  const response: ApiResponse = {
    success: true,
    message: 'Event approved successfully',
    data: { event }
  };

  res.json(response);
});

// @desc    Reject event (for owner-created city events)
// @route   PUT /api/admin/events/:id/reject
// @access  Private (Admin)
export const rejectEvent = asyncHandler(async (req: Request, res: Response) => {
  const { rejectionReason } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  if (event.approvalStatus !== 'pending') {
    throw createError('Event is not pending approval', 400);
  }

  event.approvalStatus = 'rejected';
  event.rejectionReason = rejectionReason;
  event.status = 'cancelled';

  await event.save();

  const response: ApiResponse = {
    success: true,
    message: 'Event rejected successfully',
    data: { event }
  };

  res.json(response);
});