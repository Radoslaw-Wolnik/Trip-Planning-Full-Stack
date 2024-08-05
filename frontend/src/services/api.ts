// frontend/src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { User, FullUser, Trip, Credentials, UserData, TripData, updateTripData, ExtTrip } from '../types';

const API_URL = "http://localhost:5000/api";

// Create a more flexible Axios instance with generics
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type assertion for methods
const typedApi = api as {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
} & AxiosInstance;

// Set up an interceptor for requests
typedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Custom ApiError class
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/*
If you know the exact structure of your API's error responses, you could create a more specific type for error.response.data
This would provide even better type safety, but it requires that you know and define the structure of your API's error responses.

interface APIErrorResponse {
  message: string;
  // Add any other properties your API might return in error responses
}

// Then in the error handler:
const errorData = error.response.data as APIErrorResponse;
throw new ApiError(error.response.status, errorData.message || 'An error occurred');
*/


// Error handling middleware
typedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorMessage = typeof error.response.data === 'object' && error.response.data !== null
        ? (error.response.data as any).message || 'An error occurred'
        : 'An error occurred';
      throw new ApiError(error.response.status, errorMessage);
    } else if (error.request) {
      throw new ApiError(0, 'No response received from server');
    } else {
      throw new ApiError(0, error.message);
    }
  }
);

// API functions with proper typing
export const login = (credentials: Credentials): Promise<AxiosResponse<{ token: string; user: User }>> => 
  typedApi.post('/users/login', credentials);

export const logout = (): Promise<AxiosResponse<void>> => 
  typedApi.post('/users/logout');

export const register = (userData: UserData): Promise<AxiosResponse<User>> => 
  typedApi.post('/users/register', userData);

export const createTrip = (tripData: TripData): Promise<AxiosResponse<Trip>> => 
  typedApi.post('/trips', tripData);

export const getTrips = (): Promise<AxiosResponse<Trip[]>> => 
  typedApi.get('/trips');

// old one
//export const updateTrip = (id: string, updateTripData: updateTripData): Promise<AxiosResponse<Trip>> => 
//  typedApi.put(`/trips/${id}`, updateTripData);



export const getTripDetails = (id: string): Promise<AxiosResponse<ExtTrip>> => 
  typedApi.get(`/trips/${id}`);

export const deleteTrip = (id: string): Promise<AxiosResponse<void>> => 
  typedApi.delete(`/trips/${id}`);

export const getMe = (): Promise<AxiosResponse<FullUser>> => 
  typedApi.get('/users/me');

export const getOtherUserProfile = (userId: string): Promise<AxiosResponse<User>> => 
  typedApi.get(`/users/${userId}`);

export const getUserTrips = (userId: string): Promise<AxiosResponse<Trip[]>> => 
  typedApi.get(`/users/${userId}/trips`);


// generate invitation code, join edit share read only and fetch read only

export const inviteTrip = (TripId: string): Promise<AxiosResponse<{ invitationCode: string }>> => 
  typedApi.post(`/trips/${TripId}/invite`);

export const joinTrip = (invitationCode: string): Promise<AxiosResponse<Trip>> => 
  typedApi.post('/trips/join', { invitationCode });

export const generateShareLink = (tripId: string): Promise<AxiosResponse<{ shareCode: string }>> => 
  typedApi.post(`/trips/${tripId}/share`);

export const getSharedTrip = (shareCode: string): Promise<AxiosResponse<Trip>> => 
  typedApi.get(`/trips/shared/${shareCode}`);


// Istnieje opcja że tu FullUser
export const updateUserProfile = (formData: FormData): Promise<AxiosResponse<User>> =>
  typedApi.put<User>('/users/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const changePassword = (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<void>> => 
  typedApi.put('/users/change-password', data);

export const sendVerificationEmail = (): Promise<AxiosResponse<void>> => 
  typedApi.post('/users/send-verification');

export const verifyEmail = (token: string): Promise<AxiosResponse<void>> => 
  typedApi.get(`/users/verify-email/${token}`);



// socket io related

export const joinTripEdit = (tripId: string): Promise<AxiosResponse<{ activeEditors: number }>> => 
  typedApi.post(`/trips/${tripId}/join`);

export const leaveTripEdit = (tripId: string): Promise<AxiosResponse<{ activeEditors: number }>> => 
  typedApi.post(`/trips/${tripId}/leave`);

// Note: This function already exists in your api.ts, but let's ensure it's updated to match the new requirements
export const updateTrip = (id: string, updateTripData: updateTripData): Promise<AxiosResponse<Trip>> => 
  typedApi.put(`/trips/${id}`, updateTripData);



export default typedApi;