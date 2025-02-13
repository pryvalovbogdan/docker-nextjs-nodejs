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
        phone: Number(phone),
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
}

export default OrderService;
