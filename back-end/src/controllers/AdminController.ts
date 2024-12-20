import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import pool from '../db';
import { getUserFromWhiteList } from '../utils/utils';
import { validateAdminProps } from '../utils/validation';
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

const login = async (req: Request<{}, {}, ILoginRequestBody>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    const { username, password } = req.body;

    if (!errors.isEmpty()) {
      res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()[0],
      });

      return;
    }

    const userFromWhiteList = await getUserFromWhiteList(req);

    if (!userFromWhiteList) {
      res.status(403).json({ message: 'Access denied: IP not whitelisted' });

      return;
    }

    if (password !== userFromWhiteList.password_hash || username !== userFromWhiteList.username) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    }

    const token = jwt.sign(
      { id: userFromWhiteList.id, username: userFromWhiteList.username, role: userFromWhiteList.role },
      SECRET_KEY,
      { expiresIn: '1h' },
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req: Request<{}, {}, IRegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    const { username, password, ip } = req.body;

    if (!errors.isEmpty()) {
      res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()[0],
      });

      return;
    }

    const checkQuery = 'SELECT id FROM admins WHERE username = $1';
    const oldUser = await pool.query(checkQuery, [username]);

    if (oldUser?.rows.length > 0) {
      res.status(200).send({
        success: false,
        message: 'User already exists. Please login.',
      });

      return;
    }

    const insertQuery = `
      INSERT INTO admins (username, password_hash, admin_ip)
      VALUES ($1, $2, $3)
      RETURNING id, username, role, admin_ip, created_at`;
    const insertResult = await pool.query(insertQuery, [username, password, ip]);

    res.status(201).send({
      success: true,
      message: 'Registered successfully',
      data: insertResult.rows[0],
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateNews = async (req: Request<{ id: string }, {}, IUpdateNewsRequestBody>, res: Response): Promise<void> => {
  const { title, description, images, date } = req.body;
  const { id } = req.params;

  try {
    const newsId = parseInt(id, 10);

    const updateQuery = `
        UPDATE news
        SET
          description = COALESCE($1, description),
          images = COALESCE($2, images),
          date = COALESCE($3, date),
          title = COALESCE($4, title)
        WHERE id = $5
        RETURNING *`;

    const updateResult = await pool.query(updateQuery, [description, images, date, title, newsId]);

    if (updateResult.rows.length > 0) {
      res.status(200).json({
        message: 'News updated successfully',
        data: updateResult.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'News with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error updating news:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const addNews = async (req: Request<{}, {}, IAddNewsRequestBody>, res: Response): Promise<void> => {
  const { title, description, images, date } = req.body;

  try {
    const insertQuery = `
      INSERT INTO news (title, description, images, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const insertResult = await pool.query(insertQuery, [title, description, images, date]);

    res.status(201).json({
      message: 'News created successfully',
      data: insertResult.rows[0],
    });
  } catch (err) {
    console.error('Error processing news:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const updateProducts = async (
  req: Request<{ id: string }, {}, IUpdateProductsRequestBody>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { description, images, country, manufacture, title, category } = req.body;

  try {
    const productId = parseInt(id, 10);

    const updateQuery = `
      UPDATE products
      SET
        description = COALESCE($1, description),
        images = COALESCE($2, images),
        country = COALESCE($3, country),
        manufacture = COALESCE($4, manufacture),
        title = COALESCE($5, title),
        category = COALESCE($6, category)
      WHERE id = $7
      RETURNING *`;

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
      res.status(200).json({
        message: 'Product updated successfully',
        data: updateResult.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Product with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error updating product:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const addNewProducts = async (req: Request<{}, {}, IAddNewProductsRequestBody>, res: Response): Promise<void> => {
  const { description, images, country, manufacture, title, category } = req.body;

  try {
    const insertQuery = `
      INSERT INTO products (title, description, images, manufacture, country, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const insertResult = await pool.query(insertQuery, [title, description, images, manufacture, country, category]);

    res.status(201).json({
      message: 'News created successfully',
      data: insertResult.rows[0],
    });
  } catch (err) {
    console.error('Error processing news:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const getOrders = async (req: Request<{}, {}, {}>, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM orders');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying orders:', (err as Error).message);
    res.status(500).send('Database error');
  }
};

const updateOrders = async (
  req: Request<{ id: string }, {}, IUpdateOrdersRequestBody>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name, phone, date, product_id, status } = req.body;

  try {
    const clientId = parseInt(id, 10);

    const updateQuery = `
      UPDATE orders
      SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        date = COALESCE($3, date),
        product_id = COALESCE($4, product_id),
        status = COALESCE($5, status)
      WHERE id = $6
      RETURNING *`;

    const updateResult = await pool.query(updateQuery, [name, phone, date, product_id, status, clientId]);

    if (updateResult.rows.length > 0) {
      res.status(200).json({
        message: 'Orders updated successfully',
        data: updateResult.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Orders with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error updating clients:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const deleteProducts = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const productId = parseInt(id, 10);
    const deleteQuery = `
      DELETE FROM products
      WHERE id = $1
      RETURNING *`;

    const deleteResult = await pool.query(deleteQuery, [productId]);

    if (deleteResult.rows.length > 0) {
      res.status(200).json({
        message: 'Product deleted successfully',
        data: deleteResult.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Product with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error deleting product:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const deleteOrders = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const clientId = parseInt(id, 10);
    const deleteQuery = `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *`;

    const deleteResult = await pool.query(deleteQuery, [clientId]);

    if (deleteResult.rows.length > 0) {
      res.status(200).json({
        message: 'Order deleted successfully',
        data: deleteResult.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Order with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error deleting order:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

const AdminController = {
  register,
  login,
  updateNews,
  addNews,
  updateProducts,
  addNewProducts,
  getOrders,
  updateOrders,
  deleteOrders,
  deleteProducts,
  validate: validateAdminProps,
};

export default AdminController;
