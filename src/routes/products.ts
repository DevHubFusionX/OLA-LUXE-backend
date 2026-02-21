import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
