# DishRated Backend API

A comprehensive Node.js backend API for the DishRated food truck discovery platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Food Truck Management**: CRUD operations for food trucks with location-based search
- **Event Management**: Create and manage food truck events
- **Review System**: User reviews and ratings for food trucks
- **Menu Management**: Dynamic menu management for food truck owners
- **Search & Filtering**: Advanced search with location, cuisine, and price filters
- **Real-time Data**: Live status updates for food trucks

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest & Supertest
- **Documentation**: Auto-generated API docs

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dishrated/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/dishrated
   JWT_SECRET=your_super_secret_jwt_key_here
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database with Sample Data
```bash
npm run seed
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Food Truck Endpoints
- `GET /trucks` - Get all food trucks (with filters)
- `GET /trucks/:id` - Get single food truck
- `POST /trucks` - Create food truck (Owner/Admin)
- `PUT /trucks/:id` - Update food truck (Owner/Admin)
- `DELETE /trucks/:id` - Delete food truck (Owner/Admin)
- `GET /trucks/nearby` - Get nearby food trucks
- `GET /trucks/trending` - Get trending food trucks

### Event Endpoints
- `GET /events` - Get all events
- `GET /events/:id` - Get single event
- `POST /events` - Create event (Owner/Admin)
- `PUT /events/:id` - Update event (Organizer/Admin)
- `DELETE /events/:id` - Delete event (Organizer/Admin)
- `POST /events/:id/register` - Register truck for event
- `DELETE /events/:id/unregister` - Unregister truck from event

### Review Endpoints
- `GET /reviews/truck/:truckId` - Get reviews for a truck
- `GET /reviews/user` - Get user's reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Menu Endpoints
- `GET /trucks/:truckId/menu` - Get truck menu
- `POST /trucks/:truckId/menu` - Add menu item
- `PUT /trucks/:truckId/menu/:itemId` - Update menu item
- `DELETE /trucks/:truckId/menu/:itemId` - Delete menu item

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📊 Database Schema

### User Model
- Authentication and profile information
- Role-based access (user, owner, admin)
- Preferences for personalized experience

### Food Truck Model
- Business information and location
- Menu items and pricing
- Operating hours and status
- Ratings and reviews

### Event Model
- Event details and location
- Participating food trucks
- Registration management

### Review Model
- User ratings and comments
- Helpful votes system

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **User**: Can browse, review, and order
- **Owner**: Can manage their food trucks and participate in events
- **Admin**: Full access to all resources

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt encryption
- **JWT Authentication**: Secure token-based auth

## 📈 Performance

- **Compression**: Gzip compression for responses
- **Database Indexing**: Optimized queries
- **Pagination**: Efficient data loading
- **Caching**: Response caching strategies

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishrated
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Coding! 🍕🚚**
