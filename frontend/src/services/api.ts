// frontend/src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:5000/api";

// Create an Axios instance with default settings
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up an interceptor for requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the headers exist and are of type AxiosHeaders
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

interface Credentials {
  email: string;
  password: string;
}

interface UserData {
  username: string;
  email: string;
  password: string;
  trips?: string[]; // Array of Trip IDs
}

interface Place {
  name: string;
  date: Date;
  latitude: number;
  longitude: number;
  order: number;
}

interface TripData {
  title: string;
  description?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  places?: Place[];
  creator?: string; // User ID
  sharedWith?: string[]; // Array of User IDs
  invitationCode?: string;
}

// interface ShareData { userId: string; }

export const login = (credentials: Credentials) => api.post('/users/login', credentials);
export const register = (userData: UserData) => api.post('/users/register', userData);
export const createTrip = (tripData: TripData) => api.post('/trips', tripData);
export const getTrips = () => api.get('/trips');
export const updateTrip = (id: string, tripData: TripData) => api.put(`/trips/${id}`, tripData);

//export const shareTrip = (id: string, userData: ShareData) => api.post(`/trips/${id}/share`, userData);
export const shareTrip = (id: string, userData: { email: string }) => api.post(`/trips/${id}/share`, userData);
export const joinTrip = (invitationCode: string) => api.post('/trips/join', { invitationCode });
export const getTrip = (id: string) => api.get(`/trips/${id}`);
export const deleteTrip = (id: string) => api.delete(`/trips/${id}`);

export default api;
