import { Request, Response } from 'express';

import { ProductService } from '../services';
import S3Service from '../services/S3Service';
import responseHandler from '../utils/responseHandler';
import { tOpenAI } from '../utils/tOpenAi';
import { File } from '../utils/types';
import { randomImageName } from '../utils/utils';

class ProductController {
  private service: ProductService = new ProductService();

  private s3Service = new S3Service();

  addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as File[];
      const imageKeys: string[] = [];

      if (files?.length) {
        for (let file of files) {
          const imageKey = randomImageName();

          await this.s3Service.uploadFileS3(imageKey, file.buffer, file.mimetype);
          imageKeys.push(process.env.CLOUDFRONT_URL! + imageKey);
        }

        req.body.images = imageKeys;
      }

      const category = JSON.parse(req.body.category);
      const subCategory = req.body.subCategory ? JSON.parse(req.body.subCategory) : null;

      const result = await this.service.addProduct({
        ...req.body,
        category,
        subCategory,
      });

      if (result.errors.length) {
        responseHandler.sendCatchResponse(res, result.errors[0]);

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Product added successfully', result.data);
    } catch (error) {
      console.error('Error adding product:', error);
      responseHandler.sendCatchResponse(res, 'Failed to add product');
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const parseMaybeJSON = (v: any) => {
      if (typeof v !== 'string') {
        return v;
      }

      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    };

    const category = parseMaybeJSON(req.body.category);
    const subCategory = req.body.subCategory ? parseMaybeJSON(req.body.subCategory) : null;

    const files = req.files as File[] | undefined;
    const imageKeys: string[] = [];

    if (files?.length) {
      for (const file of files) {
        const imageKey = randomImageName();

        await this.s3Service.uploadFileS3(imageKey, file.buffer, file.mimetype);
        imageKeys.push(process.env.CLOUDFRONT_URL! + imageKey);
      }

      req.body.images = imageKeys;
    } else if (req.body.images !== undefined) {
      if (typeof req.body.images === 'string') {
        try {
          const parsed = JSON.parse(req.body.images);

          req.body.images = Array.isArray(parsed) ? parsed : [req.body.images];
        } catch {
          req.body.images = req.body.images
            .split('|')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
    }

    const product = {
      ...req.body,
      category,
      subCategory,
    };

    const result = await this.service.updateProduct(Number(id), product);

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

    if (existingProduct.data?.images?.length) {
      for (let image of existingProduct.data.images) {
        await this.s3Service.deleteFileS3(image);
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

      if (result.errors.length || !result.data) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      for (let product of result.data) {
        if (product.images) {
          product.images = product.images.map(item => process.env.CLOUDFRONT_URL + item);
        }
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsOffset = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    try {
      const result = await this.service.getProductsOffset(limitNumber, pageNumber);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', {
        products: result.data?.products,
        totalPages: result.data?.totalPages,
      });
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const lngRaw = req.query?.lng as string | string[] | undefined;
    const lng = Array.isArray(lngRaw) ? lngRaw[0] : lngRaw;

    console.log('getProductsById params/query:', req.params, req.query);

    try {
      const productId = parseInt(id, 10);
      const result = await this.service.getProductById(productId);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        let data = result.data;

        if (lng !== 'uk') {
          const [titleTr, descriptionTr, characteristicsTr, countryTr] = await Promise.all([
            tOpenAI(data.title, 'uk', lng || ''),
            tOpenAI(data.description, 'uk', lng || ''),
            tOpenAI(data.characteristics, 'uk', lng || ''),
            tOpenAI(data.country, 'uk', lng || ''),
          ]);

          console.log('uououou', titleTr, descriptionTr, characteristicsTr, countryTr);

          data = {
            ...data,
            title: titleTr,
            description: descriptionTr,
            characteristics: characteristicsTr,
            country: countryTr,
          };
        }

        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', data);
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    let { category } = req.params;

    try {
      category = decodeURIComponent(category);

      const result = await this.service.getProductsByCategory(category);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      } else {
        responseHandler.sendFailResponse(res, 'No products found for this category');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by category');
    }
  };

  getProductsBySubCategory = async (req: Request, res: Response): Promise<void> => {
    let { category } = req.params;

    try {
      category = decodeURIComponent(category);
      const result = await this.service.getProductsBySubCategory(category);

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

  getProductsByBrandName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;

    try {
      const result = await this.service.getProductByBrandName(name);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by brand name');
    }
  };

  getLastAddedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getLastAddedProducts();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Last 10 products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error retrieving last 10 products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.params;
    const queryWithSpaces = query.replace('+', ' ');

    try {
      const result = await this.service.searchProducts(queryWithSpaces);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error searching for products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  exportProductsCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, filename } = await this.service.exportProductsToCSV();

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/csv');
      res.send(data);
    } catch (error) {
      console.error('Error exporting products:', error);
      responseHandler.sendCatchResponse(res, 'Failed to export products');
    }
  };

  exportProductsJSON = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, filename } = await this.service.exportProductsToJSON();

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(data);
    } catch (error) {
      console.error('Error exporting products (JSON):', error);
      responseHandler.sendCatchResponse(res, 'Failed to export products (JSON)');
    }
  };
}

export default ProductController;
