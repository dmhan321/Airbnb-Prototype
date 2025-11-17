# Integration of Docker, Kubernetes, Kafka, and AWS into Lab 1 Project

## Overview

This section describes how Docker containerization, Kubernetes orchestration, Kafka asynchronous messaging, and AWS cloud deployment were integrated into the Lab 1 Airbnb prototype to transform it from a monolithic application into a scalable, distributed microservices architecture.

---

## 1. Docker Integration

### 1.1 Containerization Strategy

The Lab 1 monolithic application was decomposed into five independent microservices, each containerized using Docker:

- **Traveler Service** (`Dockerfile.traveler-service`): Handles traveler authentication, profile management, and booking requests
- **Owner Service** (`Dockerfile.owner-service`): Manages owner authentication, property management, and booking approvals
- **Property Service** (`Dockerfile.property-service`): Handles property CRUD operations, image uploads, and property search
- **Booking Service** (`Dockerfile.booking-service`): Processes bookings, manages booking status, and handles date conflicts
- **Frontend Service** (`Dockerfile`): React-based user interface served via Nginx

### 1.2 Dockerfile Architecture

Each service Dockerfile follows a multi-stage build pattern:

```dockerfile
# Example: Traveler Service Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY services/shared ./services/shared
COPY services/traveler-service ./services/traveler-service
RUN npm install --omit=dev
```

**Key Design Decisions:**
- **Alpine Linux base images**: Reduced image size by ~70% compared to standard Node.js images
- **Shared code handling**: Services share common models and utilities via a shared directory structure
- **Layer caching optimization**: Dependencies installed before code copying to maximize Docker layer caching
- **Production-only dependencies**: Using `--omit=dev` to exclude development dependencies

### 1.3 Docker Compose Configuration

The `docker-compose.yml` file orchestrates all services with proper networking and dependencies:

```yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    networks:
      - airbnb-network
  
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    networks:
      - airbnb-network
  
  mongodb:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

**Network Architecture:**
- All services connected via `airbnb-network` bridge network
- Services communicate using service names (e.g., `mongodb:27017`, `kafka:9092`)
- Port mapping exposes services to host machine for development

**Dependency Management:**
- Services wait for MongoDB health check before starting
- Kafka depends on Zookeeper initialization
- Backend services depend on both MongoDB and Kafka

### 1.4 Benefits Achieved

- **Isolation**: Each service runs in its own container with isolated dependencies
- **Reproducibility**: Consistent environments across development, testing, and production
- **Scalability**: Services can be scaled independently based on load
- **Portability**: Application runs identically on any Docker-compatible platform

---

## 2. Kubernetes Integration

### 2.1 Cluster Setup

The application was deployed to a local Kubernetes cluster using Minikube, with all services containerized and orchestrated via Kubernetes manifests.

### 2.2 Deployment Architecture

Each microservice has a dedicated Kubernetes deployment manifest (`k8s/*-service.yaml`):

```yaml
# Example: Booking Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: booking-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: booking-service
  template:
    spec:
      containers:
      - name: booking-service
        image: airbnb-booking-service:latest
        env:
        - name: KAFKA_BROKER
          valueFrom:
            configMapKeyRef:
              name: airbnb-config
              key: KAFKA_BROKER
```

**Key Components:**

1. **Deployments**: Manage service replicas and rolling updates
2. **Services**: Provide stable network endpoints for service discovery
3. **ConfigMaps**: Centralize configuration (Kafka brokers, service URLs)
4. **Secrets**: Store sensitive data (JWT secrets, API keys)
5. **PersistentVolumes**: Store MongoDB and Kafka data

### 2.3 Service Discovery

Kubernetes DNS enables automatic service discovery:

- Services accessible via `<service-name>.<namespace>.svc.cluster.local`
- Example: `booking-service.airbnb.svc.cluster.local:5004`
- Internal communication uses service names (e.g., `kafka.kafka.svc.cluster.local:9092`)

### 2.4 Configuration Management

**ConfigMap** (`k8s/configmap.yaml`) centralizes environment variables:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: airbnb-config
data:
  KAFKA_BROKER: "kafka.kafka.svc.cluster.local:9092"
  MONGODB_URI: "mongodb://mongodb:27017/airbnb_db"
  PUBLIC_PROPERTY_SERVICE_URL: "http://localhost:5003"
```

**Benefits:**
- Single source of truth for configuration
- Easy updates without rebuilding images
- Environment-specific configurations (dev/staging/prod)

### 2.5 Scaling and High Availability

- **Horizontal Pod Autoscaling (HPA)**: Can be configured to scale based on CPU/memory
- **Replica Sets**: Multiple pod instances for fault tolerance
- **Health Checks**: Liveness and readiness probes ensure service reliability

### 2.6 Port Forwarding for Development

For local development and testing, `kubectl port-forward` exposes services:

```bash
kubectl port-forward service/frontend 3000:80
kubectl port-forward service/traveler-service 5001:5001
kubectl port-forward service/owner-service 5002:5002
kubectl port-forward service/property-service 5003:5003
kubectl port-forward service/booking-service 5004:5004
```

---

## 3. Kafka Integration

### 3.1 Architecture Overview

Kafka was integrated to implement an event-driven architecture, decoupling services and enabling asynchronous message processing for the booking workflow.

### 3.2 Kafka Infrastructure

**Components:**
- **Zookeeper**: Manages Kafka cluster metadata and coordination
- **Kafka Broker**: Handles message storage and distribution
- **Topics**: 
  - `booking-requests`: Booking creation requests from Traveler Service
  - `booking-status-updates`: Status change notifications

**Deployment:**
- Kafka and Zookeeper deployed as StatefulSets in Kubernetes
- Persistent volumes for message retention
- Single broker setup for development (can scale to cluster)

### 3.3 Producer Implementation

**Traveler Service** acts as a producer, publishing booking requests:

```javascript
// backend/services/traveler-service/kafka/bookingProducer.js
const publishBookingRequest = async (bookingData) => {
  await sendMessage('booking-requests', [{
    key: bookingData.travelerId,
    value: {
      travelerId: bookingData.travelerId,
      propertyId: bookingData.propertyId,
      ownerId: bookingData.ownerId,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      timestamp: new Date().toISOString()
    }
  }]);
};
```

**Flow:**
1. Traveler creates booking via frontend
2. Frontend calls Traveler Service API
3. Traveler Service validates request and publishes to Kafka
4. Returns immediately with "pending" status (non-blocking)

### 3.4 Consumer Implementation

**Booking Service** consumes booking requests and creates bookings:

```javascript
// backend/services/booking-service/kafka/bookingConsumer.js
const startBookingConsumer = async () => {
  await consumer.subscribe({ topic: 'booking-requests' });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const bookingData = JSON.parse(message.value.toString());
      await createBookingFromKafka(bookingData);
      
      // Publish status update
      await sendMessage('booking-status-updates', [{
        key: booking._id.toString(),
        value: {
          bookingId: booking._id.toString(),
          status: 'PENDING',
          action: 'BOOKING_CREATED',
          timestamp: new Date().toISOString()
        }
      }]);
    }
  });
};
```

**Consumer Groups:**
- `booking-service-group`: Consumes `booking-requests` topic
- `traveler-notification-group`: Consumes `booking-status-updates` for traveler notifications
- `owner-notification-group`: Consumes `booking-status-updates` for owner notifications

### 3.5 Event Flow

**Complete Booking Lifecycle:**

1. **Booking Creation:**
   - Traveler Service → Kafka (`booking-requests`) → Booking Service
   - Booking Service → MongoDB (creates booking)
   - Booking Service → Kafka (`booking-status-updates`: `BOOKING_CREATED`)
   - Traveler/Owner Services consume status update

2. **Owner Accept:**
   - Owner Service → MongoDB (updates status to ACCEPTED)
   - Owner Service → Kafka (`booking-status-updates`: `BOOKING_ACCEPTED`)
   - Traveler Service consumes notification

3. **Owner Reject:**
   - Owner Service → MongoDB (updates status to CANCELLED)
   - Owner Service → Kafka (`booking-status-updates`: `BOOKING_REJECTED`)
   - Traveler Service consumes notification

4. **Booking Cancellation:**
   - Traveler/Owner Service → MongoDB (updates status to CANCELLED)
   - Service → Kafka (`booking-status-updates`: `BOOKING_CANCELLED`)
   - Both services consume notification

### 3.6 Benefits of Kafka Integration

- **Asynchronous Processing**: Non-blocking booking creation improves user experience
- **Service Decoupling**: Services communicate via events, not direct HTTP calls
- **Scalability**: Multiple consumers can process messages in parallel
- **Reliability**: Kafka persists messages, ensuring no data loss
- **Event Sourcing**: Complete audit trail of all booking state changes

### 3.7 Error Handling and Resilience

- **Retry Logic**: KafkaJS automatically retries failed connections
- **Consumer Offsets**: Messages are not lost if consumer crashes
- **Dead Letter Queue**: Failed messages can be logged for manual review (production enhancement)

---

## 4. AWS Integration

### 4.1 Current Status

**Note:** As of this report, the application has been fully containerized and tested locally with Docker Compose and Minikube. AWS deployment is planned but not yet completed.

### 4.2 Planned AWS Architecture

**Target Infrastructure:**

1. **Amazon EKS (Elastic Kubernetes Service)**
   - Managed Kubernetes cluster
   - Auto-scaling node groups
   - Integration with AWS services (IAM, VPC, Load Balancer)

2. **Amazon ECR (Elastic Container Registry)**
   - Private Docker image registry
   - Images pushed from CI/CD pipeline
   - Image scanning and security

3. **Application Load Balancer (ALB)**
   - Routes traffic to frontend service
   - SSL/TLS termination
   - Health checks

4. **Amazon RDS or DocumentDB**
   - Managed MongoDB-compatible database
   - Automated backups
   - Multi-AZ for high availability

5. **Amazon MSK (Managed Streaming for Kafka)**
   - Fully managed Kafka service
   - Automatic scaling
   - Built-in monitoring

### 4.3 Deployment Strategy

**Steps for AWS Deployment:**

1. **Container Registry Setup:**
   ```bash
   # Create ECR repositories
   aws ecr create-repository --repository-name airbnb-traveler-service
   aws ecr create-repository --repository-name airbnb-owner-service
   # ... (repeat for all services)
   
   # Push images
   docker tag airbnb-traveler-service:latest <account>.dkr.ecr.<region>.amazonaws.com/airbnb-traveler-service:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/airbnb-traveler-service:latest
   ```

2. **EKS Cluster Creation:**
   ```bash
   eksctl create cluster --name airbnb-cluster --region us-east-1 --node-type t3.medium --nodes 3
   ```

3. **Kubernetes Deployment:**
   - Update image references in manifests to ECR URLs
   - Apply ConfigMaps and Secrets
   - Deploy all services: `kubectl apply -f k8s/`

4. **Load Balancer Configuration:**
   - Create ALB ingress controller
   - Configure DNS (Route 53)
   - Set up SSL certificates (ACM)

### 4.4 Benefits of AWS Deployment

- **Scalability**: Auto-scaling based on demand
- **High Availability**: Multi-AZ deployment
- **Managed Services**: Reduced operational overhead
- **Security**: IAM, VPC, security groups
- **Monitoring**: CloudWatch integration
- **Cost Optimization**: Pay only for resources used

### 4.5 Current Local Deployment

For development and testing, the application runs on:

- **Docker Compose**: Local development environment
- **Minikube**: Local Kubernetes cluster
- **Port Forwarding**: Access services via localhost

This local setup mirrors the production architecture, enabling:
- Full feature testing
- Performance testing with JMeter
- Development iteration without AWS costs

---

## 5. Integration Challenges and Solutions

### 5.1 Service Communication

**Challenge:** Services need to communicate reliably across containers.

**Solution:**
- Docker Compose network for local development
- Kubernetes service discovery for cluster deployment
- Environment variables for service URLs
- Health checks to ensure services are ready

### 5.2 Kafka Connection Timing

**Challenge:** Services attempted to connect to Kafka before it was fully initialized.

**Solution:**
- Implemented startup order: Zookeeper → Kafka → Services
- Added 30-second wait time for Kafka initialization
- Used `depends_on` in Docker Compose
- Implemented retry logic in KafkaJS client

### 5.3 Image URL Resolution

**Challenge:** Property images stored with internal service URLs not accessible from browser.

**Solution:**
- Added `PUBLIC_PROPERTY_SERVICE_URL` environment variable
- Frontend utility (`imageUtils.js`) converts internal URLs to localhost
- Port forwarding exposes services to browser

### 5.4 State Management

**Challenge:** Maintaining consistent state across microservices.

**Solution:**
- MongoDB as single source of truth
- Kafka events for state synchronization
- Redux for frontend state management
- Event-driven architecture for eventual consistency

---

## 6. Architecture Diagram

```
┌─────────────┐
│   Frontend  │ (React + Nginx)
│   Service   │
└──────┬──────┘
       │ HTTP
       │
┌──────▼──────────────────────────────────────────────┐
│              Docker Network / Kubernetes Cluster     │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Traveler   │  │    Owner     │  │ Property  │ │
│  │   Service    │  │   Service    │  │  Service  │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                  │                 │       │
│         │                  │                 │       │
│         └──────────────────┼─────────────────┘       │
│                            │                         │
│                   ┌────────▼────────┐               │
│                   │  Booking Service │               │
│                   └────────┬─────────┘               │
│                            │                         │
│         ┌──────────────────┼──────────────────┐    │
│         │                  │                   │     │
│    ┌────▼────┐      ┌──────▼──────┐    ┌─────▼───┐ │
│    │  Kafka  │◄─────┤  Zookeeper  │    │ MongoDB │ │
│    │ Broker  │      │             │    │         │ │
│    └─────────┘      └─────────────┘    └─────────┘ │
│         │                                         │
│         │ Topics:                                 │
│         │ - booking-requests                      │
│         │ - booking-status-updates               │
└─────────┼─────────────────────────────────────────┘
          │
          │ Events
          │
    ┌─────▼─────┐
    │ Consumers │
    │ (Services)│
    └───────────┘
```

---

## 7. Conclusion

The integration of Docker, Kubernetes, Kafka, and AWS (planned) has transformed the Lab 1 monolithic application into a modern, scalable microservices architecture. Key achievements:

- **Containerization**: All services isolated and portable
- **Orchestration**: Kubernetes manages deployment and scaling
- **Event-Driven**: Kafka enables asynchronous, decoupled communication
- **Scalability**: Architecture supports horizontal scaling
- **Reliability**: Health checks, retries, and persistent storage ensure high availability

This architecture provides a solid foundation for production deployment on AWS, with the flexibility to scale individual services based on demand and maintain high availability through distributed design.

