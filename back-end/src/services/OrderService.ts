import { Order } from '../entities';
import { OrderRepository } from '../repositories';
import { IEmailBody } from './types';

class OrderService {
  private repository: OrderRepository = new OrderRepository();

  async getOrders(): Promise<{ data?: Order[] | null; errors: string[] }> {
    try {
      const orders = await this.repository.findOrders();

      return { data: orders, errors: [] };
    } catch (error) {
      console.error('Error in getOrders:', error);

      return { errors: ['Failed to retrieve orders'] };
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

  async saveOrder(orderData: IEmailBody): Promise<{ errors: string[] }> {
    const { firstName, phone, lastName, productId, status = 'active' } = orderData;

    try {
      await this.repository.saveOrder({
        firstName,
        lastName,
        phone: Number(phone),
        productId: Number(productId),
        date: new Date(),
        status,
      });

      return { errors: [] };
    } catch (err) {
      console.error('Error saving order:', err);

      return { errors: ['Error saving order'] };
    }
  }
}

export default OrderService;
