const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// ✅ Create a category (Admin only)
router.post('/', authenticate, authorizeAdmin, createCategory);

// ✅ Get all categories (Public)
router.get('/', getCategories);

// ✅ Get category by ID (Public)
router.get('/:id', getCategoryById);

// ✅ Update a category (Admin only)
router.put('/:id', authenticate, authorizeAdmin, updateCategory);

// ✅ Delete a category (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, deleteCategory);

module.exports = router;
