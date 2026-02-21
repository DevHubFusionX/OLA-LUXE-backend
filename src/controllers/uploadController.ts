import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return sendError(res, 'No files uploaded', 400);
    }

    const urls = files.map(file => file.path);
    
    sendSuccess(res, { urls }, 'Images uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    sendError(res, 'Failed to upload images');
  }
};
