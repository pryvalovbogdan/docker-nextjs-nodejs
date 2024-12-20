import { Request, Response } from 'express';

import pool from '../db';
import responseHandler from '../utils/responseHandler';

class CustomerController {
  public static async getProducts(req: Request<{}, {}, {}>, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM products');

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.rows);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  static async getProductsOffset(req: Request<{}, {}, {}>, res: Response): Promise<void> {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      const result = await pool.query('SELECT * FROM products LIMIT $1 OFFSET $2', [Number(limit), offset]);

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.rows);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  static async getProductsById(req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const productId = parseInt(id, 10);
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

      if (result.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'Product with the given ID not found');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  static async getProductsByCategory(req: Request<{ category: string }, {}, {}>, res: Response): Promise<void> {
    const { category } = req.params;

    try {
      const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);

      if (result.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.rows);
      } else {
        responseHandler.sendFailResponse(res, 'No products found in this category');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  static async getNews(req: Request<{}, {}, {}>, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM news');

      responseHandler.sendSuccessResponse(res, 'News retrieved successfully', result.rows);
    } catch (err) {
      console.error('Error querying news:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  static async getCategories(req: Request<{}, {}, {}>, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT DISTINCT category FROM products');

      if (result.rows.length > 0) {
        responseHandler.sendSuccessResponse(
          res,
          'Categories retrieved successfully',
          result.rows.map(row => row.category),
        );
      } else {
        responseHandler.sendFailResponse(res, 'No categories found');
      }
    } catch (err) {
      console.error('Error querying categories:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }
}

export default CustomerController;
