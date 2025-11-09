import axios from 'axios';

const API = 'https://vougemart-1.onrender.com/categories';

export const getAllCategories = () => axios.get(API);
