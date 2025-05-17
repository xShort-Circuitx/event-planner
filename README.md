# Event Planning and Reminder System

A Node.js application that serves as an event planning and reminder system. Users can create events, assign them to different categories, set reminder notifications, and view upcoming events based on various criteria.

## Features

- User Authentication
- Event Creation and Management
- Event Categorization
- Reminder System with Email Notifications
- Event Filtering and Sorting
- Automated Testing with GitHub Actions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-planner
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

4. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Events
- POST `/api/events` - Create a new event
- GET `/api/events` - Get all events for the authenticated user
- GET `/api/events/upcoming` - Get upcoming events
- GET `/api/events/:id` - Get event by ID
- PATCH `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 