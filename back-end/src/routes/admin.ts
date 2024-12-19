import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import { validateAdminJWT } from '../middleware/jwtMiddleWare';

const router = Router();

// Route to authenticate admin user
router.post('/login', AdminController.validate('login'), AdminController.login);

// Protect all admin routes
router.use(validateAdminJWT);

router.get('/clients', AdminController.getClients);
router.post('/register', AdminController.validate('register'), AdminController.register);
router.post('/news', AdminController.validate('news'), AdminController.addNews);
router.post('/news/:id', AdminController.validate('news'), AdminController.updateNews);
router.post('/products', AdminController.validate('product'), AdminController.addNewProducts);
router.post('/products/:id', AdminController.validate('productId'), AdminController.updateProducts);
router.post('/clients/:id', AdminController.validate('clients'), AdminController.updateClients);
router.delete('/products/:id', AdminController.validate('productId'), AdminController.deleteProducts);
router.delete('/clients/:id', AdminController.validate('clients'), AdminController.deleteClients);

export default router;
