const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel.js');
async function authenticate(req, res, next) {
  let token = req.cookies.jwt ;
  const secreyKey =process.env.JWT_SECRET ||  'hshfu288290';
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token." });
  }

  try {
    const decoded = jwt.verify(token,secreyKey );
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "User not found." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed." });
  }
}


async function authorizeAdmin(req, res, next) {
  if (req.user && req.user.isAdmin ) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
}


module.exports = {
  authenticate,
  authorizeAdmin,
};
