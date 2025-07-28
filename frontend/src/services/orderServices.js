// services/authServices.js
import axios from 'axios';
import { SERVER_URL } from '../utils/config';

// ✅ Create axios instance with better configuration
const authAPI = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ✅ Add request interceptor for debugging
authAPI.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor for better error handling
authAPI.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check if server is running');
    } else if (!error.response) {
      console.error('No response from server');
    }
    
    return Promise.reject(error);
  }
);

// ✅ Register a new user
const registerUser = async (data) => {
  try {
    const response = await authAPI.post('/auth', data); // Fixed endpoint
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// ✅ Log in an existing user
const loginUser = async (data) => {
  try {
    const response = await authAPI.post('/auth/login', data);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ Log out the current user
const logoutUser = async () => {
  try {
    const response = await authAPI.post('/auth/logout');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ✅ Get current user profile
const getCurrentUserProfile = async () => {
  try {
    const response = await authAPI.get('/auth/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// ✅ Update current user profile
const updateCurrentUserProfile = async (data) => {
  try {
    const response = await authAPI.put('/auth/profile', data);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// ✅ Export all auth methods
const AuthServices = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};

export default AuthServices;