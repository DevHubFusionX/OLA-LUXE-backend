import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../utils/apiResponse';

// GET /api/products
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, inStock } = req.query;
    
    let filter: any = {};
    
    // If category is provided and not 'All', filter by it
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Only filter by inStock if explicitly requested OR we are in a "customer" view
    // For now, let's keep the customer default as inStock: true
    if (inStock === 'false') {
      // Show out of stock too if explicitly requested
    } else if (inStock === 'true') {
      filter.inStock = true;
    } else {
      // Default: show inStock only for safety, but can be changed
      filter.inStock = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }
    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
