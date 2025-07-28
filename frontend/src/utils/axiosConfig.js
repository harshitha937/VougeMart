// utils/axiosConfig.js or add this to your main App.jsx
import axios from 'axios';

// ✅ Configure axios defaults
axios.defaults.withCredentials = true;

// ✅ Add request interceptor to include token in headers
axios.interceptors.request.use(
  (config) => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;