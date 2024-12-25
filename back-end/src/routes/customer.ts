import { Router } from 'express';

import CustomerController from '../controllers/CustomerController';
import { validateProps } from '../utils/validation';

const router = Router();

const customerController = new CustomerController();

router.get('/products', customerController.getProducts);
router.get('/products/:id', customerController.getProductsById);
router.get('/news', customerController.getNews);
router.get('/categories', customerController.getCategories);
router.get('/categories/:category', validateProps('category'), customerController.getProductsByCategory);
router.post('/order', customerController.saveOrder);

export default router;
