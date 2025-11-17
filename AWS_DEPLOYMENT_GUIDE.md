# ☁️ AWS Deployment Guide - EKS

## 📋 Overview

This guide will deploy your Airbnb prototype to AWS using Elastic Kubernetes Service (EKS).

---

## 🏗️ Architecture Overview

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
│  │  │         MongoDB on EBS Volume              │        │ │
│  │  └───────────────────────────────────────────┘        │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Application Load Balancer (ALB)                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ↓
                      Internet Users
```

---

## 📦 Prerequisites

### 1. AWS Account Setup
- [ ] AWS account created
- [ ] AWS CLI installed
- [ ] kubectl installed
- [ ] eksctl installed
- [ ] AWS credentials configured

### 2. Required Tools

```bash
# Install AWS CLI (if not already installed)
# Windows: Download from https://aws.amazon.com/cli/
# Verify
aws --version

# Install eksctl (Windows)
choco install eksctl
# or download from https://github.com/weaveworks/eksctl/releases

# Install kubectl (if not already installed)
choco install kubernetes-cli

# Verify installations
eksctl version
kubectl version --client
```

### 3. Configure AWS Credentials

```bash
# Configure AWS credentials
aws configure

# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify
aws sts get-caller-identity
```

---

## 🚀 Phase 6.1: AWS Deployment

### Step 1: Create EKS Cluster

#### Option A: Using eksctl (Recommended - Easier)

```bash
# Create cluster configuration file
cat > eks-cluster-config.yaml <<EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: airbnb-cluster
  region: us-east-1
  version: "1.28"

managedNodeGroups:
  - name: airbnb-nodes
    instanceType: t3.medium
    desiredCapacity: 3
    minSize: 2
    maxSize: 4
    volumeSize: 20
    privateNetworking: false
    labels:
      role: worker
    tags:
      nodegroup-role: worker

cloudWatch:
  clusterLogging:
    enableTypes: ["*"]
EOF

# Create the cluster (takes 15-20 minutes)
eksctl create cluster -f eks-cluster-config.yaml

# Verify cluster
kubectl get nodes
```

#### Option B: Using AWS Console (More Control)

1. Go to AWS Console → EKS
2. Click "Create cluster"
3. Configure:
   - Name: `airbnb-cluster`
   - Kubernetes version: 1.28
   - Service role: Create new or use existing
   - VPC: Use default or create new
   - Subnets: Select at least 2 availability zones
4. Create node group:
   - Name: `airbnb-nodes`
   - Instance type: t3.medium
   - Nodes: 2-4 (desired: 3)
   - Disk size: 20GB
5. Wait for cluster to be active

---

### Step 2: Configure kubectl for EKS

```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name airbnb-cluster

# Verify connection
kubectl get svc
kubectl cluster-info
```

---

### Step 3: Set Up Container Registry (ECR)

```bash
# Create ECR repositories
aws ecr create-repository --repository-name airbnb/frontend --region us-east-1
aws ecr create-repository --repository-name airbnb/traveler-service --region us-east-1
aws ecr create-repository --repository-name airbnb/owner-service --region us-east-1
aws ecr create-repository --repository-name airbnb/property-service --region us-east-1
aws ecr create-repository --repository-name airbnb/booking-service --region us-east-1
aws ecr create-repository --repository-name airbnb/agent-backend --region us-east-1

# Get ECR login command
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

---

### Step 4: Build and Push Docker Images to ECR

```bash
# Set your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=us-east-1
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Tag and push frontend
docker tag airbnb-prototype-frontend:latest ${ECR_REGISTRY}/airbnb/frontend:latest
docker push ${ECR_REGISTRY}/airbnb/frontend:latest

# Tag and push traveler service
docker tag airbnb-prototype-traveler-service:latest ${ECR_REGISTRY}/airbnb/traveler-service:latest
docker push ${ECR_REGISTRY}/airbnb/traveler-service:latest

# Tag and push owner service
docker tag airbnb-prototype-owner-service:latest ${ECR_REGISTRY}/airbnb/owner-service:latest
docker push ${ECR_REGISTRY}/airbnb/owner-service:latest

# Tag and push property service
docker tag airbnb-prototype-property-service:latest ${ECR_REGISTRY}/airbnb/property-service:latest
docker push ${ECR_REGISTRY}/airbnb/property-service:latest

# Tag and push booking service
docker tag airbnb-prototype-booking-service:latest ${ECR_REGISTRY}/airbnb/booking-service:latest
docker push ${ECR_REGISTRY}/airbnb/booking-service:latest

# Tag and push agent backend
docker tag airbnb-prototype-agent-backend:latest ${ECR_REGISTRY}/airbnb/agent-backend:latest
docker push ${ECR_REGISTRY}/airbnb/agent-backend:latest

# Verify images
aws ecr list-images --repository-name airbnb/frontend --region us-east-1
```

---

### Step 5: Update Kubernetes Manifests for AWS

#### Create AWS-specific ConfigMap

```yaml
# k8s/aws/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: airbnb
data:
  FRONTEND_URL: "http://<YOUR-ALB-DNS>"
  TRAVELER_SERVICE_URL: "http://<YOUR-ALB-DNS>/api/traveler"
  OWNER_SERVICE_URL: "http://<YOUR-ALB-DNS>/api/owner"
  PROPERTY_SERVICE_URL: "http://<YOUR-ALB-DNS>/api/property"
  BOOKING_SERVICE_URL: "http://<YOUR-ALB-DNS>/api/booking"
  PUBLIC_PROPERTY_SERVICE_URL: "http://<YOUR-ALB-DNS>"
  MONGODB_URI: "mongodb://mongodb.airbnb.svc.cluster.local:27017/airbnb"
  KAFKA_BROKER: "kafka.kafka.svc.cluster.local:9092"
  KAFKA_CLIENT_ID: "airbnb-app"
```

#### Update Deployments to Use ECR Images

```bash
# Script to update all deployments
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

# Update image references in deployment files
sed -i "s|airbnb-prototype-frontend:latest|${ECR_REGISTRY}/airbnb/frontend:latest|g" k8s/frontend.yaml
sed -i "s|airbnb-prototype-traveler-service:latest|${ECR_REGISTRY}/airbnb/traveler-service:latest|g" k8s/traveler-service.yaml
sed -i "s|airbnb-prototype-owner-service:latest|${ECR_REGISTRY}/airbnb/owner-service:latest|g" k8s/owner-service.yaml
sed -i "s|airbnb-prototype-property-service:latest|${ECR_REGISTRY}/airbnb/property-service:latest|g" k8s/property-service.yaml
sed -i "s|airbnb-prototype-booking-service:latest|${ECR_REGISTRY}/airbnb/booking-service:latest|g" k8s/booking-service.yaml
sed -i "s|airbnb-prototype-agent-backend:latest|${ECR_REGISTRY}/airbnb/agent-backend:latest|g" k8s/agent-backend.yaml
```

---

### Step 6: Deploy to EKS

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy secrets and configmap
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy persistent volumes
kubectl apply -f k8s/persistent-volumes.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s

# Deploy Kafka (if using)
kubectl apply -f k8s/kafka-namespace.yaml
kubectl apply -f k8s/zookeeper-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=zookeeper -n kafka --timeout=300s
kubectl apply -f k8s/kafka-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=kafka -n kafka --timeout=300s

# Deploy microservices
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/booking-service.yaml
kubectl apply -f k8s/agent-backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Verify deployments
kubectl get pods -n airbnb
kubectl get svc -n airbnb
```

---

### Step 7: Set Up Application Load Balancer (ALB)

#### Install AWS Load Balancer Controller

```bash
# Download IAM policy
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.0/docs/install/iam_policy.json

# Create IAM policy
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam-policy.json

# Create service account
eksctl create iamserviceaccount \
  --cluster=airbnb-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve

# Install ALB controller using Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=airbnb-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verify
kubectl get deployment -n kube-system aws-load-balancer-controller
```

#### Create Ingress for ALB

```yaml
# k8s/aws/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: airbnb-ingress
  namespace: airbnb
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
      - path: /api/traveler
        pathType: Prefix
        backend:
          service:
            name: traveler-service
            port:
              number: 5001
      - path: /api/owner
        pathType: Prefix
        backend:
          service:
            name: owner-service
            port:
              number: 5002
      - path: /api/property
        pathType: Prefix
        backend:
          service:
            name: property-service
            port:
              number: 5003
      - path: /api/booking
        pathType: Prefix
        backend:
          service:
            name: booking-service
            port:
              number: 5004
```

```bash
# Apply ingress
kubectl apply -f k8s/aws/ingress.yaml

# Get ALB DNS name
kubectl get ingress -n airbnb
```

---

### Step 8: Configure Auto-Scaling

#### Horizontal Pod Autoscaler (HPA)

```yaml
# k8s/aws/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: airbnb
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: booking-service-hpa
  namespace: airbnb
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: booking-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

```bash
# Apply HPA
kubectl apply -f k8s/aws/hpa.yaml

# Verify
kubectl get hpa -n airbnb
```

---

### Step 9: Set Up Monitoring (Optional but Recommended)

```bash
# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verify
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods -n airbnb
```

---

## 🧪 Testing AWS Deployment

### Test 1: Verify All Pods are Running

```bash
kubectl get pods -n airbnb
kubectl get pods -n kafka
```

### Test 2: Access Application via ALB

```bash
# Get ALB DNS
ALB_DNS=$(kubectl get ingress airbnb-ingress -n airbnb -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://${ALB_DNS}"

# Test frontend
curl http://${ALB_DNS}

# Test backend services
curl http://${ALB_DNS}/api/property/health
curl http://${ALB_DNS}/api/booking/health
```

### Test 3: Full Workflow Test

1. Open ALB DNS in browser
2. Register as traveler and owner
3. Create property
4. Make booking
5. Verify Kafka events (if implemented)
6. Check MongoDB data

---

## 📊 Cost Optimization

### Estimated Monthly Costs (us-east-1):
- **EKS Control Plane:** ~$73/month
- **EC2 Instances (3 × t3.medium):** ~$100/month
- **EBS Volumes:** ~$10/month
- **ALB:** ~$23/month
- **Data Transfer:** ~$10/month

**Total:** ~$216/month

### Cost Saving Tips:
1. Use spot instances for non-critical workloads
2. Enable cluster autoscaler
3. Delete cluster when not in use
4. Use smaller instance types for testing

---

## 🔧 Maintenance Commands

```bash
# View logs
kubectl logs -n airbnb deployment/frontend
kubectl logs -n airbnb deployment/booking-service

# Scale manually
kubectl scale deployment frontend --replicas=5 -n airbnb

# Restart deployment
kubectl rollout restart deployment/frontend -n airbnb

# Update image
kubectl set image deployment/frontend frontend=<NEW_IMAGE> -n airbnb

# Check cluster events
kubectl get events -n airbnb --sort-by='.lastTimestamp'
```

---

## 🧹 Cleanup (Delete Everything)

```bash
# Delete all resources
kubectl delete namespace airbnb
kubectl delete namespace kafka

# Delete cluster (be careful!)
eksctl delete cluster --name airbnb-cluster --region us-east-1

# Delete ECR repositories
aws ecr delete-repository --repository-name airbnb/frontend --force --region us-east-1
aws ecr delete-repository --repository-name airbnb/traveler-service --force --region us-east-1
# ... delete other repositories
```

---

## ✅ Success Criteria

- [ ] EKS cluster created and running
- [ ] All images pushed to ECR
- [ ] All pods running in EKS
- [ ] ALB configured and accessible
- [ ] Application accessible via public URL
- [ ] MongoDB data persists
- [ ] Kafka working (if implemented)
- [ ] Auto-scaling configured
- [ ] Monitoring enabled

---

## 📝 Next Steps

After AWS deployment:
1. ✅ Take screenshots for report
2. ✅ Document ALB URL
3. ✅ Test all workflows
4. 🎯 Proceed to JMeter performance testing (Phase 6.2)

---

## 🔍 Troubleshooting

### Pods Stuck in Pending
- Check node capacity: `kubectl describe nodes`
- Check PV/PVC status: `kubectl get pv,pvc -n airbnb`

### ALB Not Created
- Verify ALB controller is running
- Check ingress annotations
- View controller logs: `kubectl logs -n kube-system deployment/aws-load-balancer-controller`

### Image Pull Errors
- Verify ECR credentials
- Check image tags match
- Ensure IAM roles allow ECR access

---

Ready to deploy to AWS? Let me know when you want to proceed!
