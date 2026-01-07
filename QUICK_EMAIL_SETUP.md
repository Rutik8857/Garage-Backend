# Quick Email Setup Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if not enabled)
3. Click **App passwords** → **Generate**
4. Select **Mail** → **Other** → Name it "Garage App"
5. **Copy the 16-character password**

### Step 2: Configure Email

Run this command:
```bash
node setupEmail.js
```

Enter:
- Your Gmail address
- The 16-character App Password you copied
- Sender name (optional)
- Frontend URL (optional)

### Step 3: Test Email

```bash
node testEmail.js
```

This will send a test email to yourself. Check your inbox!

---

## ✅ After Setup

1. **Restart your server:**
   ```bash
   npm start
   ```

2. **Test forgot password:**
   - Use the forgot password form
   - Check user's email inbox
   - They'll receive a beautiful email with reset link

---

## 📧 Email Preview

Users will receive an email with:
- ✅ Professional HTML design
- ✅ Clear "Reset Password" button
- ✅ Reset link (clickable)
- ✅ Expiry notice (15 minutes)
- ✅ Security message

---

## 🔧 Manual Configuration

If you prefer to edit `.env` manually:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM_NAME=Garage Management System
FRONTEND_URL=http://localhost:3000
```

Then restart server.

---

## ❌ Troubleshooting

**Email not sending?**
- Check App Password is correct (16 characters)
- Verify 2-Step Verification is enabled
- Check server console for error messages
- Run `node testEmail.js` to test

**Still not working?**
- Check spam folder
- Verify Gmail account is active
- Try generating a new App Password

