// Interactive script to help configure email
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEmail() {
  console.log('\n' + '='.repeat(60));
  console.log('📧 EMAIL CONFIGURATION SETUP');
  console.log('='.repeat(60) + '\n');
  
  console.log('This will help you configure email for password reset functionality.\n');
  console.log('You will need:');
  console.log('1. A Gmail account');
  console.log('2. Gmail App Password (16-character password)\n');
  
  const emailUser = await question('Enter your Gmail address (e.g., yourname@gmail.com): ');
  const emailPass = await question('Enter your Gmail App Password (16 characters): ');
  const emailFromName = await question('Enter sender name (e.g., Garage Management System) [default: Garage Management System]: ') || 'Garage Management System';
  const frontendUrl = await question('Enter frontend URL (e.g., http://localhost:3000) [default: http://localhost:3000]: ') || 'http://localhost:3000';
  
  // Read existing .env file
  let envContent = '';
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update email configuration
  const lines = envContent.split('\n');
  const updatedLines = lines.map(line => {
    if (line.startsWith('EMAIL_USER=')) {
      return `EMAIL_USER=${emailUser}`;
    }
    if (line.startsWith('EMAIL_PASS=')) {
      return `EMAIL_PASS=${emailPass}`;
    }
    if (line.startsWith('EMAIL_FROM_NAME=')) {
      return `EMAIL_FROM_NAME=${emailFromName}`;
    }
    if (line.startsWith('FRONTEND_URL=')) {
      return `FRONTEND_URL=${frontendUrl}`;
    }
    return line;
  });
  
  // Add missing lines if they don't exist
  if (!envContent.includes('EMAIL_USER=')) {
    updatedLines.push(`EMAIL_USER=${emailUser}`);
  }
  if (!envContent.includes('EMAIL_PASS=')) {
    updatedLines.push(`EMAIL_PASS=${emailPass}`);
  }
  if (!envContent.includes('EMAIL_FROM_NAME=')) {
    updatedLines.push(`EMAIL_FROM_NAME=${emailFromName}`);
  }
  if (!envContent.includes('FRONTEND_URL=')) {
    updatedLines.push(`FRONTEND_URL=${frontendUrl}`);
  }
  
  // Write updated .env file
  fs.writeFileSync(envPath, updatedLines.join('\n'));
  
  console.log('\n✅ Email configuration saved to .env file!\n');
  console.log('📋 Configuration Summary:');
  console.log(`   Email: ${emailUser}`);
  console.log(`   App Password: ${'*'.repeat(emailPass.length)}`);
  console.log(`   From Name: ${emailFromName}`);
  console.log(`   Frontend URL: ${frontendUrl}\n`);
  
  console.log('⚠️  IMPORTANT: Restart your server for changes to take effect!\n');
  console.log('To test email:');
  console.log('1. Restart server: npm start');
  console.log('2. Test forgot password endpoint');
  console.log('3. Check your email inbox\n');
  
  rl.close();
}

setupEmail().catch(console.error);

