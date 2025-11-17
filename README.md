# 🏠 Airbnb Prototype

A full-stack Airbnb clone built with React, Node.js, Express, MongoDB, and an AI-powered travel assistant. The application features a microservices architecture with Docker containerization, Kubernetes orchestration, Kafka for asynchronous messaging, and Redux for state management.

## ✨ Key Features

### 🧑‍💻 Core Functionality
- **User Authentication** – JWT-based authentication with separate registration/login for travelers and property owners
- **Property Management** – CRUD operations with image uploads and availability control
- **Booking System** – Full booking workflow with Kafka-powered asynchronous processing and status tracking
- **Favorites** – Add/remove properties with real-time updates
- **Profile Management** – Editable traveler/owner profiles with photo uploads
- **State Management** – Redux Toolkit for centralized state management (authentication, properties, bookings)

### 🤖 AI Concierge Agent
- **Smart Recommendations** – Activities, restaurants, packing lists, and itineraries
- **Personalized Insights** – Uses user preferences and travel details
- **Floating Widget** – Accessible on any page
- **Powered by FastAPI + LangChain + OpenAI GPT-4**

### 💡 Technical Highlights
- **Microservices Architecture** – Separate services for scalability and maintainability
- **Docker Containerization** – All services containerized with Docker
- **Kubernetes Orchestration** – Deploy and scale services with Kubernetes
- **Kafka Integration** – Asynchronous event-driven messaging for booking workflow
- **Redux State Management** – Centralized state for authentication, properties, and bookings
- **JWT Authentication** – Stateless authentication with JSON Web Tokens
- **MongoDB Database** – NoSQL database with Mongoose ODM
- **RESTful APIs** using MVC architecture
- **Responsive Frontend** (React + Bootstrap 5 + Redux)

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, JavaScript ES6+, React Router v6, Redux Toolkit, Axios, Bootstrap 5, React Calendar |
| **Backend** | Node.js, Express.js, Microservices Architecture |
| **Services** | Traveler Service (5001), Owner Service (5002), Property Service (5003), Booking Service (5004) |
| **Database** | MongoDB with Mongoose ODM |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (Minikube for local) |
| **Messaging** | Apache Kafka (for asynchronous booking processing) |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **File Upload** | Multer |
| **Validation** | Joi |
| **AI Agent** | Python 3.8+, FastAPI, LangChain, OpenAI GPT-4, Pydantic, Uvicorn |
| **Tools** | Git, Postman, npm, pip, Nodemon |

## 🏗️ Architecture

### Microservices
- **Traveler Service** (Port 5001) – Authentication, profile management, favorites, booking requests (Kafka producer)
- **Owner Service** (Port 5002) – Owner authentication, profile, booking management (Kafka consumer)
- **Property Service** (Port 5003) – Property CRUD, search, photo uploads
- **Booking Service** (Port 5004) – Booking creation from Kafka, status management, blocked dates (Kafka consumer/producer)
- **Shared Components** – Models, middleware, utilities used across services

### Kafka Event Flow
1. **Traveler creates booking** → Publishes to `booking-requests` topic
2. **Booking Service consumes** → Creates booking in MongoDB → Publishes to `booking-status-updates` topic
3. **Owner/Traveler Services consume** → Update UI with booking status changes

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** ([Download here](https://www.docker.com/products/docker-desktop/))

---

## 🐳 Quick Start with Docker (Recommended)

This is the **easiest way** to run the application. All services are pre-configured in Docker Compose.

### Step 1: Install and Start Docker Desktop

Install Docker Desktop from https://www.docker.com/products/docker-desktop/ and make sure it's running before proceeding.

### Step 2: Clone the Repository

```bash
git clone https://github.com/dmhan321/Airbnb-Prototype.git
cd Airbnb-Prototype
```

### Step 3: Configure Environment Variables (Optional)

Create a `.env` file in the project root (optional - defaults are provided):

```env
# JWT Secret (change this in production!)
JWT_SECRET=airbnb-secret-key-change-in-production

# OpenAI API Key (optional - for AI agent)
OPENAI_API_KEY=your-openai-api-key-here
```

**Note:** If you don't create this file, the application will use default values. For production, you should set your own `JWT_SECRET`.

### Step 4: Start All Services

```bash
docker-compose up -d
```

This builds images (first time) and starts all services: MongoDB, Kafka, Zookeeper, and all microservices.

### Step 5: Access the Application

Open http://localhost:3000 in your browser.

**Useful commands:**
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

---

## ☸️ Kubernetes Setup (Advanced)

**When to Use:** Required for Lab 2 assignment, production deployment, or learning Kubernetes.

**Note:** In Kubernetes, Kafka runs in a separate `kafka` namespace, while application services run in the `airbnb` namespace. See `DOCKER_KUBERNETES_SETUP.md` for detailed instructions.

**Quick Start:**
```bash
# 1. Start Minikube
minikube start

# 2. Build and load images
docker build -f backend/Dockerfile.traveler-service -t airbnb-prototype-traveler-service:latest ./backend
docker build -f backend/Dockerfile.owner-service -t airbnb-prototype-owner-service:latest ./backend
docker build -f backend/Dockerfile.property-service -t airbnb-prototype-property-service:latest ./backend
docker build -f backend/Dockerfile.booking-service -t airbnb-prototype-booking-service:latest ./backend
docker build -t airbnb-prototype-frontend:latest ./frontend

minikube image load airbnb-prototype-traveler-service:latest
minikube image load airbnb-prototype-owner-service:latest
minikube image load airbnb-prototype-property-service:latest
minikube image load airbnb-prototype-booking-service:latest
minikube image load airbnb-prototype-frontend:latest

# 3. Deploy (Kafka first, then services)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/persistent-volumes.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s

kubectl apply -f k8s/kafka-namespace.yaml
kubectl apply -f k8s/zookeeper-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=zookeeper -n kafka --timeout=300s
kubectl apply -f k8s/kafka-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=kafka -n kafka --timeout=300s

kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/booking-service.yaml
kubectl apply -f k8s/frontend.yaml

# 4. Access frontend
kubectl port-forward service/frontend 3000:80 -n airbnb
```

For detailed instructions, see `DOCKER_KUBERNETES_SETUP.md` and `k8s/README.md`.

---

## 🗂️ Project Structure

```
Airbnb-Prototype/
├── backend/
│   ├── services/
│   │   ├── traveler-service/    # Traveler auth, profile, favorites, Kafka producer
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── kafka/           # Kafka producer for booking requests
│   │   │   └── server.js
│   │   ├── owner-service/       # Owner auth, profile, bookings, Kafka consumer
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── kafka/           # Kafka consumer for status updates
│   │   │   └── server.js
│   │   ├── property-service/    # Property CRUD, search, photos
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   ├── booking-service/     # Booking management, Kafka consumer/producer
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── kafka/           # Kafka consumer for booking requests
│   │   │   └── server.js
│   │   └── shared/              # Shared components
│   │       ├── models/mongoose/ # Mongoose schemas
│   │       ├── middleware/      # Auth, validation middleware
│   │       ├── kafka/          # Kafka client configuration
│   │       └── utils/          # Transform, date utils
│   ├── Dockerfile.*            # Dockerfiles for each service
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── store/              # Redux store and slices
│   │   ├── services/           # API service clients
│   │   └── utils/             # Utility functions
│   ├── Dockerfile
│   └── package.json
│
├── agent-backend/              # AI agent (FastAPI + LangChain)
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── k8s/                       # Kubernetes manifests
│   ├── *.yaml                 # Deployment, service, config files
│   └── README.md
│
├── docker-compose.yml         # Docker Compose configuration
└── README.md
```

---

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
| POST | `/api/bookings` | Create booking (via Traveler Service, publishes to Kafka) |
| GET | `/api/bookings/traveler` | Get traveler bookings |
| GET | `/api/bookings/property/:propertyId/blocked-dates` | Get blocked dates |

### Bookings (Owner Service - Port 5002)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/owner` | Get owner bookings |
| PUT | `/api/bookings/:id/accept` | Accept booking (publishes to Kafka) |
| PUT | `/api/bookings/:id/reject` | Reject booking (publishes to Kafka) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking (publishes to Kafka) |

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

---

## 🧭 User Journeys

### Traveler
1. **Register/Login** → JWT token stored in Redux state
2. **Browse** → Search and filter properties (Redux manages property state)
3. **Plan** → Use AI agent for itinerary & packing suggestions
4. **Book** → Create booking request (published to Kafka) → Redux updates booking state
5. **Save** → Add properties to favorites
6. **Profile** → Update profile and upload photo

### Owner
1. **Register/Login** → JWT token stored in Redux state
2. **List** → Add properties with photos and descriptions
3. **Manage** → Handle bookings (accept/reject/cancel) → Status updates published to Kafka
4. **Profile** → Update profile and upload photo

---

## 🔐 Authentication Flow

1. User registers/logs in via Traveler or Owner service
2. Service returns JWT token in response
3. Frontend stores token in Redux state (`authSlice`) and localStorage
4. Token included in `Authorization: Bearer <token>` header for protected routes
5. Services verify token using shared `authMiddleware`

---

## 📊 Kafka Event Flow

### Booking Creation Flow
1. **Traveler creates booking** → Traveler Service receives request
2. **Traveler Service** → Publishes to `booking-requests` Kafka topic
3. **Booking Service consumes** → Creates booking in MongoDB
4. **Booking Service** → Publishes `BOOKING_CREATED` to `booking-status-updates` topic
5. **Owner/Traveler Services consume** → Update UI via Redux

### Booking Status Updates
1. **Owner accepts/rejects/cancels** → Owner Service updates database
2. **Owner Service** → Publishes status update to `booking-status-updates` topic
3. **Traveler Service consumes** → Updates Redux state → UI reflects change

---

## 🧪 Testing

- Use **Postman** with the included `postman_collection.json`
- Test registration, login, bookings, and AI interactions
- All endpoints documented with example requests
- Ensure all services are running before testing

**Test Kafka Flow:**
1. Create a booking as a traveler
2. Check Booking Service logs: `docker-compose logs -f booking-service`
3. You should see: "✓ Received booking request from Kafka"
4. Accept booking as owner
5. Check Traveler Service logs: `docker-compose logs -f traveler-service`
6. You should see: "✓ Received status update: BOOKING_ACCEPTED"

---

## ⚙️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker Desktop not starting | Enable virtualization in BIOS, check system requirements |
| Port conflicts | Ensure ports 3000, 5001-5005, 27017, 9092, 2181 are free |
| Services not starting | Check logs: `docker-compose logs <service-name>` |
| Kafka connection errors | Restart Kafka: `docker-compose restart zookeeper kafka`, wait 30s, then restart services |
| Build fails | Rebuild: `docker-compose build --no-cache && docker-compose up -d` |
| Frontend not loading | Verify frontend container: `docker-compose ps frontend` |

**Quick fixes:**
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f

# Restart everything
docker-compose down && docker-compose up -d
```

---

## 📚 Additional Documentation

- **DOCKER_KUBERNETES_SETUP.md** – Detailed Docker and Kubernetes setup
- **KAFKA_IMPLEMENTATION_COMPLETE.md** – Kafka integration details
- **REDUX_DEVTOOLS_SCREENSHOT_GUIDE.md** – Redux DevTools guide
- **AWS_DEPLOYMENT_GUIDE.md** – AWS deployment instructions
- **backend/README.md** – Backend API documentation
- **k8s/README.md** – Kubernetes deployment guide

---

## 🎯 Next Steps

- [x] Docker containerization
- [x] Kubernetes deployment
- [x] Kafka integration for async messaging
- [x] Redux state management
- [ ] AWS deployment
- [ ] JMeter performance testing
- [ ] CI/CD pipeline

---

## 📝 Notes

- **Docker Compose** is recommended for local development
- **Kubernetes** is required for Lab 2 assignment and production
- **Kafka** handles asynchronous booking messaging
- **Redux** manages frontend state (auth, properties, bookings)

---

**Happy coding! 🎉**
