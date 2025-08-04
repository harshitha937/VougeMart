// src/services/orderServices.js
import API from './axios';

export const getMyOrders = () => API.get('/order/my-orders');
export const createOrder = (data) => API.post('/order', data);
export const getOrderById = (id) => API.get(`/order/${id}`);

export const markOrderAsPaid = (id, paymentResult) =>
  API.put(`/order/${id}/pay`, paymentResult);