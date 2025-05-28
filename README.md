# 🍕 DishRated

**Track. Taste. Thrive.**

A comprehensive food truck discovery and review platform that helps users find the best food trucks near them, track their locations in real-time, and discover their next favorite meal on wheels.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=netlify)](https://dishrated1.netlify.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge&logo=render)](https://render.com)
[![Frontend](https://img.shields.io/badge/Frontend-Netlify-teal?style=for-the-badge&logo=netlify)](https://netlify.com)

---

## 🌟 Features

### 🔍 **For Food Lovers**
- **Discover Food Trucks**: Find amazing food trucks near your location
- **Real-time Tracking**: Track food truck locations in real-time
- **Reviews & Ratings**: Read and write reviews for trucks and individual dishes
- **Event Discovery**: Stay updated with food truck events and city festivals
- **Advanced Search**: Filter by cuisine, price range, distance, and more

### 🚚 **For Food Truck Owners**
- **Owner Dashboard**: Comprehensive management panel for your business
- **Live Location Sharing**: Share your real-time location with customers
- **Menu Management**: Add, edit, and manage your menu items with images
- **Event Participation**: Join city events and create your own promotional events
- **Analytics**: Track your performance and customer engagement
- **Review Management**: Respond to customer reviews and feedback

### 👨‍💼 **For Administrators**
- **Admin Dashboard**: Complete platform management and oversight
- **User Management**: Manage users, handle reports, and moderate content
- **Owner Applications**: Review and approve food truck owner applications
- **Event Management**: Create and manage city-wide food events
- **Blog Management**: Create and publish blog content
- **Analytics & Insights**: Platform-wide analytics and reporting

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **React Router** for navigation
- **React Query** for state management and API calls
- **Shadcn/ui** for UI components

### **Backend**
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for data validation
- **Helmet** for security
- **Rate Limiting** for API protection

### **Deployment**
- **Frontend**: Netlify with automatic deployments
- **Backend**: Render with automatic deployments
- **Database**: MongoDB Atlas (Cloud)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dishrated.git
   cd dishrated
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration

   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install

   # Start development server
   npm run dev
   ```

4. **Environment Variables**

   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 📱 Screenshots

### Homepage
*Clean and intuitive homepage with gradient design*

### Food Truck Discovery
*Advanced search and filtering capabilities*

### Owner Dashboard
*Comprehensive management tools for food truck owners*

---

## 🎯 Key Functionalities

### **User Authentication & Roles**
- Secure registration and login system
- Role-based access control (User, Owner, Admin)
- JWT-based authentication
- Password reset functionality

### **Location Services**
- Real-time GPS tracking for food trucks
- Geolocation-based truck discovery
- Interactive maps with OpenStreetMap integration
- Distance calculation and filtering

### **Review System**
- Comprehensive review system for trucks and dishes
- Star ratings and detailed comments
- Image uploads for reviews
- Review moderation and reporting

### **Event Management**
- City-wide food events and festivals
- Food truck promotional events
- Event participation and registration
- Calendar integration

---

## 🔧 API Documentation

The backend provides a comprehensive REST API. Key endpoints include:

- **Authentication**: `/api/auth/*`
- **Food Trucks**: `/api/trucks/*`
- **Reviews**: `/api/reviews/*`
- **Events**: `/api/events/*`
- **User Management**: `/api/admin/*`
- **Owner Operations**: `/api/owner/*`

For detailed API documentation, visit the `/api/health` endpoint when running the backend.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Full-Stack Developer
- **Project Type**: Full-Stack Web Application
- **Status**: Live and Deployed

---

## 🌐 Live Demo

**🔗 [Visit DishRated](https://dishrated1.netlify.app/)**

Experience the full functionality of DishRated with our live demo. Create an account, explore food trucks, and see how the platform works!

### Test Accounts
- **User**: `john@example.com` / `password123`
- **Owner**: `jane@example.com` / `password123`
- **Admin**: `admin@dishrated.com` / `admin123`

---

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact us through the website
- Email: support@dishrated.com

---

<div align="center">

**Made with ❤️ for the food truck community**

[🌟 Star this repo](https://github.com/yourusername/dishrated) | [🐛 Report Bug](https://github.com/yourusername/dishrated/issues) | [💡 Request Feature](https://github.com/yourusername/dishrated/issues)

</div>

