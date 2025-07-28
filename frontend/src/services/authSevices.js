// services/authServices.js
import axios from 'axios';
import { SERVER_URL } from '../utils/config';

// ✅ Configure axios to include credentials (cookies) in all requests
axios.defaults.withCredentials = true;

// ✅ Register a new user
const registerUser = (data) => {
  return axios.post(SERVER_URL + 'auth/', data);
};

// ✅ Log in an existing user
const loginUser = (data) => {
  return axios.post(SERVER_URL + 'auth/login', data);
};

// ✅ Log out the current user
const logoutUser = () => {
  return axios.post(SERVER_URL + 'auth/logout');
};

// ✅ Get current user profile
const getCurrentUserProfile = () => {
  return axios.get(SERVER_URL + 'auth/profile');
};

// ✅ Update current user profile
const updateCurrentUserProfile = (data) => {
  return axios.put(SERVER_URL + 'auth/profile', data);
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