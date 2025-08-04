// src/services/adminServices.js
import  API from './axios';
// =======================
// 🔧 Admin Product Actions
// =======================
 const getAllProducts = () => API.get('/product');
 const deleteProductById = (id) => API.delete(`/product/${id}`);
 const updateProductById = (id, formData) =>
  API.put(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
 const createProduct = (formData) =>
  API.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
// =======================
// 📦 Admin Category Actions
// =======================
export const getAllCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategoryById = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategoryById = (id) => API.delete(`/categories/${id}`);

// =======================
// 📬 Admin Order Actions
// =======================
export const getAllOrders = () => API.get('/order/admin');
export const markOrderAsDelivered = (id) => API.put(`/order/${id}/deliver`);

// =======================
// 👤 Admin User Actions
// =======================
export const getAllUsers = () => API.get('/auth');
export const deleteUserById = (id) => API.delete(`/auth/${id}`);
export const updateUserById = (id, data) => API.put(`/auth/${id}`, data);


const adminServices ={
   getAllProducts,
  deleteProductById,
  updateProductById,
  createProduct,

   // Categories
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,

  // Orders
  getAllOrders,
  markOrderAsDelivered,

 getAllUsers ,
 deleteUserById ,
  updateUserById,
};

export default adminServices;
