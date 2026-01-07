# Get Gmail App Password - Step by Step

## ⚠️ Current Issue
Your `.env` file has `EMAIL_PASS=Rutik@8857` which is a **regular password**, not an **App Password**.

Gmail requires a special **16-character App Password** for third-party apps.

---

## 🚀 Get App Password (5 Minutes)

### Step 1: Go to Google Account
Open browser → Go to: **https://myaccount.google.com/**

### Step 2: Enable 2-Step Verification
1. Click **Security** (left sidebar)
2. Find **2-Step Verification**
3. Click **Get Started** (if not enabled)
4. Follow steps to verify your phone number
5. Complete the setup

### Step 3: Generate App Password
1. Go back to **Security** page
2. Scroll down to **App passwords**
3. Click **App passwords**
4. You may need to sign in again
5. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** Garage App
6. Click **Generate**

### Step 4: Copy the Password
You'll see a **16-character password** like:
```
abcd efgh ijkl mnop
```
or
```
abcdefghijklmnop
```

**Copy this password** (spaces don't matter, you can remove them)

### Step 5: Update .env File

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
EMAIL_FROM_NAME=Garage Management System
FRONTEND_URL=http://localhost:3000
```

### Step 6: Test Email

```bash
node testEmail.js
```

This will send a test email to `taderutik3@gmail.com`. Check your inbox!

### Step 7: Restart Server

```bash
npm start
```

---

## ✅ After Setup

When users request password reset:
1. ✅ Email sent to **their email address** (the one they entered)
2. ✅ Email appears in **their inbox**
3. ✅ Email syncs to **mobile device** (if logged into same Gmail)
4. ✅ They click reset link
5. ✅ Password reset works!

---

## 🔍 Verify It Works

1. **Test email sending:**
   ```bash
   node testEmail.js
   ```

2. **Check your email inbox** (taderutik3@gmail.com)

3. **Test forgot password:**
   - Use forgot password form
   - Enter any user's email
   - Check that user's email inbox
   - They should receive the reset email!

---

## ❌ Common Mistakes

- ❌ Using regular Gmail password (won't work)
- ✅ Must use App Password (16 characters)

- ❌ App Password with wrong email
- ✅ App Password must match EMAIL_USER

- ❌ Not enabling 2-Step Verification first
- ✅ Must enable 2-Step Verification before App Passwords

---

## 💡 Quick Reminder

**Regular Password:** `Rutik@8857` ❌ (won't work)
**App Password:** `abcdefghijklmnop` ✅ (16 characters, works!)

