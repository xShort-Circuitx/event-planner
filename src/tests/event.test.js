const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');

let token;
let userId;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/event-planner-test');

  // Create test user
  const user = new User({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  });
  await user.save();
  userId = user._id;

  // Generate token
  token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  // Clean up database
  await User.deleteMany({});
  await Event.deleteMany({});
  await mongoose.connection.close();
});

describe('Event Routes', () => {
  beforeEach(async () => {
    await Event.deleteMany({});
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        category: 'Meetings',
        reminder: {
          enabled: true,
          time: new Date()
        }
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(eventData.name);
      expect(response.body.user.toString()).toBe(userId.toString());
    });
  });

  describe('GET /api/events', () => {
    it('should get all events for user', async () => {
      // Create test events
      const events = [
        {
          name: 'Event 1',
          description: 'Description 1',
          date: new Date(),
          category: 'Meetings',
          user: userId
        },
        {
          name: 'Event 2',
          description: 'Description 2',
          date: new Date(),
          category: 'Birthdays',
          user: userId
        }
      ];

      await Event.insertMany(events);

      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/events/upcoming', () => {
    it('should get upcoming events', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const event = new Event({
        name: 'Future Event',
        description: 'Future Description',
        date: futureDate,
        category: 'Meetings',
        user: userId
      });

      await event.save();

      const response = await request(app)
        .get('/api/events/upcoming')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Future Event');
    });
  });
}); 