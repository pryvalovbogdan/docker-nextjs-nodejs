import { Router } from 'express';

import CustomerController from '../controllers/CustomerController';

const router = Router();

router.get('/products', CustomerController.getProducts);
router.get('/products:id', CustomerController.getProductsById);
router.get('/news', CustomerController.getNews);

export default router;
