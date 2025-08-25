import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100
    { duration: '5m', target: 100 }, // Stay at 100
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<900'], // 95% of requests under 900ms
    http_req_failed: ['rate<0.1'], // Error rate under 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export function setup() {
  // Create test user
  const registerPayload = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'PATIENT',
  };

  const registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify(registerPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'registration successful': (r) => r.status === 201,
  });

  return { accessToken: registerRes.json('accessToken') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.accessToken}`,
  };

  // Search providers
  const searchPayload = {
    specialty: 'cardiology',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      radius: 10,
    },
  };

  const searchRes = http.post(
    `${BASE_URL}/graphql`,
    JSON.stringify({
      query: `
        mutation SearchProviders($input: String!) {
          searchProviders(input: $input)
        }
      `,
      variables: {
        input: JSON.stringify(searchPayload),
      },
    }),
    { headers }
  );

  const searchSuccess = check(searchRes, {
    'search providers successful': (r) => r.status === 200,
    'search response time < 600ms': (r) => r.timings.duration < 600,
  });

  if (!searchSuccess) {
    errorRate.add(1);
  }

  sleep(1);

  // Get available slots
  const slotsRes = http.post(
    `${BASE_URL}/graphql`,
    JSON.stringify({
      query: `
        query AvailableSlots($serviceId: String!, $dateRange: String!) {
          availableSlots(serviceId: $serviceId, dateRange: $dateRange)
        }
      `,
      variables: {
        serviceId: 'test-service-id',
        dateRange: JSON.stringify({
          start: new Date().toISOString(),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      },
    }),
    { headers }
  );

  const slotsSuccess = check(slotsRes, {
    'get slots successful': (r) => r.status === 200,
    'slots response time < 400ms': (r) => r.timings.duration < 400,
  });

  if (!slotsSuccess) {
    errorRate.add(1);
  }

  sleep(1);

  // Create booking
  const bookingPayload = {
    patientId: 'test-patient-id',
    clinicId: 'test-clinic-id',
    serviceId: 'test-service-id',
    slotId: 'test-slot-id',
    notes: 'Load test booking',
  };

  const bookingRes = http.post(`${BASE_URL}/bookings`, JSON.stringify(bookingPayload), { headers });

  const bookingSuccess = check(bookingRes, {
    'booking creation successful': (r) => r.status === 201,
    'booking response time < 900ms': (r) => r.timings.duration < 900,
  });

  if (!bookingSuccess) {
    errorRate.add(1);
  }

  sleep(2);
}