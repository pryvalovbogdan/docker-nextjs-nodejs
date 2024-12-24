import { Request, Response } from 'express';

import CustomerService from '../services/CustomerService';
import EmailService from '../services/EmailService';
import responseHandler from '../utils/responseHandler';

class CustomerController {
  private service: CustomerService = new CustomerService();

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getProducts();

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsOffset = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      const result = await this.service.getProductsOffset(Number(limit), offset);

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const productId = parseInt(id, 10);
      const result = await this.service.getProductById(productId);

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      } else {
        responseHandler.sendFailResponse(res, 'Product with the given ID not found');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;

    try {
      const result = await this.service.getProductsByCategory(category);

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      } else {
        responseHandler.sendFailResponse(res, 'No products found in this category');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getNews = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('this.service', this.service);
      const result = await this.service.getNews();

      responseHandler.sendSuccessResponse(res, 'News retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying news:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getCategories();

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Categories retrieved successfully', result.data);
      } else {
        responseHandler.sendFailResponse(res, 'No categories found');
      }
    } catch (err) {
      console.error('Error querying categories:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  saveOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.saveOrder(req.body);

      console.log('ressss', result);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      const mailResult = await EmailService.sendMessage(req.body);

      if (mailResult.status === 'Error') {
        responseHandler.sendFailResponse(res, 'Failed to send email');

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Order added successfully', {});
    } catch (err) {
      console.error('Error updating order:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };
}

export default CustomerController;
