import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import AdminService from '../services/AdminService';
import { encrypt } from '../utils/encrypt';
import responseHandler from '../utils/responseHandler';

class AdminController {
  private service: AdminService;

  constructor() {
    this.service = new AdminService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responseHandler.sendValidationResponse(res, errors.array());

      return;
    }

    const { username, password } = req.body;

    const result = await this.service.login(username, password);

    console.log('result', result);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      const token = encrypt.generateToken({
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
      });

      responseHandler.sendSuccessResponse(res, 'Login successful', { token });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responseHandler.sendValidationResponse(res, errors.array());

      return;
    }

    const result = await this.service.register(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Admin registered successfully', result.data);
  };

  getOrders = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.getOrders();

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Orders retrieved successfully', result.data);
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.updateOrder(Number(id), req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Order updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Order not found');
    }
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.deleteOrder(Number(id));

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Order deleted successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Order not found');
    }
  };

  addProduct = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.addProduct(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Product added successfully', result.data);
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.updateProduct(Number(id), req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.deleteProduct(Number(id));

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product deleted successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  addNews = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.addNews(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'News added successfully', result.data);
  };

  updateNews = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.updateNews(Number(id), req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'News updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'News not found');
    }
  };
}

export default AdminController;
