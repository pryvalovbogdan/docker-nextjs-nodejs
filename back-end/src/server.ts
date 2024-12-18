import express from 'express';

import adminRouter from './routes/admin';
import customerRouter from './routes/customer';

const port = 3000;

const app = express();

//allow to use json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes
app.use('/api', customerRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => console.log('Server started at port' + port));
