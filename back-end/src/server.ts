import express from 'express';

import router from './routes/routes';

const port = 3000;

const app = express();

//allow to use json
app.use(express.json());
app.set('trust proxy', true);

//routes
app.use('/api', router);

app.listen(port, () => console.log('Server started at port' + port));
