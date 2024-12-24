import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';
import { validateAdminProps } from '../utils/validation';

const router = Router();

// Create an instance of AdminController (AdminService is internally instantiated)
const adminController = new AdminController();

// Route to authenticate admin user
router.post('/login', validateAdminProps('login'), adminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/orders', adminController.getOrders);
router.post('/register', validateAdminProps('register'), adminController.register);
router.post('/products', validateAdminProps('product'), adminController.addProduct);
router.post('/products/:id', validateAdminProps('productId'), adminController.updateProduct);
router.post('/orders/:id', validateAdminProps('orders'), adminController.updateOrder);
router.delete('/products/:id', validateAdminProps('productId'), adminController.deleteProduct);
router.delete('/orders/:id', validateAdminProps('orders'), adminController.deleteOrder);
router.post('/news', validateAdminProps('news'), adminController.addNews);
router.post('/news/:id', validateAdminProps('news'), adminController.updateNews);
export default router;
