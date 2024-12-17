const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();

//allow to use json
app.use(express.json());
app.set('trust proxy', true);

//routes
app.get('/', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM equipment');

    res.status(200).send(data.rows);
  } catch (e) {
    res.sendStatus(500);
  }
});

app.post('/', async (req, res) => {
  console.log('req.body', req.body);
  const { name, location } = req.body;

  try {
    await pool.query('INSERT INTO equipment(name, description) VALUES ($1, $2)', [name, location]);
    res.status(200).send({ message: `your keys were: ${name}, ${location}` });
  } catch (e) {
    res.sendStatus(500);
  }
});

app.get('/setup', async (req, res) => {
  try {
    await pool.query('CREATE TABLE equipment( id SERIAL PRIMARY KEY, name VARCHAR(100), description VARCHAR(1000))');
    res.status(200).send({ message: `Succsesfuly created table` });
  } catch (e) {
    res.sendStatus(500);
  }
});

// Endpoint to get all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying products:', err.message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get all clients
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying clients:', err.message);
    res.status(500).send('Database error');
  }
});

// Endpoint to get all news
app.get('/news', async (req, res) => {
  var ip2 =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

  console.log(
    'request.socket.remoteAddress',
    req.connection.remoteAddress,
    req.headers['x-forwarded-for'],
    req.socket.remoteAddress,
    req.ip,
    req.connection.socket,
  );

  try {
    const result = await pool.query('SELECT * FROM news');

    res.json(result.rows);
  } catch (err) {
    console.error('Error querying news:', err.message);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => console.log('Server started at port' + port));
