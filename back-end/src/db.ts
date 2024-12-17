import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'user123',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'db123',
});

export default pool;
