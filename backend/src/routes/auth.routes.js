const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, apiLimiter } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', apiLimiter, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;