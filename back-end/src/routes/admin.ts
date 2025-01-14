import { Router } from 'express';
import multer from 'multer';

import { AdminController, NewsController, OrderController, ProductController } from '../controllers';
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

// Route to authenticate admin user
router.post('/login', validateProps('login'), adminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/orders', orderController.getOrders);
router.post('/register', validateProps('register'), adminController.register);
router.post('/products', validateProps('product'), upload.array('image', 3), productController.addProduct);
router.post('/products/:id', validateProps('productId'), productController.updateProduct);
router.delete('/products/:id', validateProps('productId'), productController.deleteProduct);
router.post('/orders/:id', validateProps('orders'), orderController.updateOrder);
router.delete('/orders/:id', validateProps('orders'), orderController.deleteOrder);
router.post('/news', validateProps('news'), newsController.addNews);
router.post('/news/:id', validateProps('news'), newsController.updateNews);

export default router;
