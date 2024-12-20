import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';

const router = Router();

// Route to authenticate admin user
router.post('/login', AdminController.validate('login'), AdminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/orders', AdminController.getOrders);
router.post('/register', AdminController.validate('register'), AdminController.register);
router.post('/news', AdminController.validate('news'), AdminController.addNews);
router.post('/news/:id', AdminController.validate('news'), AdminController.updateNews);
router.post('/products', AdminController.validate('product'), AdminController.addNewProducts);
router.post('/products/:id', AdminController.validate('productId'), AdminController.updateProducts);
router.post('/orders/:id', AdminController.validate('orders'), AdminController.updateOrders);
router.delete('/products/:id', AdminController.validate('productId'), AdminController.deleteProducts);
router.delete('/orders/:id', AdminController.validate('orders'), AdminController.deleteOrders);

export default router;
