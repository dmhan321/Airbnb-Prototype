# 🏠 Airbnb Prototype

A full-stack Airbnb clone built with React, Node.js, Express, and SQLite. Features complete user authentication, property management, booking system, and favorites functionality.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** - Separate flows for travelers and property owners
- **Profile Management** - Complete profiles with photo uploads and address information
- **Session Management** - Secure authentication with session-based auth

### 🏡 Property Management
- **Property Creation** - Owners can create detailed property listings
- **Property Search** - Advanced search with location, price, and date filters
- **Property Details** - Comprehensive property information with photo galleries
- **Property Editing** - Owners can update their property listings
- **Property Deletion** - Safe deletion with booking constraint checks

### 📅 Booking System
- **Booking Creation** - Travelers can book available properties
- **Status Management** - PENDING → ACCEPTED → COMPLETED workflow
- **Owner Controls** - Accept/decline booking requests
- **Automatic Completion** - Bookings auto-complete after checkout date
- **Booking History** - Complete booking management for both users

### ❤️ Favorites System
- **Add to Favorites** - Travelers can save properties they like
- **Favorites Management** - View and manage saved properties
- **Quick Access** - Easy navigation to favorite properties

### 🎨 User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Unified Dashboards** - Tabbed interface for easy navigation
- **Modern UI** - Clean, Bootstrap-based design
- **Loading States** - User feedback during operations
- **Error Handling** - Comprehensive error management

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### 1. Clone the Repository
```bash
git clone https://github.com/dmhan321/Airbnb-Prototype.git
cd Airbnb-Prototype
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Database Setup
The application uses SQLite (no additional database setup required). The database will be created automatically when you run the application.

#### Run Database Migrations
```bash
npx sequelize-cli db:migrate
```

#### Start the Backend Server
```bash
npm start
```
The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start the Frontend Development Server
```bash
npm start
```
The frontend will run on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
Airbnb-Prototype/
├── backend/                 # Node.js/Express Backend
│   ├── controllers/         # API route handlers
│   ├── models/             # Sequelize database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── migrations/         # Database migrations
│   └── server.js          # Main server file
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── common/     # Shared components
│   │   │   ├── owner/      # Owner-specific components
│   │   │   └── traveler/   # Traveler-specific components
│   │   ├── contexts/       # React contexts (AuthContext)
│   │   ├── services/       # API service functions
│   │   └── App.js         # Main app component
└── README.md
```

## 🔧 Development

### Backend Development
- **API Endpoints** - RESTful API with proper error handling
- **Database Models** - Sequelize ORM with relationships
- **Authentication** - Session-based authentication
- **File Uploads** - Multer for handling image uploads
- **Validation** - Input validation and sanitization

### Frontend Development
- **React Hooks** - Modern React with hooks
- **Context API** - Global state management
- **Protected Routes** - Route protection based on authentication
- **Service Layer** - Clean API communication
- **Responsive Design** - Mobile-first approach

### Database Schema
- **Users** - Travelers and Owners with profiles
- **Properties** - Property listings with images
- **Bookings** - Booking system with status management
- **Favorites** - User property favorites

## 🧪 Testing the Application

### 1. Create User Accounts
- Register as a **Traveler** to book properties
- Register as an **Owner** to list properties

### 2. Property Management (Owner)
- Create property listings with photos
- Set availability dates
- Manage booking requests
- Update property information

### 3. Booking System (Traveler)
- Search and filter properties
- View property details
- Make bookings
- Manage booking history

### 4. Favorites System (Traveler)
- Add properties to favorites
- View favorite properties
- Remove from favorites

## 🛠️ Available Scripts

### Backend Scripts
```bash
npm start          # Start the server
npm run dev        # Start with nodemon (if configured)
```

### Frontend Scripts
```bash
npm start          # Start development server
npm build          # Build for production
npm test           # Run tests
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Owner only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/accept` - Accept booking (Owner only)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

## 🚀 Deployment

### Backend Deployment
1. Set up production database
2. Update environment variables
3. Run migrations: `npx sequelize-cli db:migrate`
4. Start server: `npm start`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Development Notes

- **Database**: SQLite for development, easily configurable for production
- **Authentication**: Session-based with secure cookie handling
- **File Uploads**: Profile pictures and property images
- **Responsive Design**: Bootstrap-based responsive layout
- **Error Handling**: Comprehensive error management throughout

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `backend/server.js`
   - Frontend: Change port in `frontend/package.json`

2. **Database Connection Issues**
   - Ensure SQLite is properly installed
   - Check database file permissions

3. **CORS Issues**
   - Backend CORS is configured for `http://localhost:3000`
   - Update CORS settings if using different ports

4. **File Upload Issues**
   - Check `uploads` directory permissions
   - Ensure Multer is properly configured

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend**: React with modern hooks and context API
- **Backend**: Node.js with Express and Sequelize ORM
- **Database**: SQLite with proper migrations
- **Authentication**: Session-based with middleware protection

---

**Happy Coding! 🎉**