// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  let token ;

  // ✅ Check for token in cookies first (for backend-only requests)
  token = req.cookies.jwt;

  // ✅ If no cookie, check Authorization header (for frontend requests)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hshfu288290');
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { authenticate, authorizeAdmin };