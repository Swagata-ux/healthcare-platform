# ADR-0001: Core Architecture Decisions

**Status**: Accepted  
**Date**: 2024-01-15  
**Deciders**: Engineering Team

## Context

Building a production-ready AI-driven healthcare booking platform with HR management capabilities requiring high security, scalability, and compliance readiness.

## Decisions

### 1. Microservices Architecture with NestJS
- **Decision**: Modular monorepo with NestJS services
- **Rationale**: TypeScript consistency, built-in DI, GraphQL/REST support, enterprise patterns
- **Alternatives**: Express.js (less structure), Spring Boot (different language)

### 2. React Native for Mobile
- **Decision**: Single codebase for iOS/Android with TypeScript
- **Rationale**: Code reuse, faster development, strong ecosystem
- **Alternatives**: Native apps (higher cost), Flutter (different language)

### 3. PostgreSQL + Redis
- **Decision**: PostgreSQL primary, Redis for caching/sessions
- **Rationale**: ACID compliance for healthcare data, Redis performance for real-time features
- **Alternatives**: MongoDB (less ACID), DynamoDB (vendor lock-in)

### 4. AWS with Kubernetes
- **Decision**: EKS for container orchestration
- **Rationale**: Scalability, managed service, industry standard
- **Alternatives**: ECS Fargate (less control), Lambda (cold starts)

### 5. GraphQL + REST Hybrid
- **Decision**: GraphQL for mobile reads, REST for service-to-service
- **Rationale**: Mobile efficiency with GraphQL, REST simplicity for internal APIs
- **Alternatives**: Pure REST (over-fetching), Pure GraphQL (complexity)

### 6. OAuth2/OIDC + JWT
- **Decision**: Standard OAuth2 flow with short-lived JWTs
- **Rationale**: Industry standard, stateless, secure
- **Alternatives**: Session-based (scalability issues), custom auth (security risks)

### 7. Terraform for IaC
- **Decision**: Terraform with remote state
- **Rationale**: Multi-cloud support, mature ecosystem, state management
- **Alternatives**: CloudFormation (AWS-only), CDK (more complex)

## Consequences

### Positive
- Type safety across stack
- Scalable microservices architecture
- Industry-standard security
- Cloud-native deployment
- Strong testing capabilities

### Negative
- Initial complexity overhead
- Multiple technology learning curve
- Distributed system challenges
- Higher initial infrastructure costs

## Compliance Considerations

- HIPAA-ready with encryption at rest/transit
- GDPR compliance with data retention policies
- Audit logging for all PHI access
- Role-based access control (RBAC)