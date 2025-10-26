# 🏠 Airbnb Prototype

A full-stack Airbnb clone built with React, Node.js, Express, MySQL, and AI-powered travel assistance. Features complete user authentication, property management, booking system, favorites functionality, and an intelligent AI concierge agent.

## ✨ Features

- **User Authentication** - Separate registration for travelers and property owners
- **Property Management** - Full CRUD operations with photo uploads
- **Booking System** - Complete booking workflow with status management
- **Favorites System** - Save and manage favorite properties
- **AI Travel Agent** - Intelligent recommendations for activities, restaurants, and packing
- **Photo Uploads** - Profile pictures and property photos with preview
- **Responsive Design** - Mobile-first approach with modern UI
- **Environment Configuration** - Flexible setup with environment variables

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Python** 3.8+ (for AI agent backend)
- **MySQL** 8.0 or higher
- **Git** (for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/dmhan321/Airbnb-Prototype.git
cd Airbnb-Prototype
```

### 2. Environment Setup

Create environment files for each service:

#### Backend Environment (.env in root directory)
```bash
# Database Configuration
DB_NAME=airbnb_db
DB_USER=airbnb_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
DB_PORT=3306

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-key-here

# OpenAI API Key (for AI agent)
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend Environment (.env in frontend directory)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AGENT_URL=http://localhost:5005
```

#### Agent Backend Environment (.env in agent-backend directory)
```bash
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Agent Backend Configuration
AGENT_PORT=5005
```

### 3. Database Setup (MySQL)

1. **Start MySQL** and create database and user:

```sql
CREATE DATABASE IF NOT EXISTS airbnb_db;
CREATE USER IF NOT EXISTS 'airbnb_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON airbnb_db.* TO 'airbnb_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Configure database credentials** in your `.env` file (see step 2)

### 4. Backend Setup

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npm start
```

The backend will run on `http://localhost:5000`

### 5. Agent Backend Setup (AI Service)

```bash
cd agent-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-dotenv requests pydantic langchain langchain-core langchain-openai openai

# Start the agent backend
python main.py
```

The agent backend will run on `http://localhost:5005`

### 6. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### 7. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🎯 Core Features & AI Integration

### 🏠 Property Management & Booking System

#### For Property Owners
- **Property Listings**: Create detailed property listings with multiple photos, amenities, and availability
- **Smart Pricing**: Set dynamic pricing based on seasons and demand
- **Booking Management**: Accept, decline, or manage incoming booking requests
- **Photo Management**: Upload, replace, or add property photos with real-time previews

#### For Travelers
- **Advanced Search**: Filter properties by location, price, guests, amenities, and availability
- **Property Discovery**: Browse properties with high-quality images and detailed descriptions
- **Booking System**: Make reservations with date selection and guest count
- **Favorites Management**: Save and organize favorite properties with instant updates
- **AI Travel Assistant**: Get personalized recommendations for activities, restaurants, and packing

### 🤖 AI-Powered Travel Assistant

The AI Concierge Agent revolutionizes the travel planning experience by providing intelligent, context-aware assistance:

#### **Smart Recommendations**
- **Activity Suggestions**: Discover local attractions with addresses, accessibility info, and user ratings
- **Restaurant Recommendations**: Find dining options based on dietary preferences (vegan, gluten-free, etc.)
- **Packing Checklists**: Generate weather-aware packing lists tailored to destination and season
- **Itinerary Planning**: Create detailed day-by-day travel plans with morning, afternoon, and evening activities

#### **Personalized Experience**
- **Profile Integration**: Automatically pulls traveler preferences, dietary restrictions, and travel history
- **Context Awareness**: Considers current location, trip duration, and travel dates
- **Real-time Data**: Updates recommendations based on current weather and local events
- **Natural Language**: Ask questions in plain English like "What should I do on a rainy afternoon in San Francisco?"

#### **Seamless Integration**
- **Floating UI Widget**: Access the AI assistant from any page in the application
- **Quick Actions**: One-click buttons for common requests (activities, restaurants, packing)
- **Instant Responses**: Get immediate, well-formatted recommendations
- **Multi-modal Support**: Handles both structured queries and free-form conversations

### 🔄 Enhanced User Workflows

#### **Traveler Journey with AI**
1. **Discovery**: Browse properties with AI-powered search suggestions
2. **Planning**: Use AI agent to research activities and restaurants near chosen property
3. **Booking**: Make reservations with confidence using AI-generated insights
4. **Preparation**: Get personalized packing lists and travel tips
5. **Experience**: Access real-time recommendations during the trip

### 🎨 User Interface Features

#### **Modern Design**
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean, user-friendly interface with clear call-to-actions
- **Real-time Updates**: Instant UI updates for favorites, bookings, and profile changes
- **Photo Galleries**: High-quality image displays with zoom and navigation

#### **Interactive Elements**
- **Date Pickers**: Intuitive calendar interfaces for booking and availability
- **Search Filters**: Advanced filtering with instant results
- **Floating AI Widget**: Always-accessible AI assistant with smooth animations

## 🏗️ Project Structure

```
Airbnb-Prototype/
│
├── backend/                             # Node.js/Express Backend
│   ├── controllers/                     # API route handlers
│   ├── models/                          # Sequelize database models
│   ├── routes/                          # API routes
│   ├── middleware/                      # Authentication middleware
│   ├── migrations/                      # Database migrations
│   ├── config/                          # Database configuration
│   │   ├── config.json.template         # Template for database config
│   │   └── config.json                  # Actual config (gitignored)
│   ├── uploads/                         # File uploads directory
│   ├── server.js                        # Main server file
│   └── postman_collection.json          # API testing collection
│
├── agent-backend/                       # AI Agent Backend (FastAPI + LangChain)
│   ├── venv/                           # Python virtual environment
│   ├── main.py                         # FastAPI entrypoint
│   ├── requirements.txt                # Python dependencies
│   └── .env                            # Environment variables
│
├── frontend/                           # React Frontend
│   ├── public/                         # Static assets
│   └── src/                            # React source code
│       ├── components/                 # React components
│       │   ├── auth/                   # Authentication components
│       │   ├── common/                 # Shared components
│       │   ├── owner/                  # Owner-specific components
│       │   ├── traveler/               # Traveler-specific components
│       │   └── agent/                  # AI Concierge Agent components
│       │       ├── AgentButton.jsx     # Floating agent button UI
│       │       ├── AgentPanel.jsx      # Popup agent interface
│       │       └── AgentStyles.css     # Styling for floating agent widget
│       ├── contexts/                   # React contexts (AuthContext)
│       ├── services/                   # API service functions
│       ├── utils/                      # Utility functions
│       │   └── imageUtils.js           # Image URL utilities
│       └── App.js                      # Main app component
│
├── .gitignore                          # Git ignore rules
├── ENVIRONMENT_SETUP.md               # Detailed environment setup guide
├── SECURITY_SETUP.md                  # Security configuration guide
└── README.md                          # Project documentation
```

## 🤖 AI Agent Integration

The AI Concierge Agent provides intelligent, context-aware travel assistance:

### Features
- **Personalized Recommendations** - Based on user profile and preferences
- **Multiple Modes**:
  - **Activities** - Local attractions with addresses and accessibility info
  - **Restaurants** - Food recommendations based on dietary preferences
  - **Packing** - Weather-aware packing checklists
  - **Itinerary** - Day-by-day travel plans
- **Floating UI Widget** - Accessible from any page
- **Real-time Data** - Pulls current user profile and travel details

### Technical Stack
- **FastAPI** - High-performance Python web framework
- **LangChain** - LLM application framework
- **OpenAI GPT-4** - Large language model for responses
- **Structured Prompts** - Context-aware prompt templates

## 🗄️ Database Schema

- **Travelers** - User profiles with preferences and travel history
- **Owners** - Property owner profiles with business details
- **Properties** - Property listings with images and availability
- **Bookings** - Booking system with status management
- **Favorites** - User property favorites

## 🔄 AI-Enhanced User Workflows

### **Complete Traveler Experience**
1. **Discovery Phase**
   - Browse properties with AI-powered search suggestions
   - Get personalized property recommendations based on preferences
   - Use AI to research neighborhoods and local attractions

2. **Planning Phase**
   - Select a property and use AI agent to plan activities nearby
   - Get restaurant recommendations based on dietary preferences
   - Generate personalized packing lists for the destination

3. **Booking Phase**
   - Make reservations with confidence using AI-generated insights
   - Get real-time availability and pricing recommendations
   - Receive booking confirmations with AI-suggested next steps

4. **Pre-Trip Phase**
   - Access detailed itineraries with morning, afternoon, and evening activities
   - Get weather-aware packing checklists
   - Receive local tips and recommendations

5. **During Trip**
   - Access floating AI widget for real-time assistance
   - Get recommendations for last-minute activities
   - Ask questions about local transportation, dining, or attractions

### **Complete Owner Experience**
1. **Property Setup**
   - Create listings with AI-suggested descriptions and amenities
   - Get pricing recommendations based on local market data
   - Use AI to identify nearby attractions to highlight

2. **Management Phase**
   - Receive AI insights on booking patterns and guest preferences
   - Get suggestions for property improvements
   - Use AI to craft professional responses to guest inquiries

3. **Optimization Phase**
   - Analyze performance with AI-powered analytics
   - Get recommendations for pricing adjustments
   - Learn about seasonal trends and local events

## 🧪 Testing the Application

### 1. User Registration
- Register as a **Traveler** to book properties
- Register as an **Owner** to list properties

### 2. Property Management (Owner)
- Create property listings with multiple photos
- Set availability dates and pricing
- Manage booking requests
- Update property information and photos

### 3. Booking System (Traveler)
- Search and filter properties by location, price, guests
- View detailed property information
- Make bookings with date selection
- Manage booking history

### 4. Favorites System (Traveler)
- Add/remove properties from favorites
- View favorite properties list
- Automatic UI updates

### 5. AI Agent Testing
- Click the floating agent button
- Try different recommendation modes
- Test natural language queries

## 📋 Available Scripts

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

### Agent Backend Scripts
```bash
python main.py     # Start FastAPI server
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/traveler` - Register traveler
- `POST /api/auth/register/owner` - Register owner
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Owner only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)
- `POST /api/properties/:id/photos` - Upload property photos

### Bookings
- `GET /api/bookings/traveler` - Get traveler bookings
- `GET /api/bookings/owner` - Get owner bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/accept` - Accept booking (Owner only)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### AI Agent
- `POST /api/agent` - General AI chat (Backend)
- `POST /agent-button` - Structured recommendations (FastAPI)

### Profile Management
- `GET /api/travelers/profile` - Get traveler profile
- `PUT /api/travelers/profile` - Update traveler profile
- `POST /api/travelers/profile/picture` - Upload traveler photo
- `GET /api/owners/profile` - Get owner profile
- `PUT /api/owners/profile` - Update owner profile
- `POST /api/owners/profile/picture` - Upload owner photo

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DB_NAME=airbnb_db
DB_USER=airbnb_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
DB_PORT=3306

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AGENT_URL=http://localhost:5005
```

### Agent Backend (.env)
```bash
OPENAI_API_KEY=your-openai-api-key
AGENT_PORT=5005
```


## 📚 Documentation

- **ENVIRONMENT_SETUP.md** - Detailed environment configuration
- **SECURITY_SETUP.md** - Security best practices
- **Postman Collection** - Complete API testing suite


### Common Issues

1. **Port conflicts** - Ensure ports 3000, 5000, and 5005 are available
2. **Database connection** - Verify MySQL is running and credentials are correct
3. **Environment variables** - Check all `.env` files are properly configured
4. **Python dependencies** - Ensure virtual environment is activated
5. **Node modules** - Try deleting `node_modules` and running `npm install`
