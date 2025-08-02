import { Request, Response } from 'express';

import CategoryService from '../services/CategoryService';
import responseHandler from '../utils/responseHandler';

class CategoryController {
  private service: CategoryService = new CategoryService();

  getCategoriesWithSubcategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getCategoriesWithSubcategories();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Categories retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying categories:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getCategoryByPath = async (req: Request, res: Response): Promise<void> => {
    const path = req.params.path as string;

    const result = await this.service.getCategoryByPath(path);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Orders retrieved successfully', result.data);
  };
}

export default CategoryController;
