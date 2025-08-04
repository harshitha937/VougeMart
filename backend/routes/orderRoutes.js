// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  markAsPaid,
  markAsDelivered,
  getAllOrders,
} = require('../controllers/orderController');

const { authenticate, authorizeAdmin  } = require('../middlewares/authMiddleware');

// Create order
router.post('/', authenticate, createOrder);

// Get logged-in user's orders
router.get('/my-orders', authenticate, getMyOrders);

// Get all orders (admin)
router.get('/admin', authenticate, authorizeAdmin, getAllOrders);

// Get a specific order by ID
router.get('/:id', authenticate, getOrderById);

// Mark as paid
router.put('/:id/pay', authenticate, markAsPaid);

// Mark as delivered
router.put('/:id/deliver',authenticate, authorizeAdmin, markAsDelivered);

module.exports = router;
