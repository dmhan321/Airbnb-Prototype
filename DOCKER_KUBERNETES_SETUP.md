# Docker & Kubernetes Setup Guide

## 🐳 Phase 4.1: Docker Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose installed (comes with Docker Desktop)

### Building Images

Build all Docker images from the project root:

```bash
# Backend services
cd backend
docker build -f Dockerfile.traveler-service -t traveler-service:latest .
docker build -f Dockerfile.owner-service -t owner-service:latest .
docker build -f Dockerfile.property-service -t property-service:latest .
docker build -f Dockerfile.booking-service -t booking-service:latest .

# Frontend
cd ../frontend
docker build -t frontend:latest .

# Agent Backend
cd ../agent-backend
docker build -t agent-backend:latest .
```

### Running with Docker Compose

1. **Create `.env` file** (optional, for custom secrets):
```env
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

2. **Start all services**:
```bash
docker-compose up -d
```

3. **View logs**:
```bash
docker-compose logs -f
```

4. **Stop services**:
```bash
docker-compose down
```

5. **Stop and remove volumes** (clean slate):
```bash
docker-compose down -v
```

### Accessing Services

- Frontend: http://localhost:3000
- Traveler Service: http://localhost:5001
- Owner Service: http://localhost:5002
- Property Service: http://localhost:5003
- Booking Service: http://localhost:5004
- Agent Backend: http://localhost:5005
- MongoDB: localhost:27017

### Health Checks

```bash
# Check service health
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
curl http://localhost:5004/health
curl http://localhost:5005/health
```

---

## ☸️ Phase 4.2: Kubernetes Setup

### Prerequisites

**Option 1: Local Kubernetes (Recommended for Testing)**
- minikube: https://minikube.sigs.k8s.io/docs/start/
- kind: https://kind.sigs.k8s.io/docs/user/quick-start/

**Option 2: Cloud Kubernetes**
- AWS EKS
- Google GKE
- Azure AKS

### Local Setup with minikube

1. **Start minikube**:
```bash
minikube start
```

2. **Build and load images**:
```bash
# Build images (see Docker section above)
# Load to minikube
minikube image load traveler-service:latest
minikube image load owner-service:latest
minikube image load property-service:latest
minikube image load booking-service:latest
minikube image load frontend:latest
minikube image load agent-backend:latest
```

3. **Update secrets** in `k8s/secrets.yaml`:
```yaml
stringData:
  JWT_SECRET: "your-actual-secret"
  OPENAI_API_KEY: "your-actual-api-key"
```

4. **Deploy to Kubernetes**:
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Create PersistentVolumes
kubectl apply -f k8s/persistent-volumes.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-statefulset.yaml

# Wait for MongoDB
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s

# Deploy services
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/booking-service.yaml
kubectl apply -f k8s/agent-backend.yaml
kubectl apply -f k8s/frontend.yaml
```

5. **Check status**:
```bash
kubectl get pods -n airbnb
kubectl get services -n airbnb
```

6. **Access services**:
```bash
# Port forward frontend
kubectl port-forward service/frontend 3000:80 -n airbnb

# Or use minikube service
minikube service frontend -n airbnb
```

### Deploy All at Once

```bash
kubectl apply -f k8s/
```

### Cleanup

```bash
kubectl delete namespace airbnb
```

---

## 🔍 Verification

### Docker Compose

```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs traveler-service
docker-compose logs frontend

# Test health endpoints
curl http://localhost:5001/health
```

### Kubernetes

```bash
# Check pods
kubectl get pods -n airbnb

# Check services
kubectl get services -n airbnb

# Check logs
kubectl logs -f deployment/traveler-service -n airbnb

# Describe pod (for debugging)
kubectl describe pod <pod-name> -n airbnb
```

---

## 🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Find process using port
netstat -ano | findstr :5001  # Windows
lsof -i :5001                 # macOS/Linux

# Stop conflicting services
```

**Build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Kubernetes Issues

**Pods not starting:**
```bash
# Check pod events
kubectl describe pod <pod-name> -n airbnb

# Check logs
kubectl logs <pod-name> -n airbnb
```

**Image pull errors:**
```bash
# For local clusters, ensure images are loaded
minikube image ls
kind load docker-image <image-name>
```

**MongoDB connection issues:**
```bash
# Check MongoDB pod
kubectl get pods -l app=mongodb -n airbnb

# Check MongoDB logs
kubectl logs -l app=mongodb -n airbnb

# Test connection from a pod
kubectl exec -it <service-pod> -n airbnb -- sh
# Inside pod: ping mongodb-service
```

---

## 📚 Next Steps

1. **Set up Ingress** for external access
2. **Configure auto-scaling** (HPA)
3. **Set up monitoring** (Prometheus, Grafana)
4. **Configure logging** (ELK stack, CloudWatch)
5. **Set up CI/CD** pipeline
6. **Configure backups** for MongoDB

---

## 📝 Notes

- **Docker Compose** is best for local development
- **Kubernetes** is for production and testing orchestration
- Always update secrets before deploying to production
- Use persistent volumes for uploads and database data
- Health checks are configured for all services
- Services use ClusterIP for internal communication
- Frontend uses LoadBalancer for external access

