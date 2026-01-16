const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const tryCatch = require('../utils/tryCatch');

// Import email service with error handling
let sendPasswordResetEmail;
try {
    const emailService = require('../utils/emailService');
    sendPasswordResetEmail = emailService.sendPasswordResetEmail;
} catch (emailServiceError) {
    console.error('Failed to load email service:', emailServiceError);
    // Create a fallback function
    sendPasswordResetEmail = async (email, token) => {
        throw new Error('Email service not available');
    };
}

const login = tryCatch(async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    // 2. Query the Database
    // Select the user based on the email provided
    const user = await userModel.findUserByEmail(email);

    // Check if user exists
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
        });
    }

    // 3. Verify Password using Bcrypt
    // Compares the provided plain text password with the hashed password from DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
        });
    }

    // 4. Successful Login
    // Remove sensitive data before sending back the user object
    const { password: _, remember_token, ...userData } = user;

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: userData
    });
});

/**
 * Forgot Password Controller
 * POST /api/auth/forgot-password
 * Request body: { email: "user@example.com" }
 */
const forgotPassword = tryCatch(async (req, res) => {
    const { email } = req.body;

    // 1. Validate email format
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required.'
        });
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format.'
        });
    }

    // 2. Check if email exists in database
    const user = await userModel.findUserForPasswordReset(email);

    // 3. If email DOES NOT exist: Return 404
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'This email is not registered'
        });
    }

    // 4. If email EXISTS: Generate reset token
    
    // Generate secure random token using crypto
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiry to 15 minutes from now
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 15);

    // Save token and expiry in MySQL
    await userModel.updateUserResetToken(user.id, resetToken, resetTokenExpiry);
    
    try {
        // Send password reset email to user's email address
        await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
        // Check for authentication-specific errors
        if (error.code === 'EAUTH' || error.message.includes('Email authentication failed')) {
            console.error('ERROR: Gmail authentication failed. Check EMAIL_USER and EMAIL_PASS in .env file.');
            return res.status(500).json({
                success: false,
                message: 'Email authentication failed. Please check your server logs and ensure you are using a valid Gmail App Password in your .env file.',
                error: 'Gmail EAUTH'
            });
        }
        // For other errors, let the centralized error handler manage it
        throw error;
    }

    // Return success response
    return res.status(200).json({
        success: true,
        message: 'Password reset link sent to your registered email'
    });
});

/**
 * Reset Password Controller
 * POST /api/auth/reset-password
 * Request body: { token: "RESET_TOKEN", newPassword: "new_password_here" }
 */
const resetPassword = tryCatch(async (req, res) => {
    const { token, newPassword } = req.body;
    
    // 1. Validate token and new password
    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Token and new password are required.'
        });
    }

    // Validate password strength (minimum 6 characters)
    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long.'
        });
    }

    // 2. Check if token exists and is not expired
    const user = await userModel.findUserByResetToken(token);

    // 3. If token is invalid or expired
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }

    // Check if token has expired
    const now = new Date();
    const tokenExpiry = new Date(user.reset_token_expiry);

    if (now > tokenExpiry) {
        // Clear expired token
        await userModel.clearUserResetToken(user.id);
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }

    // 4. If token is valid: Hash new password and update
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear reset token fields
    await userModel.updateUserPassword(user.id, hashedPassword);

    // Return success message
    return res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
    });
});

module.exports = { login, forgotPassword, resetPassword };