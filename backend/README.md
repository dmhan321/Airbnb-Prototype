# Airbnb Prototype Backend API

Node.js + Express + MongoDB microservices backend for the Airbnb Prototype application.

## 🏗️ Architecture

The backend is split into **4 independent microservices**:

- **Traveler Service** (Port 5001) – Traveler authentication, profile management, favorites
- **Owner Service** (Port 5002) – Owner authentication, profile, booking management
- **Property Service** (Port 5003) – Property CRUD, search, photo uploads
- **Booking Service** (Port 5004) – Booking creation, status management, blocked dates

All services share:
- **Models** – Mongoose schemas in `services/shared/models/mongoose/`
- **Middleware** – Authentication, validation in `services/shared/middleware/`
- **Utils** – Transform, date utils, service client in `services/shared/utils/`

## Features

### Authentication
- JWT-based authentication (stateless)
- Password hashing (bcrypt)
- User types: Traveler and Owner
- Token expiration: 7 days (configurable)

### Profiles
- View/Update profiles for both roles
- Fields include: name, email, phone, aboutMe, address, city, state, country, languages, gender, profilePicture
- Profile picture upload (multer); static serving of uploaded images

### Properties
- CRUD (owner only)
- Public search and detail view
- Availability and basic validation
- Multiple photo uploads

### Bookings
- Create (traveler)
- Accept/Reject/Cancel (owner), Cancel (traveler)
- Status: PENDING, ACCEPTED, CANCELLED, COMPLETED (auto-complete after endDate)
- Blocked dates calculation

### Favorites (traveler)
- Add / Remove / List
- Check if favorited

## Tech Stack
- Node.js, Express
- MongoDB (via Mongoose ODM)
- JWT (jsonwebtoken)
- multer (uploads), cors, joi (validation)
- bcryptjs (password hashing)

## API Endpoints

### Traveler Service (Port 5001)

**Authentication**
- POST `/api/auth/register/traveler`
- POST `/api/auth/login`
- GET `/api/auth/profile` (current user)
- PUT `/api/auth/profile` (update current user)
- POST `/api/auth/change-password`

**Profile Management**
- GET `/api/travelers/:id`
- PUT `/api/travelers/:id`
- POST `/api/travelers/:id/profile-picture`

**Favorites**
- POST `/api/favorites`
- GET `/api/favorites`
- DELETE `/api/favorites/:id`
- GET `/api/favorites/check/:propertyId`

### Owner Service (Port 5002)

**Authentication**
- POST `/api/auth/register/owner`
- POST `/api/auth/login`
- GET `/api/auth/profile` (current owner)
- PUT `/api/auth/profile` (update current owner)
- POST `/api/auth/change-password`

**Profile Management**
- GET `/api/owners/:id`
- PUT `/api/owners/:id`
- POST `/api/owners/:id/profile-picture`

**Bookings**
- GET `/api/bookings/owner`
- PUT `/api/bookings/:id/accept`
- PUT `/api/bookings/:id/reject`
- PUT `/api/bookings/:id/cancel`

### Property Service (Port 5003)

**Properties**
- GET `/api/properties` (public)
- GET `/api/properties/search` (public)
- GET `/api/properties/:id` (public)
- POST `/api/properties` (owner)
- PUT `/api/properties/:id` (owner)
- DELETE `/api/properties/:id` (owner)
- GET `/api/properties/owner/properties` (owner)
- POST `/api/properties/:propertyId/photos` (owner)

### Booking Service (Port 5004)

**Bookings**
- POST `/api/bookings` (traveler)
- GET `/api/bookings/traveler` (traveler)
- GET `/api/bookings/property/:propertyId/blocked-dates` (public)

## Setup

### 1) Install Dependencies

Install dependencies for all services:
```bash
npm run install:services
```

Or install individually:
```bash
cd services/traveler-service && npm install
cd ../owner-service && npm install
cd ../property-service && npm install
cd ../booking-service && npm install
```

### 2) Database (MongoDB)

Install and start MongoDB locally, or use MongoDB Atlas.

Configure connection in each service's `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/airbnb_db
```

Or use individual settings:
```env
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=airbnb_db
```

The database will be created automatically when the services start. No migrations needed - MongoDB is schema-less and uses Mongoose models defined in `services/shared/models/mongoose/`.

### 3) Environment Variables

Create `.env` in each service directory:

**Traveler Service** (`services/traveler-service/.env`)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Owner Service** (`services/owner-service/.env`)
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Property Service** (`services/property-service/.env`)
```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Booking Service** (`services/booking-service/.env`)
```env
PORT=5004
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 4) Start Services

**Start all services at once:**
```bash
npm run start:services
```

**Or start individually:**
```bash
# Traveler Service
cd services/traveler-service
npm run dev

# Owner Service
cd services/owner-service
npm run dev

# Property Service
cd services/property-service
npm run dev

# Booking Service
cd services/booking-service
npm run dev
```

## Project Structure

```
backend/
├── services/
│   ├── traveler-service/
│   │   ├── controllers/      # authController, travelerController, favoriteController
│   │   ├── routes/          # auth.js, travelers.js, favorites.js
│   │   ├── server.js
│   │   └── package.json
│   ├── owner-service/
│   │   ├── controllers/     # authController, ownerController, bookingController
│   │   ├── routes/          # auth.js, owners.js, bookings.js
│   │   ├── server.js
│   │   └── package.json
│   ├── property-service/
│   │   ├── controllers/     # propertyController
│   │   ├── routes/          # properties.js
│   │   ├── server.js
│   │   └── package.json
│   ├── booking-service/
│   │   ├── controllers/     # bookingController
│   │   ├── routes/          # bookings.js
│   │   ├── server.js
│   │   └── package.json
│   └── shared/
│       ├── models/mongoose/  # Traveler, Owner, Property, Booking, Favorite, PropertyView
│       ├── middleware/       # authMiddleware, validation, staticFiles
│       └── utils/            # transform, dateUtils, serviceClient
├── config/                   # Configuration files
├── start-all-services.js     # Service launcher script
└── package.json
```

## Notes

- **Uploaded files** served from `/uploads` via Express static middleware
- **Error responses** are structured with `{ success, message, ... }`
- **CORS** configured per service - ensure `FRONTEND_URL` matches your frontend origin
- **JWT tokens** are stateless - no session storage needed
- **Shared models** ensure data consistency across services
- **Service communication** can be done via HTTP calls using `serviceClient` utility

## Development

- Each service runs independently on its own port
- Use `npm run dev` for development with nodemon (auto-restart)
- Use `npm start` for production
- Check individual service logs for debugging
