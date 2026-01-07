# 500 Error Diagnosis

## 🔍 Error Found in Server Console

When you check your **server console** (where `npm start` is running), you'll see:

```
❌ EMAIL SENDING FAILED ❌
Error message: Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials.
Error code: EAUTH
Error responseCode: 535
```

## ⚠️ Root Cause

**Problem:** `EMAIL_PASS` in `.env` file is set to a **regular Gmail password**, not an **App Password**.

**Current value:** `EMAIL_PASS=Rutik@8857` ❌

**Required:** Gmail App Password (16 characters) ✅

## ✅ Solution

### Step 1: Get Gmail App Password

1. Go to: **https://myaccount.google.com/**
2. Click **Security** → **2-Step Verification** (enable if not enabled)
3. Click **App Passwords** → **Generate**
4. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** Garage App
5. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Edit `server/.env` and replace:

```env
EMAIL_PASS=Rutik@8857
```

With:

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

### Step 4: Test Email

```bash
node testEmail.js
```

You should see: `✅ SUCCESS! Email sent successfully!`

## 📋 What You'll See in Server Console

**Before fix:**
```
❌ EMAIL SENDING FAILED ❌
Error message: Email authentication failed...
Error code: EAUTH
```

**After fix:**
```
✓ Password reset email sent successfully to: user@example.com
```

## ✅ Verification

After fixing `EMAIL_PASS`:
1. ✅ Server console shows email sent successfully
2. ✅ No more 500 errors
3. ✅ Users receive reset emails in their inbox
4. ✅ Reset links work properly

---

## 💡 Important Notes

- **Regular password** (`Rutik@8857`) ❌ Won't work
- **App Password** (16 characters) ✅ Works!

- You **MUST** enable 2-Step Verification first
- App Password is different from your regular password
- App Password is 16 characters (spaces don't matter)

