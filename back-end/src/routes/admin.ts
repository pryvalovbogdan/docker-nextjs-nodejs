import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';
import { validateAdminProps } from '../utils/validation';

const router = Router();

// Route to authenticate admin user
router.post('/login', validateAdminProps('login'), AdminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/orders', AdminController.getOrders);
router.post('/register', validateAdminProps('register'), AdminController.register);
router.post('/news', validateAdminProps('news'), AdminController.addNews);
router.post('/news/:id', validateAdminProps('news'), AdminController.updateNews);
router.post('/products', validateAdminProps('product'), AdminController.addNewProducts);
router.post('/products/:id', validateAdminProps('productId'), AdminController.updateProducts);
router.post('/orders/:id', validateAdminProps('orders'), AdminController.updateOrders);
router.delete('/products/:id', validateAdminProps('productId'), AdminController.deleteProducts);
router.delete('/orders/:id', validateAdminProps('orders'), AdminController.deleteOrders);

export default router;
