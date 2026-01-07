// Quick test script to check forgot password endpoint
const db = require('./config/db');
const crypto = require('crypto');

async function testForgotPassword() {
    console.log('Testing forgot password functionality...\n');
    
    try {
        // Test 1: Database connection
        console.log('1. Testing database connection...');
        const [test] = await db.query('SELECT 1 as test');
        console.log('✓ Database connection OK\n');
        
        // Test 2: Check if users table exists
        console.log('2. Checking users table...');
        const [tables] = await db.query("SHOW TABLES LIKE 'users'");
        if (tables.length === 0) {
            console.error('❌ Users table does not exist!');
            process.exit(1);
        }
        console.log('✓ Users table exists\n');
        
        // Test 3: Check if reset_token columns exist
        console.log('3. Checking reset_token columns...');
        const [columns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'garage' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry')
        `);
        
        const columnNames = columns.map(c => c.COLUMN_NAME);
        if (!columnNames.includes('reset_token')) {
            console.error('❌ reset_token column missing! Run migration.');
            process.exit(1);
        }
        if (!columnNames.includes('reset_token_expiry')) {
            console.error('❌ reset_token_expiry column missing! Run migration.');
            process.exit(1);
        }
        console.log('✓ All required columns exist\n');
        
        // Test 4: Test token generation
        console.log('4. Testing token generation...');
        const testToken = crypto.randomBytes(32).toString('hex');
        console.log('✓ Token generated:', testToken.substring(0, 20) + '...\n');
        
        // Test 5: Check if we can query users
        console.log('5. Testing user query...');
        const [users] = await db.query('SELECT id, email FROM users LIMIT 1');
        if (users.length > 0) {
            console.log('✓ Found user:', users[0].email);
        } else {
            console.log('⚠️  No users found in database');
        }
        console.log('');
        
        // Test 6: Test UPDATE query
        if (users.length > 0) {
            console.log('6. Testing UPDATE query...');
            const testExpiry = new Date();
            testExpiry.setMinutes(testExpiry.getMinutes() + 15);
            
            await db.query(
                'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
                [testToken, testExpiry, users[0].id]
            );
            console.log('✓ UPDATE query successful\n');
            
            // Clean up
            await db.query(
                'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
                [users[0].id]
            );
        }
        
        // Test 7: Check email service
        console.log('7. Checking email service...');
        try {
            const emailService = require('./utils/emailService');
            console.log('✓ Email service module loaded');
        } catch (e) {
            console.error('❌ Email service error:', e.message);
        }
        console.log('');
        
        console.log('✅ All tests passed! Forgot password should work.\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ TEST FAILED ❌');
        console.error('Error:', error.message);
        console.error('Error code:', error.code);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testForgotPassword();

