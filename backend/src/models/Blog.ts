import mongoose, { Schema } from 'mongoose';
import { IBlog } from '../types';

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog author is required']
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: [
      'food-trends',
      'truck-spotlights',
      'city-guides',
      'recipes',
      'events',
      'business-tips',
      'sustainability',
      'reviews',
      'news',
      'other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number,
    default: 5 // in minutes
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });

// Text index for search functionality
blogSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text'
});

// Pre-save middleware to set publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Pre-save middleware to generate slug from title if not provided
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
  next();
});

// Method to increment view count
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Virtual for reading time calculation (rough estimate: 200 words per minute)
blogSchema.virtual('estimatedReadTime').get(function() {
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
});

export default mongoose.model<IBlog>('Blog', blogSchema);
