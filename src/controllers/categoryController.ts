import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/apiResponse';

// GET /api/categories
export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const category = await Category.create({ name, slug, description });
    sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      sendError(res, 'Category not found', 404);
      return;
    }
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
