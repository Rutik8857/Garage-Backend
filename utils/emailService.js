const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate email configuration
const isEmailConfigured = () => {
  const hasUser = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com';
  const hasPass = process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-gmail-app-password-here';
  return hasUser && hasPass;
};

if (!isEmailConfigured()) {
  console.warn('⚠️  Warning: EMAIL_USER or EMAIL_PASS not properly configured. Email functionality will be disabled.');
  console.warn('   Set EMAIL_USER and EMAIL_PASS in .env file to enable email sending.');
}

// Create reusable transporter object using Gmail SMTP
let transporter;
if (isEmailConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    transporter = null;
  }
} else {
  transporter = null;
}

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  // Check if transporter is configured
  if (!transporter || !isEmailConfigured()) {
    throw new Error('Email transporter not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #2563eb; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Password Reset Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hello,
                      </p>
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password for your Garage Management System account. 
                        If you made this request, please click the button below to reset your password:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          Reset Password
                        </a>
                      </div>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="margin: 10px 0 0 0; color: #2563eb; font-size: 14px; word-break: break-all;">
                        ${resetLink}
                      </p>
                      <p style="margin: 30px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        <strong>Important:</strong> This password reset link will expire in <strong>15 minutes</strong> for security reasons.
                      </p>
                      <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                      </p>
                      <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        If you're having trouble clicking the button, copy and paste the link above into your web browser.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; text-align: center; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} Your App. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello,
      
      We received a request to reset your password for your Garage Management System account.
      If you made this request, please click the link below to reset your password:
      
      ${resetLink}
      
      Important: This password reset link will expire in 15 minutes for security reasons.
      
      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      
      If you're having trouble clicking the link, copy and paste it into your web browser.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Preserve original error details
    const emailError = new Error(`Failed to send password reset email: ${error.message}`);
    emailError.code = error.code;
    emailError.responseCode = error.responseCode;
    emailError.response = error.response;
    emailError.originalError = error;
    
    // Check if it's a configuration error
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !transporter) {
      emailError.message = 'Email transporter not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.';
      throw emailError;
    }
    
    // Check for authentication errors
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.error(
        `[EAUTH] Gmail authentication failed for user: ${process.env.EMAIL_USER}. ` +
        'Please ensure that EMAIL_USER and EMAIL_PASS in your .env file are correct. ' +
        'You must use a 16-character Gmail App Password for EMAIL_PASS, not your regular Gmail password.'
      );
      emailError.message = 'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials. Make sure you are using a Gmail App Password (16 characters), not your regular password.';
      throw emailError;
    }
    
    throw emailError;
  }
};

module.exports = {
  sendPasswordResetEmail,
};
