import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { sendSuccess, sendError } from '../utils/apiResponse';

// POST /api/orders
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerName, email, phone, address, notes, deliveryZone, deliveryFee, items, totalPrice } = req.body;

    if (!customerName || !email || !phone || !address || !deliveryZone || !items || items.length === 0) {
      sendError(res, 'Missing required fields', 400);
      return;
    }

    // Calculate total if not provided
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const fee = typeof deliveryFee === 'number' ? deliveryFee : 0;
    const computedTotal = totalPrice || subtotal + fee;

    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      notes,
      deliveryZone,
      deliveryFee: fee,
      items,
      totalPrice: computedTotal,
    });

    sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (admin use)
export const getOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userEmail = (req as any).user.email;
    const orders = await Order.find({ email: userEmail }).sort({ createdAt: -1 });
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status (admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    sendSuccess(res, order, `Order status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/cancel (user)
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userEmail = (req as any).user.email;
    const order = await Order.findById(req.params.id);

    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    if (order.email !== userEmail) {
      sendError(res, 'You can only cancel your own orders', 403);
      return;
    }

    if (order.status !== 'pending') {
      sendError(res, 'Only pending orders can be cancelled', 400);
      return;
    }

    order.status = 'cancelled';
    await order.save();

    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};
