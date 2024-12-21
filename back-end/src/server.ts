import cors from 'cors';
import express from 'express';

import { limiter } from './configs/rateLimit.config';
import adminRouter from './routes/admin';
import customerRouter from './routes/customer';

const port = 3000;

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

app.listen(port, () => console.log('Server started at port' + port));
