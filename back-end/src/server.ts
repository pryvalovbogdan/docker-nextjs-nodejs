import cors from 'cors';
import express from 'express';
import 'reflect-metadata';

import { limiter } from './configs/rateLimit.config';
import { AppDataSource } from './configs/data-source';
import adminRouter from './routes/admin';
import customerRouter from './routes/customer';

const PORT = 3000;

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

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log('Server started at port http://localhost:' + PORT);
    });

    console.log('Data Source has been initialized!');
  })
  .catch(error => console.log(error));
