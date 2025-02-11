import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Admin, News, Order, Product } from './entities';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  port: parseInt(POSTGRES_PORT || '5432'),
  username: POSTGRES_USER || 'postgres',
  password: POSTGRES_PASSWORD || 'password',
  database: POSTGRES_DB || 'nextjsnodejsdb',
  entities: [Product, Order, News, Admin],
  migrations: [__dirname + '/migrations/*.ts', __dirname + '/migrations/*.js'],
  synchronize: false, // Always false in production
  logging: true,
} as DataSourceOptions);
