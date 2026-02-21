import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendOTP } from '../utils/emailService';

export const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    // Save OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send Email
    try {
      await sendOTP(email, otp);
      res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (emailError: any) {
      console.error('OTP Email Send Failed:', emailError.message || emailError);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};
