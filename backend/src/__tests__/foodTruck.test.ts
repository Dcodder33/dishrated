import request from 'supertest';
import app from '../server';
import { User, FoodTruck } from '../models';
import connectDB from '../config/database';
import mongoose from 'mongoose';

describe('Food Truck Endpoints', () => {
  let userToken: string;
  let ownerToken: string;
  let userId: string;
  let ownerId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await FoodTruck.deleteMany({});

    // Create test users
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      });
    userToken = userResponse.body.data.token;
    userId = userResponse.body.data.user._id;

    const ownerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Owner',
        email: 'owner@example.com',
        password: 'password123',
        role: 'owner'
      });
    ownerToken = ownerResponse.body.data.token;
    ownerId = ownerResponse.body.data.user._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/trucks', () => {
    beforeEach(async () => {
      // Create test food trucks
      await FoodTruck.create([
        {
          name: 'Test Truck 1',
          description: 'Test description',
          image: 'test-image.jpg',
          cuisine: 'Indian',
          location: {
            address: 'Test Address',
            coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
          },
          owner: ownerId,
          rating: 4.5,
          reviewCount: 10,
          status: 'open',
          waitTime: '10 min',
          featured: true,
          priceRange: 'mid',
          tags: ['spicy', 'vegetarian']
        },
        {
          name: 'Test Truck 2',
          description: 'Test description 2',
          image: 'test-image2.jpg',
          cuisine: 'Chinese',
          location: {
            address: 'Test Address 2',
            coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
          },
          owner: ownerId,
          rating: 4.0,
          reviewCount: 5,
          status: 'closed',
          waitTime: '15 min',
          featured: false,
          priceRange: 'budget',
          tags: ['noodles']
        }
      ]);
    });

    it('should get all food trucks', async () => {
      const response = await request(app)
        .get('/api/trucks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter trucks by cuisine', async () => {
      const response = await request(app)
        .get('/api/trucks?cuisine=Indian')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toHaveLength(1);
      expect(response.body.data.trucks[0].cuisine).toBe('Indian');
    });

    it('should filter trucks by status', async () => {
      const response = await request(app)
        .get('/api/trucks?status=open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toHaveLength(1);
      expect(response.body.data.trucks[0].status).toBe('open');
    });

    it('should search trucks by name', async () => {
      const response = await request(app)
        .get('/api/trucks?search=Test Truck 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toHaveLength(1);
    });
  });

  describe('GET /api/trucks/trending', () => {
    beforeEach(async () => {
      await FoodTruck.create({
        name: 'Trending Truck',
        description: 'Test description',
        image: 'test-image.jpg',
        cuisine: 'Indian',
        location: {
          address: 'Test Address',
          coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
        },
        owner: ownerId,
        rating: 4.8,
        reviewCount: 100,
        status: 'open',
        waitTime: '5 min',
        featured: true,
        priceRange: 'mid',
        tags: ['popular']
      });
    });

    it('should get trending trucks', async () => {
      const response = await request(app)
        .get('/api/trucks/trending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toBeDefined();
      expect(Array.isArray(response.body.data.trucks)).toBe(true);
    });
  });

  describe('GET /api/trucks/nearby', () => {
    beforeEach(async () => {
      await FoodTruck.create({
        name: 'Nearby Truck',
        description: 'Test description',
        image: 'test-image.jpg',
        cuisine: 'Indian',
        location: {
          address: 'Test Address',
          coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
        },
        owner: ownerId,
        rating: 4.5,
        reviewCount: 10,
        status: 'open',
        waitTime: '10 min',
        featured: false,
        priceRange: 'mid',
        tags: ['nearby']
      });
    });

    it('should get nearby trucks with coordinates', async () => {
      const response = await request(app)
        .get('/api/trucks/nearby?lat=20.3538431&lng=85.8169059&maxDistance=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trucks).toBeDefined();
      expect(Array.isArray(response.body.data.trucks)).toBe(true);
    });

    it('should require latitude and longitude', async () => {
      const response = await request(app)
        .get('/api/trucks/nearby')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/trucks', () => {
    const truckData = {
      name: 'New Truck',
      description: 'New truck description',
      image: 'new-truck.jpg',
      cuisine: 'Italian',
      location: {
        address: 'New Address',
        coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
      },
      priceRange: 'mid',
      tags: ['new', 'italian']
    };

    it('should create truck with owner token', async () => {
      const response = await request(app)
        .post('/api/trucks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(truckData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.truck.name).toBe(truckData.name);
      expect(response.body.data.truck.owner).toBeDefined();
    });

    it('should not create truck without authentication', async () => {
      const response = await request(app)
        .post('/api/trucks')
        .send(truckData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create truck with user token', async () => {
      const response = await request(app)
        .post('/api/trucks')
        .set('Authorization', `Bearer ${userToken}`)
        .send(truckData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/trucks/:id', () => {
    let truckId: string;

    beforeEach(async () => {
      const truck = await FoodTruck.create({
        name: 'Test Truck',
        description: 'Test description',
        image: 'test-image.jpg',
        cuisine: 'Indian',
        location: {
          address: 'Test Address',
          coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
        },
        owner: ownerId,
        rating: 4.5,
        reviewCount: 10,
        status: 'open',
        waitTime: '10 min',
        featured: false,
        priceRange: 'mid',
        tags: ['test']
      });
      truckId = truck._id.toString();
    });

    it('should get truck by id', async () => {
      const response = await request(app)
        .get(`/api/trucks/${truckId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.truck._id).toBe(truckId);
      expect(response.body.data.truck.name).toBe('Test Truck');
    });

    it('should return 404 for non-existent truck', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/trucks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
