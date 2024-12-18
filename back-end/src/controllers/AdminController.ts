import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import pool from '../db';
import { getUserFromWhiteList } from '../utils/utils';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

type TMethodValidation = 'login' | 'register' | 'news' | 'product' | 'productId';

const validate = (method: TMethodValidation) => {
  switch (method) {
    case 'login': {
      return [body('username').not().isEmpty(), body('password').not().isEmpty()];
    }

    case 'register': {
      return [body('username').not().isEmpty(), body('password').not().isEmpty()];
    }

    case 'news': {
      return [body('title').not().isEmpty(), body('description').not().isEmpty()];
    }

    case 'product': {
      return [body('title').not().isEmpty(), body('description').not().isEmpty(), body('category').not().isEmpty()];
    }

    case 'productId': {
      return [body('id').not().isEmpty()];
    }
  }
};

interface ILoginRequestBody {
  username: string;
  password: string;
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

    console.log('SECRET_KEY', SECRET_KEY, token);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

interface IRegisterRequestBody {
  username: string;
  password: string;
  ip: string;
}

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

interface UpdateNewsRequestBody {
  id: string;
  title?: string;
  description?: string;
  images?: string[];
  date: string;
}

const updateNews = async (req: Request<{}, {}, UpdateNewsRequestBody>, res: Response): Promise<void> => {
  const { title, description, images, date } = req.body;

  try {
    const checkQuery = 'SELECT id FROM news WHERE title = $1';
    const checkResult = await pool.query(checkQuery, [title]);

    if (checkResult?.rows.length > 0) {
      const existingData = checkResult.rows[0];
      const updateQuery = `
        UPDATE news 
        SET description = $1, images = $2, date = $3 
        WHERE title = $4
        RETURNING *`;
      const updateResult = await pool.query(updateQuery, [
        description || existingData.description,
        images || existingData.images,
        date || existingData.date,
        title || existingData.title,
      ]);

      res.status(200).json({
        message: 'News updated successfully',
        data: updateResult.rows[0],
      });

      return;
    } else {
      res.status(404).json({
        message: 'News with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error processing news:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

interface AddNewsRequestBody {
  title: string;
  description: string;
  images?: string[];
  date: string;
}

const addNews = async (req: Request<{}, {}, AddNewsRequestBody>, res: Response): Promise<void> => {
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

interface ProductsRequestBody {
  title?: string;
  description?: string;
  images?: string[];
  country?: string;
  manufacture?: string;
  category?: string;
  id: string;
}
//title, description, images, manufacture, country, category
const updateProducts = async (req: Request<{ id: string }, {}, ProductsRequestBody>, res: Response): Promise<void> => {
  const { description, images, country, manufacture, title } = req.body;
  const { id } = req.params;

  try {
    const checkQuery = 'SELECT * FROM products WHERE id = $1';
    const idParsed = Number(id.replace(':', ''));
    const checkResult = await pool.query(checkQuery, [idParsed]);

    if (checkResult?.rows.length > 0) {
      const existingData = checkResult.rows[0];
      const updateQuery = `
        UPDATE products 
        SET description = $1, images = $2, country = $3, manufacture = $4, title = $5
        WHERE id = $6
        RETURNING *`;
      const updateResult = await pool.query(updateQuery, [
        description || existingData.description,
        images || existingData.images,
        country || existingData.country,
        manufacture || existingData.manufacture,
        title || existingData.title,
        idParsed,
      ]);

      res.status(200).json({
        message: 'Product updated successfully',
        data: updateResult.rows[0],
      });

      return;
    } else {
      res.status(404).json({
        message: 'Products with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error processing news:', (err as Error).message);

    res.status(500).json({
      message: 'Database error',
      error: (err as Error).message,
    });
  }
};

interface NewProductsRequestBody {
  title: string;
  description: string;
  images?: string[];
  date?: string;
  country: string;
  manufacture: string;
  category: string;
}
const addNewProducts = async (req: Request<{}, {}, NewProductsRequestBody>, res: Response): Promise<void> => {
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

const AdminController = {
  register,
  login,
  validate,
  updateNews,
  updateProducts,
  addNews,
  addNewProducts,
};

export default AdminController;
