import { Request, Response } from 'express';

import { ProductService } from '../services';
import responseHandler from '../utils/responseHandler';

class ProductController {
  private service: ProductService = new ProductService();

  addProduct = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.addProduct(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Product added successfully', result.data);
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.updateProduct(Number(id), req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.deleteProduct(Number(id));

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product deleted successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getProducts();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsOffset = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      const result = await this.service.getProductsOffset(Number(limit), offset);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const productId = parseInt(id, 10);
      const result = await this.service.getProductById(productId);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;

    try {
      const result = await this.service.getProductsByCategory(category);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by category');
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getCategories();

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
}

export default ProductController;
