const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const upload=require('../middlewares/uploadMiddleware')
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');





// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'), async (req, res) => {
  console.log(req.file); 
  createProduct(req, res);
  }
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  (req, res, next) => {
    if (req.file) req.body.image = `/uploads/${req.file.filename}`;
    next();
  },
  updateProduct
);

router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
