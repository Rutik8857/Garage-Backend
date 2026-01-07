// Script to check what error the server is actually throwing
const db = require('./config/db');
const crypto = require('crypto');
require('dotenv').config();

// Import email service
const { sendPasswordResetEmail } = require('./utils/emailService');

async function checkError() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 CHECKING FORGOT PASSWORD ERROR');
    console.log('='.repeat(60) + '\n');
    
    try {
        // Step 1: Check database connection
        console.log('1. Testing database connection...');
        const [test] = await db.query('SELECT 1 as test');
        console.log('   ✓ Database connection OK\n');
        
        // Step 2: Check if user exists
        console.log('2. Checking for test user...');
        const [users] = await db.query('SELECT id, email FROM users LIMIT 1');
        if (users.length === 0) {
            console.log('   ⚠️  No users found in database\n');
            return;
        }
        const testUser = users[0];
        console.log(`   ✓ Found user: ${testUser.email}\n`);
        
        // Step 3: Generate token
        console.log('3. Generating reset token...');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 15);
        console.log('   ✓ Token generated\n');
        
        // Step 4: Save token to database
        console.log('4. Saving token to database...');
        await db.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, testUser.id]
        );
        console.log('   ✓ Token saved\n');
        
        // Step 5: Test email sending (THIS IS WHERE ERROR LIKELY OCCURS)
        console.log('5. Testing email sending...');
        console.log(`   Sending to: ${testUser.email}`);
        console.log('   This is where the error will occur if email is misconfigured...\n');
        
        try {
            await sendPasswordResetEmail(testUser.email, resetToken);
            console.log('   ✅ SUCCESS! Email sent successfully!\n');
        } catch (emailError) {
            console.log('\n   ❌ EMAIL ERROR DETECTED:');
            console.log('   ' + '='.repeat(56));
            console.log(`   Error Message: ${emailError.message}`);
            console.log(`   Error Code: ${emailError.code || 'N/A'}`);
            console.log(`   Response Code: ${emailError.responseCode || 'N/A'}`);
            console.log('   ' + '='.repeat(56));
            
            if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
                console.log('\n   🔧 SOLUTION:');
                console.log('   1. Your EMAIL_PASS is wrong or not an App Password');
                console.log('   2. Get Gmail App Password from: https://myaccount.google.com/');
                console.log('   3. Update EMAIL_PASS in .env file');
                console.log('   4. Restart server\n');
            } else if (emailError.message.includes('not configured')) {
                console.log('\n   🔧 SOLUTION:');
                console.log('   1. Set EMAIL_USER and EMAIL_PASS in .env file');
                console.log('   2. Restart server\n');
            }
            
            // Clean up token
            await db.query(
                'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
                [testUser.id]
            );
            
            throw emailError;
        }
        
        // Clean up
        await db.query(
            'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [testUser.id]
        );
        
        console.log('='.repeat(60));
        console.log('✅ ALL CHECKS PASSED - No errors found!');
        console.log('='.repeat(60) + '\n');
        
    } catch (error) {
        console.log('\n' + '='.repeat(60));
        console.log('❌ ERROR FOUND');
        console.log('='.repeat(60));
        console.log('Error Type:', error.name);
        console.log('Error Message:', error.message);
        console.log('Error Code:', error.code || 'N/A');
        console.log('Stack:', error.stack);
        console.log('='.repeat(60) + '\n');
        process.exit(1);
    }
}

checkError();

