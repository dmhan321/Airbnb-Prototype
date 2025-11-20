# ☁️ AWS Deployment Notes - Complete Guide

This document consolidates all AWS deployment information, including what was deployed, how to monitor Kafka, and testing procedures.

---

## 📋 Table of Contents

1. [What We Deployed](#what-we-deployed)
2. [Architecture Overview](#architecture-overview)
3. [Deployment Steps](#deployment-steps)
4. [Monitoring Kafka Flow](#monitoring-kafka-flow)
5. [Testing Checklist](#testing-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Cleanup & Cost Management](#cleanup--cost-management)

---

## 🏗️ What We Deployed

### AWS Services Used

| Component | AWS Service | Details |
|-----------|------------|---------|
| **Kubernetes Cluster** | Amazon EKS | Cluster: `airbnb-cluster` in `us-west-2` |
| **Container Registry** | Amazon ECR | Repository: `airbnb-lab2-repo` |
| **Kafka** | Self-managed on EKS | Kafka + Zookeeper in `kafka` namespace |
| **Database** | MongoDB Atlas | Managed MongoDB cluster |
| **Load Balancer** | AWS ELB | Public LoadBalancer for frontend |
| **Storage** | EBS Volumes | Persistent volumes for uploads, Kafka, Zookeeper |
| **Secrets** | Kubernetes Secrets | JWT secrets, MongoDB URI stored in K8s secrets |

### Deployed Services

- **Frontend** (React + Nginx) - 2 replicas
- **Traveler Service** - 2 replicas
- **Owner Service** - 2 replicas
- **Property Service** - 2 replicas
- **Booking Service** - 2 replicas
- **Kafka** - 1 broker
- **Zookeeper** - 1 instance

### Current Configuration

- **Region**: `us-west-2`
- **Cluster Name**: `airbnb-cluster`
- **ECR Repository**: `982534379272.dkr.ecr.us-west-2.amazonaws.com/airbnb-lab2-repo`
- **Public URL**: `http://af859bf4c90fe45a8a617d2337fe265b-73469934.us-west-2.elb.amazonaws.com`
- **MongoDB Atlas**: `mongodb+srv://airbnb-user:...@airbnbcluster.z8mkgai.mongodb.net/airbnb_db`

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    EKS Cluster                          │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │ Frontend │  │ Traveler │  │  Owner   │             │ │
│  │  │  Pods    │  │  Pods    │  │  Pods    │             │ │
│  │  └──────────┘  └──────────┘  └──────────┘             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │ Property │  │ Booking  │  │  Kafka   │             │ │
│  │  │  Pods    │  │  Pods    │  │  Pods    │             │ │
│  │  └──────────┘  └──────────┘  └──────────┘             │ │
│  │                                                         │ │
│  │  ┌───────────────────────────────────────────┐        │ │
│  │  │         EBS Volumes (Uploads)              │        │ │
│  │  └───────────────────────────────────────────┘        │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Elastic Load Balancer (ELB)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ↓                                 │
│                    Internet Users                            │
│                            │                                 │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MongoDB Atlas (External)                   │ │
│  └────────────────────────────────────────────────────────┘ │
```

### Kafka Event Flow

1. **Traveler creates booking** → Traveler Service publishes to `booking-requests` topic
2. **Booking Service consumes** → Creates booking in MongoDB → Publishes `BOOKING_CREATED` to `booking-status-updates`
3. **Owner/Traveler Services consume** → Update UI with booking status changes
4. **Owner accepts/rejects/cancels** → Owner Service publishes status update → Traveler Service consumes

---

## 🚀 Deployment Steps

### Prerequisites

- AWS account with admin permissions
- AWS CLI configured: `aws configure`
- `kubectl` installed
- `eksctl` installed
- Docker installed

### Step 1: Create EKS Cluster

```bash
# Create cluster (takes 15-20 minutes)
eksctl create cluster \
  --name airbnb-cluster \
  --region us-west-2 \
  --version 1.30 \
  --nodegroup-name airbnb-ng \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4

# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name airbnb-cluster

# Verify
kubectl get nodes
```

### Step 2: Create ECR Repository

```bash
# Create single repository for all images
aws ecr create-repository \
  --repository-name airbnb-lab2-repo \
  --region us-west-2

# Get login token
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  982534379272.dkr.ecr.us-west-2.amazonaws.com
```

### Step 3: Build and Push Docker Images

```bash
# Set variables
AWS_ACCOUNT_ID=982534379272
REGION=us-west-2
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/airbnb-lab2-repo"

# Build and push each service (use --platform linux/amd64 for EKS)
docker build --platform linux/amd64 -f backend/Dockerfile.traveler-service \
  -t ${ECR_REGISTRY}:traveler-service backend/
docker push ${ECR_REGISTRY}:traveler-service

docker build --platform linux/amd64 -f backend/Dockerfile.owner-service \
  -t ${ECR_REGISTRY}:owner-service backend/
docker push ${ECR_REGISTRY}:owner-service

docker build --platform linux/amd64 -f backend/Dockerfile.property-service \
  -t ${ECR_REGISTRY}:property-service backend/
docker push ${ECR_REGISTRY}:property-service

docker build --platform linux/amd64 -f backend/Dockerfile.booking-service \
  -t ${ECR_REGISTRY}:booking-service backend/
docker push ${ECR_REGISTRY}:booking-service

docker build --platform linux/amd64 -t ${ECR_REGISTRY}:frontend frontend/
docker push ${ECR_REGISTRY}:frontend
```

### Step 4: Set Up MongoDB Atlas

1. Create MongoDB Atlas account
2. Create a free M10 cluster
3. Create database user: `airbnb-user`
4. Whitelist IP addresses (or allow from anywhere for testing)
5. Get connection string: `mongodb+srv://airbnb-user:password@cluster.mongodb.net/airbnb_db`

### Step 5: Update Kubernetes Manifests

Update `k8s/configmap.yaml` with:
- MongoDB Atlas URI
- Public LoadBalancer URL (after deployment)
- Service URLs

Update `k8s/secrets.yaml` with:
- JWT_SECRET
- MONGODB_URI

Update all service YAMLs to use ECR images:
```yaml
image: 982534379272.dkr.ecr.us-west-2.amazonaws.com/airbnb-lab2-repo:<service-name>
imagePullPolicy: Always
```

### Step 6: Deploy to EKS

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy secrets and config
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy persistent volumes
kubectl apply -f k8s/persistent-volumes.yaml

# Deploy Kafka (if not using MSK)
kubectl apply -f k8s/kafka-namespace.yaml
kubectl apply -f k8s/zookeeper-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=zookeeper -n kafka --timeout=300s
kubectl apply -f k8s/kafka-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=kafka -n kafka --timeout=300s

# Create Kafka topics
kubectl apply -f k8s/kafka-topics-job.yaml

# Deploy services
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/booking-service.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Verify all pods are running
kubectl get pods -n airbnb
kubectl get pods -n kafka

# Get LoadBalancer URL
kubectl get svc -n airbnb frontend
```

### Step 7: Update ConfigMap with LoadBalancer URL

After frontend service gets a LoadBalancer URL, update `k8s/configmap.yaml`:
- `FRONTEND_URL`: LoadBalancer URL
- `PUBLIC_PROPERTY_SERVICE_URL`: LoadBalancer URL
- `PUBLIC_TRAVELER_SERVICE_URL`: LoadBalancer URL
- `PUBLIC_OWNER_SERVICE_URL`: LoadBalancer URL

Then reapply:
```bash
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/frontend -n airbnb
kubectl rollout restart deployment/traveler-service -n airbnb
kubectl rollout restart deployment/owner-service -n airbnb
kubectl rollout restart deployment/property-service -n airbnb
```

---

## 🔍 Monitoring Kafka Flow

### Quick Start - Watch All Kafka Activity

Open **3 separate terminal windows** and run:

#### Terminal 1: Watch Traveler Service (Producer + Consumer)
```bash
kubectl logs -n airbnb --all-containers=true -l app=traveler-service -f | \
  grep -E "(Kafka|booking|Published|Consumed|status|Message sent)"
```

#### Terminal 2: Watch Booking Service (Consumer + Producer)
```bash
kubectl logs -n airbnb --all-containers=true -l app=booking-service -f | \
  grep -E "(Kafka|booking|Processing|created|published|Message sent)"
```

#### Terminal 3: Watch Owner Service (Consumer + Producer)
```bash
kubectl logs -n airbnb --all-containers=true -l app=owner-service -f | \
  grep -E "(Kafka|booking|status|notification|Message sent|Received)"
```

**Important**: Use `--all-containers=true -l app=<service>` to see logs from ALL pods (not just one).

### What to Look For

#### When Traveler Creates Booking:

**Traveler Service logs:**
```
✓ Published booking request to Kafka
✓ Message sent to topic: booking-requests
```

**Booking Service logs:**
```
✓ Received booking request from Kafka
Processing booking request: { travelerId: ..., propertyId: ..., ... }
✓ Booking created: <booking_id>
✓ Message sent to topic: booking-status-updates
```

**Traveler & Owner Service logs:**
```
✓ Received status update: BOOKING_CREATED
📧 Notify owner/traveler about booking <id> - BOOKING_CREATED
```

#### When Owner Accepts/Rejects/Cancels Booking:

**Owner Service logs:**
```
✓ Booking accepted/rejected/cancelled event published to Kafka
✓ Message sent to topic: booking-status-updates
```

**Traveler Service logs:**
```
✓ Received status update: BOOKING_ACCEPTED/REJECTED/CANCELLED
```

### Check Kafka Topics Directly

```bash
# List all topics
kubectl exec -n kafka kafka-0 -- kafka-topics \
  --bootstrap-server localhost:9092 --list

# Watch booking-requests topic (real-time)
kubectl exec -n kafka kafka-0 -- kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic booking-requests \
  --from-beginning

# Watch booking-status-updates topic (real-time)
kubectl exec -n kafka kafka-0 -- kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic booking-status-updates \
  --from-beginning
```

### Service-Specific Log Commands

**To see CANCEL as OWNER (producer):**
```bash
kubectl logs -n airbnb --all-containers=true -l app=owner-service -f | \
  grep -i "cancel\|Message sent"
```

**To see CANCEL as TRAVELER (producer):**
```bash
kubectl logs -n airbnb --all-containers=true -l app=booking-service -f | \
  grep -i "cancel\|Message sent"
```

**To see CANCEL message consumed:**
```bash
# Traveler receives update
kubectl logs -n airbnb --all-containers=true -l app=traveler-service -f | \
  grep -i "status update\|BOOKING_CANCELLED"

# Owner receives update (if canceled by traveler)
kubectl logs -n airbnb --all-containers=true -l app=owner-service -f | \
  grep -i "status update\|BOOKING_CANCELLED"
```

---

## ✅ Testing Checklist

### Already Tested
- [x] Sign up (Traveler)
- [x] Sign up (Owner)
- [x] Log in (Traveler)
- [x] Log in (Owner)
- [x] Add favorite property
- [x] Create booking
- [x] Create new property
- [x] Kafka message published (booking creation)
- [x] Update profile
- [x] Upload profile picture (Traveler)
- [x] Cancel booking (as owner) - Kafka verified

### Remaining Tests

#### Owner Features
- [ ] **Accept booking**
  - Accept a pending booking
  - Verify Kafka message: `kubectl logs -n airbnb --all-containers=true -l app=owner-service -f | grep "ACCEPTED"`
  - Verify traveler sees updated status

- [ ] **Reject booking**
  - Reject a pending booking
  - Verify Kafka message published

- [ ] **View owner bookings**
  - Verify all bookings display
  - Verify filtering by status works

- [ ] **Update property**
  - Edit existing property
  - Verify changes saved

- [ ] **Delete property**
  - Delete a property
  - Verify removed from listings

- [ ] **Upload property photos (separate from creation)**
  - Edit property, upload additional photos
  - Verify photos display

- [ ] **Update owner profile picture**
  - Upload profile picture as owner
  - Verify displays correctly

#### Traveler Features
- [ ] **Cancel booking (as traveler)**
  - Cancel a booking
  - Verify Kafka message: `kubectl logs -n airbnb --all-containers=true -l app=booking-service -f | grep "CANCELLED"`

- [ ] **View traveler bookings/trips**
  - Go to Trips page
  - Verify all bookings displayed
  - Verify filtering works

- [ ] **Search/filter properties**
  - Use search bar with location
  - Filter by dates, guests, price
  - Verify results filtered correctly

- [ ] **View property details**
  - Click property card
  - Verify images, amenities, description display
  - Verify booking widget works

- [ ] **Remove favorite**
  - Remove property from favorites
  - Verify removed from list

- [ ] **View favorites page**
  - Go to Favorites page
  - Verify all favorited properties displayed

#### Kafka Flow (End-to-End)
- [ ] **Complete booking flow**
  1. Traveler creates booking → Watch logs for "Published booking request"
  2. Booking Service consumes → Watch logs for "Received booking request"
  3. Owner sees booking in Bookings page
  4. Owner accepts → Watch logs for "Booking accepted event published"
  5. Traveler Service consumes → Watch logs for "Received status update: BOOKING_ACCEPTED"
  6. Traveler sees "Accepted" status in Trips page

#### Image Display
- [x] Property images display on cards
- [x] Profile pictures display

#### Authentication & Authorization
- [ ] **Logout**
  - Logout as traveler/owner
  - Verify token cleared
  - Verify redirect to login

- [ ] **Unauthorized access**
  - Try accessing owner pages as traveler (should be blocked)
  - Try accessing protected pages without login (should redirect)

---

## 🔧 Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n airbnb

# Check pod events
kubectl describe pod <pod-name> -n airbnb

# Check logs
kubectl logs <pod-name> -n airbnb
```

### Image Pull Errors

```bash
# Verify ECR credentials
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  982534379272.dkr.ecr.us-west-2.amazonaws.com

# Check if images exist
aws ecr list-images --repository-name airbnb-lab2-repo --region us-west-2
```

### Kafka Connection Issues

```bash
# Check Kafka pods
kubectl get pods -n kafka

# Check Kafka logs
kubectl logs -n kafka kafka-0

# Test connection from a pod
kubectl exec -n airbnb deployment/traveler-service -- \
  nc -zv kafka.kafka.svc.cluster.local 9092
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
kubectl exec -n airbnb deployment/traveler-service -- \
  node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Services Not Accessible

```bash
# Check services
kubectl get svc -n airbnb

# Check LoadBalancer status
kubectl describe svc frontend -n airbnb

# Test from inside cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- \
  wget -qO- http://frontend.airbnb.svc.cluster.local
```

### View Logs from All Pods

**Important**: Always use `--all-containers=true` to see logs from all replicas:

```bash
# All owner-service pods
kubectl logs -n airbnb --all-containers=true -l app=owner-service

# All traveler-service pods
kubectl logs -n airbnb --all-containers=true -l app=traveler-service

# All booking-service pods
kubectl logs -n airbnb --all-containers=true -l app=booking-service
```

---

## 🧹 Cleanup & Cost Management

### Delete Cluster (When Not in Use)

```bash
# Delete EKS cluster (this deletes everything)
eksctl delete cluster --name airbnb-cluster --region us-west-2

# Or delete manually
kubectl delete namespace airbnb
kubectl delete namespace kafka
```

### Estimated Monthly Costs (us-west-2)

- **EKS Control Plane**: ~$73/month
- **EC2 Instances (3 × t3.medium)**: ~$100/month
- **EBS Volumes**: ~$10/month
- **ELB**: ~$23/month
- **Data Transfer**: ~$10/month
- **MongoDB Atlas (Free tier)**: $0

**Total**: ~$216/month

### Cost Saving Tips

1. **Delete cluster when not in use** - Only pay for EKS control plane when cluster exists
2. **Use smaller instances** - t3.small instead of t3.medium for testing
3. **Reduce replicas** - Set replicas to 1 for non-critical services
4. **Use spot instances** - For non-production workloads
5. **Schedule cluster** - Use tools to start/stop cluster on schedule

### Quick Cluster Management

```bash
# Scale down all deployments (save costs)
kubectl scale deployment --all --replicas=0 -n airbnb

# Scale back up
kubectl scale deployment --all --replicas=2 -n airbnb

# Delete and recreate cluster for demos
eksctl delete cluster --name airbnb-cluster --region us-west-2
# Then recreate using Step 1 above
```

---

## 📝 Important Notes

1. **Always use `--all-containers=true`** when checking logs to see all pod replicas
2. **LoadBalancer URL** - Update ConfigMap after frontend gets LoadBalancer URL
3. **Image architecture** - Always build with `--platform linux/amd64` for EKS
4. **MongoDB Atlas** - Whitelist EKS node IPs or allow from anywhere for testing
5. **Kafka topics** - Created automatically, but can be verified with `kafka-topics --list`
6. **Persistent volumes** - Use `storageClassName: gp2` for EBS volumes

---

## 🎯 Quick Reference Commands

```bash
# Check all pods
kubectl get pods -n airbnb
kubectl get pods -n kafka

# Check services
kubectl get svc -n airbnb

# Watch all Kafka activity
kubectl logs -n airbnb --all-containers=true -l app=traveler-service -f | grep -i kafka
kubectl logs -n airbnb --all-containers=true -l app=booking-service -f | grep -i kafka
kubectl logs -n airbnb --all-containers=true -l app=owner-service -f | grep -i kafka

# Restart a service
kubectl rollout restart deployment/<service-name> -n airbnb

# Get LoadBalancer URL
kubectl get svc frontend -n airbnb -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Check cluster status
kubectl cluster-info
kubectl get nodes
```

---

**Last Updated**: November 2025
**Cluster**: airbnb-cluster (us-west-2)
**Public URL**: http://af859bf4c90fe45a8a617d2337fe265b-73469934.us-west-2.elb.amazonaws.com

