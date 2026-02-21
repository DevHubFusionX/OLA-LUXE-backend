import { Request, Response, NextFunction } from 'express';
import { DeliveryZone } from '../models/DeliveryZone';
import { sendSuccess, sendError } from '../utils/apiResponse';

// GET /api/delivery-zones
export const getDeliveryZones = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };

    const zones = await DeliveryZone.find(filter).sort({ fee: 1, name: 1 });
    sendSuccess(res, zones);
  } catch (error) {
    next(error);
  }
};

// POST /api/delivery-zones
export const createDeliveryZone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, fee, isActive } = req.body;

    if (!name || typeof fee !== 'number') {
      sendError(res, 'Name and fee are required', 400);
      return;
    }

    const zone = await DeliveryZone.create({ name, fee, isActive });
    sendSuccess(res, zone, 'Delivery zone created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/delivery-zones/:id
export const updateDeliveryZone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, fee, isActive } = req.body;

    if (fee !== undefined && typeof fee !== 'number') {
      sendError(res, 'Fee must be a number', 400);
      return;
    }

    const zone = await DeliveryZone.findByIdAndUpdate(
      id,
      { name, fee, isActive },
      { new: true, runValidators: true }
    );

    if (!zone) {
      sendError(res, 'Delivery zone not found', 404);
      return;
    }

    sendSuccess(res, zone, 'Delivery zone updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/delivery-zones/:id
export const deleteDeliveryZone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
    if (!zone) {
      sendError(res, 'Delivery zone not found', 404);
      return;
    }
    sendSuccess(res, null, 'Delivery zone deleted successfully');
  } catch (error) {
    next(error);
  }
};
