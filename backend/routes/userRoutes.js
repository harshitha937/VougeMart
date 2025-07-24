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
router.get('/verifyemail', verifyEmail);

router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

router.route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);


module.exports = router;
