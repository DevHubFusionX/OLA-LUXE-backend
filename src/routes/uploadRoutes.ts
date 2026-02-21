import { Router } from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { uploadImage } from '../controllers/uploadController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();
const upload = multer({ storage });

// POST /api/upload
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 6), uploadImage);

export default router;
