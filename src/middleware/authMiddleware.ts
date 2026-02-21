import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'olaluxe_secret_key_2024'
    ) as JwtPayload;
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user?.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};
