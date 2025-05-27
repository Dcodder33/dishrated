import dotenv from 'dotenv';
import connectDB from '../config/database';
import { User } from '../models';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dishrated.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@dishrated.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      phone: '+1234567890'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@dishrated.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
