# AI-Driven Healthcare Booking & HRTech Platform

Production-ready, secure, scalable healthcare booking platform with AI recommendations and HR management.

## Quick Start

```bash
# Local development
make dev:up
make db:migrate
make seed
make test:all

# AWS deployment
cd infra/terraform/envs/dev
terraform init
terraform plan
terraform apply
```

## Architecture

- **Mobile**: React Native + TypeScript
- **Backend**: NestJS microservices (GraphQL + REST)
- **Database**: PostgreSQL + Redis
- **Infrastructure**: AWS (EKS, RDS, ElastiCache)
- **Observability**: OpenTelemetry + Prometheus + Grafana

## Services

- `api-gateway`: GraphQL/REST BFF
- `auth-svc`: Authentication & authorization
- `booking-svc`: Appointment management
- `provider-svc`: Healthcare provider management
- `hr-svc`: HR & staff management
- `files-svc`: Document management
- `ai-svc`: AI recommendations & scheduling

## Security

- OAuth2/OIDC + JWT authentication
- RBAC with role-based access control
- PHI/PII encryption at rest
- OWASP ASVS compliance
- Comprehensive audit logging

## Testing

- Unit tests: >80% coverage
- Contract tests: Pact
- Integration tests: Testcontainers
- E2E tests: Detox/Playwright
- Load tests: k6
- Security tests: SAST/DAST/SCA

## Documentation

- [Architecture Decision Records](./docs/adrs/)
- [API Documentation](./docs/api/)
- [Runbooks](./docs/runbooks/)
- [Security](./docs/security/)