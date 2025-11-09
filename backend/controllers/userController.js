// ✅ Updated controller with proper token response

const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/createToken.js');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || 'hshfu288290';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function isEmailDomainValid(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1];
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      resolve(!err && addresses && addresses.length > 0);
    });
  });
}

async function sendVerificationEmail(user) {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  const verificationLink = `${FRONTEND_URL}/auth/verifyEmail?token=${token}`;
  const html = `
    <p>Hi ${user.username},</p>
    <p>Please verify your email by clicking below:</p>
    <a href="${verificationLink}">${verificationLink}</a>
  `;
  await sendEmail(user.email, 'Verify your email', html);
}

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all inputs.' });
  }
  const validEmailDomain = await isEmailDomainValid(email);
  if (!validEmailDomain) {
    return res.status(400).json({ message: 'Email domain does not exist.' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin:false,
  });
  await newUser.save();
  await sendVerificationEmail(newUser);
  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    message: 'Registration successful. Verification email sent.',
  });
}

async function verifyEmail(req, res) {
  const token = req.query.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send('User not found');
    user.isVerified = true;
    await user.save();
    res.redirect('http://localhost:3001/');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
}

// ✅ Updated loginUser to return token in response
async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) return res.status(401).json({ message: 'Invalid credentials.' });
  
  // Generate token and set cookie
  const token = generateToken(res, user._id);
  
  await sendEmail(user.email, 'Login Successful', `<p>Hello ${user.username}, you logged in.</p>`);
  
  // ✅ Return token in response for frontend localStorage
  res.status(200).json({
     token,
  user: {
    _id: user._id,
    userId: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  },// ✅ Added token to response
    message: 'Login successful'
  });
}

async function logoutCurrentUser(req, res) {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
}

async function getAllUsers(req, res) {
  const users = await User.find().select('-password');
  res.json(users);
}

async function getCurrentUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    user: {
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,},
  });
}

async function updateCurrentUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
}

async function deleteUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isAdmin) return res.status(400).json({ message: 'Cannot delete admin user.' });
  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User removed' });
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

async function updateUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin ?? user.isAdmin;
  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user found.' });
  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:5173/auth/reset-password/${resetToken}`;
  await sendEmail(user.email, 'Password Reset', `<a href="${resetLink}">${resetLink}</a>`);
  res.status(200).json({ message: 'Reset link sent.' });
}

async function resetPassword(req, res) {
  const { token } = req.query;
  const { newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid request.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  forgotPassword,
  resetPassword,
};