import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  getProfile: (token) => 
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data),
};

export const providerService = {
  search: (params = {}) => 
    api.get('/providers/search', { params }).then(res => res.data),
  
  getDetails: (id) => 
    api.get(`/providers/${id}`).then(res => res.data),
  
  getSlots: (serviceId, startDate, endDate) => 
    api.get(`/providers/${serviceId}/slots`, { 
      params: { start: startDate, end: endDate } 
    }).then(res => res.data),
};

export const bookingService = {
  create: (bookingData) => 
    api.post('/bookings', bookingData).then(res => res.data),
  
  getMyBookings: () => 
    api.get('/bookings/my').then(res => res.data),
  
  cancel: (bookingId) => 
    api.patch(`/bookings/${bookingId}/cancel`).then(res => res.data),
};

export default api;