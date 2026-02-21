import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// User routes
router.get('/my', authMiddleware, getMyOrders);
router.post('/', createOrder);
router.patch('/:id/cancel', authMiddleware, cancelOrder);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
