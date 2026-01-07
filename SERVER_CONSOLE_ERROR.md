# Server Console Error - What You'll See

## 🔍 When 500 Error Occurs

When you make a POST request to `/api/auth/forgot-password` and get a 500 error, **check your server console** (the terminal where `npm start` is running).

You will see this output:

```
❌ EMAIL SENDING FAILED ❌
Error message: Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials. Make sure you are using a Gmail App Password (16 characters), not your regular password.
Error code: EAUTH
Error responseCode: 535
Original error: Invalid login: 535-5.7.8 Username and Password not accepted...
Original error code: EAUTH
Original responseCode: 535
Full error object: {...}
========================================
```

## ⚠️ Root Cause

**Error Code:** `EAUTH`  
**Response Code:** `535`  
**Meaning:** Gmail authentication failed

**Problem:** Your `EMAIL_PASS` in `.env` is set to a **regular password** instead of a **Gmail App Password**.

**Current:** `EMAIL_PASS=Rutik@8857` ❌ (regular password)  
**Required:** `EMAIL_PASS=abcdefghijklmnop` ✅ (16-character App Password)

## ✅ Solution

### Step 1: Get Gmail App Password

1. Go to: **https://myaccount.google.com/**
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not enabled)
4. Scroll down → Click **App passwords**
5. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** Garage App
6. Click **Generate**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Edit `server/.env`:

**Change this:**
```env
EMAIL_PASS=Rutik@8857
```

**To this:**
```env
EMAIL_PASS=your-16-character-app-password-here
```

**Example:**
```env
EMAIL_USER=taderutik3@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM_NAME=Rutik
FRONTEND_URL=http://localhost:3000
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
npm start
```

### Step 4: Verify Fix

After restart, test again. You should see in server console:

```
✓ Password reset email sent successfully to: user@example.com
```

**No more errors!** ✅

## 📋 Error Codes Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `EAUTH` | Authentication failed | Use Gmail App Password (not regular password) |
| `535` | Invalid credentials | Check EMAIL_USER and EMAIL_PASS are correct |
| `ECONNREFUSED` | Connection refused | Check internet/Gmail SMTP access |
| `not configured` | Email not set up | Set EMAIL_USER and EMAIL_PASS in .env |

## 🔧 Quick Test

Run this to test email configuration:
```bash
node checkServerError.js
```

This will show you the exact error and solution.

---

## ✅ After Fix

- ✅ Server console shows: `✓ Password reset email sent successfully`
- ✅ No more 500 errors
- ✅ Users receive reset emails in their inbox
- ✅ Reset links work properly

