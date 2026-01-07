# Email Configuration Guide

## Current Status
Email is **NOT configured** - using placeholder values in `.env` file.

## To Enable Email Sending

### Step 1: Edit `.env` file
Open `server/.env` and replace the placeholder values:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM_NAME=Garage Management System
FRONTEND_URL=http://localhost:3000
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Scroll down and click **App passwords**
5. Select **Mail** as the app
6. Select **Other (Custom name)** as device
7. Enter a name like "Garage App"
8. Click **Generate**
9. Copy the **16-character password** (spaces don't matter)
10. Paste it as `EMAIL_PASS` in your `.env` file

### Step 3: Restart Server
After updating `.env`, restart your server:
```bash
# Stop server (Ctrl+C)
npm start
```

## Testing Email

After configuration, test the forgot password endpoint. You should see:
```
✓ Email transporter configured successfully
✓ Password reset email sent successfully to: user@example.com
```

## If Email Still Doesn't Work

Check server console for errors:
- **EAUTH error**: Wrong email or app password
- **ECONNREFUSED**: Gmail SMTP blocked (try different email provider)
- **535 error**: Authentication failed

## Alternative: Use Console Logging (Current Mode)

Since email is not configured, the reset link is logged to **server console**:

```
============================================================
⚠️  EMAIL NOT CONFIGURED - RESET LINK FOR TESTING:
============================================================
📧 User Email: user@example.com
🔗 Reset Link: http://localhost:3000/reset-password/?token=abc123...
🔑 Token: abc123...
============================================================
```

**Copy the reset link from server console** and use it to reset password.

