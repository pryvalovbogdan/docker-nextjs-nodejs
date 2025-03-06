import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { OrderService } from '../services';
import EmailService from '../services/EmailService';
import responseHandler from '../utils/responseHandler';

class OrderController {
  private service: OrderService = new OrderService();

  getOrders = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await this.service.getOrders(page, limit);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Orders retrieved successfully', {
      orders: result.data,
      totalPages: result.totalPages,
    });
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

  saveOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.saveOrder(req.body);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      const product = result.data?.product;

      if (!product) {
        responseHandler.sendFailResponse(res, 'Product not found');

        return;
      }

      const orderDetails = `
      <div>
        <p><strong>Номер замовлення:</strong> ${result.data?.id || 'Невідомо'}</p>
        <p><strong>Продукт:</strong> ${product.title}</p>
        ${product.brand ? `<p><strong>Бренд: ${product.brand}</strong></p>` : ''}
        ${product.country ? '<p><strong>Країна:</strong></p>' : ''}
        <p><strong>Опис:</strong> ${
          product.description
            ?.substring(0, 200)
            .replace(/<[^>]+>/g, ' ')
            .trim() || 'Невідомо'
        }</p>
        ${product.price ? `<p><strong>Ціна:</strong> ${product.price} UAH</p>` : ''}
        ${
          product.images?.length
            ? `<p><strong>Зображення:</strong></p> 
            ${product.images
              .map(img => `<img src="${img}" alt="Product Image" width="150" style="margin:5px;"/>`)
              .join('')}
            `
            : ''
        }
      </div>
    `;

      const mailResult = await EmailService.sendOrderEmail({ ...req.body, orderDetails });

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

  contact = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    console.log('req.bodreq.bod', req.body, errors);

    if (!errors.isEmpty()) {
      responseHandler.sendValidationResponse(res, errors.array());

      return;
    }

    if (!req.body.email || !req.body.message) {
      responseHandler.sendFailResponse(res, 'Email and message are required');

      return;
    }

    const mailResult = await EmailService.sendContactUsEmail(req.body);

    if (mailResult.status === 'Error') {
      responseHandler.sendFailResponse(res, 'Failed to send email');

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Request contact send successfully', {});
  };
}

export default OrderController;
