import { Request, Response } from 'express';

import pool from '../db';

const getProducts = async (req: Request<{}, {}, {}>, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying products:', (err as Error).message);
    res.status(500).send('Database error');
  }
};

const getProductsById = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const productId = parseInt(id, 10);

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (result.rows.length > 0) {
      res.status(200).json({
        message: 'Product data reached successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Product with the given ID not found',
      });
    }
  } catch (err) {
    console.error('Error querying products:', (err as Error).message);
    res.status(500).send('Database error');
  }
};

const getNews = async (req: Request<{}, {}, {}>, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM news');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying news:', (err as Error).message);
    res.status(500).send('Database error');
  }
};

const CustomerController = {
  getProducts,
  getProductsById,
  getNews,
};

export default CustomerController;
