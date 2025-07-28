// src/services/productServices.js

import axios from 'axios';
import { SERVER_URL } from '../utils/config';
import {getUserDetails} from '../utils/GetUser.js';
// ✅ Get paginated + filtered products (with optional keyword)
const fetchProducts = (keyword = '') => {
  return axios.get(`${SERVER_URL}product/products?keyword=${keyword}`);
};

// ✅ Get a single product by ID
const getProductById = (id) => {
  return axios.get(`${SERVER_URL}product/${id}`);
};

// ✅ Get top-rated products
const getTopProducts = () => {
  return axios.get(`${SERVER_URL}product/top`);
};

// ✅ Get new products
const getNewProducts = () => {
  return axios.get(`${SERVER_URL}product/new`);
};

// ✅ Filter by category (via query param)
const filterProducts = (category) => {
  return axios.post(`${SERVER_URL}product/filter?category=${category}`);
};


// ✅ Add review to a product
const addProductReview = (productId, reviewData) => {
  const user = getUserDetails();
  const token = user?.token;

  return axios.post(
    `${SERVER_URL}product/${productId}/review`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};


const ProductServices = {
  fetchProducts,
  getProductById,
  getTopProducts,
  getNewProducts,
  filterProducts,
  addProductReview, // ✅ new method
};

export default ProductServices;

