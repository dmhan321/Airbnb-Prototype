# Airbnb Prototype Frontend

React frontend for the Airbnb prototype application with Bootstrap styling.

## Features

- **Authentication**: Login/Signup for Travelers and Owners
- **Traveler Dashboard**: Property search and booking
- **Owner Dashboard**: Property management
- **AI Agent**: Floating agent button for trip recommendations
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

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── traveler/       # Traveler-specific components
│   ├── owner/          # Owner-specific components
│   └── agent/          # AI agent components
├── services/           # API service functions
└── App.js             # Main application component
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api` with the following services:

- `authService`: Authentication (login, signup, logout)
- `propertyService`: Property management and search
- `bookingService`: Booking operations
- `favoriteService`: Favorite properties management