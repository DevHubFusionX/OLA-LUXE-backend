import { Router } from 'express';
import {
  createDeliveryZone,
  deleteDeliveryZone,
  getDeliveryZones,
  updateDeliveryZone,
} from '../controllers/deliveryZoneController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getDeliveryZones);
router.post('/', authMiddleware, adminMiddleware, createDeliveryZone);
router.put('/:id', authMiddleware, adminMiddleware, updateDeliveryZone);
router.delete('/:id', authMiddleware, adminMiddleware, deleteDeliveryZone);

export default router;
