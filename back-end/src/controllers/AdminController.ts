import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import pool from '../db';
import responseHandler from '../utils/responseHandler';
import { getUserFromWhiteList } from '../utils/utils';
import {
  IAddNewProductsRequestBody,
  IAddNewsRequestBody,
  ILoginRequestBody,
  IRegisterRequestBody,
  IUpdateNewsRequestBody,
  IUpdateOrdersRequestBody,
  IUpdateProductsRequestBody,
} from './types';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

class AdminController {
  public static async login(req: Request<{}, {}, ILoginRequestBody>, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      const { username, password } = req.body;

      if (!errors.isEmpty()) {
        responseHandler.sendValidationResponse(res, errors.array());

        return;
      }

      const userFromWhiteList = await getUserFromWhiteList(req);

      if (!userFromWhiteList) {
        responseHandler.sendForbiddenResponse(res, 'Access denied: IP not whitelisted', {});

        return;
      }

      if (password !== userFromWhiteList.password_hash || username !== userFromWhiteList.username) {
        responseHandler.sendUnauthorizedResponse(res, 'Invalid credentials');

        return;
      }

      const token = jwt.sign(
        { id: userFromWhiteList.id, username: userFromWhiteList.username, role: userFromWhiteList.role },
        SECRET_KEY as string,
        { expiresIn: '1h' },
      );

      responseHandler.sendSuccessResponse(res, 'Login successful', { token });
    } catch (err) {
      console.error(err);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  }

  public static async register(req: Request<{}, {}, IRegisterRequestBody>, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      const { username, password, ip } = req.body;

      if (!errors.isEmpty()) {
        responseHandler.sendValidationResponse(res, errors.array());

        return;
      }

      const checkQuery = 'SELECT id FROM admins WHERE username = $1';
      const oldUser = await pool.query(checkQuery, [username]);

      if (oldUser?.rows.length > 0) {
        responseHandler.sendFailResponse(res, 'User already exists. Please login.');

        return;
      }

      const insertQuery = `
        INSERT INTO admins (username, password_hash, admin_ip)
        VALUES ($1, $2, $3) RETURNING id, username, role, admin_ip, created_at`;
      const insertResult = await pool.query(insertQuery, [username, password, ip]);

      responseHandler.sendSuccessResponse(res, 'Registered successfully', insertResult.rows[0]);
    } catch (err) {
      console.error('Error during registration:', err);
      responseHandler.sendCatchResponse(res, 'Server error');
    }
  }

  public static async updateNews(
    req: Request<{ id: string }, {}, IUpdateNewsRequestBody>,
    res: Response,
  ): Promise<void> {
    const { title, description, images, date } = req.body;
    const { id } = req.params;

    try {
      const newsId = parseInt(id, 10);

      const updateQuery = `
        UPDATE news
        SET description = COALESCE($1, description),
            images      = COALESCE($2, images),
            date        = COALESCE($3, date),
            title       = COALESCE($4, title)
        WHERE id = $5 RETURNING *`;

      const updateResult = await pool.query(updateQuery, [description, images, date, title, newsId]);

      if (updateResult.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'News updated successfully', updateResult.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'News with the given ID not found');
      }
    } catch (err) {
      console.error('Error updating news:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async addNews(req: Request<{}, {}, IAddNewsRequestBody>, res: Response): Promise<void> {
    const { title, description, images, date } = req.body;

    try {
      const insertQuery = `
        INSERT INTO news (title, description, images, date)
        VALUES ($1, $2, $3, $4) RETURNING *`;
      const insertResult = await pool.query(insertQuery, [title, description, images, date]);

      responseHandler.sendSuccessResponse(res, 'News created successfully', insertResult.rows[0]);
    } catch (err) {
      console.error('Error processing news:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async updateProducts(
    req: Request<{ id: string }, {}, IUpdateProductsRequestBody>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { description, images, country, manufacture, title, category } = req.body;

    try {
      const productId = parseInt(id, 10);

      const updateQuery = `
        UPDATE products
        SET description = COALESCE($1, description),
            images      = COALESCE($2, images),
            country     = COALESCE($3, country),
            manufacture = COALESCE($4, manufacture),
            title       = COALESCE($5, title),
            category    = COALESCE($6, category)
        WHERE id = $7 RETURNING *`;

      const updateResult = await pool.query(updateQuery, [
        description,
        images,
        country,
        manufacture,
        title,
        category,
        productId,
      ]);

      if (updateResult.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Product updated successfully', updateResult.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'Product with the given ID not found');
      }
    } catch (err) {
      console.error('Error updating product:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async addNewProducts(req: Request<{}, {}, IAddNewProductsRequestBody>, res: Response): Promise<void> {
    const { description, images, country, manufacture, title, category } = req.body;

    try {
      const insertQuery = `
        INSERT INTO products (title, description, images, manufacture, country, category)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const insertResult = await pool.query(insertQuery, [title, description, images, manufacture, country, category]);

      responseHandler.sendSuccessResponse(res, 'Product created successfully', insertResult.rows[0]);
    } catch (err) {
      console.error('Error processing product:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async getOrders(req: Request<{}, {}, {}>, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM orders');

      responseHandler.sendSuccessResponse(res, 'Orders retrieved successfully', result.rows);
    } catch (err) {
      console.error('Error querying orders:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async updateOrders(
    req: Request<{ id: string }, {}, IUpdateOrdersRequestBody>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, phone, date, product_id, status } = req.body;

    try {
      const clientId = parseInt(id, 10);

      const updateQuery = `
        UPDATE orders
        SET name       = COALESCE($1, name),
            phone      = COALESCE($2, phone),
            date       = COALESCE($3, date),
            product_id = COALESCE($4, product_id),
            status     = COALESCE($5, status)
        WHERE id = $6 RETURNING *`;

      const updateResult = await pool.query(updateQuery, [name, phone, date, product_id, status, clientId]);

      if (updateResult.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Order updated successfully', updateResult.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'Order with the given ID not found');
      }
    } catch (err) {
      console.error('Error updating order:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async deleteProducts(req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const productId = parseInt(id, 10);
      const deleteQuery = `
        DELETE
        FROM products
        WHERE id = $1 RETURNING *`;

      const deleteResult = await pool.query(deleteQuery, [productId]);

      if (deleteResult.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Product deleted successfully', deleteResult.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'Product with the given ID not found');
      }
    } catch (err) {
      console.error('Error deleting product:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }

  public static async deleteOrders(req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const clientId = parseInt(id, 10);
      const deleteQuery = `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *`;

      const deleteResult = await pool.query(deleteQuery, [clientId]);

      if (deleteResult.rows.length > 0) {
        responseHandler.sendSuccessResponse(res, 'Order deleted successfully', deleteResult.rows[0]);
      } else {
        responseHandler.sendFailResponse(res, 'Order with the given ID not found');
      }
    } catch (err) {
      console.error('Error deleting order:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  }
}

export default AdminController;
