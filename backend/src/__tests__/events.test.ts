import request from 'supertest';
import app from '../server';
import { User, Event, FoodTruck } from '../models';
import connectDB from '../config/database';
import mongoose from 'mongoose';

describe('Event Endpoints', () => {
  let userToken: string;
  let ownerToken: string;
  let adminToken: string;
  let userId: string;
  let ownerId: string;
  let adminId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Event.deleteMany({});
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

    // Create admin user directly
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminId = adminUser._id.toString();

    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    adminToken = adminLoginResponse.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 25);

      await Event.create([
        {
          title: 'Test Event 1',
          description: 'Test event description',
          image: 'test-event.jpg',
          date: futureDate,
          location: {
            address: 'Test Location',
            coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
          },
          organizer: adminId,
          maxTrucks: 20,
          registrationDeadline: deadline,
          status: 'upcoming'
        },
        {
          title: 'Test Event 2',
          description: 'Test event description 2',
          image: 'test-event2.jpg',
          date: futureDate,
          location: {
            address: 'Test Location 2',
            coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
          },
          organizer: adminId,
          maxTrucks: 15,
          registrationDeadline: deadline,
          status: 'upcoming'
        }
      ]);
    });

    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter events by status', async () => {
      const response = await request(app)
        .get('/api/events?status=upcoming')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
    });

    it('should search events by title', async () => {
      const response = await request(app)
        .get('/api/events?search=Test Event 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
    });
  });

  describe('GET /api/events/upcoming', () => {
    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 25);

      await Event.create({
        title: 'Upcoming Event',
        description: 'Upcoming event description',
        image: 'upcoming-event.jpg',
        date: futureDate,
        location: {
          address: 'Upcoming Location',
          coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
        },
        organizer: adminId,
        maxTrucks: 20,
        registrationDeadline: deadline,
        status: 'upcoming'
      });
    });

    it('should get upcoming events', async () => {
      const response = await request(app)
        .get('/api/events/upcoming')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toBeDefined();
      expect(Array.isArray(response.body.data.events)).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 25);

    const eventData = {
      title: 'New Event',
      description: 'New event description',
      image: 'new-event.jpg',
      date: futureDate.toISOString(),
      location: {
        address: 'New Location',
        coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
      },
      maxTrucks: 25,
      registrationDeadline: deadline.toISOString()
    };

    it('should create event with owner token', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(eventData.title);
      expect(response.body.data.event.organizer).toBeDefined();
    });

    it('should create event with admin token', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(eventData.title);
    });

    it('should not create event without authentication', async () => {
      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create event with user token', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should not create event with past date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invalidEventData = {
        ...eventData,
        date: pastDate.toISOString()
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(invalidEventData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/events/:id', () => {
    let eventId: string;

    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 25);

      const event = await Event.create({
        title: 'Test Event',
        description: 'Test event description',
        image: 'test-event.jpg',
        date: futureDate,
        location: {
          address: 'Test Location',
          coordinates: { latitude: 20.3538431, longitude: 85.8169059 }
        },
        organizer: adminId,
        maxTrucks: 20,
        registrationDeadline: deadline,
        status: 'upcoming'
      });
      eventId = event._id.toString();
    });

    it('should get event by id', async () => {
      const response = await request(app)
        .get(`/api/events/${eventId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event._id).toBe(eventId);
      expect(response.body.data.event.title).toBe('Test Event');
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/events/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
