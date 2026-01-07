# 📱 Setup Email for Mobile Devices

## Why emails appear on your mobile:
When you configure email properly, reset links will be sent to your Gmail account. Since Gmail syncs across all devices (mobile, tablet, desktop), you'll receive the email on **any device** where you're logged into that Gmail account.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Gmail App Password

1. **Open browser** → Go to: https://myaccount.google.com/
2. **Click "Security"** (left sidebar)
3. **Enable "2-Step Verification"** (if not already enabled)
   - Follow the steps to verify your phone
4. **Go back to Security** → Scroll down
5. **Click "App passwords"**
6. **Select:**
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **Garage App**
7. **Click "Generate"**
8. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Configure Email

**Option A: Use Setup Script (Easiest)**
```bash
node setupEmail.js
```
Then enter:
- Your Gmail address (the one you use on mobile)
- The 16-character App Password you copied
- Press Enter for defaults on other questions

**Option B: Manual Setup**
Edit `server/.env` file and replace:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 3: Test Email

```bash
node testEmail.js
```

This sends a test email to yourself. **Check your email inbox** (on mobile or desktop) - you should see the test email!

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm start
```

---

## ✅ After Setup

When users request password reset:
1. ✅ Email is sent to their Gmail account
2. ✅ Email appears in their inbox
3. ✅ **Email syncs to mobile device automatically** (if logged into same Gmail)
4. ✅ They click the reset link on mobile
5. ✅ Password reset works!

---

## 📧 What Users Will See

**On Mobile Email App:**
- Professional email with "Reset Password" button
- Clickable reset link
- Message: "We received a request to reset your password..."
- Expiry notice: "Link expires in 15 minutes"

**On Desktop Email:**
- Same beautiful email
- Same reset link
- Works on any device logged into that Gmail

---

## 🔍 Verify It Works

1. **Test email sending:**
   ```bash
   node testEmail.js
   ```

2. **Check your email inbox** (mobile or desktop)

3. **Test forgot password:**
   - Use the forgot password form
   - Enter your email
   - Check email inbox on mobile device
   - You should see the reset email!

---

## ❌ Troubleshooting

**Email not appearing on mobile?**
- ✅ Make sure you're logged into the **same Gmail account** on mobile
- ✅ Check spam/junk folder
- ✅ Wait a few seconds (Gmail sync can take 10-30 seconds)
- ✅ Refresh your email app

**Email not sending?**
- ✅ Verify App Password is correct (16 characters, no spaces)
- ✅ Check 2-Step Verification is enabled
- ✅ Run `node testEmail.js` to see error messages
- ✅ Check server console for errors

**Still not working?**
- Check server console logs
- Verify `.env` file has correct values
- Try generating a new App Password

---

## 💡 Important Notes

- **Gmail syncs automatically** - emails sent to your Gmail will appear on ALL devices where you're logged in
- **No special mobile setup needed** - just configure email once, it works everywhere
- **Works with any email app** - Gmail app, Outlook, Apple Mail, etc. (as long as Gmail account is added)

