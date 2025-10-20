# Airbnb Prototype Frontend

React frontend for the Airbnb prototype application with Bootstrap styling.

## Features

- **Authentication**: Login/Signup for Travelers and Owners
- **Unified Dashboards**: Tabbed dashboards for Traveler and Owner
- **Property Search & Details**: Browse, search, and view property details
- **Bookings**: Create/cancel (traveler), accept/cancel (owner), status filters
- **Favorites**: Add/remove favorite properties (traveler)
- **Profiles**: View/Edit profile with photo upload and address fields
- **Responsive Design**: Bootstrap-based responsive UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Dependencies

- React 18.2.0
- React Router DOM 6.8.0
- Bootstrap 5.2.0
- Axios 1.3.0

## Project Structure (current)

```
src/
├── components/
│   ├── auth/             # Login / Signup
│   ├── common/           # Shared components (HomePage, ProtectedRoute, profiles)
│   ├── traveler/         # Traveler UI (dashboard, search, details)
│   └── owner/            # Owner UI (dashboard, properties)
├── contexts/             # AuthContext (global auth state)
├── services/             # API services (auth, property, booking, favorite)
├── App.js                # Routes and app shell
├── index.js              # React entry point
└── index.css             # Global styles
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api` with the following services:

- `authService`: Authentication (login, signup, logout)
- `propertyService`: Property management and search
- `bookingService`: Booking operations
- `favoriteService`: Favorite properties management

