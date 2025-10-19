# Airbnb Prototype Backend API

A Node.js + Express.js backend API for the Airbnb prototype application.

## Features

### Authentication
- Session-based authentication using Express-session
- Secure password hashing with bcrypt.js
- Separate user types: Traveler and Owner
- Profile management for both user types

### Traveler Features
- User registration and login
- Profile management with all required fields
- Property search with filters (location, dates, guests, price)
- Property details viewing
- Booking creation and management
- Favorites system
- Booking history

### Owner Features
- User registration and login
- Profile management
- Property posting and management
- Booking request management (Accept/Cancel)
- Owner dashboard with statistics

### Property Management
- CRUD operations for properties
- Property search and filtering
- Availability management
- Image upload support

### Booking System
- Booking creation with PENDING status
- Owner can ACCEPT or CANCEL bookings
- Traveler can CANCEL their bookings
- Booking history for both user types
- Conflict checking for availability

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **multer** - File uploads
- **joi** - Input validation
- **cors** - Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/auth/register/traveler` - Register traveler
- `POST /api/auth/register/owner` - Register owner
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user profile

### Traveler Routes
- `GET /api/travelers/profile` - Get traveler profile
- `PUT /api/travelers/profile` - Update traveler profile
- `POST /api/travelers/profile/picture` - Upload profile picture
- `GET /api/travelers/properties/search` - Search properties
- `GET /api/travelers/properties/:id` - Get property details

### Owner Routes
- `GET /api/owners/profile` - Get owner profile
- `PUT /api/owners/profile` - Update owner profile
- `POST /api/owners/profile/picture` - Upload profile picture
- `GET /api/owners/dashboard` - Get owner dashboard

### Property Routes
- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/search` - Search properties (public)
- `GET /api/properties/:id` - Get property by ID (public)
- `POST /api/properties` - Create property (owner only)
- `GET /api/properties/owner/properties` - Get owner's properties
- `PUT /api/properties/:id` - Update property (owner only)
- `DELETE /api/properties/:id` - Delete property (owner only)

### Booking Routes
- `POST /api/bookings` - Create booking (traveler)
- `GET /api/bookings/traveler` - Get traveler's bookings
- `GET /api/bookings/owner` - Get owner's booking requests
- `PUT /api/bookings/:id/accept` - Accept booking (owner)
- `PUT /api/bookings/:id/cancel` - Cancel booking (traveler/owner)

### Favorites Routes
- `POST /api/favorites` - Add to favorites (traveler)
- `GET /api/favorites` - Get favorites (traveler)
- `DELETE /api/favorites/:id` - Remove from favorites (traveler)
- `GET /api/favorites/check/:propertyId` - Check if property is favorited

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up database:
```bash
# Create database
mysql -u root -p
CREATE DATABASE airbnb_db;

# Run migrations
npx sequelize-cli db:migrate
```

3. Start the server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## Database Schema

### Travelers Table
- id, name, email, password, phone, aboutMe, city, country, languages, gender, profilePicture, createdAt, updatedAt

### Owners Table
- id, name, email, password, location, phone, aboutMe, profilePicture, createdAt, updatedAt

### Properties Table
- id, name, type, description, location, city, state, country, price, bedrooms, bathrooms, amenities, maxGuests, availableFrom, availableTo, images, isActive, ownerId, createdAt, updatedAt

### Bookings Table
- id, travelerId, propertyId, startDate, endDate, guests, status, totalPrice, createdAt, updatedAt

### Favorites Table
- id, travelerId, propertyId, createdAt, updatedAt

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation with Joi
- File upload restrictions
- CORS configuration
- Error handling middleware

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // Optional
}
```

## File Uploads

Profile pictures are stored in the `uploads/` directory with the following naming convention:
- `profile-{timestamp}-{random}.{extension}`

Supported file types: Images only
Maximum file size: 5MB