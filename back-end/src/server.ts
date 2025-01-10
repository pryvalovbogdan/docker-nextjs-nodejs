import cors from 'cors';
import express from 'express';
import 'reflect-metadata';

import { limiter } from './configs/rateLimit.config';
import { AppDataSource } from './data-source';
import adminRouter from './routes/admin';
import customerRouter from './routes/customer';
import { AdminService } from './services';

const PORT = process.env.BACK_END_PORT;

const app = express();

app.use(cors());
// Apply rate limiting middleware to all routes
app.use(limiter);
// Allow to use json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes
app.use('/api', customerRouter);
app.use('/api/admin', adminRouter);

const adminService = new AdminService();

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, async () => {
      console.log('Server started at port http://localhost:' + PORT);
      console.log('Updated with pipeline');

      await adminService.initializePrimaryAdmin();
    });

    console.log('Data Source has been initialized!');
  })
  .catch(error => console.log(error));
