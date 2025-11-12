# Lab 2 Implementation Plan

## 📋 Overview
This document outlines the step-by-step plan for implementing Lab 2 requirements: Docker, Kubernetes, Kafka, MongoDB, Redux, and AWS deployment.

---

## 🎯 Recommended Implementation Order

### **Phase 1: Foundation Changes (Do First)**
**Why:** These are foundational changes that everything else depends on. Doing them first prevents rework.

#### 1.1 MongoDB Migration (Part 3) ⚠️ **START HERE**
**Priority: HIGHEST**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Install MongoDB and Mongoose
- [ ] Convert Sequelize models to Mongoose schemas
  - Traveler, Owner, Property, Booking, Favorite models
- [ ] Update all controllers to use Mongoose
- [ ] Migrate database connection logic
- [ ] Update session store to use MongoDB (connect-mongo)
- [ ] Test all CRUD operations
- [ ] Data migration script (if needed)

**Why First:**
- Database is the foundation - everything depends on it
- Easier to debug locally before containerization
- Need stable database before splitting services
- Session storage in MongoDB is required

**Dependencies:** None (can work with existing code)

---

#### 1.2 Switch to JWT Authentication (Prerequisite for Redux)
**Priority: HIGH**  
**Estimated Time: 1 day**

**Tasks:**
- [ ] Install jsonwebtoken
- [ ] Replace express-session with JWT tokens
- [ ] Update auth middleware to verify JWT
- [ ] Update login/register to return JWT
- [ ] Update frontend authService to store JWT
- [ ] Test authentication flow

**Why Now:**
- Redux needs JWT tokens (not sessions) for state management
- Must be done before Redux integration
- Easier to test before service splitting

**Dependencies:** MongoDB (for user storage)

---

### **Phase 2: Frontend Enhancement**
**Why:** Frontend changes are independent and can be done in parallel with backend restructuring.

#### 2.1 Redux Integration (Part 4) ✅ **DO THIS SECOND**
**Priority: HIGH**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Install Redux Toolkit (@reduxjs/toolkit, react-redux)
- [ ] Create Redux store structure
- [ ] Create auth slice (JWT token, user data)
- [ ] Create property slice (property list, search results, details)
- [ ] Create booking slice (bookings, favorites, status)
- [ ] Replace AuthContext with Redux
- [ ] Update components to use Redux hooks
- [ ] Add Redux DevTools
- [ ] Test all state management flows

**Why Second:**
- Can be done independently of backend restructuring
- Needs JWT auth (from Phase 1.2)
- Frontend-only changes, easier to test
- Provides better state management foundation

**Dependencies:** JWT Authentication (Phase 1.2)

---

#### 2.2 UI Upgrade - Modern Airbnb Design 🎨
**Priority: MEDIUM-HIGH**  
**Estimated Time: 3-4 days**

**Tasks:**
- [ ] **Design System:**
  - Create modern color palette (Airbnb-inspired)
  - Add custom CSS variables for theming
  - Install additional UI libraries if needed (react-icons, framer-motion for animations)
- [ ] **Property Cards Redesign:**
  - Modern card layout with better image display
  - Hover effects and transitions
  - Better typography and spacing
  - Star ratings display
  - Price highlighting
- [ ] **Property Details Page:**
  - Image gallery with lightbox
  - Better layout for amenities
  - Improved booking calendar UI
  - Responsive design improvements
- [ ] **Search & Filter UI:**
  - Modern search bar design
  - Better date picker styling
  - Filter chips/tags
  - Search results layout improvements
- [ ] **Dashboard Improvements:**
  - Better tab navigation
  - Improved booking cards
  - Enhanced profile views
- [ ] **General UI Polish:**
  - Consistent spacing and margins
  - Better button styles
  - Loading states and skeletons
  - Error message styling
  - Mobile responsiveness improvements

**Why After Redux:**
- Redux provides better state management for UI components
- Can build UI with proper state management from the start
- Frontend-only work, doesn't block backend
- Makes the app look professional before deployment

**Dependencies:** Redux Integration (Phase 2.1)

---

#### 2.3 Property Reordering Feature (View/Favorite-Based) ⭐
**Priority: MEDIUM**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] **Backend:**
  - Create `PropertyView` model/schema in MongoDB (track property views per user)
  - Add endpoint: `POST /api/properties/:id/view` (track when user views property)
  - Update property search/listing endpoint to support sorting:
    - Sort by: favorites first, then viewed properties, then others
    - Add query parameter: `?sort=preference` (default) or `?sort=default`
  - Update favorites endpoint to trigger reordering
- [ ] **Frontend:**
  - Track property views when user clicks "View Details"
  - Update Redux property slice to include:
    - `viewedProperties` array
    - `favoriteIds` array
    - Sorting logic in selector
  - Create sorting utility function:
    ```javascript
    // Sort order: Favorited > Viewed > Others
    const sortByPreference = (properties, favorites, viewed) => {
      return properties.sort((a, b) => {
        const aIsFav = favorites.includes(a.id);
        const bIsFav = favorites.includes(b.id);
        const aIsViewed = viewed.includes(a.id);
        const bIsViewed = viewed.includes(a.id);
        
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        if (aIsViewed && !bIsViewed) return -1;
        if (!aIsViewed && bIsViewed) return 1;
        return 0;
      });
    };
    ```
  - Update PropertyCard to call view tracking on click
  - Update PropertyDetails to track view on mount
  - Update TravelerDashboard to use sorted properties
  - Add visual indicators (badges) for favorited/viewed properties
- [ ] **Testing:**
  - Test view tracking
  - Test sorting logic
  - Test with multiple users
  - Verify favorites show first, then viewed

**Why After UI Upgrade:**
- Can integrate seamlessly with new UI design
- Uses Redux state management (from Phase 2.1)
- Needs MongoDB for view tracking (Phase 1.1 complete)
- Feature enhancement that improves UX

**Dependencies:** 
- MongoDB Migration (Phase 1.1)
- Redux Integration (Phase 2.1)
- UI Upgrade (Phase 2.2) - optional but recommended

---

### **Phase 3: Backend Microservices Split**
**Why:** Need to split services before containerization and Kafka integration.

#### 3.1 Split Backend into Microservices
**Priority: HIGH**  
**Estimated Time: 3-4 days**

**Tasks:**
- [ ] Create service structure:
  - `services/traveler-service/` (auth, profile)
  - `services/owner-service/` (owner profile, booking management)
  - `services/property-service/` (property CRUD, search)
  - `services/booking-service/` (booking creation, status)
  - `services/agent-service/` (already separate, just containerize)
- [ ] Extract routes and controllers per service
- [ ] Create shared utilities (models, middleware)
- [ ] Update service-to-service communication
- [ ] Test each service independently
- [ ] Update frontend API endpoints

**Why Now:**
- Must be done before Docker/Kubernetes
- Kafka integration requires separate services
- Easier to test locally before containerization

**Dependencies:** MongoDB migration, JWT auth

---

### **Phase 4: Containerization & Orchestration**
**Why:** Containerize after services are stable and split.

#### 4.1 Dockerize Services (Part 1)
**Priority: HIGH**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Create Dockerfile for each service:
  - Traveler service
  - Owner service
  - Property service
  - Booking service
  - Agentic AI service (Python)
  - Frontend (React)
- [ ] Create docker-compose.yml for local testing
- [ ] Test all services in containers
- [ ] Optimize Docker images (multi-stage builds)
- [ ] Create .dockerignore files

**Why After Service Split:**
- Need stable service structure first
- Easier to containerize individual services
- Can test locally with docker-compose

**Dependencies:** Microservices split (Phase 3)

---

#### 4.2 Kubernetes Deployment (Part 1)
**Priority: HIGH**  
**Estimated Time: 3-4 days**

**Tasks:**
- [ ] Create Kubernetes manifests:
  - Deployments for each service
  - Services (ClusterIP/LoadBalancer)
  - ConfigMaps for environment variables
  - Secrets for sensitive data
- [ ] Create MongoDB StatefulSet
- [ ] Set up service discovery
- [ ] Configure health checks
- [ ] Test on local Kubernetes (minikube/kind)
- [ ] Deploy to AWS EKS
- [ ] Configure ingress/load balancer

**Why After Docker:**
- Need containerized services first
- Kubernetes orchestrates containers
- Can test locally before AWS

**Dependencies:** Dockerized services (Phase 4.1)

---

### **Phase 5: Kafka Integration**
**Why:** Kafka requires stable services and Kubernetes infrastructure.

#### 5.1 Kafka Setup (Part 2)
**Priority: MEDIUM**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Add Kafka to Kubernetes (StatefulSet)
- [ ] Create Kafka topics:
  - `booking-requests` (Traveler → Booking Service)
  - `booking-status-updates` (Owner → Traveler Service)
- [ ] Install kafkajs in Node.js services
- [ ] Configure Kafka producers/consumers
- [ ] Test Kafka locally

**Why After Kubernetes:**
- Kafka needs to run in Kubernetes cluster
- Requires stable service architecture
- Easier to debug with containerized services

**Dependencies:** Kubernetes setup (Phase 4.2)

---

#### 5.2 Implement Async Booking Flow (Part 2)
**Priority: MEDIUM**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] **Frontend Services (Producers):**
  - Traveler service publishes booking request to Kafka
  - Update booking creation endpoint
- [ ] **Backend Services (Consumers):**
  - Booking service consumes booking requests
  - Owner service consumes for accept/cancel
  - Publishes status updates back
- [ ] Implement event handlers
- [ ] Add error handling and retries
- [ ] Test async flow end-to-end
- [ ] Document event schemas

**Why After Kafka Setup:**
- Need Kafka infrastructure first
- Requires stable microservices
- Complex integration, needs careful testing

**Dependencies:** Kafka setup (Phase 5.1), Microservices (Phase 3)

---

### **Phase 6: AWS Deployment & Testing**
**Why:** Final deployment and performance testing.

#### 6.1 AWS Deployment
**Priority: MEDIUM**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Set up AWS EKS cluster
- [ ] Configure AWS RDS for MongoDB (or use MongoDB Atlas)
- [ ] Deploy all services to EKS
- [ ] Configure AWS Load Balancer
- [ ] Set up monitoring and logging
- [ ] Configure auto-scaling
- [ ] Test production deployment
- [ ] Take screenshots for report

**Why Last:**
- Need everything working locally first
- AWS costs money - test locally first
- Final integration step

**Dependencies:** All previous phases

---

#### 6.2 JMeter Performance Testing (Part 5)
**Priority: MEDIUM**  
**Estimated Time: 2-3 days**

**Tasks:**
- [ ] Install and configure JMeter
- [ ] Create test plans for:
  - User authentication (login/register)
  - Property data fetching (search, details)
  - Booking processing (create, accept, cancel)
- [ ] Configure thread groups (100, 200, 300, 400, 500 users)
- [ ] Run performance tests
- [ ] Collect metrics (response time, throughput, error rate)
- [ ] Generate graphs and analysis
- [ ] Document bottlenecks and improvements
- [ ] Save .jmx files

**Why Last:**
- Need stable production-like environment
- Tests the entire system
- Final validation step

**Dependencies:** AWS deployment (Phase 6.1)

---

## 📊 Implementation Timeline Summary

| Phase | Task | Duration | Dependencies |
|-------|------|----------|--------------|
| 1.1 | MongoDB Migration | 2-3 days | None |
| 1.2 | JWT Authentication | 1 day | MongoDB |
| 2.1 | Redux Integration | 2-3 days | JWT Auth |
| 2.2 | UI Upgrade | 3-4 days | Redux |
| 2.3 | Property Reordering | 2-3 days | MongoDB, Redux |
| 3.1 | Microservices Split | 3-4 days | MongoDB, JWT |
| 4.1 | Dockerize Services | 2-3 days | Microservices |
| 4.2 | Kubernetes Setup | 3-4 days | Docker |
| 5.1 | Kafka Setup | 2-3 days | Kubernetes |
| 5.2 | Kafka Integration | 2-3 days | Kafka Setup |
| 6.1 | AWS Deployment | 2-3 days | All previous |
| 6.2 | JMeter Testing | 2-3 days | AWS |

**Total Estimated Time: 26-36 days**

---

## 🎯 Why This Order?

### ✅ **Advantages:**
1. **Minimal Rework:** Foundation changes first prevent redoing work
2. **Incremental Testing:** Each phase can be tested independently
3. **Risk Management:** High-risk changes (DB migration) done early
4. **Parallel Work:** Frontend (Redux) can be done while backend restructures
5. **Logical Dependencies:** Each phase builds on previous ones

### ⚠️ **Alternative Order (NOT Recommended):**
- ❌ Docker first → Would need to redo when splitting services
- ❌ Kafka first → Needs stable microservices architecture
- ❌ Redux without JWT → Would need to refactor auth later
- ❌ Kubernetes before Docker → Can't orchestrate without containers

---

## 📝 Key Decisions

1. **JWT over Sessions:** Required for Redux state management
2. **Microservices Split:** Required for Kafka async messaging
3. **MongoDB First:** Foundation that everything depends on
4. **Local Testing First:** Test everything locally before AWS

---

## 🚀 Quick Start Checklist

- [ ] Phase 1.1: MongoDB Migration
- [ ] Phase 1.2: JWT Authentication  
- [ ] Phase 2.1: Redux Integration
- [ ] Phase 2.2: UI Upgrade (Modern Airbnb Design)
- [ ] Phase 2.3: Property Reordering Feature
- [ ] Phase 3.1: Microservices Split
- [ ] Phase 4.1: Dockerize Services
- [ ] Phase 4.2: Kubernetes Setup
- [ ] Phase 5.1: Kafka Setup
- [ ] Phase 5.2: Kafka Integration
- [ ] Phase 6.1: AWS Deployment
- [ ] Phase 6.2: JMeter Testing

---

## 📚 Additional Notes

- **Backup:** Create git branch before starting each major phase
- **Testing:** Write tests as you go, don't wait until the end
- **Documentation:** Document each phase for the report
- **Screenshots:** Take screenshots throughout (Kafka, Redux DevTools, AWS, JMeter, UI improvements)

---

## 🎨 Feature Additions Summary

### **UI Upgrade (Phase 2.2)**
- Modern Airbnb-inspired design
- Enhanced property cards with better images
- Improved search and filter UI
- Better mobile responsiveness
- Professional polish throughout

### **Property Reordering (Phase 2.3)**
- Properties sorted by user preference:
  1. **Favorited properties** (show first)
  2. **Viewed properties** (show second)
  3. **Other properties** (show last)
- View tracking when user clicks property details
- Automatic reordering when favorites change
- Visual indicators for favorited/viewed properties

**Benefits:**
- Better user experience - users see relevant properties first
- Increases engagement with favorited properties
- Personalizes the browsing experience

