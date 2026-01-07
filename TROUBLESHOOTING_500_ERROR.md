# Troubleshooting 500 Internal Server Error

## Common Causes and Fixes

### 1. Missing Database Columns (MOST COMMON)

**Error**: `ER_BAD_FIELD_ERROR` or `Unknown column 'reset_token'`

**Fix**: Run the migration SQL to add the required columns:

```sql
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;
```

**Location**: `server/database/migrations/add_reset_password_fields.sql`

---

### 2. Missing Email Environment Variables

**Error**: `Email transporter not configured` or `Email configuration missing`

**Fix**: Create a `.env` file in the `server/` directory with:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM_NAME=Your App Name
FRONTEND_URL=http://localhost:3000
```

**Note**: For Gmail, you need to:
1. Enable 2-Step Verification
2. Generate an App Password (not your regular password)
3. Use the 16-character App Password as `EMAIL_PASS`

---

### 3. Database Connection Issues

**Error**: `ECONNREFUSED` or database connection errors

**Fix**: 
1. Verify database is running
2. Check `server/config/db.js` has correct credentials
3. Ensure database name matches your schema

---

### 4. Check Server Logs

The server console will show detailed error messages. Look for:

```
Forgot Password Error: [error details]
Error stack: [stack trace]
```

This will tell you exactly what went wrong.

---

## How to Debug

1. **Check server console output** - The error will be logged there
2. **Verify database columns exist**:
   ```sql
   DESCRIBE users;
   ```
   Look for `reset_token` and `reset_token_expiry` columns

3. **Verify environment variables**:
   ```bash
   # In server directory
   node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');"
   ```

4. **Test database connection**:
   ```sql
   SELECT id, email FROM users LIMIT 1;
   ```

---

## Quick Fix Checklist

- [ ] Database columns `reset_token` and `reset_token_expiry` exist
- [ ] `.env` file exists in `server/` directory
- [ ] `EMAIL_USER` and `EMAIL_PASS` are set in `.env`
- [ ] Database connection is working
- [ ] Server has been restarted after changes

---

## Testing After Fix

1. Restart your server: `npm start` or `node index.js`
2. Test the endpoint: `POST http://localhost:3001/api/auth/forgot-password`
3. Check server logs for any errors
4. If still getting 500, check the server console for the specific error message

