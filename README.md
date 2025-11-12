# 🏠 Airbnb Prototype

A full-stack Airbnb clone built with React, Node.js, Express, MongoDB, and an AI-powered travel assistant. It features a microservices architecture with separate services for travelers, owners, properties, and bookings. The application supports user authentication, property management, bookings, favorites, and an intelligent concierge agent for personalized travel recommendations.

## ✨ Key Features

### 🧑‍💻 Core Functionality
- **User Authentication** – JWT-based authentication with separate registration/login for travelers and property owners
- **Property Management** – CRUD operations with image uploads and availability control
- **Booking System** – Full booking workflow with status tracking and history
- **Favorites** – Add/remove properties with real-time updates
- **Profile Management** – Editable traveler/owner profiles with photo uploads
- **State Management** – Redux Toolkit for centralized state management

### 🤖 AI Concierge Agent
- **Smart Recommendations** – Activities, restaurants, packing lists, and itineraries
- **Personalized Insights** – Uses user preferences and travel details
- **Floating Widget** – Accessible on any page
- **Powered by FastAPI + LangChain + OpenAI GPT-4**

### 💡 Technical Highlights
- **Microservices Architecture** – Separate services for scalability and maintainability
- **JWT Authentication** – Stateless authentication with JSON Web Tokens
- **MongoDB Database** – NoSQL database with Mongoose ODM
- **RESTful APIs** using MVC architecture
- **Responsive Frontend** (React + Bootstrap 5 + Redux)
- **AI Microservice** integrated via separate FastAPI backend

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, JavaScript ES6+, React Router v6, Redux Toolkit, Axios, Bootstrap 5, React Calendar |
| **Backend** | Node.js, Express.js, Microservices Architecture |
| **Services** | Traveler Service (5001), Owner Service (5002), Property Service (5003), Booking Service (5004) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **File Upload** | Multer |
| **Validation** | Joi |
| **AI Agent** | Python 3.8+, FastAPI, LangChain, OpenAI GPT-4, Pydantic, Uvicorn |
| **Tools** | Git, Postman, npm, pip, Nodemon |

## 🏗️ Architecture

### Microservices
- **Traveler Service** (Port 5001) – Authentication, profile management, favorites
- **Owner Service** (Port 5002) – Owner authentication, profile, booking management
- **Property Service** (Port 5003) – Property CRUD, search, photo uploads
- **Booking Service** (Port 5004) – Booking creation, status management, blocked dates
- **Shared Components** – Models, middleware, utilities used across services

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** (comes with Node.js)
- **Python** 3.8+ (for AI agent)
- **MongoDB** 6.0+ (local installation or MongoDB Atlas)
- **Git**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dmhan321/Airbnb-Prototype.git
cd Airbnb-Prototype
```

### 2️⃣ Configure Environment Variables

**Backend Services** (create `.env` in each service directory or use root `.env`)

**Traveler Service** (`backend/services/traveler-service/.env`)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Owner Service** (`backend/services/owner-service/.env`)
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Property Service** (`backend/services/property-service/.env`)
```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Booking Service** (`backend/services/booking-service/.env`)
```env
PORT=5004
MONGODB_URI=mongodb://localhost:27017/airbnb_db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_TRAVELER_API_URL=http://localhost:5001/api
REACT_APP_OWNER_API_URL=http://localhost:5002/api
REACT_APP_PROPERTY_API_URL=http://localhost:5003/api
REACT_APP_BOOKING_API_URL=http://localhost:5004/api
REACT_APP_AGENT_URL=http://localhost:5005
```

**AI Agent Backend** (`agent-backend/.env`)
```env
OPENAI_API_KEY=your-openai-api-key
AGENT_PORT=5005
```

### 3️⃣ Database Setup (MongoDB)

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. The database `airbnb_db` will be created automatically when services start

**Option 2: MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in all service `.env` files

**Note:** No migrations needed! MongoDB is schema-less. The Mongoose models in `backend/services/shared/models/mongoose/` define the schema structure.

### 4️⃣ Install Dependencies

**Backend Services**
```bash
cd backend
npm run install:services
```

This installs dependencies for all microservices.

**Frontend**
```bash
cd frontend
npm install
```

**AI Agent**
```bash
cd agent-backend
python -m venv venv
venv\Scripts\activate       # Windows
# or
source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
```

### 5️⃣ Run Services

#### 🚀 Start All Backend Services (Recommended)
```bash
cd backend
npm run start:services
```

This starts all 4 microservices simultaneously:
- Traveler Service: `http://localhost:5001`
- Owner Service: `http://localhost:5002`
- Property Service: `http://localhost:5003`
- Booking Service: `http://localhost:5004`

#### 🔧 Start Services Individually (Alternative)

**Traveler Service**
```bash
cd backend/services/traveler-service
npm run dev
```

**Owner Service**
```bash
cd backend/services/owner-service
npm run dev
```

**Property Service**
```bash
cd backend/services/property-service
npm run dev
```

**Booking Service**
```bash
cd backend/services/booking-service
npm run dev
```

#### 🤖 AI Agent (Python)
```bash
cd agent-backend
uvicorn main:app --reload --port 5005
```
**Runs at** `http://localhost:5005`

#### 💻 Frontend (React)
```bash
cd frontend
npm start
```
**Runs at** `http://localhost:3000`

## 🗂️ Project Structure

```
Airbnb-Prototype/
├── backend/
│   ├── services/
│   │   ├── traveler-service/    # Traveler authentication, profile, favorites
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   ├── owner-service/       # Owner authentication, profile, bookings
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   ├── property-service/    # Property CRUD, search, photos
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   ├── booking-service/     # Booking creation, management
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   └── shared/              # Shared components
│   │       ├── models/mongoose/ # Mongoose schemas (Traveler, Owner, Property, Booking, Favorite)
│   │       ├── middleware/     # Auth, validation middleware
│   │       └── utils/          # Transform, date utils, service client
│   ├── config/                 # Configuration files
│   ├── start-all-services.js   # Service launcher
│   └── package.json
│
├── agent-backend/              # AI agent (FastAPI + LangChain)
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login/Signup components
│   │   │   ├── common/         # Shared components
│   │   │   ├── owner/          # Owner-specific components
│   │   │   ├── traveler/       # Traveler-specific components
│   │   │   └── agent/          # AI agent components
│   │   ├── store/              # Redux store and slices
│   │   ├── services/           # API service clients
│   │   └── utils/              # Utility functions
│   └── package.json
│
└── README.md
```

## 🔌 API Overview

### Authentication (Traveler Service - Port 5001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/traveler` | Register traveler |
| POST | `/api/auth/login` | User login (returns JWT) |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/change-password` | Change password |

### Authentication (Owner Service - Port 5002)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/owner` | Register owner |
| POST | `/api/auth/login` | Owner login (returns JWT) |
| GET | `/api/auth/profile` | Get owner profile |
| PUT | `/api/auth/profile` | Update owner profile |

### Properties (Property Service - Port 5003)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/search` | Search properties |
| GET | `/api/properties/:id` | Get property details |
| POST | `/api/properties` | Create property (owner only) |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| POST | `/api/properties/:id/photos` | Upload property photos |

### Bookings (Booking Service - Port 5004)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking (traveler) |
| GET | `/api/bookings/traveler` | Get traveler bookings |
| GET | `/api/bookings/property/:propertyId/blocked-dates` | Get blocked dates |

### Bookings (Owner Service - Port 5002)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/owner` | Get owner bookings |
| PUT | `/api/bookings/:id/accept` | Accept booking |
| PUT | `/api/bookings/:id/reject` | Reject booking (treated as cancel) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### Favorites (Traveler Service - Port 5001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove favorite |
| GET | `/api/favorites/check/:propertyId` | Check if favorited |

### AI Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent` | Chat-based AI recommendations |
| POST | `/agent-button` | Structured responses via FastAPI |

## 🧭 User Journeys

### Traveler
1. **Register/Login** → JWT token stored in Redux state
2. **Browse** → Search and filter properties
3. **Plan** → Use AI agent for itinerary & packing suggestions
4. **Book** → Make reservations and manage bookings
5. **Save** → Add properties to favorites
6. **Profile** → Update profile and upload photo

### Owner
1. **Register/Login** → JWT token stored in Redux state
2. **List** → Add properties with photos and descriptions
3. **Manage** → Handle bookings (accept/reject/cancel)
4. **Profile** → Update profile and upload photo

## 🔐 Authentication Flow

1. User registers/logs in via Traveler or Owner service
2. Service returns JWT token in response
3. Frontend stores token in Redux state and localStorage
4. Token included in `Authorization: Bearer <token>` header for protected routes
5. Services verify token using shared `authMiddleware`

## 🧪 Testing

- Use **Postman** with the included `postman_collection.json`
- Test registration, login, bookings, and AI interactions
- All endpoints documented with example requests
- Ensure all services are running before testing

## ⚙️ Common Issues

| Issue | Solution |
|-------|----------|
| Port conflicts | Ensure ports 3000, 5001, 5002, 5003, 5004, 5005 are free |
| MongoDB connection error | Check `.env` credentials and MongoDB status |
| Module errors | Reinstall dependencies: `npm run install:services` |
| JWT errors | Ensure `JWT_SECRET` is set in all service `.env` files |
| Service not starting | Check individual service logs for errors |
| CORS errors | Verify `FRONTEND_URL` matches frontend origin in all services |
| Python venv not activated | Run `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux) |

## 📚 Additional Documentation

- **backend/README.md** – Backend API documentation
- **backend/SETUP_ENV.md** – Environment setup guide
- **backend/ENV_SETUP_GUIDE.md** – Detailed environment configuration
- **LAB2_IMPLEMENTATION_PLAN.md** – Lab 2 implementation roadmap
- **Postman Collection** – API testing suite

## 🎯 Next Steps (Lab 2)

- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Kafka integration for async messaging
- [ ] AWS deployment

---

**Happy coding! 🎉**
