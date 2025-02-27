import { Router } from 'express';

import { contactLimiter, orderLimiter } from '../configs/rateLimit.config';
import { NewsController, OrderController, ProductController } from '../controllers';
import CategoryController from '../controllers/CategoryController';
import { validateProps } from '../utils/validation';

const router = Router();

// Create an instance is internally instantiated
const newsController = new NewsController();
const orderController = new OrderController();
const productController = new ProductController();
const categoryController = new CategoryController();

router.get('/products', productController.getProducts);
router.get('/products/offset', productController.getProductsOffset);
router.get('/products/last-added', productController.getLastAddedProducts);
router.get('/products/search/:query', productController.searchProducts);
router.get('/products/:id', productController.getProductsById);
router.get('/news', newsController.getNews);
router.get('/categories', productController.getCategories);
router.get('/categories/:category', validateProps('category'), productController.getProductsByCategory);
router.get('/brand/:name', productController.getProductsByBrandName);
router.post('/order', orderLimiter, orderController.saveOrder);
router.post('/contact', contactLimiter, orderController.contact);
router.get('/subcategories', categoryController.getCategoriesWithSubcategories);
router.get('/subcategories/:name', productController.getProductsBySubCategory);

export default router;
