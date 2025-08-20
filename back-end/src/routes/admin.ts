import { Router } from 'express';
import multer from 'multer';

import {
  AdminController,
  NewsController,
  OrderController,
  ProductController,
  SubCategoryController,
} from '../controllers';
import CategoryController from '../controllers/CategoryController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';
import { validateProps } from '../utils/validation';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const adminController = new AdminController();
const newsController = new NewsController();
const orderController = new OrderController();
const productController = new ProductController();
const categoryController = new CategoryController();
const subCategoryController = new SubCategoryController();

// Route to authenticate admin user
router.post('/login', validateProps('login'), adminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.post('/categories', categoryController.createCategory);
router.post('/categories/:id', upload.array('image', 3), categoryController.updateCategory);
router.post('/subcategories', subCategoryController.createSubCategory);
router.post('/subcategories/:id', upload.array('image', 3), subCategoryController.updateSubCategory);
router.get('/orders', orderController.getOrders);
router.post('/register', validateProps('register'), adminController.register);
router.get('/products/export', productController.exportProductsCSV);
router.post('/products', validateProps('product'), upload.array('image', 3), productController.addProduct);
router.post('/products/:id', validateProps('productId'), upload.array('image', 3), productController.updateProduct);
router.delete('/products/:id', validateProps('productId'), productController.deleteProduct);
router.get('/orders/export', orderController.exportOrdersCSV);
router.post('/orders/:id', validateProps('orders'), orderController.updateOrder);
router.delete('/orders/:id', validateProps('orders'), orderController.deleteOrder);
router.post('/news', validateProps('news'), newsController.addNews);
router.post('/news/:id', validateProps('news'), newsController.updateNews);
router.get('/admins', adminController.getAdminsOffset);

export default router;
