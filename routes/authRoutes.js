const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the login route
// Matches: POST /api/auth/login
router.post('/login', authController.login);

// Forgot Password route
// Matches: POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password route
// Matches: POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
