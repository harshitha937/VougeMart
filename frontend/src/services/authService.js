import API from './axios';

export const registerUser = (data) => API.post('/auth/register', data);

  export const loginUser = async (credentials) => {
  const res = await API.post('/auth/login',credentials);
  return res.data; // contains { token, user }
};

export const getProfile = () => API.get('/auth/profile');
export const logoutUser = () => API.post('/auth/logout');
