const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { forgotPasswordController, verifyOtpController, resetPasswordController } = require('../controllers/forgotPassword.controller');
const { protect, apiLimiter } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', apiLimiter, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/profile', protect, authController.updateProfile);

// Forgot password flow (no auth required)
router.post('/forgot-password', forgotPasswordController);
router.post('/verify-otp', verifyOtpController);
router.post('/reset-password', resetPasswordController);

module.exports = router;