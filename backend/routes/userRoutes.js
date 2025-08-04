const express = require('express');
const {
  registerUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/userController.js');

const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware.js');
const router = express.Router();

router.route("/")
  .post(registerUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutCurrentUser);

router.route('/profile')
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.post('/forgotpassword', forgotPassword);
router.post('/reset-password/:token', resetPassword); // ✅ KEEP THIS ABOVE `/:id`

// ✅ Keep this at the end to avoid route collision
router.route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

module.exports = router;
