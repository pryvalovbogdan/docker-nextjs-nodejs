import { Request, Response } from 'express';

import { OrderService } from '../services';
import EmailService from '../services/EmailService';
import responseHandler from '../utils/responseHandler';

class OrderController {
  private service: OrderService = new OrderService();

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

  saveOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.saveOrder(req.body);

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

export default OrderController;
