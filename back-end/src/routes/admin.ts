import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';
import { validateProps } from '../utils/validation';

const router = Router();

// Create an instance of AdminController (AdminService is internally instantiated)
const adminController = new AdminController();

// Route to authenticate admin user
router.post('/login', validateProps('login'), adminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/orders', adminController.getOrders);
router.post('/register', validateProps('register'), adminController.register);
router.post('/products', validateProps('product'), adminController.addProduct);
router.post('/products/:id', validateProps('productId'), adminController.updateProduct);
router.post('/orders/:id', validateProps('orders'), adminController.updateOrder);
router.delete('/products/:id', validateProps('productId'), adminController.deleteProduct);
router.delete('/orders/:id', validateProps('orders'), adminController.deleteOrder);
router.post('/news', validateProps('news'), adminController.addNews);
router.post('/news/:id', validateProps('news'), adminController.updateNews);
export default router;
