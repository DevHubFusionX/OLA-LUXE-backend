import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
