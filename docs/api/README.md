# Healthcare Platform API Documentation

## Overview

The Healthcare Platform provides both GraphQL and REST APIs for different use cases:
- **GraphQL**: Optimized for mobile app queries with flexible data fetching
- **REST**: Used for service-to-service communication and webhooks

## Base URLs

- **Development**: `http://localhost:3000`
- **Staging**: `https://api-staging.healthcare-platform.com`
- **Production**: `https://api.healthcare-platform.com`

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting Access Tokens

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@healthcare.com",
    "password": "Patient123!"
  }'
```

## GraphQL API

### Endpoint
- **URL**: `/graphql`
- **Method**: POST
- **Content-Type**: `application/json`

### Example Queries

#### Search Providers
```graphql
mutation SearchProviders($input: String!) {
  searchProviders(input: $input)
}
```

Variables:
```json
{
  "input": "{\"specialty\":\"cardiology\",\"location\":{\"lat\":37.7749,\"lng\":-122.4194,\"radius\":10}}"
}
```

#### Get Available Slots
```graphql
query AvailableSlots($serviceId: String!, $dateRange: String!) {
  availableSlots(serviceId: $serviceId, dateRange: $dateRange)
}
```

#### Get AI Recommendations
```graphql
mutation GetRecommendations($input: String!) {
  getRecommendations(input: $input)
}
```

## REST API

### Authentication Endpoints

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "patient@healthcare.com",
  "password": "Patient123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "patient@healthcare.com",
    "role": "PATIENT"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "role": "PATIENT",
  "phone": "+1-555-0123"
}
```

### Booking Endpoints

#### POST /bookings
Create a new booking.

**Request:**
```json
{
  "patientId": "patient-id",
  "clinicId": "clinic-id",
  "serviceId": "service-id",
  "slotId": "slot-id",
  "notes": "Follow-up appointment"
}
```

**Response:**
```json
{
  "id": "booking-id",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

#### GET /bookings/my
Get current user's bookings.

**Response:**
```json
[
  {
    "id": "booking-id",
    "status": "CONFIRMED",
    "service": {
      "name": "Cardiology Consultation",
      "durationMin": 30
    },
    "slot": {
      "startTime": "2024-01-20T14:00:00Z",
      "endTime": "2024-01-20T14:30:00Z"
    },
    "clinic": {
      "name": "Cardiology Department",
      "address": "123 Main St, Suite 200"
    }
  }
]
```

#### PATCH /bookings/:id/cancel
Cancel a booking.

**Response:**
```json
{
  "id": "booking-id",
  "status": "CANCELLED",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### HR Endpoints

#### POST /hr/jobs
Create a job requisition (Provider/Admin only).

**Request:**
```json
{
  "clinicId": "clinic-id",
  "title": "Registered Nurse",
  "role": "nurse",
  "description": "Full-time RN position",
  "requirements": ["RN License", "2+ years experience"],
  "salary": 75000
}
```

#### POST /hr/apply
Apply for a job.

**Request:**
```json
{
  "jobReqId": "job-req-id",
  "coverLetter": "I am interested in this position...",
  "resumeFile": "base64-encoded-file-data"
}
```

#### POST /hr/shifts
Create a shift (Provider/Admin only).

**Request:**
```json
{
  "clinicId": "clinic-id",
  "role": "nurse",
  "startTime": "2024-01-20T07:00:00Z",
  "endTime": "2024-01-20T19:00:00Z",
  "neededCount": 3
}
```

### AI Endpoints

#### POST /ai/recommendations
Get AI-powered recommendations.

**Request:**
```json
{
  "symptoms": ["chest pain", "shortness of breath"],
  "intent": "I need to see a cardiologist",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  }
}
```

**Response:**
```json
[
  {
    "type": "provider",
    "entityId": "cardiology-clinic-1",
    "confidence": 0.9,
    "reasoning": "Chest pain symptoms suggest cardiology consultation"
  }
]
```

## Error Handling

All APIs return errors in RFC 7807 format:

```json
{
  "type": "https://healthcare-platform.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request body contains invalid data",
  "instance": "/bookings",
  "timestamp": "2024-01-15T10:00:00Z",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Search endpoints**: 50 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Health Check

#### GET /health
Check service health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "ai-service": "healthy"
  }
}
```

## Webhooks

The platform supports webhooks for real-time notifications:

### Booking Status Changes
```json
{
  "event": "booking.status_changed",
  "data": {
    "bookingId": "booking-id",
    "oldStatus": "PENDING",
    "newStatus": "CONFIRMED",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

### Webhook Security
All webhook payloads are signed with HMAC-SHA256. Verify the signature using the `X-Webhook-Signature` header.