# Deployment Guide

## Prerequisites

- AWS CLI configured with appropriate permissions
- kubectl installed and configured
- Helm 3.x installed
- Docker installed
- Terraform >= 1.0
- Node.js >= 18

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/healthcare-platform/healthcare-platform.git
cd healthcare-platform
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your local configuration
```

### 3. Start Local Services

```bash
# Start infrastructure services
make dev-up

# Run database migrations
make db-migrate

# Seed with demo data
make seed

# Start all services
npm run dev
```

### 4. Verify Local Setup

```bash
# Check API health
curl http://localhost:3000/health

# Test authentication
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@healthcare.com","password":"Patient123!"}'
```

## AWS Infrastructure Deployment

### 1. Create S3 Backend

```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://healthcare-platform-terraform-state --region us-west-2

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name healthcare-platform-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-west-2
```

### 2. Deploy Infrastructure

```bash
cd infra/terraform/envs/dev

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### 3. Configure kubectl

```bash
# Update kubeconfig
aws eks update-kubeconfig --name healthcare-platform-dev --region us-west-2

# Verify connection
kubectl get nodes
```

## Application Deployment

### 1. Build and Push Images

```bash
# Build all service images
docker build -t ghcr.io/healthcare-platform/api-gateway:latest -f services/api-gateway/Dockerfile .
docker build -t ghcr.io/healthcare-platform/auth-svc:latest -f services/auth-svc/Dockerfile .
docker build -t ghcr.io/healthcare-platform/booking-svc:latest -f services/booking-svc/Dockerfile .

# Push to registry
docker push ghcr.io/healthcare-platform/api-gateway:latest
docker push ghcr.io/healthcare-platform/auth-svc:latest
docker push ghcr.io/healthcare-platform/booking-svc:latest
```

### 2. Create Kubernetes Secrets

```bash
# Database credentials
kubectl create secret generic healthcare-db-secret \
  --from-literal=DATABASE_URL="postgresql://user:pass@hostname:5432/dbname" \
  --namespace healthcare-dev

# Redis credentials
kubectl create secret generic healthcare-redis-secret \
  --from-literal=REDIS_URL="redis://hostname:6379" \
  --namespace healthcare-dev

# JWT secret
kubectl create secret generic healthcare-jwt-secret \
  --from-literal=JWT_SECRET="your-super-secret-jwt-key" \
  --namespace healthcare-dev
```

### 3. Deploy with Helm

```bash
# Create namespace
kubectl create namespace healthcare-dev

# Deploy application
helm upgrade --install healthcare-platform ./infra/helm/healthcare-platform \
  --namespace healthcare-dev \
  --set image.tag=latest \
  --set environment=development \
  --set replicaCount=2
```

### 4. Verify Deployment

```bash
# Check pod status
kubectl get pods -n healthcare-dev

# Check services
kubectl get services -n healthcare-dev

# Check ingress
kubectl get ingress -n healthcare-dev

# Test API endpoint
kubectl port-forward service/api-gateway 8080:3000 -n healthcare-dev
curl http://localhost:8080/health
```

## Database Setup

### 1. Run Migrations

```bash
# Connect to a pod and run migrations
kubectl exec -it deployment/api-gateway -n healthcare-dev -- npm run db:migrate

# Seed database
kubectl exec -it deployment/api-gateway -n healthcare-dev -- npm run db:seed
```

### 2. Verify Database

```bash
# Check database connection
kubectl exec -it deployment/api-gateway -n healthcare-dev -- npm run db:check

# View tables
kubectl exec -it deployment/api-gateway -n healthcare-dev -- npx prisma studio
```

## Monitoring Setup

### 1. Deploy Prometheus and Grafana

```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Deploy Prometheus
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Deploy Grafana
helm upgrade --install grafana grafana/grafana \
  --namespace monitoring \
  --set adminPassword=admin123
```

### 2. Configure Dashboards

```bash
# Port forward to Grafana
kubectl port-forward service/grafana 3000:80 -n monitoring

# Access Grafana at http://localhost:3000
# Username: admin, Password: admin123
```

## SSL/TLS Setup

### 1. Request ACM Certificate

```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.healthcare-platform.com \
  --domain-name "*.healthcare-platform.com" \
  --validation-method DNS \
  --region us-west-2
```

### 2. Update Ingress

```bash
# Update Helm values with certificate ARN
helm upgrade healthcare-platform ./infra/helm/healthcare-platform \
  --namespace healthcare-dev \
  --set ingress.annotations."alb\.ingress\.kubernetes\.io/certificate-arn"="arn:aws:acm:us-west-2:123456789012:certificate/example"
```

## Scaling Configuration

### 1. Horizontal Pod Autoscaler

```bash
# Enable metrics server if not already installed
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# HPA is configured in Helm chart
# Verify HPA status
kubectl get hpa -n healthcare-dev
```

### 2. Cluster Autoscaler

```bash
# Deploy cluster autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# Configure for your cluster
kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict":"false"}}}}}'
```

## Backup and Recovery

### 1. Database Backups

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier healthcare-dev \
  --db-snapshot-identifier healthcare-dev-$(date +%Y%m%d-%H%M%S)

# List snapshots
aws rds describe-db-snapshots --db-instance-identifier healthcare-dev
```

### 2. Application State Backup

```bash
# Backup Kubernetes resources
kubectl get all -n healthcare-dev -o yaml > backup-$(date +%Y%m%d).yaml

# Backup secrets
kubectl get secrets -n healthcare-dev -o yaml > secrets-backup-$(date +%Y%m%d).yaml
```

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n healthcare-dev
   kubectl logs <pod-name> -n healthcare-dev
   ```

2. **Database connection issues**
   ```bash
   kubectl exec -it deployment/api-gateway -n healthcare-dev -- nslookup <db-hostname>
   kubectl exec -it deployment/api-gateway -n healthcare-dev -- telnet <db-hostname> 5432
   ```

3. **Image pull errors**
   ```bash
   kubectl describe pod <pod-name> -n healthcare-dev
   # Check image registry credentials
   ```

### Rollback Procedures

```bash
# Rollback Helm deployment
helm rollback healthcare-platform -n healthcare-dev

# Rollback to specific revision
helm rollback healthcare-platform 2 -n healthcare-dev

# Check rollback status
helm history healthcare-platform -n healthcare-dev
```

## Production Considerations

1. **Security**
   - Enable Pod Security Standards
   - Configure Network Policies
   - Use AWS Secrets Manager for sensitive data
   - Enable audit logging

2. **Performance**
   - Configure resource limits and requests
   - Use multiple availability zones
   - Enable caching layers
   - Optimize database queries

3. **Monitoring**
   - Set up alerting rules
   - Configure log aggregation
   - Monitor business metrics
   - Set up uptime monitoring

4. **Compliance**
   - Enable encryption at rest and in transit
   - Configure audit logging
   - Implement data retention policies
   - Regular security assessments