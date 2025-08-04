// src/services/productServices.js
import API from './axios';

export const getAllProducts = () => API.get('/product');
export const getProductById = (id) => API.get(`/product/${id}`);
