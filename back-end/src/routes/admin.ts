import { Router } from 'express';
import jwt from 'jsonwebtoken';

import pool from '../db';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';
import { getUserFromWhiteList } from '../utils/utils';

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Route to authenticate admin user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('clientIp', username, password);
  try {
    const userFromWhiteList = await getUserFromWhiteList(req);

    if (!userFromWhiteList) {
      res.status(403).json({ message: 'Access denied: IP not whitelisted' });

      return;
    }

    console.log('admin', password, 'sdsd', userFromWhiteList.password_hash);

    if (password !== userFromWhiteList.password_hash || username !== userFromWhiteList.username) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userFromWhiteList.id, username: userFromWhiteList.username, role: userFromWhiteList.role },
      SECRET_KEY,
      {
        expiresIn: '1h', // Token expires in 1 hour
      },
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protect all admin routes
router.use(validateAdminJWT);

router.post('/', async (req, res) => {
  console.log('req.body', req.body);
  const { name, location } = req.body;

  try {
    await pool.query('INSERT INTO equipment(name, description) VALUES ($1, $2)', [name, location]);
    res.status(200).send({ message: `your keys were: ${name}, ${location}` });
  } catch (e) {
    res.sendStatus(500);
  }
});

// Endpoint to get all products
router.post('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying products:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get all clients
router.get('/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying clients:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get all news
router.post('/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying news:', (err as Error).message);
    res.status(500).send('Database error');
  }
});

export default router;
