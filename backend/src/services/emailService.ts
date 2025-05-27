import nodemailer from 'nodemailer';
import { IUser } from '../types';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // If no email configuration, log the email instead of sending
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('\n📧 ===== EMAIL WOULD BE SENT (NO EMAIL CONFIG) =====');
        console.log(`📬 To: ${options.to}`);
        console.log(`📋 Subject: ${options.subject}`);
        console.log(`📄 Content: ${options.text || 'See HTML version'}`);
        console.log('📧 ================================================\n');
        return;
      }

      const mailOptions = {
        from: `"DishRated" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;

    // Always log the reset URL for testing/debugging
    console.log('🔗 Password Reset URL:', resetUrl);
    console.log('👤 For user:', user.email);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - DishRated</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #134e4a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍴 DishRated</h1>
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name}</strong>,</p>

              <p>We received a request to reset your password for your DishRated account. If you made this request, click the button below to reset your password:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>

              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>

              <p>If you're having trouble with the button above, you can also reset your password by visiting the login page and clicking "Forgot Password".</p>

              <p>Best regards,<br>The DishRated Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${user.email}</p>
              <p>© ${new Date().getFullYear()} DishRated. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${user.name},

      We received a request to reset your password for your DishRated account.

      To reset your password, visit this link: ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request this reset, please ignore this email.

      Best regards,
      The DishRated Team
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Reset Your DishRated Password',
      html,
      text,
    });
  }

  async sendWelcomeEmail(user: IUser, tempPassword?: string): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/login`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DishRated!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #134e4a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .credentials { background: #e5e7eb; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: monospace; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍴 Welcome to DishRated!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name}</strong>,</p>

              <p>Welcome to DishRated! Your account has been successfully created.</p>

              ${tempPassword ? `
                <p><strong>Your temporary login credentials:</strong></p>
                <div class="credentials">
                  <strong>Email:</strong> ${user.email}<br>
                  <strong>Temporary Password:</strong> ${tempPassword}
                </div>
                <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
              ` : ''}

              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to DishRated</a>
              </div>

              <p>Start discovering amazing food trucks in your area and enjoy delicious meals on wheels!</p>

              <p>Best regards,<br>The DishRated Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DishRated. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Welcome to DishRated!',
      html,
    });
  }
}

export const emailService = new EmailService();
