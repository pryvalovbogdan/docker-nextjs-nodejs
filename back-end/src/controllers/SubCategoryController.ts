import { Request, Response } from 'express';

import SubCategoryService from '../services/SubCategoryService';
import responseHandler from '../utils/responseHandler';

class SubCategoryController {
  private service: SubCategoryService = new SubCategoryService();

  createSubCategory = async (req: Request, res: Response): Promise<void> => {
    const { name, categoryId, path, title, heading, description, keywords, position } = req.body;

    try {
      if (!name) {
        responseHandler.sendFailResponse(res, 'Subcategory name is required');

        return;
      }

      if (!categoryId || !Number.isFinite(Number(categoryId))) {
        responseHandler.sendFailResponse(res, 'Valid categoryId is required');

        return;
      }

      const result = await this.service.createSubCategoryFull({
        name,
        categoryId: Number(categoryId),
        path,
        title,
        heading,
        description,
        keywords,
        position,
      });

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Subcategory created successfully', result.data);
    } catch (error) {
      console.error('Error creating subcategory:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };

  updateSubCategory = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      responseHandler.sendFailResponse(res, 'Invalid subcategory id');

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
        categoryId: number;
      }
    > = ['name', 'path', 'title', 'heading', 'description', 'keywords', 'position', 'categoryId'];

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
      const result = await this.service.updateSubCategory(id, patch);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Subcategory updated successfully', result.data);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };

  deleteSubCategory = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      responseHandler.sendFailResponse(res, 'Invalid subcategory id');

      return;
    }

    try {
      await this.service.deleteSubCategory(id);
      responseHandler.sendSuccessResponse(res, 'Subcategory deleted successfully', { id });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  };
}

export default SubCategoryController;
