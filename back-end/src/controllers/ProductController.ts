import { Request, Response } from 'express';

import { Product } from '../entities';
import { ProductService } from '../services';
import S3Service from '../services/S3Service';
import responseHandler from '../utils/responseHandler';
import { File } from '../utils/types';
import { randomImageName } from '../utils/utils';

class ProductController {
  private service: ProductService = new ProductService();

  private s3Service = new S3Service();

  addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as File[];

      if (files?.length) {
        const imageKeys: string[] = [];

        files.forEach(file => {
          const imageKey = randomImageName();

          this.s3Service.uploadFileS3(imageKey, file.buffer, file.mimetype);
          imageKeys.push(imageKey);
        });

        req.body.images = imageKeys;
      }

      const result = await this.service.addProduct(req.body);

      responseHandler.sendSuccessResponse(res, 'Product added successfully', result.data);
    } catch (error) {
      console.error('Error adding product:', error);
      responseHandler.sendCatchResponse(res, 'Failed to add product');
    }
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
    const existingProduct = await this.service.getProductById(Number(id));

    if (existingProduct.data?.images.length) {
      try {
        existingProduct.data.images.map(async image => await this.s3Service.deleteFileS3(image));
      } catch (e) {
        console.warn('Failed to delete image:', e);
      }
    }

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

      // Generate signed S3 URLs for product images
      const productsWithSignedUrls = await Promise.all(
        result.data?.map(async (product: Product) => {
          if (product.images && product.images.length > 0) {
            product.images = await Promise.all(product.images.map((image: string) => this.s3Service.getFileS3(image)));
          }

          return product;
        }) || [],
      );

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', productsWithSignedUrls);
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
