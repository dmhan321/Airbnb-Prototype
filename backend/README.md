# Airbnb Prototype Backend API

Node.js + Express + MySQL backend for the Airbnb Prototype application.

## Features (current)

### Authentication
- Session-based authentication (express-session)
- Password hashing (bcrypt)
- User types: Traveler and Owner

### Profiles
- View/Update profiles for both roles
- Fields include: name, email, phone, aboutMe, address, city, state, country, languages, gender, profilePicture
- Profile picture upload (multer); static serving of uploaded images

### Properties
- CRUD (owner only)
- Public search and detail view
- Availability and basic validation

### Bookings
- Create (traveler)
- Accept/Cancel (owner), Cancel (traveler)
- Status: PENDING, ACCEPTED, CANCELLED, COMPLETED (auto-complete after endDate)

### Favorites (traveler)
- Add / Remove / List
- Check if favorited

## Tech Stack
- Node.js, Express
- MySQL (via Sequelize ORM)
- multer (uploads), cors, joi (validation)

## API Endpoints (high level)

Authentication
- POST `/api/auth/register/traveler`
- POST `/api/auth/register/owner`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/profile` (current user)
- PUT `/api/auth/profile` (update current user)

Properties
- GET `/api/properties` (public)
- GET `/api/properties/search` (public)
- GET `/api/properties/:id` (public)
- POST `/api/properties` (owner)
- PUT `/api/properties/:id` (owner)
- DELETE `/api/properties/:id` (owner)
- GET `/api/properties/owner/properties` (owner)

Bookings
- POST `/api/bookings` (traveler)
- GET `/api/bookings/traveler` (traveler)
- GET `/api/bookings/owner` (owner)
- PUT `/api/bookings/:id/accept` (owner)
- PUT `/api/bookings/:id/cancel` (traveler or owner as authorized)

Favorites (traveler)
- POST `/api/favorites`
- GET `/api/favorites`
- DELETE `/api/favorites/:id`
- GET `/api/favorites/check/:propertyId`

## Setup

1) Install dependencies
```bash
npm install
```

2) Database (MySQL)
Create DB and user (customize creds):
```sql
CREATE DATABASE IF NOT EXISTS airbnb_db;
CREATE USER IF NOT EXISTS 'airbnb_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON airbnb_db.* TO 'airbnb_user'@'localhost';
FLUSH PRIVILEGES;
```

Configure credentials (either env or config.json):
```env
DB_USERNAME=airbnb_user
DB_PASSWORD=your_secure_password
DB_DATABASE=airbnb_db
DB_HOST=127.0.0.1
DB_DIALECT=mysql
```

Run migrations:
```bash
npx sequelize-cli db:migrate
```

3) Environment
Create `.env` in backend:
```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

4) Start server
```bash
npm start
```

## Notes
- Uploaded files served from `/uploads` via Express static
- Error responses are structured with `{ success, message, ... }`
- Ensure CORS `FRONTEND_URL` matches your frontend origin
