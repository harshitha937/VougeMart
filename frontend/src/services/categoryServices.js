import axios from 'axios';

const API = 'http://localhost:5000/categories';

export const getAllCategories = () => axios.get(API);
