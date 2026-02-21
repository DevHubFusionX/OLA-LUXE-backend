import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password if using Gmail
    },
  });

  const mailOptions = {
    from: `"Olaluxe.ng" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Login OTP - Olaluxe.ng',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #00a651; text-align: center;">Olaluxe.ng</h2>
        <p>Hello,</p>
        <p>Your verification code for Olaluxe.ng is:</p>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="color: #888; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Olaluxe.ng. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};
