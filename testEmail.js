// Test script to verify email configuration works
require('dotenv').config();
const { sendPasswordResetEmail } = require('./utils/emailService');

async function testEmail() {
  console.log('\n' + '='.repeat(60));
  console.log('📧 TESTING EMAIL CONFIGURATION');
  console.log('='.repeat(60) + '\n');
  
  // Check configuration
  console.log('Checking email configuration...');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'SET ✓' : 'NOT SET ✗'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET ✓' : 'NOT SET ✗'}`);
  console.log(`EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || 'Not set'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}\n`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email not configured!');
    console.log('\nTo configure email, run: node setupEmail.js\n');
    process.exit(1);
  }
  
  // Test email sending
  const testEmail = process.env.EMAIL_USER; // Send test email to yourself
  const testToken = 'test-token-12345';
  
  console.log(`Sending test email to: ${testEmail}`);
  console.log('Please wait...\n');
  
  try {
    await sendPasswordResetEmail(testEmail, testToken);
    console.log('✅ SUCCESS! Email sent successfully!');
    console.log(`\nCheck your inbox at: ${testEmail}`);
    console.log('Look for email with subject: "Reset Your Password"\n');
  } catch (error) {
    console.error('\n❌ FAILED to send email!');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Wrong Gmail App Password');
    console.error('2. 2-Step Verification not enabled');
    console.error('3. App Password not generated');
    console.error('\nTo fix:');
    console.error('1. Go to https://myaccount.google.com/');
    console.error('2. Enable 2-Step Verification');
    console.error('3. Generate App Password');
    console.error('4. Update EMAIL_PASS in .env file\n');
    process.exit(1);
  }
}

testEmail();

