import { stringify } from 'csv-stringify/sync';

import { Order } from '../entities';
import { OrderRepository } from '../repositories';
import { IEmailBody } from './types';

class OrderService {
  private repository: OrderRepository = new OrderRepository();

  async getOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data?: Order[]; totalPages: number; errors: string[] }> {
    try {
      const { data, totalPages } = await this.repository.findOrders(page, limit);

      return { data, totalPages, errors: [] };
    } catch (error) {
      console.error('Error in getOrders:', error);

      return { errors: ['Failed to retrieve orders'], totalPages: 0 };
    }
  }

  async updateOrder(orderId: number, data: Partial<Order>): Promise<{ data?: Order | null; errors: string[] }> {
    try {
      const updatedOrder = await this.repository.updateOrder(orderId, data);

      return { data: updatedOrder, errors: [] };
    } catch (error) {
      console.error('Error in updateOrder:', error);

      return { errors: ['Failed to update order'] };
    }
  }

  async deleteOrder(orderId: number): Promise<{ data?: Order | null; errors: string[] }> {
    try {
      const deletedOrder = await this.repository.deleteOrder(orderId);

      return { data: deletedOrder, errors: [] };
    } catch (error) {
      console.error('Error in deleteOrder:', error);

      return { errors: ['Failed to delete order'] };
    }
  }

  async saveOrder(orderData: IEmailBody): Promise<{ errors: string[]; data?: Order }> {
    const { name, phone, productId, status = 'active', email } = orderData;

    try {
      const data = await this.repository.saveOrder({
        name,
        phone: phone,
        productId: Number(productId),
        date: new Date(),
        email,
        status,
      });

      return { errors: [], data };
    } catch (err) {
      console.error('Error saving order:', err);

      return { errors: ['Error saving order'] };
    }
  }

  async exportOrdersToCSV(): Promise<{ data: Buffer; filename: string }> {
    try {
      const orders = await this.repository.getAllOrders();

      if (!orders.length) {
        throw new Error('No orders found');
      }

      const csvData = stringify(
        orders.map(order => ({
          id: order.id,
          name: order.name,
          phone: order.phone,
          email: order.email,
          date: order.date,
          status: order.status,
          product: order.product ? order.product.title : 'N/A',
          brand: order.product?.brand || 'N/A',
          price: order.product?.price || 'N/A',
        })),
        { header: true },
      );

      return { data: Buffer.from(csvData), filename: `orders_${Date.now()}.csv` };
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw new Error('Failed to export orders');
    }
  }
}

export default OrderService;
