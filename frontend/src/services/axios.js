import axios from 'axios';

const API = axios.create({
  baseURL: 'https://vougemart-1.onrender.com',
  withCredentials: true,
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // your auth token
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
export default API;
