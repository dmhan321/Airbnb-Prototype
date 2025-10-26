# 🏠 Airbnb Prototype

A full-stack Airbnb clone built with React, Node.js, Express, MySQL, and an AI-powered travel assistant. It supports user authentication, property management, bookings, favorites, and an intelligent concierge agent for personalized travel recommendations.

## ✨ Key Features

### 🧑‍💻 Core Functionality
- **User Authentication** – Separate registration/login for travelers and property owners
- **Property Management** – CRUD operations with image uploads and availability control
- **Booking System** – Full booking workflow with status tracking and history
- **Favorites** – Add/remove properties with real-time updates
- **Profile Management** – Editable traveler/owner profiles with photo uploads

### 🤖 AI Concierge Agent
- **Smart Recommendations** – Activities, restaurants, packing lists, and itineraries
- **Personalized Insights** – Uses user preferences and travel details
- **Floating Widget** – Accessible on any page
- **Powered by FastAPI + LangChain + OpenAI GPT-4**

### 💡 Technical Highlights
- **Session-based Authentication** with express-session
- **RESTful APIs** using MVC architecture
- **Responsive Frontend** (React + Bootstrap 5)
- **AI Microservice** integrated via separate FastAPI backend

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, JavaScript ES6+, React Router v6, Axios, Bootstrap 5, React Calendar |
| **Backend** | Node.js, Express.js, Sequelize ORM, MySQL2, Multer, CORS, Joi validation, bcryptjs |
| **AI Agent** | Python 3.8+, FastAPI, LangChain, OpenAI GPT-4, Pydantic, Uvicorn |
| **Database** | MySQL 8.0+ with Sequelize migrations |
| **Tools** | Git, Postman, npm, pip, Sequelize CLI, Nodemon |


## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** (comes with Node.js)
- **Python** 3.8+
- **MySQL** 8.0+
- **Git**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dmhan321/Airbnb-Prototype.git
cd Airbnb-Prototype
```

### 2️⃣ Configure Environment Variables

**Backend** (`backend/.env`)
```bash
DB_NAME=airbnb_db
DB_USER=airbnb_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
DB_PORT=3306
PORT=5000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-key
OPENAI_API_KEY=your-openai-api-key
```

**Frontend** (`frontend/.env`)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AGENT_URL=http://localhost:5005
```

**AI Agent Backend** (`agent-backend/.env`)
```bash
OPENAI_API_KEY=your-openai-api-key
AGENT_PORT=5005
```

### 3️⃣ Database Setup (MySQL)
```sql
CREATE DATABASE IF NOT EXISTS airbnb_db;
CREATE USER IF NOT EXISTS 'airbnb_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON airbnb_db.* TO 'airbnb_user'@'localhost';
FLUSH PRIVILEGES;
```
Database schema: 
<img width="815" height="926" alt="db schema" src="https://github.com/user-attachments/assets/4913822f-210e-44e9-aef6-e3ca6f422bb5" />

### 4️⃣ Run Each Service

#### 🧠 Backend (Node.js)
```bash
cd backend
npm install
npx sequelize-cli db:migrate
npm start
```
**Runs at** `http://localhost:5000`

#### 🤖 AI Agent (Python)
```bash
cd agent-backend
python -m venv venv
venv\Scripts\activate       # Windows
# or
source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 5005
```
**Runs at** `http://localhost:5005`

#### 💻 Frontend (React)
```bash
cd frontend
npm install
npm start
```
**Runs at** `http://localhost:3000`

## 🗂️ Project Structure

```
Airbnb-Prototype/
├── backend/          # Express API server
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth middleware
│   ├── migrations/   # DB migrations
│   ├── uploads/      # File uploads
│   |── server.js
|   |__ .env
│
├── agent-backend/    # AI agent (FastAPI + LangChain)
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/         # React frontend
│   ├── components/
│   │   ├── auth/     # Login/Signup components
│   │   ├── common/   # Shared components
│   │   ├── owner/    # Owner-specific components
│   │   ├── traveler/ # Traveler-specific components
│   │   └── agent/    # AI agent components
│   ├── contexts/     # React contexts
│   ├── services/     # API services
│   ├── utils/        # Utility functions
│   └── App.js
|   |__ .env
└── README.md
```

## 🔌 API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/traveler` | Register traveler |
| POST | `/api/auth/register/owner` | Register owner |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| POST | `/api/properties` | Create property (owner only) |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| POST | `/api/properties/:id/photos` | Upload property photos |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/traveler` | Get traveler bookings |
| PUT | `/api/bookings/:id/accept` | Accept booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove favorite |

### AI Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent` | Chat-based AI recommendations |
| POST | `/agent-button` | Structured responses via FastAPI |

## 🧭 User Journeys

### Traveler
1. **Browse** → Search and filter properties
2. **Plan** → Use AI agent for itinerary & packing suggestions
3. **Book** → Make reservations and manage bookings
4. **Save** → Add properties to favorites

### Owner
1. **List** → Add properties with AI-suggested descriptions
2. **Manage** → Handle bookings and updates

## 🧪 Testing

- Use **Postman** with the included `postman_collection.json`
- Test registration, login, bookings, and AI interactions
- All endpoints documented with example requests

## ⚙️ Common Issues

| Issue | Solution |
|-------|----------|
| Port conflicts | Ensure 3000, 5000, 5005 are free |
| DB connection error | Check .env credentials and MySQL status |
| Module errors | Reinstall dependencies: `npm install` or `pip install -r requirements.txt` |
| Python venv not activated | Run `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux) |
| Bootstrap styles not loading | Ensure Bootstrap 5 is imported in `index.js` |

## 📚 Additional Docs

- **ENVIRONMENT_SETUP.md** – Full setup guide
- **SECURITY_SETUP.md** – Security best practices
- **Postman Collection** – API testing suite

---

**Happy coding! 🎉**
