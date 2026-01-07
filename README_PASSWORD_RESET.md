# Password Reset Feature Documentation

This document describes the complete "Forgot Password" and "Reset Password" feature implementation.

## Overview

The password reset feature allows users to:
1. Request a password reset link via email
2. Reset their password using a secure token sent to their email

## Database Schema

### Required Columns in `users` Table

```sql
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Optional: Add index for faster token lookups
CREATE INDEX idx_reset_token ON users(reset_token);
```

**Migration File**: `server/database/migrations/add_reset_password_fields.sql`

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=garage

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM_NAME=Your App Name

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

### Setting up Gmail App Password

1. Go to your Google Account settings (https://myaccount.google.com/)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** (under Security section)
4. Select "Mail" as the app and "Other" as the device
5. Generate a new app password
6. Copy the 16-character password and use it as `EMAIL_PASS` in your `.env` file

**Note**: Do NOT use your regular Gmail password. You must use an App Password.

## API Endpoints

### 1. Forgot Password

**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset link sent to your registered email"
}
```

**Error Responses**:
- **400**: Invalid email format
- **404**: Email not registered
- **500**: Server error or email sending failure

### 2. Reset Password

**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password_here"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

**Error Responses**:
- **400**: Invalid or expired token, or password validation failed
- **500**: Server error

## Security Features

1. **Secure Token Generation**: Uses `crypto.randomBytes(32)` to generate cryptographically secure tokens
2. **Token Expiry**: Tokens expire after 15 minutes
3. **Single-Use Tokens**: Tokens are cleared after successful password reset
4. **Password Hashing**: Uses bcrypt with 10 salt rounds
5. **Email Validation**: Validates email format before processing
6. **Password Strength**: Minimum 6 characters required

## File Structure

```
server/
├── controllers/
│   └── authController.js          # Contains login, forgotPassword, resetPassword
├── routes/
│   └── authRoutes.js               # Route definitions
├── utils/
│   └── emailService.js            # Email sending utility
├── database/
│   └── migrations/
│       └── add_reset_password_fields.sql
└── .env                            # Environment variables (create this)

next/src/app/
├── ForgotPassword/
│   └── page.js                     # Forgot password form
└── ResetPassword/
    └── page.js                     # Reset password form
```

## Frontend Flow

1. **Forgot Password Page** (`/ForgotPassword`):
   - User enters email
   - On success (200): Shows "Password reset link sent to your registered email"
   - On error (404): Shows "This email is not registered"
   - Redirects to login after 3 seconds

2. **Reset Password Page** (`/reset-password?token=...`):
   - User receives email with reset link
   - Link contains token as query parameter
   - User enters new password and confirms it
   - On success: Shows success message and redirects to login
   - On error: Shows error message and redirects to forgot password page

## Testing

### Test Forgot Password Flow

1. Start the server: `cd server && npm start`
2. Start the frontend: `cd next && npm run dev`
3. Navigate to `http://localhost:3000/ForgotPassword`
4. Enter a registered email address
5. Check your email for the reset link
6. Click the link to go to the reset password page
7. Enter a new password and submit

### Test Error Cases

1. **Non-existent email**: Enter an unregistered email → Should show 404 error
2. **Invalid token**: Try to reset with an invalid token → Should show 400 error
3. **Expired token**: Wait 15+ minutes after receiving email → Should show 400 error

## Troubleshooting

### Email Not Sending

1. Verify `.env` file exists and has correct values
2. Check that Gmail App Password is correct (not regular password)
3. Ensure 2-Step Verification is enabled on Gmail account
4. Check server logs for email errors

### Database Errors

1. Ensure migration has been run: `ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL, ADD COLUMN reset_token_expiry DATETIME NULL;`
2. Verify database connection in `server/config/db.js`

### Token Issues

1. Check that token is being generated correctly (check server logs)
2. Verify token expiry is set correctly (15 minutes from now)
3. Ensure database columns are nullable (NULL allowed)

## Dependencies

- `nodemailer`: For sending emails
- `dotenv`: For environment variable management
- `bcryptjs`: For password hashing (already installed)
- `crypto`: Built-in Node.js module for token generation

## Notes

- Tokens are single-use and automatically cleared after successful password reset
- Expired tokens are automatically cleaned up when validation fails
- Email sending failures will clear the token to prevent database pollution
- Frontend URL is configurable via `FRONTEND_URL` environment variable

