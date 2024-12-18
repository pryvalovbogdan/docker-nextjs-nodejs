import { Router } from 'express';

import pool from '../db';

const router = Router();

// Endpoint to get all products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying products:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get product by id
router.get('/products:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying products:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get all news
router.get('/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying news:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

export default router;
