# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Airbnb Prototype application.

## 📋 Prerequisites

- Kubernetes cluster (minikube, kind, or AWS EKS)
- `kubectl` configured to access your cluster
- Docker images built and available (or use local images)

## 🚀 Quick Start

### 1. Build Docker Images (if not already built)

Images are built by `docker-compose build`. If you haven't built them yet:

```bash
# From project root - builds all images
docker-compose build
```

This creates images with names:
- `airbnb-prototype-traveler-service:latest`
- `airbnb-prototype-owner-service:latest`
- `airbnb-prototype-property-service:latest`
- `airbnb-prototype-booking-service:latest`
- `airbnb-prototype-frontend:latest`
- `airbnb-prototype-agent-backend:latest`

### 2. Load Images to Kubernetes (for local clusters)

If using minikube or kind, load the images:

```bash
# For minikube
minikube image load airbnb-prototype-traveler-service:latest
minikube image load airbnb-prototype-owner-service:latest
minikube image load airbnb-prototype-property-service:latest
minikube image load airbnb-prototype-booking-service:latest
minikube image load airbnb-prototype-frontend:latest
minikube image load airbnb-prototype-agent-backend:latest

# For kind
kind load docker-image airbnb-prototype-traveler-service:latest
kind load docker-image airbnb-prototype-owner-service:latest
kind load docker-image airbnb-prototype-property-service:latest
kind load docker-image airbnb-prototype-booking-service:latest
kind load docker-image airbnb-prototype-frontend:latest
kind load docker-image airbnb-prototype-agent-backend:latest
```

### 3. Update Secrets

**IMPORTANT:** Update `k8s/secrets.yaml` with your actual secrets:

```yaml
stringData:
  JWT_SECRET: "your-actual-jwt-secret-key"
  OPENAI_API_KEY: "your-actual-openai-api-key"
```

Or create secrets manually:

```bash
kubectl create secret generic airbnb-secrets \
  --from-literal=JWT_SECRET=your-secret-key \
  --from-literal=OPENAI_API_KEY=your-api-key \
  --namespace=airbnb
```

### 4. Deploy to Kubernetes

Deploy in order:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# 3. Create Secrets
kubectl apply -f k8s/secrets.yaml

# 4. Create PersistentVolumes
kubectl apply -f k8s/persistent-volumes.yaml

# 5. Deploy MongoDB
kubectl apply -f k8s/mongodb-statefulset.yaml

# 6. Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s

# 7. Deploy backend services
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/booking-service.yaml

# 8. Deploy agent backend
kubectl apply -f k8s/agent-backend.yaml

# 9. Deploy frontend
kubectl apply -f k8s/frontend.yaml
```

### 5. Check Status

```bash
# Check all pods
kubectl get pods -n airbnb

# Check services
kubectl get services -n airbnb

# Check logs
kubectl logs -f deployment/traveler-service -n airbnb
```

## 📁 File Structure

```
k8s/
├── namespace.yaml              # Namespace definition
├── configmap.yaml              # Environment variables
├── secrets.yaml                 # Sensitive data (JWT_SECRET, API keys)
├── persistent-volumes.yaml      # PVCs for uploads
├── mongodb-statefulset.yaml    # MongoDB database
├── traveler-service.yaml        # Traveler service
├── owner-service.yaml           # Owner service
├── property-service.yaml        # Property service
├── booking-service.yaml         # Booking service
├── agent-backend.yaml           # AI agent backend
├── frontend.yaml                # React frontend
└── README.md                    # This file
```

## 🔧 Configuration

### Update Service URLs

If deploying to AWS EKS or external cluster, update `k8s/configmap.yaml`:

```yaml
FRONTEND_URL: "https://yourdomain.com"
```

### Update Frontend Build Args (if rebuilding)

The frontend is already built with `docker-compose build`. If you need to rebuild with different service URLs:

```bash
cd frontend
docker build \
  --build-arg REACT_APP_TRAVELER_SERVICE_URL=http://traveler-service:5001/api \
  --build-arg REACT_APP_OWNER_SERVICE_URL=http://owner-service:5002/api \
  --build-arg REACT_APP_PROPERTY_SERVICE_URL=http://property-service:5003/api \
  --build-arg REACT_APP_BOOKING_SERVICE_URL=http://booking-service:5004/api \
  --build-arg REACT_APP_AGENT_URL=http://agent-backend:5005 \
  -t airbnb-prototype-frontend:latest .
```

## 🌐 Accessing Services

### Local (minikube/kind)

```bash
# Get frontend URL
minikube service frontend -n airbnb

# Port forward to access services
kubectl port-forward service/traveler-service 5001:5001 -n airbnb
kubectl port-forward service/frontend 3000:80 -n airbnb
```

### AWS EKS

Use LoadBalancer service or Ingress controller to expose services.

## 🔍 Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n airbnb
kubectl describe pod <pod-name> -n airbnb
```

### Check Logs

```bash
kubectl logs <pod-name> -n airbnb
kubectl logs -f deployment/<service-name> -n airbnb
```

### Check Services

```bash
kubectl get services -n airbnb
kubectl describe service <service-name> -n airbnb
```

### Restart Deployment

```bash
kubectl rollout restart deployment/<service-name> -n airbnb
```

## 🧹 Cleanup

To remove all resources:

```bash
kubectl delete namespace airbnb
```

Or delete individual resources:

```bash
kubectl delete -f k8s/
```

## 📚 Next Steps

- Set up Ingress for external access
- Configure auto-scaling (HPA)
- Set up monitoring and logging
- Configure backup for MongoDB
- Set up CI/CD pipeline


