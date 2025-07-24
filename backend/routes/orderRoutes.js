const express = require('express');
const router = express.Router();

const {
     createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} = require('../controllers/orderController.js');

const {authenticate,authorizeAdmin} = require('../middlewares/authMiddleware.js');

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total_orders").get(countTotalOrders);
router.route("/total_sales").get(calculateTotalSales);
router.route("/total_sales_by_date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

  module.exports =router;
