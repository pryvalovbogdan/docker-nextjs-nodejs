import { Router } from 'express';

import { contactLimiter, orderLimiter } from '../configs/rateLimit.config';
import { NewsController, OrderController, ProductController } from '../controllers';
import { validateProps } from '../utils/validation';

const router = Router();

// Create an instance is internally instantiated
const newsController = new NewsController();
const orderController = new OrderController();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/offset', productController.getProductsOffset);
router.get('/products/:id', productController.getProductsById);
router.get('/news', newsController.getNews);
router.get('/categories', productController.getCategories);
router.get('/categories/:category', validateProps('category'), productController.getProductsByCategory);
router.get('/brand/:name', productController.getProductsByBrandName);
router.post('/order', orderLimiter, orderController.saveOrder);
router.post('/contact', contactLimiter, orderController.contact);

export default router;
