import axios from 'axios';
import { SERVER_URL } from '../utils/config';

// Register a new user (POST to /auth/)
const registerUser = (data) => {
  return axios.post(SERVER_URL + 'auth/', data);
};

// Log in an existing user
const loginUser = (data) => {
  return axios.post(SERVER_URL + 'auth/login', data);
};

const AuthServices = {
  registerUser,
  loginUser
};

export default AuthServices;
