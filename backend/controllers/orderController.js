// controllers/orderController.js

const Order = require('../models/orderModel');

// @desc    Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });
    console.log({
  user: req.user._id,
  orderItems,
  shippingAddress,
  paymentMethod,
  totalPrice,
});

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

// @desc    Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'title price image');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetching orders failed', error: err.message });
  }
};

// @desc    Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'title price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow access if it's the owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};

// @desc    Mark order as paid
exports.markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Payment update failed', error: err.message });
  }
};

// @desc    Mark order as delivered (Admin only)
exports.markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Delivery update failed', error: err.message });
  }
};

// @desc    Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetching all orders failed', error: err.message });
  }
};
