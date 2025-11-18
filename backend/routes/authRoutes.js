const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  forceResetPassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Admin/manual password reset
router.post('/force-reset-password', forceResetPassword);

module.exports = router;
