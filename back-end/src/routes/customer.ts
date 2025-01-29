import { Router } from 'express';

import { NewsController, OrderController, ProductController } from '../controllers';
import { validateProps } from '../utils/validation';

const router = Router();

// Create an instance is internally instantiated
const newsController = new NewsController();
const orderController = new OrderController();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductsById);
router.get('/news', newsController.getNews);
router.get('/categories', productController.getCategories);
router.get('/categories/:category', validateProps('category'), productController.getProductsByCategory);
router.post('/order', orderController.saveOrder);
router.post('/contact', orderController.contact);

export default router;
