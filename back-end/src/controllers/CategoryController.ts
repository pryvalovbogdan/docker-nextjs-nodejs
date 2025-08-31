import { Request, Response } from 'express';

import CategoryService from '../services/CategoryService';
import responseHandler from '../utils/responseHandler';

class CategoryController {
  private service: CategoryService = new CategoryService();

  getCategoriesWithSubcategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const lngRaw = req.query?.lng as string | string[] | undefined;

      const lng = Array.isArray(lngRaw) ? lngRaw[0] : lngRaw;

      const result = await this.service.getCategoriesWithSubcategories(lng as 'uk' | 'ru');

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

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      path,
      title,
      heading,
      description,
      keywords,
      position,
      name_ru,
      title_ru,
      heading_ru,
      description_ru,
    } = req.body;

    try {
      if (!name) {
        responseHandler.sendFailResponse(res, 'Category name is required');

        return;
      }

      const categoryData = {
        name,
        path,
        title,
        heading,
        description,
        keywords,
        name_ru,
        title_ru,
        heading_ru,
        description_ru,
        position: position ?? 10000,
      };

      const result = await this.service.createCategory(categoryData);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));
      } else {
        responseHandler.sendSuccessResponse(res, 'Category created successfully', result.data);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      responseHandler.sendFailResponse(res, 'Invalid category id');

      return;
    }

    const ALLOWED: Array<
      keyof {
        name: string;
        path: string | null;
        title: string | null;
        heading: string | null;
        description: string | null;
        keywords: string | null;
        position: number;
        name_ru: string | null;
        title_ru: string | null;
        heading_ru: string | null;
        description_ru: string | null;
      }
    > = [
      'name',
      'path',
      'title',
      'heading',
      'description',
      'keywords',
      'position',
      'name_ru',
      'title_ru',
      'heading_ru',
      'description_ru',
    ];

    const patch: Record<string, any> = {};

    for (const key of ALLOWED) {
      if (key in req.body && req.body[key] !== undefined) {
        patch[key] = req.body[key];
      }
    }

    if (Object.keys(patch).length === 0) {
      responseHandler.sendFailResponse(res, 'No fields to update');

      return;
    }

    try {
      const result = await this.service.updateCategory(id, patch);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Category updated successfully', result.data);
    } catch (error) {
      console.error('Error updating category:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      responseHandler.sendFailResponse(res, 'Invalid category id');

      return;
    }

    try {
      await this.service.deleteCategory(id);
      responseHandler.sendSuccessResponse(res, 'Category deleted successfully', { id });
    } catch (error) {
      console.error('Error deleting category:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };
}

export default CategoryController;
